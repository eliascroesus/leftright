/* ==========================================================================
   LEFT RIGHT — PFP generator
   Draws a 1024×1024 PNG entirely in the browser: flat sunburst in your
   side's colours, your fighter mid-shout (the same rig as the page), a
   LEFT / RIGHT badge and a little paper grain. Nothing is uploaded.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});
  const SIZE = 1024;

  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

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

  async function render(team) {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    const ink = cssVar('--ink');
    const paper = cssVar('--paper');
    const bg = cssVar(team === 'left' ? '--red-bg' : '--blue-bg');
    const bg2 = cssVar(team === 'left' ? '--red-bg-2' : '--blue-bg-2');
    const teamColour = cssVar(team === 'left' ? '--red' : '--blue');

    // background + flat sunburst (wedges, no gradients)
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = bg2;
    const cx = SIZE / 2;
    const cy = SIZE * 0.56;
    const R = SIZE * 1.3;
    const N = 18;
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * Math.PI * 2;
      const a1 = ((i + 0.5) / N) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + R * Math.cos(a0), cy + R * Math.sin(a0));
      ctx.lineTo(cx + R * Math.cos(a1), cy + R * Math.sin(a1));
      ctx.closePath();
      ctx.fill();
    }

    // the fighter, mid-shout (a fresh, unmounted rig; nothing on the page moves)
    const fighter = LR.rig.create(team, {
      pose: 'yell',
      static: true,
      state: { armL: 58, armR: 48, spit: 0, mouth: 0.85 + Math.random() * 0.15, rage: 0.25 + Math.random() * 0.35, lookX: 0.35, lookY: 0.15 },
    });
    const h = Math.round((SIZE * 470) / 440);
    const svg = fighter.toSVG({ width: SIZE, height: h, viewBox: '-20 -40 440 470', outline: 9 });
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    try {
      const img = await loadImage(url);
      ctx.drawImage(img, 0, SIZE - h + 36);
    } finally {
      URL.revokeObjectURL(url);
    }

    // badge
    if (document.fonts && document.fonts.load) {
      try {
        await document.fonts.load('120px "Bowlby One"');
      } catch {
        /* falls back to Arial Black */
      }
    }
    const label = team === 'left' ? 'LEFT' : 'RIGHT';
    ctx.font = '400 124px "Bowlby One", "Arial Black", sans-serif';
    const bw = ctx.measureText(label).width + 120;
    const bh = 176;
    const bx = (SIZE - bw) / 2;
    const by = SIZE - bh - 64;
    ctx.save();
    ctx.translate(SIZE / 2, by + bh / 2);
    ctx.rotate(-0.05);
    ctx.translate(-SIZE / 2, -(by + bh / 2));
    ctx.fillStyle = ink;
    roundRect(ctx, bx, by + 18, bw, bh, 38);
    ctx.fill();
    ctx.fillStyle = teamColour;
    roundRect(ctx, bx, by, bw, bh, 38);
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = ink;
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 22;
    ctx.strokeText(label, SIZE / 2, by + bh / 2 + 10);
    ctx.fillStyle = paper;
    ctx.fillText(label, SIZE / 2, by + bh / 2 + 10);
    ctx.restore();

    // paper grain
    for (let i = 0; i < 9000; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,.07)' : 'rgba(255,255,255,.06)';
      ctx.fillRect(Math.random() * SIZE, Math.random() * SIZE, 2, 2);
    }
    return canvas;
  }

  async function download(team) {
    try {
      const canvas = await render(team);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('canvas export failed');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `left-right-${team}-pfp.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      if (LR.toast) LR.toast('PFP saved.');
    } catch (err) {
      console.error('[pfp]', err);
      if (LR.toast) LR.toast('PFP failed. Try again.');
    }
  }

  LR.pfp = { render, download };
})(window);
