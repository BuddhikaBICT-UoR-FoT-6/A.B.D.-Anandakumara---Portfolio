import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../utils/AudioManager';

const BOOT_LINES = [
  { text: '> POST: CPU OK | RAM: 8192MB | Storage: NVMe 512GB', speed: 10 },
  { text: '> Voltage rails: 3.3V ✓  5V ✓  12V ✓  -12V ✓', speed: 10 },
  { text: '> GPIO pins: 54 digital, 16 analog — initialized', speed: 10 },
  { text: '> I²C bus: scanning... 4 devices found [0x27][0x3C][0x48][0x76]', speed: 10 },
  { text: '> SPI: 2 slaves detected — CS0: Flash, CS1: Display', speed: 10 },
  { text: '> UART0: 115200 baud — connected', speed: 10, delay: 400 },
  { text: 'LOADING_BAR', label: 'Loading kernel modules', progress: 100, speed: 10 },
  { text: 'LOADING_BAR', label: 'Initializing React v18.2', progress: 100, speed: 20, pause: 400 },
  { text: 'LOADING_BAR', label: 'Spring Boot API', progress: 100, speed: 30, pause: 600 },
  { text: 'LOADING_BAR', label: 'MQTT broker', progress: 100, speed: 15 },
  { text: 'LOADING_BAR', label: 'Three.js WebGL renderer', progress: 100, speed: 10 },
  { text: '> Sensor registry: 24 IoT nodes online', speed: 15 },
  { text: '> Thermal zones: calibrated', speed: 15 },
  { text: '> Particle engine: 200 agents ready', speed: 15, delay: 500 },
  { text: 'SEPARATOR', speed: 0 },
  { text: '  SYSTEM READY — A.B.D. Anandakumara', speed: 40 },
  { text: '  Launching portfolio interface...', speed: 40 },
  { text: 'SEPARATOR', speed: 0 },
];

const BootSequence = ({ onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [lines, setLines] = useState([]);
  const [isBooted, setIsBooted] = useState(false);

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
      setTimeout(() => {
        setIsBooted(true);
        sessionStorage.setItem('booted', 'true');
        setTimeout(onComplete, 1000);
      }, 800);
    }
  }, [currentLineIndex]);

  const typeLine = (line) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= line.text.length) {
        if (i === 1) audio.unlock(); // Unlock on first char
        audio.playKey(); // Play sound per char
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
        setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
        }, line.delay || 50);
      }
    }, line.speed);
  };

  const renderLoadingBar = async (line) => {
    const totalChars = 20;
    let currentChars = 0;
    
    const interval = setInterval(() => {
      if (currentChars <= totalChars) {
        audio.playKey();
        const percent = Math.floor((currentChars / totalChars) * 100);
        const bar = '█'.repeat(currentChars) + '░'.repeat(totalChars - currentChars);
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = `> ${line.label.padEnd(25)} [${bar}] ${percent}%${percent === 100 ? ' ✓' : ''} █`;
          return newLines;
        });
        
        if (line.pause && currentChars === 16) {
          clearInterval(interval);
          setTimeout(() => {
            currentChars++;
            renderLoadingBarFrom(line, 17);
          }, line.pause);
          return;
        }
        
        currentChars++;
      } else {
        clearInterval(interval);
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = newLines[currentLineIndex].replace(' █', '');
          return newLines;
        });
        setCurrentLineIndex(prev => prev + 1);
      }
    }, line.speed);
  };

  const renderLoadingBarFrom = (line, start) => {
    let currentChars = start;
    const totalChars = 20;
    const interval = setInterval(() => {
      if (currentChars <= totalChars) {
        audio.playKey();
        const percent = Math.floor((currentChars / totalChars) * 100);
        const bar = '█'.repeat(currentChars) + '░'.repeat(totalChars - currentChars);
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = `> ${line.label.padEnd(25)} [${bar}] ${percent}%${percent === 100 ? ' ✓' : ''} █`;
          return newLines;
        });
        currentChars++;
      } else {
        clearInterval(interval);
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = newLines[currentLineIndex].replace(' █', '');
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
          exit={{ 
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            transition: { duration: 0.8, ease: "circIn" }
          }}
        >
          <div className="max-w-3xl mx-auto w-full">
            {lines.map((line, i) => (
              <div key={i} className="mb-1 whitespace-pre">
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
