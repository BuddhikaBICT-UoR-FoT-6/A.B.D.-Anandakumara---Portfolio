import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

const FloatingControls = ({ swarmVisible, onToggleSwarm, theme, onToggleTheme }) => {
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

  return (
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
  );
};

export default FloatingControls;
