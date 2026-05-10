import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import LightSystem from './LightSystem';
import ParticleEngine from './ParticleEngine';
import PulseEngine from './PulseEngine';
import Shockwave from './Shockwave';

const Board = () => {
  const meshRef = useRef();

  // Procedural trace texture, kept to 512x512 for performance
  const traceTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Deep FR4 Green
    ctx.fillStyle = '#0a2a0a'; 
    ctx.fillRect(0, 0, size, size);
    
    // Copper traces
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    
    // Draw grid-like Manhattan routing
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() > 0.5 ? 100 : -100), y);
      ctx.lineTo(x + (Math.random() > 0.5 ? 100 : -100), y + (Math.random() > 0.5 ? 100 : -100));
      ctx.stroke();
    }
    
    // Draw some connection pads
    ctx.fillStyle = '#b8860b';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * size, Math.random() * size, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[150, 150]} />
      <meshStandardMaterial 
        color="#1a4a1a"
        map={traceTexture}
        roughness={0.7}
        metalness={0.4}
        emissive="#051a05"
        emissiveIntensity={1.2}
      />
      {/* Subtle grid to reinforce the tech vibe */}
      <gridHelper args={[150, 150, '#1a4a1a', '#0a2a0a']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} />
    </mesh>
  );
};

const PCBScene = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0">
      <Canvas 
        shadows={false} 
        gl={{ antialias: false, alpha: true, powerPreference: "default" }}
        dpr={1.5} /* Capped pixel ratio as requested */
      >
        <PerspectiveCamera makeDefault position={[0, 20, 25]} fov={45} />
        
        <ambientLight intensity={1.5} />
        {/* Fill lights to make the board visible */}
        <pointLight position={[10, 20, 10]} intensity={4} color="#ffffff" distance={100} />
        <pointLight position={[-10, 20, -10]} intensity={3} color="#00ff44" distance={100} />
        
        <Board />
        
        <LightSystem />
        <PulseEngine />
        <ParticleEngine />
        <Shockwave />

        {/* Low-res optimized Bloom for glowing effects */}
        <EffectComposer disableNormalPass>
          <Bloom 
            intensity={1.2} 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            resolutionX={256}
            resolutionY={256}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default PCBScene;
