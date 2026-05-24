/**
 * sounds.js — Central audio manager for the portfolio.
 * All sounds are loaded lazily after the first user interaction
 * so browsers don't block them (autoplay policy).
 */

const BASE = '/sounds/';

// Map logical sound names to files
const FILES = {
  keypress:  BASE + '820350__bryansaraiva__typewriter-key-press-03.wav',
  glitch:    BASE + 'rescopicsound-ui-abstract-electricity-glitch-228341.mp3',
  pulse:     BASE + 'alex_jauk-electronic-pulse-8bit-293075.mp3',
  hum:       BASE + 'gregorquendel-sci-fi-sound-effect-designed-circuits-hum-24-200825.mp3',
  humLoop:   BASE + 'gregorquendel-sci-fi-sound-effect-designed-circuits-hum-01-200817.mp3',
};

class SoundSystem {
  constructor() {
    this._ctx = null;
    this._buffers = {};
    this._unlocked = false;
    this._preloaded = false;
    this._humNode = null;
    this._humGain = null;

    // Unlock + preload on first interaction
    const unlock = () => {
      if (this._unlocked) return;
      this._unlocked = true;
      this._initCtx();
      this._preload();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  _initCtx() {
    if (this._ctx) return;
    this._ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  async _load(name) {
    if (this._buffers[name]) return this._buffers[name];
    try {
      const res = await fetch(FILES[name]);
      const arr = await res.arrayBuffer();
      const buf = await this._ctx.decodeAudioData(arr);
      this._buffers[name] = buf;
      return buf;
    } catch (e) {
      console.warn(`[Sound] Failed to load "${name}":`, e);
      return null;
    }
  }

  async _preload() {
    if (this._preloaded) return;
    this._preloaded = true;
    await Promise.all(Object.keys(FILES).map(k => this._load(k)));
  }

  _play(name, { volume = 1, rate = 1, loop = false } = {}) {
    if (!this._unlocked || !this._ctx) return null;
    const buf = this._buffers[name];
    if (!buf) return null;

    const src = this._ctx.createBufferSource();
    const gain = this._ctx.createGain();
    src.buffer = buf;
    src.playbackRate.value = rate;
    src.loop = loop;
    gain.gain.value = Math.min(volume, 1);
    src.connect(gain);
    gain.connect(this._ctx.destination);
    src.start();
    return { src, gain };
  }

  // ── Public API ─────────────────────────────────────────────

  /** Typewriter character tick */
  keypress() {
    this._play('keypress', { volume: 0.18, rate: 0.9 + Math.random() * 0.2 });
  }

  /** UI click / button press */
  click() {
    this._play('glitch', { volume: 0.22, rate: 1.4 });
  }

  /** Nav / link hover */
  hover() {
    this._play('pulse', { volume: 0.08, rate: 1.8 });
  }

  /** Contact form sent */
  transmit() {
    this._play('pulse', { volume: 0.35, rate: 1.0 });
    setTimeout(() => this._play('glitch', { volume: 0.18, rate: 0.8 }), 220);
  }

  /** Shockwave / page click burst */
  shockwave() {
    this._play('glitch', { volume: 0.28, rate: 0.7 });
  }

  /** Boot sequence: one beep per log line */
  bootBeep() {
    this._play('pulse', { volume: 0.12, rate: 1.6 + Math.random() * 0.4 });
  }

  /** Start looping ambient hum (boot complete) */
  startHum() {
    if (this._humNode || !this._unlocked || !this._ctx) return;
    const buf = this._buffers['humLoop'];
    if (!buf) return;
    const src = this._ctx.createBufferSource();
    const gain = this._ctx.createGain();
    src.buffer = buf;
    src.loop = true;
    gain.gain.value = 0;
    src.connect(gain);
    gain.connect(this._ctx.destination);
    src.start();
    // Fade in
    gain.gain.linearRampToValueAtTime(0.07, this._ctx.currentTime + 2);
    this._humNode = src;
    this._humGain = gain;
  }

  /** Stop ambient hum */
  stopHum() {
    if (!this._humNode || !this._ctx) return;
    this._humGain.gain.linearRampToValueAtTime(0, this._ctx.currentTime + 1);
    this._humNode.stop(this._ctx.currentTime + 1);
    this._humNode = null;
    this._humGain = null;
  }
}

export const sounds = new SoundSystem();
