import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import PCBScene from './three/PCBScene';
import AdminLogin from './components/AdminLogin';
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
    
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    const PARTICLE_COUNT = 80;
    const pts = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      // Assign particles to different parts of the React icon
      // 0-10: Nucleus, 11-33: Orbit 1, 34-56: Orbit 2, 57-79: Orbit 3
      let type = 'nucleus';
      if (i > 10) type = 'orbit1';
      if (i > 33) type = 'orbit2';
      if (i > 56) type = 'orbit3';

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        type,
        angle: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
        size: 1.2 + Math.random() * 1.5,
        color: SWARM_COLORS[i % SWARM_COLORS.length]
      };
    });

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let rotation = 0;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotation += 0.01;

      pts.forEach((p, i) => {
        p.angle += p.speed;
        let tx = mx;
        let ty = my;

        const orbitWidth = 45;
        const orbitHeight = 15;

        if (p.type === 'nucleus') {
          // Small tight cluster in center
          tx = mx + Math.cos(p.angle) * (5 + Math.sin(rotation * 2 + i) * 3);
          ty = my + Math.sin(p.angle) * (5 + Math.cos(rotation * 2 + i) * 3);
        } else {
          // React Orbits (Ellipses)
          let orbitAngle = 0;
          if (p.type === 'orbit1') orbitAngle = 0;
          if (p.type === 'orbit2') orbitAngle = Math.PI / 3;
          if (p.type === 'orbit3') orbitAngle = (Math.PI / 3) * 2;

          // Parametric ellipse points
          const ex = Math.cos(p.angle) * orbitWidth;
          const ey = Math.sin(p.angle) * orbitHeight;

          // Rotate the ellipse
          const rx = ex * Math.cos(orbitAngle) - ey * Math.sin(orbitAngle);
          const ry = ex * Math.sin(orbitAngle) + ey * Math.cos(orbitAngle);

          tx = mx + rx;
          ty = my + ry;
        }

        // Smooth follow
        p.x += (tx - p.x) * 0.15;
        p.y += (ty - p.y) * 0.15;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        
        // Occasional connecting lines for "circuitry" look
        if (i % 8 === 0 && p.type !== 'nucleus') {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 0.2;
          ctx.globalAlpha = 0.2;
          ctx.stroke();
          ctx.globalAlpha = 1.0;
        }
      });

      requestAnimationFrame(loop);
    };

    const animFrame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
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
      <AdminLogin />
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
