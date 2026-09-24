/* ==========================================================================
   LEFT RIGHT — boot
   Loads after every other script (all `defer`, in order). Wires the page:
   the two fighters, the split background, the idle loop, the fight,
   milestones, copy-contract, sound, marquee and the STOP easter egg.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});
  const doc = document.documentElement;
  const $ = (id) => document.getElementById(id);
  const reducedQuery = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  /* GSAP comes from cdnjs; if that's blocked (or its SRI check fails), load
     the identical local copy instead. */
  function ensureGsap() {
    if (root.gsap) return Promise.resolve(root.gsap);
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'js/vendor/gsap.min.js';
      s.onload = () => (root.gsap ? resolve(root.gsap) : reject(new Error('GSAP missing')));
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  /* Dev aid: list any {{PLACEHOLDERS}} still in the page. */
  function warnPlaceholders() {
    const found = doc.outerHTML.match(/\{\{[A-Z0-9_]+\}\}/g);
    if (found) console.info('[LEFT RIGHT] Replace before launch:', [...new Set(found)].join(' '));
  }

  /* The disclaimer is fixed to the bottom; the hero sits above it. */
  function trackLegalHeight() {
    const legal = $('legal');
    if (!legal) return;
    const set = () => doc.style.setProperty('--legal-h', `${legal.offsetHeight}px`);
    set();
    if ('ResizeObserver' in root) new ResizeObserver(set).observe(legal);
  }

  /* ---- toast + copy ------------------------------------------------------ */

  let toastTimer = 0;
  function toast(text) {
    const t = $('toast');
    if (!t) return;
    t.textContent = text;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 1600);
  }
  LR.toast = toast;

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // no async clipboard (older browsers, some webviews): the old way
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      ta.remove();
      return ok;
    }
  }

  function bindCopy() {
    document.querySelectorAll('[data-copy]').forEach((btn) =>
      btn.addEventListener('click', async () => {
        const ok = await copyText(btn.getAttribute('data-copy'));
        toast(ok ? 'Copied.' : 'Copy failed. Select it by hand.');
      }),
    );
  }

  /* ---- sound ------------------------------------------------------------------ */

  function bindSound() {
    const btn = $('sound-btn');
    if (!btn || !LR.sound) return;
    btn.addEventListener('click', () => {
      const on = LR.sound.toggle();
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  /* ---- marquee: two identical groups, wide enough to loop on big screens --- */

  function buildMarquee() {
    const m = LR.fx.art.star.match(/ d="([^"]+)"/);
    const star = `<svg class="marquee__star" viewBox="0 0 60 60"><path d="${m ? m[1] : ''}" fill="var(--star)" stroke="var(--ink)" stroke-width="5" stroke-linejoin="round"/></svg>`;
    const item = `<span class="marquee__item"><span class="c-left">Left</span>${star}<span class="c-right">Right</span>${star}<span>Fight</span>${star}</span>`;
    document.querySelectorAll('[data-marquee]').forEach((g) => (g.innerHTML = item.repeat(8)));
  }

  /* ---- split: the seam always runs between the two fighters ----------------- */

  function splitGeometry(bgEl, arenaEl) {
    return (w, h) => {
      const bg = bgEl.getBoundingClientRect();
      const a = arenaEl.getBoundingClientRect();
      if (!bg.width || !a.width || !a.height) return { from: [0.54, 0], to: [0.46, 1], corners: [[1, 1], [1, 0]] };
      const cx = a.left + a.width / 2 - bg.left;
      const cy = a.top + a.height / 2 - bg.top;
      if (a.width / a.height >= LR.fight.STACK_RATIO) {
        // side by side: a near-vertical seam, tilted 5°
        const tilt = Math.tan((5 * Math.PI) / 180);
        return { from: [(cx + tilt * cy) / w, 0], to: [(cx - tilt * (h - cy)) / w, 1], corners: [[1, 1], [1, 0]] };
      }
      // stacked: along the arena's other diagonal, red top-left, blue bottom-right
      const k = a.height / a.width;
      return { from: [1, (cy - (w - cx) * k) / h], to: [0, (cy + cx * k) / h], corners: [[0, 1], [1, 1]] };
    };
  }

  /* ---- easter egg: type STOP ----------------------------------------------------- */

  function bindEasterEgg() {
    let typed = '';
    root.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      if (/input|textarea|select/i.test(e.target.tagName)) return;
      typed = (typed + e.key.toUpperCase()).slice(-4);
      if (typed === 'STOP') {
        typed = '';
        LR.idle.stare();
        if (LR.fight) LR.fight.freeze(2300);
      }
    });
  }

  /* ---- boot --------------------------------------------------------------------------- */

  async function boot() {
    warnPlaceholders();
    trackLegalHeight();
    bindCopy();
    bindSound();
    buildMarquee();
    bindEasterEgg();

    const hosts = { left: $('fighter-left'), right: $('fighter-right') };
    const chars = { left: LR.rig.create('left'), right: LR.rig.create('right') };
    hosts.left.appendChild(chars.left.el);
    hosts.right.appendChild(chars.right.el);

    const heroBg = $('hero-bg');
    const arena = $('arena');
    const split = LR.fx.split(heroBg, { geometry: splitGeometry(heroBg, arena) });
    if ('ResizeObserver' in root) new ResizeObserver(() => split.set({})).observe(arena);

    // cameos in THE CROWD section: a still frame of the same two
    document.querySelectorAll('[data-cameo]').forEach((slot) => {
      const c = LR.rig.create(slot.getAttribute('data-cameo'), { pose: 'yell', state: { spit: 0 } });
      slot.appendChild(c.el);
    });

    let gsap = null;
    try {
      gsap = await ensureGsap();
    } catch (err) {
      console.error('[LEFT RIGHT] GSAP failed to load; showing a still frame.', err);
    }
    if (!gsap) return;

    const reduced = reducedQuery.matches;
    LR.idle.start(chars, hosts, { reduced });
    LR.fight.init({ split, reduced });
    LR.milestones.init($('milestones'), { reduced, onUnlock: () => LR.fight.bothSwing() });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
