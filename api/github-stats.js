/**
 * Server-Side GitHub REST API Proxy — repo stats (stars, forks).
 *
 * Security hardening applied:
 *  [CRITICAL] CORS — unknown origins rejected with 403 (no silent fallback)
 *  [HIGH]     Endpoint is hard-coded to Hemanshubt/devportfolio-Hemanshu only
 *  [MODERATE] AbortController timeout (8 s) on upstream fetch
 *  [MODERATE] Vary: Origin header for correct CDN caching
 *  [MODERATE] In-process cache — avoids hammering GitHub on every page load
 *  [MINOR]    Raw error details not sent to client
 */

import { applyCors } from './cors.js';

const OWNER = 'Hemanshubt';
const REPO  = 'devportfolio-Hemanshu';
const GITHUB_REST_URL = `https://api.github.com/repos/${OWNER}/${REPO}`;

const UPSTREAM_TIMEOUT_MS = 8_000;

// ── Simple in-process cache ────────────────────────────────────────────────────
// Resets on cold starts; good enough for a low-traffic portfolio endpoint.
let cache = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export default async function handler(req, res) {
  if (!applyCors(req, res, 'GET')) return;

  // Serve from cache if valid
  if (cache && Date.now() < cacheExpiry) {
    return res.status(200).json(cache);
  }

  // ── Upstream request ───────────────────────────────────────────────
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'devportfolio-app',
    };

    const { GITHUB_TOKEN } = process.env;
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(GITHUB_REST_URL, { headers, signal: controller.signal });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`[github-stats-proxy] Upstream error: HTTP ${response.status}`);
      // Return cached data (even if stale) before erroring, if available
      if (cache) return res.status(200).json(cache);
      return res.status(502).json({ error: 'Failed to fetch repository stats' });
    }

    const data = await response.json();
    const payload = {
      stars: data.stargazers_count ?? 0,
      forks: data.forks_count ?? 0,
    };

    // Update cache
    cache = payload;
    cacheExpiry = Date.now() + CACHE_TTL_MS;

    return res.status(200).json(payload);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error(`[github-stats-proxy] Request timed out after ${UPSTREAM_TIMEOUT_MS}ms`);
      if (cache) return res.status(200).json(cache);
      return res.status(504).json({ error: 'GitHub request timed out' });
    }
    console.error('[github-stats-proxy] Fetch error:', error?.message);
    if (cache) return res.status(200).json(cache);
    return res.status(500).json({ error: 'Service temporarily unavailable' });
  }
}
