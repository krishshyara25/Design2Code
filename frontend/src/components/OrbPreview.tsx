import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
import { gsap } from 'gsap';

const AnimatedOrb = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={1.2}>
      <MeshDistortMaterial
        color="#00FFFF"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        emissive="#001122"
        emissiveIntensity={0.5}
      />
    </Sphere>
  );
};

const OrbPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // GSAP ScrollTrigger animation
    const ctx = gsap.context(() => {
      gsap.fromTo(container, 
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-64 relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} color="#00FFFF" intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#FF00FF" intensity={0.5} />
        <AnimatedOrb />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default OrbPreview;