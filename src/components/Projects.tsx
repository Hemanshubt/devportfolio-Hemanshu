import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Github, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import ProjectCardSkeleton from '@/components/ProjectCardSkeleton';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <>
              {[...Array(projects.length || 4)].map((_, i) => (
                <ProjectCardSkeleton key={`skeleton-${i}`} index={i} isInView={isInView} />
              ))}
            </>
          ) : (
            <>
              {projects.map((project, i) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="border-gradient group flex flex-col overflow-hidden"
                >
                  {/* Project Image */}
                  {project.image && (
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    {/* Header */}
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${project.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
                        }`}>
                        <project.icon className={`h-4 w-4 ${project.color === 'primary' ? 'text-primary' : 'text-secondary'
                          }`} />
                      </div>
                      {project.github !== '#' && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-primary/50 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-all hover:bg-primary/20"
                        >
                          <Github className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Code</span>
                        </a>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3 className="mb-2 text-base font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                      {project.title}
                    </h3>
                    <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

                    {/* Highlights */}
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {project.highlights.slice(0, 2).map((highlight, j) => (
                        <span
                          key={j}
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${project.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                            }`}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag, j) => (
                        <span
                          key={j}
                          className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="rounded-md border border-border bg-muted/30 px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* View Details Link */}
                    <div className="mt-auto">
                      <Link
                        to={`/project/${project.slug}`}
                        className="flex items-center gap-2 font-medium text-primary transition-all duration-300 hover:gap-3"
                        aria-label={`View details for ${project.title}`}
                      >
                        <span className="text-sm">View Details</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
