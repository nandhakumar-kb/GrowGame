/**
 * Sound Manager - Handles all game sound effects and music
 * Uses Web Audio API for better performance and control
 */

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.isMuted = this.getSafeLocalStorage('soundMuted') === 'true';
    this.volume = parseFloat(this.getSafeLocalStorage('soundVolume') || '0.5');
    this.initialized = false;
  }

  getSafeLocalStorage(key, defaultValue = null) {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (error) {
      console.warn(`localStorage read error for ${key}:`, error);
      return defaultValue;
    }
  }

  setSafeLocalStorage(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`localStorage write error for ${key}:`, error);
      return false;
    }
  }

  // Initialize audio context (must be called after user interaction)
  init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (error) {
      console.error('Web Audio API not supported:', error);
    }
  }

  // Generate simple sound effects using oscillators
  createSound(type, frequency, duration) {
    if (!this.initialized || this.isMuted) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = type; // 'sine', 'square', 'sawtooth', 'triangle'
      oscillator.frequency.value = frequency;
      gainNode.gain.value = this.volume;

      const now = this.audioContext.currentTime;
      oscillator.start(now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
      oscillator.stop(now + duration);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  // Predefined sound effects
  playClick() {
    this.createSound('square', 800, 0.05);
  }

  playSuccess() {
    this.createSound('sine', 523.25, 0.1); // C5
    setTimeout(() => this.createSound('sine', 659.25, 0.1), 100); // E5
    setTimeout(() => this.createSound('sine', 783.99, 0.2), 200); // G5
  }

  playError() {
    this.createSound('sawtooth', 200, 0.1);
    setTimeout(() => this.createSound('sawtooth', 150, 0.2), 100);
  }

  playEat() {
    this.createSound('square', 400, 0.05);
  }

  playCoin() {
    this.createSound('sine', 988, 0.08);
    setTimeout(() => this.createSound('sine', 1319, 0.15), 80);
  }

  playPowerUp() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createSound('sine', 400 + (i * 100), 0.05);
      }, i * 50);
    }
  }

  playJump() {
    this.createSound('square', 600, 0.1);
  }

  playHit() {
    this.createSound('sawtooth', 100, 0.15);
  }

  playWin() {
    const notes = [523.25, 587.33, 659.25, 783.99];
    notes.forEach((freq, i) => {
      setTimeout(() => this.createSound('sine', freq, 0.2), i * 100);
    });
  }

  playLose() {
    const notes = [400, 350, 300, 250];
    notes.forEach((freq, i) => {
      setTimeout(() => this.createSound('triangle', freq, 0.15), i * 100);
    });
  }

  // Volume and mute controls
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.setSafeLocalStorage('soundVolume', this.volume.toString());
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.setSafeLocalStorage('soundMuted', this.isMuted.toString());
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  getVolume() {
    return this.volume;
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;
