import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PULSE_COUNT = 12;

// Snap to grid function to simulate precise trace routing
const snapToTrace = (val, gridSize) => Math.round(val / gridSize) * gridSize;

const PulseEngine = () => {
  const pulsesRef = useRef([]);

  const paths = useMemo(() => {
    return Array.from({ length: PULSE_COUNT }).map(() => {
      const points = [];
      const gridSize = 4.0; // Trace spacing grid
      
      // Start on a trace intersection
      let currentPos = new THREE.Vector3(
        snapToTrace((Math.random() - 0.5) * 60, gridSize), 
        snapToTrace((Math.random() - 0.5) * 60, gridSize), 
        0.08
      );
      points.push(currentPos.clone());
      
      // Manhattan routing along the grid
      for (let i = 0; i < 5; i++) {
        const nextPos = currentPos.clone();
        const dist = snapToTrace((Math.random() - 0.5) * 30, gridSize);
        
        if (i % 2 === 0) {
          nextPos.x += dist;
        } else {
          nextPos.y += dist;
        }
        
        // Prevent 0-length segments
        if (nextPos.distanceTo(currentPos) > 0) {
          points.push(nextPos);
          currentPos = nextPos;
        }
      }
      
      return {
        // CurveType: centripetal makes nice rounded 90-degree corners
        curve: new THREE.CatmullRomCurve3(points, false, 'centripetal'),
        speed: 0.002 + Math.random() * 0.004,
        offset: Math.random(),
        color: '#00ccff' // Electric blue pulse
      };
    });
  }, []);

  const tempPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const t = performance.now() * 0.001;
    
    pulsesRef.current.forEach((pulse, i) => {
      if (!pulse) return;
      const path = paths[i];
      const progress = (path.offset + t * path.speed) % 1;
      
      try {
        path.curve.getPointAt(progress, tempPos);
        pulse.position.copy(tempPos);
        
        // Gaussian falloff pulse intensity
        const distFromCenter = Math.abs(progress - 0.5) * 2; // 0 to 1
        const gaussian = Math.exp(-distFromCenter * distFromCenter * 10);
        pulse.intensity = 1.0 + gaussian * 6.0;
      } catch (e) {
        // Ignore curve calculation errors
      }
    });
  });

  return (
    <group>
      {paths.map((path, i) => (
        <pointLight
          key={i}
          ref={(el) => (pulsesRef.current[i] = el)}
          color={path.color}
          distance={8}
          decay={2}
        />
      ))}
    </group>
  );
};

export default PulseEngine;
