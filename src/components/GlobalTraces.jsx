import React from 'react';
import { motion } from 'framer-motion';

const GlobalTraces = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
        <defs>
          <filter id="hero-glow-intense">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="particle-glow">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Particle-Injected Trace Network */}
        {Array.from({ length: 30 }).map((_, i) => {
          const y = (i * 100) / 30 + (Math.random() * 2);
          const startX = Math.random() * 100;
          const length = 12 + Math.random() * 18;
          const delay = Math.random() * 15;
          const duration = 2.5 + Math.random() * 2;
          
          const d = `M ${startX} ${y} L ${startX + length} ${y} L ${startX + length + 2} ${y + 3}`;

          return (
            <g key={i}>
              {/* Green Substrate Trace */}
              <path
                d={d}
                stroke="rgba(0, 255, 65, 0.15)"
                strokeWidth="0.6"
                fill="none"
              />
              
              {/* Intense White Pulse */}
              <path
                d={d}
                className="live-trace"
                stroke="white"
                strokeWidth="1.2"
                fill="none"
                filter="url(#hero-glow-intense)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />

              {/* Sparkling Particle Swarm */}
              {[...Array(6)].map((_, j) => {
                const pDelay = delay + (Math.random() * 0.5);
                const colors = ["#ffffff", "#00FF41", "#00A3FF", "#E0F2FF"];
                const color = colors[j % colors.length];
                const size = 0.2 + (Math.random() * 0.3);
                
                return (
                  <motion.circle
                    key={j}
                    r={size}
                    fill={color}
                    filter="url(#particle-glow)"
                    initial={{ offsetDistance: "0%", opacity: 0 }}
                    animate={{ 
                      offsetDistance: ["0%", "100%"],
                      opacity: [0, 1, 1, 0],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: duration,
                      delay: pDelay,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ 
                      offsetPath: `path('${d}')`,
                      position: 'absolute'
                    }}
                  />
                );
              })}
              
              {/* Node Vias */}
              <circle cx={startX} cy={y} r="0.4" fill="rgba(0, 255, 65, 0.4)" />
            </g>
          );
        })}

        {/* Heavy Data Bus Rails with Particles */}
        {Array.from({ length: 8 }).map((_, i) => {
          const x = (i * 100) / 8 + Math.random() * 3;
          const startY = Math.random() * 100;
          const length = 15 + Math.random() * 20;
          const delay = Math.random() * 12;
          
          const d = `M ${x} ${startY} L ${x} ${startY + 15} L ${x + 2} ${startY + 18}`;

          return (
            <g key={`v-${i}`}>
              <path
                d={d}
                stroke="rgba(0, 163, 255, 0.1)"
                strokeWidth="0.8"
                fill="none"
              />
              <path
                d={d}
                className="live-trace"
                stroke="white"
                strokeWidth="1.4"
                fill="none"
                filter="url(#hero-glow-intense)"
                style={{
                  animationDelay: `${delay}s`,
                  animationDuration: '3s',
                }}
              />
              {/* Vertical Particles */}
              {[...Array(4)].map((_, j) => (
                <motion.circle
                  key={j}
                  r={0.3}
                  fill={j % 2 === 0 ? "#00A3FF" : "#ffffff"}
                  initial={{ offsetDistance: "0%", opacity: 0 }}
                  animate={{ 
                    offsetDistance: ["0%", "100%"],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: delay + (j * 0.2),
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ offsetPath: `path('${d}')` }}
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default GlobalTraces;
