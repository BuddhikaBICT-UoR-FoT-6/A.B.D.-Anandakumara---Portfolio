import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TraceAnimator({ planeWidth, planeHeight }) {
  // Define trace curves using relative coords 0-1
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
        0.05 // just above the board
      ));
      // Using CatmullRomCurve3 for smooth movement
      return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.1);
    });
  }, [planeWidth, planeHeight]);

  // Pool of 6 pulse lights
  const pulses = useMemo(() => {
    return Array.from({ length: 6 }).map(() => ({
      curveIndex: Math.floor(Math.random() * curves.length),
      t: Math.random(),
      speed: 0.002 + Math.random() * 0.003
    }));
  }, [curves.length]);

  const lightRefs = useRef([]);

  useFrame(() => {
    pulses.forEach((pulse, i) => {
      pulse.t += pulse.speed;
      if (pulse.t >= 1) {
        pulse.t = 0;
        pulse.curveIndex = Math.floor(Math.random() * curves.length);
        pulse.speed = 0.002 + Math.random() * 0.003;
      }

      const light = lightRefs.current[i];
      if (light) {
        const point = curves[pulse.curveIndex].getPoint(pulse.t);
        light.position.copy(point);
      }
    });
  });

  return (
    <group>
      {pulses.map((_, i) => (
        <pointLight
          key={`pulse-${i}`}
          ref={el => lightRefs.current[i] = el}
          color={0xff4400}
          intensity={8}
          distance={0.6}
        />
      ))}
    </group>
  );
}
