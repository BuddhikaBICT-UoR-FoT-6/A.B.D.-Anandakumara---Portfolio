import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import LightSystem from './LightSystem';
import ParticleEngine from './ParticleEngine';
import PulseEngine from './PulseEngine';
import Shockwave from './Shockwave';

const Board = () => {
  const meshRef = useRef();

  // Optimized procedural trace texture (512x512 instead of 1024)
  const traceTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Solid background
    ctx.fillStyle = '#1a4a1a'; 
    ctx.fillRect(0, 0, size, size);
    
    // Basic traces
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 200, y);
      ctx.lineTo(x + (Math.random() - 0.5) * 200, y + (Math.random() - 0.5) * 200);
      ctx.stroke();
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[150, 150]} />
      <meshStandardMaterial 
        color="#1a4a1a"
        map={traceTexture}
        roughness={0.5}
        metalness={0.2}
        emissive="#051a05"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

const Components3D = () => {
  const components = useMemo(() => {
    const items = [];
    for (let i = 0; i < 4; i++) {
      items.push({
        type: 'capacitor',
        position: [(Math.random() - 0.5) * 20, -1.8, (Math.random() - 0.5) * 20],
        args: [0.3, 0.3, 1, 16]
      });
    }
    return items;
  }, []);

  return (
    <group>
      {components.map((c, i) => (
        <mesh key={i} position={c.position}>
          <cylinderGeometry args={c.args} />
          <meshStandardMaterial color="#222" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

const PCBScene = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#000800]">
      <Canvas shadows={false} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 20, 25]} fov={45} />
        
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#ffffff" />
        
        <Board />
        <Components3D />
        
        <LightSystem />
        <PulseEngine />
        <ParticleEngine />
        <Shockwave />

        {/* Temporarily reducing post-processing for debug */}
        <EffectComposer disableNormalPass>
          <Bloom 
            intensity={1.0} 
            luminanceThreshold={0.1} 
            radius={0.4} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default PCBScene;
