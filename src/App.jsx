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
import FloatingControls from './components/FloatingControls';

const HACKER_COLORS = ['#00FF41','#66ffbb','#00ccff','#55ddff','#ffffff','#00aa33','#003399'];
const TRANQUIL_COLORS = ['#2dd4bf','#5eead4','#38bdf8','#7dd3fc','#ffffff','#0ea5e9','#818cf8'];

function SwarmCanvas({ visible, theme }) {
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
    let scatterMode = false;

    const colors = theme === 'tranquil' ? TRANQUIL_COLORS : HACKER_COLORS;
    const speedMult = theme === 'tranquil' ? 0.5 : 1.0;

    const PARTICLE_COUNT = 80;
    const pts = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      let type = 'nucleus';
      if (i > 10) type = 'orbit1';
      if (i > 33) type = 'orbit2';
      if (i > 56) type = 'orbit3';
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0, vy: 0,
        type,
        angle: Math.random() * Math.PI * 2,
        speed: (0.02 + Math.random() * 0.03) * speedMult,
        size: 1.2 + Math.random() * 1.5,
        color: colors[i % colors.length],
      };
    });

    // ── Scatter / gather handlers ────────────────────────────
    const onScatter = () => {
      scatterMode = true;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      pts.forEach(p => {
        const dx = p.x - cx || 0.1;
        const dy = p.y - cy || 0.1;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        // Explosive burst outward from centre
        p.vx += (dx / dist) * 28 + (Math.random() - 0.5) * 18;
        p.vy += (dy / dist) * 28 + (Math.random() - 0.5) * 18;
      });
    };

    const onGather = () => {
      scatterMode = false;
      // Give a small nudge toward mouse so gather feels snappy
      pts.forEach(p => {
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        p.vx += (dx / dist) * 4;
        p.vy += (dy / dist) * 4;
      });
    };

    window.addEventListener('scatter-swarm', onScatter);
    window.addEventListener('gather-swarm', onGather);

    // ── Standard mouse handlers ──────────────────────────────
    const handleMouseMove = e => { mx = e.clientX; my = e.clientY; };

    const handleMouseDown = e => {
      pts.forEach(p => {
        const dx = p.x - e.clientX;
        const dy = p.y - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 15.0 / (dist * 0.02 + 1);
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      });
      window.dispatchEvent(new CustomEvent('transmit-packet', { detail: { x: e.clientX, y: e.clientY } }));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);

    let rotation = 0;
    let dmx = mx;
    let dmy = my;
    let animFrame;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotation += 0.01;
      dmx += (mx - dmx) * 0.08;
      dmy += (my - dmy) * 0.08;

      pts.forEach((p, i) => {
        p.angle += p.speed;

        // ── Physics ──────────────────────────────────────────
        // Friction always applied
        p.vx *= 0.92;
        p.vy *= 0.92;

        if (!scatterMode) {
          // Normal orbit spring force
          let tx = dmx;
          let ty = dmy;
          const orbitWidth = 45;
          const orbitHeight = 15;

          if (p.type === 'nucleus') {
            tx = dmx + Math.cos(p.angle) * (5 + Math.sin(rotation * 2 + i) * 3);
            ty = dmy + Math.sin(p.angle) * (5 + Math.cos(rotation * 2 + i) * 3);
          } else {
            let orbitAngle = 0;
            if (p.type === 'orbit2') orbitAngle = Math.PI / 3;
            if (p.type === 'orbit3') orbitAngle = (Math.PI / 3) * 2;
            const ex = Math.cos(p.angle) * orbitWidth;
            const ey = Math.sin(p.angle) * orbitHeight;
            tx = dmx + ex * Math.cos(orbitAngle) - ey * Math.sin(orbitAngle);
            ty = dmy + ex * Math.sin(orbitAngle) + ey * Math.cos(orbitAngle);
          }

          p.vx += (tx - p.x) * 0.025;
          p.vy += (ty - p.y) * 0.025;
        }

        p.x += p.vx;
        p.y += p.vy;

        // ── Draw ─────────────────────────────────────────────
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('scatter-swarm', onScatter);
      window.removeEventListener('gather-swarm', onGather);
      cancelAnimationFrame(animFrame);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 9999, pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}
    />
  );
}

function App() {
  const [booting, setBooting] = useState(true);
  const [showCanvas, setShowCanvas] = useState(false);
  const [webglOk, setWebglOk] = useState(true);
  const [swarmVisible, setSwarmVisible] = useState(true);
  const [theme, setTheme] = useState('hacker');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (booting) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [booting]);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) { console.warn('WebGL not supported.'); setWebglOk(false); }
    } catch (e) {
      console.error('WebGL check failed', e);
      setWebglOk(false);
    }
  }, []);

  const handleBootComplete = () => {
    setBooting(false);
    setTimeout(() => setShowCanvas(true), 100);
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

          {showCanvas && <SwarmCanvas visible={swarmVisible} theme={theme} />}

          <div style={{ position: 'relative', zIndex: 1 }}>
            <NavBar />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </div>

          <FloatingControls
            swarmVisible={swarmVisible}
            onToggleSwarm={() => setSwarmVisible(v => !v)}
            theme={theme}
            onToggleTheme={() => setTheme(t => t === 'hacker' ? 'tranquil' : 'hacker')}
          />
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
