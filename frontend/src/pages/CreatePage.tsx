import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Zap, Upload as UploadIcon, Pencil, Image as ImageIcon, ArrowLeft, Check, Eye } from 'lucide-react';
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
  const [isLoadingCode, setIsLoadingCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);

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
    const generated = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated from Prompt</title>
  <style>
    body {
      margin: 0;
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #1e3a8a, #6b21a8);
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      max-width: 600px;
      width: 90%;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      color: #e2e8f0;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(45deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    @media (max-width: 640px) {
      h1 { font-size: 2rem; }
      p { font-size: 1rem; }
      .container { padding: 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${prompt}</h1>
    <p>AI-generated UI based on your description</p>
    <button>Get Started</button>
  </div>
</body>
</html>`;
    setGeneratedCode(generated);
    setErrorMessage(null);
    setStep('prompt');
  };

  // --- Step 2: Upload Image and Generate Code ---
  const generateCodeFromImage = async (file: File) => {
    setIsLoadingCode(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload/image-to-code', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.code) {
        setGeneratedCode(data.code);
      } else {
        throw new Error('No code returned from the server');
      }
    } catch (error) {
      console.error('Error generating code:', error);
      setErrorMessage(error.message || 'Failed to generate code from image. Please try again.');
      // Fallback code
      setGeneratedCode(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error Generating Code</title>
  <style>
    body {
      margin: 0;
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #1e3a8a, #6b21a8);
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      max-width: 600px;
      width: 90%;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      color: #e2e8f0;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(45deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }
    @media (max-width: 640px) {
      h1 { font-size: 2rem; }
      p { font-size: 1rem; }
      .container { padding: 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${URL.createObjectURL(file)}" alt="Uploaded Design">
    <h1>Generated UI</h1>
    <p>AI failed to generate code. Edit this fallback.</p>
    <button>Deploy</button>
  </div>
</body>
</html>`);
    } finally {
      setIsLoadingCode(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    if (imageFile) {
      setUploadedFile(imageFile);
      await generateCodeFromImage(imageFile);
      setStep('upload');
    } else {
      setErrorMessage('Please upload a valid image file (PNG or JPEG).');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      await generateCodeFromImage(file);
      setStep('upload');
    } else {
      setErrorMessage('Please select a valid image file (PNG or JPEG).');
    }
  };

  // --- Step 3: Whiteboard → Generate Templates ---
  const handleWhiteboardSubmit = () => {
    setIsDrawing(false);
    setStep('templates');
  };

  const handleTemplateSelect = (template: typeof mockTemplates[0]) => {
    const generated = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.name}</title>
  <style>
    body {
      margin: 0;
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #1e3a8a, #6b21a8);
      color: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
      max-width: 600px;
      width: 90%;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 1.5rem;
      color: #e2e8f0;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(45deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }
    @media (max-width: 640px) {
      h1 { font-size: 2rem; }
      p { font-size: 1rem; }
      .container { padding: 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="${template.preview}" alt="${template.name}">
    <h1>${template.name}</h1>
    <p>Customize this template further.</p>
    <button>Edit Template</button>
  </div>
</body>
</html>`;
    setGeneratedCode(generated);
    setErrorMessage(null);
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
                  <p className="text-sm text-muted-foreground">or click to browse (PNG/JPEG)</p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
            {isLoadingCode && <p className="text-center mt-4 text-primary">Generating code...</p>}
            {errorMessage && <p className="text-center mt-4 text-red-500">{errorMessage}</p>}
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

        {/* Live Preview & Code Editor */}
        {generatedCode && (
          <div className="glass-card p-8 border border-accent/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-orbitron font-bold fluid-text-2xl text-gradient">
                Live Preview & Code Editor
              </h2>
              {uploadedFile && (
                <motion.button
                  className="flex items-center gap-2 text-primary btn-cyber px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowImagePreview(!showImagePreview)}
                >
                  <Eye className="w-5 h-5" />
                  {showImagePreview ? 'Hide Image' : 'Show Image'}
                </motion.button>
              )}
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 border border-border rounded-lg overflow-hidden">
                {showImagePreview && uploadedFile ? (
                  <img
                    src={URL.createObjectURL(uploadedFile)}
                    alt="Uploaded Design"
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                ) : (
                  <LivePreview code={generatedCode} />
                )}
              </div>
              <div className="flex-1 glass-card p-4 border border-primary/30">
                <h3 className="font-semibold text-primary mb-3">Edit Generated Code</h3>
                <textarea
                  className="w-full h-96 p-4 border border-border rounded-lg bg-muted/20 text-foreground placeholder-muted-foreground resize-y font-mono text-sm"
                  value={generatedCode}
                  onChange={(e) => setGeneratedCode(e.target.value)}
                />
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