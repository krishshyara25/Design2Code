// src/components/LogoGenerator.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface LogoGeneratorProps {
  onGenerate: (logo: string, tagline: string, colors: string[]) => void;
}

const LogoGenerator: React.FC<LogoGeneratorProps> = ({ onGenerate }) => {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    style: "tech",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = [
    { value: "tech", label: "Tech / Cyber" },
    { value: "creative", label: "Creative / Art" },
    { value: "minimal", label: "Minimalist" },
    { value: "retro", label: "Retro Futuristic" },
  ];

  const industries = [
    "Tech", "Fashion", "Gaming", "Food", "Education", "Health", "Finance", "Music"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const logoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}&backgroundColor=1a1a2e,16213e&color=00ffff,ff00ff,8a2be2,39ff14`;
      const taglines = [
        `Innovate the future`,
        `Where design meets code`,
        `Built for tomorrow`,
        `Empowering your vision`,
        `Next-gen digital identity`,
      ];
      const colorThemes = {
        cyber: ["#00FFFF", "#00B3B3", "#006666", "#003333"],
        neon: ["#FF00FF", "#CC00CC", "#990099", "#660066"],
        electric: ["#8A2BE2", "#6A1B9A", "#4A148C", "#280274"],
        matrix: ["#39FF14", "#1E7A0B", "#124D06", "#082A02"],
      };
      const themeKey = formData.style === "retro" ? "neon" : "cyber";
      const colors = colorThemes[themeKey as keyof typeof colorThemes];

      onGenerate(logoUrl, `${formData.name} — ${taglines[Math.floor(Math.random() * taglines.length)]}`, colors);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block fluid-text-sm font-medium mb-2">Business Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-transparent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Enter your brand name"
        />
      </div>

      <div>
        <label className="block fluid-text-sm font-medium mb-2">Industry</label>
        <select
          value={formData.industry}
          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          className="w-full px-4 py-3 bg-transparent border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Select Industry</option>
          {industries.map((ind) => (
            <option key={ind} value={ind.toLowerCase()}>{ind}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block fluid-text-sm font-medium mb-2">Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {styles.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setFormData({ ...formData, style: s.value })}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.style === s.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border hover:bg-muted/30"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isGenerating}
        className="btn-cyber flex items-center justify-center gap-2 w-full py-3"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isGenerating ? (
          <>
            <Zap className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            Generate Logo & Branding
          </>
        )}
      </motion.button>
    </form>
  );
};

export default LogoGenerator;