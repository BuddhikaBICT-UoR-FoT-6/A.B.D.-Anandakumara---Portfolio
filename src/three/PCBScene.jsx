import { Suspense, useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { COMPONENT_REGISTRY } from './Registry';
import { PCBShader } from './shaders/PCBShader';
import { useSimStore } from '../store/useSimStore';
import { audioManager } from '../utils/AudioManager';

// Systems
import LEDSystem from './LEDSystem';
import HeatSystem from './HeatSystem';
import PulseSystem from './PulseSystem';
import GPUParticleSystem from './GPUParticleSystem';
import Effects from './Effects';

const DEBUG_UV_OVERLAY = false;

function PCBPlane() {
  const texture = useTexture('/background.jpg');
  const meshRef = useRef();
  const { viewport } = useThree();
  const updateCursor = useSimStore(state => state.updateCursor);

  // Calculate scaling for "cover" behavior
  const { aspect, offset } = useMemo(() => {
    if (!texture.image) return { aspect: 1, offset: [0,0] };
    const imageAspect = texture.image.width / texture.image.height;
    const viewportAspect = viewport.width / viewport.height;
    
    let scaleX = 1;
    let scaleY = 1;
    if (imageAspect > viewportAspect) {
      scaleX = viewportAspect / imageAspect;
    } else {
      scaleY = imageAspect / viewportAspect;
    }
    return { 
      aspect: imageAspect,
      scale: [scaleX, scaleY]
    };
  }, [texture, viewport]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      ...PCBShader,
      uniforms: {
        ...PCBShader.uniforms,
        uTexture: { value: texture },
        uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
        uImageRes: { value: new THREE.Vector2(
          texture.image?.width || 2048, 
          texture.image?.height || 1024
        )}
      }
    });
  }, [texture, viewport]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const handlePointerMove = (e) => {
    const uv = e.uv;
    if (uv) {
      updateCursor({ uv: [uv.x, uv.y] });
      if (meshRef.current) {
        meshRef.current.material.uniforms.uMouse.value.set(uv.x, uv.y);
      }
    }
  };

  return (
    <mesh 
      ref={meshRef} 
      material={shaderMaterial}
      onPointerMove={handlePointerMove}
      onClick={(e) => {
        audioManager.init();
        audioManager.playClick();
        useSimStore.getState().triggerClickPulse([e.uv.x, e.uv.y]);
      }}
    >
      <planeGeometry args={[viewport.width, viewport.height]} />
    </mesh>
  );
}

export default function PCBScene() {
  return (
    <group>
      <Suspense fallback={null}>
        <PCBPlane />
        {/* Render systems in a specific order with Z offsets */}
        <group position={[0, 0, 0.1]}>
           <LEDSystem />
           <HeatSystem />
           <PulseSystem />
           <GPUParticleSystem />
        </group>
      </Suspense>

      <Effects />
    </group>
  );
}
