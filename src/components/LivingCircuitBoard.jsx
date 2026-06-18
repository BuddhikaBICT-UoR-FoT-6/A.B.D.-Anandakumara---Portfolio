import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* =========================================================================
   LIVING CIRCUIT BOARD — animated 3D PCB background, bird's-eye view
   -------------------------------------------------------------------------
   A real 3D scene (not a static image), viewed from directly overhead like
   the reference photo. Depth and "real PCB" feel come from actual shadow-
   mapped lighting and PBR materials, not from camera angle:
     - shadow-casting raking key light reveals real height on raised traces,
       chips and LEDs
     - PBR materials: glossy metallic copper traces, matte solder-mask
       board, plastic chip bodies — tuned roughness/metalness, not flat color
     - current "flows" through gold power traces (animated emissive pulse)
     - data packets travel along blue data traces toward a central core
     - status LEDs blink irregularly, like real activity lights
     - chips heat up and cool down on their own thermal cycle, glowing
       cooler blue -> hotter orange as they "work"
     - random electrical sparks, biased to spawn on hot chips
     - a breathing, rotating "AI engine" core at the center
     - camera is completely static and framed to perfectly fit the screen

   Drop this in once near the root of your app — it becomes the page
   background (position: fixed by default, pointer-events disabled) and
   your existing content layers on top of it exactly like it does today
   over the static image.

   npm install three
   ========================================================================= */

const COLORS = {
  bg: 0x03070a,
  pcb: 0x081a14,
  traceGold: 0xd4af5a,
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

// ---------------------------------------------------------------------------
// Procedural surface detail — tileable noise converted into a normal map,
// a roughness-variation map, and a brushed-metal grain map.
// ---------------------------------------------------------------------------

function makeTileableValueNoise(gridSize) {
  const grid = [];
  for (let y = 0; y < gridSize; y++) {
    grid.push([]);
    for (let x = 0; x < gridSize; x++) grid[y].push(Math.random());
  }
  return (u, v) => {
    const gx = u * gridSize;
    const gy = v * gridSize;
    const x0 = Math.floor(gx) % gridSize;
    const y0 = Math.floor(gy) % gridSize;
    const x1 = (x0 + 1) % gridSize;
    const y1 = (y0 + 1) % gridSize;
    const sx = gx - Math.floor(gx);
    const sy = gy - Math.floor(gy);
    const lerp = (a, b, t) => a + (b - a) * t;
    const top = lerp(grid[y0][x0], grid[y0][x1], sx);
    const bottom = lerp(grid[y1][x0], grid[y1][x1], sx);
    return lerp(top, bottom, sy);
  };
}

function buildFractalHeightField(size, octaves = [4, 8, 16, 32]) {
  const layers = octaves.map((g, i) => ({ fn: makeTileableValueNoise(g), amp: 1 / Math.pow(1.8, i) }));
  const totalAmp = layers.reduce((a, l) => a + l.amp, 0);
  const data = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      let h = 0;
      for (const layer of layers) h += layer.fn(u, v) * layer.amp;
      data[y * size + x] = h / totalAmp;
    }
  }
  return data;
}

