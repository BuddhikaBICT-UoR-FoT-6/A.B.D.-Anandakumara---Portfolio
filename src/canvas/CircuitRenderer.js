export default class CircuitRenderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCtx = this.offscreenCanvas.getContext('2d', { alpha: false });
    
    this.gridSize = 40;
    this.traces = [];
    this.chips = [];
    this.pulses = [];
    this.gridPulses = [];
    this.leds = [];
    this.heatZones = [];
    this.nodes = [];
    this.particles = [];
    this.ripples = [];
    
    this.mouse = { x: -1000, y: -1000 };
    this.isHovering = false;
    this.maxParticles = 80;
    
    this.isRunning = false;
    this.lastTime = 0;
    
    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  start() {
    if (this.isRunning) return;
    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseleave', this.onMouseLeave);
    window.addEventListener('click', this.onClick);
    
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      this.ctx.drawImage(this.offscreenCanvas, 0, 0, this.width, this.height);
      return;
    }
    
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseleave', this.onMouseLeave);
    window.removeEventListener('click', this.onClick);
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    this.offscreenCanvas.width = this.width * dpr;
    this.offscreenCanvas.height = this.height * dpr;
    this.offscreenCtx.scale(dpr, dpr);

    this.generateNetwork();
    this.drawBaseLayer();
    
    // Initialize floating particles
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    if (!this.isRunning) {
      this.ctx.drawImage(this.offscreenCanvas, 0, 0, this.width, this.height);
    }
  }

  generateNetwork() {
    this.traces = [];
    this.chips = [];
    this.leds = [];
    this.heatZones = [];
    
    // Generate chips
    for(let i=0; i<12; i++) {
      this.chips.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        w: 30 + Math.random() * 80,
        h: 30 + Math.random() * 80
      });
    }

    // Generate traces (Manhattan paths)
    for(let i=0; i<80; i++) {
      let path = [];
      let cx = Math.random() * this.width;
      let cy = Math.random() * this.height;
      path.push({x: cx, y: cy});
      
      let segments = 3 + Math.floor(Math.random() * 6);
      for(let j=0; j<segments; j++) {
        let dir = Math.random();
        let dist = 50 + Math.random() * 150;
        if (dir < 0.25) cx += dist;
        else if (dir < 0.5) cx -= dist;
        else if (dir < 0.75) cy += dist;
        else cy -= dist;
        
        // Randomly branch (15%) - simulate by ending early or jumping
        if (Math.random() < 0.15) break;
        
        path.push({x: cx, y: cy});
      }
      if(path.length > 1) {
         this.traces.push(path);
      }
    }

    // Generate LEDs
    for(let i=0; i<35; i++) {
      this.leds.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        state: 'off',
        timer: Math.random() * 2500,
        color: ['#00ff44', '#ff3300', '#ff8800'][Math.floor(Math.random()*3)]
      });
    }

    // Generate Heat Zones
    for(let i=0; i<5; i++) {
      this.heatZones.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 60 + Math.random() * 60,
        intensity: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.002
      });
    }
  }

  drawBaseLayer() {
    const ctx = this.offscreenCtx;
    ctx.fillStyle = '#050d0a';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.strokeStyle = '#0d2a1a';
    ctx.lineWidth = 1.5;
    
    this.traces.forEach(path => {
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for(let i=1; i<path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.stroke();
    });

    this.chips.forEach(chip => {
      ctx.fillStyle = '#0a1810';
      ctx.strokeStyle = '#1a4a2a';
      ctx.lineWidth = 2;
      ctx.fillRect(chip.x, chip.y, chip.w, chip.h);
      ctx.strokeRect(chip.x, chip.y, chip.w, chip.h);
      
      // Pin lines
      ctx.beginPath();
      for(let i=0; i<chip.w; i+=8) {
        ctx.moveTo(chip.x + i, chip.y - 4);
        ctx.lineTo(chip.x + i, chip.y);
        ctx.moveTo(chip.x + i, chip.y + chip.h);
        ctx.lineTo(chip.x + i, chip.y + chip.h + 4);
      }
      for(let i=0; i<chip.h; i+=8) {
        ctx.moveTo(chip.x - 4, chip.y + i);
        ctx.lineTo(chip.x, chip.y + i);
        ctx.moveTo(chip.x + chip.w, chip.y + i);
        ctx.lineTo(chip.x + chip.w + 4, chip.y + i);
      }
      ctx.stroke();
    });
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.isHovering = true;
  }

  onMouseLeave() {
    this.isHovering = false;
  }

  onClick(e) {
    const x = e.clientX;
    const y = e.clientY;

    // Expanding ring
    this.ripples.push({ x, y, r: 0, maxR: 180, alpha: 1 });

    // Disperse Particles (Burst)
    this.particles.forEach(p => {
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 400) {
        const force = (400 - dist) / 40;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
    
    // Spawn grid pulses in all 4 directions from nearest grid point
    const gridX = Math.round(x / this.gridSize) * this.gridSize;
    const gridY = Math.round(y / this.gridSize) * this.gridSize;
    
    for (let i = 0; i < 4; i++) {
      this.gridPulses.push({
        x: gridX,
        y: gridY,
        prevX: gridX,
        prevY: gridY,
        targetX: gridX,
        targetY: gridY,
        speed: 8 + Math.random() * 4,
        life: 1.5,
        dir: i,
        isBurst: true
      });
    }
    
    // Inject pulses along static traces
    for(let i=0; i<3; i++) {
      if(this.traces.length > 0) {
        this.pulses.push({
          pathIndex: Math.floor(Math.random() * this.traces.length),
          t: 0,
          speed: 0.015,
          color: '#00ffff',
          width: 3
        });
      }
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    const delta = timestamp - this.lastTime;
    
    if (delta >= 16) {
      this.lastTime = timestamp - (delta % 16);
      this.update(delta);
      this.draw();
    }
    requestAnimationFrame(this.loop);
  }

  update(delta) {
    // Update pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      let p = this.pulses[i];
      p.t += p.speed;
      if (p.t >= 1) {
        this.pulses.splice(i, 1);
      } else {
        const path = this.traces[p.pathIndex];
        const exactIndex = p.t * (path.length - 1);
        const i0 = Math.floor(exactIndex);
        if (path[i0]) {
          const px = path[i0].x;
          const py = path[i0].y;
          this.leds.forEach(led => {
            if (Math.abs(led.x - px) < 20 && Math.abs(led.y - py) < 20) {
              led.state = 'on';
              led.timer = 150;
            }
          });
        }
      }
    }

    // Update Grid Pulses
    for (let i = this.gridPulses.length - 1; i >= 0; i--) {
      const p = this.gridPulses[i];
      
      const dx = p.targetX - p.x;
      const dy = p.targetY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 1) {
        p.prevX = p.targetX;
        p.prevY = p.targetY;
        
        if (Math.random() > 0.3) {
          p.dir = Math.floor(Math.random() * 4);
        }

        switch(p.dir) {
          case 0: p.targetY -= this.gridSize; break;
          case 1: p.targetX += this.gridSize; break;
          case 2: p.targetY += this.gridSize; break;
          case 3: p.targetX -= this.gridSize; break;
        }
        
        p.life -= 0.05;
      } else {
        p.x += (dx / dist) * p.speed;
        p.y += (dy / dist) * p.speed;
      }

      if (p.life <= 0 || p.x < 0 || p.x > this.width || p.y < 0 || p.y > this.height) {
        this.gridPulses.splice(i, 1);
      }
    }

    // Update LED Nodes
    this.leds.forEach(led => {
      led.timer -= delta;
      if (led.timer <= 0) {
        const rand = Math.random();
        if (rand < 0.1) led.state = 'on';
        else if (rand < 0.4) led.state = 'dim';
        else led.state = 'off';
        led.timer = 80 + Math.random() * 2420;
      }
    });

    // Update Heat Zones
    this.heatZones.forEach(hz => {
      hz.intensity = (Math.sin(performance.now() * hz.speed + hz.phase) + 1) / 2;
    });

    // Update Particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      if (this.isHovering) {
        p.vx += (this.mouse.x - p.x) * 0.0004;
        p.vy += (this.mouse.y - p.y) * 0.0004;
      }
      p.vx *= 0.99;
      p.vy *= 0.99;
    });

    // Update Ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      let r = this.ripples[i];
      r.r += 6;
      r.alpha -= 0.03;
      if (r.alpha <= 0) this.ripples.splice(i, 1);
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    
    ctx.drawImage(this.offscreenCanvas, 0, 0, this.width, this.height);

    ctx.globalCompositeOperation = 'screen';
    this.heatZones.forEach(hz => {
      const grad = ctx.createRadialGradient(hz.x, hz.y, 0, hz.x, hz.y, hz.radius);
      grad.addColorStop(0, `rgba(255,40,0,${hz.intensity * 0.35})`);
      grad.addColorStop(1, `rgba(255,60,0,0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(hz.x - hz.radius, hz.y - hz.radius, hz.radius * 2, hz.radius * 2);
    });
    ctx.globalCompositeOperation = 'source-over';

    this.pulses.forEach(p => {
      const path = this.traces[p.pathIndex];
      const exactIndex = p.t * (path.length - 1);
      const i0 = Math.floor(exactIndex);
      const i1 = Math.min(i0 + 1, path.length - 1);
      const frac = exactIndex - i0;
      
      const x = path[i0].x + (path[i1].x - path[i0].x) * frac;
      const y = path[i0].y + (path[i1].y - path[i0].y) * frac;
      
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(x, y, p.width, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Draw Grid Pulses
    this.gridPulses.forEach(p => {
      const gradient = ctx.createLinearGradient(p.prevX, p.prevY, p.x, p.y);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(1, `rgba(0, 242, 255, ${p.life * 0.8})`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.prevX, p.prevY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      ctx.shadowBlur = 20;
      ctx.shadowColor = '#00f2ff';
      ctx.fillStyle = `rgba(0, 242, 255, ${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    this.leds.forEach(led => {
      ctx.beginPath();
      ctx.arc(led.x, led.y, 3, 0, Math.PI * 2);
      if (led.state === 'off') {
        ctx.fillStyle = '#0a1a0a';
      } else if (led.state === 'dim') {
        ctx.fillStyle = '#1a4a1a';
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#1a4a1a';
        ctx.fill();
      } else {
        ctx.fillStyle = led.color;
        ctx.shadowBlur = 16;
        ctx.shadowColor = led.color;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    });

    // Draw Particles
    this.particles.forEach(p => {
      this.ctx.fillStyle = `rgba(0, 242, 255, ${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (this.isHovering && dist < 150) {
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00f2ff';
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    });

    this.ripples.forEach(r => {
      ctx.strokeStyle = `rgba(0, 255, 255, ${r.alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
    });
  }
}
