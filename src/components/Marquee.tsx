import { motion } from 'framer-motion';

const tools = [
  'Docker',
  'Kubernetes',
  'AWS',
  'Terraform',
  'Jenkins',
  'GitHub Actions',
  'Linux',
  'Prometheus',
  'Grafana',
  'Ansible',
  'ArgoCD',
  'Helm',
  'Azure',
  'GCP',
  'GitLab CI',
  'Vault',
];

export default function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card/30 py-8">
      {/* First row */}
      <div className="marquee-container mb-4">
        <motion.div
          className="flex gap-8"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...tools, ...tools].map((tool, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-3 rounded-lg border border-border bg-card px-6 py-3 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="whitespace-nowrap font-mono text-sm font-medium text-foreground">
                {tool}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Second row - reverse direction */}
      <div className="marquee-container">
        <motion.div
          className="flex gap-8"
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...tools.reverse(), ...tools].map((tool, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-3 rounded-lg border border-border bg-card px-6 py-3 transition-all duration-300 hover:border-secondary/50 hover:bg-secondary/5"
            >
              <div className="h-2 w-2 rounded-full bg-secondary" />
              <span className="whitespace-nowrap font-mono text-sm font-medium text-foreground">
                {tool}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
