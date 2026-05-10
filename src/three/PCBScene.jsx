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
  const { size } = useThree();

  // Create a procedural normal map for the fiberglass texture
  const normalMap = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(size, size);
    
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = Math.random() * 20;
      imgData.data[i] = 128 + v;     // R
      imgData.data[i + 1] = 128 + v; // G
      imgData.data[i + 2] = 255;     // B
      imgData.data[i + 3] = 255;     // A
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(10, 10);
    return tex;
  }, []);

  // Simple procedural trace texture (dark gold lines)
  const traceTexture = useMemo(() => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#1a4a1a'; // Deep PCB green
    ctx.fillRect(0, 0, size, size);
    
    ctx.strokeStyle = '#b8860b'; // Gold copper
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    
    // Draw Manhattan traces
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.beginPath();
      ctx.moveTo(x, y);
      if (Math.random() > 0.5) {
        ctx.lineTo(x + (Math.random() - 0.5) * 400, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 400, y + (Math.random() - 0.5) * 400);
      } else {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 400);
        ctx.lineTo(x + (Math.random() - 0.5) * 400, y + (Math.random() - 0.5) * 400);
      }
      ctx.stroke();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        color="#1a4a1a"
        map={traceTexture}
        normalMap={normalMap}
        roughness={0.6}
        metalness={0.2}
      />
    </mesh>
  );
};

const Components3D = () => {
  // Place 6 capacitors and 4 resistors
  const components = useMemo(() => {
    const items = [];
    // Capacitors (Cylinders)
    for (let i = 0; i < 6; i++) {
      items.push({
        type: 'capacitor',
        position: [(Math.random() - 0.5) * 30, -1.8, (Math.random() - 0.5) * 30],
        args: [0.4, 0.4, 1.2, 32]
      });
    }
    // Resistors (Boxes)
    for (let i = 0; i < 4; i++) {
      items.push({
        type: 'resistor',
        position: [(Math.random() - 0.5) * 30, -1.9, (Math.random() - 0.5) * 30],
        args: [0.8, 0.2, 0.2]
      });
    }
    return items;
  }, []);

  return (
    <group>
      {components.map((c, i) => (
        <mesh key={i} position={c.position} rotation={c.type === 'capacitor' ? [0, 0, 0] : [0, Math.random() * Math.PI, 0]}>
          {c.type === 'capacitor' ? (
            <>
              <cylinderGeometry args={c.args} />
              <meshStandardMaterial color="#333" roughness={0.3} metalness={0.8} />
            </>
          ) : (
            <>
              <boxGeometry args={c.args} />
              <meshStandardMaterial color="#664422" roughness={0.7} />
            </>
          )}
        </mesh>
      ))}
    </group>
  );
};

const PCBScene = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#000800]">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 15, 20]} fov={50} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        
        <Board />
        <Components3D />
        
        <LightSystem />
        <PulseEngine />
        <ParticleEngine />
        <Shockwave />

        <EffectComposer disableNormalPass>
          <Bloom 
            intensity={1.8} 
            luminanceThreshold={0.05} 
            luminanceSmoothing={0.5} 
            radius={0.5} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default PCBScene;
