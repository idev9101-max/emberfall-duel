let ctx = null;
let enabled = true;

function getCtx() {
  if (!enabled) return null;
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function blip(freq = 440, duration = 0.08, type = 'sine', gain = 0.04, slide = 0) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), c.currentTime + duration);
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration + 0.02);
}

export const sfx = {
  play() { blip(520, 0.09, 'triangle', 0.045, 120); },
  attack() { blip(180, 0.12, 'sawtooth', 0.035, -60); },
  draw() { blip(660, 0.05, 'sine', 0.025, 80); },
  win() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => blip(f, 0.18, 'triangle', 0.04, 20), i * 90)); },
  loss() { [392, 330, 262, 196].forEach((f, i) => setTimeout(() => blip(f, 0.22, 'sawtooth', 0.03, -20), i * 110)); },
  click() { blip(440, 0.04, 'square', 0.015, 0); },
};

export function setSoundEnabled(v) { enabled = !!v; }
export function soundEnabled() { return enabled; }
export function unlockAudio() { getCtx(); }
