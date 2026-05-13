import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function Effects() {
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom 
        luminanceThreshold={0.2}    // was 0.05 — prevent "white out"
        luminanceSmoothing={0.3}
        mipmapBlur
        intensity={0.8}             // was 2.0 — subtle but high-quality glow
        radius={0.4}                // was 0.6
      />
    </EffectComposer>
  );
}
