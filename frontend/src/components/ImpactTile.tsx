import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users, DollarSign } from 'lucide-react';
import { gsap } from 'gsap';
import VanillaTilt from 'vanilla-tilt';

const impacts = [
  {
    icon: Clock,
    title: "Time Savings",
    description: "Reduce development time by up to 70%",
    color: "text-cyber-cyan",
    bgGradient: "from-cyber-cyan/20 to-blue-500/10",
    border: "border-cyber-cyan/40",
    shadow: "shadow-[0_0_20px_rgba(0,255,255,0.3)]"
  },
  {
    icon: TrendingUp,
    title: "Productivity Boost",
    description: "Focus on innovation instead of manual coding",
    color: "text-cyber-green",
    bgGradient: "from-cyber-green/20 to-green-500/10",
    border: "border-cyber-green/40",
    shadow: "shadow-[0_0_20px_rgba(0,255,0,0.3)]"
  },
  {
    icon: Users,
    title: "Team Efficiency",
    description: "Bridge the gap between designers and developers",
    color: "text-cyber-pink",
    bgGradient: "from-cyber-pink/20 to-pink-500/10",
    border: "border-cyber-pink/40",
    shadow: "shadow-[0_0_20px_rgba(255,0,255,0.3)]"
  },
  {
    icon: DollarSign,
    title: "Cost Reduction",
    description: "Lower project costs with automated workflows",
    color: "text-cyber-purple",
    bgGradient: "from-cyber-purple/20 to-purple-500/10",
    border: "border-cyber-purple/40",
    shadow: "shadow-[0_0_20px_rgba(128,0,255,0.3)]"
  },
];

const ImpactTile = () => {
  const tileRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tile = tileRef.current;
    const cards = cardsRef.current;
    if (!tile || !cards) return;

    // Initialize VanillaTilt for 3D effect
    VanillaTilt.init(cards.querySelectorAll('.impact-card'), {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.3,
      scale: 1.02
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(tile,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: tile,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(cards.children,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: cards,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, tile);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={tileRef}
      className="bento-item bento-item-wide relative overflow-hidden rounded-xl"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent" />
      
      <div className="relative z-10 h-full p-6 md:p-8">
        <div className="mb-8 text-center">
          <h3 className="font-orbitron font-extrabold fluid-text-3xl text-gradient bg-clip-text bg-gradient-to-r from-primary to-secondary mb-3">
            Impact of DesignFlow AI
          </h3>
          <p className="text-muted-foreground fluid-text-base max-w-2xl mx-auto">
            Transforming the future of digital product creation
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {impacts.map((impact, index) => (
            <motion.div
              key={impact.title}
              className={`impact-card glass-card p-6 border ${impact.border} rounded-xl bg-gradient-to-br ${impact.bgGradient} backdrop-blur-sm hover:${impact.shadow} transition-all duration-300 group cursor-pointer will-change-transform`}
              whileHover={{ scale: 1.05, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className={`p-4 rounded-xl ${impact.bgGradient} w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <impact.icon className={`w-8 h-8 ${impact.color}`} />
              </motion.div>
              
              <h4 className={`font-orbitron font-bold fluid-text-xl mb-3 ${impact.color}`}>
                {impact.title}
              </h4>
              
              <p className="text-muted-foreground fluid-text-base leading-relaxed">
                {impact.description}
              </p>
              
              <div className="mt-4 h-1.5 bg-border/30 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-gradient-to-r ${impact.bgGradient}`}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: index * 0.2, ease: "circ.out" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ImpactTile;