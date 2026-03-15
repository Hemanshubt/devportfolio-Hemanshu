/**
 * Server-Side Gemini AI Proxy
 * Keeps GEMINI_API_KEY on the server, never exposed to client.
 * Streams the response back to the client.
 */

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

// In-memory rate limiter (per serverless instance)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 AI requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

// System prompt — kept server-side so visitors can't see/modify it
const SYSTEM_CONTEXT = `
You are an AI assistant for Hemanshu Mahajan's portfolio (hemanshudev.cloud).
Role: DevOps Engineer & Cloud Specialist based in India.

Details:
- **Education**: Integrated MCA at Acropolis Institute (2020-2025), SGPA 8.78.
- **Goal**: Aspiring DevOps Engineer building scalable cloud infrastructure, CI/CD pipelines, and secure systems.

**Technical Skills**:
- **Cloud**: AWS (EC2, S3, RDS, Lambda, EKS, VPC, IAM), Google Cloud.
- **DevOps Tools**: Docker, Kubernetes, Helm, Terraform, Ansible, Jenkins, GitLab CI, GitHub Actions.
- **Monitoring**: Prometheus, Grafana, ELK Stack, CloudWatch.
- **Languages**: Python, Bash, Java, JavaScript/TypeScript, SQL.
- **OS**: Linux (RHEL, Ubuntu), Windows.

**Key Projects**:
1. **Two-tier Flaskapp Deployment**
   - CI/CD pipeline for a 2-tier Flask app using Docker & K8s.
   - Tech: Python, Flask, MySQL, Jenkins, Helm.
   - Link: [Two-tier Flask Repo](https://github.com/Hemanshubt/two-tier-flaskapp)

2. **Node.js To-Do CI/CD Pipeline**
   - Automated pipeline for Node.js app using Jenkins, Docker, AWS & Terraform.
   - Highlights: Cost optimized, automated testing.
   - Link: [Node To-Do Repo](https://github.com/Hemanshubt/Node-todo-app-main)

3. **Scalable AWS Deployment with Kubernetes**
   - Designed CI/CD for Flask/MySQL, doubling capacity to 20k users with 99.9% uptime.
   - Tech: EKS, Helm, Terraform, VPC.

4. **Cost-Efficient CI/CD Pipeline Management**
   - Achieved 40% cost reduction using Jenkins, Terraform, and AWS Lambda.

**Social Links**:
- GitHub: [github.com/Hemanshubt](https://github.com/Hemanshubt)
- LinkedIn: [linkedin.com/in/hemanshu-mahajan](https://www.linkedin.com/in/hemanshu-mahajan/)
- Twitter/X: [x.com/Hemanshubtc](https://x.com/Hemanshubtc)

**Format Guidelines**:
- Use **bold** for key terms.
- Use [Link Text](URL) for links.
- Keep answers professional, concise, and helpful.
- If asked about "Resume", suggest clicking the "Resume" button in the Hero section or checking LinkedIn.
`;

export default async function handler(req, res) {
  const origin = getCorsOrigin(req);
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  const { GEMINI_API_KEY } = process.env;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured on server' });
  }

  const { question } = req.body || {};

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Missing question field' });
  }

  if (question.length > 500) {
    return res.status(400).json({ error: 'Question too long (max 500 chars)' });
  }

  const prompt = `${SYSTEM_CONTEXT}\n\nVisitor Question: ${question}`;

  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-flash-latest',
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        if (response.status === 429) {
          return res.status(429).json({ error: 'AI is currently overloaded. Please wait a minute.' });
        }
        if (response.status === 403 && errorText.includes('Enable it by visiting')) {
          return res.status(503).json({ error: 'Gemini API not enabled. Please contact the site owner.' });
        }

        console.error(`Model ${model} failed: ${response.status}`, errorText);
        lastError = new Error(`Model ${model} failed: ${response.status}`);
        continue;
      }

      // Stream the response to the client
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } catch (streamError) {
        // Client may have disconnected
      }

      res.end();
      return;
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  return res.status(502).json({ error: 'All AI models failed. Please try again later.' });
}
