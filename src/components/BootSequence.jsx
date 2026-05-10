import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../utils/AudioManager';

const BOOT_LINES = [
  { text: '> POST: CPU OK | RAM: 8192MB | Storage: NVMe 512GB', speed: 5 },
  { text: '> Voltage rails: 3.3V ✓  5V ✓  12V ✓  -12V ✓', speed: 5 },
  { text: '> GPIO pins: 54 digital, 16 analog — initialized', speed: 5 },
  { text: '> I²C bus: scanning... 4 devices found [0x27][0x3C][0x48][0x76]', speed: 5 },
  { text: 'LOADING_BAR', label: 'Loading kernel modules', progress: 100, speed: 5 },
  { text: 'LOADING_BAR', label: 'Initializing React v18.2', progress: 100, speed: 10 },
  { text: 'LOADING_BAR', label: 'Three.js WebGL renderer', progress: 100, speed: 5 },
  { text: '> Sensor registry: 24 IoT nodes online', speed: 8 },
  { text: 'SEPARATOR', speed: 0 },
  { text: '  SYSTEM READY — A.B.D. Anandakumara', speed: 20 },
  { text: '  Launching portfolio interface...', speed: 20 },
  { text: 'SEPARATOR', speed: 0 },
];

const BootSequence = ({ onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [lines, setLines] = useState([]);
  const [isBooted, setIsBooted] = useState(false);
  const timerRef = useRef();

  useEffect(() => {
    if (sessionStorage.getItem('booted')) {
      onComplete();
      return;
    }

    if (currentLineIndex < BOOT_LINES.length) {
      const line = BOOT_LINES[currentLineIndex];
      if (line.text === 'LOADING_BAR') {
        renderLoadingBar(line);
      } else if (line.text === 'SEPARATOR') {
        setLines(prev => [...prev, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━']);
        setCurrentLineIndex(prev => prev + 1);
      } else {
        typeLine(line);
      }
    } else {
      timerRef.current = setTimeout(() => {
        setIsBooted(true);
        sessionStorage.setItem('booted', 'true');
        setTimeout(onComplete, 800);
      }, 500);
    }
    return () => clearTimeout(timerRef.current);
  }, [currentLineIndex]);

  const typeLine = (line) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= line.text.length) {
        if (i === 1) audio.unlock();
        // Play sound every 2nd char to reduce overhead
        if (i % 2 === 0) audio.playKey();
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = line.text.slice(0, i) + '█';
          return newLines;
        });
        i++;
      } else {
        clearInterval(interval);
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = line.text;
          return newLines;
        });
        setCurrentLineIndex(prev => prev + 1);
      }
    }, line.speed);
  };

  const renderLoadingBar = (line) => {
    const totalChars = 20;
    let currentChars = 0;
    const interval = setInterval(() => {
      if (currentChars <= totalChars) {
        if (currentChars % 2 === 0) audio.playKey();
        const percent = Math.floor((currentChars / totalChars) * 100);
        const bar = '█'.repeat(currentChars) + '░'.repeat(totalChars - currentChars);
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = `> ${line.label.padEnd(25)} [${bar}] ${percent}% █`;
          return newLines;
        });
        currentChars++;
      } else {
        clearInterval(interval);
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = newLines[currentLineIndex].replace(' █', ' ✓');
          return newLines;
        });
        setCurrentLineIndex(prev => prev + 1);
      }
    }, line.speed);
  };

  return (
    <AnimatePresence>
      {!isBooted && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#000800] p-8 font-mono text-[var(--terminal-green)] flex flex-col overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <div className="max-w-2xl mx-auto w-full text-[10px] sm:text-xs">
            {lines.map((line, i) => (
              <div key={i} className="mb-0.5 whitespace-pre leading-tight">
                {line}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootSequence;
