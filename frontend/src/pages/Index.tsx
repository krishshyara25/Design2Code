import React from "react";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import FeaturesTile from '../components/FeaturesTile';
import ImpactTile from '../components/ImpactTile';
import ThemeToggleTile from '../components/ThemeToggleTile';
import FooterTile from '../components/FooterTile';
import LoadingSpinner from '../components/LoadingSpinner';
import RealisticRobot from './RealisticRobot'; // ✅ Import the robot component

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef(null);
  const bentoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const hero = heroRef.current;
    const bento = bentoRef.current;
    if (!hero || !bento) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(hero.querySelector('.hero-title'),
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power4.out" }
      )
      .fromTo(hero.querySelector('.hero-subtitle'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power4.out" }, "-=0.4"
      )
      .fromTo(hero.querySelector('.hero-cta'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power4.out" }, "-=0.3"
      );

      gsap.to(hero, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.fromTo(bento,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: bento,
            start: "top 75%",
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
      
      {/* Stickers Button in Top Right Corner */}
      <Link to="/stickers" className="fixed top-4 right-4 z-50">
        <motion.button 
          className="btn-cyber text-sm px-4 py-2 font-semibold rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          create logo
        </motion.button>
      </Link>

      {/* === REALISTIC ROBOT - Positioned on Right Side === */}
      <div className="fixed top-1/3 right-12 z-20 hidden lg:block w-[300px] h-[300px] pointer-events-none">
        <RealisticRobot />
      </div>
      {/* ================================================ */}

      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="absolute inset-0 bg-retro-grid opacity-20" />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div 
            className="hero-title mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 className="font-orbitron font-extrabold fluid-text-5xl text-gradient mb-4 tracking-tight">
              DesignFlow AI
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <span className="font-orbitron font-bold fluid-text-2xl neon-text">
                Design to Code
              </span>
              <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
            </div>
          </motion.div>

          <motion.div 
            className="hero-subtitle mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="fluid-text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your design vision into production-ready code with 
              <span className="text-gradient font-semibold"> AI-powered precision</span>. 
              Streamline workflows, boost productivity, and deploy with confidence.
            </p>
          </motion.div>

          <motion.div 
            className="hero-cta flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Link to="/create">
              <motion.button 
                className="btn-cyber text-lg px-8 py-3.5 font-semibold rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Creating
              </motion.button>
            </Link>
            
            <motion.button 
              className="border border-secondary/50 bg-transparent text-secondary px-8 py-3.5 rounded-lg font-semibold hover:bg-secondary/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Demo
            </motion.button>
          </motion.div>

          <motion.div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-primary/60" />
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-orbitron font-bold fluid-text-3xl text-gradient mb-4 tracking-tight">
              Why Choose DesignFlow AI
            </h2>
            <p className="fluid-text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform delivers cutting-edge tools to streamline your design-to-code process, 
              empowering teams to create faster and smarter.
            </p>
          </div>

          <div ref={bentoRef} className="bento-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeaturesTile />
            <ImpactTile />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-3">
              <ThemeToggleTile />
              <FooterTile />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Background Orbs */}
      <div className="fixed top-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default LandingPage;