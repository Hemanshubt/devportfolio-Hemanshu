import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Server, Zap, GitBranch, Shield, Calendar, User } from 'lucide-react';
import { useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { projects } from '@/data/projects';

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const project = projects.find(p => p.slug === slug);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Navigate to home and scroll to section
  const goToSection = (sectionId: string) => {
    navigate('/#' + sectionId);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">Project Not Found</h1>
            <p className="mt-4 text-muted-foreground">The project you're looking for doesn't exist.</p>
            <button onClick={() => goToSection('projects')} className="btn-primary mt-6">
              Back to Projects
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => goToSection('projects')}
            className="mb-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-mono text-sm">Back to Projects</span>
          </motion.button>

          {/* Project Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Icon & Category */}
            <div className="mb-6 flex items-center gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                project.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'
              }`}>
                <project.icon className={`h-7 w-7 ${
                  project.color === 'primary' ? 'text-primary' : 'text-secondary'
                }`} />
              </div>
              <div className="flex flex-wrap gap-2">
                {project.highlights.map((highlight, i) => (
                  <span
                    key={i}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      project.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                    }`}
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
              {project.title}
            </h1>

            {/* Description */}
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              {project.description}
            </p>

            {/* Meta Info */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Hemanshu Mahajan</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>2024</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              {project.github !== '#' && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2"
                >
                  <Github className="h-5 w-5" />
                  View on GitHub
                </a>
              )}
              <button onClick={() => goToSection('contact')} className="btn-outline flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Contact Me
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid gap-12 lg:gap-16">
            
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Overview</h2>
              </div>
              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <p className="text-base leading-relaxed text-foreground md:text-lg">
                  {project.readme.overview}
                </p>
              </div>
            </motion.div>

            {/* Key Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10">
                  <Zap className="h-5 w-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Key Features</h2>
              </div>
              <div className="rounded-2xl border border-border bg-card/50 p-6">
                <ul className="space-y-4">
                  {project.readme.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary" />
                      <span className="text-base text-foreground md:text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Architecture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                  <GitBranch className="h-5 w-5 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Architecture</h2>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-6">
                <div className="terminal">
                  <div className="terminal-header">
                    <div className="terminal-dot bg-destructive" />
                    <div className="terminal-dot bg-yellow-500" />
                    <div className="terminal-dot bg-secondary" />
                    <span className="ml-4 text-xs text-muted-foreground">architecture.md</span>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-3">
                      {project.readme.architecture.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 font-mono text-sm text-foreground md:text-base">
                          <span className="text-secondary">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Tech Stack</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {project.readme.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="rounded-xl border border-border bg-card px-4 py-2 font-mono text-sm text-foreground transition-all hover:border-primary/50 hover:bg-primary/5 md:text-base"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-4 text-lg font-semibold text-muted-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 font-mono text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
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
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
