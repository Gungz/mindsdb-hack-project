import { closeDBConnection, getDBConnection, getMindsDBConnection, closeMindsDBConnection } from './database';
import { Hackathon } from '../types/hackathon';
import { parseHackathons } from './processor/topcoderHackathon';
import { parseHackathons as parseDevpostHackathons } from './processor/devpostHackathon';
import { parseHackathons as parseQuiraHackathons } from './processor/quiraHackathon';
import { fetchHackathonData } from './fetcher';
import { getTodayDate, jsonToWhereClause, parseJsonFromMarkdown } from '../utils/stringUtils';

export interface HackathonFilters {
  search?: string;
  status?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export class HackathonAPI {
  static async getAllHackathons(filters: HackathonFilters = {}): Promise<{ hackathons: Hackathon[], total: number }> {
    try {
      const db = await getMindsDBConnection();
      
      let query = `
        SELECT h.*
        FROM mysql_datasource.hackathon.hackathons h
        WHERE 1=1
      `;
      
      const params: any[] = [];
      
      // Add search filter
      if (filters.search) {
        query += ` AND (h.title LIKE ? OR h.description LIKE ? OR JSON_SEARCH(h.tags, 'one', ?) IS NOT NULL)`;
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, `%${filters.search}%`);
      }
      
      // Add status filter
      if (filters.status) {
        if (filters.status == "ongoing") {
          query += ` AND (h.status = ? OR h.status = ? OR h.status = ?)`;
          params.push(filters.status, "active", "open");
        } else {
          query += ` AND h.status = ?`;
          params.push(filters.status);
        }
      } 
      // Add type filter
      if (filters.type) {
        query += ` AND h.type = ?`;
        params.push(filters.type);
      }

      query += ` AND h.end_date >= NOW()`;
      
      // Add ordering
      query += ` ORDER BY h.start_date ASC, h.created_at DESC`;
      
      // Add pagination
      if (filters.limit) {
        query += ` LIMIT ?`;
        params.push(filters.limit);
        
        if (filters.offset) {
          query += ` OFFSET ?`;
          params.push(filters.offset);
        }
      }
      
      const [rows] = await db.query(query, params);
      const hackathons = (rows as any[]).map(this.transformDBRowToHackathon);
      
      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total
        FROM mysql_datasource.hackathon.hackathons h
        WHERE 1=1
      `;
      
      const countParams: any[] = [];
      
      if (filters.search) {
        countQuery += ` AND (h.title LIKE ? OR h.description LIKE ? OR JSON_SEARCH(h.tags, 'one', ?) IS NOT NULL)`;
        const searchTerm = `%${filters.search}%`;
        countParams.push(searchTerm, searchTerm, `%${filters.search}%`);
      }
      
      if (filters.status) {
        if (filters.status == "ongoing") {
          countQuery += ` AND (h.status = ? OR h.status = ? OR h.status = ?)`;
          countParams.push(filters.status, "active", "open");
        } else {
          countQuery += ` AND h.status = ?`;
          countParams.push(filters.status);
        }
      }
      
      if (filters.type) {
        countQuery += ` AND h.type = ?`;
        countParams.push(filters.type);
      }

      countQuery += ` AND h.end_date >= NOW()`;
      
      const [countResult] = await db.query(countQuery, countParams);
      const total = (countResult as any[])[0].total;
      
      return { hackathons, total };
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      throw new Error('Failed to fetch hackathons');
    } 
  }
  
  static async getHackathonById(id: string): Promise<Hackathon | null> {
    try {
      const db = await getMindsDBConnection();
      
      const query = `
        SELECT h.*
        FROM mysql_datasource.hackathon.hackathons h
        WHERE h.external_id = ?
      `;
      
      const [rows] = await db.query(query, [id]);
      const hackathons = rows as any[];
      
      if (hackathons.length === 0) {
        return null;
      }
      
      return this.transformDBRowToHackathon(hackathons[0]);
    } catch (error) {
      console.error('Error fetching hackathon by ID:', error);
      throw new Error('Failed to fetch hackathon details');
    }
  }
  
  static async getHackathonStats() {
    try {
      const db = await getMindsDBConnection();
      
      const statsQuery = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'upcoming' THEN 1 ELSE 0 END) as upcoming,
          SUM(CASE WHEN status = 'ongoing' OR status = 'active' OR status = 'open' THEN 1 ELSE 0 END) as ongoing,
          SUM(CASE WHEN status = 'ended' THEN 1 ELSE 0 END) as ended
        FROM mysql_datasource.hackathon.hackathons
      `;
      
      const [statsResult] = await db.query(statsQuery);
      const stats = (statsResult as any[])[0];
      console.log(stats);
      
      // Calculate total prize (this is a simplified calculation)
      const prizeQuery = `
        SELECT total_prize
        FROM mysql_datasource.hackathon.hackathons
        WHERE total_prize IS NOT NULL AND total_prize != ''
      `;
      
      const [prizeResult] = await db.query(prizeQuery);
      const prizes = prizeResult as any[];
      
      // Simple prize calculation (extract numbers from prize strings)
      let totalPrizeAmount = 0;
      prizes.forEach(row => {
        const prizeStr = row.total_prize;
        const matches = prizeStr.match(/\$?([\d,]+)/);
        if (matches) {
          totalPrizeAmount += parseInt(matches[1].replace(/,/g, ''));
        }
      });
      
      return {
        total: stats.total,
        upcoming: stats.upcoming,
        ongoing: stats.ongoing,
        ended: stats.ended,
        totalPrize: `$${totalPrizeAmount.toLocaleString()}`
      };
    } catch (error) {
      console.error('Error fetching hackathon stats:', error);
      throw new Error('Failed to fetch hackathon statistics');
    }
  }
  
