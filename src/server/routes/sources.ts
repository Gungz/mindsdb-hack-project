import { Request, Response } from 'express';
import { SourceAPI } from '../../api/sources';

export async function getSources(req: Request, res: Response) {
  try {
    const sources = await SourceAPI.getAllSources();
    res.json(sources);
  } catch (error) {
    console.error('Error in getSources:', error);
    res.status(500).json({ error: 'Failed to fetch sources' });
  }
}

export async function createSource(req: Request, res: Response) {
  try {
    const source = await SourceAPI.createSource(req.body);
    res.status(201).json(source);
  } catch (error) {
    console.error('Error in createSource:', error);
    res.status(500).json({ error: 'Failed to create source' });
  }
}

export async function updateSource(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await SourceAPI.updateSource(id, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in updateSource:', error);
    res.status(500).json({ error: 'Failed to update source' });
  }
}

export async function deleteSource(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await SourceAPI.deleteSource(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in deleteSource:', error);
    res.status(500).json({ error: 'Failed to delete source' });
  }
}

export async function fetchFromSource(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await SourceAPI.fetchFromSource(id);
    res.json(result);
  } catch (error) {
    console.error('Error in fetchFromSource:', error);
    res.status(500).json({ error: 'Failed to fetch from source' });
  }
}