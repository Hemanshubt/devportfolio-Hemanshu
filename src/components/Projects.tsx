import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  Github,
  ArrowRight,
  Terminal,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';
import ProjectCardSkeleton from '@/components/ProjectCardSkeleton';

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'terminal' | 'grid'>('terminal');

  const activeTabRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const activeProject = projects[selectedIndex] || projects[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  // Keep active tab in view inside the scrollable tabs bar
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [selectedIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX.current - touchEndX;
    if (Math.abs(diffX) > 60) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section id="projects" className="relative py-16 md:py-32 pb-28 sm:pb-32 scroll-mt-16">
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
            Production-grade cloud infrastructure, automated CI/CD pipelines, and full-stack DevOps applications.
          </p>

          {/* View Mode Switcher */}
          <div className="mt-6 flex items-center justify-center">
            <div className="inline-flex items-center rounded-xl border border-border/70 bg-card/60 p-1.5 backdrop-blur-md shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('terminal')}
                className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === 'terminal'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Terminal className="h-3.5 w-3.5" />
                <span>DevOps CLI Showcase</span>
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
        ) : viewMode === 'terminal' ? (
          /* ─────────────── Interactive DevOps Terminal Workstation ─────────────── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 sm:mt-14"
          >
            {/* Terminal Window Chrome */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="overflow-hidden rounded-2xl border border-border/80 bg-[hsl(222,47%,4%)] shadow-2xl backdrop-blur-xl"
            >
              {/* Terminal Title Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-[hsl(222,47%,6%)] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-2 font-mono text-xs text-muted-foreground hidden sm:inline">
                    hemanshu@devops-workstation: ~/projects/deployments (bash)
                  </span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground sm:hidden">
                    ~/projects/deployments
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    STATUS: PRODUCTION
                  </span>
                  <span className="font-mono text-xs text-muted-foreground/60 hidden md:inline">
                    v2.4.0
                  </span>
                </div>
              </div>

              {/* Terminal Sub-header / CLI Directory Navigation */}
              <div className="flex items-center border-b border-white/5 bg-[hsl(222,47%,5%)] px-2 sm:px-6">
                {/* Horizontal Scrollable Tabs */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 px-1 flex-1 min-w-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <span className="font-mono text-xs text-primary font-bold mr-1 shrink-0 select-none">$ cd:</span>
                  {projects.map((project, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={project.slug}
                        ref={isSelected ? activeTabRef : null}
                        onClick={() => setSelectedIndex(idx)}
                        className={`relative shrink-0 rounded-lg px-2.5 py-1 font-mono text-xs font-medium transition-all whitespace-nowrap ${
                          isSelected
                            ? 'text-primary bg-primary/15 border border-primary/40 shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <span className="opacity-60 mr-1">0{idx + 1}.</span>
                        {project.slug}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Prev / Next Arrows - Fixed on the right */}
                <div className="flex items-center gap-1 pl-2 sm:pl-4 shrink-0 border-l border-white/10 bg-[hsl(222,47%,5%)]">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous project"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors active:scale-95"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-1.5 font-mono text-[11px] sm:text-xs text-muted-foreground whitespace-nowrap">
                    {selectedIndex + 1}/{projects.length}
                  </span>
                  <button
                    onClick={handleNext}
                    aria-label="Next project"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors active:scale-95"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Main Terminal Shell Body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-8"
                >
                  {/* Left Column: Command Prompt & System Readout */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                    <div>
                      {/* Simulated Command prompt */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[11px] sm:text-xs text-muted-foreground mb-4">
                        <span className="text-secondary font-bold shrink-0">hemanshu@prod:</span>
                        <span className="text-primary font-medium shrink-0">~/{activeProject.slug}</span>
                        <span className="text-muted-foreground/60 shrink-0">$</span>
                        <span className="text-foreground font-semibold shrink-0">kubectl inspect --target release</span>
                      </div>

                      {/* Project Title & Badge */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                            activeProject.color === 'primary'
                              ? 'bg-primary/15 border-primary/40 text-primary'
                              : 'bg-secondary/15 border-secondary/40 text-secondary'
                          }`}
                        >
                          <activeProject.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                            {activeProject.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                            <span className="text-primary">● Status: Stable</span>
                            <span>•</span>
                            <span>Release 2026</span>
                          </div>
                        </div>
                      </div>

                      {/* Description Output */}
                      <div className="mt-4 rounded-xl border border-white/5 bg-[hsl(222,47%,3%)] p-4 font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <span className="text-primary font-bold mr-2">&gt;&gt;</span>
                        {activeProject.description}
                      </div>

                      {/* System Specifications / Highlights */}
                      <div className="mt-5">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                          Architecture Highlights
                        </span>
                        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {activeProject.highlights.map((highlight, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 font-mono text-xs text-foreground/90"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="truncate">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack Matrix */}
                      <div className="mt-5">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                          Deployed Stack
                        </span>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {activeProject.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Terminal Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-white/5 pt-5">
                      <Link
                        to={`/project/${activeProject.slug}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 sm:py-2.5 font-mono text-xs sm:text-sm font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all text-center"
                      >
                        <span>View Architecture Blueprint</span>
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </Link>

                      {activeProject.github !== '#' && (
                        <a
                          href={activeProject.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 sm:py-2.5 font-mono text-xs sm:text-sm font-medium text-foreground hover:border-primary/50 hover:bg-white/10 transition-colors text-center"
                        >
                          <Github className="h-4 w-4 shrink-0" />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Visual Telemetry / Project Preview */}
                  <div className="lg:col-span-5 flex flex-col justify-between">
                    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-xl group">
                      {/* Preview Topbar */}
                      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          LIVE_TELEMETRY
                        </span>
                        <span>1080p • REST API</span>
                      </div>

                      {/* Image Banner */}
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={activeProject.image}
                          alt={activeProject.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(222,47%,4%)] via-transparent to-transparent opacity-80" />
                      </div>

                      {/* Quick Readout Overlay */}
                      <div className="p-4 border-t border-white/5 bg-[hsl(222,47%,5%)]">
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-muted-foreground">Infrastructure Tier:</span>
                          <span className="text-primary font-semibold">
                            {activeProject.slug.includes('eks') ? 'Amazon EKS' : 'Docker Container'}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between font-mono text-xs">
                          <span className="text-muted-foreground">Repository:</span>
                          <span className="text-foreground truncate max-w-[200px]">
                            github.com/{activeProject.slug}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Prompt Callout */}
                    <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-3.5 font-mono text-xs text-primary flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 shrink-0" />
                        <span>Interactive live demo & runbooks documented inside</span>
                      </span>
                      <Link
                        to={`/project/${activeProject.slug}`}
                        className="underline hover:text-primary-foreground transition-colors shrink-0 font-bold"
                      >
                        Explore &rarr;
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          /* ─────────────── All Projects Grid View ─────────────── */
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
