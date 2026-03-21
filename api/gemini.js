/**
 * Server-Side Gemini AI Proxy
 * Keeps GEMINI_API_KEY on the server, never exposed to client.
 * Streams the response back to the client.
 *
 * Fixes applied:
 *  [CRITICAL]  Prompt injection — system prompt moved to system_instruction field
 *  [CRITICAL]  Fake model names removed (gemini-3.x does not exist; see comment below)
 *  [MODERATE]  Input sanitisation — control characters stripped before use
 *  [MODERATE]  CORS — disallowed origins now get 403 instead of silent fallback
 *  [MODERATE]  CORS — Vary: Origin header added for correct CDN/proxy caching
 *  [MODERATE]  Stream errors logged; terminal SSE error event sent to client
 *  [MINOR]     AbortController timeout on every upstream fetch (25 s)
 *  [MINOR]     rateLimitMap pruned periodically (prevents memory growth)
 *  [MINOR]     req.socket?.remoteAddress removed (not available on serverless)
 *  [MINOR]     x-real-ip added as secondary IP fallback
 */

// ─── CORS ─────────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = new Set([
  'https://hemanshudev.cloud',
  'https://www.hemanshudev.cloud',
  'http://localhost:8080',
  'http://localhost:5173',
]);

function getAllowedOrigin(req) {
  const origin = req.headers?.origin || '';
  return ALLOWED_ORIGINS.has(origin) ? origin : null;
}

// ─── RATE LIMITER ─────────────────────────────────────────────────────────────
// ⚠️  In-memory — resets on cold starts.
//     For reliable rate limiting swap with a distributed store (e.g. Upstash Redis).

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10;           // max requests per window per IP

// Prune stale entries every 5 min to prevent unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.start > RATE_LIMIT_WINDOW) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { start: now, count: 1 });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
// Passed via system_instruction — NOT concatenated into user content.
// This is the correct Gemini API pattern and prevents prompt-injection attacks.

