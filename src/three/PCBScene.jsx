import { Suspense, useRef, useMemo, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { PCBShader } from './shaders/PCBShader';
import { useSimStore } from '../store/useSimStore';
import { audioManager } from '../utils/AudioManager';

import LEDSystem from './LEDSystem';
import PulseSystem from './PulseSystem';

function PCBPlane() {
  const texture = useTexture('/background.jpg');
  const meshRef = useRef();
  const { viewport, size } = useThree();
  const updateCursor = useSimStore(state => state.updateCursor);

  const material = useMemo(() => {
    if (!texture?.image) return null;
    return new THREE.ShaderMaterial({
      ...PCBShader,
      uniforms: {
        ...PCBShader.uniforms,
        uTexture:    { value: texture },
        uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
        uImageRes:   { value: new THREE.Vector2(texture.image.width, texture.image.height) },
      },
    });
  }, [texture, viewport.width, viewport.height]);

  useFrame(({ clock }) => {
    if (meshRef.current?.material?.uniforms?.uTime)
      meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
  });

  if (!material) return null;

  return (
    <mesh
      ref={meshRef}
      material={material}
      onPointerMove={(e) => {
        if (!e.uv || !e.point) return;
        updateCursor({ uv: [e.uv.x, e.uv.y], world: { x: e.point.x, y: e.point.y } });
        if (meshRef.current) meshRef.current.material.uniforms.uMouse.value.set(e.uv.x, e.uv.y);
      }}
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

function SceneContent() {
  const { viewport, camera } = useThree();

  // Set up orthographic camera to match viewport exactly
  useEffect(() => {
    if (camera.isOrthographicCamera) {
      camera.left   = viewport.width  / -2;
      camera.right  = viewport.width  /  2;
      camera.top    = viewport.height /  2;
      camera.bottom = viewport.height / -2;
      camera.near   = 0.1;
      camera.far    = 1000;
      camera.position.set(0, 0, 10);
      camera.updateProjectionMatrix();
    }
  }, [camera, viewport.width, viewport.height]);

  return (
    <>
      <Suspense fallback={null}>
        <PCBPlane />
        <LEDSystem />
        <PulseSystem />
      </Suspense>
    </>
  );
}

export default function PCBScene() {
  return <SceneContent />;
}
