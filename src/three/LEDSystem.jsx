import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { COMPONENT_REGISTRY } from './Registry';

// image is 2:1 (2048x1024) — map image UV to screen UV under "cover" fit
function imageUvToWorld(uv, vw, vh) {
  const rs = vw / vh;
  const ri = 2.0;
  let ux = uv[0], uy = uv[1];
  if (rs > ri) uy = (uv[1] - 0.5) * (rs / ri) + 0.5;
  else         ux = (uv[0] - 0.5) * (ri / rs) + 0.5;
  return [(ux - 0.5) * vw, (uy - 0.5) * vh, 0.4];
}

function makeGlowTexture(color) {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,    '#ffffff');
  g.addColorStop(0.15, color);
  g.addColorStop(0.55, color);
  g.addColorStop(1,    'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function LED({ uv, color, type }) {
  const ref = useRef();
  const { viewport } = useThree();
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const tex   = useMemo(() => makeGlowTexture(color), [color]);
  const pos   = useMemo(() => imageUvToWorld(uv, viewport.width, viewport.height),
    [uv, viewport.width, viewport.height]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    let on;
    if (type === 'status')   on = Math.sin(t * 3.5 + phase) > 0.3;
    else if (type === 'activity') on = Math.floor((t + phase) * 5) % 3 !== 0;
    else                     on = Math.floor((t + phase) * 4.5) % 2 === 0;

    const size = viewport.width * 0.03 * (on ? 1.0 : 0.15);
    ref.current.scale.setScalar(size);
    ref.current.material.opacity = on ? 0.95 : 0.08;
  });

  return (
    <sprite ref={ref} position={pos}>
      <spriteMaterial
        map={tex}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}

export default function LEDSystem() {
  const leds = useMemo(() =>
    Object.entries(COMPONENT_REGISTRY.LEDS).map(([id, d]) => ({ id, ...d })), []);
  return (
    <group>
      {leds.map(l => <LED key={l.id} {...l} />)}
    </group>
  );
}
