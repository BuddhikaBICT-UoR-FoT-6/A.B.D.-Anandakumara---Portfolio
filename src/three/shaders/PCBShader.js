import * as THREE from 'three';

export const PCBShader = {
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: null },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uImageRes: { value: new THREE.Vector2(2048, 1024) },
    uVignetteDarkness: { value: 0.8 },
    uTraceBoost: { value: 0.35 },
    uWeaveIntensity: { value: 0.04 },
    uWeaveSpeed: { value: 0.15 }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldPos;
    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPos = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform vec2 uImageRes;
    uniform vec3 uClickPos;
    uniform float uClickTime;
    uniform float uVignetteDarkness;
    uniform float uTraceBoost;
    uniform float uWeaveIntensity;
    uniform float uWeaveSpeed;
    varying vec2 vUv;
    varying vec3 vWorldPos;

    void main() {
      // Proper "Cover" scaling logic
      float rs = uResolution.x / uResolution.y;
      float ri = uImageRes.x / uImageRes.y;
      vec2 newUv = vUv;
      if (rs > ri) {
        newUv.y = (vUv.y - 0.5) * (ri / rs) + 0.5;
      } else {
        newUv.x = (vUv.x - 0.5) * (rs / ri) + 0.5;
      }

      vec4 texColor = texture2D(uTexture, newUv);
      
      // 1. Enhanced Scrolling Fiber-Weave Pattern (high detail)
      float weave1 = sin((newUv.x + newUv.y) * 120.0 + uTime * uWeaveSpeed) * 0.5 + 0.5;
      float weave2 = sin((newUv.x - newUv.y) * 120.0 - uTime * uWeaveSpeed * 0.8) * 0.5 + 0.5;
      float weave3 = sin(newUv.x * 200.0 + uTime * uWeaveSpeed * 1.2) * 0.5 + 0.5;
      float weave4 = sin(newUv.y * 200.0 - uTime * uWeaveSpeed * 0.9) * 0.5 + 0.5;
      
      float weavePattern = (weave1 * weave2 + weave3 * weave4) * 0.5;
      float weaveEffect = weavePattern * uWeaveIntensity;
      
      // 2. Gold Trace Saturation Boost (enhanced detection)
      float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      bool isGold = (texColor.r > texColor.b * 1.2 && texColor.g > texColor.b * 1.1 && luminance > 0.12);
      
      if (isGold) {
        // Boost gold traces with warm glow
        texColor.rgb *= (1.0 + uTraceBoost);
        texColor.r *= 1.1;
        texColor.g *= 1.05;
        // Add subtle pulsing to traces
        float pulse = sin(uTime * 2.0) * 0.05 + 1.0;
        texColor.rgb *= pulse;
      }

      // 3. Night-vision Vignette
      float dist = distance(vUv, vec2(0.5));
      float vignette = smoothstep(0.5, 1.2, dist);
      texColor.rgb = mix(texColor.rgb, texColor.rgb * (1.0 - uVignetteDarkness), vignette);

      // Apply weave texture overlay
      texColor.rgb += weaveEffect;

      // Final output with atmospheric darkening
      gl_FragColor = vec4(texColor.rgb * 1.0, 1.0);
    }
  `
};
