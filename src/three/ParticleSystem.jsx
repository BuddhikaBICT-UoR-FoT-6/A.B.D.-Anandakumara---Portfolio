import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleSystem({ mousePos }) {
  const count = 30;
  
  // Initialize particles
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for(let i=0; i<count; i++) {
      pos[i*3] = (Math.random() - 0.5) * 10;
      pos[i*3+1] = (Math.random() - 0.5) * 10;
      pos[i*3+2] = 0.1; // Float just above board
      
      vel[i*3] = 0;
      vel[i*3+1] = 0;
      vel[i*3+2] = 0;
    }
    return [pos, vel];
  }, [count]);

  const pointsRef = useRef();

  useFrame(() => {
    if (!pointsRef.current) return;
    
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position;
    
    for(let i=0; i<count; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      
      let vx = velocities[i*3];
      let vy = velocities[i*3+1];
      
      // Spring toward mouse
      const dx = mousePos[0] - px;
      const dy = mousePos[1] - py;
      
      vx += dx * 0.005;
      vy += dy * 0.005;
      
      // Drift randomly
      vx += (Math.random() - 0.5) * 0.02;
      vy += (Math.random() - 0.5) * 0.02;

      // Friction
      vx *= 0.92;
      vy *= 0.92;
      
      velocities[i*3] = vx;
      velocities[i*3+1] = vy;
      
      posAttr.setXY(i, px + vx, py + vy);
    }
    
    posAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Cyan Tracker Light */}
      <pointLight 
        position={[mousePos[0], mousePos[1], 0.2]} 
        color={0x00ffcc} 
        intensity={3} 
        distance={1.5} 
      />
      
      {/* Swarm Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.15} 
          color={0xff4400} 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
