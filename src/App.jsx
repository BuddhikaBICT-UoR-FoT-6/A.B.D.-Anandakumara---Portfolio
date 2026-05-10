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

function isWebGLSupported() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

const App = () => {
  const [bootCompleted, setBootCompleted] = useState(false);
  const webglOk = isWebGLSupported();
  
  useScrollReveal();

  useEffect(() => {
    const handleKeyDown = (e) => {
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
    <>
      {webglOk ? (
        <PCBScene />
      ) : (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0,
          background: '#0a1a0a'
        }} />
      )}

      {/* Boot Sequence Overlay */}
      <BootSequence onComplete={handleBootComplete} />

      {/* UI Content Layer */}
      {bootCompleted && (
        <main className="ui-layer">
          <NavBar />
          
          <div className="pointer-events-none">
            <Hero />
            <SectionDivider />
            <About />
            <SectionDivider />
            <Projects />
            <SectionDivider />
            <Skills />
            <SectionDivider />
            <Contact />
            
            <footer className="py-12 px-8 text-center font-mono text-[10px] opacity-30 pointer-events-auto">
              [SYSTEM_FOOTER] // DESIGNED_BY_ABD // 2026 // v2.6.1_FINAL
            </footer>
          </div>
        </main>
      )}

      {/* Global Terminal Overlay Effects */}
      <div className="fixed inset-0 pointer-events-none z-[60] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,100,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
    </>
  );
};

export default App;
