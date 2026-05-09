import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TraceAnimator({ planeWidth, planeHeight, surgeTime }) {
  const curves = useMemo(() => {
    const rawPaths = [
      [{rx: 0.05, ry: 0.05}, {rx: 0.15, ry: 0.05}, {rx: 0.15, ry: 0.15}],
      [{rx: 0.15, ry: 0.15}, {rx: 0.20, ry: 0.20}, {rx: 0.20, ry: 0.30}],
      [{rx: 0.30, ry: 0.50}, {rx: 0.70, ry: 0.50}],
      [{rx: 0.50, ry: 0.20}, {rx: 0.50, ry: 0.80}],
      [{rx: 0.40, ry: 0.40}, {rx: 0.60, ry: 0.60}],
      [{rx: 0.85, ry: 0.10}, {rx: 0.85, ry: 0.40}],
      [{rx: 0.88, ry: 0.10}, {rx: 0.88, ry: 0.35}],
      [{rx: 0.0, ry: 0.85}, {rx: 1.0, ry: 0.85}]
    ];

    return rawPaths.map(path => {
      const points = path.map(pt => new THREE.Vector3(
        (pt.rx - 0.5) * planeWidth,
        (0.5 - pt.ry) * planeHeight,
        0.15
      ));
      return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.1);
    });
  }, [planeWidth, planeHeight]);

  const pulseStates = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => ({
      curve: curves[Math.floor(Math.random() * curves.length)],
      t: Math.random(),
      speed: 0.003 + Math.random() * 0.004,
      isSurgePulse: false
    }));
  }, [curves]);

  const lightRefs = useRef([]);
  const lastSurgeTime = useRef(0);

  // Trigger surge pulses on click
  useEffect(() => {
    if (surgeTime > lastSurgeTime.current) {
      lastSurgeTime.current = surgeTime;
      pulseStates.forEach(pulse => {
        pulse.t = 0; // Restart all pulses for a "wave" effect
        pulse.speed = 0.015; // Faster for surge
        pulse.isSurgePulse = true;
      });
      setTimeout(() => {
        pulseStates.forEach(pulse => {
          pulse.isSurgePulse = false;
          pulse.speed = 0.003 + Math.random() * 0.004;
        });
      }, 1000);
    }
  }, [surgeTime, pulseStates]);

  useFrame(() => {
    pulseStates.forEach((pulse, i) => {
      pulse.t += pulse.speed;
      if (pulse.t > 1.0) {
        pulse.t = 0;
        pulse.curve = curves[Math.floor(Math.random() * curves.length)];
      }

      const light = lightRefs.current[i];
      if (light) {
        const pos = pulse.curve.getPoint(pulse.t);
        light.position.set(pos.x, pos.y, 0.15);
        
        const brightness = Math.sin(pulse.t * Math.PI);
        const baseIntensity = pulse.isSurgePulse ? 30 : 6;
        light.intensity = baseIntensity + brightness * 10;
        light.distance = pulse.isSurgePulse ? 4.0 : 1.5;
      }
    });
  });

  return (
    <group>
      {pulseStates.map((_, i) => (
        <pointLight
          key={`pulse-${i}`}
          ref={el => lightRefs.current[i] = el}
          color={0xff6600}
          intensity={6}
          distance={1.5}
        />
      ))}
    </group>
  );
}
