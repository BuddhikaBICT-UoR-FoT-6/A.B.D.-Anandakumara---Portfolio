import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { TRACE_GRAPH } from './Registry';

const PulseShader = {
  uniforms: {
    uTime: { value: 0 },
    uAlpha: { value: 1.0 },
    uColor: { value: new THREE.Color('#00FF88') }
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
    uniform float uAlpha;
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
      float d = length(vUv - 0.5);
      float glow = exp(-d * d * 15.0);
      vec3 finalColor = mix(uColor, vec3(1.0), glow);
      gl_FragColor = vec4(finalColor, glow * uAlpha);
    }
  `
};

function Pulse({ path, speed, delay }) {
  const meshRef = useRef();
  const { viewport } = useThree();
  const progress = useRef(Math.random());

  const curve = useMemo(() => {
    // Ensure at least 2 points
    if (!path || path.length < 2) return null;
    
    const points = path.map(uv => new THREE.Vector3(
      (uv[0] - 0.5) * viewport.width,
      (uv[1] - 0.5) * viewport.height,
      0.18
    ));
    return new THREE.CatmullRomCurve3(points);
  }, [path, viewport.width, viewport.height]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      ...PulseShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false
    });
  }, []);

  useFrame((state, delta) => {
    if (!curve || !meshRef.current) return;
    
    progress.current += delta * speed;
    if (progress.current > 1.0) {
      progress.current = 0;
    }

    const pos = curve.getPoint(progress.current);
    meshRef.current.position.copy(pos);
    
    // Pulse size oscillation
    const scale = 0.08 + Math.sin(state.clock.getElapsedTime() * 10 + delay) * 0.02;
    meshRef.current.scale.setScalar(scale);
  });

  if (!curve) return null;

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[1, 16, 16]} />
    </mesh>
  );
}

export default function PulseSystem() {
  const traces = useMemo(() => Object.values(TRACE_GRAPH), []);

  return (
    <group>
      {traces.map((path, i) => (
        <Pulse 
          key={i} 
          path={path} 
          speed={0.12 + Math.random() * 0.1} 
          delay={i * 0.5} 
        />
      ))}
    </group>
  );
}
