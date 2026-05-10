import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
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
    <mesh ref={meshRef} position={[0, 0, 0]} receiveShadow>
      {/* Plane is in XY space facing +Z */}
      <planeGeometry args={[150, 150]} />
      <meshStandardMaterial 
        color="#1a4a1a"
        map={traceTexture}
        roughness={0.7}
        metalness={0.4}
        emissive="#051a05"
        emissiveIntensity={1.2}
      />
      {/* Subtle grid in XY space slightly above the board */}
      <gridHelper args={[150, 150, '#1a4a1a', '#0a2a0a']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.01]} />
    </mesh>
  );
};

const Components3D = () => {
  const components = useMemo(() => {
    const items = [];
    for (let i = 0; i < 10; i++) {
      items.push({
        position: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, 0.125],
        args: [0.2, 0.2, 0.25, 16] // RadiusTop, RadiusBottom, Height, RadialSegments
      });
    }
    return items;
  }, []);

  return (
    <group>
      {components.map((c, i) => (
        <mesh key={i} position={c.position} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={c.args} />
          <meshStandardMaterial color="#333" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      
      {/* IC Chips */}
      {[[-5, 5], [10, -5], [-12, -8]].map(([x, y], i) => (
        <mesh key={`ic-${i}`} position={[x, y, 0.05]}>
          <boxGeometry args={[3, 2, 0.1]} />
          <meshStandardMaterial color="#111" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

const PCBScene = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0">
      <Canvas 
        shadows={false} 
        gl={{ antialias: false, alpha: true, powerPreference: "default" }}
        dpr={1.5}
      >
        <OrthographicCamera makeDefault position={[0, 0, 20]} zoom={25} />
        
        <ambientLight intensity={1.5} />
        {/* Lights close to the board */}
        <pointLight position={[10, 10, 5]} intensity={4} color="#ffffff" distance={50} />
        <pointLight position={[-10, -10, 5]} intensity={3} color="#00ff44" distance={50} />
        
        <Board />
        <Components3D />
        
        <LightSystem />
        <PulseEngine />
        <ParticleEngine />
        <Shockwave />

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
