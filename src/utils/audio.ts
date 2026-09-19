// Authentic Bengali Durga Puja Audio Engine
// Features original recorded Dhaak (ঢাক), Shankh (শাঁখ), and Mahalaya/Devi Vandana BGM (মহালয়া ও আগমনী গান)
// Strictly enforces single, exclusive audio playback: Only one sound/track plays at a time.

export type ActiveSoundType = 'bgm' | 'dhaak' | 'shankh' | null;

let bgmAudio: HTMLAudioElement | null = null;
let dhaakAudio: HTMLAudioElement | null = null;
let shankhAudio: HTMLAudioElement | null = null;
let shortAudio: HTMLAudioElement | null = null;

let isBgmActive = false;
let currentTrack: 'mahalaya' | 'dhaak' = 'mahalaya';
let activeSound: ActiveSoundType = null;

const TRACK_PATHS = {
  mahalaya: '/audio/festive_bgm.mp3',
  dhaak: '/audio/dhaak.mp3',
  dhaakShort: '/audio/dhaak_short.mp3',
  shankh: '/audio/shankh.mp3'
};

// Fallback Web Audio API synthesizer in case external audio is blocked
function getAudioContext(): AudioContext | null {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    return new AudioCtx();
  } catch (e) {
    return null;
  }
}

function playSynthesizedDhaak() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Rim strike
  const rimOsc = ctx.createOscillator();
  const rimGain = ctx.createGain();
  rimOsc.type = 'triangle';
  rimOsc.frequency.setValueAtTime(680, now);
  rimGain.gain.setValueAtTime(0.15, now);
  rimGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  rimOsc.connect(rimGain);
  rimGain.connect(ctx.destination);
  rimOsc.start(now);
  rimOsc.stop(now + 0.09);

  // Bass thump
  const bassOsc = ctx.createOscillator();
  const bassGain = ctx.createGain();
  bassOsc.type = 'sine';
  bassOsc.frequency.setValueAtTime(120, now + 0.05);
  bassOsc.frequency.exponentialRampToValueAtTime(55, now + 0.25);
  bassGain.gain.setValueAtTime(0.25, now + 0.05);
  bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  bassOsc.connect(bassGain);
  bassGain.connect(ctx.destination);
  bassOsc.start(now + 0.05);
  bassOsc.stop(now + 0.36);
}

function playSynthesizedShankh() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(460, now + 0.4);
  gain.gain.setValueAtTime(0.01, now);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.4);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 1.8);
}

/**
 * Stops all currently playing audio sources except the specified one.
 * Ensures strictly one audio plays at any time.
 */
export function stopAllAudio(except?: ActiveSoundType) {
  // Stop BGM if not exempt
  if (except !== 'bgm') {
    if (bgmAudio) {
      bgmAudio.pause();
    }
    isBgmActive = false;
  }

  // Stop Dhaak if not exempt
  if (except !== 'dhaak') {
    if (dhaakAudio) {
      dhaakAudio.pause();
      dhaakAudio.currentTime = 0;
    }
    if (shortAudio) {
      shortAudio.pause();
      shortAudio.currentTime = 0;
    }
  }

  // Stop Shankh if not exempt
  if (except !== 'shankh') {
    if (shankhAudio) {
      shankhAudio.pause();
      shankhAudio.currentTime = 0;
    }
  }

  activeSound = except || null;
  notifySoundStateChange();
}

/**
 * Plays the original live Durga Puja Dhaak beats exclusively.
 * If already playing, clicking again stops it (toggle behavior).
 */
export function playDhaakSound() {
  try {
    // If Dhaak is currently playing, toggle it off
    if (dhaakAudio && !dhaakAudio.paused) {
      stopAllAudio(null);
      return;
    }

    // Stop all other audio (BGM, Shankh)
    stopAllAudio('dhaak');

    if (!dhaakAudio) {
      dhaakAudio = new Audio(TRACK_PATHS.dhaak);
      dhaakAudio.volume = 0.85;
      dhaakAudio.addEventListener('ended', () => {
        if (activeSound === 'dhaak') {
          activeSound = null;
          notifySoundStateChange();
        }
      });
    }
    dhaakAudio.currentTime = 0;
    activeSound = 'dhaak';
    notifySoundStateChange();

    const promise = dhaakAudio.play();
    if (promise) {
      promise.catch((err) => {
        console.warn("Real Dhaak audio playback note:", err);
        playSynthesizedDhaak();
      });
    }
  } catch (e) {
    playSynthesizedDhaak();
  }
}

