import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import PCBScene from './three/PCBScene';
import BootSequence from './components/BootSequence';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

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
    <div 
      className="relative w-full min-h-screen text-[var(--text-primary)] font-mono selection:bg-[#004499] selection:text-white"
      style={{ 
        backgroundColor: '#000d1a',
        zIndex: 1,
        width: '100%',
        minHeight: '100vh'
      }}
    >
      {/* Fixed background layer */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000d1a',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />

      {booting && <BootSequence onComplete={handleBootComplete} />}

      {!booting && (
        <>
          <NavBar />
          <main className="relative z-10">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
        </>
      )}

      {/* R3F Canvas Layer - Rendered conditionally for performance */}
      {showCanvas && webglOk && (
        <div id="pcb-canvas" style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 0, 
          pointerEvents: 'auto', 
          backgroundColor: '#000d1a',
          overflow: 'hidden'
        }}>
          <Canvas 
            gl={{ 
              alpha: false, 
              antialias: false, 
              stencil: false, 
              depth: false,
              powerPreference: 'high-performance'
            }}
            style={{ 
              background: '#000d1a', 
              display: 'block',
              width: '100%',
              height: '100%'
            }}
            onCreated={(state) => {
              state.gl.setClearColor('#000d1a', 1);
            }}
          >
            <PCBScene />
          </Canvas>
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
