import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMode } from '../context/ModeContext';

const SECTIONS = ['about', 'skills', 'projects', 'contact'];

const NavLink = ({ href, label, active }) => (
  <a
    href={href}
    className="group relative px-3 py-2 text-xs font-mono transition-all duration-200"
    style={{ color: active ? '#00FF41' : 'rgba(0,255,65,0.6)' }}
  >
    <span className="opacity-0 group-hover:opacity-100 transition-opacity">./</span>
    {label}
    <span
      className="absolute -bottom-1 left-0 h-[1px] bg-[var(--terminal-green)] transition-all duration-300"
      style={{ width: active ? '100%' : '0%', boxShadow: active ? '0 0 8px var(--terminal-green)' : 'none' }}
    />
    {active && (
      <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#00FF41] animate-pulse" />
    )}
  </a>
);

const NavBar = () => {
  const { mode } = useMode();
  const isDev = mode === 'developer';
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const getActive = () => {
      const scrollY = window.scrollY + 80; // offset for navbar height
      let current = '';
      SECTIONS.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      });
      setActiveSection(current);
    };
    getActive();
    window.addEventListener('scroll', getActive, { passive: true });
    return () => window.removeEventListener('scroll', getActive);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 nav-glass h-16 flex items-center px-4 md:px-8 justify-between">
      <div className="flex items-center gap-1 md:gap-2 overflow-hidden shrink-0">
        {isDev ? (
          <span className="text-[var(--terminal-green)] font-mono font-bold tracking-tighter text-xs sm:text-sm md:text-base truncate max-w-[200px] sm:max-w-none">
            ABD://ANANDAKUMARA
            <span className="animate-pulse">_</span>
          </span>
        ) : (
          <span className="text-[var(--terminal-green)] font-mono font-bold tracking-tighter text-xs sm:text-sm md:text-base">
            A.B.D. Anandakumara
          </span>
        )}
        <span className="hidden sm:inline text-[var(--pcb-green-light)] text-[10px] font-mono mt-1">
          {isDev ? 'v2.6.1' : '· Portfolio'}
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-6">
        <NavLink href="#about"    label={isDev ? 'about'    : 'About'}    active={activeSection === 'about'} />
        <NavLink href="#skills"   label={isDev ? 'skills'   : 'Skills'}   active={activeSection === 'skills'} />
        <NavLink href="#projects" label={isDev ? 'projects' : 'Projects'} active={activeSection === 'projects'} />
        <NavLink href="#contact"  label={isDev ? 'contact'  : 'Contact'}  active={activeSection === 'contact'} />
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono">
        {isDev ? (
          <>
            <div className="flex items-center gap-1.5">
              <div className="led-indicator bg-[var(--terminal-green)]" />
              <span className="text-[var(--terminal-green)]">API:ONLINE</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="led-indicator bg-[var(--terminal-green)]" />
              <span className="text-[var(--terminal-green)]">MQTT:OK</span>
            </div>
            <div className="hidden sm:block text-[var(--terminal-yellow)]">● 24 NODES</div>
          </>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[var(--terminal-green)] animate-pulse" />
            <span className="text-[var(--terminal-green)]">Available for Work</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
