import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. UTILS & CONSTANTS
// ==========================================
const COLORS = {
  bg: '#02040a',
  trace: 'rgba(139, 92, 246, 0.15)', // Neon Violet
  pulse: '#ffffff',
  glow: '#a855f7', // Electric Purple
};

// Procedural Trace Generation
const generateTraces = (count, width, height) => {
  const traces = [];
  for (let i = 0; i < count; i++) {
    const x1 = Math.random() * width;
    const y1 = Math.random() * height;
    const length = 100 + Math.random() * 300;
    const angle = Math.random() > 0.5 ? 0 : 90; // Orthogonal traces
    
    const x2 = angle === 0 ? x1 + length : x1;
    const y2 = angle === 90 ? y1 + length : y1;
    
    traces.push({
      id: i,
      path: `M ${x1} ${y1} L ${x2} ${y2}`,
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
      length: length
    });
  }
  return traces;
};

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const Microprocessor = () => (
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="relative w-48 h-48 bg-zinc-900 border-4 border-zinc-800 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.2)] flex items-center justify-center overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-around py-4">
      {[...Array(6)].map((_, i) => <div key={i} className="w-4 h-1 bg-zinc-800 rounded-full" />)}
    </div>
    <div className="absolute -right-2 top-0 bottom-0 flex flex-col justify-around py-4">
      {[...Array(6)].map((_, i) => <div key={i} className="w-4 h-1 bg-zinc-800 rounded-full" />)}
    </div>
    <div className="flex flex-col items-center gap-4 z-10">
      <div className="flex gap-4">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" className="w-10 h-10 drop-shadow-[0_0_8px_#61dafb]" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Spring_Framework_Logo_2018.svg" alt="Spring" className="w-10 h-10 drop-shadow-[0_0_8px_#6db33f]" />
      </div>
      <span className="text-[10px] font-mono text-zinc-500 tracking-[0.2em] uppercase">B-CORE v4.0</span>
    </div>
    <motion.div 
      animate={{ opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute inset-0 bg-purple-500/10 blur-2xl" 
    />
  </motion.div>
);

const QuickSummary = () => (
  <motion.div 
    animate={{ boxShadow: ["0 0 20px rgba(168,85,247,0.1)", "0 0 40px rgba(168,85,247,0.3)", "0 0 20px rgba(168,85,247,0.1)"] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="p-6 bg-zinc-900/80 backdrop-blur-md border border-purple-500/30 rounded-2xl w-full max-w-sm"
  >
    <h3 className="text-purple-400 font-mono text-xs tracking-widest uppercase mb-4">System Status: Active</h3>
    <ul className="space-y-3 text-zinc-300 text-sm">
      <li className="flex items-start gap-2">
        <span className="text-purple-500 mt-1">▹</span>
        <span>4th Year BICT Honours student at University of Ruhuna</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-purple-500 mt-1">▹</span>
        <span>Specializing in IoT & Full-Stack Development</span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-purple-500 mt-1">▹</span>
        <span>OCI Certified Foundations Associate</span>
      </li>
    </ul>
  </motion.div>
);

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function App() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [traces, setTraces] = useState([]);
  const [activePulses, setActivePulses] = useState([]);
  const [mouseStopped, setMouseStopped] = useState(false);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const mouseTimerRef = useRef(null);
  const particlesRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ width: w, height: h });
      setTraces(generateTraces(60, w, h));
      
      // Init particles
      particlesRef.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      }));
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setMouseStopped(false);
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
      mouseTimerRef.current = setTimeout(() => {
        setMouseStopped(true);
      }, 150);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    let frame;
    const animate = () => {
      const { width, height } = dimensions;
      if (width === 0) return;

      particlesRef.current.forEach(p => {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (mouseStopped && dist < 300) {
          const force = (300 - dist) / 300;
          p.vx += (dx / dist) * force * 0.8;
          p.vy += (dy / dist) * force * 0.8;
        } else {
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vy += (Math.random() - 0.5) * 0.1;
        }

        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });

      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [dimensions, mouseStopped]);

  const triggerInteraction = useCallback((e) => {
    const clickX = e.clientX;
    const clickY = e.clientY;
    
    // Disperse Particles
    particlesRef.current.forEach(p => {
      const dx = p.x - clickX;
      const dy = p.y - clickY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 400) {
        const force = (400 - dist) / 40;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });

    // Surge Logic
    const nearbyTraces = traces.filter(t => {
      const d = Math.sqrt((t.x - clickX)**2 + (t.y - clickY)**2);
      return d < 400;
    }).slice(0, 10);

    const newPulses = nearbyTraces.map(t => ({
      id: Math.random(),
      path: t.path,
      length: t.length,
      duration: 0.6 + Math.random() * 0.4
    }));

    setActivePulses(prev => [...prev, ...newPulses]);
    setTimeout(() => {
      setActivePulses(prev => prev.filter(p => !newPulses.includes(p)));
    }, 1500);
  }, [traces]);

  return (
    <div 
      ref={containerRef}
      onClick={triggerInteraction}
      className="relative min-h-screen bg-[#02040a] text-zinc-100 overflow-hidden cursor-crosshair select-none"
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        {traces.map((trace) => (
          <path key={trace.id} d={trace.path} stroke={COLORS.trace} strokeWidth="1.5" fill="none" />
        ))}
        <AnimatePresence>
          {activePulses.map((pulse) => (
            <motion.path
              key={pulse.id}
              d={pulse.path}
              stroke={COLORS.pulse}
              strokeWidth="2.5"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: pulse.duration, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
        {particlesRef.current.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={COLORS.glow} opacity={p.alpha} />
        ))}
      </svg>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none contrast-150 brightness-150" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")` }} />

      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col min-h-screen">
        <nav className="flex justify-between items-center mb-24">
          <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
            Buddhika Darshan
          </motion.div>
          <div className="flex gap-8 text-sm font-mono tracking-widest text-zinc-400">
            {['About', 'Projects', 'Skills', 'Contact'].map(item => (
              <motion.a key={item} href={`#${item.toLowerCase()}`} whileHover={{ color: '#a855f7', x: 2 }} className="transition-colors">{item}</motion.a>
            ))}
            <motion.a 
              href="/admin.html" 
              whileHover={{ color: '#a855f7', x: 2 }} 
              className="text-purple-400 font-bold border-l border-zinc-800 pl-8 transition-colors"
            >
              Admin
            </motion.a>
          </div>
        </nav>

        <div className="flex-1 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                I build software that works as <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-500 to-indigo-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  good as it looks.
                </span>
              </h1>
              <p className="text-xl text-zinc-400 max-w-lg leading-relaxed">
                I'm a final-year Honours engineer turning complex architecture into 
                seamless, high-performance digital experiences.
              </p>
            </motion.div>
            <div className="flex gap-4">
              <motion.button whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(168,85,247,0.5)" }} whileTap={{ scale: 0.98 }} className="px-8 py-4 bg-purple-600 rounded-full font-bold text-lg shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
                View Projects →
              </motion.button>
              <motion.button whileHover={{ background: "rgba(255,255,255,0.05)" }} className="px-8 py-4 border border-zinc-700 rounded-full font-bold text-lg">
                Get in Touch
              </motion.button>
            </div>
          </div>
          <div className="flex flex-col items-center gap-12 lg:items-end">
            <Microprocessor />
            <QuickSummary />
          </div>
        </div>

        <div id="about" className="py-20" />
        <div id="projects" className="py-20" />
        <div id="skills" className="py-20" />
        <div id="contact" className="py-20" />

        <footer className="mt-auto pt-12 flex justify-between items-center text-[10px] font-mono text-zinc-500 tracking-[0.3em] uppercase">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
            System Operational
          </div>
          <div>© 2026 Buddhika Darshan. All Rights Reserved.</div>
        </footer>
      </div>
    </div>
  );
}
