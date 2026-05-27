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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentFull = ROLES[index];

    // Pause after full word is typed — use state so React owns the timeout
    if (isPaused) {
      const t = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2200);
      return () => clearTimeout(t);
    }

    const speed = isDeleting ? 35 : 75;

    const t = setTimeout(() => {
      if (!isDeleting && text === currentFull) {
        setIsPaused(true);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setIndex(prev => (prev + 1) % ROLES.length);
      } else {
        setText(currentFull.slice(0, isDeleting ? text.length - 1 : text.length + 1));
      }
    }, speed);

    return () => clearTimeout(t);
  }, [text, isDeleting, index, isPaused]);

  return (
    <div className="text-xl md:text-2xl text-[#00FF41] font-mono mb-4 h-8">
      {text}<span className="inline-block w-3 h-6 bg-[#00FF41] ml-1 align-middle animate-pulse" />
    </div>
  );
};

const Hero = () => {
  const { personal, about } = usePortfolioData();
  const name = personal?.fullName || '';

  const handleDownloadCV = (e) => {
    e.preventDefault();
    let cvUrl = '';
    let cvName = 'Resume.pdf';

    const localData = localStorage.getItem('resumeData');
    const localName = localStorage.getItem('resumeName');

    if (localData) {
      cvUrl = localData;
      cvName = localName || 'Resume.pdf';
    } else if (personal?.hasResume) {
      cvUrl = `Resume.pdf?v=${personal.cvVersion || '1'}`;
      cvName = personal.resumeName || 'Resume.pdf';
    }

    if (cvUrl) {
      try {
        const link = document.createElement('a');
        link.href = cvUrl;
        link.download = cvName;
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
    <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-16 gap-6 lg:gap-10 relative z-10 w-full max-w-[1400px] mx-auto pointer-events-none">
      {/* Left Column: Core Identity */}
      <div className="relative w-full lg:flex-[1.2] lg:max-w-[640px] pointer-events-auto">
        <div className="hero-plate relative overflow-hidden">
          {/* Live Electricity Traces */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
            <path d="M 10 10 L 100 10 L 120 30" fill="none" stroke="rgba(0, 255, 65, 0.2)" strokeWidth="1" />
            <path d="M 10 10 L 100 10 L 120 30" className="live-trace" fill="none" stroke="white" strokeWidth="1.5" />
            <path d="M 580 400 L 500 400 L 480 380" fill="none" stroke="rgba(0, 255, 65, 0.2)" strokeWidth="1" />
            <path d="M 580 400 L 500 400 L 480 380" className="live-trace" fill="none" stroke="white" strokeWidth="1.5" />
          </svg>

          <div className="screw-head top-3 left-3 screw-blink" />
          <div className="screw-head bottom-3 right-3 screw-blink" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#00FF41] mb-2 emissive-pulse">
              <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
              [ Available for Opportunities ]
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
                <span className="relative z-10 group-hover:text-black transition-colors">→ View Projects</span>
              </motion.a>
              
              <motion.a 
                href="#"
                onClick={handleDownloadCV}
                className="btn-solid btn-secondary-solid px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 group-hover:text-black transition-colors">↓ Download CV</span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Highlights Register */}
      <div className="flex flex-col items-start w-full lg:flex-[0.8] gap-4 text-left pointer-events-auto mt-4 lg:mt-0">
        <div className="pcb-card relative overflow-hidden w-full" style={{ background: 'rgba(0, 10, 20, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0, 255, 65, 0.2)' }}>
          <div className="relative z-10">
            <div className="text-[10px] text-[#00FF41] mb-6 border-b border-[#004400] pb-2 font-mono">
              Highlights
            </div>
            <div className="space-y-4">
              {(about?.highlights || []).map((h, i) => (
                <div key={i} className="text-xs font-mono text-[var(--terminal-yellow)] group hover:text-white transition-colors cursor-default">
                  HIGHLIGHT_{String(i+1).padStart(2, '0')}: <span className="opacity-80">{h}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-[8px] font-mono text-[#004400]">
              System Ready
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
