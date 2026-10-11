# Trackr — Production DevOps & Deployment Guide

This document covers complete deployment workflows for **Trackr** using **Docker**, **Docker Compose**, and **GitHub Actions CI/CD**.

---

## 🏗️ 1. Architecture Overview

```
                                  INTERNET
                                      │
                                      ▼
                        ┌──────────────────────────┐
                        │   PORT 80 / 443 (NGINX)  │
                        │    SPA Static Assets     │
                        └─────────────┬────────────┘
                                      │ Reverse Proxy (/api/*)
                                      ▼
                        ┌──────────────────────────┐
                        │  PORT 5000 (NODE/EXPRESS)│
                        │    REST API + Zod + JWT  │
                        └─────────────┬────────────┘
                                      │ PostgreSQL / RLS
                                      ▼
                        ┌──────────────────────────┐
                        │     SUPABASE CLOUD       │
                        │   Auth • DB • Storage    │
                        └──────────────────────────┘
```

* **Frontend:** Multi-stage build served via an optimized **Nginx** Alpine container. Handles SPA routing (`try_files`), Gzip compression, security headers, and reverse proxies `/api` to the backend.
* **Backend:** Multi-stage build running under an unprivileged `node` user on **Node 20 Alpine**, with built-in `/api/health` healthchecks.
* **Database & Storage:** Hosted on managed **Supabase** with Row-Level Security (RLS).

---

## 🐳 2. Local Docker Deployment (Quick Start)

### Step 1: Prepare Environment File
Copy the provided docker template to your `.env` file:
```bash
cp .env.docker.example .env
```
*(On Windows PowerShell: `Copy-Item .env.docker.example .env`)*

Fill in your actual Supabase credentials in `.env`:
```env
SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
CLIENT_URL=http://localhost
```

### Step 2: Build and Launch Containers
```bash
docker-compose up -d --build
```

### Step 3: Verify Running Services
```bash
docker-compose ps
```
You should see:
* `trackr-backend` (healthy, Port 5000)
* `trackr-frontend` (healthy, Port 80)

### Step 4: Open in Browser
* **Frontend App:** [http://localhost](http://localhost)
* **Backend Healthcheck:** [http://localhost/api/health](http://localhost/api/health)

### Stopping Containers:
```bash
docker-compose down
```

---

## ☁️ 3. Production Cloud Deployment (AWS EC2 / DigitalOcean / Ubuntu VPS)

### Step 1: Install Docker on your Linux Server
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Step 2: Clone Your Repository
```bash
git clone https://github.com/Hemanshubt/Job-Application-Tracker.git
cd Job-Application-Tracker
```

### Step 3: Configure Production `.env`
```bash
nano .env
```
Set your domain and Supabase keys:
```env
SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
CLIENT_URL=https://yourdomain.com
```

### Step 4: Launch in Production
```bash
docker compose up -d --build
```

---

## 🔒 4. Free SSL / HTTPS with Certbot (Let's Encrypt)

If you have a domain pointing to your server's IP address:

1. Install Certbot on the host:
```bash
sudo apt-get install -y certbot
```

2. Generate your certificate:
```bash
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

3. Mount the SSL certificates into your Nginx frontend container or use an Nginx host reverse proxy.

---

## ⚙️ 5. Automated CI/CD Pipeline (GitHub Actions)

The repository includes a ready-to-use GitHub Actions workflow at [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml):

### What Happens on Every `git push` to `main`:
1. **Verification Job:** Runs `npm ci` and TypeScript compilation (`npm run build`) on both frontend and backend to detect type errors.
2. **Docker Build Job:** Validates multi-stage Docker build cache and verifies container images compile cleanly without breaking dependencies.
3. **Container Registry Job:** Automatically publishes production-ready images to **GitHub Container Registry (GHCR)**:
   * `ghcr.io/hemanshubt/job-application-tracker/backend:latest`
   * `ghcr.io/hemanshubt/job-application-tracker/frontend:latest`

---

## 📊 6. Monitoring & Maintenance Commands

| Task | Command |
|---|---|
| **View Live Logs** | `docker-compose logs -f` |
| **Backend Logs Only** | `docker-compose logs -f backend` |
| **Frontend Logs Only** | `docker-compose logs -f frontend` |
| **Restart Services** | `docker-compose restart` |
| **Rebuild After Code Update** | `git pull && docker-compose up -d --build` |
| **Prune Unused Images** | `docker image prune -f` |
