<h1 align="center">Hemanshu Mahajan — Portfolio</h1>

<p align="center">
  <strong>A modern, responsive portfolio website for DevOps & Cloud enthusiasts</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React 18.3.1">
  <img src="https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite" alt="Vite 7.3.1">
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5.8.3">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Security-Hardened-22c55e?style=for-the-badge&logo=shieldsdotio" alt="Security Hardened">
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#features-sparkles">Features</a> •
  <a href="#tech-stack-computer">Tech Stack</a> •
  <a href="#getting-started-dart">Getting Started</a> •
  <a href="#deployment-rocket">Deployment</a> •
  <a href="#contact-coffee">Contact</a>
</p>

---

## Overview

A professional portfolio website built with **React 18**, **Vite 7**, **TypeScript**, and **Tailwind CSS**. Features stunning 3D animations with Three.js, smooth Framer Motion transitions, a real-time GitHub contribution dashboard, an AI-powered interactive terminal, and a contact form with **Resend Email** & Telegram notifications.

---

## Demo :movie_camera:

<p align="center">
  <a href="https://hemanshudev.cloud/" target="_blank">
    <strong>🚀 View Live Demo</strong>
  </a>
</p>

---

## Features :sparkles:

- ✅ **Modern Tech Stack**: React 18, Vite 7, TypeScript, Tailwind CSS
- ✅ **3D Animations**: Interactive cloud scene with Three.js & React Three Fiber
- ✅ **Smooth Animations**: Framer Motion + GSAP for fluid transitions and micro-interactions
- ✅ **Performance Optimized**: React lazy loading, code splitting, and Suspense for faster initial load
- ✅ **AI-Powered Terminal**: Context-aware assistant powered by Google Gemini via secure server-side proxy
- ✅ **Interactive Commands**: Custom terminal commands (`matrix`, `hack`, `coffee`, `sudo hire`, etc.)
- ✅ **Fully Responsive**: Optimized for all devices and screen sizes
- ✅ **Dark Theme**: Beautiful gradient design with glowing effects
- ✅ **Contact Form**: Integrated Email (Resend API) and Telegram notifications with rate limiting & honeypot bot detection
- ✅ **GitHub Dashboard**: Real-time contribution analytics via secure server-side GitHub GraphQL proxy
- ✅ **Dynamic Insights**: Personalized stats (Total Contributions, Active Days) with interactive heatmap
- ✅ **Hybrid Rendering**: Smart fallback to image-based heatmap if API access is restricted
- ✅ **Advanced SEO**: Dynamic JSON-LD structured data (Schema.org), semantic HTML5
- ✅ **Custom Domain**: Secured and deployed on [hemanshudev.cloud](https://hemanshudev.cloud)
- ✅ **Downloadable Resume**: PDF resume download functionality
- ✅ **Konami Easter Egg**: Hidden interactive surprise for curious visitors
- ✅ **Tech Marquee**: Auto-scrolling dual-row DevOps tool ticker
- ✅ **Cursor Trail**: Animated particle trail following cursor movement
- ✅ **Project Detail Pages**: Full-page project write-ups with rendered README content & social share buttons
- ✅ **Skeleton Loading States**: Polished skeleton placeholders for project cards and detail pages

### 🔒 Security Features

- ✅ **Server-Side API Proxies**: All sensitive tokens (GitHub PAT, Gemini API key, Resend API key) are kept server-side — never exposed in the client bundle
- ✅ **Restricted CORS**: API endpoints only accept requests from the production domain and localhost
- ✅ **Rate Limiting**: Contact form (5 req/15min) and AI terminal (10 req/min) per IP
- ✅ **Honeypot Bot Detection**: Hidden form field catches automated spam bots
- ✅ **Input Sanitization**: All user inputs sanitized against XSS before use in HTML emails
- ✅ **Security Headers**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- ✅ **Content Security Policy**: Restricts script/style/font/connect sources to trusted origins

---

## Sections :bookmark:

| Section | Description |
| --- | --- |
| 🦸 **Hero** | Eye-catching introduction with 3D cloud animation |
| 🎞️ **Marquee** | Auto-scrolling dual-row DevOps & Cloud tool ticker |
| 👤 **About Me** | Personal information and professional summary |
| 🛠️ **Skills** | Technical skills with orbit & grid view, filterable by category |
| 💻 **Code Showcase** | Interactive code snippet viewer |
| 🚀 **Projects** | DevOps & Cloud projects with full detail pages & social sharing |
| 📊 **GitHub** | Real-time contribution dashboard with GraphQL heatmap |
| 🏆 **Certifications** | AWS, Kubernetes, and other certifications |
| 💼 **Timeline** | Work experience and education history |
| 📧 **Contact** | Contact form with Resend Email/Telegram integration & CI/CD pipeline animation |

---

## Tech Stack :computer:

| Technology | Version | Purpose |
| --- | --- | --- |
| **React** | 18.3.1 | UI component library |
| **Vite** | 7.3.1 | Build tool and dev server (with API middleware) |
| **TypeScript** | 5.8.3 | Type-safe JavaScript |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Three.js** | 0.160.1 | 3D graphics and animations |
| **Framer Motion** | 11.18.2 | Animation library |
| **GSAP** | 3.15.0 | High-performance animations |
| **Google Gemini** | 1.5 Flash | AI-powered terminal assistant |
| **React Router** | 6.30.1 | Client-side routing |
| **shadcn/ui** | Latest | UI component library (Radix UI) |
| **Resend** | HTTP API | Transactional email delivery |
| **GitHub GraphQL** | v4 | API for contribution data |
| **TanStack Query** | 5.x | Server state management |
| **Recharts** | 2.15.4 | Data visualization charts |
| **React Markdown** | 10.1.0 | Markdown rendering for project pages |
| **Vercel Speed Insights** | 2.0 | Real User Monitoring (RUM) |

---

## Installation :arrow_down:

### Prerequisites

| Tool | Minimum Version | Download Link |
| --- | --- | --- |
| **Node.js** | v20.x or higher | [Download](https://nodejs.org/en/download/) |
| **npm** | Latest | Included with Node.js |
| **Git** | Latest | [Download](https://git-scm.com/downloads) |

#### Verify Installation

```bash
node --version
npm --version
git --version
```

---

## Getting Started :dart:

### 1. Clone the Repository

```bash
git clone https://github.com/Hemanshubt/devportfolio-Hemanshu.git
cd devportfolio-Hemanshu
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend API:**
```bash
cd api
npm install
cd ..
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory (see `.env.example` for a template):

```env
# Resend API Configuration
RESEND_API_KEY=re_your-resend-api-key
RESEND_FROM=Hemanshu Mahajan <contact@hemanshudev.cloud>
RESEND_TO=your-email@gmail.com
EMAIL_ADDRESS=your-email@gmail.com

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# Gemini AI (server-side only — no VITE_ prefix)
GEMINI_API_KEY=your-gemini-api-key

# GitHub (server-side only — no VITE_ prefix)
GITHUB_TOKEN=your-github-personal-access-token
```

> **⚠️ Security Note**: `RESEND_API_KEY`, `GEMINI_API_KEY`, and `GITHUB_TOKEN` intentionally omit the `VITE_` prefix — this ensures they are only available server-side and are never bundled into the client JavaScript.

### 4. Run the Development Servers

You need **two terminal windows** — one for the backend API, one for Vite.

**Terminal 1 — Backend API (Contact + AI):**
```bash
cd api
npm run dev
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

> **Note**: GitHub contributions & stats are proxied directly by Vite middleware — no extra server needed for those. The separate API server only handles the contact form and Gemini AI endpoints locally.

---

## Environment Variables :key:

| Variable | Required | Scope | Description |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | Yes | Server | Resend API key for sending contact form emails |
| `RESEND_FROM` | Optional | Server | Sender address (defaults to `Portfolio Contact <onboarding@resend.dev>`) |
| `RESEND_TO` | Optional | Server | Destination email (defaults to `EMAIL_ADDRESS`) |
| `EMAIL_ADDRESS` | Optional | Server | Fallback recipient address |
| `TELEGRAM_BOT_TOKEN` | Yes | Server | Token for Telegram bot notifications |
| `TELEGRAM_CHAT_ID` | Yes | Server | Your Telegram chat ID |
| `GEMINI_API_KEY` | Yes | Server | Google Gemini API key (AI terminal proxy) |
| `GITHUB_TOKEN` | Yes | Server | GitHub PAT with `read:user` scope (heatmap proxy) |

> All variables are server-side only — none are exposed in the client bundle. Both Resend Email and Telegram run in parallel for faster delivery. At least one must be configured for the contact form to work.

---

## Interactive Terminal Commands :terminal:

The portfolio features a built-in terminal with AI capabilities and fun Easter eggs.

| Command | Category | Description |
| --- | --- | --- |
| `ai <question>` | **AI** | Ask Gemini about Hemanshu's skills, projects, or background |
| `ai help` | **AI** | List sample questions the AI can answer |
| `matrix` | **Theme** | Toggle Matrix Mode (green flickering text theme) |
| `hack` | **Fun** | Trigger a simulated hacking animation |
| `coffee` | **Fun** | Developer coffee break Easter egg |
| `whoami` | **Info** | Quick overview of the candidate |
| `neofetch` | **Info** | Stylized system information display |
| `ls`, `pwd`, `cd` | **System** | Basic file system navigation simulation |
| `clear`, `date` | **System** | Standard console utilities |
| `sudo hire` | **Easter Egg** | The ultimate command for recruiters |

**Terminal Features:**
- **Smart Autocomplete:** Press `Tab` to complete commands or cycle through AI question suggestions.
- **Secure AI Proxy:** All Gemini API calls go through a server-side proxy — your API key is never exposed to visitors.
- **Rate Limited:** AI requests are rate-limited (10 req/min per IP) to prevent abuse.
- **Typewriter Effect:** AI responses stream in real-time with Markdown support.

---

## Project Structure :file_folder:

```
├── src/
│   ├── components/         # React components (Hero, Marquee, About, Skills, Projects, etc.)
│   │   ├── CardSwap.tsx    # Animated card swap component
│   │   ├── CursorTrail.tsx # Animated cursor particle trail
│   │   ├── Marquee.tsx     # Auto-scrolling DevOps tool ticker
│   │   ├── ShareButtons.tsx        # Social share (Twitter, LinkedIn, Facebook, copy link)
│   │   ├── ProjectCardSkeleton.tsx # Skeleton loader for project cards
│   │   ├── ProjectDetailSkeleton.tsx # Skeleton loader for project detail pages
│   │   └── ui/             # shadcn/ui base components
│   ├── data/
│   │   └── projects.ts     # All project content (titles, tags, GitHub links, full README)
│   ├── hooks/              # Custom React hooks (use-mobile, use-toast)
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components (Index, ProjectDetail, NotFound)
│   ├── services/           # API services (GitHub proxy client)
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper utilities (validators)
├── api/                    # Vercel serverless functions
│   ├── contact.js          # Contact form handler (Resend Email + Telegram) with rate limiting
│   ├── cors.js             # Shared CORS origin validation middleware
│   ├── github.js           # Server-side GitHub GraphQL proxy (contribution heatmap)
│   ├── github-stats.js     # Server-side GitHub REST proxy (repo stars/forks)
│   ├── gemini.js           # Server-side Gemini AI proxy (keeps API key secure)
│   ├── server.js           # Local dev API server entry point
│   └── package.json        # API dependencies
├── public/                 # Static assets (images, resume PDF)
├── .env.example            # Environment variable template (safe to commit)
├── vercel.json             # Vercel config with security headers & rewrites
└── vite.config.ts          # Vite config with GitHub API middleware plugins
```

### Performance Optimizations

- **React Lazy Loading**: All below-the-fold sections load on-demand
- **Code Splitting**: Manual Rollup chunks for `three`, `framer-motion`, `vendor`
- **Suspense Boundaries**: Graceful loading states for async components
- **Session-aware Loading Screen**: Shown only on page refresh, not on client-side navigation
- **Skeleton Placeholders**: Project cards and detail pages display polished skeletons while loading

---

## Deployment :rocket:

### 🚀 Deploy to Vercel (Recommended)

1. Sign up at [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Add all environment variables in **Settings → Environment Variables**
4. Deploy

The project includes `vercel.json` for automatic configuration.

**What Vercel handles automatically:**
- Deployments on every push to `main`
- Serverless functions for contact form, GitHub proxies, and Gemini AI
- Global CDN and free SSL
- Security headers (CSP, HSTS, X-Frame-Options, etc.)

> **Important**: Ensure **all** environment variables (`RESEND_API_KEY`, `GITHUB_TOKEN`, `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) are set in **Vercel → Settings → Environment Variables** before deploying, then **redeploy** for them to take effect.

---

## Tutorials :wrench:

### 📧 Resend API Key Setup

1. Sign up at [Resend](https://resend.com/)
2. Navigate to **API Keys** in the dashboard
3. Click **Create API Key**
4. Copy the generated key (starts with `re_`)
5. *(Optional)* Add and verify your custom domain under **Domains** for branded sender addresses
6. Add to `.env`:

```env
RESEND_API_KEY=re_your-resend-api-key
RESEND_FROM=Hemanshu Mahajan <contact@hemanshudev.cloud>
RESEND_TO=your-email@gmail.com
```

> **Note**: If no custom domain is verified, Resend defaults to `onboarding@resend.dev` as the sender.

---

### 🤖 Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` and follow the prompts
3. Copy the bot token
4. Send a message to your bot
5. Get your chat ID: `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
6. Add to `.env`:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

---

### 🧠 Get a Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **Create API key**
3. Copy the generated key
4. Add to `.env`:

```env
GEMINI_API_KEY=AIzaSy...your-key-here
```

> **Note**: No `VITE_` prefix — the key is only accessed server-side via the `/api/gemini` proxy.

---

### 🐙 Get a GitHub Personal Access Token

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens) (Classic)
2. Click **Generate new token (classic)**
3. Set a name, select the `read:user` scope
4. Copy the token (starts with `ghp_`)
5. Add to `.env`:

```env
GITHUB_TOKEN=ghp_your...token-here
```

> **Security Note**: No `VITE_` prefix — the token is only used server-side via `/api/github` and `/api/github-stats` proxies.

---

## Troubleshooting :wrench:

<details>
<summary><strong>❌ Port 8080 is already in use</strong></summary>

**Solution:**
```bash
npm run dev -- --port 3000
```
</details>

<details>
<summary><strong>❌ Contact form not sending emails</strong></summary>

**Solution:**
- Verify `RESEND_API_KEY` is set in `.env` (starts with `re_`)
- If using a custom sender address (`RESEND_FROM`), ensure the domain is verified in the Resend dashboard
- Test the Telegram bot token and chat ID separately
- Check the browser console and API server logs for errors
</details>

<details>
<summary><strong>❌ 3D scene not loading</strong></summary>

**Solution:**
- Ensure WebGL is enabled in your browser
- Check browser console for Three.js errors
- Try Chrome (recommended for WebGL compatibility)
</details>

<details>
<summary><strong>❌ Gemini AI: 403 Forbidden</strong></summary>

**Solution:**
- Gemini requests go through the server-side `/api/gemini` proxy — referrer restrictions do not apply.
- Verify `GEMINI_API_KEY` is set in `.env` **without** the `VITE_` prefix.
- Ensure the **Generative Language API** is enabled in your Google Cloud Console.
</details>

<details>
<summary><strong>❌ Terminal Autocomplete not working</strong></summary>

**Solution:**
- Click inside the terminal to give it focus.
- Press **Tab** repeatedly to cycle through matching suggestions.
</details>

<details>
<summary><strong>❌ AI Error: 429 (Too Many Requests)</strong></summary>

**Solution:**
- The Gemini free tier rate limit has been reached.
- Wait 60 seconds and try again. The terminal handles this gracefully.
</details>

<details>
<summary><strong>❌ GitHub Dashboard: 401 Unauthorized / No Data</strong></summary>

**Solution:**
- Verify `GITHUB_TOKEN` (not `VITE_GITHUB_TOKEN`) is set in `.env`.
- Ensure the token has the `read:user` scope (Classic token).
- No client-side token is needed — all GitHub calls use server-side proxies.
</details>

<details>
<summary><strong>❌ GitHub API: 403 Forbidden / 500 Server Error (Production)</strong></summary>

**Solution:**
- **403**: Usually GitHub REST API rate limits on unauthenticated requests — all GitHub calls now use authenticated server-side proxies.
- **500 on `/api/github`**: `GITHUB_TOKEN` is not set on Vercel. Add it in **Vercel → Settings → Environment Variables** then **redeploy**.
</details>

---

## Scripts :scroll:

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite frontend development server (port 8080) |
| `npm run build` | Build for production |
| `npm run build:dev` | Build with development mode (unminified, source maps) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `cd api && npm run dev` | Start local backend API server (contact + AI) |

---

## Contact :coffee:

- **GitHub**: [@Hemanshubt](https://github.com/Hemanshubt)
- **LinkedIn**: [Hemanshu Mahajan](https://www.linkedin.com/in/hemanshu-mahajan/)
- **Twitter**: [@Hemanshubtc](https://x.com/Hemanshubtc)
- **Email**: hemanshumahajan55@gmail.com

---

<p align="center">
  Made with ❤️ by Hemanshu Mahajan
</p>
