import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { gsap } from 'gsap';

const stickers = [
  { name: 'AI Bot', url: 'https://placeholder.co/512x512?text=AI+Bot+Sticker' },
  { name: 'Design Flow', url: 'https://placeholder.co/512x512?text=Design+Flow+Sticker' },
  { name: 'Code Gen', url: 'https://placeholder.co/512x512?text=Code+Gen+Sticker' },
  { name: 'Neon AI', url: 'https://placeholder.co/512x512?text=Neon+AI+Sticker' },
];

const StickersTile = () => {
  const tileRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tile = tileRef.current;
    const cards = cardsRef.current;
    if (!tile || !cards) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(tile,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: tile,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo(cards.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cards,
            start: "top 80%",
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
      className="bento-item bento-item-wide"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5" />
      
      <div className="relative z-10 h-full">
        <div className="mb-8">
          <h3 className="font-orbitron font-bold fluid-text-2xl text-gradient mb-2">
            Download Stickers
          </h3>
          <p className="text-muted-foreground fluid-text-base">
            Fun AI-themed stickers for WhatsApp and more
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stickers.map((sticker, index) => (
            <motion.a
              key={sticker.name}
              href={sticker.url}
              download={`${sticker.name}.png`}
              className="glass-card p-4 border border-border group cursor-pointer will-change-transform flex flex-col items-center"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={sticker.url} 
                alt={sticker.name} 
                className="w-32 h-32 object-contain mb-3"
              />
              <h4 className="font-semibold fluid-text-md mb-2 text-center">
                {sticker.name}
              </h4>
              <div className="flex items-center gap-2 text-primary">
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StickersTile;