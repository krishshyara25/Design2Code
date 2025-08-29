import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Code, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import OrbPreview from './OrbPreview';

const PreviewTile = () => {
  const tileRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tile = tileRef.current;
    const text = textRef.current;
    if (!tile || !text) return;

    const ctx = gsap.context(() => {
      // Tile animation
      gsap.fromTo(tile,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: tile,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Scrolling text animation
      gsap.to(text, {
        x: "-50%",
        duration: 20,
        repeat: -1,
        ease: "none"
      });
    }, tile);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={tileRef}
      className="bento-item bento-item-large group overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-secondary/20 border border-secondary/30">
            <Eye className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold fluid-text-xl text-gradient-pink">
              AI Preview
            </h3>
            <p className="text-muted-foreground fluid-text-sm">
              Watch your design come to life
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-h-64">
            <OrbPreview />
          </div>

          <div className="flex-1 space-y-4">
            <div className="glass-card p-4 border border-primary/30">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-primary" />
                <span className="font-semibold text-primary">Generated Code</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="text-cyber-cyan">&lt;div className="hero-section"&gt;</div>
                <div className="text-cyber-pink ml-4">&lt;h1&gt;Welcome&lt;/h1&gt;</div>
                <div className="text-cyber-green ml-4">&lt;button&gt;Get Started&lt;/button&gt;</div>
                <div className="text-cyber-cyan">&lt;/div&gt;</div>
              </div>
            </div>

            <div className="glass-card p-4 border border-secondary/30">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-secondary" />
                <span className="font-semibold text-secondary">AI Analysis</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Components</span>
                  <span className="text-success">12 detected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="text-success">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Framework</span>
                  <span className="text-primary">React + Tailwind</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling text */}
        <div className="mt-6 overflow-hidden">
          <div 
            ref={textRef}
            className="flex whitespace-nowrap text-6xl font-orbitron font-black opacity-10"
            style={{ width: "200%" }}
          >
            <span className="text-primary">DESIGN TO CODE • AI POWERED • PIXEL PERFECT • </span>
            <span className="text-secondary">DESIGN TO CODE • AI POWERED • PIXEL PERFECT • </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PreviewTile;