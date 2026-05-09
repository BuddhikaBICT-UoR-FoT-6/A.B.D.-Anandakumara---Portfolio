import React, { useState, useEffect } from 'react';
import { usePulse } from '../../context/PulseContext';

export default function LEDNode({ top, left, color = '#ff8800', baseInterval = 2000 }) {
  const [lit, setLit] = useState(false);
  const { pulseEvent } = usePulse();

  useEffect(() => {
    const interval = setInterval(() => {
      setLit(true);
      setTimeout(() => setLit(false), 80 + Math.random() * 100);
    }, baseInterval + Math.random() * 1000);
    return () => clearInterval(interval);
  }, [baseInterval]);

  useEffect(() => {
    if (pulseEvent) {
      setLit(true);
      setTimeout(() => setLit(false), 200);
    }
  }, [pulseEvent]);

  return (
    <div 
      className="absolute rounded-full z-10 transition-all duration-75"
      style={{
        top, left,
        width: '4px', height: '4px',
        backgroundColor: lit ? color : '#111',
        boxShadow: lit ? `0 0 15px 3px ${color}` : 'none',
        opacity: lit ? 1 : 0.3
      }}
    />
  );
}
