import { Hackathon } from '../../types/hackathon';
import { closeMindsDBConnection, getMindsDBConnection } from '../database';

export async function parseHackathons(jsonData: any): Promise<Hackathon[]> {
  if (!jsonData || !jsonData.hackathons || !Array.isArray(jsonData.hackathons)) {
    console.error('Invalid Devpost JSON data:', jsonData);
    return [];
  }

  return Promise.all(jsonData.hackathons.map(async (item: any) => {
    const submission_period_dates = addMonthToSecondDate(item.submission_period_dates);
    const startDate = parseDateFromSubmissionPeriod(submission_period_dates, 0);
    const endDate = parseDateFromSubmissionPeriod(submission_period_dates, 1);

    const generatedDescription = await fetchDescription(item.url);
    const hackathon: Hackathon = {
      id: 'dp-' + item.id,
      title: item.title,
      description: generatedDescription,
      totalPrize: extractPrizeAmount(item.prize_amount),
      startDate: startDate ? parseDateForDB(startDate.toISOString()) : '',
      endDate: endDate ? parseDateForDB(endDate.toISOString()) : '',
      imageUrl: item.thumbnail_url ? 'https:' + item.thumbnail_url : '', // Ensure https
      registrationUrl: item.url,
      organizer: item.organization_name,
      location: item.displayed_location?.location || 'Online',
      type: item.displayed_location?.location?.toLowerCase() === 'online' ? 'online' : 'in-person', // Assuming if not 'Online' it's in-person
      tags: item.themes ? item.themes.map((theme: any) => theme.name) : await fetchTags(generatedDescription),
      status: item.open_state // Assuming open_state maps to status directly, might need adjustments
    };
    return hackathon;
  }));
}

function extractPrizeAmount(prizeAmountString: string): string {
  const match = prizeAmountString.match(/<span data-currency-value>(.*?)<\/span>/);
  return match ? match[1].replace(/,/g, '') : '0';
}

function parseDateFromSubmissionPeriod(submissionPeriod: string, index: number): Date | null {
    if (!submissionPeriod) return null;
    try {
        // Extract the year from the submission period string
        const yearMatch = submissionPeriod.match(/(?:,\s)?(\d{4})$/);
        if (!yearMatch) {
            console.error('Could not extract year from submission period:', submissionPeriod);
            return null;
        }
        const year = parseInt(yearMatch[1], 10);
      
        const dates = submissionPeriod.substring(0, submissionPeriod.lastIndexOf(',')).split(' - ');
        if (dates.length !== 2 || index >= dates.length) return null;
      
        return new Date(dates[index] + ', ' + year);
    } catch (error: any) {
        console.error('Error parsing date:', submissionPeriod, error.message);
        return null;
    }
}

function addMonthToSecondDate(dateRange: string): string {
    const parts = dateRange.split(" - ");
    if (parts.length !== 2) {
      return dateRange; // Invalid format, return as is
    }
  
    const [startDate, endDate] = parts;
    const startMonth = startDate.split(" ")[0];
    const endParts = endDate.split(" ");
  
    if (endParts.length > 1 && endParts[0].match(/^[A-Za-z]{3}$/)) {
      return dateRange; // End date already has a month, return as is
    } else {
      return `${startDate} - ${startMonth} ${endDate}`;
    }
}

async function fetchDescription(url: string): Promise<string> {
    let description = '';
    try {
      const connection = await getMindsDBConnection();
    
      const query = `SELECT answer FROM hack_description_agent WHERE question = 'Fetch description from ${url}'`;
      const [rows] = await connection.query(query);
      if (Array.isArray(rows) && rows.length > 0 && rows[0] != null && typeof rows[0] === 'object' && 'answer' in rows[0]) {
        description = String(rows[0].answer);
      }
    } catch (error) {
      console.error('Error fetching description from MindsDB:', error);
    } 
    return description;
}

async function fetchTags(description: string): Promise<string> {
  let tags = [];
  try {
    const connection = await getMindsDBConnection();
  
    const query = "SELECT tag FROM tag_generation_model where description = ?";
    const [rows] = await connection.query(query, [description]);
    if (Array.isArray(rows) && rows.length > 0 && rows[0] != null && typeof rows[0] === 'object' && 'tag' in rows[0]) {
      tags = rows[0].tag;
    }
  } catch (error) {
    console.error('Error fetching description from MindsDB:', error);
  } 
  return tags;
}

function parseDateForDB(dateString: string): string {
    const date = new Date(dateString); // Parse the string to a Date object
    return date.toISOString().split('T')[0];
}