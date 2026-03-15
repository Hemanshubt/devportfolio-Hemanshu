import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import contactHandler from './contact.js';
import geminiHandler from './gemini.js';

// Load .env from root directory
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Wrap the Vercel handler for Express
app.all('/api/contact', async (req, res) => {
  try {
    await contactHandler(req, res);
  } catch (error) {
    console.error('Contact Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.all('/api/gemini', async (req, res) => {
  try {
    await geminiHandler(req, res);
  } catch (error) {
    console.error('Gemini Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
