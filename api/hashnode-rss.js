import fs from 'fs';
import path from 'path';

const RSS_URL = 'https://hemanshubtc.hashnode.dev/rss.xml';

const ALLOWED_ORIGINS = [
  'https://hemanshudev.cloud',
  'https://www.hemanshudev.cloud',
  'http://localhost:8080',
  'http://localhost:5173',
];

function getCorsOrigin(req) {
  const origin = req.headers?.origin || '';
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

export default async function handler(req, res) {
  const origin = getCorsOrigin(req);
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const fallbackPath = path.join(process.cwd(), 'data', 'hashnode-rss-fallback.xml');

  const serveFallback = (reason) => {
    console.warn(`[hashnode-rss-serverless] ${reason}. Serving local fallback...`);
    try {
      if (fs.existsSync(fallbackPath)) {
        const fallbackXml = fs.readFileSync(fallbackPath, 'utf-8');
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        return res.status(200).send(fallbackXml);
      }
    } catch (err) {
      console.error('[hashnode-rss-serverless] Failed to read fallback file:', err);
    }
    return res.status(503).json({ error: 'RSS feed unavailable', reason });
  };

  try {
    const response = await fetch(RSS_URL, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const contentType = response.headers.get('content-type') ?? '';

    if (!response.ok || contentType.includes('text/html')) {
      console.warn('[hashnode-rss-serverless] Remote fetch failed. Status:', response.status, 'Content-Type:', contentType);
      return serveFallback(`Remote returned status ${response.status}`);
    }

    const xml = await response.text();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('[hashnode-rss-serverless] Fetch error:', error);
    return serveFallback('Network fetch error');
  }
}
