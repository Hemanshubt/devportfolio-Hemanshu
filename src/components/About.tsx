import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Zap, RefreshCw, Scale } from 'lucide-react';

const principles = [
  {
    icon: Zap,
    title: 'Quick Learner',
    description: 'Rapidly adapting to new technologies and tools. Always eager to expand my skill set.',
    color: 'primary',
  },
  {
    icon: Shield,
    title: 'Security Focused',
    description: 'Understanding the importance of security in every pipeline and deployment.',
    color: 'secondary',
  },
  {
    icon: RefreshCw,
    title: 'Problem Solver',
    description: 'Analytical mindset to troubleshoot issues and find efficient solutions.',
    color: 'accent',
  },
  {
    icon: Scale,
    title: 'Team Player',
    description: 'Collaborative approach to work with cross-functional teams effectively.',
    color: 'primary',
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-16 md:py-32">
      {/* Background effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Left column - Text */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="section-heading">About Me</span>

            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Building the{' '}
              <span className="gradient-text">infrastructure</span>{' '}
              that powers modern applications
            </h2>

            <div className="mt-6 space-y-4 text-base text-muted-foreground sm:mt-8 sm:space-y-6 sm:text-lg text-justify">
              <p>
                I'm an aspiring DevOps Engineer with a strong foundation in CI/CD pipelines,
                Infrastructure as Code, and cloud technologies. Currently pursuing my Integrated MCA,
                I'm passionate about automation, security, and building resilient systems.
              </p>
              <p>
                Through hands-on projects and certifications in AWS and Kubernetes, I've developed
                practical skills in Docker, Terraform, and monitoring tools. I'm eager to apply
                my knowledge and grow in a professional DevOps environment.
              </p>
            </div>

            {/* Terminal-style stat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="terminal mt-6 sm:mt-10"
            >
              <div className="terminal-header">
                <div className="terminal-dot bg-destructive" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-secondary" />
                <span className="ml-4 text-xs text-muted-foreground">profile.sh</span>
              </div>
              <div className="space-y-2 p-3 text-xs sm:p-4 sm:text-sm">
                <p><span className="text-secondary">$</span> cat education</p>
                <p className="text-muted-foreground">→ <span className="text-primary">Integrated MCA</span> (CGPA: 8.7)</p>
                <p><span className="text-secondary">$</span> count --projects</p>
                <p className="text-muted-foreground">→ <span className="text-primary">2+</span> hands-on DevOps projects</p>
                <p><span className="text-secondary">$</span> status --learning</p>
                <p className="text-muted-foreground">→ <span className="text-secondary">Active</span> & always growing</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - Principles */}
          <div className="space-y-4 sm:space-y-6">
            {principles.map((principle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="border-gradient group"
              >
                <div className="flex gap-3 p-4 sm:gap-4 sm:p-6">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 bg-${principle.color}/10`}>
                    <principle.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${principle.color}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground sm:text-lg">{principle.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground sm:text-base text-justify">{principle.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
