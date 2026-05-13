import React from 'react';

const GlobalTraces = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, opacity: 0.8 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
        {/* Dynamic Trace Network */}
        {Array.from({ length: 25 }).map((_, i) => {
          const y = (i * 100) / 25 + (Math.random() * 4);
          const startX = Math.random() * 100;
          const length = 150 + Math.random() * 400;
          const delay = Math.random() * 8;
          const duration = 3; // Standardized speed
          
          const d = `M ${startX} ${y}% L ${startX + 80} ${y}% L ${startX + 110} ${y + 4}% L ${startX + length} ${y + 4}%`;

          return (
            <g key={i}>
              {/* Original Greenish Copper Trace */}
              <path
                d={d}
                stroke="rgba(0, 255, 65, 0.2)"
                strokeWidth="1"
                fill="none"
              />
              {/* Classic White Energy Pulse */}
              <path
                d={d}
                className="live-trace"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: 0.9
                }}
              />
              {/* Original Node Style */}
              <circle cx={startX} cy={`${y}%`} r="1.5" fill="rgba(0, 255, 65, 0.3)" />
            </g>
          );
        })}

        {/* Vertical Connectors */}
        {Array.from({ length: 15 }).map((_, i) => {
          const x = (i * 100) / 15 + Math.random() * 3;
          const startY = Math.random() * 100;
          const length = 100 + Math.random() * 150;
          const delay = Math.random() * 10;
          
          const d = `M ${x}% ${startY} L ${x}% ${startY + 30} L ${x + 2}% ${startY + 50} L ${x + 2}% ${startY + length}`;

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
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GlobalTraces;
