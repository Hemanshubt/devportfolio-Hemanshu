import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

const categories = [
  'All',
  'Languages',
  'OS',
  'DevOps',
  'Cloud',
  'Monitoring',
  'Database',
];

const skills = [
  { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', category: 'Languages' },
  { name: 'Shell', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg', category: 'Languages' },
  { name: 'Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', category: 'OS' },
  { name: 'Windows', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg', category: 'OS' },
  { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', category: 'DevOps' },
  { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', category: 'DevOps' },
  { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', category: 'DevOps' },
  { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', category: 'DevOps' },
  { name: 'Helm', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/helm/helm-original.svg', category: 'DevOps' },
  { name: 'Jenkins', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg', category: 'DevOps' },
  { name: 'GitLab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg', category: 'DevOps' },
  { name: 'Terraform', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg', category: 'DevOps' },
  { name: 'Ansible', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg', category: 'DevOps' },
  { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg', category: 'Cloud' },
  { name: 'Prometheus', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg', category: 'Monitoring' },
  { name: 'Grafana', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg', category: 'Monitoring' },
  { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', category: 'Database' },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="relative py-16 md:py-32">
      <div className="bg-grid-small pointer-events-none absolute inset-0 opacity-20" />
      
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="gradient-text">Skills</span>
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-12 sm:gap-3"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 font-medium transition-all duration-300 sm:px-6 sm:py-2.5 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/25'
                  : 'border border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              <span className="text-xs sm:text-sm">{category}</span>
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="mt-8 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 md:grid-cols-4 lg:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="group relative"
              >
                <div className="relative flex flex-col items-center justify-center rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-xl hover:shadow-primary/10 sm:p-8">
                  {/* Corner dots */}
                  <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary/50" />
                  <div className="absolute bottom-3 left-3 h-2 w-2 rounded-full bg-primary/50" />
                  
                  {/* Skill Icon */}
                  <div className="mb-4 flex h-16 w-16 items-center justify-center transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                    <img
                      src={skill.logo}
                      alt={skill.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  
                  {/* Skill Name */}
                  <h3 className="text-center font-medium text-foreground sm:text-lg">
                    {skill.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
