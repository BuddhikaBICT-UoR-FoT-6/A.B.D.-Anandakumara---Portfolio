import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function LightSystem({ planeWidth, planeHeight, surgeTime }) {
  // Use useMemo to generate stable light configurations
  const amberLights = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      rx: Math.random(),
      ry: Math.random(),
      speed: 0.8 + i * 0.3,
      phase: i * 1.27,
    }));
  }, []);

  const redLights = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      rx: 0.1 + Math.random() * 0.8,
      ry: 0.1 + Math.random() * 0.8,
      freq: 1.5 + i * 0.4,
      phase: i * 1.0,
    }));
  }, []);

  const heatLights = useMemo(() => {
    return [
      { rx: 0.65, ry: 0.45, x: 0, y: 0 },
      { rx: 0.75, ry: 0.55, x: 0, y: 0 },
      { rx: 0.55, ry: 0.65, x: 0, y: 0 },
    ];
  }, []);

  const amberRefs = useRef([]);
  const redRefs = useRef([]);
  const ringRef = useRef();
  const heatRefs = useRef([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const timeSinceSurge = performance.now() - surgeTime;
    const isSurging = timeSinceSurge < 120 && surgeTime > 0;

    // --- AMBER LEDs: independent flicker per light ---
    amberRefs.current.forEach((light, i) => {
      if (light) {
        const conf = amberLights[i];
        const base = 1.5 + Math.sin(t * conf.speed + conf.phase) * 1.2;
        const spike = Math.random() > 0.995 ? 8.0 : 0;
        light.intensity = isSurging ? 20.0 : base + spike;
      }
    });

    // --- RED TRACE LEDs: faster pulse ---
    redRefs.current.forEach((light, i) => {
      if (light) {
        const conf = redLights[i];
        const intensity = 2.0 + Math.sin(t * conf.freq + conf.phase) * 2.5;
        light.intensity = isSurging ? 25.0 : Math.max(0.5, intensity);
      }
    });

    // --- HEAT ZONE LIGHTS: slow random drift ---
    heatRefs.current.forEach((light, i) => {
      if (light) {
        const conf = heatLights[i];
        conf.x += (Math.random() - 0.5) * 0.008;
        conf.y += (Math.random() - 0.5) * 0.008;
        
        // Clamp drift
        conf.x = Math.max(-0.5, Math.min(0.5, conf.x));
        conf.y = Math.max(-0.5, Math.min(0.5, conf.y));

        const basePos = [
          (conf.rx - 0.5) * planeWidth,
          (0.5 - conf.ry) * planeHeight,
          0.2
        ];
        light.position.set(basePos[0] + conf.x, basePos[1] + conf.y, basePos[2]);
        
        const pulse = 0.8 + Math.sin(t * 0.4 + i * 2.1) * 0.6;
        light.intensity = isSurging ? 10.0 : pulse;
      }
    });

    // --- LARGE RED RING: slow breathe ---
    if (ringRef.current) {
      ringRef.current.intensity = isSurging ? 40.0 : 4.0 + Math.sin(t * 0.6) * 3.5;
    }
  });

  const getPos = (rx, ry) => [
    (rx - 0.5) * planeWidth,
    (0.5 - ry) * planeHeight,
    0.2
  ];

  return (
    <group>
      {amberLights.map((conf, i) => (
        <pointLight
          key={`amber-${i}`}
          ref={(el) => (amberRefs.current[i] = el)}
          position={getPos(conf.rx, conf.ry)}
          color={0xffaa00}
          distance={5}
          intensity={2}
        />
      ))}

      {redLights.map((conf, i) => (
        <pointLight
          key={`red-${i}`}
          ref={(el) => (redRefs.current[i] = el)}
          position={getPos(conf.rx, conf.ry)}
          color={0xff2200}
          distance={7}
          intensity={3}
        />
      ))}

      <pointLight
        ref={ringRef}
        position={getPos(0.1, 0.15)}
        color={0xff0000}
        distance={12}
        intensity={5}
      />

      {heatLights.map((conf, i) => (
        <pointLight
          key={`heat-${i}`}
          ref={(el) => (heatRefs.current[i] = el)}
          position={getPos(conf.rx, conf.ry)}
          color={0xff4400}
          distance={15}
          intensity={1}
        />
      ))}
    </group>
  );
}
