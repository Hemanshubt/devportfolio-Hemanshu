import { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import SEOHead from '@/components/SEOHead';
import CursorTrail from '@/components/CursorTrail';

// Lazy load below-the-fold components
const About = lazy(() => import('@/components/About'));
const Skills = lazy(() => import('@/components/Skills'));
const CodeShowcase = lazy(() => import('@/components/CodeShowcase'));
const Projects = lazy(() => import('@/components/Projects'));
const GithubActivity = lazy(() => import('@/components/GithubActivity'));
const Blog = lazy(() => import('@/components/Blog'));
const Certifications = lazy(() => import('@/components/Certifications'));
const Timeline = lazy(() => import('@/components/Timeline'));
const Contact = lazy(() => import('@/components/Contact'));
const Footer = lazy(() => import('@/components/Footer'));
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'));
const InteractiveTerminal = lazy(() => import('@/components/InteractiveTerminal'));
const KonamiEasterEgg = lazy(() => import('@/components/KonamiEasterEgg'));

const Index = () => {
  const location = useLocation();

  // Show loading only on page refresh, not on navigation from other pages
  const isPageRefresh = performance.navigation?.type === 1 ||
    (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload';
  const isFirstLoad = !sessionStorage.getItem('appLoaded');

  const [isLoading, setIsLoading] = useState(isFirstLoad || isPageRefresh);

  useEffect(() => {
    if (!isLoading) {
      sessionStorage.setItem('appLoaded', 'true');
    }
  }, [isLoading]);

  // Handle hash navigation (scroll to section)
  useEffect(() => {
    if (!isLoading && location.hash) {
      const sectionId = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [isLoading, location.hash]);

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${window.location.origin}/#person`,
        "name": "Hemanshu Mahajan",
        "jobTitle": "DevOps Engineer & Cloud Specialist",
        "url": window.location.origin,
        "image": `${window.location.origin}/og-image.png`,
        "sameAs": [
          "https://github.com/Hemanshubt",
          "https://www.linkedin.com/in/hemanshu-mahajan/",
          "https://x.com/Hemanshubtc"
        ],
        "knowsAbout": [
          "DevOps", "AWS", "Kubernetes", "Docker", "CI/CD",
          "Terraform", "Ansible", "Jenkins", "Helm",
          "Cloud Engineering", "Infrastructure as Code"
        ],
        "description": "DevOps Engineer specializing in CI/CD, Kubernetes, AWS, and Infrastructure as Code."
      },
      {
        "@type": "WebSite",
        "@id": `${window.location.origin}/#website`,
        "url": window.location.origin,
        "name": "Hemanshu Mahajan Portfolio",
        "description": "Portfolio of Hemanshu Mahajan — DevOps Engineer & Cloud Specialist",
        "publisher": { "@id": `${window.location.origin}/#person` }
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Hemanshu Mahajan | DevOps Engineer & Cloud Specialist"
        description="DevOps Engineer specializing in CI/CD, Kubernetes, AWS, Docker, Terraform, and Infrastructure as Code. Building scalable cloud solutions and automation pipelines."
        url={window.location.origin}
        type="website"
        author="Hemanshu Mahajan"
        tags={['DevOps', 'AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'Ansible', 'Cloud Engineer', 'Infrastructure as Code']}
        structuredData={homeStructuredData}
      />

      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen bg-background">
          <CursorTrail />
          <Navigation />
          <main>
            <Hero />
            <Marquee />
            <Suspense fallback={<div className="min-h-screen" />}>
              <About />
              <Skills />
              <CodeShowcase />
              <Projects />
              <GithubActivity />
              <Blog />
              <Certifications />
              <Timeline />
              <Contact />
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <Footer />
            <ScrollToTop />
            <InteractiveTerminal />
            <KonamiEasterEgg />
          </Suspense>
        </div>
      )}
    </>
  );
};

export default Index;

