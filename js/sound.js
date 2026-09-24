/* ==========================================================================
   LEFT RIGHT — sound
   Everything is synthesised with Web Audio: no files, no autoplay. Muted by
   default; the corner toggle creates the AudioContext on its first click.
     crowd   muffled crowd murmur (loops while sound is on)
     thwack  comedy punch, `power` 0–1
     bell    round bell ("ding")
     whoosh  swing
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  let ctx = null;
  let master = null;
  let crowd = null;
  let enabled = false;
  let noise = null;

  function ensureContext() {
    if (ctx) return ctx;
    const AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    noise = makeNoise(2);
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend();
      else if (enabled) ctx.resume();
    });
    return ctx;
  }

  /* Pink-ish noise buffer (Paul Kellet's filter), reused by every sound. */
  function makeNoise(seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.963 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.22;
    }
    return buf;
  }

  function noiseSource(loop) {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = !!loop;
    return src;
  }

  /* A crowd heard through a wall: two vowel-ish formant bands with slow,
     out-of-step wobble, a low-pass on top, and the odd swell. */
  function startCrowd() {
    if (crowd) return;
    const src = noiseSource(true);
    const out = ctx.createGain();
    out.gain.value = 0;
    const low = ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.value = 850;
    low.connect(out);
    out.connect(master);
    const lfos = [];
    [[380, 1.3, 0.9, 0.31], [980, 1.6, 0.5, 0.47], [640, 2.2, 0.35, 0.23]].forEach(([freq, q, gain, rate]) => {
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq;
      bp.Q.value = q;
      const g = ctx.createGain();
      g.gain.value = gain;
      src.connect(bp);
      bp.connect(g);
      g.connect(low);
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = rate;
      depth.gain.value = gain * 0.6;
      lfo.connect(depth);
      depth.connect(g.gain);
      lfo.start();
      lfos.push(lfo);
    });
    src.start();
    out.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);
    crowd = { src, out, lfos, timer: 0 };
    swell();
  }

  function swell() {
    if (!crowd) return;
    const t = ctx.currentTime;
    crowd.out.gain.cancelScheduledValues(t);
    crowd.out.gain.setTargetAtTime(0.32 + Math.random() * 0.4, t, 0.6);
    crowd.timer = setTimeout(swell, 1400 + Math.random() * 2600);
  }

  function thwack(power = 0.6) {
    const t = ctx.currentTime;
    const p = Math.max(0.2, Math.min(1, power));
    // body thump: a sine that drops in pitch
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(150 + Math.random() * 60, t);
    o.frequency.exponentialRampToValueAtTime(48, t + 0.14);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(0.9 * p, t + 0.006);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(og);
    og.connect(master);
    o.start(t);
    o.stop(t + 0.22);
    // slap: a short band of noise
    const n = noiseSource(false);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 900 + Math.random() * 900;
    bp.Q.value = 0.8;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(1.6 * p, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    n.connect(bp);
    bp.connect(ng);
    ng.connect(master);
    n.start(t, Math.random());
    n.stop(t + 0.12);
  }

  function bell(times = 1) {
    for (let k = 0; k < times; k++) {
      const t = ctx.currentTime + k * 0.18;
      [[1180, 0.5], [1760, 0.25], [2630, 0.16], [3350, 0.08]].forEach(([f, a]) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = f;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(a * 0.5, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0008, t + 1.1);
        o.connect(g);
        g.connect(master);
        o.start(t);
        o.stop(t + 1.2);
      });
    }
  }

  function whoosh() {
    const t = ctx.currentTime;
    const n = noiseSource(false);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(500, t);
    bp.frequency.exponentialRampToValueAtTime(2400, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    n.connect(bp);
    bp.connect(g);
    g.connect(master);
    n.start(t, Math.random());
    n.stop(t + 0.18);
  }

  const SOUNDS = { thwack, bell, whoosh };

  LR.sound = {
    get enabled() {
      return enabled;
    },
    /** Turn sound on/off. Returns the new state. */
    toggle(on = !enabled) {
      if (on && !ensureContext()) return false;
      enabled = on;
      if (!ctx) return enabled;
      const t = ctx.currentTime;
      if (enabled) {
        ctx.resume();
        startCrowd();
        master.gain.cancelScheduledValues(t);
        master.gain.setTargetAtTime(0.8, t, 0.08);
      } else {
        master.gain.cancelScheduledValues(t);
        master.gain.setTargetAtTime(0, t, 0.05);
      }
      return enabled;
    },
    play(name, arg) {
      if (!enabled || !ctx || !SOUNDS[name]) return;
      SOUNDS[name](arg);
    },
  };
})(window);