/**
 * Plays short authentic Dhaak beat (ideal for flower shower & celebration).
 * Stops other sounds so it is heard clearly.
 */
export function playDhaakBeat() {
  try {
    stopAllAudio('dhaak');

    if (!shortAudio) {
      shortAudio = new Audio(TRACK_PATHS.dhaakShort);
      shortAudio.volume = 0.75;
      shortAudio.addEventListener('ended', () => {
        if (activeSound === 'dhaak') {
          activeSound = null;
          notifySoundStateChange();
        }
      });
    }
    shortAudio.currentTime = 0;
    activeSound = 'dhaak';
    notifySoundStateChange();

    const promise = shortAudio.play();
    if (promise) {
      promise.catch(() => playSynthesizedDhaak());
    }
  } catch (e) {
    playSynthesizedDhaak();
  }
}

/**
 * Plays the original authentic sacred Shankho (conch shell horn) sound exclusively.
 * If already playing, clicking again stops it.
 */
export function playShankhoSound() {
  try {
    // If Shankh is currently playing, toggle it off
    if (shankhAudio && !shankhAudio.paused) {
      stopAllAudio(null);
      return;
    }

    // Stop all other audio (BGM, Dhaak)
    stopAllAudio('shankh');

    if (!shankhAudio) {
      shankhAudio = new Audio(TRACK_PATHS.shankh);
      shankhAudio.volume = 0.85;
      shankhAudio.addEventListener('ended', () => {
        if (activeSound === 'shankh') {
          activeSound = null;
          notifySoundStateChange();
        }
      });
    }
    shankhAudio.currentTime = 0;
    activeSound = 'shankh';
    notifySoundStateChange();

    const promise = shankhAudio.play();
    if (promise) {
      promise.catch((err) => {
        console.warn("Real Shankh audio playback note:", err);
        playSynthesizedShankh();
      });
    }
  } catch (e) {
    playSynthesizedShankh();
  }
}

/**
 * Toggles or plays the original festive background music (মহালয়া / দুর্গাপূজা আবহ সঙ্গীত).
 * Stops any Dhaak or Shankh playing before starting BGM.
 */
export function toggleFestiveBGM(isPlaying: boolean, trackName?: 'mahalaya' | 'dhaak') {
  try {
    if (trackName && trackName !== currentTrack) {
      currentTrack = trackName;
      if (bgmAudio) {
        bgmAudio.pause();
        bgmAudio = null;
      }
    }

    if (isPlaying) {
      // Exclusively stop any other audio before starting BGM
      stopAllAudio('bgm');

      if (!bgmAudio) {
        bgmAudio = new Audio(TRACK_PATHS[currentTrack]);
        bgmAudio.loop = true;
        bgmAudio.volume = currentTrack === 'dhaak' ? 0.6 : 0.45;
      }
      isBgmActive = true;
      activeSound = 'bgm';
      notifySoundStateChange();

      const promise = bgmAudio.play();
      if (promise) {
        promise.then(() => {
          isBgmActive = true;
          activeSound = 'bgm';
          notifySoundStateChange();
        }).catch((err) => {
          console.warn("BGM autoplay policy note:", err);
          isBgmActive = false;
          activeSound = null;
          notifySoundStateChange();
        });
      }
    } else {
      stopAllAudio(null);
    }
  } catch (e) {
    console.warn("Toggle BGM error:", e);
    stopAllAudio(null);
  }
}

/**
 * Change the active background music track
 */
export function setBGMTrack(trackName: 'mahalaya' | 'dhaak') {
  const wasPlaying = isBgmActive;
  currentTrack = trackName;
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio = null;
  }
  if (wasPlaying) {
    toggleFestiveBGM(true, trackName);
  } else {
    notifySoundStateChange();
  }
}

export function getCurrentBGMTrack(): 'mahalaya' | 'dhaak' {
  return currentTrack;
}

export function getActiveSound(): ActiveSoundType {
  return activeSound;
}

export function isFestiveBGMPlaying(): boolean {
  return isBgmActive && !!bgmAudio && !bgmAudio.paused;
}

function notifySoundStateChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('festive-sound-update', {
        detail: {
          activeSound,
          isBgmActive,
          track: currentTrack,
        }
      })
    );
    // Legacy event for existing listeners
    window.dispatchEvent(
      new CustomEvent('festive-bgm-update', {
        detail: {
          isPlaying: isBgmActive,
          track: currentTrack,
        }
      })
    );
  }
}