function heightFieldToNormalCanvas(heightData, size, strength = 2.2) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  const at = (x, y) => heightData[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const nx = -dx;
      const ny = -dy;
      const nz = 1;
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
      const i = (y * size + x) * 4;
      img.data[i] = Math.round((nx / len) * 0.5 * 255 + 127.5);
      img.data[i + 1] = Math.round((ny / len) * 0.5 * 255 + 127.5);
      img.data[i + 2] = Math.round((nz / len) * 0.5 * 255 + 127.5);
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function heightFieldToGrayscaleCanvas(heightData, size, contrast = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < heightData.length; i++) {
    const v = Math.max(0, Math.min(1, 0.5 + (heightData[i] - 0.5) * contrast));
    const g = Math.round(v * 255);
    img.data[i * 4] = g;
    img.data[i * 4 + 1] = g;
    img.data[i * 4 + 2] = g;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function makeRepeatingTexture(canvas, repeatX, repeatY) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.needsUpdate = true;
  return texture;
}

function buildBrushedMetalCanvas(width = 256, height = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const streakNoise = makeTileableValueNoise(8);
  const grainNoise = makeTileableValueNoise(64);
  const img = ctx.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    const rowBrightness = 0.55 + 0.45 * streakNoise(0.5, y / height);
    for (let x = 0; x < width; x++) {
      const grain = grainNoise(x / width, y / height);
      const v = Math.max(0, Math.min(1, rowBrightness * (0.82 + 0.22 * grain)));
      const g = Math.round(v * 255);
      const i = (y * width + x) * 4;
      img.data[i] = g;
      img.data[i + 1] = g;
      img.data[i + 2] = g;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function buildSilkscreenTexture({ width = 2048, height = 1170, boardLabel, engineLabel }) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0a1f17';
  ctx.fillRect(0, 0, width, height);

  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, height * 0.15,
    width / 2, height / 2, height * 0.95
  );
  vignette.addColorStop(0, 'rgba(10,50,36,0.4)');
  vignette.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(200,170,90,0.22)';
  ctx.lineWidth = 1.6;
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

  ctx.fillStyle = 'rgba(170,200,190,0.3)';
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

  ctx.strokeStyle = 'rgba(200,170,90,0.32)';
  ctx.lineWidth = 1.3;
  for (let i = 0; i < 26; i++) {
    const w = 26 + Math.random() * 40;
    const h = 10 + Math.random() * 14;
    const x = Math.random() * (width - w);
    const y = Math.random() * (height - h);
    ctx.strokeRect(x, y, w, h);
  }

  ctx.fillStyle = 'rgba(140,255,215,0.55)';
  ctx.font = '600 30px "Courier New", monospace';
  ctx.fillText(boardLabel, 56, 64);

  ctx.fillStyle = 'rgba(140,255,215,0.36)';
  ctx.font = '500 18px "Courier New", monospace';
  ctx.fillText(engineLabel, width - 280, height - 40);

  // fine grain so the surface doesn't read as a flat vector fill
  const grainImg = ctx.getImageData(0, 0, width, height);
  for (let i = 0; i < grainImg.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    grainImg.data[i] = Math.max(0, Math.min(255, grainImg.data[i] + n));
    grainImg.data[i + 1] = Math.max(0, Math.min(255, grainImg.data[i + 1] + n));
    grainImg.data[i + 2] = Math.max(0, Math.min(255, grainImg.data[i + 2] + n));
  }
  ctx.putImageData(grainImg, 0, 0);

  // a handful of faint scratches and dust specks
  ctx.strokeStyle = 'rgba(220,235,230,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 18; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const ang = Math.random() * Math.PI * 2;
    const len = 20 + Math.random() * 70;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(230,240,235,0.18)';
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillRect(x, y, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

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

function buildTraceMeshes(
  points,
  color,
  {
    width = 0.09,
    thickness = 0.05,
    baseEmissive = 0.12,
    metalness = 0.8,
    roughness = 0.3,
    grainTexture = null,
  } = {}
) {
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
      color: new THREE.Color(color).multiplyScalar(0.45),
      emissive: new THREE.Color(color),
      emissiveIntensity: baseEmissive,
      roughness,
      metalness,
      map: grainTexture || null,
      roughnessMap: grainTexture || null,
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
    const shadowMapSize = perfScale < 1 ? 1024 : 2048;

    // ---- core three.js setup ----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.bg);
    scene.fog = new THREE.FogExp2(COLORS.bg, 0.018);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    let camHeight = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    const boardW = 26;
    const boardD = 15;

    function fitCameraToBoard() {
      const fovRad = (camera.fov * Math.PI) / 180;
      const hForDepth = boardD / (2 * Math.tan(fovRad / 2));
      const hForWidth = boardW / (2 * Math.tan(fovRad / 2) * camera.aspect);
      const fit = Math.min(hForDepth, hForWidth) * 0.92;
      camHeight = Math.max(10, Math.min(fit, 30));
    }

    function resize() {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fitCameraToBoard();
    }
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    // ---- lighting: hemisphere fill + angled, shadow-casting key light ----
    scene.add(new THREE.HemisphereLight(0x3a6a55, 0x020504, 0.45));

    const key = new THREE.DirectionalLight(0xbfe8ff, 1.05);
    key.position.set(9, 18, -7);
    key.castShadow = true;
    key.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    key.shadow.camera.left = -boardW / 2 - 2;
    key.shadow.camera.right = boardW / 2 + 2;
    key.shadow.camera.top = boardD / 2 + 2;
    key.shadow.camera.bottom = -boardD / 2 - 2;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 45;
    key.shadow.bias = -0.0015;
    key.shadow.normalBias = 0.02;
    key.shadow.camera.updateProjectionMatrix();
    scene.add(key);

    const fillLight = new THREE.DirectionalLight(0x224433, 0.3);
    fillLight.position.set(-8, 10, 8);
    scene.add(fillLight);

    const glowTexture = makeGlowTexture();

    const surfaceHeight = buildFractalHeightField(256);
    const surfaceNormalTexture = makeRepeatingTexture(heightFieldToNormalCanvas(surfaceHeight, 256), 22, 13);
    const surfaceRoughnessTexture = makeRepeatingTexture(
      heightFieldToGrayscaleCanvas(surfaceHeight, 256, 1.3),
      22,
      13
    );
    const metalGrainTexture = makeRepeatingTexture(buildBrushedMetalCanvas(), 4, 1);

    // ---- board ----
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(boardW, 0.4, boardD),
      new THREE.MeshStandardMaterial({ color: COLORS.pcb, roughness: 0.6, metalness: 0.05 })
    );
    board.position.y = -0.2;
    scene.add(board);

    const silkTexture = buildSilkscreenTexture({ boardLabel, engineLabel });
    const silkscreen = new THREE.Mesh(
      new THREE.PlaneGeometry(boardW, boardD),
      new THREE.MeshStandardMaterial({
        map: silkTexture,
        bumpMap: silkTexture,
        bumpScale: 0.012,
        normalMap: surfaceNormalTexture,
        normalScale: new THREE.Vector2(0.55, 0.55),
        roughnessMap: surfaceRoughnessTexture,
        roughness: 0.6,
        metalness: 0.06,
      })
    );
    silkscreen.rotation.x = -Math.PI / 2;
    silkscreen.position.y = 0.001;
    silkscreen.receiveShadow = true;
    scene.add(silkscreen);

    // ---- power traces ----
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
      const built = buildTraceMeshes(pts, COLORS.traceGold, {
        baseEmissive: 0.1,
        metalness: 0.85,
        roughness: 0.28,
        grainTexture: metalGrainTexture,
      });
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

    // ---- data traces ----
    const hexOuterRadius = 2.6;
    const dataEdgeCount = Math.max(6, Math.round(13 * perfScale));
    for (let i = 0; i < dataEdgeCount; i++) {
      const edgePoint = perimeterPoint((i + 0.5) / dataEdgeCount, boardW - 1.5, boardD - 1.5);
      const dirToOrigin = edgePoint.clone().normalize();
      const endPoint = dirToOrigin.multiplyScalar(hexOuterRadius);
      const pts = orthogonalPath(edgePoint, endPoint, 3);
      const built = buildTraceMeshes(pts, COLORS.traceBlue, {
        width: 0.07,
        baseEmissive: 0.07,
        metalness: 0.5,
        roughness: 0.4,
        grainTexture: metalGrainTexture,
      });
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

    // ---- decorative static stub traces ----
    const stubCount = Math.max(3, Math.round(6 * perfScale));
    for (let i = 0; i < stubCount; i++) {
      const start = perimeterPoint(Math.random(), boardW - 2, boardD - 2);
      const end = start.clone().lerp(new THREE.Vector3(0, 0, 0), 0.12 + Math.random() * 0.1);
      const pts = orthogonalPath(start, end, 2);
      const built = buildTraceMeshes(pts, COLORS.traceGold, {
        width: 0.06,
        baseEmissive: 0.16,
        metalness: 0.7,
        roughness: 0.35,
        grainTexture: metalGrainTexture,
      });
      tracesGroup.add(built.group);
    }

    // ---- chips ----
    const chips = chipSpecs.map((c) => {
      const group = new THREE.Group();
      group.position.set(c.x, 0.12, c.z);
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(c.w, 0.16, c.d),
        new THREE.MeshStandardMaterial({
          color: 0x0a0a0a,
          roughness: 0.7,
          metalness: 0.1,
          roughnessMap: surfaceRoughnessTexture,
        })
      );
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const plateMat = new THREE.MeshStandardMaterial({
        color: 0x021018,
        emissive: COLORS.cool,
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.6,
        roughnessMap: metalGrainTexture,
      });
      const plate = new THREE.Mesh(new THREE.BoxGeometry(c.w * 0.7, 0.04, c.d * 0.7), plateMat);
      plate.position.y = 0.1;
      plate.castShadow = true;
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
    const labelColor = '#bfead8';
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
        roughness: 0.2,
        metalness: 0.15,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), mat);
      mesh.position.copy(position);
      mesh.castShadow = true;
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
        const label = makeTextSprite(spec.label, labelColor, [0.85, 0.3]);
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
      metalness: 0.5,
      side: THREE.DoubleSide,
    });
    const hexMesh = new THREE.Mesh(hexGeo, hexMat);
    hexMesh.rotation.x = -Math.PI / 2;
    hexMesh.position.y = 0.25;
    hexMesh.castShadow = true;
    hexMesh.receiveShadow = true;
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
          updateTextSprite(chip.tempSprite, `${tempC}\u00b0C`, cycle > 0.72 ? '#ff6a3d' : '#7CFFD6');
        }
      }

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

      // bird's-eye camera: completely fixed overhead
      camera.position.set(0, camHeight, 0);
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

  const containerStyle = {
    position: fixed ? 'fixed' : 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: fixed ? 0 : undefined,
    pointerEvents: 'none',
    overflow: 'hidden',
    background: '#03070a',
    ...style,
  };

  return <div ref={mountRef} className={className} style={containerStyle} />;
}
