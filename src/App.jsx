import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// ==========================================
// 1. UTILS & CONSTANTS
// ==========================================
const COLORS = {
  bg: '#0d021f',
  trace: 'rgba(168, 85, 247, 0.4)', // Deep Purple
  pulse: '#22d3ee', // Cyan
  glow: '#a855f7', // Purple
  gold: '#fbbf24', // Gold
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

const SystemCore = () => {
  const [cpu, setCpu] = useState(42);
  const [mem, setMem] = useState(12);
  useEffect(() => {
    const timer = setInterval(() => {
      setCpu(Math.floor(Math.random() * 40) + 30);
      setMem(Math.floor(Math.random() * 20) + 60);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-72 h-72 bg-[#0a0212] border-[8px] border-[#1a052e] rounded-xl shadow-[0_0_80px_rgba(34,211,238,0.15)] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 to-transparent pointer-events-none" />
      
      {/* Gold Pin Headers */}
      {['top', 'bottom', 'left', 'right'].map(side => (
        <div key={side} className={clsx(
          "absolute flex justify-around p-1 bg-yellow-900/20",
          side === 'top' || side === 'bottom' ? "w-full h-5 left-0 flex-row" : "h-full w-5 top-0 flex-col",
          side === 'top' ? "top-0 border-b border-yellow-700/50" : side === 'bottom' ? "bottom-0 border-t border-yellow-700/50" : side === 'left' ? "left-0 border-r border-yellow-700/50" : "right-0 border-l border-yellow-700/50"
        )}>
          {[...Array(16)].map((_, i) => (
            <div key={i} className={clsx(
              "bg-yellow-600/80 rounded-sm shadow-[0_0_5px_#fbbf24]",
              side === 'top' || side === 'bottom' ? "w-1.5 h-full" : "h-1.5 w-full"
            )} />
          ))}
        </div>
      ))}

      <div className="flex flex-col items-center gap-4 z-10 w-full px-8">
        <h2 className="text-cyan-400 font-mono text-xs tracking-[0.2em] font-bold text-center border-b border-cyan-500/30 pb-2 w-full">
          SYSTEM CORE: IOT FUSION v2.0
        </h2>
        <div className="w-full space-y-2 font-mono text-[10px]">
          <div className="flex justify-between items-center bg-black/50 p-1.5 rounded border border-purple-500/30">
            <span className="text-purple-300">CPU_LOAD</span>
            <span className="text-cyan-300 font-bold">{cpu}%</span>
          </div>
          <div className="flex justify-between items-center bg-black/50 p-1.5 rounded border border-purple-500/30">
            <span className="text-purple-300">MEM_ALLOC</span>
            <span className="text-cyan-300 font-bold">{mem}%</span>
          </div>
          <div className="flex justify-between items-center bg-black/50 p-1.5 rounded border border-purple-500/30">
            <span className="text-purple-300">CORE_TEMP</span>
            <span className="text-yellow-400 font-bold">42.1°C</span>
          </div>
        </div>
      </div>
      
      {/* Cyan Core Pulse */}
      <motion.div 
        animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full" 
      />
    </motion.div>
  );
};

const ReactProcessor = ({ x, y }) => (
  <div className="absolute w-48 h-32 bg-[#120424] border-2 border-purple-800 rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.2)] flex flex-col items-center justify-center overflow-hidden" style={{ left: x, top: y }}>
    <div className="absolute top-2 left-2 right-2 flex justify-between items-center border-b border-purple-900 pb-1">
      <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest">React UI Render Engine</span>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
      </div>
    </div>
    <motion.img 
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" 
      alt="React" className="w-12 h-12 opacity-80 mt-4 drop-shadow-[0_0_10px_#61dafb]" 
    />
    <div className="absolute bottom-2 text-[6px] font-mono text-purple-400/50 opacity-50 whitespace-pre">
      {"const UI = () => <Render />"}
    </div>
  </div>
);

const SpringBootKernel = ({ x, y }) => (
  <div className="absolute w-40 h-40 bg-[#0c1814] border-2 border-green-900 rounded-lg shadow-[0_0_30px_rgba(109,179,63,0.1)] flex flex-col items-center justify-center" style={{ left: x, top: y }}>
    <span className="absolute top-2 text-[8px] font-mono text-green-400 uppercase tracking-widest text-center">Spring Boot<br/>Kernel v1.5</span>
    <motion.img 
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 4, repeat: Infinity }}
      src="https://upload.wikimedia.org/wikipedia/commons/4/44/Spring_Framework_Logo_2018.svg" 
      alt="Spring" className="w-14 h-14 drop-shadow-[0_0_12px_#6db33f]" 
    />
    <span className="absolute bottom-3 text-[9px] font-mono text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded border border-yellow-700/50">STATE: RUNNING</span>
  </div>
);

const LabeledPort = ({ x, y, label }) => (
  <div className="absolute flex flex-col items-center gap-1" style={{ left: x, top: y }}>
    <div className="w-10 h-10 rounded-full border-4 border-zinc-700 bg-black flex items-center justify-center shadow-inner">
      <div className="w-4 h-4 rounded-full bg-cyan-900/50 border border-cyan-500/50" />
    </div>
    <span className="font-mono text-[7px] text-cyan-500 tracking-wider bg-black/80 px-1 rounded">{label}</span>
  </div>
);

const PCBComponent = ({ x, y, type }) => {
  const isChip = type === 'chip';
  const isCapacitor = type === 'cap';
  const isLED = type === 'led';

  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      {isChip && (
        <div className="w-10 h-10 bg-[#0a0212] border border-purple-800 rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.5)] flex flex-wrap p-1 gap-1">
          {[...Array(9)].map((_, i) => <div key={i} className="w-2 h-2 bg-purple-900/30 rounded-[1px]" />)}
        </div>
      )}
      {isCapacitor && (
        <div className="w-3 h-8 bg-zinc-800 border-x border-zinc-600 rounded-full shadow-md relative overflow-hidden">
          <div className="absolute bottom-0 w-full bg-purple-600/50" style={{ height: `${Math.random() * 100}%` }} />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-yellow-600 rounded-sm" />
        </div>
      )}
      {isLED && (
        <motion.div 
          animate={{ 
            backgroundColor: [ "rgba(34, 211, 238, 0.2)", "rgba(34, 211, 238, 0.9)", "rgba(34, 211, 238, 0.2)" ],
            boxShadow: [ "0 0 0px #22d3ee", "0 0 12px #22d3ee", "0 0 0px #22d3ee" ]
          }}
          transition={{ duration: Math.random() * 2 + 0.5, repeat: Infinity, delay: Math.random() }}
          className="w-1.5 h-1.5 rounded-sm"
        />
      )}
    </div>
  );
};

const IoTIndicator = ({ x, y, label, isStatic, staticVal, type = 'cyan' }) => {
  const [value, setValue] = useState(0);
  
  useEffect(() => {
    if (isStatic) return;
    const timer = setInterval(() => {
      setValue(Math.floor(Math.random() * 100));
    }, 1500 + Math.random() * 1000);
    return () => clearInterval(timer);
  }, [isStatic]);

  const colorClass = type === 'cyan' ? 'text-cyan-400' : type === 'gold' ? 'text-yellow-400' : 'text-purple-400';

  return (
    <div className="absolute font-mono text-[8px] bg-black/60 border border-purple-500/30 p-1 rounded backdrop-blur-sm" style={{ left: x, top: y }}>
      <span className="block opacity-70 text-zinc-400 mb-0.5">{label}</span>
      <span className={`${colorClass} font-bold`}>
        {isStatic ? staticVal : `${value}%`} {!isStatic && <span className="animate-pulse">_</span>}
      </span>
    </div>
  );
};

const HoverModule = ({ isReady }) => (
  <motion.div 
    animate={{ boxShadow: isReady ? "0 0 40px rgba(34,211,238,0.3)" : "0 0 20px rgba(168,85,247,0.1)" }}
    className="p-6 bg-[#0a0212]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl w-full max-w-sm relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-2">
      <div className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${isReady ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-purple-500/20 text-purple-400 border border-purple-500/50'}`}>
        HOVER MODULE: {isReady ? 'READY' : 'STANDBY'}
      </div>
    </div>
    <h3 className="text-cyan-400 font-mono text-xs tracking-widest uppercase mb-4 mt-2 border-b border-cyan-900 pb-2">User Profile Data</h3>
    <ul className="space-y-3 text-zinc-300 text-sm font-mono">
      <li className="flex items-start gap-3">
        <span className="text-cyan-500 mt-0.5">›</span>
        <span>B.Sc. BICT (Hons) Undergraduate</span>
      </li>
      <li className="flex items-start gap-3">
        <span className="text-cyan-500 mt-0.5">›</span>
        <span>IoT & Full-Stack Architect</span>
      </li>
      <li className="flex items-start gap-3">
        <span className="text-cyan-500 mt-0.5">›</span>
        <span>Oracle Certified Foundations</span>
      </li>
    </ul>
  </motion.div>
);

const AboutSection = () => (
  <section id="about" className="py-24 relative z-10">
    <div className="container mx-auto px-6">
      <div className="mb-12">
        <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase mb-2 block">Who I Am</span>
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-100">About</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-[#0a0212]/80 backdrop-blur-md border border-purple-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
          <h3 className="text-2xl font-bold text-purple-400 mb-4">Profile</h3>
          <p className="text-zinc-400 leading-relaxed mb-4">
            I am a Full-Stack Software Engineer and BICT undergraduate specializing in building scalable,
            AI-integrated applications. From architecting agentic IoT smart environments to developing semantic
            search engines, I bridge the gap between robust backend systems (Java/Spring Boot, Node.js) and
            intuitive, modern frontends (React, Flutter).
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Driven by a passion for clean code and cloud-ready infrastructure (GCP, Oracle Cloud), I thrive on
            solving complex system architecture challenges. I am currently seeking software engineering internships
            where I can contribute to high-impact projects.
          </p>
        </div>
        <div className="bg-[#0a0212]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-8 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
          <h3 className="text-2xl font-bold text-cyan-400 mb-4">Highlights</h3>
          <ul className="space-y-3 text-zinc-300 font-mono text-sm">
            <li className="flex items-center gap-3"><span className="text-cyan-500">›</span> Final Year BICT at University of Ruhuna</li>
            <li className="flex items-center gap-3"><span className="text-cyan-500">›</span> Oracle Certified Foundations Associate (OCI)</li>
            <li className="flex items-center gap-3"><span className="text-cyan-500">›</span> Built HomeCanvas (Gemini AI, ESP32, Spring Boot)</li>
            <li className="flex items-center gap-3"><span className="text-cyan-500">›</span> Built Smart Campus (Offline-first Flutter platform)</li>
            <li className="flex items-center gap-3"><span className="text-cyan-500">›</span> Deployed via GCP, Docker, Vercel & Netlify</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const ProjectsSection = () => {
  const projects = [
    { title: "HomeCanvas", type: "IoT / Web", tech: ["Java", "Spring Boot", "React.js", "ESP32"], link: "https://homecanvas99.netlify.app/", code: "https://github.com/BuddhikaBICT-UoR-FoT-6/HomeCanvas.git", desc: "An end-to-end smart home platform integrating an ESP32 micro-controller and sensor fusion for real-time home monitoring." },
    { title: "CrowdFlow", type: "Mobile", tech: ["Kotlin", "Node.js", "MongoDB", "Redis"], code: "https://github.com/BuddhikaBICT-UoR-FoT-6/CrowdFlow.git", desc: "A map-first Android platform backed by a highly scalable data pipeline, enabling users to visualize localized traffic conditions." },
    { title: "Smart Campus", type: "Mobile", tech: ["Flutter", "Dart", "Provider", "SQLite"], code: "https://github.com/BuddhikaBICT-UoR-FoT-6/smart_campus.git", desc: "A production-grade, multi-role Flutter application that digitizes and centralizes administrative and academic workflows." },
    { title: "BoutiqueFlow", type: "Web", tech: ["Angular", "Node.js", "Express", "MongoDB"], link: "https://boutiqueflow.netlify.app/#/", code: "https://github.com/BuddhikaBICT-UoR-FoT-6/BoutiqueFlow.git", desc: "A full-stack digital retail platform transitioning a physical clothing shop online with RBAC dashboards and Stripe." },
    { title: "Cypher-UI", type: "Web", tech: ["React.js", "Node.js", "MySQL"], link: "https://cipher-ui-zeta.vercel.app/", code: "https://github.com/BuddhikaBICT-UoR-FoT-6/cipher-ui.git", desc: "An educational platform bridging theoretical cryptography with hands-on implementation and real-time encryption visualizations." }
  ];

  return (
    <section id="projects" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <span className="text-purple-500 font-mono text-sm tracking-widest uppercase mb-2 block">My Work</span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100">Projects</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.div key={i} whileHover={{ y: -5, boxShadow: "0 0 30px rgba(168,85,247,0.3)" }} className="bg-[#0a0212]/80 backdrop-blur-md border border-purple-500/20 hover:border-purple-500/50 rounded-xl p-6 flex flex-col transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-purple-300">{p.title}</h3>
                <span className="text-[10px] font-mono bg-purple-900/40 text-purple-400 px-2 py-1 rounded border border-purple-500/30">{p.type}</span>
              </div>
              <p className="text-zinc-400 text-sm mb-6 flex-1">{p.desc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {p.tech.map(t => <span key={t} className="text-[10px] font-mono text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/20">{t}</span>)}
              </div>
              <div className="flex gap-4 text-sm font-mono font-bold">
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-cyan-400 transition-colors">Live ↗</a>}
                {p.code && <a href={p.code} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-cyan-400 transition-colors">Code ↗</a>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillsSection = () => {
  const skills = [
    { name: "Spring Boot / Java", pct: 88 }, { name: "React / Flutter", pct: 87 },
    { name: "Node.js / Express", pct: 88 }, { name: "JavaScript / TypeScript", pct: 90 },
    { name: "Kotlin / Android", pct: 80 }, { name: "MongoDB / MySQL", pct: 83 }
  ];

  return (
    <section id="skills" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <span className="text-cyan-500 font-mono text-sm tracking-widest uppercase mb-2 block">Toolkit</span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100">Skills & Certifications</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#0a0212]/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">Technical Expertise</h3>
            <div className="space-y-6">
              {skills.map(s => (
                <div key={s.name}>
                  <div className="flex justify-between text-sm font-mono mb-2 text-zinc-300">
                    <span>{s.name}</span>
                    <span className="text-cyan-500">{s.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${s.pct}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_10px_#22d3ee]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0a0212]/80 backdrop-blur-md border border-purple-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-purple-400 mb-6">Certifications</h3>
            <div className="space-y-4">
              <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-zinc-200">Back End Development & APIs</h4>
                  <p className="text-xs text-zinc-400 font-mono mt-1">freeCodeCamp</p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">Oct 2025</span>
              </div>
              <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-zinc-200">OCI Foundations Associate</h4>
                  <p className="text-xs text-zinc-400 font-mono mt-1">Oracle</p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">Sep 2025</span>
              </div>
              <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-zinc-200">Front End Development Libraries</h4>
                  <p className="text-xs text-zinc-400 font-mono mt-1">freeCodeCamp</p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">Sep 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => (
  <section id="contact" className="py-24 relative z-10">
    <div className="container mx-auto px-6">
      <div className="bg-[#0a0212]/90 backdrop-blur-md border-2 border-purple-500/40 rounded-2xl p-12 text-center max-w-3xl mx-auto shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <h2 className="text-4xl font-bold text-zinc-100 mb-4">Let's Talk</h2>
        <p className="text-zinc-400 mb-8 max-w-lg mx-auto">Have a project in mind or just want to say hi? My inbox is always open.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="mailto:buddhikadarshan1475@gmail.com" className="px-8 py-4 bg-purple-600 rounded-full font-bold text-lg shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:bg-purple-500 transition-colors">Say Hello</a>
          <a href="https://www.linkedin.com/in/buddhika-darshan-9b9168252/" target="_blank" rel="noreferrer" className="px-8 py-4 border border-zinc-700 rounded-full font-bold text-lg hover:bg-zinc-800 transition-colors">LinkedIn</a>
        </div>
      </div>
    </div>
  </section>
);

// ==========================================
// 3. MAIN COMPONENT
// ==========================================

export default function App() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [traces, setTraces] = useState([]);
  const [activePulses, setActivePulses] = useState([]);
  const [mouseStopped, setMouseStopped] = useState(false);
  const [pcbElements, setPcbElements] = useState([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const mouseTimerRef = useRef(null);
  const particlesRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ width: w, height: h });
      setTraces(generateTraces(80, w, h));
      
      // Generate PCB Layout Elements
      const elements = [];
      const types = ['chip', 'cap', 'led'];
      for (let i = 0; i < 40; i++) {
        elements.push({
          id: i,
          x: Math.random() * w,
          y: Math.random() * h,
          type: types[Math.floor(Math.random() * types.length)]
        });
      }
      setPcbElements(elements);

      // Init particles
      particlesRef.current = Array.from({ length: 120 }, () => ({
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
    
    const handleKeydown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.location.href = '/admin.html';
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('keydown', handleKeydown);
    };
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
      className="relative min-h-screen bg-[#0d021f] text-zinc-100 overflow-hidden cursor-crosshair select-none"
    >
      {/* BACKGROUND IMAGE LAYER */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url("/assets/deep_purple_pcb.png")`, mixBlendMode: 'screen', opacity: 0.8 }}
      />
      {/* Vapor Field */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none mix-blend-screen blur-xl" />

      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0">
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
              style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: pulse.duration, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
        {particlesRef.current.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={COLORS.pulse} opacity={p.alpha} />
        ))}
      </svg>

      {/* PCB Hardware Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-80 z-0">
        {pcbElements.map(el => (
          <PCBComponent key={el.id} {...el} />
        ))}
        
        {/* Specific Processors & Ports */}
        <ReactProcessor x="8%" y="25%" />
        <SpringBootKernel x="78%" y="60%" />
        
        <LabeledPort x="5%" y="10%" label="PRIMARY IOT IN" />
        <LabeledPort x="85%" y="15%" label="ETHERNET v6" />
        <LabeledPort x="80%" y="85%" label="GWAY ADDR" />

        {/* Dynamic IoT Indicators */}
        <IoTIndicator x="18%" y="45%" label="SENSOR_01" isStatic staticVal="22.1C" type="cyan" />
        <IoTIndicator x="25%" y="20%" label="SENSOR_02" isStatic staticVal="60% H" type="cyan" />
        <IoTIndicator x="85%" y="40%" label="V_IN" isStatic staticVal="12.01V" type="gold" />
        <IoTIndicator x="75%" y="35%" label="V_OUT" isStatic staticVal="3.30V" type="gold" />
        <IoTIndicator x="45%" y="85%" label="NET_TRAFFIC" type="cyan" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col min-h-screen">
        <nav className="flex justify-between items-center mb-24">
          <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-600 bg-clip-text text-transparent">
            Buddhika Darshan
          </motion.div>
          <div className="flex gap-8 text-sm font-mono tracking-widest text-zinc-400">
            {['About', 'Projects', 'Skills', 'Contact'].map(item => (
              <motion.a key={item} href={`#${item.toLowerCase()}`} whileHover={{ color: '#a855f7', x: 2 }} className="transition-colors">{item}</motion.a>
            ))}
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
            <SystemCore />
            <HoverModule isReady={mouseStopped} />
          </div>
        </div>

        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />

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
