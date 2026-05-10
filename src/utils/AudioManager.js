class AudioManager {
  constructor() {
    const soundPath = '/sounds/';
    
    // Grouped sound assets
    this.assets = {
      typewriter: [
        '380138__yottasounds__typewriter-single-key-type-1.wav',
        '820350__bryansaraiva__typewriter-key-press-03.wav',
        'COMType_Typewriter key (ID 2842)_BigSoundBank.com.wav'
      ],
      idleHum: 'gregorquendel-sci-fi-sound-effect-designed-circuits-hum-24-200825.mp3',
      pulse: 'alex_jauk-electronic-pulse-8bit-293075.mp3',
      hover: 'rescopicsound-ui-abstract-electricity-glitch-228341.mp3',
      dataFlow: 'freesound_community-short-deep-humming-102866.mp3'
    };

    // Preload instances
    this.sounds = {
      typewriter: this.assets.typewriter.map(file => new Audio(soundPath + file)),
      idleHum: new Audio(soundPath + this.assets.idleHum),
      pulse: new Audio(soundPath + this.assets.pulse),
      hover: new Audio(soundPath + this.assets.hover),
      dataFlow: new Audio(soundPath + this.assets.dataFlow)
    };

    // Configure looping
    this.sounds.idleHum.loop = true;
    this.sounds.dataFlow.loop = true;
    
    // Initial volumes
    this.sounds.idleHum.volume = 0.15;
    this.sounds.dataFlow.volume = 0.08;
    this.sounds.hover.volume = 0.1;
    
    this.unlocked = false;
    this.typewriterIndex = 0;
  }

  unlock() {
    if (this.unlocked) return;
    
    // Initial silent play to satisfy browser policy
    const silentPlay = (audio) => {
      audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    };

    Object.values(this.sounds).forEach(val => {
      if (Array.isArray(val)) val.forEach(silentPlay);
      else silentPlay(val);
    });

    this.sounds.idleHum.play().catch(() => {});
    this.unlocked = true;
  }

  playKey() {
    if (!this.unlocked) return;
    
    // Cycle through typewriter keys for variety
    const s = this.sounds.typewriter[this.typewriterIndex].cloneNode();
    this.typewriterIndex = (this.typewriterIndex + 1) % this.sounds.typewriter.length;
    
    // Randomize pitch and volume for "mechanical" feel
    s.playbackRate = 0.9 + Math.random() * 0.2;
    s.volume = 0.3 + Math.random() * 0.2;
    s.play().catch(() => {});
  }

  playPulse() {
    if (!this.unlocked) return;
    const s = this.sounds.pulse.cloneNode();
    s.volume = 0.6;
    s.play().catch(() => {});
  }

  playHover() {
    if (!this.unlocked) return;
    this.sounds.hover.currentTime = 0;
    this.sounds.hover.volume = 0.12;
    this.sounds.hover.play().catch(() => {});
  }

  startAmbient() {
    if (!this.unlocked) return;
    this.sounds.idleHum.play().catch(() => {});
    this.sounds.dataFlow.play().catch(() => {});
  }
}

export const audio = new AudioManager();
