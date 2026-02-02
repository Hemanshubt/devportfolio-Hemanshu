import { motion } from 'framer-motion';
import { Cloud, Server, GitBranch, Container, Shield } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaDocker, FaAws } from 'react-icons/fa';
import { SiKubernetes, SiTerraform } from 'react-icons/si';
import { lazy, Suspense } from 'react';
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



export default function Hero() {

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 -z-10 bg-[#080d16]" />}>
        <CloudScene />
      </Suspense>

      {/* Floating Tech Icons - Static with CSS animation */}
      {floatingIcons.map(({ Icon, color, position }, index) => (
        <div
          key={index}
          className="pointer-events-none absolute hidden animate-float md:block"
          style={{
            ...position,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${4 + index * 0.5}s`
          }}
        >
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            style={{ boxShadow: `0 0 20px ${color}15` }}
          >
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
        </div>
      ))}

      {/* Glowing Orbs - Static CSS only */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-72 w-72 animate-pulse rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -right-20 top-1/3 h-96 w-96 animate-pulse rounded-full bg-secondary/10 blur-[120px]" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 h-64 w-64 animate-pulse rounded-full bg-accent/10 blur-[80px]" style={{ animationDelay: '4s' }} />
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
