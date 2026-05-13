import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import PCBScene from './three/PCBScene';
import BootSequence from './components/BootSequence';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

const SWARM_COLORS = ['#00FF41','#66ffbb','#00ccff','#55ddff','#ffffff','#00aa33','#003399'];
const SWARM_COUNT  = 60;

function SwarmCanvas() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    let mx = canvas.width / 2;
    let my = canvas.height / 2;

    // each particle has a fixed orbit angle + radius offset so they
    // always surround the cursor, never collapse onto it
    const pts = Array.from({ length: SWARM_COUNT }, (_, i) => ({
      angle: (i / SWARM_COUNT) * Math.PI * 2,   // evenly spread around cursor
      r:     18 + Math.random() * 22,            // orbit radius 18-40px
      speed: 3.5 + Math.random() * 3.0,          // rad/s — fast spin
      x: mx, y: my,                              // current draw position
      c: SWARM_COLORS[i % SWARM_COLORS.length],
      size: 1.2 + Math.random() * 1.3,
    }));

    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    window.addEventListener('resize', () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    let prev = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of pts) {
        p.angle += p.speed * dt;   // advance orbit angle
        const tx = mx + Math.cos(p.angle) * p.r;
        const ty = my + Math.sin(p.angle) * p.r;
        // lerp toward orbit position so they snap to cursor movement
        p.x += (tx - p.x) * Math.min(dt * 14, 1);
        p.y += (ty - p.y) * Math.min(dt * 14, 1);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, []);

  return <canvas ref={canvasRef} style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:9999, pointerEvents:'none' }} />;
}

function App() {
  const [booting, setBooting] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
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
    setTimeout(() => {
      setShowCanvas(true);
    }, 100);
  };

  return (
    <div className="min-h-screen text-[var(--text-primary)] font-mono selection:bg-[#004499] selection:text-white" style={{ backgroundColor: '#000d1a' }}>
      {booting && <BootSequence onComplete={handleBootComplete} />}

      {!booting && (
        <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
          <NavBar />
          <main className="ui-layer" style={{ pointerEvents: 'none' }}>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
        </div>
      )}

      {/* Single canvas — PCB + particles together */}
      {showCanvas && webglOk && (
        <Canvas
          orthographic
          camera={{ position: [0, 0, 10], zoom: 1 }}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1, pointerEvents: 'none' }}
          gl={{ alpha: false, antialias: false, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => { gl.setClearColor('#000d1a', 1); }}
        >
          <PCBScene />
        </Canvas>
      )}

      {/* Swarm canvas — plain Canvas2D, always on top */}
      {!booting && <SwarmCanvas />}
      
      {(!webglOk || !showCanvas) && !booting && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: '#000d1a' }} />
      )}
    </div>
  );
}

export default App;
