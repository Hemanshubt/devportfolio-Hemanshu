import { Cloud, Server, DollarSign } from 'lucide-react';

export const projects = [
  {
    slug: 'two-tier-flaskapp',
    title: 'Two-tier Flaskapp Deployment',
    description: 'A comprehensive CI/CD pipeline for deploying a two-tier Flask application using Docker containers and Kubernetes orchestration.',
    tags: ['Docker', 'Kubernetes', 'Flask', 'MySQL', 'Jenkins'],
    icon: Cloud,
    color: 'primary',
    highlights: ['High Availability', 'Scalable Design', 'Secure VPC'],
    github: 'https://github.com/Hemanshubt/two-tier-flaskapp',
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
    }
  },
  {
    slug: 'nodejs-todo-cicd',
    title: 'Node.js To-Do CI/CD Pipeline',
    description: 'Implemented an automated CI/CD pipeline for a Node.js To-Do application using Jenkins, Docker, and AWS infrastructure.',
    tags: ['Node.js', 'Jenkins', 'Docker', 'AWS', 'Terraform'],
    icon: Server,
    color: 'secondary',
    highlights: ['Cost Optimized', 'Automated Testing', 'Real-time Monitoring'],
    github: 'https://github.com/Hemanshubt/Node-todo-app-main',
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
    }
  },
  {
    slug: 'scalable-aws-kubernetes',
    title: 'Scalable AWS Deployment with Kubernetes',
    description: 'Designed CI/CD pipeline for Flask/MySQL app, doubling capacity to 20,000 users. Achieved 99.9% uptime with Docker, Kubernetes, and Helm.',
    tags: ['Amazon EKS', 'Kubernetes', 'Helm', 'Terraform', 'AWS VPC'],
    icon: Cloud,
    color: 'primary',
    highlights: ['99.9% Uptime', '2x User Capacity', '80% Faster Setup'],
    github: '#',
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
    }
  },
  {
    slug: 'cost-efficient-cicd',
    title: 'Cost-Efficient CI/CD Pipeline Management',
    description: 'Achieved 40% cost reduction and 50% faster setup with Jenkins and Terraform. Automated resource management with AWS Lambda.',
    tags: ['Jenkins', 'Terraform', 'AWS Lambda', 'CloudWatch', 'Cost Explorer'],
    icon: DollarSign,
    color: 'secondary',
    highlights: ['40% Cost Reduction', '90% Automation', '30% More Reliable'],
    github: '#',
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
    }
  },
];
