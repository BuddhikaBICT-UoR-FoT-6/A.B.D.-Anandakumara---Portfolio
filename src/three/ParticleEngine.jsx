import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../utils/AudioManager';

const PARTICLE_COUNT = 80;

// Logical pin locations for the primary microcontroller (DIP-28 style layout)
// Configurable base offset to align with the background image
const CHIP_OFFSET_X = -4.0;
const CHIP_OFFSET_Y = 2.0;

const CHIP_PINS = Array.from({ length: 28 }).map((_, i) => {
  const isLeft = i < 14;
  const pinIndex = isLeft ? i : 27 - i;
  return new THREE.Vector3(
    CHIP_OFFSET_X + (isLeft ? -2 : 2),
    CHIP_OFFSET_Y + (pinIndex - 6.5) * 0.8,
    3.0
  );
});

const ParticleEngine = () => {
  const pointsRef = useRef();
  const { mouse, raycaster, camera } = useThree();
  const lastGatherState = useRef(false);
  
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Assign each particle to a "home" pin
      const targetPin = CHIP_PINS[i % CHIP_PINS.length];
      data.push({
        position: new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, 3.0),
        velocity: new THREE.Vector3(0, 0, 0),
        targetPin: targetPin,
        state: 'idle',
        size: 1.5,
        brightness: 0.15
      });
    }
    return data;
  }, []);

  const [positions, sizes, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    return [pos, sz, col];
  }, []);

  const cursorWorldPos = useMemo(() => new THREE.Vector3(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const baseColor = useMemo(() => new THREE.Color('#00ff88'), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, cursorWorldPos);

    let isAnyGathering = false;

    particles.forEach((p, i) => {
      const dx = cursorWorldPos.x - p.position.x;
      const dy = cursorWorldPos.y - p.position.y;
      const distToCursor = Math.sqrt(dx * dx + dy * dy);

      if (distToCursor < 8) {
        p.state = 'gathering';
        isAnyGathering = true;
      } else if (p.state === 'gathering') {
        p.state = 'returning';
      }

      if (p.state === 'gathering') {
        // Attract to cursor
        p.velocity.x += dx * 0.005;
        p.velocity.y += dy * 0.005;
        p.velocity.x += -dy * 0.002;
        p.velocity.y += dx * 0.002;
        p.velocity.multiplyScalar(0.85);
        p.size = THREE.MathUtils.lerp(p.size, 5, 0.1);
        p.brightness = THREE.MathUtils.lerp(p.brightness, 1.0, 0.1);
      } else {
        // Attract to target pin (idle/returning state)
        const pDx = p.targetPin.x - p.position.x;
        const pDy = p.targetPin.y - p.position.y;
        p.velocity.x += pDx * 0.002;
        p.velocity.y += pDy * 0.002;
        
        // Add some jitter
        p.velocity.x += (Math.random() - 0.5) * 0.02;
        p.velocity.y += (Math.random() - 0.5) * 0.02;
        
        p.velocity.multiplyScalar(0.92); // Damping
        
        p.brightness -= 0.02;
        if (p.brightness <= 0.15) {
          p.brightness = 0.15;
          p.size = 1.5;
        }
      }

      p.position.add(p.velocity);
      
      const i3 = i * 3;
      positions[i3] = p.position.x;
      positions[i3 + 1] = p.position.y;
      positions[i3 + 2] = p.position.z;
      
      sizes[i] = p.size;
      
      tempColor.copy(baseColor).multiplyScalar(p.brightness);
      colors[i3] = tempColor.r;
      colors[i3 + 1] = tempColor.g;
      colors[i3 + 2] = tempColor.b;
    });

    if (isAnyGathering && !lastGatherState.current) {
      audio.playHover();
      lastGatherState.current = true;
    } else if (!isAnyGathering && lastGatherState.current) {
      lastGatherState.current = false;
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  useEffect(() => {
    const handleClick = () => {
      particles.forEach(p => {
        if (p.state === 'gathering') {
          const dir = p.position.clone().sub(cursorWorldPos).normalize();
          p.velocity.add(dir.multiplyScalar(0.6));
          p.state = 'returning';
        }
      });
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [particles, cursorWorldPos]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={PARTICLE_COUNT} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-color" count={PARTICLE_COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={1} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
};

export default ParticleEngine;
