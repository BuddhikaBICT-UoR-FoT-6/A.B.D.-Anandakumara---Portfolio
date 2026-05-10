class AudioManager {
  constructor() {
    this.sounds = {
      typewriter: new Audio('/sounds/380138__yottasounds__typewriter-single-key-type-1.wav'),
      hum: new Audio('/sounds/gregorquendel-sci-fi-sound-effect-designed-circuits-hum-01-200817.mp3'),
      pulse: new Audio('/sounds/alex_jauk-electronic-pulse-8bit-293075.mp3'),
      hover: new Audio('/sounds/rescopicsound-ui-abstract-electricity-glitch-228341.mp3')
    };

    // Preload and configure
    Object.values(this.sounds).forEach(audio => {
      audio.preload = 'auto';
      audio.volume = 0.3;
    });

    this.sounds.hum.loop = true;
    this.sounds.hum.volume = 0.15;
    
    this.unlocked = false;
    this.lastHoverPlay = 0;
    this.lastPulsePlay = 0;
  }

  unlock() {
    if (this.unlocked) return;
    
    // Silent play to unlock audio context on first interaction
    Object.values(this.sounds).forEach(audio => {
      audio.volume = 0;
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    });
    
    // Reset volumes
    this.sounds.typewriter.volume = 0.3;
    this.sounds.hum.volume = 0.15;
    this.sounds.pulse.volume = 0.4;
    this.sounds.hover.volume = 0.12;
    
    this.unlocked = true;
  }

  playKey() {
    if (!this.unlocked) return;
    const clone = this.sounds.typewriter.cloneNode();
    clone.volume = 0.2 + Math.random() * 0.1;
    clone.playbackRate = 0.95 + Math.random() * 0.1;
    clone.play().catch(() => {});
  }

  playHover() {
    if (!this.unlocked) return;
    const now = performance.now();
    if (now - this.lastHoverPlay < 200) return; // Debounce 200ms
    this.lastHoverPlay = now;
    
    const clone = this.sounds.hover.cloneNode();
    clone.volume = 0.08 + Math.random() * 0.04;
    clone.playbackRate = 0.9 + Math.random() * 0.2;
    clone.play().catch(() => {});
  }

  playPulse() {
    if (!this.unlocked) return;
    const now = performance.now();
    if (now - this.lastPulsePlay < 100) return; // Debounce 100ms
    this.lastPulsePlay = now;
    
    const clone = this.sounds.pulse.cloneNode();
    clone.volume = 0.4;
    clone.play().catch(() => {});
  }

  startAmbient() {
    if (!this.unlocked) return;
    this.sounds.hum.play().catch(() => {});
  }
}

export const audio = new AudioManager();
