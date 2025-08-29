import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Zap } from 'lucide-react';
import { gsap } from 'gsap';

const UploadTile = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const tileRef = useRef<HTMLDivElement>(null);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      setUploadedFile(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
    }
  };

  return (
    <motion.div
      ref={tileRef}
      className="bento-item bento-item-wide group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-retro-grid opacity-20" />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-orbitron font-bold fluid-text-xl text-gradient">
              Design Upload
            </h3>
            <p className="text-muted-foreground fluid-text-sm">
              Drop your design screenshot
            </p>
          </div>
        </div>

        <div 
          className={`flex-1 border-2 border-dashed rounded-xl transition-all duration-300 ${
            isDragging 
              ? 'border-primary bg-primary/10 scale-105' 
              : 'border-border hover:border-primary/50'
          }`}
        >
          {uploadedFile ? (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <div className="p-4 rounded-full bg-success/20 border border-success/30 mx-auto mb-4 w-fit">
                  <Image className="w-8 h-8 text-success" />
                </div>
                <p className="font-medium text-success mb-2">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to convert to code
                </p>
                <motion.button 
                  className="btn-cyber inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="w-4 h-4" />
                  Generate Code
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <div className="p-6 rounded-full bg-primary/10 border border-primary/20 mx-auto mb-4 animate-pulse-glow">
                  <Upload className="w-12 h-12 text-primary" />
                </div>
                <h4 className="font-semibold fluid-text-lg mb-2 neon-text">
                  Drop your design here
                </h4>
                <p className="text-muted-foreground mb-4 fluid-text-sm">
                  or click to browse files
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-xs text-muted-foreground/70">
                  Supports PNG, JPG, SVG
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UploadTile;