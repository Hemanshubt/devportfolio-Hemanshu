import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';

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

        <div className="mt-10 grid gap-5 sm:mt-16 sm:gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="border-gradient group"
            >
              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="mb-3 flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    project.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
                  }`}>
                    <project.icon className={`h-5 w-5 ${
                      project.color === 'primary' ? 'text-primary' : 'text-secondary'
                    }`} />
                  </div>
                  {project.github !== '#' && (
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-primary/50 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary/20"
                    >
                      <Github className="h-4 w-4" />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="mb-2 text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                  {project.title}
                </h3>
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                {/* Highlights */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {project.highlights.map((highlight, j) => (
                    <span
                      key={j}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        project.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                      }`}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag, j) => (
                    <span
                      key={j}
                      className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>

                {/* View Details Link */}
                <Link 
                  to={`/project/${project.slug}`}
                  className="mt-4 flex items-center gap-2 font-medium text-primary transition-all duration-300 hover:gap-3"
                >
                  <span className="text-sm">View Details</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
