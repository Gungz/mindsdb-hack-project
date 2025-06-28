import { Hackathon, HackathonSource } from '../types/hackathon';

export const mockHackathons: Hackathon[] = [
  {
    id: '1',
    title: 'AI for Good Global Challenge',
    description: `# Transform the World with AI

Join thousands of developers, designers, and innovators in creating AI solutions that address real-world problems. This hackathon focuses on:

## Key Areas
- **Healthcare Innovation**: Develop AI tools for medical diagnosis and treatment
- **Climate Action**: Create solutions for environmental monitoring and sustainability
- **Education Technology**: Build AI-powered learning platforms
- **Social Impact**: Design inclusive technology for underrepresented communities

## What You'll Get
- Access to cutting-edge AI APIs and tools
- Mentorship from industry experts
- Networking opportunities with top tech companies
- Cash prizes and internship opportunities

*Let's build a better future together!*`,
    totalPrize: '$100,000',
    startDate: '2024-02-15',
    endDate: '2024-02-18',
    registrationUrl: 'https://devpost.com/ai-for-good-2024',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Tech for Good Foundation',
    location: 'San Francisco, CA',
    type: 'hybrid',
    tags: ['AI', 'Machine Learning', 'Social Impact', 'Healthcare'],
    status: 'upcoming',
    participants: 2847,
    maxParticipants: 5000
  },
  {
    id: '2',
    title: 'FinTech Revolution 2024',
    description: `# Revolutionize Financial Services

## Challenge Overview
Create innovative financial technology solutions that democratize access to financial services and improve financial literacy worldwide.

### Focus Areas:
- **Digital Banking**: Next-generation banking experiences
- **Cryptocurrency & Blockchain**: Decentralized finance solutions
- **Payment Systems**: Seamless and secure payment innovations
- **Financial Education**: Tools to improve financial literacy

### Resources Provided:
- API access to major financial data providers
- Blockchain development environments
- Expert mentors from leading FinTech companies
- Legal and compliance guidance

**Prize Pool**: $75,000 across multiple categories`,
    totalPrize: '$75,000',
    startDate: '2024-03-01',
    endDate: '2024-03-03',
    registrationUrl: 'https://devpost.com/fintech-revolution-2024',
    imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'FinTech Alliance',
    location: 'New York, NY',
    type: 'in-person',
    tags: ['FinTech', 'Blockchain', 'Payments', 'Cryptocurrency'],
    status: 'upcoming',
    participants: 1234,
    maxParticipants: 2000
  },
  {
    id: '3',
    title: 'Sustainable Cities Hackathon',
    description: `# Building Tomorrow's Cities

## Mission
Design technology solutions that make cities more sustainable, livable, and resilient for future generations.

### Challenge Categories:
1. **Smart Transportation**: Reduce traffic and emissions
2. **Energy Efficiency**: Optimize urban energy consumption
3. **Waste Management**: Innovative recycling and waste reduction
4. **Green Spaces**: Technology for urban agriculture and parks
5. **Community Engagement**: Platforms for citizen participation

### Special Features:
- Partnership with major city governments
- Real urban datasets for testing solutions
- Deployment opportunities for winning projects
- Sustainability impact measurement tools

*Create solutions that cities actually want to implement!*`,
    totalPrize: '$50,000',
    startDate: '2024-01-20',
    endDate: '2024-01-22',
    registrationUrl: 'https://devfolio.co/sustainable-cities-2024',
    imageUrl: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Urban Innovation Lab',
    location: 'Online',
    type: 'online',
    tags: ['Sustainability', 'Smart Cities', 'IoT', 'Environment'],
    status: 'ongoing',
    participants: 892,
    maxParticipants: 1500
  },
  {
    id: '4',
    title: 'Healthcare Tech Innovation',
    description: `# Transforming Healthcare Through Technology

Join us in creating breakthrough healthcare solutions that improve patient outcomes and accessibility.

## Focus Areas:
- **Telemedicine**: Remote healthcare delivery
- **Medical AI**: Diagnostic and treatment assistance
- **Health Monitoring**: Wearable and IoT devices
- **Patient Experience**: User-friendly healthcare interfaces

## Benefits:
- Access to anonymized medical datasets
- Mentorship from healthcare professionals
- Regulatory guidance for medical devices
- Partnership opportunities with hospitals`,
    totalPrize: '$80,000',
    startDate: '2024-04-10',
    endDate: '2024-04-12',
    registrationUrl: 'https://hackathon.io/healthcare-tech-2024',
    imageUrl: 'https://images.pexels.com/photos/3985170/pexels-photo-3985170.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'HealthTech Consortium',
    location: 'Boston, MA',
    type: 'hybrid',
    tags: ['Healthcare', 'Medical AI', 'Telemedicine', 'IoT'],
    status: 'upcoming',
    participants: 567,
    maxParticipants: 1000
  },
  {
    id: '5',
    title: 'Gaming & VR Experience Challenge',
    description: `# Create Immersive Gaming Experiences

## Challenge Brief
Develop cutting-edge gaming and virtual reality experiences that push the boundaries of interactive entertainment.

### Categories:
- **VR/AR Games**: Immersive virtual experiences
- **Mobile Gaming**: Innovative mobile game mechanics
- **Educational Games**: Learning through play
- **Accessibility Gaming**: Games for players with disabilities

### Resources:
- VR/AR development kits
- Game engine licenses
- Sound and visual assets library
- Playtesting with focus groups`,
    totalPrize: '$60,000',
    startDate: '2024-05-15',
    endDate: '2024-05-17',
    registrationUrl: 'https://topcoder.com/gaming-vr-challenge-2024',
    imageUrl: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Game Developers United',
    location: 'Los Angeles, CA',
    type: 'in-person',
    tags: ['Gaming', 'VR', 'AR', 'Entertainment'],
    status: 'upcoming',
    participants: 445,
    maxParticipants: 800
  }
];

export const mockSources: HackathonSource[] = [
  {
    id: '1',
    name: 'Devpost - Major Hackathons',
    url: 'https://devpost.com/api/hackathons',
    provider: 'devpost',
    isActive: true,
    lastFetched: '2024-01-15T10:30:00Z',
    hackathonsCount: 234
  },
  {
    id: '2',
    name: 'TopCoder Challenges',
    url: 'https://api.topcoder.com/v2/challenges',
    provider: 'topcoder',
    isActive: true,
    lastFetched: '2024-01-15T09:15:00Z',
    hackathonsCount: 156
  },
  {
    id: '3',
    name: 'Devfolio Events',
    url: 'https://devfolio.co/api/hackathons',
    provider: 'devfolio',
    isActive: true,
    lastFetched: '2024-01-14T16:45:00Z',
    hackathonsCount: 89
  },
  {
    id: '4',
    name: 'Hackathon.io Feed',
    url: 'https://hackathon.io/api/events',
    provider: 'hackathon.io',
    isActive: false,
    lastFetched: '2024-01-10T14:20:00Z',
    hackathonsCount: 67
  }
];