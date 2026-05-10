class AudioEngine {
  constructor() {
    this.ctx = null;
    this.buffers = {};
    this.masterGain = null;
    this.unlocked = false;
    this.humNode = null;
  }

  async unlock() {
    if (this.unlocked) return;
    
    // Create AudioContext on first user gesture
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    await this.ctx.resume();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.7;
    this.masterGain.connect(this.ctx.destination);
    
    await this.preloadAudio();
    
    this.unlocked = true;
    this.startHum(); // Begin ambient after unlock
  }

  async preloadAudio() {
    const audioFiles = ['typewriter-key', 'circuit-hum', 'pulse-dispatch'];
    
    for (const name of audioFiles) {
      try {
        // Fallback mapping since user mentioned specific files in the prompt, 
        // but the actual files in /public/sounds might be named differently from our previous iteration.
        // I'll map them to the likely filenames we used before if fetch fails.
        let url = `/sounds/${name}.wav`;
        if (name === 'typewriter-key') url = '/sounds/typewriter.wav';
        if (name === 'circuit-hum') url = '/sounds/ambient-hum.wav';
        if (name === 'pulse-dispatch') url = '/sounds/pulse-dispatch.wav';

        const res = await fetch(url);
        if (!res.ok) {
           console.warn(`Failed to fetch audio: ${url}`);
           continue;
        }
        const buf = await res.arrayBuffer();
        this.buffers[name] = await this.ctx.decodeAudioData(buf);
      } catch (err) {
        console.error("Audio preload error:", err);
      }
    }
  }

  play(name, volume = 1, pitchShift = 1) {
    if (!this.unlocked || !this.buffers[name]) return;
    try {
      const src = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      
      src.buffer = this.buffers[name];
      src.playbackRate.value = pitchShift;
      
      gain.gain.value = volume;
      
      src.connect(gain);
      gain.connect(this.masterGain);
      
      src.start();
    } catch (e) {
      console.error("Play error", e);
    }
  }

  playKey() {
    // Randomize pitch for organic typewriter feel
    this.play('typewriter-key', 0.5, 0.92 + Math.random() * 0.18);
  }

  startHum() {
    if (!this.unlocked || !this.buffers['circuit-hum']) return;
    try {
      this.humNode = this.ctx.createBufferSource();
      this.humNode.buffer = this.buffers['circuit-hum'];
      this.humNode.loop = true;
      
      const humGain = this.ctx.createGain();
      humGain.gain.value = 0.12;
      
      this.humNode.connect(humGain);
      humGain.connect(this.masterGain);
      
      this.humNode.start();
    } catch (e) {
      console.error("Hum start error", e);
    }
  }

  playPulse() { 
    this.play('pulse-dispatch', 0.8);
  }

  playHover() {
    // Optional hover sound, reuse pulse with lower volume and higher pitch
    this.play('pulse-dispatch', 0.2, 1.5);
  }
}

export const audio = new AudioEngine();
