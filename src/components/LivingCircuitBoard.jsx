import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* =========================================================================
   LIVING CIRCUIT BOARD — animated 3D PCB background
   -------------------------------------------------------------------------
   A self-contained React component that renders a real, navigable 3D scene
   (not a static image) of a circuit board with:
     - current "flowing" through gold power traces (animated emissive pulse)
     - data packets traveling along blue data traces toward a central core
     - status LEDs that blink irregularly, like real activity lights
     - chips that heat up and cool down on their own thermal cycle
     - random electrical sparks (more frequent on hot chips)
     - a breathing, rotating "AI engine" core at the center
     - subtle camera parallax (mouse + autonomous sway) to sell real depth

   Drop this in once near the root of your app and it becomes the page
   background (position: fixed by default). Your existing content can sit
   on top of it exactly as it does today over the static image.

   npm install three
   ========================================================================= */

// ---------------------------------------------------------------------------
// Palette — tuned to match a dark PCB look (gold/copper power, cyan/green data)
// ---------------------------------------------------------------------------
const COLORS = {
  bg: 0x040907,
  pcb: 0x07140f,
  traceGold: 0xc9a14b,
  traceBlue: 0x4fd1ff,
  ledRed: 0xff4444,
  ledGreen: 0x4ade80,
  ledYellow: 0xfacc15,
  coreCyan: 0x22d3ee,
  coreGreen: 0x4ade80,
  cool: 0x2dd4ff,
  hot: 0xff5a2b,
  spark: 0xfff4cc,
};

// ---------------------------------------------------------------------------
// Generic helpers (pure — no component state)
// ---------------------------------------------------------------------------

