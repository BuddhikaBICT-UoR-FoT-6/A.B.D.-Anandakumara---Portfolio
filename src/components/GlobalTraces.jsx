import React from 'react';

const GlobalTraces = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
        <defs>
          <filter id="hero-glow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Hero-Grade Segmented Network */}
        {Array.from({ length: 40 }).map((_, i) => {
          const y = (i * 100) / 40 + (Math.random() * 3);
          const startX = Math.random() * 100;
          // Shorter lengths to make the 100px dash more prominent
          const length = 80 + Math.random() * 120;
          const delay = Math.random() * 15;
          const duration = 2 + Math.random() * 2;
          
          // Hero-style routing: M [x] [y] L [x+len] [y] L [x+len+20] [y+20]
          const d = `M ${startX}% ${y}% L ${startX + (length/10)}% ${y}% L ${startX + (length/10) + 2}% ${y + 3}%`;

          return (
            <g key={i}>
              {/* Background Green Trace */}
              <path
                d={d}
                stroke="rgba(0, 255, 65, 0.25)"
                strokeWidth="1"
                fill="none"
              />
              {/* High-Intensity White Pulse */}
              <path
                d={d}
                className="live-trace"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
                filter="url(#hero-glow)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  opacity: 1
                }}
              />
              {/* Hardware Via Nodes */}
              <circle cx={`${startX}%`} cy={`${y}%`} r="1.5" fill="rgba(0, 255, 65, 0.5)" />
              <circle cx={`${startX + (length/10)}%`} cy={`${y}%`} r="1.2" fill="rgba(0, 255, 65, 0.4)" />
            </g>
          );
        })}

        {/* Vertical/Angled Bus Lines */}
        {Array.from({ length: 15 }).map((_, i) => {
          const x = (i * 100) / 15 + Math.random() * 2;
          const startY = Math.random() * 100;
          const length = 50 + Math.random() * 100;
          const delay = Math.random() * 20;
          
          const d = `M ${x}% ${startY}% L ${x}% ${startY + 10}% L ${x + 2}% ${startY + 15}%`;

          return (
            <g key={`v-hero-${i}`}>
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
                filter="url(#hero-glow)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: '3s',
                  opacity: 0.9
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
