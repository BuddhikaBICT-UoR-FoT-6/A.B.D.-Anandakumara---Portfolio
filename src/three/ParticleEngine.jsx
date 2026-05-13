import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimStore } from '../store/useSimStore';
import { audioManager } from '../utils/AudioManager';

const PARTICLE_COUNT = 80;
const SWARM_RADIUS = 30.0;
const ORBIT_RADIUS = 8.0;

const ParticleEngine = () => {
  const pointsRef = useRef();

  const cursor = useSimStore(state => state.cursor);
  const phase = useSimStore(state => state.phase);
  const isHovering = useRef(false);

  useEffect(() => {
    isHovering.current = true;
    return () => { isHovering.current = false; };
  }, []);

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 80,
      vx: 0, 
      vy: 0,
      state: 'idle', // 'idle' | 'swarming' | 'dispersing'
      life: 1,
      wanderAngle: Math.random() * Math.PI * 2
    }));
  }, []);

  const [positions, sizes, colors] = useMemo(() => {
    return [
      new Float32Array(PARTICLE_COUNT * 3),
      new Float32Array(PARTICLE_COUNT),
      new Float32Array(PARTICLE_COUNT * 3)
    ];
  }, []);

  useEffect(() => {
    if (phase === 'CLICK') {
      particles.forEach(p => {
        if (p.state === 'swarming') {
          const dx = p.x - cursor.world.x;
          const dy = p.y - cursor.world.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const speed = 0.8 + Math.random() * 2.0;
          p.vx = (dx / dist) * speed;
          p.vy = (dy / dist) * speed;
          p.state = 'dispersing';
          p.life = 1;
        }
      });
    }
  }, [phase, cursor.world, particles]);

  useFrame(() => {
    const t = performance.now() * 0.001;
    const mx = cursor.world.x;
    const my = cursor.world.y;
    const hovering = isHovering.current;

    particles.forEach((p, i) => {
      const dx = mx - p.x;
      const dy = my - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (hovering && dist < SWARM_RADIUS) {
        if (p.state === 'idle') audioManager.playHover();
        p.state = 'swarming';
        
        // Spring toward orbit radius (not cursor itself)
        const targetDist = ORBIT_RADIUS + Math.sin(t * 2 + i) * 2;
        const pull = (dist - targetDist) / dist;
        p.vx += dx * pull * 0.02;
        p.vy += dy * pull * 0.02;
        
        // Tangential orbit force (creates circular swarm)
        p.vx += -dy / dist * 0.03;
        p.vy += dx / dist * 0.03;
        
        // Cohesion: repel from other nearby particles
        particles.forEach((other, j) => {
          if (i === j) return;
          const ox = p.x - other.x;
          const oy = p.y - other.y;
          const od = Math.sqrt(ox * ox + oy * oy);
          if (od < 3.0 && od > 0) {
            p.vx += (ox / od) * 0.015;
            p.vy += (oy / od) * 0.015;
          }
        });
      } else if (p.state === 'dispersing') {
        // Fade and slow
        p.life -= 0.02;
        if (p.life <= 0) {
          // Respawn at random board position
          p.x = (Math.random() - 0.5) * 100;
          p.y = (Math.random() - 0.5) * 100;
          p.vx = 0; 
          p.vy = 0; 
          p.life = 1; 
          p.state = 'idle';
        }
      } else {
        // Idle: gentle wander
        p.wanderAngle += (Math.random() - 0.5) * 0.2;
        p.vx += Math.cos(p.wanderAngle) * 0.005;
        p.vy += Math.sin(p.wanderAngle) * 0.005;
        p.state = 'idle';
      }

      // Damping
      p.vx *= 0.92; 
      p.vy *= 0.92;
      p.x += p.vx;  
      p.y += p.vy;

      // Boundary wrap
      if (p.x > 75) p.x = -75;
      if (p.x < -75) p.x = 75;
      if (p.y > 75) p.y = -75;
      if (p.y < -75) p.y = 75;

      // Write to BufferGeometry
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = 2.0;
      
      sizes[i] = p.state === 'swarming' ? 6 + (Math.sin(t * 3 + i) * 2) : 2.5;
      
      // Color: brighter blue-white when swarming
      const bright = p.state === 'swarming' ? 1.0 : (p.state === 'dispersing' ? p.life : 0.35);
      colors[i * 3] = 0.27 * bright;     // R
      colors[i * 3 + 1] = 0.67 * bright; // G
      colors[i * 3 + 2] = 1.0 * bright;  // B (blue-white)
    });

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={PARTICLE_COUNT} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-color" count={PARTICLE_COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={1} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

export default ParticleEngine;
