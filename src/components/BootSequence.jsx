import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audio } from '../utils/AudioManager';

const BOOT_SCRIPT = [
  { text: '> Initializing Arduino Build Environment...', color: '#88aacc' },
  { type: 'bar', label: '> avr-gcc 7.3.0 — Compiling sketch...', length: 10, totalTime: 800, color: '#88aacc' },
  { type: 'bar', label: '> Linking .elf binary...', length: 10, totalTime: 600, color: '#88aacc' },
  { type: 'bar', label: '> Flashing to ATmega328P...', length: 10, totalTime: 1200, color: '#88aacc' },
  { text: '> [INFO] Bootloader handshake: OK', color: '#44ffaa' },
  { type: 'bar', label: '> Loading React 18.2 module...', length: 10, totalTime: 900, color: '#88aacc' },
  { type: 'bar', label: '> Mounting Spring Boot context...', length: 10, totalTime: 1000, color: '#88aacc' },
  { type: 'bar', label: '> Establishing MQTT broker...', length: 10, totalTime: 700, color: '#88aacc' },
  { text: '> [WARN] High voltage detected on PIN_A3 — monitoring', color: '#ff8844' },
  { type: 'bar', label: '> Calibrating ESP32 sensor array...', length: 10, totalTime: 1100, color: '#88aacc' },
  { text: '> [SYS] All systems nominal. Ping: 19ms', color: '#44ffaa' },
  { type: 'bar', label: '> Booting portfolio instance v2.0...', length: 10, totalTime: 800, color: '#88aacc' },
  { text: '> ABD://ANANDAKUMARA — READY ✓', color: '#ffffff' }
];

const BootSequence = ({ onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [lines, setLines] = useState([]);
  const [isBooted, setIsBooted] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem('booted')) {
      onComplete();
      return;
    }

    if (currentLineIndex < BOOT_SCRIPT.length) {
      const line = BOOT_SCRIPT[currentLineIndex];
      if (line.type === 'bar') {
        renderLoadingBar(line);
      } else {
        typeLine(line);
      }
    } else {
      // Flash final line then dissolve
      setTimeout(() => {
        setIsBooted(true);
        sessionStorage.setItem('booted', 'true');
        setTimeout(onComplete, 1200); // Wait for dissolve animation
      }, 800);
    }
    
    // Auto-scroll
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentLineIndex]);

  const typeLine = (line) => {
    let i = 0;
    
    const typeNextChar = () => {
      if (i === 1) audio.unlock();
      
      if (i <= line.text.length) {
        if (i % 2 === 0) audio.playKey();
        
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = {
            text: line.text.slice(0, i) + '▌',
            color: line.color || '#88aacc',
            opacity: 1
          };
          
          // Fade older lines
          for (let j = 0; j < currentLineIndex; j++) {
            if (newLines[j]) newLines[j].opacity = 0.4;
          }
          
          return newLines;
        });
        i++;
        
        // Variable typing speed 20-80ms
        const delay = 20 + Math.random() * 60;
        setTimeout(typeNextChar, delay);
      } else {
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = {
            text: line.text,
            color: line.color || '#00ff41',
            opacity: 1
          };
          return newLines;
        });
        setCurrentLineIndex(prev => prev + 1);
      }
    };
    
    typeNextChar();
  };

  const renderLoadingBar = (line) => {
    let currentBlocks = 0;
    const intervalTime = line.totalTime / line.length;
    
    const fillNextBlock = () => {
      if (currentBlocks <= line.length) {
        audio.playKey();
        const percent = Math.floor((currentBlocks / line.length) * 100);
        const filled = '█'.repeat(currentBlocks);
        const empty = '░'.repeat(line.length - currentBlocks);
        
        setLines(prev => {
          const newLines = [...prev];
          // Use #4488ff for fill, #88ccff for percentage
          newLines[currentLineIndex] = {
            text: `${line.label.padEnd(38)} ${filled}${empty} ${percent}% ▌`,
            color: '#4488ff',
            opacity: 1
          };
          
          for (let j = 0; j < currentLineIndex; j++) {
            if (newLines[j]) newLines[j].opacity = 0.4;
          }
          
          return newLines;
        });
        currentBlocks++;
        setTimeout(fillNextBlock, intervalTime);
      } else {
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLineIndex] = {
            text: newLines[currentLineIndex].text.replace(' █', ' ✓'),
            color: '#00ff41',
            opacity: 1
          };
          return newLines;
        });
        setCurrentLineIndex(prev => prev + 1);
      }
    };
    
    fillNextBlock();
  };

  return (
    <AnimatePresence>
      {!isBooted && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#001428] p-4 sm:p-12 font-mono flex flex-col"
          exit={{ opacity: 0, y: -50, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <div 
            ref={scrollRef}
            className="w-full h-full overflow-hidden text-sm sm:text-base md:text-lg"
          >
            {lines.map((line, i) => (
              <motion.div 
                key={i} 
                className="mb-1 whitespace-pre-wrap break-all"
                style={{ color: line.color, opacity: line.opacity }}
                animate={i === lines.length - 1 && isBooted ? {
                  opacity: [1, 0, 1, 0, 1],
                  transition: { duration: 0.5 }
                } : {}}
              >
                {line.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootSequence;
