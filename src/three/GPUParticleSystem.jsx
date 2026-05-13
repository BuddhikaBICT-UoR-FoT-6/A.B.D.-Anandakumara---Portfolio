import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT        = 120;
const ORBIT_RADIUS = 55;  // pixels — tight visible cluster around cursor

const PALETTE = [
  new THREE.Color('#00FF41'),
  new THREE.Color('#66ffbb'),
  new THREE.Color('#00ccff'),
  new THREE.Color('#55ddff'),
  new THREE.Color('#ffffff'),
  new THREE.Color('#00aa33'),
  new THREE.Color('#003399'),
];

// ── Data pulse comet: click → processor centre (screen centre = 0,0) ─────────
const PULSE_STEPS = 18;

function DataPulse({ stateRef }) {
  const geoRef  = useRef();
  const posArr  = useRef(new Float32Array(PULSE_STEPS * 3).fill(9999));

  const fades = useMemo(() => {
    const f = new Float32Array(PULSE_STEPS);
    for (let i = 0; i < PULSE_STEPS; i++) f[i] = i / (PULSE_STEPS - 1);
    return f;
  }, []);

  const sizes = useMemo(() => {
    const s = new Float32Array(PULSE_STEPS);
    for (let i = 0; i < PULSE_STEPS; i++) s[i] = 6.0 * (1 - i / PULSE_STEPS) + 1;
    return s;
  }, []);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: `
      attribute float aFade; attribute float aSize; varying float vFade;
      void main() {
        vFade = aFade;
        gl_PointSize = aSize * (1.0 - aFade * 0.88);
        gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying float vFade;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        if (length(uv) > 0.5) discard;
        float c = exp(-dot(uv,uv) * 18.0);
        float a = pow(1.0 - vFade, 2.0) * c * 2.8;
        vec3  col = mix(vec3(0.4, 0.8, 1.0), vec3(1.0), 1.0 - vFade);
        gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
      }`,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  useFrame((_, delta) => {
    const s = stateRef.current;
    if (!s.pulseActive || !geoRef.current) return;
    s.pulseT += delta * 1.1;
    if (s.pulseT >= 1.0) { s.pulseActive = false; return; }

    const attr = geoRef.current.attributes.position;
    for (let i = 0; i < PULSE_STEPS; i++) {
      const t = Math.max(0, s.pulseT - (i / PULSE_STEPS) * 0.22);
      // lerp from click pos toward (0,0) = processor centre
      attr.setXYZ(i, s.pulseX * (1 - t), s.pulseY * (1 - t), 1);
    }
    attr.needsUpdate = true;
  });

  return (
    <points material={mat}>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" array={posArr.current} count={PULSE_STEPS} itemSize={3} />
        <bufferAttribute attach="attributes-aFade"    array={fades}          count={PULSE_STEPS} itemSize={1} />
        <bufferAttribute attach="attributes-aSize"    array={sizes}          count={PULSE_STEPS} itemSize={1} />
      </bufferGeometry>
    </points>
  );
}

// ── Swarm ─────────────────────────────────────────────────────────────────────
export default function GPUParticleSystem() {
  const { size } = useThree(); // size.width/height in pixels = world units at zoom:1

  const stateRef = useRef({
    mx: 9999, my: 9999,
    scatter: 0,
    pulseActive: false, pulseT: 0, pulseX: 0, pulseY: 0,
  });

  const data = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const siz = new Float32Array(COUNT);
    const pha = new Float32Array(COUNT);
    const rad = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      pos[i*3] = 9999; pos[i*3+1] = 9999; pos[i*3+2] = 0;
      pha[i] = (i / COUNT) * Math.PI * 2;
      rad[i] = ORBIT_RADIUS * (0.4 + Math.random() * 0.6);
      const c = PALETTE[i % PALETTE.length];
      col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
      siz[i] = 3.0 + Math.random() * 4.0;
    }
    return { pos, vel, col, siz, pha, rad };
  }, []); // eslint-disable-line

  const geoRef = useRef();

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: `
      attribute vec3  aColor;
      attribute float aSize;
      varying vec3 vColor;
      void main() {
        vColor = aColor;
        gl_PointSize = aSize;
        gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        vec2  uv = gl_PointCoord - 0.5;
        float d  = length(uv);
        if (d > 0.5) discard;
        float core = exp(-d * d * 10.0);
        float glow = exp(-d * d * 2.5);
        gl_FragColor = vec4(vColor * (1.5 + core * 3.0), glow * 0.92);
      }`,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  // mouse → pixel world coords (zoom:1 means 1 world unit = 1 CSS pixel)
  useEffect(() => {
    const onMove = (e) => {
      // convert screen px to world px (origin at centre)
      stateRef.current.mx =  e.clientX - window.innerWidth  / 2;
      stateRef.current.my = -(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // click → scatter + fire pulse
  useEffect(() => {
    const onClick = (e) => {
      const s = stateRef.current;
      s.scatter = 1.0;

      for (let i = 0; i < COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd   = 200 + Math.random() * 300; // pixels/sec
        data.vel[i*3]   = Math.cos(angle) * spd;
        data.vel[i*3+1] = Math.sin(angle) * spd;
      }

      s.pulseActive = true;
      s.pulseT      = 0;
      s.pulseX      = s.mx;
      s.pulseY      = s.my;
    };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [data.vel]);

  useFrame(({ clock }, delta) => {
    if (!geoRef.current) return;
    const s    = stateRef.current;
    const t    = clock.getElapsedTime();
    const attr = geoRef.current.attributes.position;
    const scattering = s.scatter > 0;
    if (scattering) s.scatter -= delta;

    for (let i = 0; i < COUNT; i++) {
      let x = attr.getX(i);
      let y = attr.getY(i);

      // snap to mouse on first frame
      if (x > 1000) { x = s.mx; y = s.my; }

      if (scattering) {
        data.vel[i*3]   *= 0.88;
        data.vel[i*3+1] *= 0.88;
        x += data.vel[i*3]   * delta;
        y += data.vel[i*3+1] * delta;
      } else {
        const angle = data.pha[i] + t * 0.6;
        const tx = s.mx + Math.cos(angle) * data.rad[i];
        const ty = s.my + Math.sin(angle) * data.rad[i];
        x += (tx - x) * Math.min(delta * 8, 1);
        y += (ty - y) * Math.min(delta * 8, 1);
      }

      attr.setXYZ(i, x, y, 0);
    }
    attr.needsUpdate = true;
  });

  return (
    <group renderOrder={10}>
      <points material={mat}>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute attach="attributes-position" array={data.pos} count={COUNT} itemSize={3} />
          <bufferAttribute attach="attributes-aColor"   array={data.col} count={COUNT} itemSize={3} />
          <bufferAttribute attach="attributes-aSize"    array={data.siz} count={COUNT} itemSize={1} />
        </bufferGeometry>
      </points>
      <DataPulse stateRef={stateRef} />
    </group>
  );
}
