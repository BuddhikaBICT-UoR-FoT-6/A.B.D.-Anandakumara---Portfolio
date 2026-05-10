import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const LED_COUNT_GREEN = 20;
const LED_COUNT_YELLOW = 12;
const LED_COUNT_RED = 8;
const HEAT_ZONE_COUNT = 5;

const LightSystem = () => {
  const lightsRef = useRef([]);
  const heatZonesRef = useRef([]);

  // Initialize LEDs
  const leds = useMemo(() => {
    const data = [];
    const spread = 40;

    // Green LEDs (Status/Power)
    for (let i = 0; i < LED_COUNT_GREEN; i++) {
      data.push({
        id: `green-${i}`,
        type: 'green',
        color: '#00ff44',
        position: [(Math.random() - 0.5) * spread, -1.7, (Math.random() - 0.5) * spread],
        speed: 0.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        isHeartbeat: i % 5 === 0
      });
    }

    // Yellow LEDs (Data activity)
    for (let i = 0; i < LED_COUNT_YELLOW; i++) {
      data.push({
        id: `yellow-${i}`,
        type: 'yellow',
        color: '#ffcc00',
        position: [(Math.random() - 0.5) * spread, -1.7, (Math.random() - 0.5) * spread],
        speed: 3 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Red LEDs (Power rail / Spike)
    for (let i = 0; i < LED_COUNT_RED; i++) {
      data.push({
        id: `red-${i}`,
        type: 'red',
        color: '#ff2200',
        position: [(Math.random() - 0.5) * spread, -1.7, (Math.random() - 0.5) * spread],
        speed: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2
      });
    }

    return data;
  }, []);

  // Initialize Heat Zones
  const heatZones = useMemo(() => {
    return Array.from({ length: HEAT_ZONE_COUNT }).map((_, i) => ({
      id: `heat-${i}`,
      position: [(Math.random() - 0.5) * 20, -1.5, (Math.random() - 0.5) * 20],
      phase: Math.random() * Math.PI * 2,
      lastSpike: 0
    }));
  }, []);

  useFrame(() => {
    const t = performance.now() * 0.001;

    // Animate LEDs
    lightsRef.current.forEach((light, i) => {
      if (!light) return;
      const data = leds[i];

      if (data.type === 'green') {
        // Oscillation 0.5 -> 4.0
        const val = 0.5 + (Math.sin(t * data.speed + data.phase) + 1) * 1.75;
        light.intensity = data.isHeartbeat ? (Math.sin(t * 4) > 0.8 ? 5 : 0.5) : val;
      } else if (data.type === 'yellow') {
        // Faster flicker 1.0 -> 5.0
        light.intensity = 1.0 + Math.random() * 4.0;
      } else if (data.type === 'red') {
        // Power rail spike
        let intensity = 0.3 + (Math.sin(t * data.speed + data.phase) + 1) * 2.85;
        if (Math.random() > 0.997) intensity = 12;
        light.intensity = intensity;
      }
    });

    // Animate Heat Zones
    heatZonesRef.current.forEach((zone, i) => {
      if (!zone) return;
      const data = heatZones[i];

      // Slow thermal mass oscillation 0.1 -> 1.2
      let intensity = 0.1 + (Math.sin(t * 0.25 + data.phase) + 1) * 0.55;

      // Random load spike every 5-9s
      const timeSinceSpike = t - data.lastSpike;
      if (timeSinceSpike > (5 + Math.random() * 4)) {
        intensity = 3.0;
        data.lastSpike = t;
      } else if (timeSinceSpike < 0.8) {
        // Sustain spike for 800ms
        intensity = 3.0;
      }

      zone.intensity = intensity;

      // Thermal shimmer drift
      zone.position.x += (Math.random() - 0.5) * 0.04;
      zone.position.z += (Math.random() - 0.5) * 0.04;
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
          distance={8}
          decay={2}
        />
      ))}
      {heatZones.map((zone, i) => (
        <group key={zone.id}>
          <pointLight
            ref={(el) => (heatZonesRef.current[i] = el)}
            position={zone.position}
            color="#ff6600"
            distance={12}
            decay={2}
          />
          {/* Label Simulation */}
          <mesh position={[zone.position[0], -1.4, zone.position[2]]}>
            <planeGeometry args={[1, 0.4]} />
            <meshBasicMaterial transparent opacity={0.4} color="#ff6600" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default LightSystem;
