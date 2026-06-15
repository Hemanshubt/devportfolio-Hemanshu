import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";

const GITHUB_GRAPHQL_ENDPOINT = 'https://api.github.com/graphql';
const HASHNODE_API_ENDPOINT = 'https://gql.hashnode.com';

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

/** Vite plugin that handles /api/github locally during dev */
function githubApiPlugin(githubToken: string): Plugin {
  return {
    name: 'github-api-dev',
    configureServer(server) {
      // Repo stats endpoint (must be registered before /api/github to avoid prefix match)
      server.middlewares.use('/api/github-stats', async (_req, res) => {
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'devportfolio-app',
        };
        if (githubToken) headers['Authorization'] = `Bearer ${githubToken}`;

        try {
          const response = await fetch('https://api.github.com/repos/Hemanshubt/devportfolio-Hemanshu', { headers });
          if (!response.ok) {
            res.statusCode = 502;
            return res.end(JSON.stringify({ error: `GitHub API error: ${response.status}` }));
          }
          const data = await response.json() as Record<string, unknown>;
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify({ stars: (data.stargazers_count as number) || 0, forks: (data.forks_count as number) || 0 }));
        } catch {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: 'Failed to fetch repo stats' }));
        }
      });

      // Contributions endpoint
      server.middlewares.use('/api/github', async (req, res) => {
        // CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') { res.statusCode = 200; return res.end(); }
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }

        if (!githubToken) {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: 'GITHUB_TOKEN not set in .env' }));
        }

        // Read body
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(Buffer.from(chunk));
        const body = JSON.parse(Buffer.concat(chunks).toString() || '{}');

        const { username, year } = body;
        if (!username || typeof username !== 'string' || !/^[a-zA-Z0-9-]+$/.test(username)) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Invalid username' }));
        }

        let from: string | undefined;
        let to: string | undefined;
        if (year && typeof year === 'number' && year >= 2008 && year <= 2030) {
          from = `${year}-01-01T00:00:00Z`;
          to = `${year}-12-31T23:59:59Z`;
        }

        try {
          const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${githubToken}`,
            },
            body: JSON.stringify({
              query: GET_USER_CONTRIBUTIONS_QUERY,
              variables: { userName: username, from, to },
            }),
          });

          if (!response.ok) {
            res.statusCode = 502;
            return res.end(JSON.stringify({ error: `GitHub API error: ${response.status}` }));
          }

          const result = await response.json() as Record<string, unknown>;
          if (result.errors) {
            res.statusCode = 502;
            return res.end(JSON.stringify({ error: 'GitHub GraphQL error', details: result.errors }));
          }

          const resultData = result.data as Record<string, unknown> | undefined;
          const user = resultData?.user as Record<string, unknown> | undefined;
          const contributions = user?.contributionsCollection as Record<string, unknown> | undefined;
          const calendar = contributions?.contributionCalendar || null;
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify({ data: calendar }));
        } catch (error) {
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: 'Failed to fetch GitHub data' }));
        }
      });
    },
  };
}

/** Vite plugin that proxies /api/hashnode → gql.hashnode.com during dev (fixes CORS) */
function hashnodeApiPlugin(): Plugin {
  return {
    name: 'hashnode-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/hashnode', async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') { res.statusCode = 200; return res.end(); }
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }

        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(Buffer.from(chunk));
        const body = Buffer.concat(chunks).toString();

        try {
          const response = await fetch(HASHNODE_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          });

          const contentType = response.headers.get('content-type') || '';

          // Hashnode API now requires Pro plan – returns HTML when access is blocked
          if (!contentType.includes('application/json')) {
            console.warn('[hashnode-proxy] Non-JSON response from Hashnode (API may require Pro plan). Content-Type:', contentType);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 503;
            return res.end(JSON.stringify({
              error: 'Hashnode API unavailable',
              message: 'The Hashnode GraphQL API now requires a Pro plan. Blog posts are temporarily unavailable.',
            }));
          }

          const data = await response.json();
          if (!response.ok) {
            console.error('[hashnode-proxy] Upstream error:', response.status, JSON.stringify(data));
          }
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = response.status;
          return res.end(JSON.stringify(data));
        } catch (error) {
          console.error('[hashnode-proxy] Proxy error:', error);
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: 'Failed to proxy Hashnode request' }));
        }
      });
    },
  };
}

/** Vite plugin that proxies /api/hashnode-rss → hemanshubtc.hashnode.dev/rss.xml (fixes CORS in dev with caching and fallback support) */
function hashnodeRSSPlugin(): Plugin {
  const RSS_URL = 'https://hemanshubtc.hashnode.dev/rss.xml';
  const FALLBACK_PATH = path.resolve(__dirname, './data/hashnode-rss-fallback.xml');
  
  let cachedXml = '';
  let lastFetched = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache in dev to avoid hitting rate limits

  return {
    name: 'hashnode-rss-dev',
    configureServer(server) {
      server.middlewares.use('/api/hashnode-rss', async (_req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        const now = Date.now();
        
        // Serve from memory cache if valid
        if (cachedXml && (now - lastFetched < CACHE_DURATION)) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          return res.end(cachedXml);
        }

        const serveFallback = (reason: string, status: number) => {
          console.warn(`[hashnode-rss-proxy] ${reason}. Attempting to serve local fallback...`);
          try {
            if (fs.existsSync(FALLBACK_PATH)) {
              const fallbackXml = fs.readFileSync(FALLBACK_PATH, 'utf-8');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/xml; charset=utf-8');
              return res.end(fallbackXml);
            }
          } catch (err) {
            console.error('[hashnode-rss-proxy] Failed to read fallback file:', err);
          }
          
          // If no fallback file, return standard error response
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'RSS feed unavailable', reason, status }));
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
            console.warn('[hashnode-rss-proxy] Remote fetch failed. Status:', response.status, 'Content-Type:', contentType);
            
            // Serve in-memory cache if available (even if expired)
            if (cachedXml) {
              console.log('[hashnode-rss-proxy] Serving expired memory cache as fallback');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/xml; charset=utf-8');
              return res.end(cachedXml);
            }
            
            return serveFallback(`Remote returned status ${response.status}`, response.status);
          }

          const xml = await response.text();
          cachedXml = xml;
          lastFetched = now;

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          return res.end(xml);
        } catch (error) {
          console.error('[hashnode-rss-proxy] Fetch error:', error);
          
          if (cachedXml) {
            console.log('[hashnode-rss-proxy] Serving expired memory cache as fallback after network error');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            return res.end(cachedXml);
          }
          
          return serveFallback('Network fetch error', 500);
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        '/api/contact': {
          target: 'http://localhost:3002',
          changeOrigin: true,
        },
        '/api/gemini': {
          target: 'http://localhost:3002',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      githubApiPlugin(env.GITHUB_TOKEN || ''),
      hashnodeApiPlugin(),
      hashnodeRSSPlugin(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'three': ['three', '@react-three/fiber', '@react-three/drei'],
            'framer': ['framer-motion'],
            'vendor': ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  };
});
