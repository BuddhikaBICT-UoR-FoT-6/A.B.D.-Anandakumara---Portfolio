import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
  { id: 'hero',     label: 'INIT',     short: '00' },
  { id: 'about',    label: 'ABOUT',    short: '01' },
  { id: 'skills',   label: 'SKILLS',   short: '02' },
  { id: 'projects', label: 'PROJECTS', short: '03' },
  { id: 'contact',  label: 'CONTACT',  short: '04' },
];

const SectionScrollRuler = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const cooldownRef = useRef(false);
  const isScrollingRef = useRef(false);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers = [];
    SECTIONS.forEach((sec, i) => {
      const el = sec.id === 'hero'
        ? document.body.querySelector('section') // hero has no id
        : document.getElementById(sec.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIdx(i); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Track scroll percentage
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Section snap on wheel (one scroll = one section)
  const scrollToSection = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, idx));
    const sec = SECTIONS[clamped];
    if (sec.id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sec.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      // Only snap if not a small trackpad scroll
      if (Math.abs(e.deltaY) < 20) return;
      if (cooldownRef.current) { e.preventDefault(); return; }
      e.preventDefault();
      cooldownRef.current = true;
      const dir = e.deltaY > 0 ? 1 : -1;
      setActiveIdx(prev => {
        const next = Math.max(0, Math.min(SECTIONS.length - 1, prev + dir));
        scrollToSection(next);
        return next;
      });
      setTimeout(() => { cooldownRef.current = false; }, 900);
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scrollToSection]);

  return (
    <div
      style={{
        position: 'fixed',
        right: '0',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      {/* Ruler track */}
      <div style={{
        position: 'relative',
        width: '44px',
        height: `${SECTIONS.length * 64}px`,
        background: 'rgba(0,10,5,0.7)',
        borderLeft: '2px solid rgba(0,255,65,0.2)',
        backdropFilter: 'blur(8px)',
        pointerEvents: 'auto',
      }}>
        {/* Ruler tick marks & numbers */}
        {Array.from({ length: SECTIONS.length * 4 + 1 }).map((_, i) => {
          const isMajor = i % 4 === 0;
          return (
            <div key={i} style={{
              position: 'absolute',
              right: 0,
              top: `${(i / (SECTIONS.length * 4)) * 100}%`,
              display: 'flex',
              alignItems: 'center',
            }}>
              <div style={{
                width: isMajor ? '8px' : '4px',
                height: '1px',
                background: isMajor ? 'rgba(0,255,65,0.5)' : 'rgba(0,255,65,0.2)',
              }} />
              {isMajor && (
                <span style={{
                  position: 'absolute',
                  right: '10px',
                  fontSize: '8px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: 'rgba(0,255,65,0.3)',
                  whiteSpace: 'nowrap',
                }}>
                  {String(i / 4).padStart(2, '0')}
                </span>
              )}
            </div>
          );
        })}

        {/* Section dots */}
        {SECTIONS.map((sec, i) => {
          const isActive = activeIdx === i;
          const topPct = (i / (SECTIONS.length - 1)) * 100;
          return (
            <div
              key={sec.id}
              onClick={() => { setActiveIdx(i); scrollToSection(i); }}
              style={{
                position: 'absolute',
                right: '0',
                top: `${topPct}%`,
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '4px 0 4px 6px',
              }}
            >
              {/* Label that slides in on hover */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                whileHover={{ opacity: 1, x: 0 }}
                style={{
                  fontSize: '9px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: isActive ? '#00FF41' : 'rgba(0,255,65,0.5)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                {sec.label}
              </motion.span>

              {/* Dot */}
              <div style={{
                width: isActive ? '10px' : '6px',
                height: isActive ? '10px' : '6px',
                borderRadius: '50%',
                background: isActive ? '#00FF41' : 'rgba(0,255,65,0.3)',
                border: isActive ? '2px solid rgba(0,255,65,0.4)' : '1px solid rgba(0,255,65,0.2)',
                boxShadow: isActive ? '0 0 8px #00FF41, 0 0 16px rgba(0,255,65,0.5)' : 'none',
                transition: 'all 0.3s ease',
                flexShrink: 0,
                marginRight: '4px',
              }} />
            </div>
          );
        })}

        {/* Scroll progress bar */}
        <div style={{
          position: 'absolute',
          left: '-2px',
          top: 0,
          width: '2px',
          height: `${scrollPct * 100}%`,
          background: 'linear-gradient(to bottom, rgba(0,255,65,0.8), rgba(0,255,65,0.3))',
          boxShadow: '0 0 6px rgba(0,255,65,0.6)',
          transition: 'height 0.1s ease',
        }} />

        {/* Moving position indicator */}
        <div style={{
          position: 'absolute',
          left: '-5px',
          top: `${scrollPct * 100}%`,
          width: '8px',
          height: '2px',
          background: '#00FF41',
          boxShadow: '0 0 8px #00FF41',
          transform: 'translateY(-50%)',
          transition: 'top 0.1s ease',
        }} />
      </div>
    </div>
  );
};

export default SectionScrollRuler;
