/* ==========================================================================
   LEFT RIGHT — art
   Static pictures of the two fighters for everything below the fight: the
   comic, the team cards, the heads peeking over sections, the stickers.
   Each one is the real rig (js/rig.js) rendered once into an <img>, so the
   page carries no extra live SVG to animate, and each renders only when it
   comes near the screen.

   Slots in the HTML:
     <span class="art" data-art="left" data-pose="yell" data-view="full"
           data-state='{"mouth":1}' data-drip='{"hat":"crown"}'></span>
     data-view: full (head to toe) | bust (to mid-coat) | head
   Decorative by default; add data-alt="…" to describe one.

   Stickers: the same art with a die-cut white border and an optional speech
   bubble, drawn on a canvas, saved as a transparent PNG.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  /* Crops of the rig (viewBox units; the rig is 400 × 460, hats reach up to
     about y = -90). */
  const VIEWS = {
    full: [-30, -95, 460, 560],
    bust: [-20, -95, 440, 455],
    head: [-5, -95, 410, 410],
  };

  const urls = new Map();

  /** SVG markup of one fighter in a pose, cropped to a view. */
  function svg(team, o = {}) {
    const c = LR.rig.create(team, {
      pose: o.pose || 'idle',
      static: true,
      state: Object.assign({ spit: 0 }, o.state),
      drip: o.drip || undefined,
    });
    const vb = VIEWS[o.view] || VIEWS.full;
    const W = o.width || 600;
    const H = Math.round((W * vb[3]) / vb[2]);
    const markup = c.toSVG({ width: W, height: H, viewBox: vb.join(' '), outline: (W / vb[2]) * (o.outline || 4.2) });
    return { markup, W, H };
  }

  /** A blob URL for that picture (cached: the same art is drawn once). */
  function url(team, o = {}) {
    const key = JSON.stringify([team, o.pose, o.state, o.drip, o.view, o.width]);
    if (!urls.has(key)) {
      const { markup } = svg(team, o);
      urls.set(key, URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' })));
    }
    return urls.get(key);
  }

  const parse = (s) => {
    if (!s) return undefined;
    try {
      return JSON.parse(s);
    } catch {
      return undefined;
    }
  };

  /** Fill one slot with its picture. */
  function render(slot) {
    if (!slot || slot.dataset.rendered) return;
    slot.dataset.rendered = '1';
    const team = slot.dataset.art === 'right' ? 'right' : 'left';
    const img = new Image();
    img.decoding = 'async';
    img.draggable = false;
    img.alt = slot.dataset.alt || '';
    if (!slot.dataset.alt) img.setAttribute('aria-hidden', 'true');
    img.src = url(team, {
      pose: slot.dataset.pose || 'idle',
      view: slot.dataset.view || 'full',
      state: parse(slot.dataset.state),
      drip: parse(slot.dataset.drip),
      width: Number(slot.dataset.width) || 600,
    });
    slot.appendChild(img);
  }

  /* ---- stickers -------------------------------------------------------- */

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  /**
   * A die-cut sticker on a transparent canvas.
   * @param {{team: string, pose?: string, state?: object, drip?: object, say?: string}} s
   */
  async function sticker(s, size = 512) {
    if (document.fonts && document.fonts.load) {
      try {
        await document.fonts.load('400 60px "Bowlby One"');
      } catch {
        /* fallback font is fine */
      }
    }
    const S = size;
    const art = await loadImage(url(s.team, { pose: s.pose, state: s.state, drip: s.drip, view: 'bust', width: 720 }));
    // 1. the picture (+ its speech bubble) on its own layer
    const layer = document.createElement('canvas');
    layer.width = S;
    layer.height = S;
    const lc = layer.getContext('2d');
    const pad = S * 0.07;
    const w = S - pad * 2;
    const h = (w * art.height) / art.width;
    const ax = pad;
    const ay = S - pad - h;
    lc.drawImage(art, ax, ay, w, h);
    if (s.say) {
      const ink = cssVar('--ink');
      // shrink a long line until it fits the bubble
      const maxTw = S - pad * 2 - S * 0.09;
      let fs = Math.round(S * 0.085);
      let tw = 0;
      for (; fs > S * 0.04; fs--) {
        lc.font = `400 ${fs}px "Bowlby One", "Arial Black", sans-serif`;
        tw = lc.measureText(s.say).width;
        if (tw <= maxTw) break;
      }
      const bw = Math.min(S - pad * 2, tw + S * 0.09);
      const bh = S * 0.15;
      const left = s.team === 'left';
      const bx = left ? S - pad - bw : pad;
      const by = pad * 0.6;
      lc.fillStyle = ink;
      roundRect(lc, bx, by + 6, bw, bh, bh * 0.36);
      lc.fill();
      lc.fillStyle = cssVar('--paper');
      lc.strokeStyle = ink;
      lc.lineWidth = S * 0.012;
      roundRect(lc, bx, by, bw, bh, bh * 0.36);
      lc.fill();
      lc.stroke();
      // tail toward the mouth
      const tx = left ? bx + bw * 0.26 : bx + bw * 0.74;
      lc.beginPath();
      lc.moveTo(tx - S * 0.03, by + bh - 2);
      lc.lineTo(tx + (left ? -S * 0.05 : S * 0.05), by + bh + S * 0.07);
      lc.lineTo(tx + S * 0.03, by + bh - 2);
      lc.closePath();
      lc.fill();
      lc.stroke();
      lc.fillStyle = cssVar('--paper');
      lc.fillRect(tx - S * 0.026, by + bh - lc.lineWidth * 1.4, S * 0.052, lc.lineWidth * 2);
      lc.fillStyle = ink;
      lc.textAlign = 'center';
      lc.textBaseline = 'middle';
      lc.fillText(s.say, bx + bw / 2, by + bh / 2 + S * 0.006);
    }
    // 2. a silhouette of that layer, for the border
    const sil = document.createElement('canvas');
    sil.width = S;
    sil.height = S;
    const sc = sil.getContext('2d');
    sc.drawImage(layer, 0, 0);
    sc.globalCompositeOperation = 'source-in';
    sc.fillStyle = '#fff';
    sc.fillRect(0, 0, S, S);
    const ink = document.createElement('canvas');
    ink.width = S;
    ink.height = S;
    const ic = ink.getContext('2d');
    ic.drawImage(layer, 0, 0);
    ic.globalCompositeOperation = 'source-in';
    ic.fillStyle = cssVar('--ink');
    ic.fillRect(0, 0, S, S);
    // 3. stamp: ink rim, white border, picture
    const out = document.createElement('canvas');
    out.width = S;
    out.height = S;
    const oc = out.getContext('2d');
    const ring = (src, r, steps) => {
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        oc.drawImage(src, Math.cos(a) * r, Math.sin(a) * r);
      }
    };
    ring(ink, S * 0.034, 28);
    ring(sil, S * 0.028, 28);
    oc.drawImage(sil, 0, 0);
    oc.drawImage(layer, 0, 0);
    return out;
  }

  async function saveSticker(s, name) {
    try {
      const c = await sticker(s, 768);
      const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('canvas export failed');
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `left-right-sticker-${name}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 5000);
      if (LR.toast) LR.toast('Sticker saved.');
    } catch (err) {
      console.error('[sticker]', err);
      if (LR.toast) LR.toast('Save failed. Try again.');
    }
  }

  LR.art = {
    VIEWS,
    svg,
    url,
    render,
    sticker,
    saveSticker,
    /** Render every [data-art] slot as it nears the screen. */
    init() {
      const slots = [...document.querySelectorAll('[data-art]')];
      if (!('IntersectionObserver' in root)) {
        slots.forEach(render);
        return;
      }
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            render(e.target);
          }),
        { rootMargin: '900px 0px' },
      );
      slots.forEach((s) => io.observe(s));
    },
  };
})(window);