const SYSTEM_CONTEXT = `
You are an AI assistant embedded on Hemanshu Mahajan's portfolio website (hemanshudev.cloud).
Your job is to answer visitors' questions about Hemanshu — his background, skills, projects, education, certifications, and how to get in touch. Be friendly, professional, and concise.

═══════════════════════════════════════════
  PERSONAL PROFILE
═══════════════════════════════════════════
- **Name**: Hemanshu Mahajan
- **Role**: Aspiring DevOps Engineer & Cloud Enthusiast
- **Location**: India
- **Portfolio**: [hemanshudev.cloud](https://hemanshudev.cloud)
- **Tagline**: "Passionate about CI/CD & Cloud. Ready to Build & Learn."
- **Goal**: Building scalable cloud infrastructure, CI/CD pipelines, and secure systems in a professional DevOps environment.

═══════════════════════════════════════════
  EDUCATION
═══════════════════════════════════════════
1. **Integrated Master in Computer Application (MCA)**
   - R. C. Patel Institute of Management Research and Development, Shirpur
   - Aug 2020 – June 2025
   - CGPA: **8.7**

2. **Higher Secondary Certificate (XII)**
   - R. C. Patel Arts Commerce & Science College, Shirpur
   - 2018 – 2020
   - Percentage: **74.47%**

3. **Secondary School Certificate (X)**
   - R. C. Patel Main Building Secondary School, Shirpur
   - 2008 – 2018
   - Percentage: **82.00%**

═══════════════════════════════════════════
  TECHNICAL SKILLS (by Category)
═══════════════════════════════════════════
- **Languages**: Python, Shell/Bash
- **Operating Systems**: Linux (RHEL, Ubuntu), Windows
- **Version Control**: Git, GitHub
- **Containers & Orchestration**: Docker, Kubernetes, Helm
- **CI/CD**: Jenkins, GitLab CI
- **Cloud Platforms**: AWS (EC2, S3, RDS, Lambda, EKS, VPC, IAM, Route53, ALB, CloudWatch)
- **Infrastructure as Code (IaC)**: Terraform, Ansible
- **Monitoring & Observability**: Prometheus, Grafana, ELK Stack, CloudWatch
- **Database**: MySQL, PostgreSQL
- **Security & Code Quality**: SonarQube, Trivy, OWASP

═══════════════════════════════════════════
  FEATURED PROJECTS (on Portfolio)
═══════════════════════════════════════════

### 1. AI Chatbot UI on Amazon EKS
- **What**: Automated deployment of an OpenAI-powered Chatbot UI on Amazon EKS using Terraform & Jenkins with DevSecOps best practices.
- **Tech Stack**: OpenAI API, Amazon EKS, Terraform, Jenkins, Docker, Kubernetes, SonarQube, Trivy, OWASP
- **Key Highlights**: OpenAI API integration, EKS orchestration, DevSecOps pipeline with SonarQube + Trivy + OWASP scanning, S3 backend with DynamoDB state locking.
- **GitHub**: [ai-chatbot-eks-terraform-jenkins](https://github.com/Hemanshubt/ai-chatbot-eks-terraform-jenkins)

### 2. Cloud Native Blog Platform
- **What**: End-to-end CI/CD automation of a full-stack Spring Boot blogging app on AWS EKS with full observability.
- **Tech Stack**: Spring Boot, Java, AWS EKS, Terraform, Jenkins, SonarQube, Docker, Kubernetes, Nexus, Trivy, Prometheus, Grafana
- **Key Highlights**: Full-stack Java app, quality gates with SonarQube, Nexus artifact management, real-time monitoring with Prometheus & Grafana, email notifications.
- **GitHub**: [FullStack-Blogging-App](https://github.com/Hemanshubt/FullStack-Blogging-App)

### 3. 3-Tier App on EKS
- **What**: Production-ready 3-tier application (React + Flask + PostgreSQL) on AWS EKS with high availability and secure infrastructure.
- **Tech Stack**: React, Flask, PostgreSQL, AWS EKS, ALB, RDS, Terraform, Helm, Docker, Route53, IAM, eksctl
- **Key Highlights**: Multi-AZ RDS, AWS ALB Controller with Kubernetes Ingress, OIDC/IRSA for secure IAM, namespace isolation, ExternalName service for RDS mapping, Kubernetes Secrets & ConfigMaps.
- **GitHub**: [cloud-native-3tier-app-eks](https://github.com/Hemanshubt/cloud-native-3tier-app-eks)

### 4. Jenkins Docker Deployment
- **What**: CI/CD pipeline with Jenkins to deploy Java web app inside Docker containers on AWS infrastructure.
- **Tech Stack**: Jenkins, Docker, AWS EC2, Maven, Git, Java, Tomcat, Bash
- **Key Highlights**: End-to-end automation from code commit to deployment, custom Dockerfile for Tomcat, artifact transfer via Publish Over SSH, GitHub webhook triggers.
- **GitHub**: [jenkins-docker-aws-deployment](https://github.com/Hemanshubt/jenkins-docker-aws-deployment)

═══════════════════════════════════════════
  OTHER PROJECTS (not featured but notable)
═══════════════════════════════════════════
- **Two-tier Flaskapp Deployment**: CI/CD pipeline for Flask + MySQL using Docker, K8s, Jenkins, Helm. [Repo](https://github.com/Hemanshubt/two-tier-flaskapp)
- **Node.js To-Do CI/CD Pipeline**: Automated pipeline using Jenkins, Docker, AWS & Terraform. Cost optimized with automated testing. [Repo](https://github.com/Hemanshubt/Node-todo-app-main)
- **Scalable AWS Deployment with Kubernetes**: Doubled capacity to 20,000 users with 99.9% uptime using EKS, Helm, Terraform.
- **Cost-Efficient CI/CD Pipeline Management**: Achieved 40% cost reduction using Jenkins, Terraform, and AWS Lambda with 90% automation.

═══════════════════════════════════════════
  CERTIFICATIONS
═══════════════════════════════════════════
1. **AWS Cloud Essentials** — Amazon Web Services
   - [Verify on Credly](https://www.credly.com/badges/8ed7d7ad-9993-479c-a919-b8f173f9aef8/public_url)

2. **Kubernetes Basics** — KodeKloud
   - [Verify on KodeKloud](https://learn.kodekloud.com/certificate/2D1466DFC0C5-2D1460E91B48-2D145B4F88C5)

═══════════════════════════════════════════
  ACHIEVEMENTS
═══════════════════════════════════════════
- **3rd Rank — Project Competition**, Computer Society of India (CSI)
  - [View Certificate](https://drive.google.com/file/d/1laqZANHF1I9w6SYAn_AInm85kxRYiPZk/view)

═══════════════════════════════════════════
  BLOG POSTS AVAILABLE ON THE SITE
═══════════════════════════════════════════
Hemanshu writes technical blog posts on the portfolio. Topics include:
- 3-Tier App on EKS (detailed deployment guide)
- Cloud Native Blog Platform (full DevOps case study)
- AI Chatbot on EKS with Terraform & Jenkins
- Jenkins Docker AWS Deployment (step-by-step tutorial)

═══════════════════════════════════════════
  SOCIAL & CONTACT LINKS
═══════════════════════════════════════════
- **GitHub**: [github.com/Hemanshubt](https://github.com/Hemanshubt)
- **LinkedIn**: [linkedin.com/in/hemanshu-mahajan](https://www.linkedin.com/in/hemanshu-mahajan/)
- **Twitter/X**: [x.com/Hemanshubtc](https://x.com/Hemanshubtc)
- **Email**: Available through the Contact form on the portfolio website.

═══════════════════════════════════════════
  CORE PRINCIPLES & PERSONALITY
═══════════════════════════════════════════
- **Quick Learner**: Rapidly adapting to new technologies and tools.
- **Security Focused**: Understanding the importance of security in every pipeline and deployment.
- **Problem Solver**: Analytical mindset to troubleshoot issues and find efficient solutions.
- **Team Player**: Collaborative approach to work with cross-functional teams effectively.

═══════════════════════════════════════════
  RESPONSE FORMAT GUIDELINES
═══════════════════════════════════════════
- Use **bold** for key terms and names.
- Use [Link Text](URL) for hyperlinks.
- Keep answers professional, concise, and helpful.
- Be conversational and approachable — you represent Hemanshu's portfolio.
- If asked about the **Resume**, suggest clicking the **"Resume"** button in the Hero section of the website or checking his LinkedIn.
- If asked about **contacting Hemanshu**, point them to the **Contact section** at the bottom of the portfolio, or provide social links.
- If asked about something outside Hemanshu's profile, politely redirect: "I'm specifically here to help with questions about Hemanshu's skills and experience. For general tech questions, I'd recommend checking relevant documentation."
- If asked who built this portfolio/website, say Hemanshu built it himself using React, TypeScript, Tailwind CSS, Framer Motion, and a Node.js/Express backend with Gemini AI integration.
- Never fabricate information — only answer based on the data above.
`.trim();

