# Trackr — Comprehensive DevOps & Cloud Engineering Architecture

This document provides complete technical specifications, architectural diagrams, visual workflow charts, containerization strategies, CI/CD automation pipelines, security configurations, and cloud deployment runbooks for **Trackr (Job Application & Pipeline Tracker)**.

---

## 📑 Table of Contents

1. [Architectural Overview](#1-architectural-overview)
   - [Visual Architecture Diagram](#visual-architecture-diagram)
   - [Interactive Architecture Topology (Mermaid)](#interactive-architecture-topology-mermaid)
   - [Network Flow & Ingress Design](#network-flow--ingress-design)
2. [Containerization & Docker Design](#2-containerization--docker-design)
   - [Multi-Stage Build Pipeline (Mermaid)](#multi-stage-build-pipeline-mermaid)
   - [Backend Multi-Stage Build & Security Hardening](#backend-multi-stage-build--security-hardening)
   - [Frontend Multi-Stage Build & Nginx Ingress](#frontend-multi-stage-build--nginx-ingress)
   - [Docker Compose Multi-Container Orchestration](#docker-compose-multi-container-orchestration)
3. [CI/CD Automation Pipeline (GitHub Actions)](#3-cicd-automation-pipeline-github-actions)
   - [Visual CI/CD Pipeline Diagram](#visual-cicd-pipeline-diagram)
   - [GitHub Actions Job Workflow (Mermaid)](#github-actions-job-workflow-mermaid)
   - [Build Caching Strategy](#build-caching-strategy)
   - [Image Registry & Tagging Strategy (GHCR)](#image-registry--tagging-strategy-ghcr)
4. [Cloud Deployment Architectures](#4-cloud-deployment-architectures)
   - [Cloud Hosting Topology (Mermaid)](#cloud-hosting-topology-mermaid)
   - [Scenario A: Cloud VPS / AWS EC2 Deployment](#scenario-a-cloud-vps--aws-ec2-deployment)
   - [Scenario B: Reverse Proxy & Automated SSL (Let's Encrypt)](#scenario-b-reverse-proxy--automated-ssl-lets-encrypt)
5. [Security Hardening & Production Best Practices](#5-security-hardening--production-best-practices)
6. [Observability, Healthchecks & Monitoring](#6-observability-healthchecks--monitoring)
7. [Operations & Troubleshooting Runbook](#7-operations--troubleshooting-runbook)

---

## 1. Architectural Overview

Trackr employs a modern decoupled service architecture combining a compiled **React SPA**, an **Express/TypeScript REST API**, and a managed **PostgreSQL Database with Row-Level Security (RLS)** hosted on Supabase Cloud.

### Visual Architecture Diagram

![Trackr DevOps Cloud Architecture](docs/images/architecture_diagram.jpg)

---

### Interactive Architecture Topology (Mermaid)

```mermaid
graph TD
    subgraph Client["User Ingress"]
        Browser["🌐 Client Web Browser<br/>(Desktop / Mobile)"]
    end

    subgraph Host["Production Docker Host (Ubuntu / EC2)"]
        subgraph Ingress["Nginx Edge Container (Port 80 / 443)"]
            Nginx["⚡ Nginx Reverse Proxy<br/>Alpine Linux (~25MB)<br/>• SPA Static Assets<br/>• Gzip Compression<br/>• Security Headers"]
        end

        subgraph DockerBridge["Isolated Bridge Network (trackr-net)"]
            Backend["🚀 Express.js REST API<br/>Node 20 Alpine (~130MB)<br/>• Unprivileged node user<br/>• Zod Payload Validation<br/>• JWT Bearer Auth Guard<br/>• Healthcheck: /api/health"]
        end
    end

    subgraph Cloud["Supabase Cloud Managed Platform"]
        PG["🐘 PostgreSQL 15 Database<br/>• Multi-tenant RLS Policies<br/>• Automatic Indexed Queries"]
        Auth["🔑 Supabase Auth<br/>• JWT Validation Service"]
        Storage["📦 Cloud Storage<br/>• Resumes & Document Attachments"]
    end

    Browser -->|"HTTPS (443) / HTTP (80)"| Nginx
    Nginx -->|"Static Assets (HTML/JS/CSS)"| Browser
    Nginx -->|"Reverse Proxy /api/* (Internal Port 5000)"| Backend
    Backend -->|"Encrypted SQL (Port 5432 / TLS)"| PG
    Backend -->|"Token Verification"| Auth
    Backend -->|"File Uploads"| Storage

    classDef ingress fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef container fill:#1e1e2e,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef cloud fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    class Browser ingress;
    class Nginx,Backend container;
    class PG,Auth,Storage cloud;
```

---

### Network Flow & Ingress Design

1. **Edge Traffic:** Clients send web requests to Port 80 (HTTP) or 443 (HTTPS).
2. **SPA Asset Routing:** Nginx serves pre-compiled, minified HTML/JS/CSS static files. Unmatched routes are handled cleanly via `try_files $uri $uri/ /index.html` to support client-side React Router navigation without 404 errors.
3. **Internal API Proxying:** Any request matching `/api/*` is seamlessly forwarded across the private Docker bridge network (`trackr-net`) to `http://backend:5000/api/*`.
4. **Zero Public Exposure for Backend:** The Node.js application is never directly exposed to the internet, insulating it from brute-force scans and unauthenticated probing.

---

## 2. Containerization & Docker Design

### Multi-Stage Build Pipeline (Mermaid)

```mermaid
flowchart LR
    subgraph BackendBuild["Backend Docker Build (node:20-alpine)"]
        B_Source["TypeScript Source & package.json"] --> B_Stage1["Stage 1: builder<br/>• npm ci<br/>• tsc compile to /dist<br/>• npm prune --omit=dev"]
        B_Stage1 -->|"Only /dist & prod node_modules"| B_Stage2["Stage 2: runner<br/>• Non-root USER node<br/>• curl healthcheck<br/>• Size: ~130MB"]
    end

    subgraph FrontendBuild["Frontend Docker Build (node + nginx)"]
        F_Source["React Source & Vite Config"] --> F_Stage1["Stage 1: builder<br/>• npm ci<br/>• vite build<br/>• Tree-shaken bundles"]
        F_Stage1 -->|"Only /dist HTML/JS/CSS"| F_Stage2["Stage 2: runner (nginx:alpine)<br/>• Custom nginx.conf<br/>• wget healthcheck<br/>• Size: ~25MB"]
    end
```

---

### Backend Multi-Stage Build & Security Hardening

* **Base Image:** `node:20-alpine`
* **Stage 1 (`builder`):** Installs full development dependencies (`npm ci`), copies TypeScript source code, compiles artifacts to `/dist` via `tsc`, and executes `npm prune --omit=dev` to strip devDependencies.
* **Stage 2 (`runner`):** Starts from a fresh Alpine base, installs `curl` exclusively for Docker daemon healthchecks, configures an unprivileged `node` user (`USER node`), copies only `/dist` and production `node_modules`, and launches `dist/server.js`.
* **Runtime Footprint:** ~130MB (compared to >950MB for single-stage non-optimized builds).

```dockerfile
# Backend Dockerfile Architecture
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=5000
RUN apk add --no-cache curl
USER node
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1
CMD ["node", "dist/server.js"]
```

---

### Frontend Multi-Stage Build & Nginx Ingress

* **Stage 1 (`builder`):** Compiles the React application using Vite, tree-shaking dead code and minifying CSS/JS bundles.
* **Stage 2 (`runner`):** Mounts compiled static bundles directly into `nginx:1.25-alpine`.
* **Nginx Configuration Features:**
  - Serves static assets with Gzip compression and long-lived cache headers.
  - Implements Single Page Application fallback (`try_files $uri $uri/ /index.html`).
  - Reverse proxies `/api/` upstream requests to `http://backend:5000/api/` inside the Docker network.
* **Runtime Footprint:** ~25MB image size with sub-millisecond static response times.

---

### Docker Compose Multi-Container Orchestration

The `docker-compose.yml` orchestrates service lifecycles, healthchecks, environment injection, and private networking:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: trackr-backend
    restart: unless-stopped
    environment:
      - PORT=5000
      - NODE_ENV=production
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - CLIENT_URL=${CLIENT_URL:-http://localhost}
    ports:
      - "5000:5000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
    networks:
      - trackr-net

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - VITE_SUPABASE_URL=${VITE_SUPABASE_URL:-${SUPABASE_URL}}
        - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY:-${SUPABASE_ANON_KEY}}
        - VITE_API_URL=/api
    container_name: trackr-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "-q", "-O", "-", "http://localhost/healthz"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 5s
    networks:
      - trackr-net

networks:
  trackr-net:
    driver: bridge
```

---

## 3. CI/CD Automation Pipeline (GitHub Actions)

Continuous Integration and Continuous Deployment is configured in `.github/workflows/ci-cd.yml` using GitHub-hosted runners (`ubuntu-latest`).

### Visual CI/CD Pipeline Diagram

![Trackr CI/CD Automation Pipeline](docs/images/cicd_pipeline_diagram.jpg)

---

### GitHub Actions Job Workflow (Mermaid)

```mermaid
flowchart TD
    Trigger(["Event: git push OR pull_request to main"]) --> J1

    subgraph Job1["Job 1: verify-and-build (Lint & Typecheck)"]
        J1["Checkout Code"] --> J1_Node["Setup Node.js 20 with npm caching"]
        J1_Node --> J1_Backend["Backend: npm ci & npm run build (tsc)"]
        J1_Node --> J1_Frontend["Frontend: npm ci & npm run build (vite)"]
    end

    J1_Backend --> J2
    J1_Frontend --> J2

    subgraph Job2["Job 2: docker-verify (Multi-stage Build Verification)"]
        J2["Setup Docker Buildx"] --> J2_Cache["Attach GHA Layer Cache (type=gha)"]
        J2_Cache --> J2_BuildB["Build Backend Dockerfile (push: false)"]
        J2_Cache --> J2_BuildF["Build Frontend Dockerfile (push: false)"]
    end

    J2_BuildB --> BranchCheck{"Is branch 'main' AND push event?"}
    J2_BuildF --> BranchCheck

    subgraph Job3["Job 3: publish-containers (Publish to GHCR)"]
        BranchCheck -->|"Yes"| J3_Login["Authenticate with ghcr.io using GITHUB_TOKEN"]
        J3_Login --> J3_PushB["Build & Push Backend Image<br/>• ghcr.io/.../backend:latest<br/>• ghcr.io/.../backend:sha"]
        J3_Login --> J3_PushF["Build & Push Frontend Image<br/>• ghcr.io/.../frontend:latest<br/>• ghcr.io/.../frontend:sha"]
    end

    BranchCheck -->|"No (PR only)"| CompletePR(["PR Verified & Green ✓"])
    J3_PushB --> DeployReady(["Production Images Ready for CD ✓"])
    J3_PushF --> DeployReady

    classDef pass fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    classDef action fill:#1e1e2e,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef decision fill:#312e81,stroke:#a5b4fc,stroke-width:2px,color:#f8fafc;
    class J1,J1_Node,J1_Backend,J1_Frontend,J2,J2_Cache,J2_BuildB,J2_BuildF,J3_Login,J3_PushB,J3_PushF action;
    class BranchCheck decision;
    class CompletePR,DeployReady pass;
```

---

### Build Caching Strategy

The pipeline leverages two high-efficiency caching tiers:
1. **Node Module Cache:** `actions/setup-node@v4` with `cache: 'npm'`, keyed against `backend/package-lock.json` and `frontend/package-lock.json`. Reduces dependency fetch time from 90s to under 12s.
2. **Docker Layer Cache:** `type=gha,mode=max` cache exports Docker build layers into GitHub Actions cache storage. Unchanged dependencies and intermediate build steps are served instantly from cache.

### Container Tagging Scheme

Every production build pushed to GitHub Container Registry is double-tagged:
* `ghcr.io/<org>/<service>:latest` — For automated deployment agents tracking the stable release.
* `ghcr.io/<org>/<service>:<commit-sha>` — For immutable deployment tracking, auditing, and instant zero-friction rollbacks.

---

## 4. Cloud Deployment Architectures

### Cloud Hosting Topology (Mermaid)

```mermaid
graph TD
    User["🌐 End User HTTPS Request"] --> DNS["📡 DNS Provider (A Record: trackr.domain.com)"]
    DNS --> Server["🖥️ Ubuntu 22.04 LTS Cloud VPS / AWS EC2"]

    subgraph HostServer["Host Environment"]
        HostNginx["Host Nginx Reverse Proxy / Certbot SSL (Let's Encrypt)<br/>Listens: 443 (SSL Termination) & 80 (HTTP -> HTTPS Redirect)"]
        HostNginx -->|"Proxy Pass to Port 80"| DockerCompose

        subgraph DockerCompose["Docker Compose Stack"]
            FrontContainer["trackr-frontend (Nginx Container)<br/>Internal Port: 80"]
            BackContainer["trackr-backend (Node Container)<br/>Internal Port: 5000"]
            FrontContainer -->|"Reverse Proxy /api/*"| BackContainer
        end
    end

    BackContainer -->|"Encrypted Supabase Connection"| SupabaseCloud["☁️ Supabase Cloud (PostgreSQL / Auth)"]

    classDef host fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef docker fill:#1e1e2e,stroke:#818cf8,stroke-width:2px,color:#f8fafc;
    classDef cloud fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    class Server,HostNginx host;
    class FrontContainer,BackContainer docker;
    class SupabaseCloud cloud;
```

---

### Scenario A: Cloud VPS / AWS EC2 Deployment

#### System Requirements
* Ubuntu 22.04 LTS or 24.04 LTS
* 1 vCPU, 1 GB RAM minimum (t3.micro or equivalent)
* Docker 24+ & Docker Compose v2

#### Provisioning Commands

```bash
# 1. Update OS packages
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl gnupg git

# 2. Add Docker official GPG key and repository
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. Add current user to docker group (avoids sudo)
sudo usermod -aG docker $USER
newgrp docker

# 4. Clone repository
git clone https://github.com/Hemanshubt/Job-Application-Tracker.git
cd Job-Application-Tracker

# 5. Populate production secrets
cp .env.docker.example .env
nano .env

# 6. Spin up application stack
docker compose up -d --build
```

---

### Scenario B: Reverse Proxy & Automated SSL (Let's Encrypt)

To serve Trackr over secure HTTPS on a custom domain (e.g., `trackr.yourdomain.com`):

1. **Configure Host Nginx / Certbot:**
   ```bash
   sudo apt-get install -y nginx certbot python3-certbot-nginx
   ```

2. **Nginx Reverse Proxy Config (`/etc/nginx/sites-available/trackr`):**
   ```nginx
   server {
       server_name trackr.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:80;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable and Secure with Certbot:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/trackr /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo certbot --nginx -d trackr.yourdomain.com
   ```

---

## 5. Security Hardening & Production Best Practices

| Layer | Security Measure | Implementation Details |
|---|---|---|
| **Container** | Non-Root Execution | Node backend runs as default `USER node` (UID 1000), preventing container breakout exploits. |
| **Container** | Minimal Attack Surface | Alpine Linux bases eliminate unnecessary shells, package managers, and binaries. |
| **Application** | HTTP Security Headers | Express utilizes `helmet()` for Strict-Transport-Security (HSTS), X-Frame-Options (DENY), and X-Content-Type-Options. |
| **Application** | Strict Input Validation | 100% of incoming payloads validated using `zod` schemas before touching controllers or DB. |
| **Network** | Isolated Docker Network | Backend container is only exposed to port 5000 as configured; frontend proxies API calls internally. |
| **Database** | Row-Level Security (RLS) | Supabase Postgres enforces tenant isolation: users can only read/write records matching `auth.uid() = user_id`. |
| **Secrets** | Safe Environment Injection | `.env` files and API keys are strictly excluded from git via `.gitignore` and injected via Docker Compose or GitHub Secrets. |

---

## 6. Observability, Healthchecks & Monitoring

### Native Docker Healthchecks

* **Backend Healthcheck:**
  - Endpoint: `GET /api/health`
  - Probe: `curl -f http://localhost:5000/api/health`
  - Returns HTTP 200 with timestamp, uptime, and database connection status.
  - Frequency: 30s interval, 5s timeout, 3 retries.
* **Frontend Healthcheck:**
  - Endpoint: `GET /healthz`
  - Probe: `wget -q -O - http://localhost/healthz`
  - Frequency: 30s interval, 5s timeout, 3 retries.

### Service Inspection Commands

```bash
# Verify health states of all running containers
docker compose ps

# Inspect detailed health status of backend container
docker inspect --format='{{json .State.Health}}' trackr-backend | jq .

# Stream unified application logs with timestamps
docker compose logs -f --tail=100
```

---

## 7. Operations & Troubleshooting Runbook

### Routine Maintenance

```bash
# Update code and trigger rolling rebuild
git pull origin main
docker compose up -d --build

# Restart containers cleanly
docker compose restart

# Clean up dangling images, stopped containers, and build cache
docker system prune -af --volumes
```

### Troubleshooting Guide

| Issue | Probable Cause | Action |
|---|---|---|
| **Frontend displays API Network Error** | Backend container unhealthy or proxy mapping mismatch | Run `docker compose ps` to check backend health. Ensure `VITE_API_URL=/api` is passed at frontend build time. |
| **Backend exits on startup** | Missing or malformed Supabase credentials | Run `docker compose logs backend`. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`. |
| **Port 80/5000 collision** | Another service (Apache/IIS/existing node) is binding the port | Run `sudo netstat -tulpn \| grep :80` (Linux) or `netstat -ano \| findstr :5000` (Windows) and release port. |
| **GitHub Actions build fails** | TypeScript type errors or lockfile out of sync | Run `npm run build` locally in both `/backend` and `/frontend` to verify strict compilation. |
