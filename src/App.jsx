import React, { useState, useEffect } from 'react';
import PCBScene from './three/PCBScene';
import BootSequence from './components/BootSequence';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import SectionDivider from './components/SectionDivider';
import { useScrollReveal } from './hooks/useScrollReveal';
import { audio } from './utils/AudioManager';

const App = () => {
  const [bootCompleted, setBootCompleted] = useState(false);
  
  useScrollReveal();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Restore hidden admin shortcut: Ctrl+Shift+A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.location.href = '/admin.html';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBootComplete = () => {
    setBootCompleted(true);
    audio.startAmbient();
  };

  return (
    <div className="relative bg-[#000800] min-h-screen text-white overflow-x-hidden">
      {/* Three.js Background Layer */}
      <PCBScene />

      {/* Boot Sequence Overlay */}
      <BootSequence onComplete={handleBootComplete} />

      {/* UI Content Layer */}
      {bootCompleted && (
        <main className="relative z-10 pointer-events-none">
          <NavBar />
          
          <div className="pointer-events-auto">
            <Hero />
            <SectionDivider />
            <About />
            <SectionDivider />
            <Projects />
            <SectionDivider />
            <Skills />
            <SectionDivider />
            <Contact />
            
            <footer className="py-12 px-8 text-center font-mono text-[10px] opacity-30">
              [SYSTEM_FOOTER] // DESIGNED_BY_ABD // 2026 // v2.6.1_FINAL
            </footer>
          </div>
        </main>
      )}

      {/* Global Terminal Overlay Effects */}
      <div className="fixed inset-0 pointer-events-none z-[60] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,100,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
};

export default App;
