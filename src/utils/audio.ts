// Web Audio API helper for authentic, sweet Bengali Dhaak, Shankho and festive melodies
let bgmInterval: any = null;
let bgmContext: AudioContext | null = null;

// Helper to get or create clean AudioContext
function getAudioContext(): AudioContext | null {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    return new AudioCtx();
  } catch (e) {
    return null;
  }
}

/**
 * Creates a single warm Dhaak bass stroke ("Dhum")
 */
function playDhaakBass(ctx: AudioContext, time: number, intensity: number = 0.25) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(130, time);
  osc.frequency.exponentialRampToValueAtTime(52, time + 0.18);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(260, time);

  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(intensity, time + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + 0.36);
}

/**
 * Creates a crisp bamboo stick rim strike ("Kathi / Tak")
 */
function playDhaakKathi(ctx: AudioContext, time: number, intensity: number = 0.12) {
  // Resonant wooden tap
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(720, time);
  osc.frequency.exponentialRampToValueAtTime(320, time + 0.04);

  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(680, time);
  filter.Q.setValueAtTime(3, time);

  gain.gain.setValueAtTime(0.001, time);
  gain.gain.linearRampToValueAtTime(intensity, time + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(time);
  osc.stop(time + 0.07);
}

/**
 * Authentic, sweet festive Bengali Dhaak rhythm:
 * Plays the iconic "Tak... Tak... Dhin... Dha!" festive cadence
 */
export function playDhaakSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Pattern: Kathi tap, Kathi tap, warm Bass, festive resonance
  playDhaakKathi(ctx, now, 0.14);
  playDhaakKathi(ctx, now + 0.11, 0.16);
  playDhaakBass(ctx, now + 0.22, 0.28);
  playDhaakKathi(ctx, now + 0.33, 0.15);
  playDhaakBass(ctx, now + 0.44, 0.32);
}

/**
 * Divine, smooth sacred Shankho (Conch Shell) sound
 * Replaced harsh buzz with pure sacred breath resonance & gentle swell
 */
export function playShankhoSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Master gain
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  // Gentle natural breath attack
  masterGain.gain.linearRampToValueAtTime(0.18, now + 0.4);
  masterGain.gain.linearRampToValueAtTime(0.2, now + 0.8);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
  masterGain.connect(ctx.destination);

  // Fundamental frequency
  const oscFundamental = ctx.createOscillator();
  oscFundamental.type = 'sine';
  oscFundamental.frequency.setValueAtTime(415, now);
  oscFundamental.frequency.exponentialRampToValueAtTime(466, now + 0.4);
  oscFundamental.frequency.exponentialRampToValueAtTime(440, now + 1.2);

  // Soft overtone
  const oscOvertone = ctx.createOscillator();
  const overtoneGain = ctx.createGain();
  oscOvertone.type = 'sine';
  oscOvertone.frequency.setValueAtTime(830, now);
  oscOvertone.frequency.exponentialRampToValueAtTime(932, now + 0.4);
  oscOvertone.frequency.exponentialRampToValueAtTime(880, now + 1.2);
  overtoneGain.gain.setValueAtTime(0.06, now);

  // Gentle vibrato (LFO) for human breath feel
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(4.5, now);
  lfoGain.gain.setValueAtTime(4, now);
  lfo.connect(oscFundamental.frequency);

  // Lowpass filter to ensure silky warmth
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(950, now);

  oscFundamental.connect(filter);
  oscOvertone.connect(overtoneGain);
  overtoneGain.connect(filter);
  filter.connect(masterGain);

  lfo.start(now);
  oscFundamental.start(now);
  oscOvertone.start(now);

  lfo.stop(now + 1.8);
  oscFundamental.stop(now + 1.8);
  oscOvertone.stop(now + 1.8);
}

/**
 * Sweet celebratory Dhaak beat for blessing/flower shower
 */
export function playDhaakBeat() {
  playDhaakSound();
}

/**
 * Gentle festive BGM - soft temple Santoor / Tanpura tones
 */
export function toggleFestiveBGM(isPlaying: boolean) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (isPlaying) {
      if (bgmInterval) return;
      bgmContext = ctx;
      
      // Sweet pentatonic Indian classical raag notes (Bhairavi / Durga)
      const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      let noteIdx = 0;

      bgmInterval = setInterval(() => {
        if (!bgmContext) return;
        const now = bgmContext.currentTime;

        const osc = bgmContext.createOscillator();
        const gain = bgmContext.createGain();
        const filter = bgmContext.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIdx], now);
        noteIdx = (noteIdx + 1) % notes.length;

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(bgmContext.destination);

        osc.start(now);
        osc.stop(now + 1.5);
      }, 1400);
    } else {
      if (bgmInterval) {
        clearInterval(bgmInterval);
        bgmInterval = null;
      }
      if (bgmContext) {
        bgmContext.close();
        bgmContext = null;
      }
    }
  } catch (e) {
    console.log("BGM toggle failed", e);
  }
}
