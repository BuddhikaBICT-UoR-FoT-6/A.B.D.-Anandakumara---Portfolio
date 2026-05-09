import React, { useState, useEffect } from 'react';

const BOOT_LINES = [
  { text: "> Initializing hardware interface...", delay: 500 },
  { text: "> Detected: ARM Cortex-M7 @ 480MHz", delay: 900 },
  { text: "> Calibrating ADC channels [████████░░] 80%", delay: 1400 },
  { text: "> MQTT broker: connected (127.0.0.1:1883)", delay: 1900 },
  { text: "> Loading sensor registry... 24 nodes found", delay: 2200 },
  { text: "> Spring Boot API: UP (port 8080)", delay: 2800 },
  { text: "> React renderer: mounting component tree", delay: 3200 },
  { text: "> UI firmware v2.4.1 — READY", delay: 3800 }
];

export default function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);
  
  useEffect(() => {
    let timeouts = [];
    
    BOOT_LINES.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, line.text]);
        if (index === BOOT_LINES.length - 1) {
          setTimeout(onComplete, 800); // Short delay before transitioning out
        }
      }, line.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050a05] flex flex-col justify-end p-8 font-mono text-green-500 text-sm sm:text-lg lg:text-xl pointer-events-auto selection:bg-green-500/30">
      {/* CRT Scanline Overlay specifically for the boot sequence */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50"></div>
      
      <div className="relative z-40 mb-12 max-w-4xl">
        {lines.map((line, i) => (
          <div key={i} className="mb-2 animate-[typing_0.2s_steps(40,end)_forwards] overflow-hidden whitespace-nowrap">
            {line}
          </div>
        ))}
        <div className="w-3 h-5 bg-green-500 mt-2 animate-pulse inline-block shadow-[0_0_8px_#00ff00]"></div>
      </div>
    </div>
  );
}
