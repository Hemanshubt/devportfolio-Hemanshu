/**
 * Server-Side GitHub GraphQL Proxy
 *
 * Security hardening applied:
 *  [CRITICAL] CORS — unknown origins now rejected with 403 (no silent fallback)
 *  [HIGH]     Username restricted to the portfolio owner only (Hemanshubt)
 *  [HIGH]     GraphQL errors no longer forwarded raw to the client
 *  [MODERATE] AbortController timeout (10 s) on upstream fetch
 *  [MODERATE] Vary: Origin header for correct CDN caching
 *  [MINOR]    Year range tightened to realistic bounds
 */

import { applyCors } from './cors.js';

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';

// Restrict this proxy to the portfolio owner's account only.
// This endpoint is not a general-purpose GitHub proxy.
const ALLOWED_USERNAME = 'Hemanshubt';

const UPSTREAM_TIMEOUT_MS = 10_000;

const GET_USER_CONTRIBUTIONS_QUERY = `
  query($userName: String!, $from: DateTime, $to: DateTime) {
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

export default async function handler(req, res) {
  if (!applyCors(req, res, 'POST')) return;

  const { GITHUB_TOKEN } = process.env;
  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub service not configured' });
  }

  // ── Input validation ───────────────────────────────────────────────
  const body = req.body || {};
  const { username, year } = body;

  // Only the portfolio owner's username is accepted
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  if (username !== ALLOWED_USERNAME) {
    return res.status(403).json({ error: 'Username not permitted' });
  }

  // Year is optional; if provided, validate range
  let from;
  let to;
  const currentYear = new Date().getFullYear();
  if (year !== undefined) {
    if (typeof year !== 'number' || !Number.isInteger(year) || year < 2008 || year > currentYear) {
      return res.status(400).json({ error: 'Invalid year' });
    }
    from = `${year}-01-01T00:00:00Z`;
    to   = `${year}-12-31T23:59:59Z`;
  }

  // ── Upstream request ───────────────────────────────────────────────
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'User-Agent': 'devportfolio-app',
      },
      signal: controller.signal,
      body: JSON.stringify({
        query: GET_USER_CONTRIBUTIONS_QUERY,
        variables: { userName: username, from, to },
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[github-proxy] Upstream error: HTTP ${response.status}`);
      return res.status(502).json({ error: 'Failed to fetch data from GitHub' });
    }

    const result = await response.json();

    if (result.errors) {
      // Log details server-side; never send raw GraphQL errors to the client
      console.error('[github-proxy] GraphQL errors:', JSON.stringify(result.errors));
      return res.status(502).json({ error: 'Failed to fetch contribution data' });
    }

    const calendar =
      result.data?.user?.contributionsCollection?.contributionCalendar || null;

    return res.status(200).json({ data: calendar });
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error(`[github-proxy] Request timed out after ${UPSTREAM_TIMEOUT_MS}ms`);
      return res.status(504).json({ error: 'GitHub request timed out' });
    }
    console.error('[github-proxy] Fetch error:', error?.message);
    return res.status(500).json({ error: 'Service temporarily unavailable' });
  }
}
