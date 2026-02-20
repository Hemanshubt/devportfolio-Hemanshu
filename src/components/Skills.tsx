import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';

const categories = [
  'All',
  'Languages',
  'OS',
  'Version Control',
  'Container/Orch',
  'CI/CD',
  'Cloud',
  'IaC',
  'Monitoring',
  'Database',
];

/* ── Category color & orbit config ──────────────────────── */
const categoryConfig: Record<string, { color: string; glow: string; ring: number }> = {
  Languages: { color: '#3572A5', glow: 'rgba(53,114,165,0.4)', ring: 1 },
  OS: { color: '#FCC624', glow: 'rgba(252,198,36,0.4)', ring: 2 },
  'Version Control': { color: '#F05032', glow: 'rgba(240,80,50,0.4)', ring: 3 },
  'Container/Orch': { color: '#2496ED', glow: 'rgba(36,150,237,0.4)', ring: 4 },
  'CI/CD': { color: '#D24939', glow: 'rgba(210,73,57,0.4)', ring: 5 },
  Cloud: { color: '#FF9900', glow: 'rgba(255,153,0,0.4)', ring: 6 },
  IaC: { color: '#7B42BC', glow: 'rgba(123,66,188,0.4)', ring: 7 },
  Monitoring: { color: '#E6522C', glow: 'rgba(230,82,44,0.4)', ring: 8 },
  Database: { color: '#00758F', glow: 'rgba(0,117,143,0.4)', ring: 9 },
};

