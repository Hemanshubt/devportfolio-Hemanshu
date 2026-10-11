import { Cloud, Server, DollarSign, Database, Briefcase } from 'lucide-react';

export const projects = [
    {
        slug: 'job-application-tracker',
        title: 'Trackr — Job Application Tracker',
        description: 'A production-grade, dark-dashboard Job Application Tracker engineered with React 18, Express, TypeScript, and Supabase PostgreSQL with RLS, featuring interactive Kanban boards, multi-stage Docker containerization, and GitHub Actions CI/CD to GHCR.',
        tags: ['Docker', 'GitHub Actions', 'Nginx', 'React 18', 'TypeScript', 'Node.js', 'Express', 'Supabase', 'PostgreSQL'],
        icon: Briefcase,
        color: 'primary',
        highlights: ['Docker Multi-Stage Builds', 'GitHub Actions CI/CD to GHCR', 'Supabase Auth & RLS'],
        github: 'https://github.com/Hemanshubt/Job-Application-Tracker',
        image: '/image.png',
        readme: {
            overview: 'Trackr is a high-performance, dark-dashboard Job Application Tracker engineered for modern tech job seekers. It features multi-stage Docker containerization, automated GitHub Actions CI/CD pipelines publishing to GitHub Container Registry (GHCR), an Nginx reverse proxy edge container, and Supabase PostgreSQL with database-level Row Level Security (RLS) policies.',
            features: [
                'Production Multi-Stage Docker builds on Alpine Linux with unprivileged USER node execution and healthchecks',
                'Nginx Edge reverse proxy with SPA client-side routing fallback, gzip compression, and internal API proxying',
                'Automated GitHub Actions CI/CD pipeline with dual-tier caching (npm cache + Docker GHA layer cache)',
                'Automated container publishing to GitHub Container Registry (GHCR) with semantic & commit-SHA tags',
                'Interactive Kanban application pipeline with drag-and-drop status stages (Wishlist, Applied, Interview, Offer, Rejected)',
                'Interview round scheduling with preparation notes, meeting links, and countdown timers',
                'Comprehensive Recruiter CRM with contact tracking, company associations, and communication logs',
                'PostgreSQL database with Row Level Security (RLS) policies for complete multi-tenant privacy',
                'Express TypeScript backend with Zod schema validation, Helmet security headers, and Morgan logging'
            ],
            architecture: [
                'Ingress: Nginx Reverse Proxy (Alpine ~25MB) serving static SPA bundles & routing /api',
                'Backend: Express.js REST API on Node 20 Alpine (~130MB) running as non-root user',
                'Database & Auth: Managed Supabase PostgreSQL with Row Level Security (RLS)',
                'CI/CD: GitHub Actions with GHA buildx layer caching & automated GHCR pushes',
                'Networking: Private isolated Docker bridge network (trackr-net)',
                'Orchestration: Docker Compose v2 with healthcheck probes and service dependency ordering'
            ],
            techStack: ['Docker', 'Docker Compose', 'GitHub Actions', 'GHCR', 'Nginx', 'React 18', 'TypeScript', 'Node.js', 'Express', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Zod', 'Vite']
        },
        fullContent: `
![Trackr Dashboard](/image.png)

## **Project Overview**

**[Trackr](https://github.com/Hemanshubt/Job-Application-Tracker)** is a high-performance, dark-dashboard **Job Application Tracker & Pipeline Management Platform** engineered for modern software engineers and job seekers. Navigating technical hiring loops requires managing concurrent application funnels, technical screens, take-home assignments, and recruiter communications. Trackr streamlines this process with a sleek, Linear-inspired interface, multi-stage Docker containerization, automated GitHub Actions CI/CD pipelines, and cloud database security.

### **Key Functional Highlights**
*   **Kanban Pipeline Board**: Visual workflow transitions from *Wishlist* ➔ *Applied* ➔ *Interview* ➔ *Offer* ➔ *Rejected*.
*   **Interview Schedule Tracker**: Round countdowns, meeting links, and preparation debrief notes.
*   **Recruiter CRM**: Centralized directory of recruiter contacts and interaction histories.
*   **Conversion Analytics**: Interactive funnel graphs and conversion ratios using Recharts.
*   **Supabase PostgreSQL + RLS**: Multi-tenant data isolation with database-level security policies.

---

## **☁️ 1. Cloud & DevOps Architecture**

Trackr employs a modern decoupled service architecture combining an optimized **React SPA**, an **Express/TypeScript REST API**, and a managed **PostgreSQL Database with Row-Level Security (RLS)** hosted on Supabase Cloud.

![Trackr DevOps Cloud Architecture](/architecture_diagram.jpg)

### **Network Flow & Ingress Design**
1.  **Edge Ingress:** Clients establish HTTPS (Port 443) or HTTP (Port 80) connections to the edge.
2.  **SPA Asset Routing:** Nginx serves pre-compiled, minified HTML/JS/CSS static files with Gzip compression and long-lived cache headers. Unmatched routes are handled cleanly via \`try_files $uri $uri/ /index.html\` to support client-side React Router navigation without 404 errors.
3.  **Internal API Proxying:** Any request matching \`/api/*\` is seamlessly forwarded across the private Docker bridge network (\`trackr-net\`) to \`http://backend:5000/api/*\`.
4.  **Zero Public Exposure for Backend:** The Node.js application is never directly exposed to the internet, insulating it from brute-force scans and unauthenticated probing.
5.  **Encrypted Supabase Connection:** Backend communicates directly with Supabase Cloud PostgreSQL over TLS-encrypted SQL connections with Row Level Security (RLS) enforcement.

---

## **🐳 2. Containerization & Docker Multi-Stage Builds**

Both frontend and backend services are containerized using multi-stage Docker builds designed for minimal runtime footprint, reproducible builds, and strict security hardening.

### **Backend Multi-Stage Build & Security Hardening**
*   **Base Image:** \`node:20-alpine\`
*   **Stage 1 (\`builder\`):** Installs full development dependencies (\`npm ci\`), compiles TypeScript artifacts to \`/dist\` via \`tsc\`, and executes \`npm prune --omit=dev\` to strip development packages.
*   **Stage 2 (\`runner\`):** Starts from a fresh Alpine base, installs \`curl\` exclusively for Docker daemon healthchecks, configures an unprivileged \`node\` user (\`USER node\`), copies only \`/dist\` and production \`node_modules\`, and launches \`dist/server.js\`.
*   **Runtime Footprint:** **~130MB** (compared to >950MB for non-optimized single-stage builds).

\`\`\`dockerfile
# Backend Dockerfile
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
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
  CMD curl -f http://localhost:5000/api/health || exit 1
CMD ["node", "dist/server.js"]
\`\`\`

### **Frontend Multi-Stage Build & Nginx Ingress**
*   **Stage 1 (\`builder\`):** Compiles the React application using Vite, tree-shaking dead code and minifying CSS/JS bundles.
*   **Stage 2 (\`runner\`):** Mounts compiled static bundles directly into \`nginx:1.25-alpine\`.
*   **Runtime Footprint:** **~25MB** image size with sub-millisecond static response times.

### **Docker Compose Multi-Container Orchestration**
The \`docker-compose.yml\` orchestrates service lifecycles, healthchecks, environment injection, and private networking:

\`\`\`yaml
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
      - SUPABASE_URL=\${SUPABASE_URL}
      - SUPABASE_ANON_KEY=\${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=\${SUPABASE_SERVICE_ROLE_KEY}
      - CLIENT_URL=\${CLIENT_URL:-http://localhost}
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
        - VITE_SUPABASE_URL=\${VITE_SUPABASE_URL:-\${SUPABASE_URL}}
        - VITE_SUPABASE_ANON_KEY=\${VITE_SUPABASE_ANON_KEY:-\${SUPABASE_ANON_KEY}}
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
\`\`\`

---

## **🚀 3. CI/CD Automation Pipeline (GitHub Actions)**

Continuous Integration and Continuous Deployment is configured in \`.github/workflows/ci-cd.yml\` using GitHub-hosted runners (\`ubuntu-latest\`).

![Trackr CI/CD Automation Pipeline](/cicd_pipeline_diagram.jpg)

### **Pipeline Execution Stages**
1.  **Git Developer Push:** Code changes committed and pushed to GitHub trigger the automated pipeline.
2.  **Verify & Lint (\`verify-and-build\`):** Runs TypeScript type-checking (\`tsc\`) and dependency audits across both frontend and backend in parallel using cached node modules.
3.  **Docker Build Verification (\`docker-verify\`):** Uses Docker Buildx with GitHub Actions Layer Cache (\`type=gha,mode=max\`) to test multi-stage image builds without redundant downloads.
4.  **Publish to GHCR (\`publish-containers\`):** On merge to \`main\`, builds and pushes production container images to GitHub Container Registry:
    *   \`ghcr.io/<org>/trackr-backend:latest\` & \`:<commit-sha>\`
    *   \`ghcr.io/<org>/trackr-frontend:latest\` & \`:<commit-sha>\`
5.  **Deploy to Docker Host:** Automated or manual rolling deployment pulls freshly tagged images and spins up containers with zero downtime.

### **Build Caching Strategy**
*   **Node Module Cache:** \`actions/setup-node@v4\` with \`cache: 'npm'\`, reducing dependency installation time from 90s to under 12s.
*   **Docker Layer Cache:** \`type=gha,mode=max\` exports intermediate build stages into GitHub Actions storage, ensuring instantaneous cache hits for unchanged layers.

---

## **🌐 4. Cloud Deployment Runbook (AWS EC2 / Ubuntu VPS)**

### **Step 1: Install Docker & Docker Compose**
\`\`\`bash
# Update OS packages and install Docker official repo
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y ca-certificates curl gnupg git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \\
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \\
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \\
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
\`\`\`

### **Step 2: Clone and Launch Application**
\`\`\`bash
git clone https://github.com/Hemanshubt/Job-Application-Tracker.git
cd Job-Application-Tracker

# Populate production secrets
cp .env.docker.example .env
nano .env

# Launch application stack
docker compose up -d --build
\`\`\`

### **Step 3: Host Nginx & Let's Encrypt SSL**
\`\`\`bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
sudo certbot --nginx -d trackr.yourdomain.com
\`\`\`

---

## **🛡️ 5. Production Security Hardening Matrix**

| Layer | Security Measure | Implementation Details |
|---|---|---|
| **Container** | Non-Root Execution | Node backend runs as unprivileged \`USER node\` (UID 1000), mitigating container breakout vulnerabilities. |
| **Container** | Minimal Attack Surface | Alpine Linux bases eliminate unnecessary shells, package managers, and extraneous binaries. |
| **Application** | HTTP Security Headers | Express utilizes \`helmet()\` for Strict-Transport-Security (HSTS), X-Frame-Options (DENY), and X-Content-Type-Options. |
| **Application** | Strict Input Validation | 100% of incoming payloads validated using \`zod\` schemas before touching controllers or DB. |
| **Network** | Isolated Docker Network | Backend container is only exposed to port 5000 as configured; frontend proxies API calls internally. |
| **Database** | Row-Level Security (RLS) | Supabase PostgreSQL enforces tenant isolation: users can only read/write records matching \`auth.uid() = user_id\`. |
| **Secrets** | Safe Environment Injection | API keys and secrets excluded from git and injected via Docker Compose or GitHub Secrets. |

---

## **Conclusion**
Trackr showcases a battle-tested cloud-native architecture uniting modern full-stack development with enterprise DevOps practices: multi-stage container optimization, automated CI/CD with GHCR, reverse proxy routing, and database-level security policies.
`
    },
    {
        slug: 'ai-chatbot-eks',
        title: 'AI Chatbot UI on Amazon EKS',
        description: 'Automated deployment of an OpenAI-powered Chatbot UI on Amazon EKS using Terraform for IaC and Jenkins for CI/CD, integrating DevSecOps best practices.',
        tags: ['OpenAI', 'Amazon EKS', 'Terraform', 'Jenkins', 'Docker', 'Kubernetes'],
        icon: Cloud,
        color: 'secondary',
        highlights: ['OpenAI API Integration', 'AWS EKS Orchestration', 'DevSecOps Pipeline'],
        github: 'https://github.com/Hemanshubt/ai-chatbot-eks-terraform-jenkins',
        image: 'https://imgur.com/MdxoqmL.png',
        readme: {
            overview: 'Deployment of an OpenAI-powered Chatbot UI application to Amazon EKS. This project demonstrates enterprise-grade automation using Terraform for infrastructure provisioning and Jenkins for orchestrating the CI/CD pipeline, following DevSecOps principles.',
            features: [
                'AI-powered conversational agent (OpenAI API)',
                'Automated EKS cluster provisioning with Terraform',
                'Comprehensive CI/CD pipeline in Jenkins',
                'Containerization using Docker with optimized builds',
                'Orchestration with Amazon EKS for scalability',
                'Integrated security scanning (SonarQube, Trivy, OWASP)'
            ],
            architecture: [
                'Application: OpenAI Chatbot UI (Node.js/React)',
                'Orchestration: Amazon EKS (Elastic Kubernetes Service)',
                'CI/CD: Jenkins (Self-hosted on EC2)',
                'Infrastructure: Terraform (S3 Backend, DynamoDB Locking)',
                'Security: SonarQube, Trivy, OWASP FS Scan',
                'Artifacts: Docker Hub Repository'
            ],
            techStack: ['OpenAI API', 'Amazon EKS', 'Terraform', 'Jenkins', 'Docker', 'Kubernetes', 'SonarQube', 'Trivy', 'OWASP']
        },
        fullContent: `
![Chatbot Banner](https://imgur.com/MdxoqmL.png)

## **Project Overview**

In today’s digital world, user engagement is key to the success of any application. This project aims to implement DevSecOps for deploying an **OpenAI Chatbot UI**. We utilize Kubernetes (EKS) for container orchestration, Jenkins for Continuous Integration/Continuous Deployment (CI/CD), and Docker for containerization.

### **Why ChatBOT?**

*   **Personalized Interactions:** ChatBOT enables human-like responses, fostering engagement.
*   **24/7 Availability:** Instant responses to user queries round the clock.
*   **Scalability:** Efficiently handle high volumes of user interactions on EKS.

## **☁️ Development & Deployment Workflow**

1.  **Containerization**: Light-weight Docker images for consistent deployment.
2.  **Infrastructure as Code**: Terraform automates the creation of VPC, EKS, and Node Groups.
3.  **Automated CI/CD**: Jenkins orchestrates the build, scan, and deploy pipeline.
4.  **DevSecOps Integration**: Continuous security via SonarQube, Trivy, and OWASP.

## **Infrastructure Details**

### **1. AWS Setup**
*   EC2 Instances for Jenkins, SonarQube, and monitoring tools.
*   VPC with public/private subnets and secure IAM roles.

### **2. Terraform Automation**
The EKS cluster is provisioned using Terraform with a secure remote backend (S3) and state locking (DynamoDB).

\`\`\`hcl
# Example Terraform Snippet for EKS
resource "aws_eks_cluster" "chatbot_cluster" {
  name     = "chatbot-eks-cluster"
  role_arn = aws_iam_role.eks_role.arn
  vpc_config {
    subnet_ids = aws_subnet.private_subnets[*].id
  }
}
\`\`\`

## **CI/CD Pipeline Architecture**

### **Build & Scan Stages**
1.  **Checkout**: Pull code from GitHub.
2.  **Install Dependencies**: Prepare the Node.js environment.
3.  **SonarQube**: Static analysis for code quality.
4.  **Quality Gate**: Automated check for security standards.
5.  **OWASP Scan**: Identification of vulnerable dependencies.
6.  **Trivy Scan**: Security audit for the filesystem and Docker image.

### **Deployment Stages**
1.  **Docker Push**: Upload images to Docker Hub.
2.  **Deployment**: Apply Kubernetes manifests to the EKS cluster.
3.  **Load Balancing**: DNS creation via AWS Classic Load Balancer.

## **Conclusion**
This project represents a modern, secure approach to deploying AI-integrated applications, bridging the gap between advanced models and production-ready infrastructure.
`
    },
    {
        slug: 'cloud-native-blog',
        title: 'Cloud Native Blog Platform',
        description: 'End-to-end CI/CD automation and deployment of a full-stack blogging application on AWS EKS using Terraform, Jenkins, and SonarQube.',
        tags: ['AWS EKS', 'Terraform', 'Jenkins', 'SonarQube', 'Prometheus', 'Grafana'],
        icon: Cloud,
        color: 'primary',
        highlights: ['Terraform', 'Full Observability Stack', 'Secure Jenkins Pipeline'],
        github: 'https://github.com/Hemanshubt/FullStack-Blogging-App',
        image: 'https://miro.medium.com/v2/resize:fit:720/format:webp/0*LdTGlxSTQHnTl9uy.gif',
        readme: {
            overview: 'A production-ready Full-stack Blogging Application built with Spring Boot, Docker, and Kubernetes. The project demonstrates a complete, enterprise-grade CI/CD journey using modern DevOps tools like Jenkins, SonarQube, Nexus, and Trivy, with full observability through Prometheus and Grafana.',
            features: [
                'Production-ready FullStack Blogging App (Spring Boot)',
                'Automated infrastructure provisioning with Terraform',
                'Comprehensive CI/CD pipeline orchestrated by Jenkins',
                'Static Code Analysis and Quality Gates with SonarQube',
                'Automated Security Scanning for containers using Trivy',
                'Artifact life-cycle management with Private Nexus',
                'Real-time monitoring with Prometheus and Grafana',
                'Automated Email Notifications for pipeline status'
            ],
            architecture: [
                'Cluster: AWS EKS with Managed Node Groups',
                'Infrastructure: VPC, Subnets, IGW via Terraform',
                'Security: RBAC, IAM Roles, SonarQube, Trivy',
                'Pipeline: Jenkins, GitHub Webhooks, Maven',
                'Storage: Nexus Artifact Repository, PostgreSQL (RDS)',
                'Observability: Prometheus, Grafana, Node Exporter'
            ],
            techStack: ['Spring Boot', 'Java', 'AWS EKS', 'Terraform', 'Jenkins', 'SonarQube', 'Docker', 'Kubernetes', 'Nexus', 'Trivy', 'Prometheus', 'Grafana']
        },
        fullContent: `
![](https://miro.medium.com/v2/resize:fit:720/format:webp/0*LdTGlxSTQHnTl9uy.gif)

### (A Spring Boot Application Deployed on AWS with EKS, Terraform, Jenkins, SonarQube, Nexus, Trivy & Prometheus/Grafana)

## **Project Overview**

A production-ready **[Full-stack Blogging Application](https://github.com/Hemanshubt/FullStack-Blogging-App)** built with Java (Spring Boot), Docker, and Kubernetes — fully automated using modern DevOps tools. This app supports posting, editing, and managing blogs with continuous delivery and security integration.

## **Features**

* Create, Edit, and Delete Blog Posts
* RESTful API using Spring Boot (Java)
* Static Code Analysis with SonarQube
* Vulnerability Scanning with Trivy
* Automated Build, Test, and Deploy Pipeline
* Kubernetes Deployment on AWS EKS
* Containerized using Docker
* CI/CD with Jenkins
* Secure Artifact Management via Nexus
* Email Notifications on Deployment via Jenkins

**Login Page**
![](https://miro.medium.com/v2/resize:fit:700/0*1TkD_l1YWmE6CPwz.png)

**Home Page**
![](https://miro.medium.com/v2/resize:fit:700/0*pFYg1X3ZAZ0STgcS.png)

**Status Post**
![](https://miro.medium.com/v2/resize:fit:700/0*6156xWhmbdVtlxYj.png)

## **☁️ DevOps & Deployment**
- **Docker & Kubernetes**: For containerization and orchestration.
- **AWS EKS**: Managed Kubernetes service.
- **Terraform**: Infrastructure as Code (IaC) for EKS cluster provisioning.
- **Jenkins**: Orchestrating the CI/CD pipeline.
- **SonarQube**: Ensuring code quality and security.
- **Nexus**: Private artifact repository.
- **Trivy**: Scanning container images for vulnerabilities.
- **Prometheus & Grafana**: Real-time monitoring and observability.

## **Infrastructure & Installation**

### **1. AWS Setup**
1. Default VPC
2. Security Group with port 80/443 open.
3. EC2 Instances for Jenkins, SonarQube, Nexus, and Monitoring.

### **2. Setup AWS EKS Cluster by Terraform**
Using Terraform to automate the creation of the EKS cluster, node groups, and necessary IAM roles.

\`\`\`hcl
provider "aws" {
  region = "ap-southeast-1"
}
resource "aws_eks_cluster" "hemanshu_dev" {
  name     = "hemanshu-cluster"
  role_arn = aws_iam_role.hemanshu_cluster_role.arn
  vpc_config {
    subnet_ids         = aws_subnet.hemanshu_subnet[*].id
    security_group_ids = [aws_security_group.hemanshu_cluster_sg.id]
  }
}
\`\`\`

### **3. RBAC Setup**
Implementing fine-grained access control within the EKS cluster for Jenkins service accounts.

### **4. CI/CD Pipeline Flow**
1. **GitHub Trigger**: Webhook starts the Jenkins build.
2. **Code Analysis**: SonarQube scans for bugs and vulnerabilities.
3. **Artifact Storage**: Nexus stores the built JAR files.
4. **Security Scan**: Trivy scans the Docker image.
5. **Deployment**: Kubectl applies the manifests to EKS.

## **Conclusion**
This project represents an enterprise-grade CI/CD implementation, bridging the gap between development and production with automated security and observability.
`
    },
    {
        slug: 'cloud-native-3tier-app',
        title: '3-Tier App on EKS',
        description: 'Deploying a production-ready 3-tier application (React + Flask + Postgres) on AWS EKS with high availability and secure infrastructure.',
        tags: ['AWS EKS', 'React', 'Flask', 'PostgreSQL', 'ALB', 'RDS'],
        icon: Database,
        color: 'secondary',
        highlights: ['Multi-AZ RDS', 'ALB Integration', 'OIDC Authentication'],
        github: 'https://github.com/Hemanshubt/cloud-native-3tier-app-eks',
        image: 'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*PB6jgC5b4bO0T3F-InbOLw.png',
        readme: {
            overview: 'Deployment of a production-grade 3-tier application stack consisting of a React frontend, Flask backend API, and a private PostgreSQL database. The project highlights high availability, secure networking, and cloud-native orchestration on AWS EKS.',
            features: [
                'Modern 3-tier architecture (React, Flask, Postgres)',
                'High availability with Multi-AZ RDS deployment',
                'Automated Load Balancing with AWS ALB Controller',
                'Secure networking with private subnets and SG isolation',
                'IAM Roles for Service Accounts (IRSA) for security',
                'Fine-grained access control with Kubernetes Namespaces',
                'Infrastructure automation using eksctl and Terraform'
            ],
            architecture: [
                'Frontend: React.js (Nginx/Kubernetes)',
                'Backend: Flask API (Python/Gunicorn)',
                'Database: AWS RDS PostgreSQL (Multi-AZ)',
                'Orchestration: Amazon EKS (v1.31)',
                'Traffic: Application Load Balancer + Ingress',
                'Provisioning: eksctl, Terraform, Helm'
            ],
            techStack: ['React', 'Flask', 'PostgreSQL', 'AWS EKS', 'ALB', 'RDS', 'Terraform', 'Helm', 'Docker', 'Route53', 'IAM', 'eksctl']
        },
        fullContent: `
![banner](https://miro.medium.com/v2/resize:fit:4800/format:webp/1*PB6jgC5b4bO0T3F-InbOLw.png)

I'll deploy a detailed 3-tier application on an EKS cluster. The application consists of a React frontend for the user interface, a Flask backend API for business logic, and a private connection to an RDS PostgreSQL database for persistent storage.

To expose the application publicly, I'll implement the AWS Load Balancer Controller to automatically provision and configure an Application Load Balancer through Kubernetes Ingress resources. I will use Kubernetes Secrets to store sensitive database credentials and ConfigMaps for configuration.

## **Why Kubernetes?**

Kubernetes has become the standard for running large-scale, containerized microservices. For this project, I used **AWS EKS**, which provides a managed control plane while offering flexibility in how worker nodes are managed (Managed Node Groups, Self-managed, or Fargate).

### **Cluster Provisioning with eksctl**

Using the \`eksctl\` utility, I created a cluster in the \`eu-west-1\` region with managed node groups for automated maintenance.

\`\`\`bash
eksctl create cluster \\
  --name Hemanshu-cluster \\
  --region eu-west-1 \\
  --version 1.31 \\
  --nodegroup-name standard-workers \\
  --node-type t3.medium \\
  --nodes 2 --nodes-min 1 --nodes-max 3 \\
  --managed
\`\`\`

### **Database Tier: RDS PostgreSQL**

The database is isolated in private subnets. I configured a custom DB subnet group and security groups to ensure that only the EKS cluster nodes can communicate with the database on port 5432.

\`\`\`bash
# Create the PostgreSQL RDS instance in the private subnet group
aws rds create-db-instance \\
  --db-instance-identifier hemanshu-postgres \\
  --db-instance-class db.t3.small \\
  --engine postgres \\
  --master-username postgresadmin \\
  --master-user-password <YOUR_SECURE_PASSWORD> \\
  --no-publicly-accessible \\
  --region eu-west-1
\`\`\`

### **Application Deployment**

1. **Namespace Isolation**: All resources are grouped within a dedicated namespace.
2. **ExternalName Service**: Used to map the RDS endpoint to a local Kubernetes DNS entry, keeping the application configuration clean.
3. **Secrets & ConfigMaps**: Sensitive credentials are stored in K8s Secrets, while non-sensitive configs are in ConfigMaps.
4. **Database Migrations**: A one-time Kubernetes **Job** was used to initialize the database schema before the backend deployment.

### **Networking & Load Balancing**

I implemented the **AWS Load Balancer Controller** to handle external traffic. By using Kubernetes Ingress resources, an Application Load Balancer (ALB) is automatically provisioned.

- **OIDC Integration**: Enabled IAM roles for service accounts, allowing the controller to manage AWS resources securely.
- **Route53**: Mapped the ALB DNS to a custom domain for a professional production URL.

## **Conclusion**

This 3-tier deployment on EKS showcases a modern cloud-native architecture. It combines the power of Kubernetes orchestration with AWS managed services like RDS and ALB to create a highly available, secure, and scalable web application.
`
    },
    {
        slug: 'jenkins-docker-aws',
        title: 'Jenkins Docker Deployment',
        description: 'Building a CI/CD pipeline with Jenkins to deploy application code inside Docker containers on AWS infrastructure.',
        tags: ['Jenkins', 'Docker', 'AWS', 'CI/CD', 'Java'],
        icon: Server,
        color: 'primary',
        highlights: ['Automated Pipeline', 'Containerized Java App', 'EC2 Deployment'],
        github: 'https://github.com/Hemanshubt/jenkins-docker-aws-deployment',
        image: 'https://imgur.com/Hk28ffE.png',
        readme: {
            overview: 'Automated CI/CD pipeline development for deploying Java-based Web applications on AWS infrastructure. The project focuses on containerization using Docker, automation with Jenkins, and artifact management to ensure reliable and repeatable deployments.',
            features: [
                'End-to-end automation from code commit to deployment',
                'Custom Dockerfile optimization for Tomcat environments',
                'Secure artifact transfer via Publish Over SSH',
                'Integration with Maven for multi-stage Java builds',
                'Scalable infrastructure deployment on AWS EC2',
                'Automated build triggers using GitHub webhooks'
            ],
            architecture: [
                'Application: Java Web App (WAR based)',
                'Container: Tomcat Server on Docker',
                'CI/CD: Jenkins (EC2 hosted)',
                'Build: Apache Maven Integration',
                'Deployment: Remote Docker Host via SSH',
                'Version Control: GitHub Repository'
            ],
            techStack: ['Jenkins', 'Docker', 'AWS EC2', 'Maven', 'Git', 'Java', 'Tomcat', 'Bash']
        },
        fullContent: `
![AWS](https://imgur.com/Hk28ffE.png)

**In this blog, we are going to deploy a Java Web app on a Docker Container built on an EC2 Instance through the use of Jenkins.**

### Agenda

* Setup Jenkins
* Setup & Configure Maven and Git
* Integrating GitHub and Maven with Jenkins
* Setup Docker Host
* Integrate Docker with Jenkins
* Automate the Build and Deploy process using Jenkins
* Test the deployment

### Prerequisites

* AWS Account
* Git/ Github Account with the Source Code
* A local machine with CLI Access
* Familiarity with Docker and Git

## Step 1: Setup Jenkins Server on AWS EC2 Instance

* Setup a Linux EC2 Instance
* Install Java
* Install Jenkins
* Start Jenkins
* Access Web UI on port 8080

![AWS](https://miro.medium.com/v2/resize:fit:750/format:webp/0*dV_5siwtpbY49t_K.png)

_Choose an Instance Type. Here you can select the type of machine, number of vCPUs, and memory that you want to have. Select t2.micro which is free-tier eligible._

![AWS](https://miro.medium.com/v2/resize:fit:750/format:webp/0*Nj8W-En4DMzUa0TC.png)

_After logging in to our EC2 machine we will install Jenkins following the instructions from the official Jenkins website._

### To use this repository, run the following command

\`\`\`bash
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
\`\`\`

![aws](https://miro.medium.com/v2/resize:fit:750/format:webp/0*wif0l1ItRl1SlNN_.png)

_After successful installation Let’s enable and start Jenkins service in our EC2 Instance:_

![aws](https://miro.medium.com/v2/resize:fit:750/format:webp/0*BxCkL2r04frbDQ2A.png)

_Now let’s try to access the Jenkins server through our browser. For that take the public IP of your EC2 instance and paste it into your favorite browser._

![aws](https://miro.medium.com/v2/resize:fit:750/format:webp/0*Mn0ugcNeNwuNSu3V.png)

## Step 2: Integrate GitHub with Jenkins

* Install Git on Jenkins Instance
* Install Github Plugin on Jenkins GUI
* Configure Git on Jenkins GUI

_To install the GitHub plugin lets go to our Jenkins Dashboard and click on manage Jenkins as shown:_

![aws](https://miro.medium.com/v2/resize:fit:750/format:webp/0*AR9Ca27W0FPLhnC-.png)

## Step 3: Integrate Maven with Jenkins

* Setup Maven on Jenkins Server
* Setup Environment Variables
* Install Maven Plugin
* Configure Maven and Java

_In the .bash_profile file, we need to add Maven and Java paths and load these values._

![aws](https://miro.medium.com/v2/resize:fit:750/format:webp/0*k9mlHgGhKh-qVQIq.png)

_With this setup, we can execute maven commands from anywhere on the server._

![aws](https://miro.medium.com/v2/resize:fit:750/format:webp/0*KLnWUBRPgalA64j2.png)

## Step 4: Setup a Docker Host

* Setup a Linux EC2 Instance
* Install Docker
* Start Docker Services

_After the successful installation of Docker, let’s verify the version of Docker:_

![aws](https://miro.medium.com/v2/resize:fit:640/format:webp/1*1XGvnuTTcQE_qW9P9TUUcg.png)

### Create Tomcat Docker Container

_We will first pull the official Tomcat docker image from the Docker Hub and then run the container out of the same image._

\`\`\`bash
docker run -d --name tomcat-container -p 8081:8080 tomcat
\`\`\`

![aws](https://miro.medium.com/v2/resize:fit:750/format:webp/1*L0ObxA2aFZTL21fNZO7_jw.png)

### Customized Dockerfile
To avoid common "404" errors with Tomcat's default container, we use a custom Dockerfile:
\`\`\`dockerfile
FROM tomcat:latest
RUN cp -R /usr/local/tomcat/webapps.dist/* /usr/local/tomcat/webapps
COPY ./*.war /usr/local/tomcat/webapps
\`\`\`

## Step 5: Integrate Docker with Jenkins

* Create a dockeradmin user
* Install the “Publish Over SSH” plugin
* Add Dockerhost to Jenkins “configure systems”

_Using the **Publish Over SSH** plugin, we enable Jenkins to securely transfer the generated artifacts (WAR files) to the Docker Host._

![aws](https://miro.medium.com/v2/resize:fit:750/format:webp/1*3hnLNy9fWJ036nHBTMjLbA.png)

## Step 6: Automate Build and Deployment

_The final pipeline is triggered by code commits. Jenkins builds the project using Maven, transfers the artifact via SSH to the Docker host, builds a new image using our Dockerfile, and launches the container._

\`\`\`bash
cd /opt/docker;
docker build -t regapp:v1 .;
docker run -d --name registerapp -p 8087:8080 regapp:v1
\`\`\`

![aws](https://miro.medium.com/v2/resize:fit:750/format:webp/1*D2aGmqZ8Uh1p4Fmz_nHsVg.png)

## Conclusion

This project successfully automates the deployment of a Java application into a containerized environment on AWS, demonstrating a professional CI/CD workflow.
`
    }
];
