// src/pages/StickersPage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Palette, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import LogoGenerator from "../components/LogoGenerator";
import ExampleLogos from "../components/ExampleLogos";
import ColorPaletteDisplay from "../components/ColorPaletteDisplay";

const StickersPage = () => {
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
  const [tagline, setTagline] = useState<string>("");
  const [colors, setColors] = useState<string[]>([]);

  const handleLogoGenerated = (logo: string, tagline: string, colors: string[]) => {
    setGeneratedLogo(logo);
    setTagline(tagline);
    setColors(colors);
  };

  // Get current theme colors from data-theme
  const theme = document.documentElement.getAttribute("data-theme") || "cyber-cyan";
  const themeColors = {
    "cyber-cyan": ["#00FFFF", "#00B3B3", "#006666", "#003333"],
    "neon-pink": ["#FF00FF", "#CC00CC", "#990099", "#660066"],
    "electric-purple": ["#8A2BE2", "#6A1B9A", "#4A148C", "#280274"],
    "matrix-green": ["#39FF14", "#1E7A0B", "#124D06", "#082A02"],
  };

  const suggestedColors = themeColors[theme as keyof typeof themeColors];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-retro-grid opacity-20" />

      {/* Navigation */}
      <Link to="/">
        <motion.button
          className="fixed top-6 left-6 z-50 flex items-center gap-2 btn-cyber"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
      </Link>

      <div className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron font-extrabold fluid-text-4xl text-gradient mb-4">
            Logo & Sticker Studio
          </h1>
          <p className="fluid-text-lg text-muted-foreground">
            Generate stunning logos, taglines, and color themes powered by AI
          </p>
        </motion.div>

        {/* Generator */}
        <div className="glass-card p-6 mb-12">
          <LogoGenerator onGenerate={handleLogoGenerated} />
        </div>

        {/* Output */}
        {generatedLogo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-12"
          >
            <h2 className="font-orbitron font-bold fluid-text-2xl text-gradient mb-6">Your Generated Brand</h2>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div className="text-center">
                <img src={generatedLogo} alt="Generated Logo" className="w-48 h-48 mx-auto mb-4 rounded-lg" />
                <h3 className="font-bold text-lg">Logo</h3>
              </div>

              <div>
                <div className="mb-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Suggested Tagline
                  </h3>
                  <p className="text-xl font-medium text-primary-glow">{tagline}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-secondary" />
                    Suggested Colors
                  </h3>
                  <ColorPaletteDisplay colors={colors} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Theme-Based Colors */}
        <div className="glass-card p-6 mb-12">
          <h2 className="font-orbitron font-bold fluid-text-xl text-gradient mb-4">Theme-Based Palette</h2>
          <p className="text-muted-foreground mb-4">
            Based on your selected theme: <strong>{theme.replace('-', ' ')}</strong>
          </p>
          <ColorPaletteDisplay colors={suggestedColors} copyable />
        </div>

        {/* Examples */}
        <ExampleLogos />
      </div>
    </div>
  );
};

export default StickersPage;