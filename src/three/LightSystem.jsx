import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const LightSystem = () => {
  const lightsRef = useRef([]);
  const { mouse } = useThree();
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Specific Arduino LEDs
  const leds = useMemo(() => {
    return [
      { id: 'pwr', type: 'PWR', color: '#00ff44', position: [-8, -6, 0.05], size: 4 }, // Power LED (Always On)
      { id: 'l_led', type: 'L', color: '#ffcc00', position: [-6, -6, 0.05], size: 3 }, // L LED (Pin 13 - 1Hz blink)
      { id: 'tx', type: 'TX', color: '#ffcc00', position: [-4, -6, 0.05], size: 3 },   // TX (Blinks on activity)
      { id: 'rx', type: 'RX', color: '#ffcc00', position: [-2, -6, 0.05], size: 3 },   // RX (Blinks on activity)
      // Extra ambient trace glows
      { id: 'glow1', type: 'ambient', color: '#00ff44', position: [5, 5, 0.05], size: 8 },
      { id: 'glow2', type: 'ambient', color: '#ff2200', position: [-10, 8, 0.05], size: 6 }
    ];
  }, []);

  useFrame(() => {
    const t = performance.now() * 0.001;
    
    // Calculate mouse activity for TX/RX
    const mouseDx = Math.abs(mouse.x - lastMousePos.current.x);
    const mouseDy = Math.abs(mouse.y - lastMousePos.current.y);
    const isMouseMoving = mouseDx > 0.001 || mouseDy > 0.001;
    lastMousePos.current.x = mouse.x;
    lastMousePos.current.y = mouse.y;

    lightsRef.current.forEach((light, i) => {
      if (!light) return;
      const data = leds[i];

      if (data.type === 'PWR') {
        light.intensity = 2.0; // Constant power
      } else if (data.type === 'L') {
        light.intensity = (t % 1.0 > 0.5) ? 3.0 : 0.2; // 1Hz blink
      } else if (data.type === 'TX') {
        // Blink rapidly when mouse is moving
        light.intensity = isMouseMoving && Math.random() > 0.5 ? 4.0 : 0.0;
      } else if (data.type === 'RX') {
        // Blink rapidly slightly offset from TX
        light.intensity = isMouseMoving && Math.random() > 0.6 ? 4.0 : 0.0;
      } else if (data.type === 'ambient') {
        // Slow breathing glow
        light.intensity = 1.0 + Math.sin(t * 2 + i) * 1.5;
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
          distance={led.size}
          decay={2}
        />
      ))}
    </group>
  );
};

export default LightSystem;
