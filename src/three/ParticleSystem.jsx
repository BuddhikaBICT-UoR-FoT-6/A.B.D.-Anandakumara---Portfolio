import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleSystem({ mousePos, surgeTime }) {
  const count = 40;
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for(let i=0; i<count; i++) {
      pos[i*3] = (Math.random() - 0.5) * 15;
      pos[i*3+1] = (Math.random() - 0.5) * 15;
      pos[i*3+2] = 0.3;
      
      vel[i*3] = 0;
      vel[i*3+1] = 0;
      vel[i*3+2] = 0;
    }
    return [pos, vel];
  }, [count]);

  const pointsRef = useRef();
  const lastSurgeTime = useRef(0);

  // Handle scatter on click
  useEffect(() => {
    if (surgeTime > lastSurgeTime.current) {
      lastSurgeTime.current = surgeTime;
      for(let i=0; i<count; i++) {
        const dx = positions[i*3] - mousePos[0];
        const dy = positions[i*3+1] - mousePos[1];
        const dist = Math.sqrt(dx*dx + dy*dy) || 0.1;
        
        // Explosion force away from click
        const force = 0.8 / dist;
        velocities[i*3] += (dx/dist) * force;
        velocities[i*3+1] += (dy/dist) * force;
      }
    }
  }, [surgeTime, mousePos, positions, velocities]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    
    for(let i=0; i<count; i++) {
      let px = posAttr.getX(i);
      let py = posAttr.getY(i);
      
      let vx = velocities[i*3];
      let vy = velocities[i*3+1];
      
      // GATHER: Stronger pull to mouse if within range
      const dx = mousePos[0] - px;
      const dy = mousePos[1] - py;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < 5) {
        vx += dx * 0.008;
        vy += dy * 0.008;
      } else {
        // Slow drift back to center area
        vx -= px * 0.0005;
        vy -= py * 0.0005;
      }
      
      // Noise/Drift
      vx += (Math.random() - 0.5) * 0.03;
      vy += (Math.random() - 0.5) * 0.03;

      // Friction
      vx *= 0.94;
      vy *= 0.94;
      
      velocities[i*3] = vx;
      velocities[i*3+1] = vy;
      
      posAttr.setXY(i, px + vx, py + vy);
    }
    
    posAttr.needsUpdate = true;
  });

  return (
    <group>
      <pointLight 
        position={[mousePos[0], mousePos[1], 0.4]} 
        color={0x00ffff} 
        intensity={surgeTime > Date.now() - 100 ? 50 : 5} 
        distance={2.5} 
      />
      
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
          size={0.18} 
          color={0x00ccff} 
          transparent 
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
