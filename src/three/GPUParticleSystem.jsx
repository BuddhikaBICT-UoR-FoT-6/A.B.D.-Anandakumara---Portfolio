import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimStore } from '../store/useSimStore';

const PARTICLE_COUNT = 3500;

const ParticleShader = {
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3() },
    uClickPos: { value: new THREE.Vector3() },
    uClickTime: { value: -10.0 },
  },
  vertexShader: `
    uniform float uTime;
    uniform vec3 uMouse;
    uniform vec3 uClickPos;
    uniform float uClickTime;

    attribute vec3 aOrigin;
    attribute float aSize;
    attribute float aPhase;
    attribute vec3 aColor;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = aColor;
      vec3 pos = aOrigin;

      // 1. Ambient Drift
      pos.x += sin(uTime * 0.3 + aPhase) * 0.15;
      pos.y += cos(uTime * 0.4 + aPhase) * 0.15;

      // 2. Mouse Repulsion
      float mouseDist = distance(pos, uMouse);
      if (mouseDist < 1.8) {
        vec3 dir = normalize(pos - uMouse);
        float force = pow(1.0 - (mouseDist / 1.8), 2.0) * 0.8;
        pos += dir * force;
      }

      // 3. Click Explosion
      float tClick = uTime - uClickTime;
      if (tClick >= 0.0 && tClick < 1.5) {
        float clickDist = distance(pos, uClickPos);
        vec3 clickDir = normalize(pos - uClickPos);
        float wave = smoothstep(0.0, 0.15, tClick) * exp(-tClick * 3.0);
        float force = exp(-clickDist * 1.5) * wave * 8.0;
        pos += clickDir * force;
      }

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * (400.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
      
      vAlpha = 1.0;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      if (d > 0.5) discard;
      float strength = (1.0 - d * 2.0);
      gl_FragColor = vec4(vColor + core * 0.5, strength * vAlpha);
    }
  `
};

export default function GPUParticleSystem() {
  const meshRef = useRef();
  const { viewport } = useThree();
  const clickTimeRef = useRef(-10.0);
  const clickPosRef = useRef(new THREE.Vector3());

  const [positions, origins, colors, sizes, phases] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const orig = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const siz = new Float32Array(PARTICLE_COUNT);
    const pha = new Float32Array(PARTICLE_COUNT);

    const palette = [
      new THREE.Color('#00FF41'), // Green
      new THREE.Color('#FFD700'), // Gold
      new THREE.Color('#00ccff'), // Blue
      new THREE.Color('#ffffff'), // White
    ];

    const w = viewport.width || 10;
    const h = viewport.height || 10;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = (Math.random() - 0.5) * w * 1.5;
      const y = (Math.random() - 0.5) * h * 1.5;
      const z = (Math.random() - 0.5) * 0.5;

      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      orig[i * 3] = x; orig[i * 3 + 1] = y; orig[i * 3 + 2] = z;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;

      siz[i] = 1.2 + Math.random() * 2.5;
      pha[i] = Math.random() * Math.PI * 2;
    }
    return [pos, orig, col, siz, pha];
  }, [viewport.width, viewport.height]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3() },
    uClickPos: { value: new THREE.Vector3() },
    uClickTime: { value: -10.0 }
  }), []);

  // Listen to click event from store
  useEffect(() => {
    const unsubscribe = useSimStore.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase === 'CLICK') {
          const { uv } = useSimStore.getState().cursor;
          clickPosRef.current.set(
            (uv[0] - 0.5) * viewport.width,
            (uv[1] - 0.5) * viewport.height,
            0.3
          );
          clickTimeRef.current = performance.now() / 1000; // Store as seconds for shader
          // Reset phase after a short delay to allow re-clicks
          setTimeout(() => useSimStore.getState().setPhase('IDLE'), 100);
        }
      }
    );
    return unsubscribe;
  }, [viewport.width, viewport.height]);

  useFrame((state) => {
    if (meshRef.current) {
      const { uv } = useSimStore.getState().cursor;
      const worldX = (uv[0] - 0.5) * viewport.width;
      const worldY = (uv[1] - 0.5) * viewport.height;
      
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
      meshRef.current.material.uniforms.uMouse.value.set(worldX, worldY, 0.3);
      meshRef.current.material.uniforms.uClickPos.value.copy(clickPosRef.current);
      // Synchronize shader uClickTime with clock
      // We need to map performance.now() back to the clock time
      if (clickTimeRef.current > 0) {
        const offset = performance.now() / 1000 - state.clock.getElapsedTime();
        meshRef.current.material.uniforms.uClickTime.value = clickTimeRef.current - offset;
      }
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aOrigin" count={PARTICLE_COUNT} array={origins} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={PARTICLE_COUNT} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={PARTICLE_COUNT} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={PARTICLE_COUNT} array={phases} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial 
        {...ParticleShader} 
        uniforms={uniforms} 
        transparent 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </points>
  );
}
