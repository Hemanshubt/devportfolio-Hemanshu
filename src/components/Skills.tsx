import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { GitBranch, Cloud, Container, FileCode, Activity, Database } from 'lucide-react';

const skillCategories = [
  {
    icon: GitBranch,
    title: 'CI/CD',
    color: 'primary',
    skills: ['GitHub Actions', 'Jenkins', 'GitLab CI', 'ArgoCD', 'CircleCI'],
  },
  {
    icon: Cloud,
    title: 'Cloud Platforms',
    color: 'secondary',
    skills: ['AWS', 'Azure', 'Google Cloud', 'DigitalOcean', 'Cloudflare'],
  },
  {
    icon: Container,
    title: 'Containers',
    color: 'accent',
    skills: ['Docker', 'Kubernetes', 'Helm', 'Podman', 'containerd'],
  },
  {
    icon: FileCode,
    title: 'Infrastructure as Code',
    color: 'primary',
    skills: ['Terraform', 'Ansible', 'Pulumi', 'CloudFormation', 'Chef'],
  },
  {
    icon: Activity,
    title: 'Monitoring',
    color: 'secondary',
    skills: ['Prometheus', 'Grafana', 'Datadog', 'ELK Stack', 'New Relic'],
  },
  {
    icon: Database,
    title: 'Databases & Storage',
    color: 'accent',
    skills: ['PostgreSQL', 'Redis', 'MongoDB', 'S3', 'Elasticsearch'],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" className="relative py-32">
      <div className="bg-grid-small pointer-events-none absolute inset-0 opacity-20" />
      
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="section-heading">Technical Stack</span>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A comprehensive toolkit for building, deploying, and maintaining cloud infrastructure at scale.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="skill-card group"
            >
              {/* Header */}
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  category.color === 'primary' ? 'bg-primary/10' :
                  category.color === 'secondary' ? 'bg-secondary/10' : 'bg-accent/10'
                }`}>
                  <category.icon className={`h-5 w-5 ${
                    category.color === 'primary' ? 'text-primary' :
                    category.color === 'secondary' ? 'text-secondary' : 'text-accent'
                  }`} />
                </div>
                <h3 className="font-mono text-lg font-semibold text-foreground">{category.title}</h3>
              </div>

              {/* Skills list */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="rounded-md border border-border bg-muted/50 px-3 py-1 font-mono text-xs text-muted-foreground transition-colors group-hover:border-primary/30 group-hover:text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Decorative element */}
              <div className={`absolute -right-2 -top-2 h-20 w-20 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0 ${
                category.color === 'primary' ? 'bg-primary/20' :
                category.color === 'secondary' ? 'bg-secondary/20' : 'bg-accent/20'
              }`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
