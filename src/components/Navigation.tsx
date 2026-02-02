import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Terminal,
  User,
  Code2,
  FolderGit2,
  Award,
  GraduationCap,
  Mail,
  Sparkles
} from 'lucide-react';

const navLinks = [
  { name: 'About', href: '#about', icon: User },
  { name: 'Skills', href: '#skills', icon: Code2 },
  { name: 'Projects', href: '#projects', icon: FolderGit2 },
  { name: 'Certifications', href: '#certifications', icon: Award },
  { name: 'Education', href: '#education', icon: GraduationCap },
  { name: 'Contact', href: '#contact', icon: Mail },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect footer visibility to hide navbar
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop Bottom Center Navbar */}
      <div className={`fixed bottom-6 left-0 right-0 z-50 hidden items-center justify-center transition-all duration-300 lg:flex ${isFooterVisible ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-transparent px-3 py-2 shadow-2xl backdrop-blur-md">
            {/* Nav Links Only - Centered */}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="group relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-foreground"
              >
                {link.name}
                <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 group-hover:w-4" />
              </a>
            ))}
          </div>
        </motion.nav>
      </div>

      {/* Mobile Bottom Floating Navbar */}
      <div className={`fixed bottom-4 left-0 right-0 z-50 flex items-center justify-center px-4 transition-all duration-300 lg:hidden ${isFooterVisible ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative"
        >
          {/* Floating Pill Container */}
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-transparent px-2 py-2 shadow-2xl backdrop-blur-md">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center justify-center rounded-full bg-primary/10 p-2.5 text-primary transition-all duration-300 hover:bg-primary/20"
            >
              <Terminal className="h-5 w-5" />
            </a>

            {/* Quick Nav Icons (3 most important) */}
            <a
              href="#about"
              className="flex items-center justify-center rounded-full p-2.5 text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-foreground"
            >
              <User className="h-5 w-5" />
            </a>
            <a
              href="#projects"
              className="flex items-center justify-center rounded-full p-2.5 text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-foreground"
            >
              <FolderGit2 className="h-5 w-5" />
            </a>
            <a
              href="#contact"
              className="flex items-center justify-center rounded-full p-2.5 text-muted-foreground transition-all duration-300 hover:bg-white/5 hover:text-foreground"
            >
              <Mail className="h-5 w-5" />
            </a>

            {/* Divider */}
            <div className="mx-1 h-6 w-px bg-white/10" />

            {/* Menu Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center justify-center rounded-full p-2.5 transition-all duration-300 ${isOpen
                ? 'bg-primary text-primary-foreground rotate-180'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground'
                }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 backdrop-blur-xl lg:hidden"
          >
            {/* Close area */}
            <div
              className="absolute inset-0"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <div className="relative z-10 flex flex-col items-center gap-6 px-6">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-4 flex items-center gap-3"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20">
                  <Terminal className="h-6 w-6 text-primary" />
                </div>
                <span className="font-mono text-xl font-bold text-foreground">devops.engineer</span>
              </motion.div>

              {/* Nav Grid */}
              <div className="grid grid-cols-3 gap-4">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                      onClick={() => setIsOpen(false)}
                      className="group flex flex-col items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/10"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 transition-all duration-300 group-hover:bg-primary/20">
                        <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        {link.name}
                      </span>
                    </motion.a>
                  );
                })}
              </div>

              {/* CTA Button */}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
              >
                <Mail className="h-5 w-5" />
                Let's Connect
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
