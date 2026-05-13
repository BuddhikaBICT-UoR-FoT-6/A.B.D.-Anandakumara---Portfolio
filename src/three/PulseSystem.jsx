import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PULSE_TRACES } from './Registry';

// UV → world (cover fit, image 2:1)
function uvToWorld(uv, vw, vh) {
  const rs = vw / vh, ri = 2.0;
  let ux = uv[0], uy = uv[1];
  if (rs > ri) uy = (uv[1] - 0.5) * (rs / ri) + 0.5;
  else         ux = (uv[0] - 0.5) * (ri / rs) + 0.5;
  return new THREE.Vector3((ux - 0.5) * vw, (uy - 0.5) * vh, 0.3);
}

// Tail length in curve-t units — short sharp comet tail
const TAIL_STEPS = 24;
const TAIL_LENGTH = 0.09; // fraction of total curve length

// Per-comet vertex shader: each vertex is one tail segment
// aT = curve t value for this segment, aFade = 0(head)→1(tail end)
const cometVert = `
  attribute float aFade;
  attribute float aSize;
  varying float vFade;
  void main() {
    vFade = aFade;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (1.0 - aFade * 0.85);
    gl_Position  = projectionMatrix * mv;
  }
`;

const cometFrag = `
  varying float vFade;
  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.5) discard;
    // bright white core fading to transparent
    float core  = exp(-d * d * 20.0);
    float alpha = (1.0 - vFade) * (1.0 - vFade) * core * 2.2;
    // head = pure white, tail = blue-white
    vec3  col   = mix(vec3(0.55, 0.80, 1.0), vec3(1.0, 1.0, 1.0), 1.0 - vFade);
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

// Spread modes: returns array of {startOffset, speed} for comets on one trace
const SPREAD_MODES = [
  () => [{ o: 0.0, s: 0.13 }, { o: 0.5, s: 0.13 }],                          // two evenly spaced
  () => [{ o: 0.0, s: 0.18 }, { o: 0.3, s: 0.10 }, { o: 0.7, s: 0.15 }],    // three, mixed speeds
  () => [{ o: Math.random(), s: 0.08 + Math.random() * 0.12 }],               // single random
  () => [{ o: 0.0, s: 0.20 }, { o: 0.15, s: 0.20 }],                         // two chasing close
  () => [{ o: 0.0, s: 0.10 }, { o: 0.4, s: 0.16 }, { o: 0.75, s: 0.09 }],   // three spread
];

function pickMode() {
  return SPREAD_MODES[Math.floor(Math.random() * SPREAD_MODES.length)]();
}

function Comet({ curve, startOffset, speed, tailSteps, tailLength }) {
  const meshRef = useRef();
  const prog    = useRef(startOffset);

  // pre-allocate position buffer for tail segments
  const { positions, fades, sizes } = useMemo(() => {
    const positions = new Float32Array(tailSteps * 3);
    const fades     = new Float32Array(tailSteps);
    const sizes     = new Float32Array(tailSteps);
    for (let i = 0; i < tailSteps; i++) {
      fades[i] = i / (tailSteps - 1);   // 0=head, 1=tail end
      sizes[i] = 3.5 - i * (2.5 / tailSteps); // head bigger, tail tiny
    }
    return { positions, fades, sizes };
  }, [tailSteps]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    prog.current = (prog.current + delta * speed) % 1.0;

    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;

    for (let i = 0; i < tailSteps; i++) {
      const t = prog.current - (i / tailSteps) * tailLength;
      const tc = ((t % 1.0) + 1.0) % 1.0; // wrap
      const pt = curve.getPoint(tc);
      posAttr.setXYZ(i, pt.x, pt.y, pt.z);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={tailSteps} itemSize={3} />
        <bufferAttribute attach="attributes-aFade"    array={fades}     count={tailSteps} itemSize={1} />
        <bufferAttribute attach="attributes-aSize"    array={sizes}     count={tailSteps} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={cometVert}
        fragmentShader={cometFrag}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Rail({ trace, traceIdx }) {
  const { viewport } = useThree();

  const curve = useMemo(() => {
    const pts = trace.points.map(p => uvToWorld(p, viewport.width, viewport.height));
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
  }, [trace.points, viewport.width, viewport.height]);

  // faint static rail line
  const lineGeo = useMemo(() => {
    const pts = curve.getPoints(80);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [curve]);

  // comets — re-randomise spread mode every render cycle via ref
  const comets = useRef(pickMode());
  const reshuffleTimer = useRef(10 + Math.random() * 8);

  useFrame((_, delta) => {
    reshuffleTimer.current -= delta;
    if (reshuffleTimer.current <= 0) {
      comets.current = pickMode();
      reshuffleTimer.current = 10 + Math.random() * 8;
    }
  });

  return (
    <group>
      {/* needle-thin rail */}
      <line geometry={lineGeo}>
        <lineBasicMaterial
          color="#001a3a"
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* comets along this rail */}
      {comets.current.map((c, i) => (
        <Comet
          key={i}
          curve={curve}
          startOffset={c.o}
          speed={c.s}
          tailSteps={TAIL_STEPS}
          tailLength={TAIL_LENGTH}
        />
      ))}
    </group>
  );
}

export default function PulseSystem() {
  return (
    <group>
      {PULSE_TRACES.map((trace, i) => (
        <Rail key={trace.id} trace={trace} traceIdx={i} />
      ))}
    </group>
  );
}
