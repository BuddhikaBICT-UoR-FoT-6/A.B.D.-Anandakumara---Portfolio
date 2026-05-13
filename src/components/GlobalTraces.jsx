import React from 'react';

const GlobalTraces = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1, opacity: 0.4 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="trace-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Dynamic Trace Pattern */}
        {Array.from({ length: 15 }).map((_, i) => {
          const y = (i * 100) / 15 + Math.random() * 5;
          const startX = Math.random() * 100;
          const length = 200 + Math.random() * 300;
          const delay = Math.random() * 5;
          const duration = 4 + Math.random() * 4;

          return (
            <g key={i}>
              <path
                d={`M ${startX} ${y}% L ${startX + 50} ${y}% L ${startX + 70} ${y + 5}% L ${startX + length} ${y + 5}%`}
                stroke="rgba(0, 255, 65, 0.08)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d={`M ${startX} ${y}% L ${startX + 50} ${y}% L ${startX + 70} ${y + 5}% L ${startX + length} ${y + 5}%`}
                className="live-trace"
                stroke="white"
                strokeWidth="1.2"
                fill="none"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: 0.6
                }}
              />
              <circle cx={startX} cy={`${y}%`} r="1.5" fill="rgba(0, 255, 65, 0.2)" />
            </g>
          );
        })}

        {/* Vertical Traces */}
        {Array.from({ length: 10 }).map((_, i) => {
          const x = (i * 100) / 10 + Math.random() * 5;
          const startY = Math.random() * 100;
          const length = 150 + Math.random() * 200;
          const delay = Math.random() * 5;
          
          return (
            <g key={`v-${i}`}>
              <path
                d={`M ${x}% ${startY} L ${x}% ${startY + 50} L ${x + 2}% ${startY + 70} L ${x + 2}% ${startY + length}`}
                stroke="rgba(0, 255, 65, 0.08)"
                strokeWidth="1"
                fill="none"
              />
              <path
                d={`M ${x}% ${startY} L ${x}% ${startY + 50} L ${x + 2}% ${startY + 70} L ${x + 2}% ${startY + length}`}
                className="live-trace"
                stroke="rgba(0, 163, 255, 0.3)"
                strokeWidth="1.2"
                fill="none"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: '5s',
                  opacity: 0.4
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