function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function makeGlowSprite(glowTexture, color, size = 1, opacity = 0.6) {
  const mat = new THREE.SpriteMaterial({
    map: glowTexture,
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(size, size, 1);
  return sprite;
}

function drawTextSprite(ctx, canvas, text, color) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '600 26px "Courier New", monospace';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function makeTextSprite(text, color, scale = [1.1, 0.42]) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 48;
  const ctx = canvas.getContext('2d');
  drawTextSprite(ctx, canvas, text, color);
  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(scale[0], scale[1], 1);
  sprite.userData = { canvas, ctx, texture };
  return sprite;
}

function updateTextSprite(sprite, text, color) {
  const { ctx, canvas, texture } = sprite.userData;
  drawTextSprite(ctx, canvas, text, color);
  texture.needsUpdate = true;
}

// Dense, mostly-static "silkscreen" detail layer: via dots, fine background
// traces and labels. This carries the visual density of a real PCB cheaply
// (one texture, one draw call) so the explicit 3D objects can stay focused
// on the parts that actually need to move.
function buildSilkscreenTexture({ width = 2048, height = 1170, boardLabel, engineLabel }) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#071712';
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, height * 0.15,
    width / 2, height / 2, height * 0.95
  );
  vignette.addColorStop(0, 'rgba(10,40,30,0.35)');
  vignette.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(170,140,70,0.16)';
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 150; i++) {
    let x = Math.random() * width;
    let y = Math.random() * height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    const segs = 2 + Math.floor(Math.random() * 3);
    for (let s = 0; s < segs; s++) {
      if (Math.random() < 0.5) x += Math.random() * 160 - 80;
      else y += Math.random() * 160 - 80;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(140,170,160,0.22)';
  const gridStep = 46;
  for (let gx = gridStep / 2; gx < width; gx += gridStep) {
    for (let gy = gridStep / 2; gy < height; gy += gridStep) {
      if (Math.random() < 0.14) {
        const r = 2.5 + Math.random() * 2;
        ctx.beginPath();
        ctx.arc(gx + (Math.random() * 10 - 5), gy + (Math.random() * 10 - 5), r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.strokeStyle = 'rgba(170,140,70,0.28)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 26; i++) {
    const w = 26 + Math.random() * 40;
    const h = 10 + Math.random() * 14;
    const x = Math.random() * (width - w);
    const y = Math.random() * (height - h);
    ctx.strokeRect(x, y, w, h);
  }

  ctx.fillStyle = 'rgba(120,255,210,0.5)';
  ctx.font = '600 30px "Courier New", monospace';
  ctx.fillText(boardLabel, 56, 64);

  ctx.fillStyle = 'rgba(120,255,210,0.32)';
  ctx.font = '500 18px "Courier New", monospace';
  ctx.fillText(engineLabel, width - 280, height - 40);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Orthogonal (PCB-style) path between two points, made of a few right-angle
// jogs rather than a straight or curved line.
function orthogonalPath(start, end, jogs = 3, lift = 0.12) {
  const pts = [];
  let cur = start.clone();
  cur.y = lift;
  pts.push(cur.clone());
  for (let i = 0; i < jogs; i++) {
    const axis = i % 2 === 0 ? 'x' : 'z';
    const remaining = jogs - i;
    const frac = (1 / remaining) * (0.7 + Math.random() * 0.6);
    const next = cur.clone();
    if (axis === 'x') next.x += (end.x - cur.x) * frac;
    else next.z += (end.z - cur.z) * frac;
    next.y = lift;
    pts.push(next);
    cur = next;
  }
  const last = end.clone();
  last.y = lift;
  pts.push(last);
  return pts;
}

// Position at a given fraction (0..1) of total length along a polyline.
function sampleAlongPath(points, frac) {
  const lengths = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const l = points[i].distanceTo(points[i + 1]);
    lengths.push(l);
    total += l;
  }
  let target = Math.max(0, Math.min(1, frac)) * total;
  for (let i = 0; i < lengths.length; i++) {
    if (target <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] > 0 ? Math.min(1, target / lengths[i]) : 0;
      return points[i].clone().lerp(points[i + 1], t);
    }
    target -= lengths[i];
  }
  return points[points.length - 1].clone();
}

// Builds a trace as a chain of flat copper-bar meshes following `points`.
// Returns the segment list with cumulative-length bookkeeping so the flow
// animation can place a moving "current" band across the whole trace.
function buildTraceMeshes(points, color, { width = 0.09, thickness = 0.045, baseEmissive = 0.12 } = {}) {
  const group = new THREE.Group();
  const segments = [];
  const lengths = [];
  for (let i = 0; i < points.length - 1; i++) lengths.push(points[i].distanceTo(points[i + 1]));
  const total = lengths.reduce((a, b) => a + b, 0) || 1;

  let cumulative = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const len = lengths[i];
    if (len < 0.001) {
      cumulative += len;
      continue;
    }
    const mid = a.clone().lerp(b, 0.5);
    const dir = b.clone().sub(a);
    const angle = Math.atan2(dir.z, dir.x);
    const geo = new THREE.BoxGeometry(len, thickness, width);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color).multiplyScalar(0.35),
      emissive: new THREE.Color(color),
      emissiveIntensity: baseEmissive,
      roughness: 0.35,
      metalness: 0.6,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(mid);
    mesh.rotation.y = -angle;
    group.add(mesh);
    segments.push({ mesh, material: mat, offsetStart: cumulative, length: len });
    cumulative += len;
  }
  return { group, segments, totalLength: total, points };
}

function makeHexShape(outerR, innerR) {
  const shape = new THREE.Shape();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    const x = Math.cos(a) * outerR;
    const y = Math.sin(a) * outerR;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const hole = new THREE.Path();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    const x = Math.cos(a) * innerR;
    const y = Math.sin(a) * innerR;
    if (i === 0) hole.moveTo(x, y);
    else hole.lineTo(x, y);
  }
  hole.closePath();
  shape.holes.push(hole);
  return shape;
}

function disposeObject3D(root) {
  root.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      mats.forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
    }
  });
}

