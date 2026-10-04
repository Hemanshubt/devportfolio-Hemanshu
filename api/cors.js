/**
 * Shared CORS utility for all Vercel serverless functions.
 *
 * Security contract:
 *  - Allowed origins are explicitly listed.
 *  - An unknown or missing origin returns null — callers MUST reject such requests with 403.
 *  - Never fall back to a trusted origin for an unknown request.
 */

const ALLOWED_ORIGINS = new Set([
  'https://hemanshudev.cloud',
  'https://www.hemanshudev.cloud',
  'http://localhost:8080',
  'http://localhost:5173',
]);

/**
 * Returns the request's origin if it is in the allow-list, or null otherwise.
 * @param {import('@vercel/node').VercelRequest} req
 * @returns {string | null}
 */
export function getAllowedOrigin(req) {
  const origin = req.headers?.origin || '';
  return ALLOWED_ORIGINS.has(origin) ? origin : null;
}

/**
 * Applies CORS headers and handles pre-flight OPTIONS.
 * Returns false and sends a 403 if the origin is not allowed.
 * Returns true if the caller should continue processing.
 *
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 * @param {'GET' | 'POST'} allowedMethod
 * @returns {boolean} true = continue; false = response already sent
 */
export function applyCors(req, res, allowedMethod = 'POST') {
  const origin = getAllowedOrigin(req);

  if (!origin) {
    res.status(403).json({ error: 'Origin not allowed' });
    return false;
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', `${allowedMethod}, OPTIONS`);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false;
  }

  if (req.method !== allowedMethod) {
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }

  return true;
}
