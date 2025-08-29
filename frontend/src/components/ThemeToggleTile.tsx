import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Palette, Sparkles, Zap, Star } from 'lucide-react';

const ThemeToggleTile = () => {
  const tileRef = useRef<HTMLDivElement>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('cyber-cyan');

  useEffect(() => {
    // Load theme from localStorage or default to 'cyber-cyan'
    const savedTheme = localStorage.getItem('theme') || 'cyber-cyan';
    setSelectedTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const tile = tileRef.current;
    if (!tile) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(tile,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.6,
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

  const themes = [
    { name: 'Cyber Cyan', value: 'cyber-cyan', color: '#00FFFF', bg: 'from-cyan-500/20 to-cyan-600/20', icon: Palette },
    { name: 'Neon Pink', value: 'neon-pink', color: '#FF00FF', bg: 'from-pink-500/20 to-pink-600/20', icon: Sparkles },
    { name: 'Electric Purple', value: 'electric-purple', color: '#8A2BE2', bg: 'from-purple-500/20 to-purple-600/20', icon: Zap },
    { name: 'Matrix Green', value: 'matrix-green', color: '#39FF14', bg: 'from-green-500/20 to-green-600/20', icon: Star },
  ];

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // GSAP transition for smooth theme change
    gsap.to(document.documentElement, {
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  const handleResetTheme = () => {
    handleThemeChange('cyber-cyan');
  };

  return (
    <motion.div
      ref={tileRef}
      className="bento-item glass-card min-h-[300px]"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-accent/10" />
      
      <div className="relative z-10 h-full flex flex-col p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-accent/20 border border-accent/30">
            <Palette className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold fluid-text-xl text-gradient">
              Theme Control
            </h3>
            <p className="text-muted-foreground fluid-text-sm">
              Customize your experience
            </p>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          {/* Color Themes */}
          <div className="glass-card p-4 border border-accent/30">
            <h4 className="font-medium mb-3">Retro Palettes</h4>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((theme) => (
                <motion.button
                  key={theme.value}
                  className={`p-2 rounded-lg border text-xs font-medium text-center transition-all duration-200 ${
                    selectedTheme === theme.value
                      ? 'border-primary bg-gradient-to-r ' + theme.bg
                      : 'border-border bg-gradient-to-r ' + theme.bg
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleThemeChange(theme.value)}
                  style={{ 
                    boxShadow: selectedTheme === theme.value ? `0 0 10px ${theme.color}50` : `0 0 5px ${theme.color}20`
                  }}
                >
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-1 border border-white/20"
                    style={{ backgroundColor: theme.color }}
                  />
                  {theme.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <motion.button 
              className="w-full btn-cyber text-sm py-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => localStorage.setItem('theme', selectedTheme)}
            >
              Save Theme
            </motion.button>
            <motion.button 
              className="w-full border border-secondary/50 bg-transparent text-secondary px-4 py-2 rounded-lg text-sm hover:bg-secondary/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetTheme}
            >
              Reset
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeToggleTile;