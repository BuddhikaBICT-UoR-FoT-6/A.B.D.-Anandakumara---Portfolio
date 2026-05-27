import React from 'react';
import { motion } from 'framer-motion';

const NavLink = ({ href, label }) => (
  <a 
    href={href} 
    className="group relative px-3 py-2 text-xs font-mono text-[var(--terminal-green)] opacity-70 hover:opacity-100 transition-opacity"
  >
    <span className="opacity-0 group-hover:opacity-100 transition-opacity">./</span>
    {label}
    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--terminal-green)] group-hover:w-full transition-all duration-300 shadow-[0_0_8px_var(--terminal-green)]"></span>
  </a>
);

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 nav-glass h-16 flex items-center px-4 md:px-8 justify-between">
      <div className="flex items-center gap-1 md:gap-2 overflow-hidden shrink-0">
        <span className="text-[var(--terminal-green)] font-mono font-bold tracking-tighter text-xs sm:text-sm md:text-base truncate max-w-[200px] sm:max-w-none">
          ABD://ANANDAKUMARA
          <span className="animate-pulse">_</span>
        </span>
        <span className="hidden sm:inline text-[var(--pcb-green-light)] text-[10px] font-mono mt-1">v2.6.1</span>
      </div>

      <div className="hidden lg:flex items-center gap-8">
        <NavLink href="#about" label="about" />
        <NavLink href="#projects" label="projects" />
        <NavLink href="#skills" label="skills" />
        <NavLink href="#contact" label="contact" />
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <div className="led-indicator bg-[var(--terminal-green)]" />
          <span className="text-[var(--terminal-green)]">API:ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="led-indicator bg-[var(--terminal-green)]" />
          <span className="text-[var(--terminal-green)]">MQTT:OK</span>
        </div>
        <div className="text-[var(--terminal-yellow)]">
          ● 24 NODES
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
