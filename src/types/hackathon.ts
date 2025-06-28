export interface Hackathon {
  id: string;
  title: string;
  description: string;
  totalPrize: string;
  startDate: string;
  endDate: string;
  registrationUrl: string;
  imageUrl?: string;
  organizer: string;
  location: string;
  type: 'online' | 'hybrid' | 'in-person';
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'ended' | 'active' | 'open';
  participants?: number;
  maxParticipants?: number;
}

export interface HackathonSource {
  id: string | undefined;
  name: string;
  url: string;
  provider: 'devpost' | 'topcoder' | 'devfolio' | 'hackathon.io' | 'other';
  isActive: boolean;
  lastFetched?: string;
  hackathonsCount: number;
}