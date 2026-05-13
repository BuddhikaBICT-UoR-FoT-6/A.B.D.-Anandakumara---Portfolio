import React from 'react';

const GlobalTraces = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, opacity: 0.7 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
        <defs>
          <filter id="trace-glow-filter">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dense Trace Network */}
        {Array.from({ length: 25 }).map((_, i) => {
          const y = (i * 100) / 25 + (Math.random() * 4);
          const startX = Math.random() * 100;
          const length = 150 + Math.random() * 400;
          const delay = Math.random() * 8;
          const duration = 3 + Math.random() * 5;
          const type = i % 3; // 0: Horizontal, 1: Angled, 2: Complex

          let d = "";
          if (type === 0) {
            d = `M ${startX} ${y}% L ${startX + length} ${y}%`;
          } else if (type === 1) {
            d = `M ${startX} ${y}% L ${startX + 50} ${y}% L ${startX + 80} ${y + 5}% L ${startX + length} ${y + 5}%`;
          } else {
            d = `M ${startX} ${y}% L ${startX + 30} ${y}% L ${startX + 40} ${y - 3}% L ${startX + 100} ${y - 3}% L ${startX + 110} ${y}% L ${startX + length} ${y}%`;
          }

          const colors = ["#ffffff", "#00A3FF", "#E0F2FF"];
          const pulseColor = colors[i % colors.length];

          return (
            <g key={i}>
              {/* Background Copper Trace */}
              <path
                d={d}
                stroke="rgba(0, 163, 255, 0.15)"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Live Electricity Pulse */}
              <path
                d={d}
                className="live-trace"
                stroke={pulseColor}
                strokeWidth="1.8"
                fill="none"
                filter="url(#trace-glow-filter)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: 0.9
                }}
              />
              {/* Component Pad */}
              <circle cx={startX} cy={`${y}%`} r="2" fill="rgba(0, 163, 255, 0.4)" />
              {i % 4 === 0 && (
                <rect x={startX + length - 2} y={`${y - 0.5}%`} width="5" height="1.5" fill="rgba(0, 163, 255, 0.4)" />
              )}
            </g>
          );
        })}

        {/* Inter-layer Connectors */}
        {Array.from({ length: 15 }).map((_, i) => {
          const x = (i * 100) / 15 + Math.random() * 3;
          const startY = Math.random() * 100;
          const length = 100 + Math.random() * 150;
          const delay = Math.random() * 10;
          
          return (
            <g key={`v-${i}`}>
              <path
                d={`M ${x}% ${startY} L ${x}% ${startY + 30} L ${x + 2}% ${startY + 50} L ${x + 2}% ${startY + length}`}
                stroke="rgba(0, 163, 255, 0.12)"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d={`M ${x}% ${startY} L ${x}% ${startY + 30} L ${x + 2}% ${startY + 50} L ${x + 2}% ${startY + length}`}
                className="live-trace"
                stroke={i % 2 === 0 ? "#00A3FF" : "#ffffff"}
                strokeWidth="1.5"
                fill="none"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: '6s',
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
