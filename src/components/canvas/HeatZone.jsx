import React, { useState, useEffect } from 'react';
import { usePulse } from '../../context/PulseContext';

export default function HeatZone({ top, left, size = 300 }) {
  const [intensity, setIntensity] = useState(0.2);
  const { pulseEvent } = usePulse();

  useEffect(() => {
    let frameId;
    let angle = Math.random() * Math.PI * 2;
    
    const animate = () => {
      angle += 0.01;
      const baseIntensity = 0.2 + Math.sin(angle) * 0.15;
      setIntensity(prev => Math.max(baseIntensity, prev - 0.02));
      frameId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (pulseEvent) {
      setIntensity(0.7);
    }
  }, [pulseEvent]);

  return (
    <div 
      className="absolute rounded-full pointer-events-none mix-blend-screen z-0"
      style={{
        top, left,
        width: size, height: size,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, rgba(255,80,0,${intensity}) 0%, rgba(255,80,0,0) 60%)`,
      }}
    />
  );
}
