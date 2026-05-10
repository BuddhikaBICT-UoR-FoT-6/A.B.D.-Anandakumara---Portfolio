import React, { useState, useEffect } from 'react';
import PCBScene from './three/PCBScene';
import BootSequence from './components/BootSequence';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  const [booting, setBooting] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  
  // Basic WebGL fallback check
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.warn("WebGL not supported, falling back to static background.");
        setWebglOk(false);
      }
    } catch (e) {
      console.error("WebGL check failed", e);
      setWebglOk(false);
    }
  }, []);

  const handleBootComplete = () => {
    setBooting(false);
    
    // Performance Fix: Defer PCBScene init by 100ms after boot sequence completes
    // to allow React to paint the UI first without blocking the main thread
    setTimeout(() => {
      setShowCanvas(true);
    }, 100);
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] font-mono selection:bg-[#004499] selection:text-white">
      {booting && <BootSequence onComplete={handleBootComplete} />}

      {!booting && (
        <>
          <NavBar />
          <main className="ui-layer">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </>
      )}

      {/* R3F Canvas Layer - Rendered conditionally for performance */}
      {showCanvas && webglOk && (
        <div id="pcb-canvas" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <PCBScene />
        </div>
      )}
      
      {/* Fallback flat background if WebGL fails */}
      {(!webglOk || !showCanvas) && !booting && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: '#000d1a'
        }} />
      )}
    </div>
  );
}

export default App;
