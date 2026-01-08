import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github, ArrowRight, Cloud, DollarSign } from 'lucide-react';

const projects = [
  {
    title: 'Automated AWS Deployment with Kubernetes',
    description: 'Built a CI/CD pipeline for a Flask/MySQL application using Docker, Kubernetes, and Helm. Implemented high-availability architecture with Amazon EKS and Terraform.',
    tags: ['Docker', 'Kubernetes', 'Helm', 'Amazon EKS', 'Terraform', 'AWS VPC'],
    icon: Cloud,
    color: 'primary',
    highlights: ['High Availability', 'Scalable Design', 'Secure VPC'],
  },
  {
    title: 'Cost-Efficient CI/CD Pipeline',
    description: 'Developed a CI/CD pipeline with Jenkins and Terraform focusing on cost optimization. Created AWS Lambda functions for automation and CloudWatch for monitoring.',
    tags: ['Jenkins', 'Terraform', 'AWS Lambda', 'CloudWatch', 'Cost Explorer'],
    icon: DollarSign,
    color: 'secondary',
    highlights: ['Cost Optimized', 'Automated Testing', 'Real-time Monitoring'],
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="relative py-16 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="section-heading">Portfolio</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            My <span className="gradient-text">Projects</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Hands-on projects demonstrating practical DevOps skills and cloud infrastructure knowledge.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 sm:mt-16 sm:gap-8 lg:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="border-gradient group cursor-pointer"
            >
              <div className="p-4 sm:p-6 md:p-8">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between sm:mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12 ${
                    project.color === 'primary' ? 'bg-primary/10' :
                    project.color === 'secondary' ? 'bg-secondary/10' : 'bg-accent/10'
                  }`}>
                    <project.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      project.color === 'primary' ? 'text-primary' :
                      project.color === 'secondary' ? 'text-secondary' : 'text-accent'
                    }`} />
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:p-2">
                      <Github className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:p-2">
                      <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary sm:text-xl">
                  {project.title}
                </h3>
                <p className="mb-3 text-sm text-muted-foreground sm:mb-4 sm:text-base">{project.description}</p>

                {/* Highlights */}
                <div className="mb-3 flex flex-wrap gap-1.5 sm:mb-4 sm:gap-2">
                  {project.highlights.map((highlight, j) => (
                    <span
                      key={j}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium sm:px-3 sm:py-1 ${
                        project.color === 'primary' ? 'bg-primary/10 text-primary' :
                        project.color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                      }`}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:px-2 sm:py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View more link */}
                <div className="mt-4 flex items-center gap-2 font-medium text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 sm:mt-6">
                  <span className="text-sm sm:text-base">View Architecture</span>
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
