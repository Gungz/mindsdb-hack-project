import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { getHackathons, getHackathon, getHackathonStats, fetchAndStoreHackathons, chatWithBot } from './routes/hackathons';
import { getSources, createSource, updateSource, deleteSource, fetchFromSource } from './routes/sources';

import path from 'path';



const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from Vite build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Hackathon routes
app.get('/api/hackathons', getHackathons);
app.get('/api/hackathons/stats', getHackathonStats);
app.get('/api/hackathons/:id', getHackathon);
app.post('/api/hackathons/fetch', fetchAndStoreHackathons);
app.post('/api/chatbot', chatWithBot);

// Source routes (admin)
app.get('/api/sources', getSources);
app.post('/api/sources', createSource);
app.put('/api/sources/:id', updateSource);
app.delete('/api/sources/:id', deleteSource);
app.post('/api/sources/:id/fetch', fetchFromSource);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});

export default app;