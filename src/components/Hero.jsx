import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';

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
    <div className="pcb-card" style={{
      background: 'rgba(0, 15, 5, 0.85)',
      border: '1px solid rgba(0, 255, 68, 0.2)',
      borderRadius: '8px',
      padding: '14px 16px',
      backdropFilter: 'blur(12px)',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
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
  const { personal } = usePortfolioData();
  const name = personal.fullName;

  const handleDownloadCV = (e) => {
    e.preventDefault();
    const resumeData = localStorage.getItem('resumeData');
    const resumeName = localStorage.getItem('resumeName') || 'Resume.pdf';

    if (resumeData) {
      try {
        const link = document.createElement('a');
        link.href = resumeData;
        link.download = resumeName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Download failed:', err);
      }
    } else {
      alert('No resume uploaded yet. Please upload one via the Admin Panel.');
    }
  };

  
  return (
    <section style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '100vh',
      padding: '80px 40px',
      gap: '20px',
      position: 'relative',
      zIndex: 10,
      pointerEvents: 'none'
    }} className="flex-col md:flex-row">
      <div style={{ flex: '1', maxWidth: '640px', pointerEvents: 'auto' }} className="relative">
        <div className="hero-plate relative">
          {/* Live Electricity Traces */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
            <path 
              d="M 10 10 L 100 10 L 120 30" 
              fill="none" 
              stroke="rgba(0, 255, 65, 0.2)" 
              strokeWidth="1" 
            />
            <path 
              d="M 10 10 L 100 10 L 120 30" 
              className="live-trace" 
              fill="none" 
              stroke="white" 
              strokeWidth="1.5" 
            />
            
            <path 
              d="M 580 400 L 500 400 L 480 380" 
              fill="none" 
              stroke="rgba(0, 255, 65, 0.2)" 
              strokeWidth="1" 
            />
            <path 
              d="M 580 400 L 500 400 L 480 380" 
              className="live-trace" 
              fill="none" 
              stroke="white" 
              strokeWidth="1.5" 
            />
          </svg>

          {/* Hardware Fasteners */}
          <div className="screw-head top-3 left-3 screw-blink" />
          <div className="screw-head bottom-3 right-3 screw-blink" />

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#00FF41] mb-2 emissive-pulse">
              <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
              [ ABD_CORE // SESSION_ACTIVE // AVAILABLE_FOR_OPPORTUNITIES ]
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 emissive-pulse" style={{ textShadow: '0 0 10px rgba(0, 255, 65, 0.3), 0 0 20px black' }}>
              {name.split(" ").map((word, wi) => (
                <span key={wi} className="inline-block whitespace-nowrap mr-4">
                  {word.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (wi * 10 + i) * 0.03, duration: 0.5 }}
                      className="inline-block hover:text-[#00FF41] transition-colors cursor-default"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            <TypewriterRole />

            <p className="emissive-pulse" style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              color: '#E0FFEA',
              lineHeight: '1.8',
              maxWidth: '520px',
              marginTop: '16px',
              textShadow: '0 0 10px black, 0 0 4px black'
            }}>
              {personal.heroSubtitle}
            </p>

            <div className="flex gap-6 pt-6">
              <motion.a 
                href="#projects" 
                className="btn-solid px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 group-hover:text-black transition-colors">→ EXPLORE_SYSTEMS</span>
              </motion.a>
              
              <motion.a 
                href="#" 
                onClick={handleDownloadCV}
                className="btn-solid btn-secondary-solid px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 group-hover:text-black transition-colors">↓ DOWNLOAD_CV_MANIFEST</span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        width: '260px',
        flexShrink: 0,
        pointerEvents: 'auto'
      }} className="flex flex-col items-center md:items-end w-full gap-4">
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
