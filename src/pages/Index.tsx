import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Blog from '@/components/Blog';
import Certifications from '@/components/Certifications';
import Timeline from '@/components/Timeline';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SEOHead from '@/components/SEOHead';

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

  return (
    <>
      <SEOHead
        title="Hemanshu Mahajan | DevOps Engineer & Cloud Specialist"
        description="DevOps Engineer specializing in CI/CD, Kubernetes, AWS, Docker, Terraform, and Infrastructure as Code. Building scalable cloud solutions and automation pipelines."
        url={window.location.origin}
        type="website"
        author="Hemanshu Mahajan"
        tags={['DevOps', 'AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Terraform', 'Ansible', 'Cloud Engineer', 'Infrastructure as Code']}
      />
      
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen bg-background">
          <Navigation />
          <Hero />
          <Marquee />
          <About />
          <Skills />
          <Projects />
          <Blog />
          <Certifications />
          <Timeline />
          <Contact />
          <Footer />
          <ScrollToTop />
        </div>
      )}
    </>
  );
};

export default Index;
