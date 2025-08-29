import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ChevronDown } from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import UploadTile from './UploadTile';
import PreviewTile from './PreviewTile';
import FeaturesTile from './FeaturesTile';
import ThemeToggleTile from './ThemeToggleTile';
import FooterTile from './FooterTile';
import LoadingSpinner from './LoadingSpinner';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Loading sequence
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const hero = heroRef.current;
    const bento = bentoRef.current;
    if (!hero || !bento) return;

    const ctx = gsap.context(() => {
      // Hero animations
      const tl = gsap.timeline();
      
      tl.fromTo(hero.querySelector('.hero-title'),
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      )
      .fromTo(hero.querySelector('.hero-subtitle'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5"
      )
      .fromTo(hero.querySelector('.hero-cta'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3"
      );

      // Parallax effects
      gsap.to(hero, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // Bento grid reveal
      gsap.fromTo(bento,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bento,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, [hero, bento]);

    return () => ctx.revert();
  }, [isLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-6 py-20"
      >
        <div className="absolute inset-0 bg-retro-grid opacity-30" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div 
            className="hero-title mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="font-orbitron font-black fluid-text-5xl text-gradient mb-4">
              DesignFlow AI
            </h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <span className="font-orbitron font-bold fluid-text-2xl neon-text">
                Design to Code
              </span>
              <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
            </div>
          </motion.div>

          <motion.div 
            className="hero-subtitle mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="fluid-text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your design screenshots into production-ready code with 
              <span className="text-gradient font-semibold"> AI-powered precision</span>. 
              No more manual coding - just upload, preview, and deploy.
            </p>
          </motion.div>

          <motion.div 
            className="hero-cta space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.button 
              className="btn-cyber text-lg px-8 py-4 mr-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Creating
            </motion.button>
            
            <motion.button 
              className="border border-secondary/50 bg-transparent text-secondary px-8 py-4 rounded-lg hover:bg-secondary/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Demo
            </motion.button>
          </motion.div>

          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-primary/70" />
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron font-bold fluid-text-3xl text-gradient mb-4">
              Experience the Future
            </h2>
            <p className="fluid-text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform revolutionizes the design-to-code workflow with 
              cutting-edge technology and intuitive interfaces.
            </p>
          </div>

          <div ref={bentoRef} className="bento-grid">
            <UploadTile />
            <PreviewTile />
            <FeaturesTile />
            <ThemeToggleTile />
            <FooterTile />
          </div>
        </div>
      </section>

      {/* Background Glow Effects */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default LandingPage;