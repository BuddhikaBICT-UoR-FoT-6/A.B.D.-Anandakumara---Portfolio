import React from 'react';

const GlobalTraces = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
        {/* Global PCB Substrate Traces */}
        {Array.from({ length: 12 }).map((_, i) => {
          const y = (i * 100) / 12 + (Math.random() * 5);
          const startX = Math.random() * 20;
          const delay = Math.random() * 10;
          
          const d = `M ${startX}% ${y}% L ${startX + 40}% ${y}% L ${startX + 45}% ${y + 4}% L ${startX + 100}% ${y + 4}%`;

          return (
            <g key={i}>
              {/* Green Shadow Trace */}
              <path
                d={d}
                stroke="rgba(0, 255, 65, 0.2)"
                strokeWidth="1"
                fill="none"
              />
              {/* White Live Pulse */}
              <path
                d={d}
                className="live-trace"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: '3s',
                  opacity: 0.9
                }}
              />
              {/* Hardware Via at Nodes */}
              <circle cx={`${startX + 40}%`} cy={`${y}%`} r="1.5" fill="rgba(0, 255, 65, 0.4)" />
              <circle cx={`${startX}%`} cy={`${y}%`} r="2" fill="rgba(0, 255, 65, 0.3)" />
            </g>
          );
        })}

        {/* Heavy Vertical Power Rails */}
        {Array.from({ length: 6 }).map((_, i) => {
          const x = (i * 100) / 6 + Math.random() * 5;
          const startY = Math.random() * 20;
          const delay = Math.random() * 10;
          
          const d = `M ${x}% ${startY}% L ${x}% ${startY + 40}% L ${x + 2}% ${startY + 45}% L ${x + 2}% 100%`;

          return (
            <g key={`v-${i}`}>
              <path
                d={d}
                stroke="rgba(0, 255, 65, 0.2)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d={d}
                className="live-trace"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: '3s',
                  opacity: 0.8
                }}
              />
              <circle cx={`${x}%`} cy={`${startY + 40}%`} r="1.5" fill="rgba(0, 255, 65, 0.4)" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GlobalTraces;
