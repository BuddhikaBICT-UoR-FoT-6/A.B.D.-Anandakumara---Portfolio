import React, { useRef, useMemo, useEffect } from 'react';
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

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} receiveShadow>
      {/* Plane is in XY space facing +Z */}
      <planeGeometry args={[150, 150]} />
      <meshStandardMaterial 
        color="#0055a5" // Exact Arduino Uno vivid blue
        roughness={0.75}
        metalness={0.1}
      />
    </mesh>
  );
};

const Traces = () => {
  const traceCount = 120;
  const meshRef = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    
    // Generate 120 Manhattan traces on the XY plane
    for (let i = 0; i < traceCount; i++) {
      const isHorizontal = Math.random() > 0.5;
      const length = 5 + Math.random() * 20;
      
      dummy.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        0.01 // Just above the board
      );
      
      // Width, Height, Depth for a trace
      if (isHorizontal) {
        dummy.scale.set(length, 0.4, 1);
      } else {
        dummy.scale.set(0.4, length, 1);
      }
      
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, traceCount]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial 
        color="#c8a850" // Copper gold
        metalness={0.9} 
        roughness={0.2} 
      />
    </instancedMesh>
  );
};

const Components3D = () => {
  // SMD Resistors/Caps
  const components = useMemo(() => {
    const items = [];
    for (let i = 0; i < 15; i++) {
      items.push({
        position: [(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 60, 0.125],
        args: [0.4, 0.4, 0.5, 8] // Low poly cylinder
      });
    }
    return items;
  }, []);

  return (
    <group>
      {components.map((c, i) => (
        <mesh key={`cap-${i}`} position={c.position} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={c.args} />
          <meshStandardMaterial color="#ccddee" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      
      {/* IC Chips */}
      {[[-10, 10], [20, -10], [-25, -15]].map(([x, y], i) => (
        <mesh key={`ic-${i}`} position={[x, y, 0.05]}>
          <boxGeometry args={[6, 4, 0.4]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </mesh>
      ))}

      {/* Main ATmega328P DIP */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[8, 24, 0.6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
      </mesh>
    </group>
  );
};

const PCBScene = () => {
  // Pass mouse events directly since Canvas pointer-events are disabled
  useEffect(() => {
    // We will let R3F handle events globally via standard pointer events on document
    // OR we could just pass pointer events to the canvas.
    // Actually, R3F's raycaster can attach to a target element.
    // For now, the user requested: window.addEventListener('mousemove', onMouseMove)
    // R3F handles this via `events={{ compute: ... }}` or globally.
    // However, the simplest fix without breaking R3F hooks is to NOT put pointer-events: none on the canvas itself if we want useThree().mouse to work,
    // OR manually update mouse state in ParticleEngine. 
    // We will do that in ParticleEngine/Shockwave.
  }, []);

  return (
    <Canvas 
      shadows={false} 
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={Math.min(window.devicePixelRatio, 1.5)}
    >
      <OrthographicCamera makeDefault position={[0, 0, 20]} zoom={25} />
      
      {/* Low, warm blue-white ambient */}
      <ambientLight intensity={0.4} color="#112244" />
      
      {/* Directional light to show component depth */}
      <directionalLight position={[-10, 10, 15]} intensity={0.6} color="#aaccff" />
      
      <Board />
      <Traces />
      <Components3D />
      
      <LightSystem />
      <PulseEngine />
      <ParticleEngine />
      <Shockwave />

      <EffectComposer disableNormalPass>
        <Bloom 
          intensity={1.0} 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          resolutionX={256} // Hard limited resolution for performance
          resolutionY={256}
        />
      </EffectComposer>
    </Canvas>
  );
};

export default PCBScene;
