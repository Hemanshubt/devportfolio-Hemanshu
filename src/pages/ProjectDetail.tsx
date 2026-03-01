import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Github, ExternalLink, CheckCircle2, Layers, Cpu, Wrench, Calendar, Clock, User
} from 'lucide-react';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';
import { projects } from '@/data/projects';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = (projects as any).find((p: any) => p.slug === slug);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const goToSection = (id: string) => navigate('/#' + id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">Project Not Found</h1>
            <p className="mt-4 text-muted-foreground">The project you're looking for doesn't exist.</p>
            <button onClick={() => goToSection('projects')} className="btn-primary mt-6">Back to Projects</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const accentClass = project.color === 'primary' ? 'text-primary' : 'text-secondary';
  const accentBg = project.color === 'primary' ? 'bg-primary' : 'bg-secondary';
  const accentBgSoft = project.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10';

  const projectUrl = `${window.location.origin}/project/${project.slug}`;

  const projectStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": project.title,
    "description": project.description,
    "image": project.image,
    "url": projectUrl,
    "codeRepository": project.github !== '#' ? project.github : undefined,
    "author": {
      "@type": "Person",
      "name": "Hemanshu Mahajan"
    },
    "programmingLanguage": project.tags,
    "keywords": project.tags.join(', ')
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${project.title} | Hemanshu Mahajan`}
        description={project.description}
        image={project.image}
        url={projectUrl}
        type="article"
        author="Hemanshu Mahajan"
        tags={project.tags}
        structuredData={projectStructuredData}
      />
      <main>

        <section className="relative overflow-hidden border-b border-[hsl(217,33%,14%)]">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className={`absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full ${accentBg} opacity-[0.06] blur-[100px]`} />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Back button */}
            <div className="pt-8">
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => goToSection('projects')}
                aria-label="Back to Projects"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </motion.button>
            </div>

            <ContainerScroll
              titleComponent={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 text-center md:mb-10"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-muted-foreground sm:mb-4 sm:gap-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${accentBgSoft}`}>
                      <project.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${accentClass}`} />
                    </div>
                    <span className="flex items-center gap-1.5 border-l border-white/10 pl-2 sm:pl-4">
                      <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Hemanshu Mahajan
                    </span>
                    <span className="flex items-center gap-1.5 border-l border-white/10 pl-2 font-mono sm:pl-4">
                      <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      5 min read
                    </span>
                  </div>

                  <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-foreground sm:mb-6 sm:text-4xl lg:text-6xl">
                    {project.title}
                  </h1>

                  <p className="mx-auto mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:mb-8 sm:text-base md:text-lg">
                    {project.description}
                  </p>

                  <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
                    {project.github !== '#' && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90 sm:w-auto sm:px-6 sm:py-3"
                      >
                        <Github className="h-4 w-4" />
                        View on GitHub
                      </a>
                    )}
                    <button
                      onClick={() => goToSection('contact')}
                      className={`flex w-full items-center justify-center gap-2 rounded-lg ${accentBg} px-5 py-2.5 text-sm font-semibold text-background transition-all hover:shadow-lg sm:w-auto sm:px-6 sm:py-3`}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Get in Touch
                    </button>
                  </div>
                </motion.div>
              }
            >
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
              </div>
            </ContainerScroll>
          </div>
        </section>

        {/* ─── Highlights & Features ─── */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          {project.highlights && project.highlights.length > 0 && (
            <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {project.highlights.map((h: string, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-4 hover:bg-white/10 transition-all sm:gap-4 sm:p-5`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                    <CheckCircle2 className={`h-5 w-5 text-primary`} />
                  </div>
                  <span className="text-sm font-semibold tracking-tight text-foreground">{h}</span>
                </motion.div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[hsl(217,33%,12%)] bg-[hsl(222,47%,4%)] p-6 sm:p-8 hover:border-primary/20 transition-colors"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10`}>
                  <Layers className={`h-5 w-5 text-primary`} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Overview</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base text-justify">
                {project.readme.overview}
              </p>
            </motion.div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-[hsl(217,33%,12%)] bg-[hsl(222,47%,4%)] p-6 sm:p-8 hover:border-primary/20 transition-colors"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10`}>
                  <CheckCircle2 className={`h-5 w-5 text-primary`} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Key Features</h2>
              </div>
              <ul className="space-y-3">
                {project.readme.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground sm:text-base">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ─── Detailed Project Guide (Markdown Content) ─── */}
        {project.fullContent && (
          <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
            <div className="mb-6 flex flex-col gap-2 sm:mb-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`h-1 w-8 rounded-full bg-primary sm:w-12`} />
                <h2 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">Project Guide</h2>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">Detailed implementation steps and documentation</p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="prose prose-sm prose-invert prose-blue max-w-none text-justify sm:prose-base
                prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground
                prose-strong:text-foreground prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1 prose-code:rounded
                prose-pre:bg-[hsl(222,47%,4%)] prose-pre:border prose-pre:border-white/5 prose-pre:overflow-x-auto
                prose-img:rounded-xl prose-img:border prose-img:border-white/5 prose-img:w-full prose-img:h-auto
                sm:prose-img:rounded-2xl shadow-2xl"
            >
              <ReactMarkdown>{project.fullContent}</ReactMarkdown>
            </motion.div>
          </section>
        )}

        {/* ─── Architecture & Tech Stack (Original Grid) ─── */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-[hsl(217,33%,12%)] bg-[hsl(222,47%,4%)] p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10`}>
                  <Cpu className={`h-5 w-5 text-primary`} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Architecture</h2>
              </div>
              <div className="overflow-hidden rounded-xl border border-[hsl(217,33%,12%)] bg-[hsl(222,47%,4%)]">
                <div className="flex items-center gap-2 border-b border-[hsl(217,33%,12%)] px-4 py-2.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 font-mono text-xs text-muted-foreground">architecture</span>
                </div>
                <div className="p-4">
                  <ul className="space-y-2">
                    {project.readme.architecture.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 font-mono text-xs text-foreground sm:text-sm">
                        <span className="text-primary">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-[hsl(217,33%,12%)] bg-[hsl(222,47%,4%)] p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10`}>
                  <Wrench className={`h-5 w-5 text-primary`} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Tech Stack</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {project.readme.techStack.map((tech: string, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className={`rounded-lg border border-[hsl(217,33%,17%)] bg-[hsl(222,47%,8%)] px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary`}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="border-t border-[hsl(217,33%,14%)] bg-[hsl(222,47%,5%)] py-12 sm:py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                Interested in this project?
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
                Let's discuss how I can bring similar solutions to your team.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                <button onClick={() => goToSection('contact')} className="btn-primary">
                  Get in Touch
                </button>
                <button onClick={() => goToSection('projects')} className="btn-outline">
                  View More Projects
                </button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
