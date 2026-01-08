import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Zap, RefreshCw, Scale } from 'lucide-react';

const principles = [
  {
    icon: Zap,
    title: 'Automation First',
    description: 'Everything that can be automated, should be. Manual processes are bugs waiting to happen.',
    color: 'primary',
  },
  {
    icon: Shield,
    title: 'Security Embedded',
    description: 'Security is not an afterthought. It\'s woven into every pipeline, every deployment.',
    color: 'secondary',
  },
  {
    icon: RefreshCw,
    title: 'Reliability Obsessed',
    description: '99.99% uptime isn\'t a goal, it\'s the baseline. Systems must heal themselves.',
    color: 'accent',
  },
  {
    icon: Scale,
    title: 'Built to Scale',
    description: 'Infrastructure that grows with demand. From zero to millions, seamlessly.',
    color: 'primary',
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-32">
      {/* Background effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left column - Text */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="section-heading">About Me</span>
            
            <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              Building the{' '}
              <span className="gradient-text">infrastructure</span>{' '}
              that powers modern applications
            </h2>

            <div className="mt-8 space-y-6 text-lg text-muted-foreground">
              <p>
                I'm a DevOps Engineer with a passion for creating robust, scalable, and 
                automated infrastructure. My mission is to bridge the gap between development 
                and operations, enabling teams to ship faster and more reliably.
              </p>
              <p>
                With expertise spanning cloud platforms, container orchestration, and 
                infrastructure as code, I transform complex deployment challenges into 
                streamlined, repeatable processes.
              </p>
            </div>

            {/* Terminal-style stat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="terminal mt-10"
            >
              <div className="terminal-header">
                <div className="terminal-dot bg-destructive" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-secondary" />
                <span className="ml-4 text-xs text-muted-foreground">stats.sh</span>
              </div>
              <div className="space-y-2 p-4 text-sm">
                <p><span className="text-secondary">$</span> uptime --career</p>
                <p className="text-muted-foreground">→ <span className="text-primary">5+</span> years in DevOps & Cloud Engineering</p>
                <p><span className="text-secondary">$</span> count --deployments</p>
                <p className="text-muted-foreground">→ <span className="text-primary">1000+</span> successful deployments</p>
                <p><span className="text-secondary">$</span> status --incidents</p>
                <p className="text-muted-foreground">→ <span className="text-secondary">99.9%</span> uptime maintained</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - Principles */}
          <div className="space-y-6">
            {principles.map((principle, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="border-gradient group"
              >
                <div className="flex gap-4 p-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-${principle.color}/10`}>
                    <principle.icon className={`h-6 w-6 text-${principle.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{principle.title}</h3>
                    <p className="mt-1 text-muted-foreground">{principle.description}</p>
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
