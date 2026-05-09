import React, { useRef, useEffect } from 'react';
import { usePulse } from '../../context/PulseContext';

export default function CircuitCanvas() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const particlesRef = useRef([]);
  const ripplesRef = useRef([]);
  
  const { pulseEvent } = usePulse();

  // Initialize Particles
  useEffect(() => {
    particlesRef.current = Array.from({ length: 25 }, () => ({
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      targetX: 0,
      targetY: 0,
      size: Math.random() * 2 + 1.5,
      mass: Math.random() * 0.5 + 0.5,
      active: false,
      alpha: 0
    }));
  }, []);

  // Handle global pulse events (Clicks)
  useEffect(() => {
    if (pulseEvent) {
      // Create ripple
      ripplesRef.current.push({
        x: pulseEvent.x,
        y: pulseEvent.y,
        radius: 0,
        maxRadius: 200,
        alpha: 1,
        speed: 12
      });

      // Explode particles
      particlesRef.current.forEach(p => {
        if (p.active) {
          const dx = p.x - pulseEvent.x;
          const dy = p.y - pulseEvent.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const force = (200 - dist) / 8;
            p.vx += (dx / dist) * force * (Math.random() * 2 + 1);
            p.vy += (dy / dist) * force * (Math.random() * 2 + 1);
            p.active = false; // They will fade out and stop tracking mouse
          }
        }
      });
    }
  }, [pulseEvent]);

  // Global Mouse Tracking
  useEffect(() => {
    let mouseTimeout;
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        // Optionally scatter on stop, but prompt says scatter on mouseout.
        // We'll keep active true as long as mouse is in window.
      }, 100);
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      particlesRef.current.forEach(p => p.active = false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(mouseTimeout);
    };
  }, []);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouse = mouseRef.current;

      // Update & Draw Particles
      particlesRef.current.forEach((p, i) => {
        if (mouse.active && p.active !== false) {
          p.active = true;
          // Target is loosely around the mouse
          const angle = (i / 25) * Math.PI * 2 + (Date.now() * 0.001);
          const orbitRadius = 40 + Math.sin(Date.now() * 0.002 + i) * 20;
          p.targetX = mouse.x + Math.cos(angle) * orbitRadius;
          p.targetY = mouse.y + Math.sin(angle) * orbitRadius;
          p.alpha = Math.min(p.alpha + 0.05, 0.6);
        } else {
          p.alpha = Math.max(p.alpha - 0.03, 0);
        }

        // Spring physics
        if (p.active) {
          const ax = (p.targetX - p.x) * 0.04;
          const ay = (p.targetY - p.y) * 0.04;
          p.vx += ax / p.mass;
          p.vy += ay / p.mass;
        }

        // Friction
        p.vx *= 0.82;
        p.vy *= 0.82;

        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // Reset near mouse to be ready if completely faded out
        if (!p.active && p.alpha <= 0 && mouse.active) {
           p.x = mouse.x + (Math.random() - 0.5) * 300;
           p.y = mouse.y + (Math.random() - 0.5) * 300;
           p.active = true;
        }

        if (p.alpha > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 204, ${p.alpha})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00ffcc';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Update & Draw Ripples
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += r.speed;
        r.alpha -= 1 / (r.maxRadius / r.speed);

        if (r.alpha <= 0) {
          ripplesRef.current.splice(i, 1);
        } else {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 255, 204, ${r.alpha})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
    />
  );
}
