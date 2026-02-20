import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Send, Mail, MapPin, CheckCircle, AlertCircle, Wifi, Clock, Shield, Rocket, Terminal } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';


/* ─────────────── 2. CI/CD Pipeline Progress ─────────────── */
const pipelineStages = [
  { label: 'Validate', icon: '🔍' },
  { label: 'Encrypt', icon: '🔐' },
  { label: 'Route', icon: '🌐' },
  { label: 'Deliver', icon: '📬' },
  { label: 'Confirm', icon: '✅' },
];

function CICDPipeline({ activeStage, isRunning }: { activeStage: number; isRunning: boolean }) {
  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-border/50 bg-muted/20 p-3">
      <div className="mb-2 flex items-center gap-2 font-mono text-xs text-muted-foreground">
        <Terminal className="h-3 w-3 text-primary" />
        <span>message-delivery-pipeline</span>
        {isRunning && (
          <span className="ml-auto flex items-center gap-1">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-yellow-400" />
            <span className="text-yellow-400">Running</span>
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-1">
        {pipelineStages.map((stage, i) => (
          <div key={stage.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-all duration-300 ${i < activeStage
                  ? 'bg-green-500/20 text-green-400 shadow-[0_0_8px_hsl(142_71%_45%/0.3)]'
                  : i === activeStage && isRunning
                    ? 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_8px_hsl(45_100%_50%/0.3)]'
                    : 'bg-muted/30 text-muted-foreground'
                  }`}
                animate={
                  i === activeStage && isRunning
                    ? { scale: [1, 1.15, 1] }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                {stage.icon}
              </motion.div>
              <span className="text-[9px] text-muted-foreground">{stage.label}</span>
            </div>
            {i < pipelineStages.length - 1 && (
              <div className="mx-1 h-[2px] flex-1">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: i < activeStage
                      ? 'linear-gradient(90deg, hsl(142 71% 45% / 0.6), hsl(142 71% 45% / 0.3))'
                      : 'hsl(217 33% 17% / 0.5)',
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: i < activeStage ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── 3. Encrypted Message Preview ─────────────── */
function EncryptedPreview({ message }: { message: string }) {
  const [encrypted, setEncrypted] = useState('');

  useEffect(() => {
    if (!message) {
      setEncrypted('');
      return;
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < message.length; i++) {
      if (message[i] === ' ') {
        result += ' ';
      } else {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    setEncrypted(result);
  }, [message]);

  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-3 overflow-hidden rounded-lg border border-primary/20 bg-primary/5 p-3"
    >
      <div className="mb-1 flex items-center gap-2 font-mono text-xs text-primary">
        <Shield className="h-3 w-3" />
        <span>AES-256 Encrypted Preview</span>
        <span className="ml-auto text-[10px] text-muted-foreground">
          {message.length} chars → {encrypted.length} encrypted
        </span>
      </div>
      <p className="break-all font-mono text-xs text-green-400/70 leading-relaxed">{encrypted}</p>
    </motion.div>
  );
}

/* ─────────────── 4. Orbiting Social Planets ─────────────── */
const socialPlanets = [
  {
    name: 'GitHub',
    icon: <FaGithub className="h-5 w-5" />,
    href: 'https://github.com/Hemanshubt',
    color: 'hsl(0 0% 80%)',
    orbitSize: 80,
    speed: 12,
    bgHover: 'hover:bg-white/10 hover:text-white',
  },
  {
    name: 'LinkedIn',
    icon: <FaLinkedin className="h-5 w-5" />,
    href: 'https://www.linkedin.com/in/hemanshu-mahajan/',
    color: 'hsl(210 90% 55%)',
    orbitSize: 120,
    speed: 18,
    bgHover: 'hover:bg-blue-500/10 hover:text-blue-400',
  },
];

function OrbitingSocials() {
  return (
    <div className="relative flex h-64 w-64 items-center justify-center mx-auto">
      {/* Center node */}
      <motion.div
        className="absolute flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-card shadow-[0_0_20px_hsl(191_100%_50%/0.2)]"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <Mail className="h-6 w-6 text-primary" />
      </motion.div>

      {/* Orbit rings */}
      {socialPlanets.map((planet) => (
        <div
          key={planet.name}
          className="absolute rounded-full border border-dashed border-border/30"
          style={{
            width: planet.orbitSize * 2,
            height: planet.orbitSize * 2,
          }}
        />
      ))}

      {/* Orbiting planets */}
      {socialPlanets.map((planet) => (
        <motion.a
          key={planet.name}
          href={planet.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={planet.name}
          className={`absolute flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-colors duration-200 ${planet.bgHover}`}
          style={{
            boxShadow: `0 0 10px ${planet.color.replace(')', ' / 0.3)')}`,
          }}
          animate={{
            x: [
              Math.cos(0) * planet.orbitSize,
              Math.cos(Math.PI / 2) * planet.orbitSize,
              Math.cos(Math.PI) * planet.orbitSize,
              Math.cos((3 * Math.PI) / 2) * planet.orbitSize,
              Math.cos(2 * Math.PI) * planet.orbitSize,
            ],
            y: [
              Math.sin(0) * planet.orbitSize,
              Math.sin(Math.PI / 2) * planet.orbitSize,
              Math.sin(Math.PI) * planet.orbitSize,
              Math.sin((3 * Math.PI) / 2) * planet.orbitSize,
              Math.sin(2 * Math.PI) * planet.orbitSize,
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: planet.speed,
            ease: 'linear',
          }}
          whileHover={{ scale: 1.3, zIndex: 10 }}
          title={planet.name}
        >
          {planet.icon}
        </motion.a>
      ))}
    </div>
  );
}

/* ─────────────── 5. Keystroke Ripple Effect ─────────────── */
function KeystrokeRipple({ ripples }: { ripples: { id: number; x: number; y: number }[] }) {
  return (
    <>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full bg-primary/20"
          style={{ left: ripple.x, top: ripple.y }}
          initial={{ width: 0, height: 0, opacity: 0.6 }}
          animate={{ width: 60, height: 60, opacity: 0, x: -30, y: -30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </>
  );
}

/* ─────────────── 6. Signal Strength Indicator ─────────────── */
function SignalStrength() {
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStrength((s) => (s >= 4 ? 0 : s + 1));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Wifi className={`h-4 w-4 transition-colors duration-300 ${strength >= 3 ? 'text-green-400' : strength >= 2 ? 'text-yellow-400' : 'text-red-400'}`} />
      <div className="flex items-end gap-[2px]">
        {[1, 2, 3, 4].map((level) => (
          <motion.div
            key={level}
            className={`w-[3px] rounded-full transition-all duration-300 ${level <= strength ? 'bg-green-400 shadow-[0_0_4px_hsl(142_71%_45%/0.4)]' : 'bg-muted/30'}`}
            style={{ height: level * 4 + 4 }}
            animate={level <= strength ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.3 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] text-muted-foreground">
        {strength >= 3 ? 'CONNECTED' : strength >= 2 ? 'FAIR' : 'SCANNING'}
      </span>
    </div>
  );
}

/* ─────────────── 7. Dynamic Time Greeting ─────────────── */
function TimeGreeting() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const greeting = hours < 6 ? '🌙 Night Owl Mode' : hours < 12 ? '🌅 Good Morning' : hours < 17 ? '☀️ Good Afternoon' : hours < 21 ? '🌆 Good Evening' : '🌙 Night Owl Mode';
  const emoji = hours < 6 ? '🦉' : hours < 12 ? '☕' : hours < 17 ? '💻' : hours < 21 ? '🌇' : '🦉';

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/10 px-4 py-3">
      <Clock className="h-4 w-4 text-primary" />
      <div>
        <p className="font-mono text-xs text-muted-foreground">{greeting}</p>
        <p className="font-mono text-sm text-foreground">
          {emoji} {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      </div>
      <div className="ml-auto font-mono text-[10px] text-muted-foreground">
        IST {time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
      </div>
    </div>
  );
}

/* ─────────────── 8. Launch Success Animation ─────────────── */
function LaunchAnimation({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        <motion.div
          animate={{
            y: [0, -200, -500],
            scale: [1, 1.2, 0.5],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 2, ease: 'easeIn' }}
        >
          <Rocket className="h-16 w-16 text-primary drop-shadow-[0_0_20px_hsl(191_100%_50%/0.6)]" style={{ transform: 'rotate(-45deg)' }} />
        </motion.div>
        <motion.p
          className="font-mono text-lg font-bold text-green-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          🚀 Message Launched Successfully!
        </motion.p>
        {/* Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              background: i % 3 === 0 ? 'hsl(191 100% 50%)' : i % 3 === 1 ? 'hsl(142 71% 45%)' : 'hsl(262 83% 58%)',
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos((i * Math.PI * 2) / 12) * 150,
              y: Math.sin((i * Math.PI * 2) / 12) * 150,
              opacity: 0,
              scale: [1, 2, 0],
            }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────── 9. Spotlight Mouse Follow ─────────────── */
function SpotlightFollow({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setVisible(true);
    };

    const handleLeave = () => setVisible(false);

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', handleLeave);
    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
    };
  }, [containerRef]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, hsl(191 100% 50% / 0.06), transparent 40%)`,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────── */
/*                     MAIN CONTACT COMPONENT                 */
/* ─────────────────────────────────────────────────────────── */
export default function Contact() {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [pipelineStage, setPipelineStage] = useState(0);
  const [showLaunch, setShowLaunch] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);

  // Character count for the message
  const charCount = formState.message.length;
  const maxChars = 2000;

  // Keystroke ripple handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const containerRect = formContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const x = rect.left - containerRect.left + rect.width / 2;
    const y = rect.top - containerRect.top + rect.height / 2;
    rippleId.current++;
    setRipples((prev) => [...prev.slice(-5), { id: rippleId.current, x, y }]);
  }, []);

  // Simulate pipeline stages during submission
  const runPipeline = useCallback(async () => {
    for (let i = 0; i <= pipelineStages.length; i++) {
      setPipelineStage(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setPipelineStage(0);

    // Run pipeline animation alongside the actual request
    const pipelinePromise = runPipeline();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const data = await response.json();
      await pipelinePromise;

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setShowLaunch(true);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setShowLaunch(false), 3000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      await pipelinePromise;
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus('idle');
        setPipelineStage(0);
      }, 5000);
    }
  };

  // Compute form completeness for the progress ring
  const completeness = useMemo(() => {
    let score = 0;
    if (formState.name.trim()) score += 33;
    if (formState.email.trim() && formState.email.includes('@')) score += 33;
    if (formState.message.trim().length >= 10) score += 34;
    return score;
  }, [formState]);

  return (
    <section id="contact" ref={sectionRef} className="relative overflow-hidden py-16 md:py-32">
      <SpotlightFollow containerRef={sectionRef as React.RefObject<HTMLElement>} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/30 via-background/80 to-background" style={{ zIndex: 1 }} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6" style={{ zIndex: 2 }}>
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="section-heading">Get in Touch</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Looking for opportunities to grow as a DevOps Engineer. Let's discuss how I can contribute to your team.
          </p>

          {/* Signal Strength + Time Greeting row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-6"
          >
            <SignalStrength />
            <div className="hidden h-4 w-px bg-border sm:block" />
            <div className="font-mono text-xs text-muted-foreground">
              <span className="text-green-400">●</span> Available for hire
            </div>
          </motion.div>
        </motion.div>

        {/* Time Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mx-auto mt-6 max-w-lg"
        >
          <TimeGreeting />
        </motion.div>

        <div className="mt-10 grid gap-8 sm:mt-16 sm:gap-12 lg:grid-cols-2">
          {/* ─── Contact Form ─── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="terminal" ref={formContainerRef} style={{ position: 'relative', overflow: 'hidden' }}>
              <KeystrokeRipple ripples={ripples} />
              <div className="terminal-header">
                <div className="terminal-dot bg-destructive" />
                <div className="terminal-dot bg-yellow-500" />
                <div className="terminal-dot bg-secondary" />
                <span className="ml-4 text-xs text-muted-foreground">contact.sh</span>
                {/* Form completeness badge */}
                <div className="ml-auto flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 36 36" className="rotate-[-90deg]">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(217 33% 17%)" strokeWidth="3" />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke={completeness >= 100 ? 'hsl(142 71% 45%)' : 'hsl(191 100% 50%)'}
                      strokeWidth="3"
                      strokeDasharray={`${(completeness / 100) * 94.25} 94.25`}
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 94.25' }}
                      animate={{ strokeDasharray: `${(completeness / 100) * 94.25} 94.25` }}
                      transition={{ duration: 0.4 }}
                    />
                  </svg>
                  <span className="font-mono text-[10px] text-muted-foreground">{completeness}%</span>
                </div>
              </div>

              {/* CI/CD Pipeline */}
              <div className="px-4 pt-4 sm:px-6 sm:pt-6">
                <CICDPipeline activeStage={pipelineStage} isRunning={isSubmitting} />
              </div>

              <form onSubmit={handleSubmit} className="p-4 pt-0 sm:p-6 sm:pt-0">
                <div className="mb-3 sm:mb-4">
                  <label className="mb-1.5 block font-mono text-xs text-muted-foreground sm:mb-2 sm:text-sm">
                    <span className="text-secondary">$</span> name
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:px-4 sm:py-3 transition-shadow duration-300 focus:shadow-[0_0_15px_hsl(191_100%_50%/0.15)]"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="mb-3 sm:mb-4">
                  <label className="mb-1.5 block font-mono text-xs text-muted-foreground sm:mb-2 sm:text-sm">
                    <span className="text-secondary">$</span> email
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:px-4 sm:py-3 transition-shadow duration-300 focus:shadow-[0_0_15px_hsl(191_100%_50%/0.15)]"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="mb-2 sm:mb-3">
                  <label className="mb-1.5 block font-mono text-xs text-muted-foreground sm:mb-2 sm:text-sm">
                    <span className="text-secondary">$</span> message
                  </label>
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    onKeyDown={handleKeyDown}
                    rows={4}
                    maxLength={maxChars}
                    className="w-full resize-none rounded-lg border border-border bg-muted/30 px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:px-4 sm:py-3 transition-shadow duration-300 focus:shadow-[0_0_15px_hsl(191_100%_50%/0.15)]"
                    placeholder="Tell me about the opportunity..."
                    required
                  />
                  {/* Character counter */}
                  <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
                    <span>{charCount > 0 ? `${charCount}/${maxChars}` : ''}</span>
                  </div>
                </div>

                {/* Encrypted Preview */}
                <AnimatePresence>
                  <EncryptedPreview message={formState.message} />
                </AnimatePresence>

                {/* Status Messages */}
                <AnimatePresence>
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3 text-green-500"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Message deployed successfully! 🚀</span>
                    </motion.div>
                  )}
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-red-500"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Pipeline failed. Please retry deployment.</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Deploying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Send className="h-4 w-4" />
                      Deploy Message
                    </span>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* ─── Contact Info Side ─── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-6 sm:space-y-8">
              {/* Email */}
              <motion.div
                className="group flex items-start gap-3 sm:gap-4"
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_hsl(191_100%_50%/0.2)] sm:h-12 sm:w-12">
                  <Mail className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <a href="mailto:hemanshumahajan55@gmail.com" className="text-sm text-muted-foreground transition-colors hover:text-primary sm:text-base">
                    hemanshumahajan55@gmail.com
                  </a>
                </div>
              </motion.div>

              {/* Location */}
              <motion.div
                className="group flex items-start gap-3 sm:gap-4"
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 transition-all duration-300 group-hover:bg-secondary/20 group-hover:shadow-[0_0_15px_hsl(142_71%_45%/0.2)] sm:h-12 sm:w-12">
                  <MapPin className="h-5 w-5 text-secondary sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Location</h3>
                  <p className="text-sm text-muted-foreground sm:text-base">Shirpur, Maharashtra, India</p>
                </div>
              </motion.div>

              {/* Availability Status */}
              <motion.div
                className="group flex items-start gap-3 sm:gap-4"
                whileHover={{ x: 6 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 transition-all duration-300 group-hover:bg-accent/20 group-hover:shadow-[0_0_15px_hsl(262_83%_58%/0.2)] sm:h-12 sm:w-12">
                  <Terminal className="h-5 w-5 text-accent sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Response Time</h3>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Usually within <span className="text-green-400 font-medium">24 hours</span>
                  </p>
                </div>
              </motion.div>

              {/* Orbiting Social Planets */}
              <div className="pt-2 sm:pt-4">
                <h3 className="mb-2 text-center font-semibold text-foreground">Connect With Me</h3>
                <p className="mb-4 text-center font-mono text-xs text-muted-foreground">
                  Social satellites orbiting • Click to visit
                </p>
                <OrbitingSocials />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Terminal Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 font-mono text-xs text-muted-foreground sm:gap-6"
        >
          <span>
            <span className="text-green-400">✓</span> End-to-end encrypted
          </span>
          <span className="hidden sm:inline">|</span>
          <span>
            <span className="text-primary">⚡</span> Powered by serverless
          </span>
          <span className="hidden sm:inline">|</span>
          <span>
            <span className="text-accent">🛡️</span> No spam, ever
          </span>
        </motion.div>
      </div>

      {/* Launch Animation Overlay */}
      <AnimatePresence>
        <LaunchAnimation show={showLaunch} />
      </AnimatePresence>
    </section>
  );
}