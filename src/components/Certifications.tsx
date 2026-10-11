import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Award,
  ExternalLink,
  Trophy,
  ShieldCheck,
  Copy,
  Check,
  Lock,
  Sparkles
} from 'lucide-react';

interface CredentialItem {
  id: string;
  name: string;
  issuer: string;
  type: 'cloud' | 'ai' | 'achievement';
  badge: string;
  isSvgImage?: boolean;
  color: string;
  glowColor: string;
  credentialId: string;
  issueDate: string;
  verificationAuthority: string;
  link: string;
  skills: string[];
  description: string;
}

const credentialsData: CredentialItem[] = [
  {
    id: 'aws-cloud-essentials',
    name: 'AWS Cloud Essentials',
    issuer: 'Amazon Web Services',
    type: 'cloud',
    badge: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
    isSvgImage: true,
    color: '#FF9900',
    glowColor: 'rgba(255, 153, 0, 0.25)',
    credentialId: '8ed7d7ad-9993-479c-a919-b8f173f9aef8',
    issueDate: 'Issued: 2024 • No Expiration',
    verificationAuthority: 'Credly Acclaim Verified',
    link: 'https://www.credly.com/badges/8ed7d7ad-9993-479c-a919-b8f173f9aef8/public_url',
    skills: ['AWS Cloud Architecture', 'Identity & Access (IAM)', 'EC2 & Compute', 'S3 & VPC Security'],
    description: 'Foundational mastery of AWS cloud infrastructure, billing models, security best practices, and high-availability architecture design.'
  },
  {
    id: 'kubernetes-basics',
    name: 'Kubernetes Basics',
    issuer: 'KodeKloud',
    type: 'cloud',
    badge: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
    isSvgImage: true,
    color: '#326CE5',
    glowColor: 'rgba(50, 108, 229, 0.25)',
    credentialId: '2D1466DFC0C5-2D1460E91B48-2D145B4F88C5',
    issueDate: 'Issued: 2024 • Verified',
    verificationAuthority: 'KodeKloud Certificate Authority',
    link: 'https://learn.kodekloud.com/certificate/2D1466DFC0C5-2D1460E91B48-2D145B4F88C5',
    skills: ['Pod Lifecycle', 'Deployments & Rollouts', 'Cluster Services & Ingress', 'ConfigMaps & Secrets'],
    description: 'Hands-on practical certification validating container orchestration, cluster workload scheduling, declarative manifests, and Kubernetes troubleshooting.'
  },
  {
    id: 'claude-101',
    name: 'Claude 101',
    issuer: 'Claude Academy • Anthropic',
    type: 'ai',
    badge: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/claude/default.svg',
    isSvgImage: true,
    color: '#D97757',
    glowColor: 'rgba(217, 119, 87, 0.35)',
    credentialId: 'b094b7c8ef6a8a1eb4bfda69fb31a0ff',
    issueDate: 'Issued: Oct 2, 2026 • Verified',
    verificationAuthority: 'Claude Academy (Anthropic Verified)',
    link: 'https://academy.claude.com/verify/b094b7c8ef6a8a1eb4bfda69fb31a0ff',
    skills: ['Prompt Engineering', 'AI Fluency Framework', 'Projects & Skills', 'Claude Code & Artifacts', 'Enterprise Connectors'],
    description: 'Foundational certification covering effective prompting, AI Fluency, Projects, Artifacts, and Skills, through to Connectors, Enterprise Search, and workflows with Chat, Cowork, and Claude Code.'
  },
  {
    id: 'csi-project-competition',
    name: '3rd Rank — Project Competition',
    issuer: 'Computer Society of India (CSI)',
    type: 'achievement',
    badge: '🏆',
    isSvgImage: false,
    color: '#FFB800',
    glowColor: 'rgba(255, 184, 0, 0.25)',
    credentialId: 'CSI-AWARD-2024-RANK-03',
    issueDate: 'Awarded: Statewide Showcase',
    verificationAuthority: 'CSI Academic Evaluation Board',
    link: 'https://drive.google.com/file/d/1laqZANHF1I9w6SYAn_AInm85kxRYiPZk/view',
    skills: ['Engineering Innovation', 'Systems Architecture', 'Live Technical Defense', 'Autonomous Solutions'],
    description: 'Secured 3rd Rank among university-level competitors in a competitive engineering showcase evaluated by industry judges from the Computer Society of India.'
  }
];

