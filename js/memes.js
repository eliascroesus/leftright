/* ==========================================================================
   LEFT RIGHT — memes
   A meme maker and a meme wall, drawn in the browser on a canvas from the
   same character rig as the fight (wearing your airdropped drip). Nothing
   is uploaded. Formats are classic internet ones; the art and the captions
   are original, about arguing, the group chat and crypto culture, never
   about prices, gains or real politics.
   Add a caption: push it into a template's `captions` list below.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});
  const S = 1080; // output size, square
  const FONT = '"Bowlby One", "Arial Black", Impact, sans-serif';
  const BODY = '"Inter", system-ui, sans-serif';

  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const oneOf = (list) => list[Math.floor(Math.random() * list.length)];

  /* ---- templates -------------------------------------------------------------
     slots: the text fields; captions: ready-made sets (shuffle picks one);
     solo: one fighter (the side toggle picks which). */
  const TEMPLATES = [
    {
      id: 'classic', name: 'Top / bottom', solo: true,
      slots: [{ key: 'top', label: 'Top text' }, { key: 'bottom', label: 'Bottom text' }],
      captions: [
        { top: 'GM', bottom: '(YELLED AT 3 AM)' },
        { top: 'SER', bottom: 'THIS IS A GROUP CHAT' },
        { top: "I'M NOT YELLING", bottom: 'THIS IS MY INSIDE VOICE' },
        { top: 'WHEN THEY SAY', bottom: '"IT\'S JUST A MEME"' },
        { top: 'ME EXPLAINING', bottom: "THAT I'M NOT MAD" },
        { top: 'TOUCH GRASS?', bottom: 'IN THIS ECONOMY?' },
      ],
    },
    {
      id: 'versus', name: 'Versus',
      slots: [{ key: 'top', label: 'Caption' }, { key: 'left', label: 'Lefty says' }, { key: 'right', label: 'Righty says' }],
      captions: [
        { top: 'THE GROUP CHAT AT 3 AM', left: 'LEFT', right: 'RIGHT' },
        { top: '', left: "WE'RE SO BACK", right: "IT'S SO OVER" },
        { top: 'FAMILY DINNER', left: 'SOURCE?', right: 'TRUST ME BRO' },
        { top: 'ME AND MY BEST FRIEND', left: 'AGREED', right: 'AGREED (LOUDER)' },
        { top: 'EVERY MORNING', left: 'GM', right: 'GM (ANGRY)' },
      ],
    },
    {
      id: 'nobody', name: 'Nobody:', solo: true,
      slots: [{ key: 'one', label: 'Line 1' }, { key: 'two', label: 'Line 2' }],
      captions: [
        { one: 'Nobody:', two: 'Lefty at 3 am:' },
        { one: 'Absolutely nobody:', two: 'Righty:' },
        { one: 'Not a single soul:', two: 'The reply guy:' },
        { one: 'Nobody:', two: 'Me in the group chat:' },
      ],
    },
    {
      id: 'twopanel', name: 'Nah / yes', solo: true,
      slots: [{ key: 'no', label: 'Nah' }, { key: 'yes', label: 'Yes' }],
      captions: [
        { no: 'READING THE WHITEPAPER', yes: 'YELLING IN THE REPLIES' },
        { no: 'LISTENING', yes: 'WAITING FOR MY TURN TO TALK' },
        { no: 'AGREEING', yes: 'AGREEING, BUT ANGRIER' },
        { no: 'LOGGING OFF', yes: 'ONE MORE REPLY' },
      ],
    },
    {
      id: 'stare', name: 'The stare',
      slots: [{ key: 'top', label: 'Top text' }, { key: 'bottom', label: 'Bottom text' }],
      captions: [
        { top: 'US WHEN YOU SCROLL PAST', bottom: 'WITHOUT PICKING A SIDE' },
        { top: 'WHEN SOMEONE ASKS', bottom: 'WHAT IT ACTUALLY DOES' },
        { top: 'THE GROUP CHAT WHEN YOU SAY', bottom: '"BOTH SIDES HAVE A POINT"' },
        { top: 'WHEN YOU TYPE', bottom: 'STOP' },
      ],
    },
    {
      id: 'steam', name: 'Full steam', solo: true,
      slots: [{ key: 'top', label: 'Top text' }, { key: 'bottom', label: 'Bottom text' }],
      captions: [
        { top: 'ME AFTER', bottom: 'ONE (1) REPLY' },
        { top: 'MY FACE WHEN', bottom: 'THEY START WITH "ACTUALLY"' },
        { top: 'DAY 1 OF', bottom: 'NOT ARGUING' },
        { top: 'RAGE LEVEL:', bottom: 'GROUP CHAT' },
      ],
    },
  ];

  /* The wall: one ready-made meme per template (remix any of them). */
  const WALL = [
    { tpl: 'versus', cap: 1 },
    { tpl: 'classic', cap: 1, team: 'right' },
    { tpl: 'twopanel', cap: 0, team: 'left' },
    { tpl: 'stare', cap: 0 },
    { tpl: 'nobody', cap: 0, team: 'left' },
    { tpl: 'steam', cap: 0, team: 'right' },
  ];

  const tpl = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];

  /* ---- drawing ------------------------------------------------------------------ */

  const images = new Map();
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /* A fighter as an image (cached: typing re-renders text, not the art). */
  function fighter(team, pose, state, w) {
    const side = LR.fight && LR.fight.side;
    const drip = LR.drops && side === team ? LR.drops.equipped() : null;
    const key = JSON.stringify([team, pose, state, w, drip]);
    if (!images.has(key)) {
      const c = LR.rig.create(team, { pose, static: true, state: Object.assign({ spit: 0 }, state), drip: drip || undefined });
      const h = Math.round((w * 470) / 440);
      const svg = c.toSVG({ width: w, height: h, viewBox: '-20 -40 440 470', outline: (w / 440) * 4.2 });
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      images.set(key, loadImage(url).finally(() => URL.revokeObjectURL(url)));
    }
    return images.get(key);
  }

  function sunburst(ctx, team) {
    ctx.fillStyle = cssVar(team === 'left' ? '--red-bg' : '--blue-bg');
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = cssVar(team === 'left' ? '--red-bg-2' : '--blue-bg-2');
    const cx = S / 2;
    const cy = S * 0.58;
    for (let i = 0; i < 18; i++) {
      const a0 = (i / 18) * Math.PI * 2;
      const a1 = ((i + 0.5) / 18) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + S * 1.4 * Math.cos(a0), cy + S * 1.4 * Math.sin(a0));
      ctx.lineTo(cx + S * 1.4 * Math.cos(a1), cy + S * 1.4 * Math.sin(a1));
      ctx.fill();
    }
  }

  function split(ctx) {
    ctx.fillStyle = cssVar('--red-bg');
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = cssVar('--blue-bg');
    ctx.beginPath();
    ctx.moveTo(S * 0.56, 0);
    ctx.lineTo(S, 0);
    ctx.lineTo(S, S);
    ctx.lineTo(S * 0.44, S);
    ctx.fill();
    ctx.strokeStyle = cssVar('--ink');
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(S * 0.56, -10);
    ctx.lineTo(S * 0.44, S + 10);
    ctx.stroke();
  }

  function grain(ctx) {
    for (let i = 0; i < 7000; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.05)';
      ctx.fillRect(Math.random() * S, Math.random() * S, 2, 2);
    }
  }

  /* Wrap and shrink text to fit `maxLines` lines of `maxW`: one line if it
     fits at 70% of the full size or more, then two lines, and so on. */
  function fit(ctx, text, maxW, maxLines, size, min, family, weight = 400) {
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const wrap = (s) => {
      ctx.font = `${weight} ${s}px ${family}`;
      const lines = [];
      let line = '';
      words.forEach((w) => {
        const next = line ? `${line} ${w}` : w;
        if (ctx.measureText(next).width <= maxW || !line) line = next;
        else {
          lines.push(line);
          line = w;
        }
      });
      if (line) lines.push(line);
      return lines;
    };
    for (let n = 1; n <= maxLines; n++) {
      const floor = n < maxLines ? Math.max(min, size * 0.7) : min;
      for (let s = size; s >= floor; s -= 4) {
        const lines = wrap(s);
        if (lines.length <= n && lines.every((l) => ctx.measureText(l).width <= maxW)) return { size: s, lines };
      }
    }
    ctx.font = `${weight} ${min}px ${family}`;
    return { size: min, lines: [words.join(' ')] };
  }

  /* Meme text: cream letters, thick ink outline. anchor: 'top' | 'bottom' | 'middle'. */
  function caption(ctx, text, x, y, maxW, anchor = 'top', size = 104, maxLines = 2) {
    if (!text) return;
    const { size: s, lines } = fit(ctx, String(text).toUpperCase(), maxW, maxLines, size, 44, FONT);
    const lh = s * 1.02;
    const total = lh * lines.length;
    let y0 = anchor === 'top' ? y : anchor === 'bottom' ? y - total : y - total / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.lineJoin = 'round';
    lines.forEach((l) => {
      ctx.lineWidth = s * 0.2;
      ctx.strokeStyle = cssVar('--ink');
      ctx.strokeText(l, x, y0 + s * 0.06);
      ctx.fillStyle = cssVar('--paper');
      ctx.fillText(l, x, y0);
      y0 += lh;
    });
  }

  function watermark(ctx) {
    const t = (document.querySelector('.ticker') || {}).textContent || 'LEFT RIGHT';
    ctx.font = `400 34px ${FONT}`;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 8;
    ctx.strokeStyle = cssVar('--ink');
    ctx.strokeText(t.trim(), S - 28, S - 22);
    ctx.fillStyle = cssVar('--star');
    ctx.fillText(t.trim(), S - 28, S - 22);
  }

  async function fonts() {
    if (!document.fonts || !document.fonts.load) return;
    try {
      await Promise.all([document.fonts.load(`400 80px ${FONT}`), document.fonts.load(`800 60px ${BODY}`)]);
    } catch {
      /* fallbacks are fine */
    }
  }

  const DRAW = {
    async classic(ctx, d, team) {
      sunburst(ctx, team);
      const img = await fighter(team, 'yell', { mouth: 1, armL: 64, armR: 50, rage: 0.4 }, 900);
      ctx.drawImage(img, S * 0.08, S - img.height + 70);
      grain(ctx);
      caption(ctx, d.top, S / 2, 36, S - 80, 'top');
      caption(ctx, d.bottom, S / 2, S - 72, S - 80, 'bottom');
    },
    async versus(ctx, d) {
      split(ctx);
      const [l, r] = await Promise.all([
        fighter('left', 'yell', { mouth: 1, armL: 66, armR: 46, lean: 12 }, 580),
        fighter('right', 'yell', { mouth: 1, armL: 60, armR: 40, lean: 12 }, 580),
      ]);
      ctx.drawImage(l, -50, S - l.height + 40);
      ctx.drawImage(r, S - r.width + 50, S - r.height + 40);
      grain(ctx);
      caption(ctx, d.top, S / 2, 34, S - 80, 'top', 92);
      caption(ctx, d.left, S * 0.25, S * (d.top ? 0.27 : 0.12), S * 0.44, 'top', 86, 3);
      caption(ctx, d.right, S * 0.75, S * (d.top ? 0.27 : 0.12), S * 0.44, 'top', 86, 3);
    },
    async nobody(ctx, d, team) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, S, S);
      ctx.fillStyle = cssVar('--ink');
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const a = fit(ctx, d.one, S - 120, 1, 66, 30, BODY, 800);
      const b = fit(ctx, d.two, S - 120, 1, 66, 30, BODY, 800);
      const size = Math.min(a.size, b.size);
      ctx.font = `800 ${size}px ${BODY}`;
      ctx.fillText(String(d.one || ''), 60, 56);
      ctx.fillText(String(d.two || ''), 60, 56 + size * 1.5);
      ctx.fillStyle = cssVar(team === 'left' ? '--red-bg' : '--blue-bg');
      ctx.fillRect(60, S * 0.26, S - 120, S * 0.7);
      const img = await fighter(team, 'yell', { mouth: 1, spit: 0.55, armL: 72, armR: 60, lean: 14, rage: 0.9, browL: 6, browR: 7 }, 760);
      ctx.save();
      ctx.beginPath();
      ctx.rect(60, S * 0.26, S - 120, S * 0.7);
      ctx.clip();
      ctx.drawImage(img, (S - img.width) / 2, S * 0.96 - img.height + 60);
      ctx.restore();
      ctx.lineWidth = 8;
      ctx.strokeStyle = cssVar('--ink');
      ctx.strokeRect(60, S * 0.26, S - 120, S * 0.7);
    },
    async twopanel(ctx, d, team) {
      const half = S / 2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, S, S);
      ctx.fillStyle = cssVar(team === 'left' ? '--red-bg' : '--blue-bg');
      ctx.fillRect(0, 0, half, S);
      const [no, yes] = await Promise.all([
        fighter(team, 'flinch', { mouth: 0.15, blink: 0.9, headRot: -14, lean: -10, armL: 72, armR: 80 }, 520),
        fighter(team, 'victory', { mouth: 1, armL: 70, armR: 62, lean: 8 }, 520),
      ]);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, half, half);
      ctx.clip();
      ctx.drawImage(no, -10, half - no.height + 40);
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, half, half, half);
      ctx.clip();
      ctx.drawImage(yes, -10, S - yes.height + 40);
      ctx.restore();
      ctx.strokeStyle = cssVar('--ink');
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(0, half);
      ctx.lineTo(S, half);
      ctx.moveTo(half, 0);
      ctx.lineTo(half, S);
      ctx.stroke();
      [['no', half / 2], ['yes', half + half / 2]].forEach(([k, cy]) => {
        const { size, lines } = fit(ctx, String(d[k] || '').toUpperCase(), half - 70, 4, 68, 30, FONT);
        ctx.font = `400 ${size}px ${FONT}`;
        ctx.fillStyle = cssVar('--ink');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const lh = size * 1.08;
        lines.forEach((l, i) => ctx.fillText(l, half + half / 2, cy + (i - (lines.length - 1) / 2) * lh));
      });
    },
    async stare(ctx, d) {
      split(ctx);
      const cam = { turn: 1, mouth: 0.08, lookX: 0, lookY: 0, browL: -8, browR: -6, browTiltL: -10, browTiltR: 10, lean: 1, armL: -36, armR: -36, rage: 0 };
      const [l, r] = await Promise.all([fighter('left', 'camera', cam, 600), fighter('right', 'camera', cam, 600)]);
      ctx.drawImage(l, -10, S - l.height + 30);
      ctx.drawImage(r, S - r.width + 10, S - r.height + 30);
      grain(ctx);
      caption(ctx, d.top, S / 2, 34, S - 80, 'top', 92);
      caption(ctx, d.bottom, S / 2, S - 72, S - 80, 'bottom', 92);
    },
    async steam(ctx, d, team) {
      sunburst(ctx, team);
      const img = await fighter(team, 'steam', { rage: 1, throb: 1, steam: 0.62, mouth: 0.9, browL: 6, browR: 7 }, 880);
      ctx.drawImage(img, (S - img.width) / 2, S - img.height + 60);
      grain(ctx);
      caption(ctx, d.top, S / 2, 36, S - 80, 'top');
      caption(ctx, d.bottom, S / 2, S - 72, S - 80, 'bottom');
    },
  };

  /** Draw a meme onto `canvas` (full 1080 px; CSS scales it). */
  async function render(canvas, id, data, team) {
    await fonts();
    canvas.width = S;
    canvas.height = S;
    const ctx = canvas.getContext('2d');
    await DRAW[tpl(id).id](ctx, data, team || 'left');
    watermark(ctx);
    return canvas;
  }

  /* ---- the maker ------------------------------------------------------------------ */

  const state = { tpl: 'classic', data: Object.assign({}, TEMPLATES[0].captions[0]), team: null, busy: 0 };
  let el = {};
  let ready = false;

  const teamNow = () => state.team || (LR.fight && LR.fight.side) || 'left';

  function renderFields() {
    const t = tpl(state.tpl);
    el.fields.textContent = '';
    t.slots.forEach((slot) => {
      const label = document.createElement('label');
      label.className = 'meme-field';
      const span = document.createElement('span');
      span.textContent = slot.label;
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 60;
      input.value = state.data[slot.key] || '';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.addEventListener('input', () => {
        state.data[slot.key] = input.value;
        draw();
      });
      label.append(span, input);
      el.fields.appendChild(label);
    });
    el.sideRow.hidden = !t.solo;
    el.tpls.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tpl === state.tpl)));
    el.sides.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.side === teamNow())));
  }

  let drawQueued = false;
  function draw() {
    if (!ready || drawQueued) return;
    drawQueued = true;
    root.requestAnimationFrame(async () => {
      drawQueued = false;
      const n = ++state.busy;
      const off = document.createElement('canvas');
      await render(off, state.tpl, state.data, teamNow());
      if (n !== state.busy) return; // a newer draw finished first
      const ctx = el.canvas.getContext('2d');
      el.canvas.width = S;
      el.canvas.height = S;
      ctx.drawImage(off, 0, 0);
      const t = tpl(state.tpl);
      el.canvas.setAttribute('aria-label', `Meme preview, ${t.name}: ${t.slots.map((s) => state.data[s.key]).filter(Boolean).join(' / ')}`);
    });
  }

  function choose(id, data, team) {
    state.tpl = tpl(id).id;
    state.data = Object.assign({}, data || oneOf(tpl(id).captions));
    if (team) state.team = team;
    renderFields();
    draw();
  }

  function shuffle() {
    const t = tpl(state.tpl);
    const now = JSON.stringify(state.data);
    let next = oneOf(t.captions);
    for (let i = 0; i < 5 && JSON.stringify(next) === now; i++) next = oneOf(t.captions);
    state.data = Object.assign({}, next);
    renderFields();
    draw();
  }

  async function download() {
    try {
      const c = await render(document.createElement('canvas'), state.tpl, state.data, teamNow());
      const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('canvas export failed');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `left-right-meme-${state.tpl}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      if (LR.toast) LR.toast('Meme saved. Go post it.');
    } catch (err) {
      console.error('[memes]', err);
      if (LR.toast) LR.toast('Save failed. Try again.');
    }
  }

  async function copyImage() {
    try {
      if (!navigator.clipboard || !root.ClipboardItem) throw new Error('no image clipboard');
      const c = await render(document.createElement('canvas'), state.tpl, state.data, teamNow());
      const blob = await new Promise((resolve) => c.toBlob(resolve, 'image/png'));
      await navigator.clipboard.write([new root.ClipboardItem({ 'image/png': blob })]);
      if (LR.toast) LR.toast('Copied. Paste it anywhere.');
    } catch {
      if (LR.toast) LR.toast("This browser won't copy images. Use Save.");
    }
  }

  /* ---- the wall ---------------------------------------------------------------------- */

  function buildWall() {
    WALL.forEach((w, i) => {
      const t = tpl(w.tpl);
      const data = t.captions[w.cap] || t.captions[0];
      const fig = document.createElement('figure');
      fig.className = 'meme-card';
      const canvas = document.createElement('canvas');
      canvas.className = 'meme-card__img';
      canvas.width = 540;
      canvas.height = 540;
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', `${t.name} meme: ${t.slots.map((s) => data[s.key]).filter(Boolean).join(' / ')}`);
      const cap = document.createElement('figcaption');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn--sm';
      b.textContent = 'Remix';
      b.addEventListener('click', () => {
        choose(t.id, data, w.team || null);
        el.maker.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      const name = document.createElement('span');
      name.textContent = t.name;
      cap.append(name, b);
      fig.append(canvas, cap);
      el.wall.appendChild(fig);
      setTimeout(async () => {
        const full = await render(document.createElement('canvas'), t.id, data, w.team || 'left');
        canvas.getContext('2d').drawImage(full, 0, 0, 540, 540);
      }, i * 120); // one at a time, so scrolling stays smooth
    });
  }

  LR.memes = {
    TEMPLATES,
    render,
    init() {
      const $ = (id) => document.getElementById(id);
      el = {
        maker: $('meme-maker'), canvas: $('meme-canvas'), fields: $('meme-fields'), wall: $('meme-wall'),
        sideRow: $('meme-sides'), tpls: [...document.querySelectorAll('[data-tpl]')], sides: [...document.querySelectorAll('[data-meme-side]')],
      };
      if (!el.maker || !el.canvas) return;
      el.sides.forEach((b) => (b.dataset.side = b.dataset.memeSide));
      el.tpls.forEach((b) => b.addEventListener('click', () => choose(b.dataset.tpl)));
      el.sides.forEach((b) =>
        b.addEventListener('click', () => {
          state.team = b.dataset.side;
          renderFields();
          draw();
        }),
      );
      $('meme-shuffle').addEventListener('click', shuffle);
      $('meme-save').addEventListener('click', download);
      $('meme-copy').addEventListener('click', copyImage);
      renderFields();
      // Draw nothing until the section is close: the fight keeps the page to itself.
      const start = () => {
        if (ready) return;
        ready = true;
        draw();
        buildWall();
      };
      if ('IntersectionObserver' in root) {
        const io = new IntersectionObserver((entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            start();
          }
        }, { rootMargin: '600px 0px' });
        io.observe(el.maker);
      } else start();
    },
    /** Your side changed: the maker follows it (unless you picked one in the maker). */
    refresh() {
      if (!el.maker) return;
      renderFields();
      draw();
    },
  };
})(window);
