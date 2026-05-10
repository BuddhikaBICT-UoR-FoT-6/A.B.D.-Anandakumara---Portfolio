import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../utils/AudioManager';

const MAX_PULSES = 15;

const Shockwave = () => {
  const { mouse, camera, raycaster } = useThree();
  const impactLightRef = useRef();
  const pulseLightsRef = useRef([]);
  
  // Manage pulse state directly without React state to avoid 60fps re-renders
  const pulsesData = useRef([]);
  const flashFrame = useRef(0);

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.5), []);
  const pos = useMemo(() => new THREE.Vector3(), []);

  // Impact light handling
  useFrame((state, delta) => {
    if (flashFrame.current > 0) {
      if (impactLightRef.current) impactLightRef.current.intensity = 20;
      flashFrame.current -= 1;
    } else {
      if (impactLightRef.current) impactLightRef.current.intensity = 0;
    }

    // Pulse movement logic
    pulsesData.current = pulsesData.current.filter(p => {
      p.progress += delta * p.speed;
      if (p.progress > 1) return false;
      return true;
    });

    // Update point lights
    for (let i = 0; i < MAX_PULSES; i++) {
      const light = pulseLightsRef.current[i];
      const p = pulsesData.current[i];
      if (light) {
        if (p) {
          p.curve.getPointAt(p.progress, pos);
          light.position.copy(pos);
          light.intensity = 10 * (1 - p.progress); // Fade out
          light.visible = true;
        } else {
          light.visible = false;
        }
      }
    }
  });

  useEffect(() => {
    const handleClick = () => {
      audio.playPulse();
      
      // Impact flash position
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, pos);
      
      if (impactLightRef.current) impactLightRef.current.position.copy(pos);
      flashFrame.current = 2;

      // Inject 3 new blue-white pulses
      const newPulses = [];
      for (let j = 0; j < 3; j++) {
        const points = [pos.clone()];
        let currentPos = pos.clone();
        for (let i = 0; i < 3; i++) {
          const nextPos = currentPos.clone();
          nextPos.x += (Math.random() - 0.5) * 15;
          nextPos.z += (Math.random() - 0.5) * 15;
          points.push(nextPos);
          currentPos = nextPos;
        }
        newPulses.push({
          curve: new THREE.CatmullRomCurve3(points),
          progress: 0,
          speed: 1.5 + Math.random() * 0.5
        });
      }
      
      // Keep only up to MAX_PULSES
      pulsesData.current = [...pulsesData.current, ...newPulses].slice(-MAX_PULSES);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [mouse, camera, raycaster, plane, pos]);

  return (
    <group>
      <pointLight ref={impactLightRef} color="#ffffff" intensity={0} distance={50} decay={1} />
      {Array.from({ length: MAX_PULSES }).map((_, i) => (
        <pointLight
          key={i}
          ref={el => pulseLightsRef.current[i] = el}
          color="#aaccff"
          intensity={0}
          distance={8}
          decay={2}
          visible={false}
        />
      ))}
    </group>
  );
};

export default Shockwave;
