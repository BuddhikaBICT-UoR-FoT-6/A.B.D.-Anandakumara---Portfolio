import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PULSE_COUNT = 8;

const PulseEngine = () => {
  const pulsesRef = useRef([]);

  const paths = useMemo(() => {
    return Array.from({ length: PULSE_COUNT }).map(() => {
      const points = [];
      // Generate paths in XY plane at Z=0.08
      let currentPos = new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, 0.08);
      points.push(currentPos.clone());
      
      for (let i = 0; i < 4; i++) {
        const nextPos = currentPos.clone();
        if (i % 2 === 0) nextPos.x += (Math.random() - 0.5) * 20;
        else nextPos.y += (Math.random() - 0.5) * 20;
        points.push(nextPos);
        currentPos = nextPos;
      }
      
      return {
        curve: new THREE.CatmullRomCurve3(points),
        speed: 0.003 + Math.random() * 0.004,
        offset: Math.random(),
        color: '#88ff44'
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
      path.curve.getPointAt(progress, tempPos);
      pulse.position.copy(tempPos);
      
      pulse.intensity = 2.0 + Math.sin(t * 10 + i) * 1.5;
    });
  });

  return (
    <group>
      {paths.map((path, i) => (
        <pointLight
          key={i}
          ref={(el) => (pulsesRef.current[i] = el)}
          color={path.color}
          distance={5}
          decay={2}
        />
      ))}
    </group>
  );
};

export default PulseEngine;
