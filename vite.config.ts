import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

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

/** Vite plugin that handles /api/github locally during dev */
function githubApiPlugin(githubToken: string): Plugin {
  return {
    name: 'github-api-dev',
    configureServer(server) {
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

          const result = await response.json();
          if (result.errors) {
            res.statusCode = 502;
            return res.end(JSON.stringify({ error: 'GitHub GraphQL error', details: result.errors }));
          }

          const calendar = result.data?.user?.contributionsCollection?.contributionCalendar || null;
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
    },
    plugins: [
      react(),
      githubApiPlugin(env.GITHUB_TOKEN || ''),
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