function perimeterPoint(t, w, d) {
  const perim = 2 * (w + d);
  let s = t * perim;
  if (s < w) return new THREE.Vector3(-w / 2 + s, 0, -d / 2);
  s -= w;
  if (s < d) return new THREE.Vector3(w / 2, 0, -d / 2 + s);
  s -= d;
  if (s < w) return new THREE.Vector3(w / 2 - s, 0, d / 2);
  s -= w;
  return new THREE.Vector3(-w / 2, 0, d / 2 - s);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LivingCircuitBoard({
  fixed = true,
  className = '',
  style = {},
  boardLabel = 'FUSION BOARD v3.0',
  engineLabel = 'AI_ENGINE',
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionScale = reducedMotion ? 0.18 : 1;

    const perfScale = mount.clientWidth < 700 ? 0.6 : 1;
    const pixelRatioCap = mount.clientWidth < 700 ? 1.5 : 2;

    // ---- core three.js setup ----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.bg);
    scene.fog = new THREE.FogExp2(COLORS.bg, 0.032);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 22, 0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    function resize() {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    // ---- lights ----
    scene.add(new THREE.AmbientLight(0x335544, 0.55));
    const key = new THREE.DirectionalLight(0x88ffe0, 0.35);
    key.position.set(6, 20, 8);
    scene.add(key);

    const glowTexture = makeGlowTexture();

    // ---- board ----
    const boardW = 26;
    const boardD = 15;
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(boardW, 0.4, boardD),
      new THREE.MeshStandardMaterial({ color: COLORS.pcb, roughness: 0.75, metalness: 0.15 })
    );
    board.position.y = -0.2;
    scene.add(board);

    const silkscreen = new THREE.Mesh(
      new THREE.PlaneGeometry(boardW, boardD),
      new THREE.MeshBasicMaterial({
        map: buildSilkscreenTexture({ boardLabel, engineLabel }),
        transparent: false,
      })
    );
    silkscreen.rotation.x = -Math.PI / 2;
    silkscreen.position.y = 0.001;
    scene.add(silkscreen);

    // ---- power traces (gold, broad slow "current" pulse) ----
    const powerSource = new THREE.Vector3(-boardW / 2 + 0.5, 0, 0);
    const chipSpecs = [
      { x: -7, z: -3.5, w: 1.6, d: 1.0, freq: 0.18 },
      { x: -5, z: 4.2, w: 1.2, d: 1.2, freq: 0.22 },
      { x: 6.5, z: -4, w: 1.8, d: 0.9, freq: 0.15 },
      { x: 7.5, z: 3.8, w: 1.0, d: 1.0, freq: 0.28 },
      { x: 2, z: 6.0, w: 1.4, d: 0.8, freq: 0.2 },
    ];

    const tracesGroup = new THREE.Group();
    scene.add(tracesGroup);
    const activeTraces = [];

    chipSpecs.forEach((c) => {
      const pts = orthogonalPath(powerSource, new THREE.Vector3(c.x, 0, c.z), 4);
      const built = buildTraceMeshes(pts, COLORS.traceGold, { baseEmissive: 0.1 });
      tracesGroup.add(built.group);
      activeTraces.push({
        ...built,
        kind: 'power',
        speed: 0.1 + Math.random() * 0.04,
        phase: Math.random(),
        bandWidth: 0.2,
        baseEmissive: 0.1,
        peakEmissive: 1.1,
      });
    });

    // ---- data traces (cyan, fast tight "packet" pulse + a traveling dot) ----
    const hexOuterRadius = 2.6;
    const dataEdgeCount = Math.max(6, Math.round(13 * perfScale));
    for (let i = 0; i < dataEdgeCount; i++) {
      const edgePoint = perimeterPoint((i + 0.5) / dataEdgeCount, boardW - 1.5, boardD - 1.5);
      const dirToOrigin = edgePoint.clone().normalize();
      const endPoint = dirToOrigin.multiplyScalar(hexOuterRadius);
      const pts = orthogonalPath(edgePoint, endPoint, 3);
      const built = buildTraceMeshes(pts, COLORS.traceBlue, { width: 0.07, baseEmissive: 0.07 });
      tracesGroup.add(built.group);

      const beamGlow = makeGlowSprite(glowTexture, COLORS.traceBlue, 0.45, 0.85);
      const beamCore = makeGlowSprite(glowTexture, 0xffffff, 0.14, 0.9);
      const beamGroup = new THREE.Group();
      beamGroup.add(beamGlow);
      beamGroup.add(beamCore);
      scene.add(beamGroup);

      activeTraces.push({
        ...built,
        kind: 'data',
        speed: 0.3 + Math.random() * 0.12,
        phase: Math.random(),
        bandWidth: 0.07,
        baseEmissive: 0.07,
        peakEmissive: 1.3,
        beamGroup,
      });
    }

    // ---- decorative static stub traces (board density, no animation) ----
    const stubCount = Math.max(3, Math.round(6 * perfScale));
    for (let i = 0; i < stubCount; i++) {
      const start = perimeterPoint(Math.random(), boardW - 2, boardD - 2);
      const end = start.clone().lerp(new THREE.Vector3(0, 0, 0), 0.12 + Math.random() * 0.1);
      const pts = orthogonalPath(start, end, 2);
      const built = buildTraceMeshes(pts, COLORS.traceGold, { width: 0.06, baseEmissive: 0.16 });
      tracesGroup.add(built.group);
    }

    // ---- chips (thermal cycle: cool <-> hot) ----
    const chips = chipSpecs.map((c) => {
      const group = new THREE.Group();
      group.position.set(c.x, 0.12, c.z);
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(c.w, 0.16, c.d),
        new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.6, metalness: 0.3 })
      );
      group.add(body);
      const plateMat = new THREE.MeshStandardMaterial({
        color: 0x021018,
        emissive: COLORS.cool,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.4,
      });
      const plate = new THREE.Mesh(new THREE.BoxGeometry(c.w * 0.7, 0.04, c.d * 0.7), plateMat);
      plate.position.y = 0.1;
      group.add(plate);

      const tempSprite = makeTextSprite('30°C', '#7CFFD6', [0.9, 0.34]);
      tempSprite.position.set(0, 0.55, 0);
      group.add(tempSprite);

      scene.add(group);
      return {
        group,
        plateMat,
        tempSprite,
        position: group.position,
        freq: c.freq,
        phase: Math.random() * Math.PI * 2,
        temp: 0,
        _lastTextStep: -1,
      };
    });

    // ---- LEDs ----
    const ledSpecs = [
      { x: -10.2, z: -5.0, color: COLORS.ledYellow, mode: 'steady', label: 'PWR' },
      { x: -10.0, z: -2.0, color: COLORS.ledGreen, mode: 'blink', label: 'LINK' },
      { x: -9.6, z: 1.0, color: COLORS.ledGreen, mode: 'steady', label: null },
      { x: -10.4, z: 3.6, color: COLORS.ledRed, mode: 'blink', label: 'ERR' },
      { x: -8.8, z: -3.6, color: COLORS.ledRed, mode: 'blink', label: null },
      { x: 9.8, z: -5.4, color: COLORS.ledRed, mode: 'blink', label: 'SYS' },
      { x: 10.4, z: -1.8, color: COLORS.ledGreen, mode: 'blink', label: null },
      { x: 9.6, z: 1.6, color: COLORS.ledGreen, mode: 'steady', label: 'DATA' },
      { x: 10.6, z: 4.4, color: COLORS.ledRed, mode: 'blink', label: null },
      { x: 3.0, z: -6.6, color: COLORS.ledYellow, mode: 'blink', label: null },
      { x: -2.0, z: 6.6, color: COLORS.ledGreen, mode: 'blink', label: null },
      { x: 0.5, z: 6.0, color: COLORS.ledRed, mode: 'steady', label: null },
    ];

    const leds = ledSpecs.map((spec, i) => {
      const position = new THREE.Vector3(spec.x, 0.16, spec.z);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.color).multiplyScalar(0.4),
        emissive: spec.color,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), mat);
      mesh.position.copy(position);
      scene.add(mesh);

      const glow = makeGlowSprite(glowTexture, spec.color, 1.1, 0.5);
      glow.position.copy(position);
      glow.position.y += 0.02;
      scene.add(glow);

      let light = null;
      if (i % 3 === 0) {
        light = new THREE.PointLight(spec.color, 0.8, 4.5);
        light.position.copy(position);
        light.position.y += 0.3;
        scene.add(light);
      }

      if (spec.label) {
        const label = makeTextSprite(spec.label, '#cfead f'.replace(' f', ''), [0.85, 0.3]);
        label.position.set(position.x, 0.5, position.z - 0.55);
        scene.add(label);
      }

      return {
        material: mat,
        glow,
        light,
        mode: spec.mode,
        phase: Math.random() * Math.PI * 2,
        on: false,
        nextEvent: Math.random() * 2,
      };
    });

    // ---- central "AI engine" core ----
    const hexGeo = new THREE.ExtrudeGeometry(makeHexShape(hexOuterRadius, hexOuterRadius - 0.55), {
      depth: 0.18,
      bevelEnabled: false,
    });
    const hexMat = new THREE.MeshStandardMaterial({
      color: 0x031210,
      emissive: COLORS.coreCyan,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.4,
      side: THREE.DoubleSide,
    });
    const hexMesh = new THREE.Mesh(hexGeo, hexMat);
    hexMesh.rotation.x = -Math.PI / 2;
    hexMesh.position.y = 0.25;
    scene.add(hexMesh);

    const coreWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, 1),
      new THREE.MeshBasicMaterial({ color: COLORS.coreGreen, wireframe: true, transparent: true, opacity: 0.85 })
    );
    coreWire.position.y = 1.1;
    scene.add(coreWire);

    const innerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: COLORS.coreCyan, transparent: true, opacity: 0.5 })
    );
    innerGlow.position.y = 1.1;
    scene.add(innerGlow);

    const coreHalo = makeGlowSprite(glowTexture, COLORS.coreCyan, 6.5, 0.4);
    coreHalo.position.y = 0.3;
    scene.add(coreHalo);

    const coreLight = new THREE.PointLight(COLORS.coreCyan, 1.0, 11);
    coreLight.position.y = 1.4;
    scene.add(coreLight);

    // ---- sparks ----
    let sparks = [];
    function spawnSpark(position, t) {
      const group = new THREE.Group();
      group.position.copy(position);
      const glow = makeGlowSprite(glowTexture, COLORS.spark, 0.05, 1);
      group.add(glow);
      const rays = [];
      const rayCount = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < rayCount; i++) {
        const ang = Math.random() * Math.PI * 2;
        const len = 0.22 + Math.random() * 0.32;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute(
          'position',
          new THREE.BufferAttribute(new Float32Array([0, 0, 0, Math.cos(ang) * len, 0.02, Math.sin(ang) * len]), 3)
        );
        const mat = new THREE.LineBasicMaterial({ color: COLORS.spark, transparent: true, opacity: 1 });
        group.add(new THREE.Line(geo, mat));
        rays.push(mat);
      }
      scene.add(group);
      sparks.push({ group, glow, rays, born: t });
      if (sparks.length > 14) {
        const old = sparks.shift();
        scene.remove(old.group);
        disposeObject3D(old.group);
      }
    }

    function maybeSpawnSpark(t) {
      const hotChips = chips.filter((c) => c.temp > 0.72);
      let position;
      if (hotChips.length && Math.random() < 0.6) {
        const c = hotChips[Math.floor(Math.random() * hotChips.length)];
        position = c.position.clone();
        position.x += Math.random() * 0.6 - 0.3;
        position.z += Math.random() * 0.6 - 0.3;
        position.y = 0.32;
      } else if (activeTraces.length) {
        const trace = activeTraces[Math.floor(Math.random() * activeTraces.length)];
        if (!trace.segments.length) return;
        const seg = trace.segments[Math.floor(Math.random() * trace.segments.length)];
        position = seg.mesh.position.clone();
        position.y = 0.15;
      } else {
        return;
      }
      spawnSpark(position, t);
    }

    // ---- pointer parallax ----
    const pointer = { x: 0, y: 0 };
    function onPointerMove(e) {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    }
    window.addEventListener('pointermove', onPointerMove);

    // ---- animation loop ----
    const clock = new THREE.Clock();
    let raf = 0;
    let nextSparkAt = 1;

    function animate() {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // traces: flowing current / traveling data packets
      for (const trace of activeTraces) {
        const bandPos = ((t * trace.speed * motionScale + trace.phase) % 1 + 1) % 1;
        for (const seg of trace.segments) {
          const distFrac = (seg.offsetStart + seg.length / 2) / trace.totalLength;
          let diff = Math.abs(distFrac - bandPos);
          diff = Math.min(diff, 1 - diff);
          const intensity = Math.max(0, 1 - diff / trace.bandWidth);
          seg.material.emissiveIntensity = trace.baseEmissive + intensity * (trace.peakEmissive - trace.baseEmissive);
        }
        if (trace.beamGroup) {
          const pos = sampleAlongPath(trace.points, bandPos);
          pos.y += 0.1;
          trace.beamGroup.position.copy(pos);
        }
      }

      // LEDs
      for (const led of leds) {
        if (led.mode === 'steady') {
          const pulse = 0.55 + Math.sin(t * 1.3 + led.phase) * 0.18;
          led.material.emissiveIntensity = pulse;
          led.glow.material.opacity = 0.45 * pulse;
          if (led.light) led.light.intensity = 0.8 * pulse;
        } else {
          if (t > led.nextEvent) {
            led.on = !led.on;
            led.nextEvent = led.on
              ? t + (reducedMotion ? 1.4 : 0.08 + Math.random() * 0.25)
              : t + (reducedMotion ? 2.4 : 0.4 + Math.random() * 2.6);
          }
          const target = led.on ? 1.4 : 0.12;
          led.material.emissiveIntensity += (target - led.material.emissiveIntensity) * Math.min(1, dt * 10);
          led.glow.material.opacity = Math.min(1, led.material.emissiveIntensity * 0.55);
          if (led.light) led.light.intensity = led.material.emissiveIntensity * 0.9;
        }
      }

      // chips: thermal cycle
      for (const chip of chips) {
        const cycle = (Math.sin(t * chip.freq * motionScale + chip.phase) + 1) / 2;
        chip.temp = cycle;
        const col = new THREE.Color(COLORS.cool).lerp(new THREE.Color(COLORS.hot), cycle);
        chip.plateMat.emissive.copy(col);
        chip.plateMat.emissiveIntensity = 0.25 + cycle * 0.9;
        const step = Math.floor(t * 4);
        if (step !== chip._lastTextStep) {
          chip._lastTextStep = step;
          const tempC = Math.round(28 + cycle * 54);
          updateTextSprite(chip.tempSprite, `${tempC}°C`, cycle > 0.72 ? '#ff6a3d' : '#7CFFD6');
        }
      }

      // core: breathing + slow color drift + rotation
      const breathe = (Math.sin(t * 0.8) + 1) / 2;
      const colorMix = (Math.sin(t * 0.35) + 1) / 2;
      const mixed = new THREE.Color(COLORS.coreCyan).lerp(new THREE.Color(COLORS.coreGreen), colorMix);
      hexMat.emissive.copy(mixed);
      hexMat.emissiveIntensity = 0.55 + breathe * 0.55;
      coreWire.rotation.y = t * 0.25;
      coreWire.rotation.x = t * 0.12;
      innerGlow.material.opacity = 0.35 + breathe * 0.35;
      const haloScale = 6 + breathe * 1.4;
      coreHalo.scale.set(haloScale, haloScale, 1);
      coreHalo.material.color.copy(mixed);
      coreHalo.material.opacity = 0.35 + breathe * 0.25;
      coreLight.color.copy(mixed);
      coreLight.intensity = 0.8 + breathe * 1.0;

      // sparks
      if (t > nextSparkAt) {
        if (!reducedMotion || Math.random() < 0.15) maybeSpawnSpark(t);
        nextSparkAt = t + (reducedMotion ? 5 + Math.random() * 4 : 1.1 + Math.random() * 2.2);
      }
      sparks = sparks.filter((s) => {
        const age = t - s.born;
        const duration = 0.45;
        if (age > duration) {
          scene.remove(s.group);
          disposeObject3D(s.group);
          return false;
        }
        const k = 1 - age / duration;
        s.glow.material.opacity = k;
        s.glow.scale.setScalar(0.6 + (1 - k) * 1.4);
        s.rays.forEach((m) => (m.opacity = k));
        return true;
      });

      // camera: autonomous sway + pointer parallax
      const sway = motionScale;
      camera.position.x = Math.sin(t * 0.07) * 1.4 * sway + pointer.x * 1.2 * sway;
      camera.position.y = 22 + Math.sin(t * 0.05) * 0.4 * sway;
      camera.position.z = Math.cos(t * 0.05) * 0.6 * sway + pointer.y * -1.2 * sway;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      disposeObject3D(scene);
      renderer.dispose();
    };
  }, [boardLabel, engineLabel]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        position: fixed ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        ...style
      }}
    />
  );
}
