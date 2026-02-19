import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';

// ── Snippet data ──────────────────────────────────────────────────────────────

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: string;
  iconBg: string;
  language: string;
  code: string;
}

const snippets: CodeSnippet[] = [
  {
    id: 'terraform',
    title: 'Terraform AWS Infrastructure',
    description:
      'Provisioning highly available AWS infrastructure with VPC, subnets, and auto-scaling groups using Terraform modules.',
    tags: ['Terraform', 'AWS', 'IaC', 'HCL'],
    icon: '🏗️',
    iconBg: 'from-violet-500/20 to-purple-600/20',
    language: 'hcl',
    code: `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = var.project_name
  cidr = var.vpc_cidr

  azs             = data.aws_availability_zones.available.names
  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  enable_nat_gateway   = true
  single_nat_gateway   = var.environment != "production"
  enable_dns_hostnames = true

  tags = merge(local.common_tags, {
    "kubernetes.io/cluster/\${var.cluster_name}" = "shared"
  })
}

resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = module.vpc.private_subnets
    endpoint_private_access = true
    endpoint_public_access  = var.environment != "production"
    security_group_ids      = [aws_security_group.cluster.id]
  }

  encryption_config {
    provider { key_arn = aws_kms_key.eks.arn }
    resources = ["secrets"]
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_policy,
    aws_cloudwatch_log_group.eks,
  ]
}`,
  },
  {
    id: 'kubernetes',
    title: 'Kubernetes Deployment Manifest',
    description:
      'Production-grade Kubernetes deployment with resource limits, health checks, rolling updates, and pod disruption budgets.',
    tags: ['Kubernetes', 'YAML', 'Helm', 'K8s'],
    icon: '☸️',
    iconBg: 'from-blue-500/20 to-cyan-500/20',
    language: 'yaml',
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-server
  namespace: production
  labels:
    app.kubernetes.io/name: api-server
    app.kubernetes.io/version: "2.4.1"
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: api-server
  template:
    metadata:
      labels:
        app: api-server
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "9090"
    spec:
      serviceAccountName: api-server
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: DoNotSchedule
      containers:
        - name: api-server
          image: registry.io/api-server:2.4.1
          ports:
            - containerPort: 8080
              name: http
            - containerPort: 9090
              name: metrics
          resources:
            requests:
              cpu: "250m"
              memory: "512Mi"
            limits:
              cpu: "1000m"
              memory: "1Gi"
          livenessProbe:
            httpGet:
              path: /healthz
              port: http
            initialDelaySeconds: 15
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5`,
  },
  {
    id: 'jenkins',
    title: 'Jenkins CI/CD Pipeline',
    description:
      'Declarative Jenkins pipeline with multi-stage builds, automated testing, security scanning, and deployment gates.',
    tags: ['Jenkins', 'CI/CD', 'Groovy', 'Pipeline'],
    icon: '🔄',
    iconBg: 'from-red-500/20 to-orange-500/20',
    language: 'groovy',
    code: `pipeline {
  agent { kubernetes { yamlFile 'build-pod.yaml' } }

  environment {
    REGISTRY    = credentials('docker-registry')
    SONAR_TOKEN = credentials('sonarqube-token')
    IMAGE_TAG   = "\${env.BUILD_NUMBER}-\${env.GIT_COMMIT[0..7]}"
  }

  stages {
    stage('Build & Test') {
      parallel {
        stage('Unit Tests') {
          steps {
            container('python') {
              sh 'pip install -r requirements.txt'
              sh 'pytest tests/ --cov=app --cov-report=xml'
            }
          }
          post { always { junit 'reports/*.xml' } }
        }
        stage('Lint & SAST') {
          steps {
            container('scanner') {
              sh 'sonar-scanner -Dsonar.token=$SONAR_TOKEN'
              sh 'trivy fs --severity HIGH,CRITICAL .'
            }
          }
        }
      }
    }

    stage('Build Image') {
      steps {
        container('docker') {
          sh """
            docker build -t \${REGISTRY}/app:\${IMAGE_TAG} \\
              --build-arg VERSION=\${IMAGE_TAG} .
            docker push \${REGISTRY}/app:\${IMAGE_TAG}
          """
        }
      }
    }

    stage('Deploy to Staging') {
      steps {
        container('helm') {
          sh """
            helm upgrade --install app ./charts/app \\
              --namespace staging \\
              --set image.tag=\${IMAGE_TAG} \\
              --wait --timeout 5m
          """
        }
      }
    }

    stage('Production Gate') {
      input {
        message "Deploy to production?"
        submitter "devops-leads"
      }
      steps {
        container('helm') {
          sh """
            helm upgrade --install app ./charts/app \\
              --namespace production \\
              --set image.tag=\${IMAGE_TAG} \\
              --set replicas=3 \\
              --wait --timeout 10m
          """
        }
      }
    }
  }
}`,
  },
  {
    id: 'docker',
    title: 'Docker Multi-Stage Build',
    description:
      'Optimised multi-stage Dockerfile with security hardening, non-root user, health checks, and minimal attack surface.',
    tags: ['Docker', 'Security', 'Multi-stage', 'Alpine'],
    icon: '🐳',
    iconBg: 'from-sky-500/20 to-blue-600/20',
    language: 'dockerfile',
    code: `# ── Stage 1: Build ────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /build
COPY requirements*.txt ./

RUN pip install --no-cache-dir --prefix=/install \\
    -r requirements.txt

COPY . .
RUN python -m compileall -b app/ && \\
    find app/ -name "*.py" -delete

# ── Stage 2: Production ──────────────────────────
FROM python:3.12-alpine AS production

LABEL maintainer="hemanshu@devops.engineer"
LABEL org.opencontainers.image.source="https://github.com/hemanshubt"

# Security hardening
RUN addgroup -g 1001 appgroup && \\
    adduser -u 1001 -G appgroup -D appuser && \\
    apk add --no-cache tini curl && \\
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY --from=builder /install /usr/local
COPY --from=builder /build/app ./app
COPY --from=builder /build/config ./config

RUN chown -R appuser:appgroup /app

USER appuser:appgroup

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \\
  CMD curl -f http://localhost:8080/healthz || exit 1

ENTRYPOINT ["tini", "--"]
CMD ["gunicorn", "app.main:create_app()", \\
     "--bind", "0.0.0.0:8080", \\
     "--workers", "4", \\
     "--timeout", "120"]`,
  },
  {
    id: 'python-automation',
    title: 'Python AWS Automation Script',
    description:
      'Automated AWS resource management with cost optimization, tagging enforcement, and Slack alerting via boto3.',
    tags: ['Python', 'Boto3', 'AWS', 'Automation'],
    icon: '🐍',
    iconBg: 'from-emerald-500/20 to-green-600/20',
    language: 'python',
    code: `import boto3
import json
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from typing import Iterator

@dataclass
class ResourceAuditor:
    """Audit and optimise AWS resources for cost efficiency."""

    session: boto3.Session = field(default_factory=boto3.Session)
    dry_run: bool = True
    max_age_days: int = 90

    def find_idle_instances(self) -> Iterator[dict]:
        """Detect EC2 instances with < 5% average CPU over 7 days."""
        ec2 = self.session.client("ec2")
        cw  = self.session.client("cloudwatch")

        paginator = ec2.get_paginator("describe_instances")
        for page in paginator.paginate(
            Filters=[{"Name": "instance-state-name", "Values": ["running"]}]
        ):
            for reservation in page["Reservations"]:
                for instance in reservation["Instances"]:
                    avg_cpu = self._get_avg_cpu(cw, instance["InstanceId"])

                    if avg_cpu < 5.0:
                        yield {
                            "instance_id": instance["InstanceId"],
                            "type": instance["InstanceType"],
                            "avg_cpu": round(avg_cpu, 2),
                            "launch_time": str(instance["LaunchTime"]),
                            "savings_estimate": self._estimate_savings(
                                instance["InstanceType"]
                            ),
                        }

    def cleanup_old_snapshots(self) -> list[str]:
        """Remove EBS snapshots older than max_age_days."""
        ec2 = self.session.client("ec2")
        cutoff = datetime.utcnow() - timedelta(days=self.max_age_days)
        deleted = []

        snapshots = ec2.describe_snapshots(OwnerIds=["self"])
        for snap in snapshots["Snapshots"]:
            if snap["StartTime"].replace(tzinfo=None) < cutoff:
                if not self.dry_run:
                    ec2.delete_snapshot(SnapshotId=snap["SnapshotId"])
                deleted.append(snap["SnapshotId"])

        return deleted

    def enforce_tagging(self, required: list[str]) -> list[dict]:
        """Find resources missing required tags."""
        tagging = self.session.client("resourcegroupstaggingapi")
        non_compliant = []

        paginator = tagging.get_paginator("get_resources")
        for page in paginator.paginate():
            for resource in page["ResourceTagMappingList"]:
                tags = {t["Key"] for t in resource.get("Tags", [])}
                missing = set(required) - tags
                if missing:
                    non_compliant.append({
                        "arn": resource["ResourceARN"],
                        "missing_tags": list(missing),
                    })

        return non_compliant`,
  },
];

// ── Token colouring (lightweight syntax highlighting) ──────────────────────

type TokenType = 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'type' | 'variable' | 'operator' | 'plain';

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: 'text-purple-400',
  string: 'text-emerald-400',
  comment: 'text-gray-500 italic',
  number: 'text-orange-400',
  function: 'text-blue-400',
  type: 'text-cyan-400',
  variable: 'text-sky-300',
  operator: 'text-pink-400',
  plain: 'text-gray-300',
};

function highlightLine(line: string, language: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  let remaining = line;
  let keyIdx = 0;

  const push = (text: string, type: TokenType) => {
    tokens.push(
      <span key={keyIdx++} className={TOKEN_COLORS[type]}>
        {text}
      </span>,
    );
  };

  // Comment detection
  if (/^\s*#/.test(remaining) || /^\s*\/\//.test(remaining)) {
    push(remaining, 'comment');
    return tokens;
  }

  // Tokenise with regex
  const pattern =
    /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d[\d.]*\b)|(#[^\s]+)|(\b(?:import|from|def|class|return|if|else|for|in|not|and|or|with|as|try|except|raise|True|False|None|self|module|resource|variable|output|data|provider|locals|source|version|name|apiVersion|kind|metadata|namespace|labels|spec|replicas|selector|template|containers|image|ports|resources|requests|limits|pipeline|agent|environment|stages|stage|steps|parallel|post|input|when|FROM|AS|WORKDIR|COPY|RUN|EXPOSE|CMD|ENTRYPOINT|LABEL|USER|HEALTHCHECK|ARG|ENV|ADD)\b)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(remaining)) !== null) {
    // Plain text before match
    if (match.index > lastIndex) {
      push(remaining.slice(lastIndex, match.index), 'plain');
    }

    if (match[1]) push(match[0], 'string');
    else if (match[2]) push(match[0], 'number');
    else if (match[3]) push(match[0], 'comment');
    else if (match[4]) push(match[0], 'keyword');
    else push(match[0], 'plain');

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < remaining.length) {
    push(remaining.slice(lastIndex), 'plain');
  }

  return tokens.length ? tokens : [<span key="0" className="text-gray-300">{line}</span>];
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CodeShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeSnippet, setActiveSnippet] = useState(snippets[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="code-showcase" className="relative py-16 md:py-32">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/5 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Code <span className="gradient-text">Showcase</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Explore my coding style through these snippets.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 flex flex-col gap-6 sm:mt-16 lg:flex-row"
        >
          {/* ── Left sidebar ─────────────────────────────────────── */}
          <div className="flex flex-row gap-3 overflow-x-auto pb-2 lg:w-[340px] lg:flex-shrink-0 lg:flex-col lg:overflow-x-visible lg:pb-0">
            {snippets.map((snippet) => {
              const isActive = snippet.id === activeSnippet.id;
              return (
                <button
                  key={snippet.id}
                  onClick={() => {
                    setActiveSnippet(snippet);
                    setCopied(false);
                  }}
                  className={`group flex min-w-[260px] items-start gap-4 rounded-xl border p-4 text-left transition-all duration-300 lg:min-w-0 ${isActive
                      ? 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/5'
                      : 'border-border/50 bg-card/40 hover:border-primary/20 hover:bg-card/60'
                    }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-lg ${snippet.iconBg}`}
                  >
                    {snippet.icon}
                  </div>

                  {/* Text */}
                  <div className="min-w-0">
                    <h3
                      className={`text-sm font-bold leading-tight transition-colors ${isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'
                        }`}
                    >
                      {snippet.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {snippet.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Right code viewer ────────────────────────────────── */}
          <div className="min-w-0 flex-1">
            <div className="overflow-hidden rounded-xl border border-border/50 bg-[hsl(222,47%,7%)]">
              {/* Header bar */}
              <div className="flex items-start justify-between gap-4 border-b border-border/40 px-5 py-4">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-foreground">
                    {activeSnippet.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activeSnippet.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeSnippet.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="flex flex-shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card/60 p-2 text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-primary"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Code block */}
              <div className="max-h-[480px] overflow-auto p-5 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/30 [&::-webkit-scrollbar-thumb:hover]:bg-primary/50 [scrollbar-width:thin] [scrollbar-color:hsl(191_100%_50%/0.3)_transparent]">
                <pre className="font-mono text-[13px] leading-relaxed overflow-x-auto">
                  <code>
                    {activeSnippet.code.split('\n').map((line, i) => (
                      <div key={`${activeSnippet.id}-${i}`} className="flex whitespace-pre">
                        <span className="mr-4 inline-block w-8 flex-shrink-0 select-none text-right text-gray-600">
                          {i + 1}
                        </span>
                        <span className="flex-1">{highlightLine(line, activeSnippet.language)}</span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
