import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_LIGHTS = 15;

const LightSystem = () => {
  const lightsRef = useRef([]);

  const leds = useMemo(() => {
    const data = [];
    const spread = 20;

    for (let i = 0; i < MAX_LIGHTS; i++) {
      const type = Math.random();
      let color, isHeartbeat;
      if (type > 0.6) {
        color = '#00ff44'; // Green
        isHeartbeat = i % 3 === 0;
      } else if (type > 0.2) {
        color = '#ffcc00'; // Yellow
        isHeartbeat = false;
      } else {
        color = '#ff2200'; // Red
        isHeartbeat = false;
      }

      data.push({
        id: `led-${i}`,
        color,
        position: [(Math.random() - 0.5) * spread, (Math.random() - 0.5) * spread, 0.05],
        speed: 0.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        isHeartbeat
      });
    }
    return data;
  }, []);

  useFrame(() => {
    const t = performance.now() * 0.001;

    lightsRef.current.forEach((light, i) => {
      if (!light) return;
      const data = leds[i];

      if (data.color === '#00ff44') {
        const val = 0.5 + (Math.sin(t * data.speed + data.phase) + 1) * 1.75;
        light.intensity = data.isHeartbeat ? (Math.sin(t * 4) > 0.8 ? 4 : 0.5) : val;
      } else if (data.color === '#ffcc00') {
        light.intensity = 1.0 + Math.random() * 3.0;
      } else {
        let intensity = 0.3 + (Math.sin(t * data.speed + data.phase) + 1) * 2;
        if (Math.random() > 0.997) intensity = 8;
        light.intensity = intensity;
      }
    });
  });

  return (
    <group>
      {leds.map((led, i) => (
        <pointLight
          key={led.id}
          ref={(el) => (lightsRef.current[i] = el)}
          position={led.position}
          color={led.color}
          distance={10}
          decay={2}
        />
      ))}
    </group>
  );
};

export default LightSystem;
