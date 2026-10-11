import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Github, ArrowRight, Layers, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { projects } from '@/data/projects';
import ProjectCardSkeleton from '@/components/ProjectCardSkeleton';
import CardSwap, { Card } from '@/components/CardSwap';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="projects" className="relative py-16 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
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

          {/* View Mode Switcher */}
          <div className="mt-6 flex items-center justify-center">
            <div className="inline-flex items-center rounded-xl border border-border/70 bg-card/60 p-1.5 backdrop-blur-md shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('deck')}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'deck'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>3D Deck Showcase</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>All Projects Grid</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(projects.length || 4)].map((_, i) => (
              <ProjectCardSkeleton key={`skeleton-${i}`} index={i} isInView={isInView} />
            ))}
          </div>
        ) : viewMode === 'deck' ? (
          /* ─────────────── 3D CardSwap Deck View ─────────────── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto mt-10 sm:mt-14 w-full"
          >
            <div className="relative mx-auto flex min-h-[580px] max-w-6xl flex-col lg:flex-row items-center justify-between gap-8 rounded-3xl border border-border/60 bg-gradient-to-br from-card/60 via-card/30 to-background/50 p-6 sm:p-10 backdrop-blur-md overflow-hidden shadow-2xl">
              {/* Left Panel: Overview & Instructions */}
              <div className="z-10 flex max-w-md flex-col items-start">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  REACT BITS • 3D CARD SWAP
                </span>
                <h3 className="mt-4 text-2xl font-bold sm:text-3xl text-foreground">
                  Explore Projects in <span className="gradient-text">3D Motion</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Interactive cards swap dynamically using GSAP spring physics. Hover anywhere to pause, click a card to view complete architecture details, or toggle grid mode.
                </p>

                <div className="mt-6 flex flex-col gap-2.5 w-full">
                  <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-3.5 py-2.5 text-xs">
                    <span className="text-base">☸️</span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Production EKS & Kubernetes</strong> orchestration
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-3.5 py-2.5 text-xs">
                    <span className="text-base">⚡</span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Automated CI/CD</strong> with Jenkins, Docker & Terraform
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-3.5 py-2.5 text-xs">
                    <span className="text-base">🛡️</span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">DevSecOps Gates</strong> with SonarQube and Trivy
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-card"
                  >
                    <span>View All in Grid</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Panel: CardSwap Deck Container */}
              <div className="relative flex h-[500px] w-full lg:w-[540px] items-center justify-center overflow-visible">
                <CardSwap
                  width={440}
                  height={370}
                  cardDistance={55}
                  verticalDistance={65}
                  delay={4500}
                  pauseOnHover={true}
                  skewAmount={5}
                  easing="elastic"
                  onCardClick={(idx) => {
                    const target = projects[idx];
                    if (target) navigate(`/project/${target.slug}`);
                  }}
                >
                  {projects.map((project) => (
                    <Card
                      key={project.slug}
                      customClass="group overflow-hidden rounded-2xl border border-primary/25 bg-card/95 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_hsl(var(--primary)/0.25)] flex flex-col justify-between select-none cursor-pointer"
                    >
                      <div>
                        {/* Header: Icon & Tags */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-md ${
                              project.color === 'primary'
                                ? 'bg-primary/15 text-primary border border-primary/30'
                                : 'bg-secondary/15 text-secondary border border-secondary/30'
                            }`}
                          >
                            <project.icon className="h-5 w-5" />
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {project.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="rounded-md border border-border/80 bg-muted/50 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Thumbnail */}
                        {project.image && (
                          <div className="relative mb-3 h-28 w-full overflow-hidden rounded-lg border border-border/40 bg-muted">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent" />
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Highlights */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.highlights.slice(0, 2).map((h, idx) => (
                            <span
                              key={idx}
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                                project.color === 'primary'
                                  ? 'bg-primary/10 text-primary border border-primary/20'
                                  : 'bg-secondary/10 text-secondary border border-secondary/20'
                              }`}
                            >
                              ✦ {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                        {project.github !== '#' ? (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Github className="h-4 w-4" />
                            <span>Source</span>
                          </a>
                        ) : (
                          <span />
                        )}

                        <Link
                          to={`/project/${project.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2.5 transition-all"
                        >
                          <span>View Details</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ─────────────── Classic Multi-Column Grid View ─────────────── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
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
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                        project.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
                      }`}
                    >
                      <project.icon
                        className={`h-4 w-4 ${
                          project.color === 'primary' ? 'text-primary' : 'text-secondary'
                        }`}
                      />
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
                  <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {project.highlights.slice(0, 2).map((highlight, j) => (
                      <span
                        key={j}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          project.color === 'primary'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary/10 text-secondary'
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
          </motion.div>
        )}
      </div>
    </section>
  );
}
