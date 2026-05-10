import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../utils/AudioManager';

const PARTICLE_COUNT = 80;

const ParticleEngine = () => {
  const pointsRef = useRef();
  const { mouse, raycaster, camera } = useThree();
  const lastGatherState = useRef(false);
  
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      data.push({
        position: new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, 0.05),
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, 0),
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
  // Raycast against the XY plane (z=0)
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const baseColor = useMemo(() => new THREE.Color('#00ff88'), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const tempVel = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, cursorWorldPos);

    let isAnyGathering = false;

    particles.forEach((p, i) => {
      // Calculate distance in XY plane
      const dx = cursorWorldPos.x - p.position.x;
      const dy = cursorWorldPos.y - p.position.y;
      const distToCursor = Math.sqrt(dx * dx + dy * dy);

      if (distToCursor < 6) {
        p.state = 'gathering';
        isAnyGathering = true;
      } else if (p.state === 'gathering') {
        p.state = 'dispersing';
        tempVel.set((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, 0);
        p.velocity.add(tempVel);
      }

      if (p.state === 'gathering') {
        p.velocity.x += dx * 0.005;
        p.velocity.y += dy * 0.005;
        // Swirl force in XY
        p.velocity.x += -dy * 0.002;
        p.velocity.y += dx * 0.002;
        p.velocity.multiplyScalar(0.85);
        p.size = THREE.MathUtils.lerp(p.size, 5, 0.1);
        p.brightness = THREE.MathUtils.lerp(p.brightness, 1.0, 0.1);
      } else if (p.state === 'dispersing') {
        p.velocity.multiplyScalar(0.96);
        p.brightness -= 0.02;
        if (p.brightness <= 0.15) {
          p.state = 'idle';
          p.brightness = 0.15;
          p.size = 1.5;
        }
      } else {
        p.velocity.x += (Math.random() - 0.5) * 0.001;
        p.velocity.y += (Math.random() - 0.5) * 0.001;
        p.velocity.multiplyScalar(0.99);
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
          p.velocity.add(dir.multiplyScalar(0.4));
          p.state = 'dispersing';
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