const skills = [
  // Languages
  { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', category: 'Languages' },
  { name: 'Shell', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg', category: 'Languages' },

  // OS
  { name: 'Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', category: 'OS' },
  { name: 'Windows', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg', category: 'OS' },

  // Version Control
  { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', category: 'Version Control' },
  { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', category: 'Version Control' },

  // Container/Orch
  { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', category: 'Container/Orch' },
  { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', category: 'Container/Orch' },
  { name: 'Helm', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/helm/helm-original.svg', category: 'Container/Orch' },

  // CI/CD
  { name: 'Jenkins', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg', category: 'CI/CD' },
  { name: 'GitLab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg', category: 'CI/CD' },

  // Cloud
  { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg', category: 'Cloud' },

  // IaC
  { name: 'Terraform', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg', category: 'IaC' },
  { name: 'Ansible', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg', category: 'IaC' },

  // Monitoring
  { name: 'Prometheus', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg', category: 'Monitoring' },
  { name: 'Grafana', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg', category: 'Monitoring' },

  // Database
  { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', category: 'Database' },
];

/* ── Flip Card ─────────────────────────────────────────── */
function FlipCard({ skill }: { skill: typeof skills[0] }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group perspective-1000 h-24 sm:h-32 md:h-36 lg:h-40 cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative h-full w-full"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-border bg-card/80 p-3 backdrop-blur-sm sm:p-4 md:p-5 lg:p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="mb-2 flex h-8 w-8 items-center justify-center sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16">
            <img
              src={skill.logo}
              alt={skill.name}
              className="h-full w-full object-contain"
            />
          </div>
          <h3 className="text-center text-[10px] font-medium text-foreground sm:text-xs md:text-sm lg:text-base">
            {skill.name}
          </h3>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-primary/50 bg-gradient-to-br from-primary/20 to-purple-500/20 p-3 backdrop-blur-sm sm:p-4 md:p-5 lg:p-6"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="mb-2 flex h-8 w-8 items-center justify-center sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16">
            <img
              src={skill.logo}
              alt={skill.name}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[8px] font-medium text-primary sm:px-2 sm:text-[10px] md:text-xs lg:text-sm">
            {skill.category}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Orbiting Skill Planet ─────────────────────────────── */
function SkillPlanet({
  skill,
  orbitRadius,
  startAngle,
  duration,
  color,
  glow,
  isHighlighted,
  onHover,
  onClick,
}: {
  skill: typeof skills[0];
  orbitRadius: number;
  startAngle: number;
  duration: number;
  color: string;
  glow: string;
  isHighlighted: boolean;
  onHover: (skill: typeof skills[0] | null) => void;
  onClick: (skill: typeof skills[0]) => void;
}) {
  const steps = 60;
  const xFrames = Array.from({ length: steps + 1 }, (_, i) =>
    Math.cos(startAngle + (i / steps) * 2 * Math.PI) * orbitRadius
  );
  const yFrames = Array.from({ length: steps + 1 }, (_, i) =>
    Math.sin(startAngle + (i / steps) * 2 * Math.PI) * orbitRadius
  );

  return (
    <motion.div
      className="absolute flex flex-col items-center gap-1"
      style={{
        zIndex: isHighlighted ? 20 : 5,
        left: '50%',
        top: '50%',
      }}
      animate={{
        x: xFrames,
        y: yFrames,
        translateX: '-50%',
        translateY: '-50%',
      }}
      transition={{
        x: { repeat: Infinity, duration, ease: 'linear' },
        y: { repeat: Infinity, duration, ease: 'linear' }
      }}
    >
      <motion.div
        className="relative flex items-center justify-center rounded-xl border bg-card/90 backdrop-blur-sm transition-all duration-300"
        style={{
          width: 56,
          height: 56,
          borderColor: isHighlighted ? color : 'hsl(217 33% 17%)',
          boxShadow: isHighlighted ? `0 0 16px ${glow}, 0 0 32px ${glow}` : 'none',
        }}
        animate={isHighlighted ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={isHighlighted ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : {}}
        whileHover={{ scale: 1.3, zIndex: 30 }}
        onMouseEnter={() => onHover(skill)}
        onMouseLeave={() => onHover(null)}
        onClick={() => onClick(skill)}
        title={`${skill.name} — ${skill.category}`}
      >
        <img
          src={skill.logo}
          alt={skill.name}
          className="h-9 w-9 object-contain"
          style={{ filter: isHighlighted ? 'none' : 'brightness(0.6)' }}
        />
      </motion.div>
      <motion.span
        className="whitespace-nowrap font-mono text-[9px] font-medium"
        style={{ color: isHighlighted ? color : 'hsl(215 20% 55%)' }}
        animate={{ opacity: isHighlighted ? 1 : 0.5 }}
      >
        {skill.name}
      </motion.span>
    </motion.div>
  );
}

/* ── Orbit System ──────────────────────────────────────── */
function SkillsOrbitSystem({ activeCategory }: { activeCategory: string }) {
  const [hoveredSkill, setHoveredSkill] = useState<typeof skills[0] | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<typeof skills[0] | null>(null);

  const displaySkill = hoveredSkill || selectedSkill;

  const orbitRings = [
    { ring: 1, radius: 160, speed: 32 },
    { ring: 2, radius: 215, speed: 36 },
    { ring: 3, radius: 270, speed: 40 },
    { ring: 4, radius: 325, speed: 44 },
    { ring: 5, radius: 375, speed: 48 },
    { ring: 6, radius: 420, speed: 52 },
    { ring: 7, radius: 460, speed: 56 },
    { ring: 8, radius: 495, speed: 60 },
    { ring: 9, radius: 525, speed: 64 },
  ];

  // Assign angles evenly per ring
  const planetsWithAngles = useMemo(() => {
    const ringSkills: Record<number, typeof skills> = {};
    skills.forEach((s) => {
      const cfg = categoryConfig[s.category];
      if (!cfg) return;
      if (!ringSkills[cfg.ring]) ringSkills[cfg.ring] = [];
      ringSkills[cfg.ring].push(s);
    });

    const result: {
      skill: typeof skills[0];
      ring: number;
      angle: number;
      color: string;
      glow: string;
    }[] = [];

    Object.entries(ringSkills).forEach(([ring, items]) => {
      const r = parseInt(ring);
      items.forEach((s, i) => {
        // Golden angle offset per ring (≈137.5°) — guarantees no adjacent ring overlap
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const ringOffset = (r - 1) * goldenAngle;
        const angle = ringOffset + (i / items.length) * 2 * Math.PI;
        const cfg = categoryConfig[s.category];
        result.push({ skill: s, ring: r, angle, color: cfg.color, glow: cfg.glow });
      });
    });

    return result;
  }, []);

  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: 1100, height: 1100 }}>
      {/* Orbit ring lines */}
      {orbitRings.map((o) => (
        <motion.div
          key={o.ring}
          className="absolute rounded-full border border-dashed"
          style={{
            width: o.radius * 2,
            height: o.radius * 2,
            borderColor: 'hsl(217 33% 17% / 0.5)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: o.ring * 0.1, duration: 0.5 }}
        />
      ))}

      {/* Center core */}
      <motion.div
        className="absolute z-10 flex h-36 w-36 flex-col items-center justify-center rounded-full border-2 border-primary/40 bg-card/95 backdrop-blur-sm shadow-[0_0_50px_rgba(0,212,255,0.25)] overflow-hidden cursor-pointer"
        style={{
          left: '50%',
          top: '50%',
          translateX: '-50%',
          translateY: '-50%',
        }}
        onClick={() => setSelectedSkill(null)}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          {!displaySkill ? (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              <img src="/DevOps_Logo.svg" alt="DevOps" className="h-24 w-24 object-contain" />
              <span className="mt-1 font-mono text-sm font-black text-primary tracking-widest uppercase">DevOps</span>
            </motion.div>
          ) : (
            <motion.div
              key={displaySkill.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center p-4 text-center"
            >
              <img src={displaySkill.logo} alt={displaySkill.name} className="h-16 w-16 object-contain mb-2" />
              <span className="font-mono text-sm font-bold text-primary uppercase leading-tight">
                {displaySkill.name}
              </span>
              <span className="mt-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary/70">
                {displaySkill.category}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Skill planets */}
      {planetsWithAngles.map((p) => {
        const ringCfg = orbitRings.find((o) => o.ring === p.ring);
        if (!ringCfg) return null;
        const isHighlighted = activeCategory === 'All' || activeCategory === p.skill.category;

        return (
          <SkillPlanet
            key={p.skill.name}
            skill={p.skill}
            orbitRadius={ringCfg.radius}
            startAngle={p.angle}
            duration={ringCfg.speed}
            color={p.color}
            glow={p.glow}
            isHighlighted={isHighlighted}
            onHover={setHoveredSkill}
            onClick={(skill) => setSelectedSkill(prev => prev?.name === skill.name ? null : skill)}
          />
        );
      })}

      {/* Category legend */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[500px]">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {Object.entries(categoryConfig).map(([cat, cfg]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: cfg.color, boxShadow: `0 0 6px ${cfg.glow}` }}
              />
              <span className="font-mono text-[13px] text-muted-foreground">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main Skills Component ─────────────────────────────── */
export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'orbit' | 'grid'>('orbit');

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="relative py-16 md:py-32">
      <div className="bg-grid-small pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="gradient-text">Skills</span>
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-primary to-secondary" />
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-6 flex justify-center"
        >
          <div className="inline-flex rounded-full border border-border bg-card/50 p-1">
            <button
              onClick={() => setViewMode('orbit')}
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all duration-300 ${viewMode === 'orbit'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              🪐 Orbit View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-full px-4 py-1.5 font-mono text-xs transition-all duration-300 ${viewMode === 'grid'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              📊 Grid View
            </button>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8 sm:gap-3"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 font-medium transition-all duration-300 sm:px-6 sm:py-2.5 ${activeCategory === category
                ? 'bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/25'
                : 'border border-border bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }`}
            >
              <span className="text-xs sm:text-sm">{category}</span>
            </button>
          ))}
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {viewMode === 'orbit' && (
            <motion.div
              key="orbit"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="mt-8 flex justify-center sm:mt-12"
            >
              {/* Responsive scaling wrapper */}
              <div
                className="origin-center scale-[0.3] sm:scale-[0.45] md:scale-[0.6] lg:scale-100 transition-transform duration-300"
                style={{ height: '1100px' }}
              >
                <SkillsOrbitSystem activeCategory={activeCategory} />
              </div>
            </motion.div>
          )}

          {viewMode === 'grid' && (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="mt-8 sm:mt-12"
            >
              <motion.div
                layout
                className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {filteredSkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      layout
                      initial={{ opacity: 0, rotateY: -90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      exit={{ opacity: 0, rotateY: 90 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <FlipCard skill={skill} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
