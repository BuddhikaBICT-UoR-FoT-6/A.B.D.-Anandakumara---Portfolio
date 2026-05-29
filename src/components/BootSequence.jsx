import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LOGS = [
  { text: "> Initializing Fusion Board v2.1...", color: "#00FF41" },
  { text: "> avr-gcc 7.3.0 — Compiling sketch...", color: "#00FF41", hasProgress: true },
  { text: "> Linking .elf binary...", color: "#00FF41", hasProgress: true },
  { text: "> Flashing ATmega328P @ 16MHz...", color: "#00FF41", hasProgress: true, isDone: true },
  { text: "> [INFO] Bootloader handshake: OK", color: "#00FFFF" },
  { text: "> Loading React 18.2.0...", color: "#00FF41", hasProgress: true },
  { text: "> Mounting Spring Boot 3.2 context...", color: "#00FF41", hasProgress: true },
  { text: "> [INFO] Application context loaded in 1.2s", color: "#00FFFF" },
  { text: "> Establishing MQTT broker connection...", color: "#00FF41", hasProgress: true, isDone: true },
  { text: "> [WARN] Thermal spike on CENTRAL_HEX — monitoring", color: "#FFD700" },
  { text: "> Calibrating ESP32 GPIO array...", color: "#00FF41", hasProgress: true },
  { text: "> Loading IoT AI Engine...", color: "#00FF41", hasProgress: true, isDone: true },
  { text: "> [SYS] All modules nominal. Latency: 19ms", color: "#FFFFFF" },
  { text: "> [SYS] 0b01001011 / 75% — Systems ready", color: "#FFFFFF" },
  { text: "> ABD://ANANDAKUMARA — ONLINE", color: "#00FF41", isFinal: true },
];

export default function BootSequence({ onComplete }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const scrollRef = React.useRef(null);

  // Skip immediately if already booted this session
  useEffect(() => {
    if (sessionStorage.getItem('abd-booted')) {
      onComplete();
    }
  }, [onComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLogs, progress]);

  // Global 4.5s failsafe timer
  useEffect(() => {
    const failsafe = setTimeout(() => {
      sessionStorage.setItem('abd-booted', '1');
      onComplete();
    }, 4500);
    return () => clearTimeout(failsafe);
  }, [onComplete]);

  useEffect(() => {
    if (currentLine < BOOT_LOGS.length) {
      const log = BOOT_LOGS[currentLine];
      
      const timer = setTimeout(() => {
        setDisplayedLogs(prev => [...prev, log]);
        
        if (log.hasProgress) {
          let p = 0;
          const pInterval = setInterval(() => {
            p += Math.random() * 25 + 10;
            if (p >= 100) {
              p = 100;
              clearInterval(pInterval);
              setCurrentLine(prev => prev + 1);
            }
            setProgress(p);
          }, 40); // 40ms interval for fast progress
        } else {
          setCurrentLine(prev => prev + 1);
        }
      }, 40 + Math.random() * 30); // 40-70ms delay

      return () => {
        clearTimeout(timer);
      };
    } else {
      const finalTimer = setTimeout(() => {
        sessionStorage.setItem('abd-booted', '1');
        onComplete();
      }, 300);
      return () => clearTimeout(finalTimer);
    }
  }, [currentLine, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center font-mono p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-[#001100] border border-[#004400] p-6 rounded-lg shadow-[0_0_30px_rgba(0,68,0,0.5)] overflow-hidden">
          <div className="flex items-center gap-2 mb-4 border-b border-[#004400] pb-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5555]" />
            <div className="w-3 h-3 rounded-full bg-[#ffaa00]" />
            <div className="w-3 h-3 rounded-full bg-[#00ff41]" />
            <span className="text-[10px] text-[#004400] ml-2">SYSTEM CONSOLE - v2.1.4</span>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none !important;
            }
          `}} />

          <div 
            ref={scrollRef} 
            className="space-y-1.5 h-[400px] overflow-y-auto scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayedLogs.map((log, i) => (
              <div key={i} style={{ color: log.color, opacity: i < displayedLogs.length - 1 ? 0.6 : 1 }}>
                <span className="mr-2">{log.text}</span>
                {log.hasProgress && i === displayedLogs.length - 1 && (
                  <span className="text-[#004400]">
                    [{'█'.repeat(Math.floor(progress / 10))}{'░'.repeat(10 - Math.floor(progress / 10))}] {Math.floor(progress)}%
                    {progress === 100 && " ✓"}
                  </span>
                )}
                {log.isDone && progress === 100 && i !== displayedLogs.length - 1 && <span className="text-[#00FF41]"> ✓</span>}
              </div>
            ))}
            {currentLine < BOOT_LOGS.length && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-[#00FF41] ml-1 align-middle"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
