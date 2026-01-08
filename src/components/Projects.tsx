import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github, ArrowRight, Cloud, Server, GitBranch, DollarSign } from 'lucide-react';

const projects = [
  {
    title: 'Multi-Cloud Kubernetes Platform',
    description: 'Designed and implemented a multi-cloud Kubernetes platform spanning AWS and GCP, enabling seamless workload migration and disaster recovery.',
    tags: ['Kubernetes', 'Terraform', 'AWS', 'GCP', 'Helm'],
    icon: Cloud,
    color: 'primary',
    highlights: ['99.99% uptime', '3x deployment speed', '40% cost reduction'],
  },
  {
    title: 'GitOps CI/CD Pipeline',
    description: 'Built a fully automated GitOps pipeline using ArgoCD and GitHub Actions, reducing deployment time from hours to minutes.',
    tags: ['ArgoCD', 'GitHub Actions', 'Kubernetes', 'Kustomize'],
    icon: GitBranch,
    color: 'secondary',
    highlights: ['500+ daily deployments', 'Zero-downtime releases', 'Auto-rollback'],
  },
  {
    title: 'Infrastructure Cost Optimizer',
    description: 'Developed an intelligent cost optimization system using AWS Lambda and CloudWatch, automatically right-sizing resources.',
    tags: ['AWS Lambda', 'Python', 'CloudWatch', 'Terraform'],
    icon: DollarSign,
    color: 'accent',
    highlights: ['$50K/month saved', 'Auto-scaling', 'Real-time alerts'],
  },
  {
    title: 'Observability Stack',
    description: 'Implemented a comprehensive observability solution with Prometheus, Grafana, and Loki for logs, metrics, and traces.',
    tags: ['Prometheus', 'Grafana', 'Loki', 'Jaeger', 'AlertManager'],
    icon: Server,
    color: 'primary',
    highlights: ['10M+ metrics/day', '< 30s MTTR', 'Full-stack tracing'],
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="relative py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />
      
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="section-heading">Portfolio</span>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Real-world infrastructure solutions that deliver measurable business impact.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="border-gradient group cursor-pointer"
            >
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    project.color === 'primary' ? 'bg-primary/10' :
                    project.color === 'secondary' ? 'bg-secondary/10' : 'bg-accent/10'
                  }`}>
                    <project.icon className={`h-6 w-6 ${
                      project.color === 'primary' ? 'text-primary' :
                      project.color === 'secondary' ? 'text-secondary' : 'text-accent'
                    }`} />
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Github className="h-5 w-5" />
                    </button>
                    <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                  {project.title}
                </h3>
                <p className="mb-4 text-muted-foreground">{project.description}</p>

                {/* Highlights */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.highlights.map((highlight, j) => (
                    <span
                      key={j}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        project.color === 'primary' ? 'bg-primary/10 text-primary' :
                        project.color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                      }`}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="rounded-md border border-border bg-muted/30 px-2 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View more link */}
                <div className="mt-6 flex items-center gap-2 font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <span>View Architecture</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
