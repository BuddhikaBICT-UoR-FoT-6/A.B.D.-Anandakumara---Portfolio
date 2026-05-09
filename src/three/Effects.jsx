import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function Effects() {
  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Bloom 
        luminanceThreshold={0.1} 
        mipmapBlur 
        intensity={1.5} 
        radius={0.4}
      />
    </EffectComposer>
  );
}
