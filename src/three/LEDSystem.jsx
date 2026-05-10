import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { COMPONENT_REGISTRY } from './Registry';
import { useSimStore } from '../store/useSimStore';

function LED({ id, uv, color, type }) {
  const meshRef = useRef();
  const lightRef = useRef();
  const { viewport } = useThree();
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  // Texture for the corona glow
  const coronaTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, color);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, [color]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    let intensity = 0.8;

    if (type === 'status') {
      // Breathing effect
      intensity = 0.6 + 0.4 * Math.sin(t * 1.2 + phaseOffset);
    } else if (type === 'activity') {
      // Activity pulse (irregular)
      const lastPulse = Math.floor(t / 1.5);
      const subT = t % 1.5;
      intensity = subT < 0.12 ? 2.0 : 0.6;
    } else if (type === 'error') {
      // Error blinking
      const isBlink = Math.floor(t * 8) % 2 === 0;
      intensity = isBlink ? 1.5 : 0.2;
    }

    if (lightRef.current) lightRef.current.intensity = intensity;
    if (meshRef.current) meshRef.current.scale.setScalar(intensity * 0.15);
  });

  const position = [
    (uv[0] - 0.5) * viewport.width,
    (uv[1] - 0.5) * viewport.height,
    0.2
  ];

  return (
    <group position={position}>
      <pointLight 
        ref={lightRef} 
        color={color} 
        distance={2.5} 
        decay={2} 
      />
      <sprite ref={meshRef}>
        <spriteMaterial 
          map={coronaTexture} 
          transparent 
          blending={THREE.AdditiveBlending} 
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

export default function LEDSystem() {
  const leds = useMemo(() => {
    return Object.entries(COMPONENT_REGISTRY.LEDS).map(([id, data]) => ({
      id, ...data
    }));
  }, []);

  return (
    <group>
      {leds.map(led => (
        <LED key={led.id} {...led} />
      ))}
    </group>
  );
}
