import { Request, Response } from 'express';
import { HackathonAPI } from '../../api/hackathons';

export async function getHackathons(req: Request, res: Response) {
  try {
    const filters = {
      search: req.query.search as string,
      status: req.query.status as string,
      type: req.query.type as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await HackathonAPI.getAllHackathons(filters);
    res.json(result);
  } catch (error) {
    console.error('Error in getHackathons:', error);
    res.status(500).json({ error: 'Failed to fetch hackathons' });
  }
}

export async function getHackathon(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const hackathon = await HackathonAPI.getHackathonById(id);
    
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }
    
    res.json(hackathon);
  } catch (error) {
    console.error('Error in getHackathon:', error);
    res.status(500).json({ error: 'Failed to fetch hackathon' });
  }
}

export async function getHackathonStats(req: Request, res: Response) {
  try {
    const stats = await HackathonAPI.getHackathonStats();
    res.json(stats);
  } catch (error) {
    console.error('Error in getHackathonStats:', error);
    res.status(500).json({ error: 'Failed to fetch hackathon statistics' });
  }
}

export async function fetchAndStoreHackathons(req: Request, res: Response) {
  try {
    const { url, sourceName } = req.body;
    if (!url || !sourceName) {
      return res.status(400).json({ error: 'URL and sourceName are required' });
    }
    await HackathonAPI.fetchAndStoreHackathons(url, sourceName);
    res.status(200).json({ message: 'Hackathons fetched and stored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch and store hackathons' });
  }
}

export async function chatWithBot(req: Request, res: Response) {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await HackathonAPI.chatWithBot(message, conversationHistory);
    res.json({ response });
  } catch (error) {
    console.error('Error in chatWithBot:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
}