// src/pages/CreatePage.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Zap, Upload as UploadIcon, Pencil, Image as ImageIcon, ArrowLeft, Check } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import LivePreview from '../components/LivePreview';

// Mock template suggestions
const mockTemplates = [
  {
    id: 1,
    name: 'Modern Dashboard',
    preview: 'https://via.placeholder.com/300x200/00ffff/000000?text=Dashboard',
  },
  {
    id: 2,
    name: 'E-Commerce Store',
    preview: 'https://via.placeholder.com/300x200/ff00ff/000000?text=Shop',
  },
  {
    id: 3,
    name: 'Blog Layout',
    preview: 'https://via.placeholder.com/300x200/8a2be2/ffffff?text=Blog',
  },
  {
    id: 4,
    name: 'Landing Page',
    preview: 'https://via.placeholder.com/300x200/39ff14/000000?text=Landing',
  },
  {
    id: 5,
    name: 'Portfolio Grid',
    preview: 'https://via.placeholder.com/300x200/00b3b3/ffffff?text=Portfolio',
  },
  {
    id: 6,
    name: 'Task Manager',
    preview: 'https://via.placeholder.com/300x200/cc6600/ffffff?text=Tasks',
  },
];

const CreatePage = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<'select' | 'prompt' | 'upload' | 'whiteboard' | 'templates'>('select');
  const [prompt, setPrompt] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(page.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out"
        }
      );
    }, page);

    return () => ctx.revert();
  }, []);

  // --- Step 1: Generate from Prompt ---
  const handleGenerateFromPrompt = () => {
    const generated = `// Generated React component from prompt: "${prompt}"
import React from 'react';

const GeneratedComponent = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-6 glass-card max-w-lg">
        <h1 className="text-3xl font-bold text-primary mb-4">${prompt}</h1>
        <p className="text-muted-foreground mb-6">AI-generated UI based on your description</p>
        <button className="btn-cyber">Get Started</button>
      </div>
    </div>
  );
};

export default GeneratedComponent;`;
    setGeneratedCode(generated);
    setStep('prompt');
  };

  // --- Step 2: Upload Image ---
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
      const generated = `// Generated React component from image: ${imageFile.name}
import React from 'react';

const GeneratedComponent = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-6 glass-card max-w-lg">
        <img src="${URL.createObjectURL(imageFile)}" alt="Uploaded Design" className="max-w-full h-auto mb-4 rounded-lg" />
        <h1 className="text-3xl font-bold text-primary mb-4">Generated UI</h1>
        <p className="text-muted-foreground mb-6">AI-generated code from your design</p>
        <button className="btn-cyber">Deploy</button>
      </div>
    </div>
  );
};

export default GeneratedComponent;`;
      setGeneratedCode(generated);
      setStep('upload');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      const generated = `// Generated React component from image: ${file.name}
import React from 'react';

const GeneratedComponent = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-6 glass-card max-w-lg">
        <img src="${URL.createObjectURL(file)}" alt="Uploaded Design" className="max-w-full h-auto mb-4 rounded-lg" />
        <h1 className="text-3xl font-bold text-primary mb-4">Generated UI</h1>
        <p className="text-muted-foreground mb-6">AI-generated code from your design</p>
        <button className="btn-cyber">Deploy</button>
      </div>
    </div>
  );
};

export default GeneratedComponent;`;
      setGeneratedCode(generated);
      setStep('upload');
    }
  };

  // --- Step 3: Whiteboard → Generate Templates ---
  const handleWhiteboardSubmit = () => {
    setIsDrawing(false);
    setStep('templates');
  };

  const handleTemplateSelect = (template: typeof mockTemplates[0]) => {
    const generated = `// Generated from selected template: ${template.name}
import React from 'react';

const GeneratedComponent = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-6 glass-card max-w-lg">
        <img src="${template.preview}" alt="${template.name}" className="max-w-full h-auto mb-4 rounded-lg" />
        <h1 className="text-3xl font-bold text-primary mb-4">${template.name}</h1>
        <p className="text-muted-foreground mb-6">Customize this template further.</p>
        <button className="btn-cyber">Edit Template</button>
      </div>
    </div>
  );
};

export default GeneratedComponent;`;
    setGeneratedCode(generated);
    setStep('prompt'); // Reuse preview area
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        {/* Back Button */}
        {step !== 'select' && (
          <motion.button
            onClick={() => setStep('select')}
            className="flex items-center gap-2 text-primary hover:text-primary-glow mb-6 btn-cyber"
            whileHover={{ scale: 1.05 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
        )}

        {/* Step 1: Choose Method */}
        {step === 'select' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h1 className="font-orbitron font-black fluid-text-5xl text-gradient mb-6">
              Choose Your Creation Method
            </h1>
            <p className="fluid-text-lg text-muted-foreground max-w-3xl mx-auto">
              Generate UI from text, upload a design, or sketch your idea on the whiteboard.
            </p>
          </motion.div>
        )}

        {/* Selection Grid */}
        {step === 'select' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Option 1: Prompt */}
            <motion.div
              className="glass-card p-8 text-center cursor-pointer hover:scale-105 transition-transform"
              whileHover={{ y: -6 }}
              onClick={() => setStep('prompt')}
            >
              <Zap className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="font-orbitron font-bold fluid-text-xl text-gradient mb-3">
                From Prompt
              </h3>
              <p className="text-muted-foreground mb-4">
                Describe your idea in words. AI will generate the UI.
              </p>
              <div className="btn-cyber inline-flex">Start Typing</div>
            </motion.div>

            {/* Option 2: Upload */}
            <motion.div
              className="glass-card p-8 text-center cursor-pointer hover:scale-105 transition-transform"
              whileHover={{ y: -6 }}
              onClick={() => setStep('upload')}
            >
              <UploadIcon className="w-16 h-16 mx-auto mb-4 text-secondary" />
              <h3 className="font-orbitron font-bold fluid-text-xl text-gradient mb-3">
                From Image
              </h3>
              <p className="text-muted-foreground mb-4">
                Upload a design screenshot. We'll generate code.
              </p>
              <div className="btn-cyber inline-flex">Upload Design</div>
            </motion.div>

            {/* Option 3: Whiteboard */}
            <motion.div
              className="glass-card p-8 text-center cursor-pointer hover:scale-105 transition-transform"
              whileHover={{ y: -6 }}
              onClick={() => setStep('whiteboard')}
            >
              <Pencil className="w-16 h-16 mx-auto mb-4 text-accent" />
              <h3 className="font-orbitron font-bold fluid-text-xl text-gradient mb-3">
                Whiteboard
              </h3>
              <p className="text-muted-foreground mb-4">
                Draw your idea. AI will suggest templates.
              </p>
              <div className="btn-cyber inline-flex">Start Drawing</div>
            </motion.div>
          </div>
        )}

        {/* Step 2: Prompt Input */}
        {step === 'prompt' && (
          <div className="glass-card p-8 border border-primary/30 mb-8">
            <h2 className="font-orbitron font-bold fluid-text-2xl text-gradient mb-6">
              Generate from Prompt
            </h2>
            <p className="text-muted-foreground mb-4">
                Describe your design idea to generate a live preview.
              </p>
            <textarea
              className="w-full h-40 p-4 border border-border rounded-lg bg-muted/20 text-foreground placeholder-muted-foreground resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'A modern todo list app with dark mode and drag-and-drop tasks'"
            />
            <motion.button
              className="btn-cyber w-full mt-4 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateFromPrompt}
              disabled={!prompt}
            >
              <Zap className="w-5 h-5" />
              Generate Design
            </motion.button>
          </div>
        )}

        {/* Step 3: Upload Image */}
        {step === 'upload' && (
          <div
            className="glass-card p-8 border border-secondary/30 mb-8"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h2 className="font-orbitron font-bold fluid-text-2xl text-gradient mb-6">
              Upload Image for Code
            </h2>
            <p className="text-muted-foreground mb-4">
              Upload a design screenshot to generate code and preview.
            </p>
            <div
              className={`flex-1 border-2 border-dashed rounded-xl transition-all duration-300 h-40 flex items-center justify-center ${
                isDragging ? 'border-primary bg-primary/10 scale-105' : 'border-border hover:border-primary/50'
              }`}
            >
              {uploadedFile ? (
                <div className="text-center">
                  <p className="font-medium text-success mb-2">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Image uploaded successfully
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <UploadIcon className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="font-semibold mb-2">Drop image here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Whiteboard */}
        {step === 'whiteboard' && (
          <div className="glass-card p-8 border border-accent/30 mb-8">
            <h2 className="font-orbitron font-bold fluid-text-2xl text-gradient mb-6">
              Sketch Your Idea
            </h2>
            <p className="text-muted-foreground mb-4">
              Draw a rough sketch of your idea. Don’t worry about details — just outline the layout.
            </p>
            <div
              className="border-2 border-dashed border-primary/50 rounded-xl h-60 bg-muted/10 flex items-center justify-center cursor-crosshair"
              onClick={() => setIsDrawing(true)}
            >
              {isDrawing ? (
                <p className="text-primary">Keep drawing... Click below when done.</p>
              ) : (
                <p className="text-muted-foreground">Click to start drawing</p>
              )}
            </div>
            <motion.button
              className="btn-cyber w-full mt-4"
              whileHover={{ scale: 1.05 }}
              onClick={handleWhiteboardSubmit}
            >
              Submit Sketch → Get Templates
            </motion.button>
          </div>
        )}

        {/* Step 5: Template Selection */}
        {step === 'templates' && (
          <div className="glass-card p-8 border border-primary/30 mb-8">
            <h2 className="font-orbitron font-bold fluid-text-2xl text-gradient mb-6">
              Choose a Template
            </h2>
            <p className="text-muted-foreground mb-6">
              Based on your sketch, here are 6 suggested templates. Select one to customize.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {mockTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  className="border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3 bg-muted/20 text-center">
                    <p className="font-medium">{template.name}</p>
                    <Check className="w-5 h-5 text-success mx-auto mt-1 hidden group-hover:block" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Live Preview & Code */}
        {(step === 'prompt' || step === 'upload') && generatedCode && (
          <div className="glass-card p-8 border border-accent/30">
            <h2 className="font-orbitron font-bold fluid-text-2xl text-gradient mb-6">
              Live Preview & Code
            </h2>
            <div className="flex flex-col gap-6">
              <LivePreview code={generatedCode} uploadedFile={uploadedFile} />
              <div className="glass-card p-4 border border-primary/30">
                <h3 className="font-semibold text-primary mb-3">Generated Code</h3>
                <pre className="whitespace-pre-wrap text-foreground text-sm font-mono bg-muted/20 p-4 rounded-lg">
                  {generatedCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Default Empty State */}
        {step === 'select' && (
          <div className="text-center text-muted-foreground mt-12">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-primary/30" />
            <p>Select a method to begin creating your design.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePage;