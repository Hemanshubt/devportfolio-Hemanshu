/**
 * Server-Side GitHub REST API Proxy for repo stats (stars, forks).
 * Keeps GITHUB_TOKEN on the server, never exposed to client.
 */

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

  const { GITHUB_TOKEN } = process.env;

  const owner = 'Hemanshubt';
  const repo = 'devportfolio-Hemanshu';

  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'devportfolio-app',
    };
    // Use token if available (avoids rate limits), still works without
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });

    if (!response.ok) {
      return res.status(502).json({ error: `GitHub API error: ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json({
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch repo stats' });
  }
}
