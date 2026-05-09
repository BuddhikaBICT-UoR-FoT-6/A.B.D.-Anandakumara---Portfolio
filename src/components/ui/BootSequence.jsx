import React, { useState, useEffect } from 'react';

export default function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [showCursor, setShowCursor] = useState(true);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const bootLines = [
    '> POST: Memory subsystem OK',
    '> Voltage rails: 3.3V ✓ 5V ✓ 12V ✓',
    '> Thermal sensors: 4 zones detected',
    '> PCIe lanes: x16 @ Gen4 — locked',
    '> PWM fan controller: 6-channel initialized',
    '> RGB bus: 12 LED zones mapped',
    '> Spring Boot API: binding port 8080',
    '> React renderer: v18.2 — hot module active',
    '> [████████████] SYSTEM READY'
  ];

  useEffect(() => {
    let timeout;
    if (currentLineIndex < bootLines.length) {
      timeout = setTimeout(() => {
        setDisplayedLines(prev => [...prev, bootLines[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);
      }, 600);
    } else {
      timeout = setTimeout(onComplete, 1000);
    }
    return () => clearTimeout(timeout);
  }, [currentLineIndex, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1e24] flex items-center justify-center p-6 sm:p-12 overflow-hidden pointer-events-auto">
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)'
      }}></div>
      
      <div className="w-full max-w-3xl border border-[#ff3c00]/30 bg-[#0a0806]/90 p-8 rounded shadow-[0_0_30px_rgba(255,51,0,0.15)] relative z-10">
        <div className="flex gap-2 mb-6 border-b border-[#ff3c00]/30 pb-4">
          <div className="w-3 h-3 rounded-full bg-[#ff3300]/50"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffaa00]/50"></div>
          <div className="w-3 h-3 rounded-full bg-[#cc3300]/50"></div>
        </div>
        <div className="font-mono text-sm md:text-base space-y-2">
          {displayedLines.map((line, i) => (
            <div key={i} className="flex">
              <span className="text-[#ff4400] drop-shadow-[0_0_8px_rgba(255,68,0,0.6)]">{line}</span>
            </div>
          ))}
          {currentLineIndex < bootLines.length && (
            <div className="flex">
              <span className="text-[#ff4400] drop-shadow-[0_0_8px_rgba(255,68,0,0.6)]">{bootLines[currentLineIndex]}</span>
              <span className="w-2 h-5 bg-[#ffaa00] animate-pulse ml-1"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
