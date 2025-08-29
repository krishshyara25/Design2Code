import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Globe, Heart, ArrowUp } from 'lucide-react';
import { gsap } from 'gsap';

const FooterTile = () => {
  const tileRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(tile,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: tile,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, tile);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: '#', color: 'hover:text-white' },
    { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-cyan-400' },
    { icon: Globe, label: 'Website', href: '#', color: 'hover:text-green-400' },
  ];

  return (
    <motion.div
      ref={tileRef}
      className="bento-item bento-item-wide"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
      
      {/* Scroll Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-border rounded-t-xl overflow-hidden">
        <motion.div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-primary to-secondary"
          style={{ width: `${scrollProgress}%` }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
        />
      </div>
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-orbitron font-bold fluid-text-xl text-gradient">
              DesignFlow AI
            </h3>
            <p className="text-muted-foreground fluid-text-sm">
              Transform designs into code
            </p>
          </div>
          
          <motion.button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-5 h-5 text-primary" />
          </motion.button>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-primary mb-3">Product</h4>
              <div className="space-y-2">
                {['Features', 'Pricing', 'API', 'Documentation'].map((item) => (
                  <motion.a
                    key={item}
                    href="#"
                    className="block text-muted-foreground hover:text-primary transition-colors text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-secondary mb-3">Company</h4>
              <div className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <motion.a
                    key={item}
                    href="#"
                    className="block text-muted-foreground hover:text-secondary transition-colors text-sm"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-accent mb-3">Connect</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className={`p-2 rounded-lg bg-muted/10 border border-border ${social.color} transition-colors`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span>by the DesignFlow team</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                © 2024 DesignFlow AI. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FooterTile;