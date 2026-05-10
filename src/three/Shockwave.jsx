import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../utils/AudioManager';

const Shockwave = () => {
  const { mouse, camera, raycaster } = useThree();
  const impactLightRef = useRef();
  const [pulses, setPulses] = useState([]);
  const [flashFrame, setFlashFrame] = useState(0);

  // Impact light handling
  useFrame(() => {
    if (flashFrame > 0) {
      impactLightRef.current.intensity = 20;
      setFlashFrame(f => f - 1);
    } else {
      impactLightRef.current.intensity = 0;
    }
  });

  // Pulse movement logic
  useFrame((state, delta) => {
    setPulses(prev => prev.map(p => {
      const nextProgress = p.progress + delta * p.speed;
      if (nextProgress > 1) return null;
      const pos = p.curve.getPointAt(nextProgress);
      return { ...p, progress: nextProgress, currentPos: pos };
    }).filter(p => p !== null));
  });

  useEffect(() => {
    const handleClick = () => {
      audio.playPulse();
      // Impact flash position
      raycaster.setFromCamera(mouse, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.5);
      const pos = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, pos);
      
      impactLightRef.current.position.copy(pos);
      setFlashFrame(2);

      // Inject 3 new blue-white pulses
      const newPulses = Array.from({ length: 3 }).map(() => {
        const points = [pos.clone()];
        let currentPos = pos.clone();
        for (let i = 0; i < 3; i++) {
          const nextPos = currentPos.clone();
          nextPos.x += (Math.random() - 0.5) * 15;
          nextPos.z += (Math.random() - 0.5) * 15;
          points.push(nextPos);
          currentPos = nextPos;
        }
        return {
          id: Math.random(),
          curve: new THREE.CatmullRomCurve3(points),
          progress: 0,
          speed: 1.5,
          currentPos: pos.clone()
        };
      });
      
      setPulses(prev => [...prev, ...newPulses]);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [mouse, camera, raycaster]);

  return (
    <group>
      <pointLight ref={impactLightRef} color="#ffffff" intensity={0} distance={50} decay={1} />
      {pulses.map(p => (
        <pointLight
          key={p.id}
          position={p.currentPos}
          color="#aaccff"
          intensity={10}
          distance={8}
          decay={2}
        />
      ))}
    </group>
  );
};

export default Shockwave;
