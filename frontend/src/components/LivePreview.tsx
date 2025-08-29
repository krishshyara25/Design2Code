import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image } from 'lucide-react';

interface LivePreviewProps {
  code: string;
  uploadedFile: File | null;
}

const LivePreview = ({ code, uploadedFile }: LivePreviewProps) => {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewRef.current) return;

    // Create a temporary container to render the generated component
    const container = previewRef.current;
    container.innerHTML = ''; // Clear previous content

    try {
      // Simulate rendering the generated component
      // In a real app, this would involve a dynamic component loader or eval (with caution)
      // For this example, we'll render a simplified version based on the code
      const div = document.createElement('div');
      div.className = 'min-h-[300px] bg-background flex items-center justify-center p-4 glass-card';
      
      if (uploadedFile) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(uploadedFile);
        img.alt = 'Uploaded Design';
        img.className = 'max-w-full h-auto mb-4 rounded-lg';
        div.appendChild(img);
      }

      const content = document.createElement('div');
      content.className = 'text-center';
      content.innerHTML = `
        <h1 class="text-2xl font-bold text-primary mb-2">${uploadedFile ? 'Generated UI' : 'AI-Generated Design'}</h1>
        <p class="text-muted-foreground mb-4">${uploadedFile ? 'Based on uploaded image' : 'Based on your prompt'}</p>
        <button class="btn-cyber">Explore</button>
      `;
      div.appendChild(content);
      container.appendChild(div);

      // Clean up object URL
      return () => {
        if (uploadedFile) {
          URL.revokeObjectURL(img.src);
        }
      };
    } catch (error) {
      console.error('Error rendering preview:', error);
      container.innerHTML = '<p class="text-destructive">Error rendering preview</p>';
    }
  }, [code, uploadedFile]);

  return (
    <motion.div
      className="glass-card p-4 border border-secondary/30"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Image className="w-5 h-5 text-secondary" />
        <span className="font-semibold text-secondary">Live Preview</span>
      </div>
      <div
        ref={previewRef}
        className="min-h-[300px] w-full rounded-lg overflow-auto"
      />
    </motion.div>
  );
};

export default LivePreview;