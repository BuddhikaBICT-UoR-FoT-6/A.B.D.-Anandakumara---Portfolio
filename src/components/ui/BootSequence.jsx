import React, { useState, useEffect } from 'react';

export default function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Generate dynamic system stats if available
    const memory = navigator.deviceMemory ? `${navigator.deviceMemory}GB RAM` : '16GB RAM';
    const cores = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Logical Cores` : '8 Logical Cores';
    const platform = navigator.platform || 'Unknown OS';
    const date = new Date().toISOString();

    const bootSequence = [
      { text: `System Boot v3.14.159 (SMP Debian 5.10.0)`, delay: 200 },
      { text: `BIOS Date: ${date}`, delay: 400 },
      { text: `Detecting hardware... ${cores}, ${memory}`, delay: 700 },
      { text: `Platform: ${platform}`, delay: 850 },
      { text: `Mounting virtual filesystems... OK`, delay: 1100 },
      { text: `Initializing network interface (wlan0)...`, delay: 1400 },
      { text: `  -> MAC: 00:1A:2B:3C:4D:5E`, delay: 1550 },
      { text: `  -> IP: 192.168.1.104`, delay: 1650 },
      { text: `Starting IoT Sensor Daemon...`, delay: 1900 },
    ];

    // Add fast scrolling memory hex dump
    for (let i = 0; i < 20; i++) {
      const hex = Math.floor(Math.random() * 4294967295).toString(16).padStart(8, '0').toUpperCase();
      const val = Math.random().toString(36).substring(2, 10).toUpperCase();
      bootSequence.push({ text: `[0x${hex}] Loading memory block... ${val} OK`, delay: 2000 + (i * 35) });
    }

    bootSequence.push({ text: `Connecting to MQTT Broker (tcp://127.0.0.1:1883)... CONNECTED`, delay: 2900 });
    bootSequence.push({ text: `Establishing secure channel to Spring Boot API... ESTABLISHED`, delay: 3200 });
    bootSequence.push({ text: `Mounting React DOM Virtual Tree... DONE`, delay: 3500 });
    bootSequence.push({ text: `Buddhika Darshan Anandakumara OS — READY.`, delay: 3900 });
    bootSequence.push({ text: `Launching Interface...`, delay: 4300 });

    let timeouts = [];

    bootSequence.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setLines(prev => {
          // Keep only last 22 lines to prevent DOM bloat and simulate scrolling terminal
          const next = [...prev, line.text];
          return next.slice(-22);
        });
        if (index === bootSequence.length - 1) {
          setShowCursor(false);
          setTimeout(onComplete, 600); // Brief pause before dismissing the sequence
        }
      }, line.delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050a05] flex flex-col justify-end p-4 md:p-8 font-mono text-green-500 text-xs sm:text-sm lg:text-base pointer-events-auto selection:bg-green-500/30 overflow-hidden">
      {/* CRT Scanline Overlay specifically for the boot sequence */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50"></div>

      <div className="relative z-40 mb-4 max-w-4xl w-full">
        {lines.map((line, i) => (
          <div key={i} className="mb-1 leading-tight text-shadow-[0_0_8px_#00ff00]">
            {line}
          </div>
        ))}
        {showCursor && <div className="w-2.5 h-4 bg-green-500 mt-1 animate-pulse shadow-[0_0_8px_#00ff00]"></div>}
      </div>
    </div>
  );
}
