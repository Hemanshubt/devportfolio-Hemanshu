import { Cloud, Server, DollarSign, Database } from 'lucide-react';

export const projects = [
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

In today’s digital world, user engagement is key to the success of any application. This project aim to implement DevSecOps for deploying an **OpenAI Chatbot UI**. We utilize Kubernetes (EKS) for container orchestration, Jenkins for Continuous Integration/Continuous Deployment (CI/CD), and Docker for containerization.

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
        highlights: ['GitOps with Terraform', 'Full Observability Stack', 'Secure Jenkins Pipeline'],
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
    /* {
        slug: 'two-tier-flaskapp',
        title: 'Two-tier Flaskapp Deployment',
        description: 'A comprehensive CI/CD pipeline for deploying a two-tier Flask application using Docker containers and Kubernetes orchestration.',
        tags: ['Docker', 'Kubernetes', 'Flask', 'MySQL', 'Jenkins'],
        icon: Cloud,
        color: 'primary',
        highlights: ['High Availability', 'Scalable Design', 'Secure VPC'],
        github: 'https://github.com/Hemanshubt/two-tier-flaskapp',
        image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop',
        readme: {
            overview: 'A comprehensive CI/CD pipeline for deploying a two-tier Flask application using Docker containers and Kubernetes orchestration.',
            features: [
                'Containerized Flask application with Docker',
                'MySQL database integration with persistent storage',
                'Kubernetes deployment with auto-scaling',
                'Jenkins CI/CD pipeline automation',
                'Health checks and monitoring'
            ],
            architecture: [
                'Frontend: Flask Web Application',
                'Backend: MySQL Database',
                'Container: Docker with multi-stage builds',
                'Orchestration: Kubernetes with Helm charts',
                'CI/CD: Jenkins pipeline with automated testing'
            ],
            techStack: ['Python', 'Flask', 'MySQL', 'Docker', 'Kubernetes', 'Jenkins', 'Helm']
        },
        fullContent: `
## Project Overview
This project demonstrates the complete CI/CD automation and deployment of a two-tier Flask application. The application is containerized using Docker and orchestrated with Kubernetes, ensuring high availability and scalability.

## Key Features
- **Containerization**: Flask application and MySQL database are both containerized.
- **Orchestration**: Kubernetes handles deployment, scaling, and self-healing.
- **CI/CD Pipeline**: Automated Jenkins pipeline for building and deploying.
- **Infrastructure as Code**: Terraform used for provisioning AWS resources.
`
    }, */
    /* {
        slug: 'nodejs-todo-cicd',
        title: 'Node.js To-Do CI/CD Pipeline',
        description: 'Implemented an automated CI/CD pipeline for a Node.js To-Do application using Jenkins, Docker, and AWS infrastructure.',
        tags: ['Node.js', 'Jenkins', 'Docker', 'AWS', 'Terraform'],
        icon: Server,
        color: 'secondary',
        highlights: ['Cost Optimized', 'Automated Testing', 'Real-time Monitoring'],
        github: 'https://github.com/Hemanshubt/Node-todo-app-main',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop',
        readme: {
            overview: 'Implemented an automated CI/CD pipeline for a Node.js To-Do application using Jenkins, Docker, and AWS infrastructure.',
            features: [
                'Automated build and deployment pipeline',
                'Docker containerization for consistency',
                'AWS EC2 deployment with auto-scaling',
                'Terraform infrastructure as code',
                'Automated testing integration'
            ],
            architecture: [
                'Application: Node.js Express server',
                'Database: MongoDB/MySQL',
                'Infrastructure: AWS EC2, VPC, Security Groups',
                'IaC: Terraform for resource provisioning',
                'CI/CD: Jenkins with webhook triggers'
            ],
            techStack: ['Node.js', 'Express', 'Docker', 'Jenkins', 'AWS', 'Terraform']
        },
        fullContent: `
## Overview
A fully automated CI/CD pipeline for a Node.js To-Do application, focusing on cost optimization and reliability using AWS and Jenkins.

## Implementation Details
- **Docker**: Containerized the application for consistent environments across development and production.
- **Jenkins**: Automated the entire workflow from code commit to deployment.
- **Terraform**: Provisioned AWS infrastructure (EC2, VPC) as code.

## Monitoring
Integrated CloudWatch for real-time monitoring and log analysis.
`
    }, */
    /* {
        slug: 'scalable-aws-kubernetes',
        title: 'Scalable AWS Deployment with Kubernetes',
        description: 'Designed CI/CD pipeline for Flask/MySQL app, doubling capacity to 20,000 users. Achieved 99.9% uptime with Docker, Kubernetes, and Helm.',
        tags: ['Amazon EKS', 'Kubernetes', 'Helm', 'Terraform', 'AWS VPC'],
        icon: Cloud,
        color: 'primary',
        highlights: ['99.9% Uptime', '2x User Capacity', '80% Faster Setup'],
        github: '#',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
        readme: {
            overview: 'Designed and implemented a CI/CD pipeline for a Flask/MySQL application, doubling user capacity from 10,000 to 20,000 users.',
            features: [
                'Scalable Pipeline Design: Doubled user capacity to 20,000',
                'High-Availability System: 99.9% uptime, 60% reduced downtime',
                'Deployment Acceleration: 30% improved efficiency, 80% faster setup',
                'VPC Security Architecture: 100% internal traffic isolation'
            ],
            architecture: [
                'Container Orchestration: Amazon EKS',
                'Package Management: Helm Charts',
                'Infrastructure: Terraform IaC',
                'Networking: AWS VPC with private subnets',
                'Load Balancing: Application Load Balancer'
            ],
            techStack: ['Amazon EKS', 'Kubernetes', 'Helm', 'Terraform', 'AWS VPC', 'Docker', 'Flask', 'MySQL']
        },
        fullContent: `
## Scaling to 20k Users
This project focused on scaling a traditional Flask/MySQL application to handle high traffic using Amazon EKS.

## Technical Highlights
- **Elastic Kubernetes Service (EKS)**: Reliable orchestration for containerized workloads.
- **Helm Charts**: Managed complex K8s deployments with ease.
- **AWS VPC**: Secured internal traffic and isolated the database tier.
`
    }, */
    /* {
        slug: 'cost-efficient-cicd',
        title: 'Cost-Efficient CI/CD Pipeline Management',
        description: 'Achieved 40% cost reduction and 50% faster setup with Jenkins and Terraform. Automated resource management with AWS Lambda.',
        tags: ['Jenkins', 'Terraform', 'AWS Lambda', 'CloudWatch', 'Cost Explorer'],
        icon: DollarSign,
        color: 'secondary',
        highlights: ['40% Cost Reduction', '90% Automation', '30% More Reliable'],
        github: '#',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
        readme: {
            overview: 'Achieved a 40% reduction in infrastructure costs and a 50% faster setup time by refining the CI/CD pipeline with Jenkins and Terraform.',
            features: [
                'Cost Optimization: 40% infrastructure cost reduction',
                'Automation: 90% reduction in manual intervention',
                'Automated Reporting: 20% improved budget adherence',
                'Reliability Enhancement: 30% boost in pipeline reliability'
            ],
            architecture: [
                'CI/CD: Jenkins with optimized pipelines',
                'IaC: Terraform for resource management',
                'Serverless: AWS Lambda for automation',
                'Monitoring: AWS CloudWatch real-time alerts',
                'Cost Management: AWS Cost Explorer API integration'
            ],
            techStack: ['Jenkins', 'Terraform', 'AWS Lambda', 'CloudWatch', 'Cost Explorer', 'Python']
        },
        fullContent: `
## Cost Optimization Strategy
A project dedicated to reducing AWS spend while improving deployment speed.

## Key Outcomes
- **40% Cost Reduction**: Achieved through rightsizing resources and implementing automated cleanup.
- **Serverless Automation**: Used AWS Lambda to schedule start/stop of dev environments.
- **Terraform Refactoring**: Modularized IaC for faster environment provisioning.
`
    }, */
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
  --master-user-password YourStrongPassword123! \\
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