type FilterCategory = 'all' | 'cloud' | 'ai' | 'achievement';

export default function Certifications() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const cloudCount = credentialsData.filter((item) => item.type === 'cloud').length;
  const aiCount = credentialsData.filter((item) => item.type === 'ai').length;
  const achievementCount = credentialsData.filter((item) => item.type === 'achievement').length;

  const filteredCredentials = credentialsData.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="certifications" className="relative py-16 md:py-32 scroll-mt-16">
      {/* Background Ambience */}
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
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-mono font-medium text-primary mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>CRYPTOGRAPHICALLY VERIFIED CREDENTIALS</span>
          </div>

          <h2 className="mt-2 text-3xl font-bold sm:text-4xl md:text-5xl tracking-tight">
            Certifications & <span className="gradient-text">Badges</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Industry-validated certifications and competitive honors demonstrating verified competence in cloud architecture, DevOps, AI engineering, and container orchestration.
          </p>

          {/* Filter Bar */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-md">
              <button
                onClick={() => setActiveFilter('all')}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${activeFilter === 'all'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                All Records ({credentialsData.length})
              </button>
              <button
                onClick={() => setActiveFilter('cloud')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${activeFilter === 'cloud'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Award className="h-3.5 w-3.5" />
                <span>Cloud & DevOps ({cloudCount})</span>
              </button>
              <button
                onClick={() => setActiveFilter('ai')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${activeFilter === 'ai'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#D97757]" />
                <span>AI & Claude ({aiCount})</span>
              </button>
              <button
                onClick={() => setActiveFilter('achievement')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${activeFilter === 'achievement'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Honors & Awards ({achievementCount})</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Holographic Credential Cards Grid */}
        <motion.div
          layout
          className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCredentials.map((item, idx) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-card/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-card/70 hover:shadow-2xl"
                style={{
                  boxShadow: `0 0 30px -10px ${item.glowColor}`
                }}
              >
                {/* Top Subtle Gradient Light */}
                <div
                  className="pointer-events-none absolute -top-24 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                  style={{ backgroundColor: item.color }}
                />

                <div>
                  {/* Card Header: Issuer + Status Beacon */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {item.issuer}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-secondary">
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                      <span>VERIFIED</span>
                    </div>
                  </div>

                  {/* Badge Icon & Name */}
                  <div className="mt-5 flex items-start gap-4">
                    <div
                      className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/50 p-2.5 transition-transform duration-300 group-hover:scale-105 shadow-inner"
                      style={{
                        borderColor: `${item.color}40`,
                        boxShadow: `inset 0 0 16px ${item.glowColor}`
                      }}
                    >
                      {item.isSvgImage ? (
                        <img
                          src={item.badge}
                          alt={item.name}
                          className="h-full w-full object-contain filter drop-shadow"
                        />
                      ) : (
                        <span className="text-3xl select-none">{item.badge}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {item.issueDate}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-xs text-muted-foreground leading-relaxed line-clamp-3" title={item.description}>
                    {item.description}
                  </p>

                  {/* Validated Skill Competencies */}
                  <div className="mt-4">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Validated Competencies:
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-foreground/90 transition-colors group-hover:border-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Credential ID & Action Links */}
                <div className="mt-6 border-t border-white/5 pt-4">
                  {/* Credential ID / Hash */}
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-black/40 px-3 py-1.5 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 truncate text-muted-foreground">
                      <Lock className="h-3 w-3 shrink-0 text-primary" />
                      <span className="truncate max-w-[170px] sm:max-w-[200px]" title={item.credentialId}>
                        {item.credentialId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopyId(item.credentialId, e)}
                      aria-label="Copy credential ID"
                      className="shrink-0 text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {copiedId === item.credentialId ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-secondary" />
                          <span className="text-[10px] text-secondary font-semibold">Copied!</span>
                        </>
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  {/* External Verification Link */}
                  <div className="mt-3">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs font-semibold text-foreground transition-all duration-300 hover:border-primary/50 hover:bg-primary hover:text-primary-foreground group/btn"
                    >
                      <span>
                        {item.type !== 'achievement' ? 'Verify Official Credential' : 'View Scanned Certificate'}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
