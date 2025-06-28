import { Hackathon } from '../../types/hackathon';

export function parseHackathons(jsonData: any): Hackathon[] {
  if (!jsonData || !jsonData.active_quests || !Array.isArray(jsonData.active_quests)) {
    console.error('Invalid Quira JSON data:', jsonData);
    return [];
  }

  return jsonData.active_quests.map((item: any) => {
    const startDate = item.creator_quest_started_at ? new Date(item.creator_quest_started_at) : null;
    const endDate = item.creator_quest_ends_at ? new Date(item.creator_quest_ends_at) : null;

    const hackathon: Hackathon = {
      id: 'quira-' + item.creator_quest_id,
      title: item.creator_quest_name,
      description: item.creator_quest_name,
      totalPrize: item.reward_amount ? item.reward_amount.toString() : '0',
      startDate: startDate ? parseDateForDB(startDate.toISOString()) : '',
      endDate: endDate ? parseDateForDB(endDate.toISOString()) : '',
      imageUrl: item.badge_url ? `https://quira.sh${item.badge_url}` : '',
      registrationUrl: `https://quira.sh/quests/creator/submissions?questId=${item.creator_quest_id}`,
      organizer: 'Quira', // Assuming organizer is Quira
      location: 'Online', // Assuming all Quira quests are online
      type: 'online',
      tags: [item.type_label], // Using type_label as a tag
      status: 'ongoing' // Assuming active_quests are active
    };
    return hackathon;
  });
}

function parseDateForDB(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}
