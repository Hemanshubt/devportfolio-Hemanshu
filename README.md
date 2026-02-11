<h1 align="center">Hemanshu Mahajan - Portfolio</h1>

<p align="center">
  <strong>A modern, responsive portfolio website for DevOps & Cloud enthusiasts</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React 18.3.1">
  <img src="https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite" alt="Vite 7.3.1">
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5.8.3">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
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
- ✅ **AI-Powered Terminal**: Context-aware assistant powered by Google Gemini (Flash 1.5/2.0) with robust fallback and auto-discovery mechanisms
- ✅ **Interactive Commands**: Custom terminal commands (`matrix`, `hack`, `coffee`, etc.)
- ✅ **Fully Responsive**: Optimized for all devices and screen sizes
- ✅ **Dark Theme**: Beautiful gradient design with glowing effects
- ✅ **Contact Form**: Integrated Email (Gmail) and Telegram notifications
- ✅ **Blog Integration**: Dynamic blog posts fetched from Hashnode
- ✅ **SEO Ready**: Meta tags and semantic HTML
- ✅ **Downloadable Resume**: PDF resume download functionality

---

## Sections :bookmark:

| Section | Description |
| --- | --- |
| 🦸 **Hero** | Eye-catching introduction with 3D cloud animation |
| 👤 **About Me** | Personal information and professional summary |
| 💼 **Timeline** | Work experience and education history |
| 🛠️ **Skills** | Technical skills with animated marquee display |
| 🚀 **Projects** | DevOps & Cloud projects with details |
| 📝 **Blog** | Latest articles from Hashnode with caching |
| 🏆 **Certifications** | AWS, Kubernetes, and other certifications |
| 📧 **Contact** | Contact form with Email/Telegram integration |

---

## Tech Stack :computer:

| Technology | Version | Purpose |
| --- | --- | --- |
| **React** | 18.3.1 | UI component library |
| **Vite** | 7.3.1 | Build tool and dev server |
| **TypeScript** | 5.8.3 | Type-safe JavaScript |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **Three.js** | 0.160.1 | 3D graphics and animations |
| **Framer Motion** | 11.18.2 | Animation library |
| **Google Gemini** | 1.5 Flash | AI-powered terminal assistant |
| **React Router** | 6.30.1 | Client-side routing |
| **shadcn/ui** | Latest | UI component library |
| **Express** | 4.21.0 | Local API server |
| **Nodemailer** | 6.9.16 | Email sending functionality |

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
# Install frontend dependencies
npm install

# Install API dependencies
cd api
npm install
cd ..
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

# Gemini AI Configuration (for Interactive Terminal)
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 4. Run the Development Server

```bash
# Terminal 1: Run API server
cd api
npm run dev

# Terminal 2: Run frontend
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

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

| Variable | Required | Description |
| --- | --- | --- |
| `EMAIL_ADDRESS` | Yes | Your Gmail address for sending emails |
| `GMAIL_PASSKEY` | Yes | Gmail app password (16 characters) |
| `TELEGRAM_BOT_TOKEN` | Yes | Token for Telegram bot notifications |
| `TELEGRAM_CHAT_ID` | Yes | Your Telegram chat ID for receiving messages |
| `VITE_GEMINI_API_KEY` | Yes | Your Google Gemini API Key (for AI terminal) |

> **Note**: Both Email and Telegram run in parallel for faster delivery. At least one must be configured for the contact form to work. The terminal AI requires a valid Gemini API key.

---

## Interactive Terminal Commands :terminal:

The portfolio features a built-in terminal with AI capabilities and fun Easter eggs.

| Command | Category | Description |
| --- | --- | --- |
| `ai <question>` | **AI** | Ask Gemini about Hemanshu's skills, projects, or background |
| `ai help` | **AI** | List sample questions the AI can answer |
| `matrix` | **Theme** | Toggle "Matrix Mode" (Green flickering text theme) |
| `hack` | **Fun** | Trigger a simulated hacking animaion |
| `coffee` | **Fun** | Developer coffee break Easter egg |
| `whoami` | **Info** | Quick overview of the candidate |
| `neofetch` | **Info** | Stylezed system information display |
| `ls`, `pwd`, `cd` | **System** | Basic file system navigation simulation |
| `clear`, `date` | **System** | Standard console utilities |
| `sudo hire` | **Easter Egg** | The ultimate command for recruiters |

**Terminal Features:**
- **Smart Autocomplete:** Press `Tab` to complete commands or cycle through AI question suggestions.
- **Robust AI Fallback:** Automatically cycles through multiple models (Gemini Flash/Pro) and auto-discovers available models to ensure maximum uptime.
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
│   ├── services/       # API services (Hashnode, cache)
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper utilities
├── api/                # Contact form API (Express for local, Vercel serverless for prod)
│   ├── contact.js      # Contact form handler (Email + Telegram)
│   ├── server.js       # Local Express server
│   └── package.json    # API dependencies
├── public/             # Static assets (images, resume PDF)
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
- Serverless functions for contact form
- Global CDN and free SSL

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
VITE_GEMINI_API_KEY=AIzaSy...your-key-here
```

> **Note**: The terminal is configured with automatic fallback models. If `gemini-1.5-flash` is unavailable, it will automatically attempt to use other available models associated with your key.

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
- Go to [Google Cloud Console > Credentials](https://console.cloud.google.com/apis/credentials)
- Find your API Key and click **Edit API Key**
- Under **Application restrictions**, verify that `http://localhost:5173` (for development) and your production domain are whitelisted.
- Alternatively, set to "None" during initial setup to test connectivity.
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

---

## Scripts :scroll:

| Command | Description |
| --- | --- |
| `npm run dev` | Start frontend development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `cd api && npm run dev` | Start API server (for local development) |

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
