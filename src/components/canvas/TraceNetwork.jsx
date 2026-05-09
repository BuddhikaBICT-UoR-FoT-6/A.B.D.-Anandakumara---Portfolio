import React, { useMemo } from 'react';

export default function TraceNetwork() {
  const traces = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      // Create angular PCB-like paths (only 90 or 45 degree turns)
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      let path = `M ${startX}vw ${startY}vh`;
      
      let currX = startX;
      let currY = startY;
      
      for(let j=0; j<3; j++) {
        if (Math.random() > 0.5) {
          currX += (Math.random() * 20 - 10);
        } else {
          currY += (Math.random() * 20 - 10);
        }
        path += ` L ${currX}vw ${currY}vh`;
      }
      return path;
    });
  }, []);

  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-10 opacity-30">
      <defs>
        <filter id="cyanGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {traces.map((d, i) => (
        <path 
          key={i} 
          d={d} 
          fill="none" 
          stroke="#00ffcc" 
          strokeWidth="1" 
          filter="url(#cyanGlow)"
          className="animate-pulse"
          style={{ animationDuration: `${2 + Math.random() * 3}s` }}
        />
      ))}
    </svg>
  );
}
