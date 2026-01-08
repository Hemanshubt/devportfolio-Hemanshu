import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';

const experiences = [
  {
    type: 'work',
    title: 'Senior DevOps Engineer',
    company: 'TechCorp Inc.',
    period: '2022 - Present',
    description: 'Leading cloud infrastructure initiatives, managing Kubernetes clusters, and implementing GitOps workflows for 50+ microservices.',
  },
  {
    type: 'work',
    title: 'DevOps Engineer',
    company: 'CloudScale Solutions',
    period: '2020 - 2022',
    description: 'Built CI/CD pipelines, automated infrastructure provisioning with Terraform, and reduced deployment times by 80%.',
  },
  {
    type: 'work',
    title: 'Systems Administrator',
    company: 'DataFlow Systems',
    period: '2018 - 2020',
    description: 'Managed Linux servers, implemented monitoring solutions, and led the migration to containerized workloads.',
  },
  {
    type: 'education',
    title: 'B.S. Computer Science',
    company: 'State University',
    period: '2014 - 2018',
    description: 'Focused on distributed systems and cloud computing. Graduated with honors.',
  },
];

export default function Timeline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" className="relative py-32">
      <div className="bg-grid-small pointer-events-none absolute inset-0 opacity-10" />
      
      <div className="relative mx-auto max-w-4xl px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="section-heading">Journey</span>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Experience & <span className="gradient-text">Education</span>
          </h2>
        </motion.div>

        <div className="relative mt-16">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-secondary to-accent md:left-1/2 md:-translate-x-px" />

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative mb-12 pl-12 md:w-1/2 md:pl-0 ${
                i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:ml-auto md:pl-12'
              }`}
            >
              {/* Timeline dot */}
              <div className={`absolute left-4 top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 md:top-2 ${
                exp.type === 'work' ? 'border-primary bg-primary/20' : 'border-secondary bg-secondary/20'
              } md:left-auto ${i % 2 === 0 ? 'md:-right-2 md:translate-x-1/2' : 'md:-left-2 md:-translate-x-1/2'}`}>
                <div className={`absolute inset-0 animate-ping rounded-full ${
                  exp.type === 'work' ? 'bg-primary' : 'bg-secondary'
                } opacity-20`} />
              </div>

              {/* Content */}
              <div className="border-gradient">
                <div className="p-6">
                  <div className={`mb-2 flex items-center gap-2 ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
                    {exp.type === 'work' ? (
                      <Briefcase className="h-4 w-4 text-primary" />
                    ) : (
                      <GraduationCap className="h-4 w-4 text-secondary" />
                    )}
                    <span className="font-mono text-sm text-muted-foreground">{exp.period}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground">{exp.title}</h3>
                  <p className={`font-medium ${exp.type === 'work' ? 'text-primary' : 'text-secondary'}`}>
                    {exp.company}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
