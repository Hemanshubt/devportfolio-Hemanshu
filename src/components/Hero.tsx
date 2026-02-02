import { motion } from 'framer-motion';
import { ArrowDown, Cloud, Server, GitBranch, Container, Cpu, Database, Shield, Zap } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaDocker, FaAws } from 'react-icons/fa';
import { SiKubernetes, SiTerraform } from 'react-icons/si';
import { lazy, Suspense, useEffect, useState } from 'react';
import ResumeButton from './ResumeButton';

// Lazy load heavy 3D scene
const CloudScene = lazy(() => import('./CloudScene'));

// Floating icons data
const floatingIcons = [
  { Icon: FaDocker, color: '#2496ED', delay: 0, position: { top: '15%', left: '10%' } },
  { Icon: SiKubernetes, color: '#326CE5', delay: 0.5, position: { top: '20%', right: '15%' } },
  { Icon: SiTerraform, color: '#7B42BC', delay: 1, position: { top: '60%', left: '5%' } },
  { Icon: FaAws, color: '#FF9900', delay: 1.5, position: { top: '70%', right: '10%' } },
  { Icon: Container, color: '#00D4AA', delay: 2, position: { bottom: '25%', left: '15%' } },
  { Icon: Shield, color: '#10B981', delay: 2.5, position: { bottom: '30%', right: '20%' } },
];

// Typing animation texts
const typingTexts = [
  'Building CI/CD Pipelines',
  'Automating Infrastructure',
  'Deploying to Cloud',
  'Containerizing Applications',
  'Monitoring Systems',
];

export default function Hero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typing effect
  useEffect(() => {
    const currentFullText = typingTexts[currentTextIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentFullText.length) {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTextIndex]);

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 -z-10 bg-[#080d16]" />}>
        <CloudScene />
      </Suspense>

      {/* Floating Tech Icons */}
      {floatingIcons.map(({ Icon, color, delay, position }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
            y: [0, -20, 0],
          }}
          transition={{
            delay,
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="pointer-events-none absolute hidden md:block"
          style={position}
        >
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            style={{ boxShadow: `0 0 30px ${color}20` }}
          >
            <Icon className="h-8 w-8" style={{ color }} />
          </div>
        </motion.div>
      ))}

      {/* Glowing Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-secondary/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-accent/15 blur-[80px]"
        />
      </div>

      {/* Grid overlay */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />

      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        {/* Terminal-style intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 font-mono text-xs text-primary sm:mb-6 sm:px-4 sm:py-2 sm:text-sm"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
          <span>System Status: Online</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4 text-3xl font-bold leading-tight sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl"
        >
          <span className="text-glow text-primary">DevOps</span>
          <span className="text-foreground"> & </span>
          <span className="text-glow-green text-secondary">Cloud</span>
          <br />
          <span className="text-foreground">Enthusiast</span>
        </motion.h1>

        {/* Name */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-3 text-2xl font-semibold text-foreground sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl"
        >
          Hemanshu Mahajan
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mb-6 max-w-2xl text-sm text-muted-foreground sm:mb-8 sm:text-lg md:text-xl lg:text-2xl"
        >
          <span className="block font-mono text-secondary sm:inline">Passionate about CI/CD & Cloud.</span>{' '}
          <span className="block font-mono text-accent sm:inline">Ready to Build & Learn.</span>
        </motion.p>

        {/* Animated Typing Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mb-8 max-w-md"
        >
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">terminal</span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-secondary">$</span>
                <span className="text-primary">{displayText}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block h-5 w-2 bg-primary"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature tags */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-10 sm:gap-4"
        >
          {[
            { icon: Cloud, label: 'Cloud Native' },
            { icon: Server, label: 'Infrastructure as Code' },
            { icon: GitBranch, label: 'CI/CD Pipelines' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card/50 px-2.5 py-1.5 backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2"
            >
              <item.icon className="h-3 w-3 text-primary sm:h-4 sm:w-4" />
              <span className="text-xs font-medium text-foreground sm:text-sm">{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-6 flex items-center justify-center gap-4 sm:mb-8"
        >
          <a
            href="https://github.com/Hemanshubt"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:text-primary sm:h-12 sm:w-12"
          >
            <FaGithub className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/hemanshu-mahajan/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-500 sm:h-12 sm:w-12"
          >
            <FaLinkedin className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a
            href="https://x.com/Hemanshubtc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-sky-400/50 hover:bg-sky-400/10 hover:text-sky-400 sm:h-12 sm:w-12"
          >
            <FaTwitter className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          {/* <a
            href="https://t.me/Hemanshu_Mahajan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-sky-500 sm:h-12 sm:w-12"
          >
            <FaTelegram className="h-5 w-5 sm:h-6 sm:w-6" />
          </a> */}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <a href="#projects" className="btn-primary w-full sm:w-auto">
            View Projects
          </a>
          <a href="#contact" className="btn-outline w-full sm:w-auto">
            Get in Touch
          </a>
          <ResumeButton />
        </motion.div>
      </div>


    </section>
  );
}
