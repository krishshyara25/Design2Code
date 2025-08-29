// src/components/ExampleLogos.tsx
import React from "react";
import { motion } from "framer-motion";

const examples = [
  { name: "NovaLabs", src: "https://api.dicebear.com/7.x/initials/svg?seed=Nova&backgroundColor=1a1a2e&color=00ffff" },
  { name: "PixelWave", src: "https://api.dicebear.com/7.x/initials/svg?seed=Pixel&backgroundColor=320,30,5&color=ff00ff" },
  { name: "CyberCore", src: "https://api.dicebear.com/7.x/initials/svg?seed=Core&backgroundColor=280,30,5&color=8a2be2" },
  { name: "GreenBit", src: "https://api.dicebear.com/7.x/initials/svg?seed=Bit&backgroundColor=120,30,5&color=39ff14" },
];

const ExampleLogos = () => {
  return (
    <div className="glass-card p-6">
      <h2 className="font-orbitron font-bold fluid-text-xl text-gradient mb-6">Example Logos</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {examples.map((ex, i) => (
          <motion.div
            key={i}
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <img src={ex.src} alt={ex.name} className="w-32 h-32 mx-auto mb-3 rounded-lg" />
            <h3 className="font-semibold">{ex.name}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExampleLogos;