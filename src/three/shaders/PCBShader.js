import * as THREE from 'three';

export const PCBShader = {
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: null },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uImageRes: { value: new THREE.Vector2(2048, 1024) }, // Default to a common aspect
    uVignetteDarkness: { value: 0.8 },
    uTraceBoost: { value: 0.15 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform vec2 uImageRes;
    uniform float uVignetteDarkness;
    uniform float uTraceBoost;
    varying vec2 vUv;

    void main() {
      // Cover scaling logic
      vec2 s = uResolution;
      vec2 i = uImageRes;
      float rs = s.x / s.y;
      float ri = i.x / i.y;
      vec2 newUv = vUv;
      if (rs > ri) {
        newUv.y = vUv.y * (ri / rs) + (1.0 - ri / rs) * 0.5;
      } else {
        newUv.x = vUv.x * (rs / ri) + (1.0 - rs / ri) * 0.5;
      }

      vec4 texColor = texture2D(uTexture, newUv);
      
      // 1. Fiber Weave Pattern
      float weave = sin((newUv.x + newUv.y) * 80.0 + uTime * 0.2) * 0.003;
      weave += sin((newUv.x - newUv.y) * 80.0 - uTime * 0.2) * 0.003;
      
      // 2. Copper Trace Saturation Boost
      bool isGold = (texColor.r > texColor.b * 1.5 && texColor.g > texColor.b);
      if (isGold) {
        texColor.rgb += uTraceBoost;
      }

      // 3. Night-vision Vignette
      float dist = distance(vUv, vec2(0.5));
      float vignette = smoothstep(0.5, 1.2, dist);
      texColor.rgb = mix(texColor.rgb, texColor.rgb * (1.0 - uVignetteDarkness), vignette);

      // Final output darkened
      gl_FragColor = vec4(texColor.rgb * 0.25 + weave, 1.0);
    }
  `
};
