import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TechChip from './ui/TechChip';

const ROLES = [
  "Spring Boot Developer",
  "Embedded Systems Engineer",
  "IoT Solutions Architect",
  "Full-Stack Engineer"
];

const StatusWidget = () => {
  const [uptime, setUptime] = useState(0);
  
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setUptime(Date.now() - start);
    }, 13);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, '0');
    const minutes = Math.floor((ms / (1000 * 60)) % 60).toString().padStart(2, '0');
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
    const milliseconds = (ms % 1000).toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <div className="pcb-card bg-black/40 backdrop-blur-md border border-[#004400] p-4 rounded-lg font-mono">
      <div className="text-[10px] text-[#00FF41] mb-2 border-b border-[#004400] pb-1">
        SYS_STATUS // FUSION_CORE_v2.1
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-white/50">UPTIME</span>
          <span className="text-xs text-[#00FF41]">{formatUptime(uptime)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-white/50">CPU_TEMP</span>
          <span className="text-xs text-[#FFD700]">42.5°C</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[9px] text-white/50">BUS_VOLTAGE</span>
          <span className="text-xs text-[#00FFFF]">3.30V</span>
        </div>
        <div className="h-1 bg-[#002200] rounded-full overflow-hidden">
          <motion.div 
            animate={{ width: ["10%", "85%", "40%", "95%", "20%"] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="h-full bg-[#00FF41]" 
          />
        </div>
      </div>
    </div>
  );
};

const TypewriterRole = () => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFull = ROLES[index];
    const speed = isDeleting ? 30 : 70;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentFull) {
        setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % ROLES.length);
      } else {
        // Occasional typo logic
        const shouldTypo = !isDeleting && Math.random() < 0.05 && text.length > 2;
        if (shouldTypo) {
          setText(prev => prev + String.fromCharCode(97 + Math.floor(Math.random() * 26)));
          setTimeout(() => {
            setText(prev => prev.slice(0, -1));
          }, 300);
        } else {
          setText(currentFull.slice(0, isDeleting ? text.length - 1 : text.length + 1));
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index]);

  return (
    <div className="text-xl md:text-2xl text-[#00FF41] font-mono mb-4 h-8">
      {text}<span className="inline-block w-3 h-6 bg-[#00FF41] ml-1 align-middle animate-pulse" />
    </div>
  );
};

const Hero = () => {
  const name = "A.B.D. Anandakumara";
  
  return (
    <section className="min-h-screen pt-32 px-8 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#00FF41] mb-2">
          <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
          [ ABD_CORE // SESSION_ACTIVE ]
        </div>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8">
          {name.split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.5 }}
              className="inline-block hover:text-[#00FF41] transition-colors cursor-default"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        <TypewriterRole />

        <div className="max-w-2xl text-base md:text-lg text-white/70 leading-relaxed mb-8">
          Developing robust systems at the intersection of 
          <TechChip name="React" />, <TechChip name="Spring Boot" />, 
          and <TechChip name="Embedded Systems" />. Specialist in 
          <TechChip name="MQTT" /> protocols and <TechChip name="GPIO" /> automation.
        </div>

        <div className="flex gap-6 pt-6">
          <motion.a 
            href="#projects" 
            className="btn-terminal border border-[#00FF41] px-6 py-3 relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 text-[#00FF41] group-hover:text-black transition-colors">→ EXPLORE_SYSTEMS</span>
            <motion.div 
              className="absolute inset-0 bg-[#00FF41] translate-y-full group-hover:translate-y-0 transition-transform duration-300" 
            />
          </motion.a>
          
          <a href="/cv.pdf" className="flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-colors">
            ↓ DOWNLOAD_CV_MANIFEST
          </a>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center md:items-end w-full gap-4">
        <StatusWidget />
        <div className="text-[8px] font-mono text-[#004400] text-right">
          0x0000_BOOT_SEC_OK<br />
          0x0001_G_PARTICLES_READY<br />
          0x0002_EMISSIVE_SUBSTRATE_ON
        </div>
      </div>
    </section>
  );
};

export default Hero;