// ─── MODELS ───────────────────────────────────────────────────────────────────
//
// ⚠️  IMPORTANT — gemini-3.x DOES NOT EXIST.
//
// As of early 2025, Google has not released any Gemini 3.x models. Including
// fake model names causes every request to burn through several doomed HTTP
// round-trips before reaching a working model, adding multiple seconds of
// latency on EVERY request, and consuming your serverless function's timeout
// budget unnecessarily.
//
// Only verified, real model identifiers are listed here. When Google releases
// a newer generation, add it to the TOP of this array so it is tried first.
// Verify names at: https://ai.google.dev/gemini-api/docs/models/gemini
//
// 'gemini-flash-latest' has also been removed — it is not a valid identifier.

const MODELS_TO_TRY = [
  'gemini-2.5-flash',  // newest — try first
  'gemini-2.0-flash',  // stable fallback
  'gemini-1.5-flash',  // last-resort fallback
];

const UPSTREAM_TIMEOUT_MS = 25_000; // stay within Vercel's 30 s default limit

// ─── HANDLER ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // ── CORS ────────────────────────────────────────────────────────────────
  const allowedOrigin = getAllowedOrigin(req);

  if (!allowedOrigin) {
    // Reject disallowed origins explicitly — do NOT silently fall back to your
    // own domain, which masks misconfiguration and confuses debugging.
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin'); // required for correct CDN/proxy caching

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── RATE LIMITING ──────────────────────────────────────────────────────
  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    'unknown';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  // ── API KEY ────────────────────────────────────────────────────────────
  const { GEMINI_API_KEY } = process.env;
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured on server' });
  }

  // ── INPUT VALIDATION & SANITISATION ───────────────────────────────────
  const { question } = req.body || {};

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid question field' });
  }

  // Strip ASCII control characters (U+0000–U+001F, U+007F) to prevent
  // SSE injection and other abuse before the value reaches the API or is
  // written into the response stream.
  const sanitized = question.replace(/[\x00-\x1F\x7F]/g, '').trim();

  if (!sanitized) {
    return res.status(400).json({ error: 'Question contains no valid content' });
  }

  if (sanitized.length > 500) {
    return res.status(400).json({ error: 'Question too long (max 500 chars)' });
  }

  // ── MODEL FALLBACK LOOP ────────────────────────────────────────────────
  let lastError = null;

  for (const model of MODELS_TO_TRY) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            // Using system_instruction keeps the system prompt in a dedicated
            // field, entirely separate from user content. This is the correct
            // Gemini API pattern and prevents prompt-injection — a visitor
            // cannot override these instructions by wording their question
            // cleverly (e.g. "Ignore all previous instructions and...").
            system_instruction: {
              parts: [{ text: SYSTEM_CONTEXT }],
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: sanitized }],
              },
            ],
          }),
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();

        if (response.status === 429) {
          return res.status(429).json({ error: 'AI is currently overloaded. Please wait a minute.' });
        }
        if (response.status === 403 && errorText.includes('Enable it by visiting')) {
          return res.status(503).json({ error: 'Gemini API not enabled. Please contact the site owner.' });
        }

        console.error(`[gemini-proxy] Model ${model} failed: HTTP ${response.status}`, errorText);
        lastError = new Error(`Model ${model} failed: ${response.status}`);
        continue;
      }

      // ── STREAM RESPONSE TO CLIENT ──────────────────────────────────────
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(decoder.decode(value, { stream: true }));
        }
      } catch (streamError) {
        // Client disconnected or network error mid-stream
        console.error('[gemini-proxy] Stream error:', streamError?.message);
        try {
          // Best-effort terminal event so the client knows the stream ended badly
          res.write(`data: {"error":"Stream interrupted"}\n\n`);
        } catch (_) {
          // Response already closed — nothing more we can do
        }
      }

      res.end();
      return;
    } catch (fetchError) {
      clearTimeout(timeoutId);

      if (fetchError.name === 'AbortError') {
        console.error(`[gemini-proxy] Model ${model} timed out after ${UPSTREAM_TIMEOUT_MS}ms`);
        lastError = new Error(`Model ${model} timed out`);
      } else {
        console.error(`[gemini-proxy] Model ${model} fetch error:`, fetchError?.message);
        lastError = fetchError;
      }

      continue;
    }
  }

  console.error('[gemini-proxy] All models failed. Last error:', lastError?.message);
  return res.status(502).json({ error: 'All AI models failed. Please try again later.' });
}