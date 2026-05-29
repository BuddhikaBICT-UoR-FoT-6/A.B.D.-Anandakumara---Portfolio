import React, { useState, useEffect, useRef, useCallback } from 'react';

const CYAN       = '#00d4ff';
const CYAN_DIM   = 'rgba(0,212,255,0.35)';
const CYAN_FAINT = 'rgba(0,212,255,0.12)';
const CYAN_BG    = 'rgba(0,212,255,0.08)';

const SECTIONS = [
  { id: 'hero',     label: 'INIT'     },
  { id: 'about',    label: 'ABOUT'    },
  { id: 'skills',   label: 'SKILLS'   },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'contact',  label: 'CONTACT'  },
];

/** Return the DOM element for a section */
function getSectionEl(sec) {
  if (sec.id === 'hero') {
    // Hero is the first <section> (has no id)
    return document.querySelector('main section, section');
  }
  return document.getElementById(sec.id);
}

const SectionScrollRuler = () => {
  const [activeIdx, setActiveIdx]   = useState(0);
  const [scrollPct, setScrollPct]   = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const cooldownRef = useRef(false);

  // ── Active section tracker ─────────────────────────────────────
  useEffect(() => {
    const observers = [];
    SECTIONS.forEach((sec, i) => {
      const el = getSectionEl(sec);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIdx(i); },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // ── Global scroll percentage ───────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Scroll to a section ────────────────────────────────────────
  const scrollToSection = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(SECTIONS.length - 1, idx));
    const el = getSectionEl(SECTIONS[clamped]);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // ── Boundary-only snap scroll ──────────────────────────────────
  // Normal scroll within a section. Snap only when hitting the
  // bottom (going down) or top (going up) of the current section.
  useEffect(() => {
    const THRESHOLD = 8; // px from edge that counts as "at boundary"

    const handleWheel = (e) => {
      if (cooldownRef.current) return; // let the snap animation finish

      const dir = e.deltaY > 0 ? 1 : -1;
      const scrollY   = window.scrollY;
      const winH      = window.innerHeight;
      const docH      = document.documentElement.scrollHeight;
      const atBottom  = scrollY + winH >= docH - THRESHOLD;
      const atTop     = scrollY <= THRESHOLD;

      // Find the current section's bottom boundary
      const currentEl = getSectionEl(SECTIONS[activeIdx]);
      const nextIdx   = activeIdx + 1;
      const prevIdx   = activeIdx - 1;

      let shouldSnap = false;

      if (dir > 0 && nextIdx < SECTIONS.length) {
        // Scrolling down — snap if we've scrolled past the bottom of the current section
        if (currentEl) {
          const rect = currentEl.getBoundingClientRect();
          // When the bottom of the current section is at or above the viewport bottom
          if (rect.bottom <= winH + THRESHOLD) {
            shouldSnap = true;
          }
        } else if (atBottom) {
          shouldSnap = true;
        }
      } else if (dir < 0 && prevIdx >= 0) {
        // Scrolling up — snap if we've scrolled to the very top of the current section
        if (currentEl) {
          const rect = currentEl.getBoundingClientRect();
          // When the top of the current section is at or below the viewport top
          if (rect.top >= -THRESHOLD) {
            shouldSnap = true;
          }
        } else if (atTop) {
          shouldSnap = true;
        }
      }

      if (shouldSnap) {
        e.preventDefault();
        const nextSection = dir > 0 ? nextIdx : prevIdx;
        cooldownRef.current = true;
        setActiveIdx(nextSection);
        scrollToSection(nextSection);
        setTimeout(() => { cooldownRef.current = false; }, 900);
      }
      // Otherwise: do nothing — let native scroll happen
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeIdx, scrollToSection]);

  // ── Ruler render ──────────────────────────────────────────────
  const RULER_H   = SECTIONS.length * 68; // px
  const TICK_COUNT = SECTIONS.length * 4;

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 9990,
      userSelect: 'none',
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'relative',
        width: '46px',
        height: `${RULER_H}px`,
        background: 'rgba(0,8,20,0.82)',
        borderLeft: `2px solid ${CYAN_DIM}`,
        backdropFilter: 'blur(10px)',
        pointerEvents: 'auto',
      }}>

        {/* Tick marks */}
        {Array.from({ length: TICK_COUNT + 1 }).map((_, i) => {
          const isMajor = i % 4 === 0;
          const topPct  = (i / TICK_COUNT) * 100;
          return (
            <div key={i} style={{
              position: 'absolute',
              right: 0,
              top: `${topPct}%`,
              display: 'flex',
              alignItems: 'center',
            }}>
              <div style={{
                width:      isMajor ? '10px' : '5px',
                height:     '1px',
                background: isMajor ? CYAN_DIM : CYAN_FAINT,
              }} />
              {isMajor && (
                <span style={{
                  position:   'absolute',
                  right:      '13px',
                  fontSize:   '7px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color:      CYAN_FAINT,
                  whiteSpace: 'nowrap',
                }}>
                  {String(i / 4).padStart(2, '0')}
                </span>
              )}
            </div>
          );
        })}

        {/* Section dots + labels */}
        {SECTIONS.map((sec, i) => {
          const isActive  = activeIdx === i;
          const isHovered = hoveredIdx === i;
          const topPct    = (i / (SECTIONS.length - 1)) * 100;
          return (
            <div
              key={sec.id}
              onClick={() => { setActiveIdx(i); scrollToSection(i); }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                position:  'absolute',
                right:     '0',
                top:       `${topPct}%`,
                transform: 'translateY(-50%)',
                display:   'flex',
                alignItems:'center',
                cursor:    'pointer',
                padding:   '6px 4px 6px 6px',
              }}
            >
              {/* Slide-in label */}
              <span style={{
                fontSize:   '9px',
                fontFamily: 'JetBrains Mono, monospace',
                color:      isActive ? CYAN : CYAN_DIM,
                whiteSpace: 'nowrap',
                marginRight:'6px',
                opacity:    (isActive || isHovered) ? 1 : 0,
                transform:  (isActive || isHovered) ? 'translateX(0)' : 'translateX(6px)',
                transition: 'all 0.2s ease',
                pointerEvents: 'none',
              }}>
                {sec.label}
              </span>

              {/* Dot */}
              <div style={{
                width:       isActive ? '10px' : '6px',
                height:      isActive ? '10px' : '6px',
                borderRadius:'50%',
                background:  isActive ? CYAN : CYAN_BG,
                border:      `1px solid ${isActive ? CYAN : CYAN_DIM}`,
                boxShadow:   isActive
                  ? `0 0 8px ${CYAN}, 0 0 18px rgba(0,212,255,0.4)`
                  : 'none',
                transition:  'all 0.25s ease',
                flexShrink:  0,
                marginRight: '4px',
              }} />
            </div>
          );
        })}

        {/* Progress fill */}
        <div style={{
          position:   'absolute',
          left:       '-2px',
          top:        0,
          width:      '2px',
          height:     `${scrollPct * 100}%`,
          background: `linear-gradient(to bottom, ${CYAN}, rgba(0,212,255,0.3))`,
          boxShadow:  `0 0 6px ${CYAN}`,
          transition: 'height 0.08s linear',
        }} />

        {/* Moving scrubber */}
        <div style={{
          position:   'absolute',
          left:       '-5px',
          top:        `${scrollPct * 100}%`,
          width:      '8px',
          height:     '2px',
          background: CYAN,
          boxShadow:  `0 0 8px ${CYAN}`,
          transform:  'translateY(-50%)',
          transition: 'top 0.08s linear',
        }} />
      </div>
    </div>
  );
};

export default SectionScrollRuler;
