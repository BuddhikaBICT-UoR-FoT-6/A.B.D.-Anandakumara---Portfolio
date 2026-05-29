import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Toast tip definitions (top → bottom order of buttons) ─────────────────
const TIPS = [
  {
    icon: '◉',
    label: 'Theme Toggle',
    desc: 'Switch between Hacker & Tranquil mode',
  },
  {
    icon: '✦',
    label: 'Particle Swarm',
    desc: 'Toggle the animated particle swarm on/off',
  },
  {
    icon: '↓',
    label: 'Quick Nav',
    desc: 'Jump to the bottom of the page instantly',
  },
];

// ── Single Toast ───────────────────────────────────────────────────────────
const ToastTip = ({ tip, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        right: '72px',         // sits left of the button column
        bottom: '24px',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(0, 10, 20, 0.92)',
        border: '1px solid rgba(0, 255, 65, 0.35)',
        borderRadius: '6px',
        padding: '10px 14px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 20px rgba(0,255,65,0.15), 0 4px 20px rgba(0,0,0,0.7)',
        fontFamily: 'JetBrains Mono, monospace',
        maxWidth: '230px',
        pointerEvents: 'none',
      }}
    >
      {/* Arrow pointing right toward buttons */}
      <div
        style={{
          position: 'absolute',
          right: '-7px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderLeft: '7px solid rgba(0, 255, 65, 0.35)',
        }}
      />
      <span style={{ fontSize: '18px', flexShrink: 0, color: '#00FF41' }}>
        {tip.icon}
      </span>
      <div>
        <div style={{ fontSize: '10px', color: '#00FF41', letterSpacing: '0.1em', marginBottom: '2px' }}>
          {tip.label.toUpperCase()}
        </div>
        <div style={{ fontSize: '11px', color: '#a0e8c0', lineHeight: '1.4' }}>
          {tip.desc}
        </div>
      </div>
    </motion.div>
  );
};

// ── Floating button ────────────────────────────────────────────────────────
const FloatingBtn = ({ onClick, title, children }) => (
  <motion.button
    onClick={onClick}
    title={title}
    initial={{ opacity: 0, scale: 0.7 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.7 }}
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.88 }}
    transition={{ duration: 0.18 }}
    className="floating-btn"
  >
    {children}
  </motion.button>
);

// ── Main component ─────────────────────────────────────────────────────────
const FloatingControls = ({ swarmVisible, onToggleSwarm, theme, onToggleTheme }) => {
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [tipIndex, setTipIndex] = useState(-1); // -1 = not started yet
  const startedRef = useRef(false);

  // Scroll tracking
  useEffect(() => {
    const check = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setAtTop(scrollY < 80);
      setAtBottom(maxScroll > 0 && scrollY >= maxScroll - 60);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  // Start tip sequence after boot completes (listen for the controls appearing)
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    // Small delay after mount so boot sequence has fully faded
    const t = setTimeout(() => setTipIndex(0), 800);
    return () => clearTimeout(t);
  }, []);

  // Advance to next tip
  const advanceTip = () => {
    setTipIndex(prev => {
      const next = prev + 1;
      return next < TIPS.length ? next : -1; // -1 = done
    });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

  return (
    <>
      {/* Toast tip overlay */}
      <AnimatePresence mode="wait">
        {tipIndex >= 0 && tipIndex < TIPS.length && (
          <ToastTip
            key={tipIndex}
            tip={TIPS[tipIndex]}
            onDone={advanceTip}
          />
        )}
      </AnimatePresence>

      {/* Button column */}
      <div
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '24px',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <AnimatePresence>
          {!atTop && (
            <FloatingBtn key="top" onClick={scrollToTop} title="Back to top">
              ↑
            </FloatingBtn>
          )}
        </AnimatePresence>

        <FloatingBtn
          onClick={onToggleTheme}
          title={theme === 'hacker' ? 'Switch to Tranquil Mode' : 'Switch to Hacker Mode'}
        >
          <span style={{ fontSize: '14px' }}>
            {theme === 'hacker' ? '◉' : '◎'}
          </span>
        </FloatingBtn>

        <FloatingBtn
          onClick={onToggleSwarm}
          title={swarmVisible ? 'Hide particle swarm' : 'Show particle swarm'}
        >
          {swarmVisible ? (
            <span style={{ fontSize: '14px' }}>✦</span>
          ) : (
            <span style={{ fontSize: '14px', opacity: 0.45 }}>✧</span>
          )}
        </FloatingBtn>

        <AnimatePresence>
          {!atBottom && (
            <FloatingBtn key="bottom" onClick={scrollToBottom} title="Scroll to bottom">
              ↓
            </FloatingBtn>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default FloatingControls;
