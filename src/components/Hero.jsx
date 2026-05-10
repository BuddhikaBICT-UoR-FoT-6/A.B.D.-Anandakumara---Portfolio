import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ROLES = [
  'IoT Systems Architect',
  'React Engineer',
  'Spring Boot Developer',
  'Embedded Hardware Enthusiast'
];

const StatusWidget = () => {
  const [metrics, setMetrics] = useState({
    cpu: Array.from({ length: 20 }).map(() => Math.random() * 100),
    nodes: 24,
    latency: 12
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: [...prev.cpu.slice(1), Math.random() * 100],
        nodes: 24 + (Math.random() > 0.5 ? 1 : -1),
        latency: 10 + Math.floor(Math.random() * 10)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pcb-card bg-black/40 backdrop-blur-md border-[var(--pcb-green-light)] w-full max-w-md">
      <div className="flex justify-between items-center mb-4 border-b border-[var(--pcb-green-light)] pb-2">
        <span className="text-[10px] font-mono text-[var(--terminal-green)]">SYSTEM_STATUS // NODE_47</span>
        <div className="led-indicator bg-[var(--terminal-green)] animate-pulse" />
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span>CPU_LOAD</span>
            <span>{Math.floor(metrics.cpu[metrics.cpu.length - 1])}%</span>
          </div>
          <div className="flex items-end gap-0.5 h-8">
            {metrics.cpu.map((val, i) => (
              <div 
                key={i} 
                className="flex-1 bg-[var(--terminal-green)] opacity-50" 
                style={{ height: `${val}%` }} 
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1">
            <div className="text-[var(--pcb-green-light)]">ACTIVE_NODES</div>
            <div className="text-xl">{metrics.nodes}</div>
          </div>
          <div className="space-y-1">
            <div className="text-[var(--pcb-green-light)]">API_LATENCY</div>
            <div className="text-xl text-[var(--terminal-yellow)]">{metrics.latency}ms</div>
          </div>
        </div>

        <div className="pt-2 border-t border-[var(--pcb-green-light)]">
          <div className="text-[10px] font-mono text-[var(--pcb-green-light)]">LAST_SENSOR_READING</div>
          <div className="text-[10px] font-mono text-[var(--terminal-green)]">
            TEMP_SENSOR_7: { (23.4 + Math.random()).toFixed(1) }°C
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleText, setRoleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = ROLES[roleIndex];
    const speed = isDeleting ? 50 : 100;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && roleText === role) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && roleText === '') {
        setIsDeleting(false);
        setRoleIndex((roleIndex + 1) % ROLES.length);
      } else {
        setRoleText(role.slice(0, isDeleting ? roleText.length - 1 : roleText.length + 1));
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [roleText, isDeleting, roleIndex]);

  return (
    <section className="min-h-screen pt-32 px-8 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--terminal-green)] mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--terminal-green)] animate-ping" />
          [ SYSTEM_ONLINE · NODE_47 · 2026 ]
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          A.B.D.<br />
          <span className="text-[var(--terminal-green)]">Anandakumara</span>
        </h1>

        <div className="text-xl md:text-2xl font-mono text-[var(--pcb-green-light)] h-8">
          {roleText}<span className="animate-pulse">_</span>
        </div>

        <p className="max-w-xl text-lg opacity-80 leading-relaxed">
          I build systems where silicon meets software — from Arduino GPIO to production Spring Boot APIs.
        </p>

        <div className="flex gap-4 pt-4">
          <a href="#projects" className="btn-terminal">
            → EXPLORE_SYSTEMS
          </a>
          <a href="/cv.pdf" className="btn-terminal opacity-70 hover:opacity-100">
            ↓ DOWNLOAD_CV
          </a>
        </div>
      </div>

      <div className="flex-1 flex justify-center md:justify-end w-full">
        <StatusWidget />
      </div>
    </section>
  );
};

export default Hero;
