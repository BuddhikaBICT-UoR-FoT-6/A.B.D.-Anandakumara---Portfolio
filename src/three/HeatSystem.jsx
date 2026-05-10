import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { COMPONENT_REGISTRY } from './Registry';

const HeatShader = {
  uniforms: {
    uTime: { value: 0 },
    uIntensity: { value: 1.0 },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uPhase: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec2 uCenter;
    uniform float uPhase;
    varying vec2 vUv;

    void main() {
      float dist = distance(vUv, vec2(0.5));
      float pulse = sin(uTime * 0.8 + uPhase) * 0.5 + 0.5;
      float bloom = exp(-dist * dist / (0.1 * uIntensity));
      float shimmer = (sin(uTime * 12.0 + dist * 40.0) * 0.5 + 0.5) * 0.15;
      
      vec3 heatColor = mix(vec3(1.0, 0.6, 0.0), vec3(1.0, 1.0, 1.0), smoothstep(0.0, 0.2, dist));
      float alpha = (bloom + shimmer) * pulse * uIntensity * (1.0 - dist * 2.0);
      
      gl_FragColor = vec4(heatColor, clamp(alpha, 0.0, 1.0));
    }
  `
};

function HeatZone({ uv, intensity, type }) {
  const meshRef = useRef();
  const { viewport } = useThree();
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      ...HeatShader,
      uniforms: {
        ...HeatShader.uniforms,
        uIntensity: { value: intensity },
        uPhase: { value: phase }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false
    });
  }, [intensity, phase]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const size = type === 'processor' ? 4 : 2;

  return (
    <mesh 
      ref={meshRef} 
      position={[
        (uv[0] - 0.5) * viewport.width,
        (uv[1] - 0.5) * viewport.height,
        0.15
      ]}
      material={material}
    >
      <planeGeometry args={[size, size]} />
    </mesh>
  );
}

export default function HeatSystem() {
  const components = useMemo(() => {
    const list = [];
    Object.values(COMPONENT_REGISTRY.PROCESSORS).forEach(c => list.push(c));
    Object.values(COMPONENT_REGISTRY.PASSIVES).forEach(c => list.push(c));
    return list;
  }, []);

  return (
    <group>
      {components.map((comp, i) => (
        <HeatZone key={i} {...comp} />
      ))}
    </group>
  );
}
