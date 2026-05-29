import React, { useState, useEffect } from 'react';
import { usePortfolioData } from '../hooks/usePortfolioData';

const DossierLine = ({ label, value }) => (
  <div className="flex gap-4 font-mono text-xs mb-2 group">
    <span className="text-[var(--pcb-green-light)]">{label.padEnd(16, '.')}</span>
    <span className="text-[var(--terminal-green)] group-hover:text-white transition-colors">{value}</span>
  </div>
);

const About = () => {
  const { about, personal } = usePortfolioData();

  const [localPhoto, setLocalPhoto] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('profilePhoto') || '';
    }
    return '';
  });

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'profilePhoto') {
        setLocalPhoto(e.newValue || '');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [imgError, setImgError] = useState(false);
  const photoVer = personal?.photoVersion || '1';
  const profileImg = localPhoto ? localPhoto : `/profile.png?v=${photoVer}`;

  return (
    <section id="about" className="content-section py-10 md:py-20 px-5 md:px-10 max-w-6xl mx-auto relative z-10">
      <div className="section-header flex items-center gap-4 mb-12">
        <h2 className="text-2xl font-mono text-[var(--terminal-green)]">
          About
        </h2>
        <div className="flex-1 h-[1px] bg-[var(--pcb-green-light)] opacity-30" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-12 items-start">
        <div className="flex flex-col items-center md:items-start">
          <div className="relative group w-40 h-40 md:w-56 md:h-56 flex-shrink-0">
            <div className="absolute -inset-4 border border-[var(--terminal-green)] opacity-20 group-hover:opacity-100 transition-opacity animate-pulse" />
            <div 
              className="w-full h-full bg-[#111] overflow-hidden"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            >
              {imgError ? (
                <div className="w-full h-full flex items-center justify-center bg-[#0a1a0a]">
                  <svg viewBox="0 0 80 80" className="w-3/4 h-3/4 opacity-40">
                    <circle cx="40" cy="28" r="16" fill="none" stroke="#00FF41" strokeWidth="2"/>
                    <path d="M10 72 Q10 52 40 52 Q70 52 70 72" fill="none" stroke="#00FF41" strokeWidth="2"/>
                    <circle cx="40" cy="28" r="6" fill="#00FF41" opacity="0.4"/>
                  </svg>
                </div>
              ) : (
                <img 
                  src={profileImg} 
                  alt="Profile" 
                  className="w-full h-full object-cover object-top"
                  onError={() => setImgError(true)}
                />
              )}
            </div>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-black px-3 py-1 border border-[var(--pcb-green-light)] text-[9px] font-mono whitespace-nowrap">
              STATUS: <span className="text-[var(--terminal-green)] animate-pulse">● OPEN_TO_WORK</span>
            </div>
          </div>
          
        </div>

        <div className="pcb-card">
          <div className="mb-6 border-b border-[var(--pcb-green-light)] pb-4">
            <h3 className="text-lg font-mono text-[var(--terminal-green)] mb-2">Profile</h3>
            <p className="text-sm opacity-70 leading-relaxed">
              {about?.profile || ''}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
