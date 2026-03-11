<h1 align="center">Hemanshu Mahajan - Portfolio</h1>

<p align="center">
  <strong>A modern, responsive portfolio website for DevOps & Cloud enthusiasts</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React 18.3.1">
  <img src="https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite" alt="Vite 7.3.1">
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5.8.3">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Security-Hardened-22c55e?style=for-the-badge&logo=shieldsdotio" alt="Security Hardened">
  <!-- <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License"> -->
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

A professional portfolio website built with **React 18**, **Vite 7**, **TypeScript**, and **Tailwind CSS**. Features stunning 3D animations with Three.js, smooth Framer Motion transitions, and a contact form with Email & Telegram notifications.

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
- ✅ **Smooth Animations**: Framer Motion for fluid transitions
- ✅ **Performance Optimized**: React lazy loading, code splitting, and Suspense for faster initial load
- ✅ **AI-Powered Terminal**: Context-aware assistant powered by Google Gemini via secure server-side proxy
- ✅ **Interactive Commands**: Custom terminal commands (`matrix`, `hack`, `coffee`, etc.)
- ✅ **Fully Responsive**: Optimized for all devices and screen sizes
- ✅ **Dark Theme**: Beautiful gradient design with glowing effects
- ✅ **Contact Form**: Integrated Email (Gmail) and Telegram notifications with rate limiting & honeypot bot detection
- ✅ **GitHub Dashboard**: Real-time contribution analytics via secure server-side GitHub GraphQL proxy
- ✅ **Dynamic Insights**: Personalized stats (Total Contributions, Active Days) with interactive heatmap
- ✅ **Hybrid Rendering**: Smart fallback to image-based heatmap if API access is restricted
- ✅ **Advanced SEO**: Dynamic JSON-LD structured data (Schema.org), semantic HTML5, and automatic XML sitemap generation
- ✅ **Custom Domain**: Secured and deployed on [hemanshudev.cloud](https://hemanshudev.cloud)
- ✅ **Downloadable Resume**: PDF resume download functionality

### 🔒 Security Features

- ✅ **Server-Side API Proxies**: All sensitive tokens (GitHub PAT, Gemini API key) are kept server-side — never exposed in the client bundle
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
| 👤 **About Me** | Personal information and professional summary |
| 💼 **Timeline** | Work experience and education history |
| 🛠️ **Skills** | Technical skills with animated marquee display |
| 🚀 **Projects** | DevOps & Cloud projects with details |
| 📊 **GitHub** | Real-time contribution dashboard with GraphQL |
| 📝 **Blog** | Latest articles from Hashnode with caching |
| 🏆 **Certifications** | AWS, Kubernetes, and other certifications |
| 📧 **Contact** | Contact form with Email/Telegram integration |

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
| **Google Gemini** | 1.5 Flash | AI-powered terminal assistant |
| **React Router** | 6.30.1 | Client-side routing |
| **shadcn/ui** | Latest | UI component library |
| **Nodemailer** | 6.9.16 | Email sending functionality |
| **GitHub Graph** | v4 | GraphQL API for contribution data |

---

## Installation :arrow_down:

### Prerequisites

| Tool | Minimum Version | Download Link |
| --- | --- | --- |
| **Node.js** | v18.x or higher | [Download](https://nodejs.org/en/download/) |
| **npm** or **bun** | Latest | Included with Node.js |
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

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Gmail Configuration
EMAIL_ADDRESS=your-email@gmail.com
GMAIL_PASSKEY=your-gmail-app-password

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# Gemini AI Configuration (server-side only, no VITE_ prefix)
GEMINI_API_KEY=your-gemini-api-key

# GitHub Configuration (server-side only, no VITE_ prefix)
GITHUB_TOKEN=your-github-personal-access-token
```

> **⚠️ Security Note**: The `GEMINI_API_KEY` and `GITHUB_TOKEN` intentionally do NOT have the `VITE_` prefix. This ensures they are only available server-side and never bundled into the client JavaScript. A `.env.example` template is included in the repo.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

> **Note**: The Vite dev server includes built-in API middleware that handles `/api/github` and `/api/github-stats` endpoints locally — no separate API server is needed. The middleware reads tokens from your `.env` file automatically.

---

## Usage :joystick:

### Environment Variables Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Gmail Configuration
EMAIL_ADDRESS=your-email@gmail.com
GMAIL_PASSKEY=your-gmail-app-password

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

#### Variable Descriptions

| Variable | Required | Scope | Description |
| --- | --- | --- | --- |
| `EMAIL_ADDRESS` | Yes | Server | Your Gmail address for sending emails |
| `GMAIL_PASSKEY` | Yes | Server | Gmail app password (16 characters) |
| `TELEGRAM_BOT_TOKEN` | Yes | Server | Token for Telegram bot notifications |
| `TELEGRAM_CHAT_ID` | Yes | Server | Your Telegram chat ID for receiving messages |
| `GEMINI_API_KEY` | Yes | Server | Google Gemini API Key (for AI terminal proxy) |
| `GITHUB_TOKEN` | Yes | Server | GitHub PAT with `read:user` scope (for dashboard proxy) |

> **Note**: All environment variables are server-side only — none are exposed in the client bundle. Both Email and Telegram run in parallel for faster delivery. At least one must be configured for the contact form to work.

---

## Interactive Terminal Commands :terminal:

The portfolio features a built-in terminal with AI capabilities and fun Easter eggs.

| Command | Category | Description |
| --- | --- | --- |
| `ai <question>` | **AI** | Ask Gemini about Hemanshu's skills, projects, or background |
| `ai help` | **AI** | List sample questions the AI can answer |
| `matrix` | **Theme** | Toggle "Matrix Mode" (Green flickering text theme) |
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
│   ├── components/     # React components (Hero, About, Projects, etc.)
│   ├── data/           # Static data (projects, skills, certifications)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components (Index, ProjectDetail, BlogPost, NotFound)
│   ├── services/       # API services (Hashnode, GitHub proxy client, cache)
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper utilities
├── api/                # Vercel serverless functions
│   ├── contact.js      # Contact form handler (Email + Telegram) with rate limiting
│   ├── github.js       # Server-side GitHub GraphQL proxy for contribution heatmap
│   ├── github-stats.js # Server-side GitHub REST proxy for repo stars/forks
│   ├── gemini.js       # Server-side Gemini AI proxy (keeps API key secure)
│   └── package.json    # API dependencies
├── public/             # Static assets (images, resume PDF)
├── .env.example        # Environment variable template (safe to commit)
├── vercel.json         # Vercel config with security headers
└── ...config files
```

### Performance Optimizations

- **React Lazy Loading**: Below-the-fold components load on-demand
- **Code Splitting**: Automatic bundle splitting by route
- **Suspense Boundaries**: Graceful loading states for async components
- **Caching**: Blog posts cached in localStorage with TTL
- **Image Optimization**: Lazy loading for images and 3D scenes

---

## Deployment :rocket:

### 🚀 Deploy to Vercel (Recommended)

1. Sign up at [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Add environment variables in **Settings** → **Environment Variables**
4. Deploy

The project includes `vercel.json` for automatic configuration.

**Features:**
- Automatic deployments on push
- Serverless functions for contact form, GitHub proxies (contributions + repo stats), and Gemini AI proxy
- Global CDN and free SSL
- Security headers (CSP, HSTS, X-Frame-Options, etc.) via `vercel.json`

> **Important**: Ensure all environment variables (`GITHUB_TOKEN`, `GEMINI_API_KEY`, `EMAIL_ADDRESS`, `GMAIL_PASSKEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) are added in **Vercel → Settings → Environment Variables** before deploying.

---

## Tutorials :wrench:

### 📧 Gmail App Password Setup

1. Go to [https://myaccount.google.com/](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Go to **Security** → **App Passwords**
4. Select app: **Mail**, device: **Other (Custom name)**
5. Generate and copy the 16-character password
6. Add to `.env` file:

```env
GMAIL_PASSKEY=abcd efgh ijkl mnop
EMAIL_ADDRESS=your.email@gmail.com
```

---

### 🤖 Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Set bot name and username (must end with `bot`)
4. Copy the bot token
5. Send a message to your bot
6. Get chat ID from: `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
7. Add to `.env` file:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

---

### 🧠 Get a Google Gemini API Key

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2.  Click **Create API key**
3.  Copy the generated key
4.  Add to `.env` file:

```env
GEMINI_API_KEY=AIzaSy...your-key-here
```

> **Note**: The key does **NOT** use the `VITE_` prefix — it is only accessed server-side via the `/api/gemini` proxy. The terminal's AI model fallback and retry logic runs on the server.

---

### 🐙 Get a GitHub Personal Access Token

1.  Go to [GitHub Settings > Tokens](https://github.com/settings/tokens) (Classic)
2.  Click **Generate new token (classic)**
3.  Set a name and select the `read:user` scope
4.  Copy the token (it starts with `ghp_`)
5.  Add to `.env` file:

```env
GITHUB_TOKEN=ghp_your...token-here
```

> **Security Note**: The token does **NOT** use the `VITE_` prefix — it is only accessed server-side via the `/api/github` and `/api/github-stats` proxies and never exposed in the client bundle. Only the `read:user` scope is required.


---

## Troubleshooting :wrench:

<details>
<summary><strong>❌ Port 8080 is already in use</strong></summary>

**Solution:**
```bash
# Use a different port
# Edit vite.config.ts and change port, or run:
npm run dev -- --port 3000
```
</details>

<details>
<summary><strong>❌ Contact form not sending emails</strong></summary>

**Solution:**
- Verify Gmail App Password is correct (16 characters, no spaces)
- Check that 2-Step Verification is enabled on your Google account
- Ensure `EMAIL_ADDRESS` matches the Gmail account
- Test Telegram bot token and chat ID separately
- Check browser console for error messages
</details>

<details>
<summary><strong>❌ 3D scene not loading</strong></summary>

**Solution:**
- Ensure WebGL is enabled in your browser
- Check browser console for Three.js errors
- Try a different browser (Chrome recommended)
</details>

<details>
<summary><strong>❌ Gemini AI: 403 Forbidden / Referrer Blocked</strong></summary>

**Solution:**
- Since Gemini requests now go through the server-side `/api/gemini` proxy, referrer restrictions no longer apply.
- If you still get 403 errors, check that your `GEMINI_API_KEY` is correctly set in the `.env` file (without `VITE_` prefix).
- Ensure the Generative Language API is enabled in your Google Cloud Console.
</details>

<details>
<summary><strong>❌ Terminal Autocomplete not working</strong></summary>

**Solution:**
- Click inside the terminal to ensure it has focus.
- Autocomplete cycles through options; continue pressing **Tab** to see more matches.
</details>

<details>
<summary><strong>❌ AI Error: 429 (Too Many Requests)</strong></summary>

**Solution:**
- This occurs when the Gemini free tier rate limit is reached.
- **Wait 60 seconds** and try again.
- The terminal is optimized to handle this gracefully and will inform you if the AI is currently overloaded.
</details>

<details>
<summary><strong>❌ GitHub Dashboard: 401 Unauthorized / No Data</strong></summary>

**Solution:**
- Verify `GITHUB_TOKEN` (not `VITE_GITHUB_TOKEN`) is correctly set in your `.env` file.
- Ensure the token has the `read:user` scope (Classic token).
- The dashboard uses server-side proxies (`/api/github` for contributions, `/api/github-stats` for repo stars/forks) — no client-side token is needed.
- Check that your username matches your actual GitHub handle.
</details>

<details>
<summary><strong>❌ GitHub API: 403 Forbidden / 500 Server Error (Production)</strong></summary>

**Solution:**
- **403 errors**: Usually caused by GitHub REST API rate limits on unauthenticated requests. All GitHub calls now go through server-side proxies that use the token.
- **500 errors on `/api/github`**: The `GITHUB_TOKEN` environment variable is not set on Vercel. Go to **Vercel → Settings → Environment Variables** and add it.
- After adding the environment variable, **redeploy** the project for changes to take effect.
</details>


---

## Scripts :scroll:

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server (includes API middleware) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

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
