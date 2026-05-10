import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import LightSystem from './LightSystem';
import ParticleEngine from './ParticleEngine';
import PulseEngine from './PulseEngine';
import Shockwave from './Shockwave';

const Board = () => {
  const meshRef = useRef();

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[150, 150]} />
      {/* Simple material without heavy canvas generation */}
      <meshStandardMaterial 
        color="#051a05"
        roughness={0.6}
        metalness={0.1}
      />
      {/* Adding a grid helper to see the ground clearly */}
      <gridHelper args={[150, 150, '#1a4a1a', '#0a2a0a']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} />
    </mesh>
  );
};

const PCBScene = () => {
  return (
    <div className="fixed inset-0 z-0 bg-[#000800]">
      <Canvas shadows={false} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 20, 25]} fov={45} />
        
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 20, 10]} intensity={5} color="#ffffff" />
        <pointLight position={[-10, 20, -10]} intensity={3} color="#00ff44" />
        
        <Board />
        
        <LightSystem />
        <PulseEngine />
        <ParticleEngine />
        <Shockwave />

        {/* Removed EffectComposer to isolate rendering issues */}
      </Canvas>
    </div>
  );
};

export default PCBScene;
