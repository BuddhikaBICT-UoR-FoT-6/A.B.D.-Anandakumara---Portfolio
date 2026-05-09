import { Suspense, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useTexture, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import LightSystem from './LightSystem';
import TraceAnimator from './TraceAnimator';
import ParticleSystem from './ParticleSystem';
import Effects from './Effects';

function PCBBoard({ surgeTime, setMousePos }) {
  const texture = useTexture('/background.jpg');
  const { viewport } = useThree();
  
  // High-res texture dimensions
  const imgAspect = 5824 / 3264;
  const viewportAspect = viewport.width / viewport.height;
  
  let scaleX, scaleY;
  if (viewportAspect > imgAspect) {
    scaleX = viewport.width;
    scaleY = viewport.width / imgAspect;
  } else {
    scaleY = viewport.height;
    scaleX = viewport.height * imgAspect;
  }

  return (
    <mesh 
      onPointerMove={(e) => setMousePos([e.point.x, e.point.y, 0.1])}
    >
      <planeGeometry args={[scaleX, scaleY]} />
      <meshStandardMaterial 
        map={texture} 
        roughness={0.4}
        metalness={0.7}
        emissive="#0a0500"
        emissiveIntensity={0.1}
      />
      <LightSystem planeWidth={scaleX} planeHeight={scaleY} surgeTime={surgeTime} />
      <TraceAnimator planeWidth={scaleX} planeHeight={scaleY} />
    </mesh>
  );
}

export default function PCBScene() {
  const [mousePos, setMousePos] = useState([0, 0, 0]);
  const [surgeTime, setSurgeTime] = useState(0);

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={1} />
      
      {/* Dark warm ambient light */}
      <ambientLight intensity={0.25} color="#442211" />
      
      <Suspense fallback={null}>
        <PCBBoard surgeTime={surgeTime} setMousePos={setMousePos} />
      </Suspense>

      <ParticleSystem mousePos={mousePos} />
      
      {/* Invisible interaction plane that covers the screen even during load */}
      <mesh 
        position={[0, 0, 0]} 
        visible={false} 
        onPointerMove={(e) => setMousePos([e.point.x, e.point.y, 0.1])}
        onClick={() => setSurgeTime(performance.now())}
      >
        <planeGeometry args={[200, 200]} />
      </mesh>

      <Effects />
    </>
  );
}
