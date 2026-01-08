import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

const categories = [
  'All',
  'Languages',
  'OS',
  'Version Control',
  'Container/Orch',
  'CI/CD',
  'Cloud',
  'IaC',
  'Monitoring',
  'Database',
];

const skills = [
  // Languages
  { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', category: 'Languages' },
  { name: 'Shell', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg', category: 'Languages' },
  
  // OS
  { name: 'Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', category: 'OS' },
  { name: 'Windows', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg', category: 'OS' },
  
  // Version Control
  { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', category: 'Version Control' },
  { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', category: 'Version Control' },
  
  // Container/Orch
  { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', category: 'Container/Orch' },
  { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', category: 'Container/Orch' },
  { name: 'Helm', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/helm/helm-original.svg', category: 'Container/Orch' },
  
  // CI/CD
  { name: 'Jenkins', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg', category: 'CI/CD' },
  { name: 'GitLab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg', category: 'CI/CD' },
  
  // Cloud
  { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg', category: 'Cloud' },
  
  // IaC
  { name: 'Terraform', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg', category: 'IaC' },
  { name: 'Ansible', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg', category: 'IaC' },
  
  // Monitoring
  { name: 'Prometheus', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg', category: 'Monitoring' },
  { name: 'Grafana', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg', category: 'Monitoring' },
  
  // Database
  { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', category: 'Database' },
];

function FlipCard({ skill }: { skill: typeof skills[0] }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group perspective-1000 h-24 sm:h-32 md:h-36 lg:h-40 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-border bg-card/80 p-3 backdrop-blur-sm sm:p-4 md:p-5 lg:p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="mb-2 flex h-8 w-8 items-center justify-center sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16">
            <img
              src={skill.logo}
              alt={skill.name}
              className="h-full w-full object-contain"
            />
          </div>
          <h3 className="text-center text-[10px] font-medium text-foreground sm:text-xs md:text-sm lg:text-base">
            {skill.name}
          </h3>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-primary/50 bg-gradient-to-br from-primary/20 to-purple-500/20 p-3 backdrop-blur-sm sm:p-4 md:p-5 lg:p-6"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="mb-2 flex h-8 w-8 items-center justify-center sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16">
            <img
              src={skill.logo}
              alt={skill.name}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[8px] font-medium text-primary sm:px-2 sm:text-[10px] md:text-xs lg:text-sm">
            {skill.category}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

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
          className="mt-8 grid grid-cols-3 gap-2 sm:mt-12 sm:grid-cols-4 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <FlipCard skill={skill} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