  private static transformDBRowToHackathon(row: any): Hackathon {
    return {
      id: row.external_id.toString(),
      title: row.title,
      description: row.description || '',
      totalPrize: row.total_prize || '',
      startDate: row.start_date,
      endDate: row.end_date,
      registrationUrl: row.registration_url || '',
      imageUrl: row.image_url,
      organizer: row.organizer || '',
      location: row.location || '',
      type: row.type || 'online',
      tags: row.tags ? row.tags : [],
      status: row.status || 'upcoming'
    };
  }

  static async fetchAndStoreHackathons(url: string, sourceName: string) {
    const jsonData = await fetchHackathonData(url);
    if (jsonData.length === 0) return 0;
  
    let hackathons: Hackathon[] = [];
    if (sourceName == "topcoder") {
      hackathons = await parseHackathons(jsonData);
    } else if (sourceName == "devpost") {
      hackathons = await parseDevpostHackathons(jsonData);
    } else if (sourceName == "quira") {
      hackathons = parseQuiraHackathons(jsonData);
    }

    const connection = await getDBConnection();
    let processedHackathonCount = 0;
  
    try {
      for (const hackathon of hackathons) {
        const [existing] = await connection.query(
          "SELECT external_id FROM hackathons WHERE external_id = '" + hackathon.id + "' AND source_name = '" + sourceName + "'"
        );
  
        if ((existing as any[]).length > 0) {
          console.log(`Hackathon with ID ${hackathon.id} from ${sourceName} already exists. Skipping.`);
          continue;
        }
  
        console.log(hackathon);
        await connection.execute(
          'INSERT INTO hackathons (external_id, title, description, total_prize, start_date, end_date, registration_url, image_url, organizer, location, type, tags, status, source_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
          [
            hackathon.id,
            hackathon.title,
            hackathon.description,
            hackathon.totalPrize,
            hackathon.startDate,
            hackathon.endDate,
            hackathon.registrationUrl,
            hackathon.imageUrl,
            hackathon.organizer,
            hackathon.location,
            hackathon.type,
            JSON.stringify(hackathon.tags), // Store tags as JSON
            hackathon.status,
            sourceName
          ]
        );
        console.log(`Inserted hackathon: ${hackathon.title} from ${sourceName}`);
        processedHackathonCount++;
      }
      return processedHackathonCount;
    } catch (error) {
      console.error('Error inserting hackathons:', error);
    } 
  }

  static async chatWithBot(message: string, conversationHistory: Array<{role: string, content: string}> = []): Promise<string> {
    try {
      const db = await getMindsDBConnection();
      
      const lowerMessage = message.toLowerCase();
      
      const metadataQuery = `SELECT metadata from metadata_generation_model where question = ? and today = ?`;
      const [rows] = await db.query(metadataQuery, [message, getTodayDate()]);
      const results = rows as any[];
      let metadata = {};

      if (results.length > 0 && results[0].metadata) {
        metadata = parseJsonFromMarkdown(results[0].metadata);
      }
      console.log(metadata);
      
      const {whereClause, params} = jsonToWhereClause(metadata, "AND");
      params.push(message);
      const kbQuery = `SELECT * from hack_kb WHERE ` + whereClause + ` content LIKE ? LIMIT 7`;
      console.log(kbQuery);
      const [kbRows] = await db.query(kbQuery, params);
      
      if ((kbRows as any[]).length > 0) {
        const hackathonsList = (kbRows as any[]).map((h: any) => ({
          metadata: h.metadata,
          content: h.chunk_content,
          id: h.id
        }));
      
        const chatQuery = `SELECT response from chat_generation_model WHERE information = ? and question = ? and today = ?`;
        const [responseRows] = await db.query(chatQuery, [JSON.stringify(hackathonsList), message, getTodayDate()]);
        const response = (responseRows as any[])[0].response;        

        return `${response}\n\nAnything else you want to ask ?`;
      }
      // Default response for general questions
      return `I can't find any hackathon based on your questions, please ask another question.`;
      
    } catch (error) {
      console.error('Error in chatbot:', error);
      return 'Sorry, I\'m having trouble accessing the hackathon database right now. Please try again later.';
    }
  }
  
}