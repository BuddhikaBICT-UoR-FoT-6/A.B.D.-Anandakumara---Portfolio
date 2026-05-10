import { EffectComposer, Bloom } from '@react-three/postprocessing';

export default function Effects() {
  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Bloom 
        luminanceThreshold={0.9} 
        mipmapBlur 
        intensity={0.4} 
        radius={0.2}
      />
    </EffectComposer>
  );
}
