import { Hackathon } from '../../types/hackathon'; // Assuming the interface is in the same directory
import { parseJsonArrayFromMarkdown } from '../../utils/stringUtils';
import { getMindsDBConnection } from '../database';

export function parseHackathons(jsonData: any[]): Promise<Hackathon[]> {
  return Promise.all(jsonData.map(async item => {
    const hackathon: Hackathon = {
      id: 'tc-' + item.id,
      title: item.name,
      description: item.description,
      totalPrize: item.overview?.totalPrizes?.toString() || '0', // Handle potential undefined
      startDate: parseDateForDB(item.startDate),
      endDate: parseDateForDB(item.endDate),
      imageUrl: '',
      registrationUrl: `https://topcoder.com/challenges/${item.id}`,
      organizer: 'Topcoder', // Assuming Topcoder is the organizer, needs a source if different
      location: 'Online', // Assuming online, needs a source if different
      type: 'online', // Assuming online, needs logic to determine hybrid/in-person if applicable
      tags: item.tags.length > 0 ? item.tags : await fetchTags(item.description),
      status: item.status.toLowerCase() // Convert to lowercase to match the type
    };
    return hackathon;
  }));
}

async function fetchTags(description: string): Promise<string[]> {
  let tags: string[] = [];
  try {
    const connection = await getMindsDBConnection();
  
    const query = "SELECT tag FROM tag_generation_model where description = ?";
    const [rows] = await connection.query(query, [description]);
    if (Array.isArray(rows) && rows.length > 0 && rows[0] != null && typeof rows[0] === 'object' && 'tag' in rows[0]) {
      const tagStr = rows[0].tag;
      tags = parseJsonArrayFromMarkdown(tagStr);
      //console.log(tags);
    }
  } catch (error) {
    console.error('Error fetching description from MindsDB:', error);
  } 
  return tags;
}

// Example usage (assuming the JSON data is in a variable called 'data')
// const hackathons: Hackathon[] = parseHackathons(data);
// console.log(hackathons);

function parseDateForDB(dateString: string): string {
  const date = new Date(dateString); // Parse the string to a Date object
  return date.toISOString().split('T')[0];
}