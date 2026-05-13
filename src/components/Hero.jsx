import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { usePortfolioData } from '../hooks/usePortfolioData';

const ROLES = [
  "Full-Stack Developer",
  "IoT Engineer",
  "Backend Specialist",
  "UI/UX Architect",
  "Embedded Systems Developer"
];

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

const TraceOverlay = () => (
  <svg className="trace-pattern-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
    {/* Static Traces */}
    <path d="M 0 10 L 20 10 L 30 20 L 70 20 L 80 10 L 100 10" fill="none" stroke="#00A3FF" strokeWidth="1.2" opacity="0.6" />
    <path d="M 10 0 L 10 30 L 20 40 L 20 80 L 10 90 L 10 100" fill="none" stroke="#00A3FF" strokeWidth="1.2" opacity="0.6" />
    <path d="M 90 0 L 90 40 L 80 50 L 80 70 L 90 80 L 90 100" fill="none" stroke="#00A3FF" strokeWidth="1.2" opacity="0.6" />
    
    {/* Live Pulses */}
    <path d="M 0 10 L 20 10 L 30 20 L 70 20 L 80 10 L 100 10" className="live-trace" fill="none" stroke="#fff" strokeWidth="1.8" />
    <path d="M 10 0 L 10 30 L 20 40 L 20 80 L 10 90 L 10 100" className="live-trace" fill="none" stroke="#00A3FF" strokeWidth="1.8" style={{ animationDelay: '1.5s' }} />
    
    <circle cx="20" cy="10" r="2" fill="#00A3FF" />
    <circle cx="80" cy="10" r="2" fill="#00A3FF" />
    <circle cx="20" cy="80" r="2" fill="#00A3FF" />
    <circle cx="80" cy="70" r="2" fill="#00A3FF" />
  </svg>
);

const Hero = () => {
  const { personal, about } = usePortfolioData();
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
      gap: '40px',
      position: 'relative',
      zIndex: 10,
      pointerEvents: 'none'
    }} className="flex-col lg:flex-row">
      {/* Left Column: Core Identity */}
      <div style={{ flex: '1.2', maxWidth: '640px', pointerEvents: 'auto' }} className="relative">
        <div className="hero-plate relative overflow-hidden">
          <TraceOverlay />
          {/* Live Electricity Traces */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
            <path d="M 10 10 L 100 10 L 120 30" fill="none" stroke="rgba(0, 163, 255, 0.4)" strokeWidth="1.8" />
            <path d="M 10 10 L 100 10 L 120 30" className="live-trace" fill="none" stroke="white" strokeWidth="2.2" />
            <path d="M 580 400 L 500 400 L 480 380" fill="none" stroke="rgba(0, 163, 255, 0.4)" strokeWidth="1.8" />
            <path d="M 580 400 L 500 400 L 480 380" className="live-trace" fill="none" stroke="white" strokeWidth="2.2" />
          </svg>

          <div className="screw-head top-3 left-3 screw-blink" />
          <div className="screw-head bottom-3 right-3 screw-blink" />

          <div className="space-y-6 relative z-10">
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

      {/* Right Column: Highlights Register */}
      <div style={{ flex: '0.8', pointerEvents: 'auto' }} className="flex flex-col items-start w-full gap-4 text-left">
        <div className="pcb-card relative overflow-hidden" style={{ background: 'rgba(0, 10, 20, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0, 255, 65, 0.2)' }}>
          <TraceOverlay />
          <div className="relative z-10">
            <div className="text-[10px] text-[#00FF41] mb-6 border-b border-[#004400] pb-2 font-mono">
              // REGISTER_01 :: CORE_HIGHLIGHTS
            </div>
            <div className="space-y-4">
              {about.highlights.map((h, i) => (
                <div key={i} className="text-xs font-mono text-[var(--terminal-yellow)] group hover:text-white transition-colors cursor-default">
                  HIGHLIGHT_{String(i+1).padStart(2, '0')}: <span className="opacity-80">{h}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-[8px] font-mono text-[#004400]">
              0x0000_BOOT_SEC_OK<br />
              0x0001_G_PARTICLES_READY<br />
              0x0002_EMISSIVE_SUBSTRATE_ON
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
