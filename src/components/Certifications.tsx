import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, ExternalLink } from 'lucide-react';

const certifications = [
  {
    name: 'AWS Cloud Essentials',
    issuer: 'Amazon Web Services',
    badge: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
    
    color: '#FF9900',
    link: 'https://www.credly.com/badges/8ed7d7ad-9993-479c-a919-b8f173f9aef8/public_url',
  },
  {
    name: 'Kubernetes Basics',
    issuer: 'KodeKloud',
    badge: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
    color: '#326CE5',
    link: 'https://learn.kodekloud.com/certificate/2D1466DFC0C5-2D1460E91B48-2D145B4F88C5',
  },
];

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="certifications" className="relative py-16 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-card/10 to-background" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="section-heading">Credentials</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="gradient-text">Certifications</span> & Badges
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Industry-recognized certifications validating expertise in cloud and DevOps technologies.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-wrap justify-center gap-4 sm:mt-16 sm:gap-6">
          {certifications.map((cert, i) => (
            <motion.a
              key={i}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex w-full max-w-xs flex-col items-center rounded-xl border border-border bg-card/50 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5 sm:w-auto sm:p-6"
              style={{ '--cert-color': cert.color } as React.CSSProperties}
            >
              {/* Badge glow effect */}
              <div 
                className="absolute -top-2 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30 sm:h-32 sm:w-32"
                style={{ backgroundColor: cert.color }}
              />
              
              {/* Badge image */}
              <div className="relative mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-muted/50 p-3 transition-transform duration-300 group-hover:scale-110 sm:mb-4 sm:h-20 sm:w-20 sm:p-4">
                <img
                  src={cert.badge}
                  alt={cert.name}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Certification info */}
              <h3 className="mb-1 text-sm font-semibold text-foreground transition-colors group-hover:text-primary sm:text-base">
                {cert.name}
              </h3>
              <p className="mb-2 text-xs text-muted-foreground sm:text-sm">
                {cert.issuer}
              </p>

              {/* Verified badge */}
              <div className="flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-medium text-secondary sm:text-xs">
                <Award className="h-3 w-3" />
                <span>Verified</span>
              </div>

              {/* External link icon */}
              <ExternalLink className="absolute right-2 top-2 h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:right-3 sm:top-3 sm:h-4 sm:w-4" />
            </motion.a>
          ))}
        </div>

        {/* Terminal-style credential verification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-10 max-w-md sm:mt-16"
        >
          <div className="terminal">
            <div className="terminal-header">
              <div className="terminal-dot bg-destructive" />
              <div className="terminal-dot bg-yellow-500" />
              <div className="terminal-dot bg-secondary" />
              <span className="ml-4 text-xs text-muted-foreground">verify.sh</span>
            </div>
            <div className="space-y-1 p-3 text-xs sm:p-4 sm:text-sm">
              <p><span className="text-secondary">$</span> verify --credentials</p>
              <p className="text-muted-foreground">Checking certification status...</p>
              <p className="text-green-500">✓ All {certifications.length} certifications verified</p>
              <p className="text-muted-foreground">→ Status: <span className="text-primary">Active & Valid</span></p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
