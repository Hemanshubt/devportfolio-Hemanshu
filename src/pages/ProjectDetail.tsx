import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Github, ExternalLink, CheckCircle2, Layers, Cpu, Wrench
} from 'lucide-react';
import { useEffect } from 'react';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';
import { projects } from '@/data/projects';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.slug === slug);

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

        {/* ─── Hero Section ─── */}
        <section className="relative overflow-hidden border-b border-[hsl(217,33%,14%)]">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className={`absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full ${accentBg} opacity-[0.06] blur-[100px]`} />
          </div>

          <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => goToSection('projects')}
              aria-label="Back to Projects"
              className="mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </motion.button>

            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              {/* Left — Text */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Icon + title */}
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentBgSoft}`}>
                    <project.icon className={`h-6 w-6 ${accentClass}`} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{project.title}</h1>
                  </div>
                </div>

                <p className="mb-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {project.description}
                </p>

                {/* Highlights */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.highlights.map((h, i) => (
                    <span key={i} className={`flex items-center gap-1.5 rounded-full ${accentBgSoft} px-3.5 py-1.5 text-xs font-semibold ${accentClass}`}>
                      <CheckCircle2 className="h-3 w-3" />
                      {h}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div className="mb-8 flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="rounded-md border border-[hsl(217,33%,17%)] bg-[hsl(222,47%,8%)] px-3 py-1.5 text-xs font-medium text-foreground">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3">
                  {project.github !== '#' && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90"
                    >
                      <Github className="h-4 w-4" />
                      View on GitHub
                    </a>
                  )}
                  <button
                    onClick={() => goToSection('contact')}
                    className={`flex items-center gap-2 rounded-lg ${accentBg} px-5 py-2.5 text-sm font-semibold text-background transition-all hover:shadow-lg`}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Contact Me
                  </button>
                </div>
              </motion.div>

              {/* Right — Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="overflow-hidden rounded-2xl border border-[hsl(217,33%,14%)] shadow-2xl"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Details Grid ─── */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[hsl(217,33%,14%)] bg-[hsl(222,47%,6%)] p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentBgSoft}`}>
                  <Layers className={`h-5 w-5 ${accentClass}`} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Overview</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {project.readme.overview}
              </p>
            </motion.div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-[hsl(217,33%,14%)] bg-[hsl(222,47%,6%)] p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentBgSoft}`}>
                  <CheckCircle2 className={`h-5 w-5 ${accentClass}`} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Key Features</h2>
              </div>
              <ul className="space-y-3">
                {project.readme.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground sm:text-base">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${accentBg}`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-[hsl(217,33%,14%)] bg-[hsl(222,47%,6%)] p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentBgSoft}`}>
                  <Cpu className={`h-5 w-5 ${accentClass}`} />
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
                    {project.readme.architecture.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 font-mono text-xs text-foreground sm:text-sm">
                        <span className={accentClass}>→</span>
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl border border-[hsl(217,33%,14%)] bg-[hsl(222,47%,6%)] p-6 sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentBgSoft}`}>
                  <Wrench className={`h-5 w-5 ${accentClass}`} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Tech Stack</h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {project.readme.techStack.map((tech, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-lg border border-[hsl(217,33%,17%)] bg-[hsl(222,47%,8%)] px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-current hover:${accentBgSoft} hover:${accentClass}`}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="border-t border-[hsl(217,33%,14%)] bg-[hsl(222,47%,5%)] py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Interested in this project?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Let's discuss how I can bring similar solutions to your team.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
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
