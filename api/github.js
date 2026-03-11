/**
 * Server-Side GitHub GraphQL Proxy
 * Keeps GITHUB_TOKEN on the server, never exposed to client.
 */

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

const GET_USER_CONTRIBUTIONS_QUERY = `
  query($userName:String!, $from:DateTime, $to:DateTime) {
    user(login: $userName) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
    }
  }
`;

// Simple origin validation
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { GITHUB_TOKEN } = process.env;
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured on server' });
  }

  const { username, year } = req.body || {};

  if (!username || typeof username !== 'string' || username.length > 39) {
    return res.status(400).json({ error: 'Invalid username' });
  }

  // Sanitize: GitHub usernames only allow alphanumeric and hyphens
  if (!/^[a-zA-Z0-9-]+$/.test(username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }

  let from = undefined;
  let to = undefined;

  if (year && typeof year === 'number' && year >= 2008 && year <= 2030) {
    from = `${year}-01-01T00:00:00Z`;
    to = `${year}-12-31T23:59:59Z`;
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: GET_USER_CONTRIBUTIONS_QUERY,
        variables: { userName: username, from, to },
      }),
    });

    if (!response.ok) {
      return res.status(502).json({ error: `GitHub API error: ${response.status}` });
    }

    const result = await response.json();

    if (result.errors) {
      return res.status(502).json({ error: 'GitHub GraphQL error', details: result.errors });
    }

    const calendar = result.data?.user?.contributionsCollection?.contributionCalendar || null;
    return res.status(200).json({ data: calendar });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
}
