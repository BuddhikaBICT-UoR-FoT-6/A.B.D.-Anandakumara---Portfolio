import React from 'react';

const GlobalTraces = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, opacity: 0.8 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-70">
        <defs>
          <filter id="hero-trace-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Hero-Grade Procedural Network */}
        {Array.from({ length: 30 }).map((_, i) => {
          const y = (i * 100) / 30 + (Math.random() * 3);
          const startX = Math.random() * 100;
          const length = 200 + Math.random() * 500;
          const delay = Math.random() * 10;
          const duration = 2.5 + Math.random() * 3;
          
          // Construct a hero-style path with 45-degree bends
          const d = `M ${startX} ${y}% L ${startX + 80} ${y}% L ${startX + 110} ${y + 4}% L ${startX + length} ${y + 4}%`;

          return (
            <g key={i}>
              {/* High-Intensity Copper Trace */}
              <path
                d={d}
                stroke="rgba(0, 163, 255, 0.25)"
                strokeWidth="2"
                fill="none"
              />
              {/* Hero-Style White Energy Pulse */}
              <path
                d={d}
                className="live-trace"
                stroke="#ffffff"
                strokeWidth="2.5"
                fill="none"
                filter="url(#hero-trace-glow)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: 1
                }}
              />
              {/* Robust Vias/Nodes */}
              <circle cx={startX} cy={`${y}%`} r="3" fill="#00FF41" className="emissive-pulse" />
              <circle cx={startX + length} cy={`${y + 4}%`} r="2.5" fill="#00A3FF" opacity="0.5" />
              
              {/* Detail Hardware */}
              {i % 5 === 0 && (
                <rect x={startX + 40} y={`${y - 0.8}%`} width="8" height="2" fill="rgba(0, 255, 65, 0.4)" />
              )}
            </g>
          );
        })}

        {/* Heavy Vertical Connectors */}
        {Array.from({ length: 15 }).map((_, i) => {
          const x = (i * 100) / 15 + Math.random() * 4;
          const startY = Math.random() * 100;
          const length = 150 + Math.random() * 250;
          const delay = Math.random() * 12;
          
          const d = `M ${x}% ${startY} L ${x}% ${startY + 60} L ${x + 3}% ${startY + 90} L ${x + 3}% ${startY + length}`;

          return (
            <g key={`v-hero-${i}`}>
              <path
                d={d}
                stroke="rgba(0, 163, 255, 0.2)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d={d}
                className="live-trace"
                stroke="#ffffff"
                strokeWidth="2.2"
                fill="none"
                filter="url(#hero-trace-glow)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: '4.5s',
                  opacity: 0.9
                }}
              />
              <circle cx={`${x}%`} cy={startY} r="3" fill="#00FF41" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GlobalTraces;
