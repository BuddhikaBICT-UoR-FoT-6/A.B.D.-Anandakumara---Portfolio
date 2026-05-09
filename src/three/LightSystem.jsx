import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function LightSystem({ planeWidth, planeHeight, surgeTime }) {
  // Use useMemo to generate random light positions mapped to 0-1 range
  const amberLights = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      rx: Math.random(),
      ry: Math.random(),
      speed: 1 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  const redLights = useMemo(() => {
    return Array.from({ length: 6 }).map(() => ({
      rx: 0.2 + Math.random() * 0.6,
      ry: 0.2 + Math.random() * 0.6,
      speed: 3 + Math.random() * 4,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  const heatLights = useMemo(() => {
    return [
      { rx: 0.65, ry: 0.45, vx: 0, vy: 0 },
      { rx: 0.75, ry: 0.55, vx: 0, vy: 0 },
      { rx: 0.55, ry: 0.65, vx: 0, vy: 0 },
    ];
  }, []);

  const amberRefs = useRef([]);
  const redRefs = useRef([]);
  const ringRef = useRef();
  const heatRefs = useRef([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const timeSinceSurge = performance.now() - surgeTime;
    const isSurging = timeSinceSurge < 80 && surgeTime > 0;

    // Amber LEDs: oscillate 0.8 -> 4.0
    amberRefs.current.forEach((light, i) => {
      if (light) {
        const conf = amberLights[i];
        const baseIntensity = 0.8 + ((Math.sin(t * conf.speed + conf.phase) + 1) / 2) * 3.2;
        light.intensity = isSurging ? 10.0 : baseIntensity;
      }
    });

    // Red LEDs: oscillate 1.5 -> 6.0
    redRefs.current.forEach((light, i) => {
      if (light) {
        const conf = redLights[i];
        const baseIntensity = 1.5 + ((Math.sin(t * conf.speed + conf.phase) + 1) / 2) * 4.5;
        light.intensity = isSurging ? 12.0 : baseIntensity;
      }
    });

    // Ring LED
    if (ringRef.current) {
      ringRef.current.intensity = isSurging ? 20.0 : 3.0 + ((Math.sin(t * 0.3) + 1) / 2) * 9.0;
    }

    // Heat zones: random walk drift
    heatRefs.current.forEach((light, i) => {
      if (light) {
        const conf = heatLights[i];
        // Slow random acceleration
        conf.vx += (Math.random() - 0.5) * 0.001;
        conf.vy += (Math.random() - 0.5) * 0.001;
        // Dampen
        conf.vx *= 0.95;
        conf.vy *= 0.95;
        
        light.position.x += conf.vx;
        light.position.y += conf.vy;
        
        // Pulse intensity 0.2 -> 1.8
        light.intensity = isSurging ? 4.0 : 0.2 + ((Math.sin(t * 0.5 + i) + 1) / 2) * 1.6;
      }
    });
  });

  const getPos = (rx, ry) => [
    (rx - 0.5) * planeWidth,
    (0.5 - ry) * planeHeight,
    0.2 // slightly above board
  ];

  return (
    <group>
      {/* Amber LEDs */}
      {amberLights.map((conf, i) => (
        <pointLight
          key={`amber-${i}`}
          ref={(el) => (amberRefs.current[i] = el)}
          position={getPos(conf.rx, conf.ry)}
          color={0xff8800}
          distance={1.2}
          intensity={0.8}
        />
      ))}

      {/* Red Trace LEDs */}
      {redLights.map((conf, i) => (
        <pointLight
          key={`red-${i}`}
          ref={(el) => (redRefs.current[i] = el)}
          position={getPos(conf.rx, conf.ry)}
          color={0xff1100}
          distance={2.0}
          intensity={1.5}
        />
      ))}

      {/* Large Red Ring */}
      <pointLight
        ref={ringRef}
        position={getPos(0.1, 0.15)} // Approx top left
        color={0xff0000}
        distance={3.0}
        intensity={3.0}
      />

      {/* Heat Zones */}
      {heatLights.map((conf, i) => (
        <pointLight
          key={`heat-${i}`}
          ref={(el) => (heatRefs.current[i] = el)}
          position={getPos(conf.rx, conf.ry)}
          color={0xff3300}
          distance={4.0}
          intensity={0.2}
        />
      ))}
    </group>
  );
}
