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
  
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

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
        roughness={0.9}
        metalness={0.1}
        emissiveMap={texture}
        emissive={new THREE.Color('#ffffff')}
        emissiveIntensity={1.0}
      />
      <LightSystem planeWidth={scaleX} planeHeight={scaleY} surgeTime={surgeTime} />
      <TraceAnimator planeWidth={scaleX} planeHeight={scaleY} surgeTime={surgeTime} />
    </mesh>
  );
}

export default function PCBScene() {
  const [mousePos, setMousePos] = useState([0, 0, 0]);
  const [surgeTime, setSurgeTime] = useState(0);

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={1} />
      
      <ambientLight intensity={1.5} color="#ffffff" />
      
      <Suspense fallback={null}>
        <PCBBoard surgeTime={surgeTime} setMousePos={setMousePos} />
      </Suspense>

      <ParticleSystem mousePos={mousePos} surgeTime={surgeTime} />
      
      <mesh 
        position={[0, 0, 0]} 
        visible={false} 
        onPointerMove={(e) => setMousePos([e.point.x, e.point.y, 0.1])}
        onClick={(e) => {
          setMousePos([e.point.x, e.point.y, 0.1]);
          setSurgeTime(performance.now());
        }}
      >
        <planeGeometry args={[200, 200]} />
      </mesh>

      <Effects />
    </>
  );
}
