import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { audio } from '../utils/AudioManager';

const MAX_RINGS = 5;

const Shockwave = () => {
  const { camera } = useThree();
  const ringsRef = useRef([]);
  const flashRef = useRef();
  const sparksRef = useRef([]);
  
  const ringData = useRef([]);
  const sparkData = useRef([]);
  const flashData = useRef({ intensity: 0, life: 0 });

  const mouseWorldPos = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const onMouseMove = (e) => {
      const aspect = window.innerWidth / window.innerHeight;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseWorldPos.current.x = nx * 38 * aspect;
      mouseWorldPos.current.y = ny * 38;
    };
    
    const onClick = () => {
      audio.playPulse();
      
      const px = mouseWorldPos.current.x;
      const py = mouseWorldPos.current.y;
      
      // 1. White flash (PointLight)
      if (flashRef.current) {
        flashRef.current.position.set(px, py, 1.0);
      }
      flashData.current = { intensity: 20, life: 1.0 };

      // 2. Expanding Ring
      ringData.current.push({
        x: px, y: py,
        radius: 0.1,
        life: 1.0,
      });

      // 3. Electric Sparks (Jagged lines)
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        sparkData.current.push({
          x: px, y: py,
          angle: angle,
          life: 1.0,
          speed: 10 + Math.random() * 20
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
    };
  }, []);

  useFrame((state, delta) => {
    // Update Flash
    if (flashData.current.life > 0) {
      flashData.current.life -= delta * 5;
      if (flashRef.current) {
        flashRef.current.intensity = flashData.current.intensity * flashData.current.life;
      }
    } else if (flashRef.current) {
      flashRef.current.intensity = 0;
    }

    // Update Rings
    ringData.current = ringData.current.filter(r => r.life > 0);
    ringsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const r = ringData.current[i];
      if (r) {
        r.radius += delta * 60;
        r.life -= delta * 1.5;
        mesh.position.set(r.x, r.y, 0.5);
        mesh.scale.set(r.radius, r.radius, 1);
        mesh.material.opacity = r.life;
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    });

    // Update Sparks
    sparkData.current = sparkData.current.filter(s => s.life > 0);
    sparksRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = sparkData.current[i];
      if (s) {
        s.life -= delta * 3.0;
        const dist = (1.0 - s.life) * s.speed;
        mesh.position.set(
          s.x + Math.cos(s.angle) * dist,
          s.y + Math.sin(s.angle) * dist,
          0.6
        );
        mesh.rotation.z = s.angle;
        mesh.material.opacity = s.life;
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    });
  });

  return (
    <group>
      <pointLight ref={flashRef} color="#ffffff" intensity={0} distance={50} decay={1} />
      
      {Array.from({ length: MAX_RINGS }).map((_, i) => (
        <mesh key={`ring-${i}`} ref={el => ringsRef.current[i] = el} visible={false}>
          <ringGeometry args={[0.9, 1.0, 32]} />
          <meshBasicMaterial color="#88ccff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}

      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`spark-${i}`} ref={el => sparksRef.current[i] = el} visible={false}>
          <planeGeometry args={[3, 0.1]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
};

export default Shockwave;
