import { motion } from 'framer-motion';

const toolsRow1 = [
  { name: 'GitHub Actions', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
  { name: 'Prometheus', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg' },
  { name: 'Grafana', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg' },
  { name: 'Ansible', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg' },
  { name: 'Helm', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/helm/helm-original.svg' },
  { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
  { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
  { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
];

const toolsRow2 = [
  { name: 'Terraform', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg' },
  { name: 'Grafana', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg' },
  { name: 'Prometheus', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg' },
  { name: 'Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
  { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'Jenkins', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg' },
  { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'Shell', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg' },
  { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
  { name: 'GitLab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg' },
];

export default function Marquee() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card/30 py-6 sm:py-8">
      {/* First row */}
      <div className="marquee-container mb-3 sm:mb-4">
        <motion.div
          className="flex gap-3 sm:gap-5"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...toolsRow1, ...toolsRow1].map((tool, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 sm:gap-3 sm:px-4 sm:py-2"
            >
              <img 
                src={tool.logo} 
                alt={tool.name}
                className="h-4 w-4 object-contain sm:h-5 sm:w-5"
              />
              <span className="whitespace-nowrap font-mono text-xs font-medium text-foreground sm:text-sm">
                {tool.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Second row - reverse direction */}
      <div className="marquee-container">
        <motion.div
          className="flex gap-3 sm:gap-5"
          animate={{ x: ['-50%', '0%'] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {[...toolsRow2, ...toolsRow2].map((tool, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 transition-all duration-300 hover:border-secondary/50 hover:bg-secondary/5 sm:gap-3 sm:px-4 sm:py-2"
            >
              <img 
                src={tool.logo} 
                alt={tool.name}
                className="h-4 w-4 object-contain sm:h-5 sm:w-5"
              />
              <span className="whitespace-nowrap font-mono text-xs font-medium text-foreground sm:text-sm">
                {tool.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
