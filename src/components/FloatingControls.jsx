import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '../context/ModeContext';

// ── Toast tip definitions ─────────────────────────────────────────────────
const TIPS = [
  {
    icon: '👤',
    label: 'View Mode',
    desc: 'Switch between Recruiter & Developer views',
  },
  {
    icon: '◉',
    label: 'Theme Toggle',
    desc: 'Switch between Hacker & Tranquil colour modes',
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

// ── Single Toast ──────────────────────────────────────────────────────────
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
        right: '124px',
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
      <div style={{
        position: 'absolute', right: '-7px', top: '50%',
        transform: 'translateY(-50%)', width: 0, height: 0,
        borderTop: '6px solid transparent', borderBottom: '6px solid transparent',
        borderLeft: '7px solid rgba(0, 255, 65, 0.35)',
      }} />
      <span style={{ fontSize: '18px', flexShrink: 0, color: '#00FF41' }}>{tip.icon}</span>
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

// ── Mode switch announcement toast ────────────────────────────────────────
const ModeToast = ({ mode, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '58px',
          zIndex: 10002,
          background: mode === 'recruiter'
            ? 'rgba(0,10,30,0.95)'
            : 'rgba(0,10,20,0.95)',
          border: mode === 'recruiter'
            ? '1px solid rgba(100,180,255,0.5)'
            : '1px solid rgba(0,255,65,0.5)',
          borderRadius: '6px',
          padding: '10px 16px',
          backdropFilter: 'blur(14px)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '11px',
          color: mode === 'recruiter' ? '#7dd3fc' : '#00FF41',
          boxShadow: mode === 'recruiter'
            ? '0 0 20px rgba(100,180,255,0.2)'
            : '0 0 20px rgba(0,255,65,0.2)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {mode === 'recruiter' ? '👤 Recruiter Mode — clean view' : '💻 Developer Mode — full detail'}
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Floating button ───────────────────────────────────────────────────────
const FloatingBtn = ({ onClick, title, children, highlight }) => (
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
    style={highlight ? {
      borderColor: 'rgba(100,180,255,0.8)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 20px rgba(100,180,255,0.4)',
      color: '#7dd3fc',
    } : {}}
  >
    {children}
  </motion.button>
);

// ── Main component ────────────────────────────────────────────────────────
const FloatingControls = ({ swarmVisible, onToggleSwarm, theme, onToggleTheme }) => {
  const { mode, toggleMode } = useMode();
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [tipIndex, setTipIndex] = useState(-1);
  const [showModeToast, setShowModeToast] = useState(false);
  const startedRef = useRef(false);
  const modeToastTimer = useRef(null);

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

  // Start tip sequence after boot
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const t = setTimeout(() => setTipIndex(0), 800);
    return () => clearTimeout(t);
  }, []);

  const advanceTip = () => {
    setTipIndex(prev => {
      const next = prev + 1;
      return next < TIPS.length ? next : -1;
    });
  };

  const handleModeToggle = () => {
    toggleMode();
    setShowModeToast(true);
    clearTimeout(modeToastTimer.current);
    modeToastTimer.current = setTimeout(() => setShowModeToast(false), 2500);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

  // The mode after toggle (for toast label)
  const nextMode = mode === 'developer' ? 'recruiter' : 'developer';

  return (
    <>
      {/* Onboarding toast tips */}
      <AnimatePresence mode="wait">
        {tipIndex >= 0 && tipIndex < TIPS.length && (
          <ToastTip key={tipIndex} tip={TIPS[tipIndex]} onDone={advanceTip} />
        )}
      </AnimatePresence>

      {/* Mode switch announcement */}
      <ModeToast mode={mode} visible={showModeToast} />

      {/* Button column */}
      <div style={{
        position: 'fixed', right: '58px', bottom: '24px',
        zIndex: 10000, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '10px',
      }}>
        <AnimatePresence>
          {!atTop && (
            <FloatingBtn key="top" onClick={scrollToTop} title="Back to top">↑</FloatingBtn>
          )}
        </AnimatePresence>

        {/* Mode toggle — highlighted when in recruiter mode */}
        <FloatingBtn
          onClick={handleModeToggle}
          title={mode === 'developer' ? 'Switch to Recruiter View' : 'Switch to Developer View'}
          highlight={mode === 'recruiter'}
        >
          <span style={{ fontSize: '13px' }}>
            {mode === 'developer' ? '👤' : '💻'}
          </span>
        </FloatingBtn>

        {/* Theme toggle */}
        <FloatingBtn
          onClick={onToggleTheme}
          title={theme === 'hacker' ? 'Switch to Tranquil Mode' : 'Switch to Hacker Mode'}
        >
          <span style={{ fontSize: '14px' }}>
            {theme === 'hacker' ? '◉' : '◎'}
          </span>
        </FloatingBtn>

        {/* Swarm toggle */}
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
            <FloatingBtn key="bottom" onClick={scrollToBottom} title="Scroll to bottom">↓</FloatingBtn>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default FloatingControls;
