<h1 align="center">Hemanshu Mahajan - Portfolio</h1>

<p align="center">
  <strong>A modern, responsive portfolio website for DevOps & Cloud enthusiasts</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react" alt="React 18.3.1">
  <img src="https://img.shields.io/badge/Vite-7.3.1-646CFF?style=for-the-badge&logo=vite" alt="Vite 7.3.1">
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript 5.8.3">
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License">
</p>

<p align="center">
  <a href="#demo-movie_camera">Demo</a> •
  <a href="#features-sparkles">Features</a> •
  <a href="#installation-arrow_down">Installation</a> •
  <a href="#usage-joystick">Usage</a> •
  <a href="#deployment-rocket">Deployment</a> •
  <a href="#tutorials-wrench">Tutorials</a>
</p>

---

## Overview

A professional portfolio website built with **React 18**, **Vite 7**, **TypeScript**, and **Tailwind CSS**. Features stunning 3D animations with Three.js, smooth Framer Motion transitions, and a contact form with Email & Telegram notifications.

---

## Demo :movie_camera:

<p align="center">
  <a href="https://hemanshu.dev" target="_blank">
    <strong>🚀 View Live Demo</strong>
  </a>
</p>

---

## Features :sparkles:

- ✅ **Modern Tech Stack**: React 18, Vite 7, TypeScript, Tailwind CSS
- ✅ **3D Animations**: Interactive cloud scene with Three.js & React Three Fiber
- ✅ **Smooth Animations**: Framer Motion for fluid transitions
- ✅ **Fully Responsive**: Optimized for all devices and screen sizes
- ✅ **Dark Theme**: Beautiful gradient design with glowing effects
- ✅ **Contact Form**: Integrated Email (Gmail) and Telegram notifications
- ✅ **Performance Optimized**: Code splitting and lazy loading
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
| **React Router** | 6.30.1 | Client-side routing |
| **shadcn/ui** | Latest | UI component library |
| **Express** | 4.18.2 | Backend server |
| **Nodemailer** | 6.9.7 | Email sending functionality |

---

## Installation :arrow_down:

### Prerequisites

| Tool | Minimum Version | Download Link |
| --- | --- | --- |
| **Node.js** | v24.x | [Download](https://nodejs.org/en/download/) |
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
git clone https://github.com/Hemanshubt/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### 3. Set Up Environment Variables

```bash
# Copy example env file (or create manually)
cp .env.example .env
cp server/.env.example server/.env
```

Edit the `.env` files with your values (see [Usage](#usage-joystick) section).

### 4. Run the Development Server

```bash
# Terminal 1: Run frontend
npm run dev

# Terminal 2: Run backend (for contact form)
cd server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Usage :joystick:

### Environment Variables Configuration

#### Root `.env` (for Vercel serverless functions)

```env
# Gmail Configuration
EMAIL_ADDRESS=your-email@gmail.com
GMAIL_PASSKEY=your-gmail-app-password

# Telegram Configuration (Optional)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

#### `server/.env` (for local Express server)

```env
# Gmail Configuration
EMAIL_ADDRESS=your-email@gmail.com
GMAIL_PASSKEY=your-gmail-app-password

# Telegram Configuration (Optional)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

#### Variable Descriptions

| Variable | Required | Description |
| --- | --- | --- |
| `EMAIL_ADDRESS` | Yes | Your Gmail address for sending emails |
| `GMAIL_PASSKEY` | Yes | Gmail app password (16 characters) |
| `TELEGRAM_BOT_TOKEN` | No | Token for Telegram bot notifications |
| `TELEGRAM_CHAT_ID` | No | Your Telegram chat ID for receiving messages |

> **Note**: Contact form requires Gmail configuration. Telegram is optional for additional notifications.

---

## Project Structure :file_folder:

```
├── src/
│   ├── components/     # React components (Hero, About, Projects, etc.)
│   ├── data/           # Static data (projects, skills, certifications)
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── pages/          # Page components (Index, ProjectDetail, NotFound)
├── server/             # Express backend for contact form
├── api/                # Vercel serverless functions
├── public/             # Static assets (images, resume PDF)
└── ...config files
```

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
<summary><strong>❌ Module not found errors</strong></summary>

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```
</details>

---

## Scripts :scroll:

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## License :page_with_curl:

This project is licensed under the **MIT License**.

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
