// ABD_CORE // SESSION_SYNC_v1.0.1
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
      let type = 'nucleus';
      if (i > 10) type = 'orbit1';
      if (i > 33) type = 'orbit2';
      if (i > 56) type = 'orbit3';

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
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

    const handleMouseDown = (e) => {
      // Shatter effect: push particles away from click
      pts.forEach(p => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 15.0 / (dist * 0.02 + 1); // Inverse distance force
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      });
      
      // Global pulse event for the PCB background
      window.dispatchEvent(new CustomEvent('transmit-packet', { detail: { x: e.clientX, y: e.clientY } }));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);

    let rotation = 0;
    let dmx = mx; // Delayed mouse X (for lag/weight)
    let dmy = my; // Delayed mouse Y

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotation += 0.01;
      
      // LAG EFFECT: delayed center follows mouse with inertia
      dmx += (mx - dmx) * 0.08;
      dmy += (my - dmy) * 0.08;

      pts.forEach((p, i) => {
        p.angle += p.speed;
        let tx = dmx;
        let ty = dmy;

        const orbitWidth = 45;
        const orbitHeight = 15;

        if (p.type === 'nucleus') {
          tx = dmx + Math.cos(p.angle) * (5 + Math.sin(rotation * 2 + i) * 3);
          ty = dmy + Math.sin(p.angle) * (5 + Math.cos(rotation * 2 + i) * 3);
        } else {
          let orbitAngle = 0;
          if (p.type === 'orbit1') orbitAngle = 0;
          if (p.type === 'orbit2') orbitAngle = Math.PI / 3;
          if (p.type === 'orbit3') orbitAngle = (Math.PI / 3) * 2;

          const ex = Math.cos(p.angle) * orbitWidth;
          const ey = Math.sin(p.angle) * orbitHeight;
          const rx = ex * Math.cos(orbitAngle) - ey * Math.sin(orbitAngle);
          const ry = ex * Math.sin(orbitAngle) + ey * Math.cos(orbitAngle);

          tx = dmx + rx;
          ty = dmy + ry;
        }

        // PHYSICS LAYER
        // 1. Friction
        p.vx *= 0.92;
        p.vy *= 0.92;
        
        // 2. Gravitational pull to target (React shape)
        const springDx = tx - p.x;
        const springDy = ty - p.y;
        p.vx += springDx * 0.025;
        p.vy += springDy * 0.025;

        // 3. Move
        p.x += p.vx;
        p.y += p.vy;

        // DRAW LAYER
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      requestAnimationFrame(loop);
    };

    const animFrame = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
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
    <div className="app-container">
      {booting ? (
        <BootSequence onComplete={handleBootComplete} />
      ) : (
        <>
          {webglOk && showCanvas && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <PCBScene />
              </Canvas>
            </div>
          )}
          {showCanvas && <SwarmCanvas />}
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <NavBar />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </div>
        </>
      )}

      {(!webglOk || !showCanvas) && !booting && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: '#000d1a' }} />
      )}

      <AdminLogin />
    </div>
  );
}

export default App;
