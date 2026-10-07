/* ==========================================================================
   LEFT RIGHT — boot
   Loads after every other script (all `defer`, in order). Wires the page:
   the header, the two fighters, the split backgrounds, the idle loop, the
   fight, the pictures below it, the roadmap, copy-contract, sound, the
   marquees, PFP buttons and the STOP easter egg.
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

  /* The header is fixed: see-through over the fight, ink once you scroll.
     Its height (--head-h) keeps the fight and every #anchor clear of it. */
  function trackHeader() {
    const head = $('site-head');
    if (!head) return;
    const setH = () => doc.style.setProperty('--head-h', `${head.offsetHeight}px`);
    setH();
    if ('ResizeObserver' in root) new ResizeObserver(setH).observe(head);
    let scrolled = null;
    const check = () => {
      const next = root.scrollY > 10;
      if (next === scrolled) return;
      scrolled = next;
      head.classList.toggle('is-scrolled', next);
    };
    check();
    root.addEventListener('scroll', check, { passive: true });
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

  /* ---- marquees: two identical groups each, wide enough to loop on big screens --- */

  function buildMarquees() {
    const m = LR.fx.art.star.match(/ d="([^"]+)"/);
    const star = `<svg class="marquee__star" viewBox="0 0 60 60"><path d="${m ? m[1] : ''}" fill="var(--star)" stroke="var(--ink)" stroke-width="5" stroke-linejoin="round"/></svg>`;
    const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const ticker = esc(((document.querySelector('.ticker') || {}).textContent || '').trim());
    // group-chat slang only: nothing about prices or gains
    const WORDS = {
      hero: [
        [ticker, 'c-star'], ['Left', 'c-left'], ['Right', 'c-right'], ['gm', ''], ['Pick a side', ''],
        ['ser, this is a group chat', ''], ['Airdrops: cosmetic', 'c-star'], ['Memes inside', ''], ['Not financial advice', ''],
      ],
      tape: [
        ['There is no fence', ''], ['Left', ''], ['Right', ''], ['Actually', ''], ['Source?', ''], [ticker, ''],
        ['Typical', ''], ['Never log off', ''], ['gm', ''],
      ],
    };
    document.querySelectorAll('.marquee__track').forEach((track) => {
      const groups = track.querySelectorAll('[data-marquee]');
      if (!groups.length) return;
      const words = WORDS[groups[0].dataset.marquee] || WORDS.hero;
      const item = `<span class="marquee__item">${words.map(([w, c]) => `<span class="${c}">${w}</span>${star}`).join('')}</span>`;
      groups.forEach((g) => (g.innerHTML = item.repeat(3)));
      // a steady reading speed (~110 px/s) whatever the copy's length
      root.requestAnimationFrame(() => (track.style.animationDuration = `${Math.max(20, groups[0].offsetWidth / 110)}s`));
    });
  }

  /* ---- PFP buttons below the fight ------------------------------------------------ */

  function bindPfp() {
    const save = (team) => LR.pfp && LR.pfp.download(team);
    document.querySelectorAll('[data-pfp]').forEach((b) => b.addEventListener('click', () => save(b.dataset.pfp)));
    document.querySelectorAll('[data-pfp-mine]').forEach((b) =>
      b.addEventListener('click', () => {
        const side = LR.fight && LR.fight.side;
        if (side) return save(side);
        toast('Pick a side first.');
        const sides = $('sides');
        if (sides) sides.scrollIntoView({ behavior: reducedQuery.matches ? 'auto' : 'smooth' });
      }),
    );
  }

  /* ---- the site menu (phones and small laptops) ------------------------------- */

  function bindMenu() {
    const btn = $('menu-btn');
    const nav = $('topnav');
    if (!btn || !nav) return;
    const set = (open) => {
      nav.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      set(!nav.classList.contains('is-open'));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) set(false);
    });
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) set(false);
    });
    root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        set(false);
        btn.focus();
      }
    });
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

  /* The section splits: red and blue with a hand-cut seam. Pick your side's
     seam runs between the two cards (across, once they stack). */
  function sectionSplits() {
    document.querySelectorAll('[data-split]').forEach((host, i) => {
      const vs = host.querySelector('.teams__vs');
      const cards = host.querySelectorAll('.team');
      const geometry = (w, h) => {
        const tilt = Math.tan((4 * Math.PI) / 180);
        if (!vs || !vs.offsetWidth || cards.length !== 2) return { from: [0.53, 0], to: [0.47, 1], corners: [[1, 1], [1, 0]] };
        const hb = host.getBoundingClientRect();
        const b = vs.getBoundingClientRect();
        const cx = b.left + b.width / 2 - hb.left;
        const cy = b.top + b.height / 2 - hb.top;
        if (cards[1].getBoundingClientRect().top >= cards[0].getBoundingClientRect().bottom - 8) {
          // stacked cards: the seam runs across, through the VS
          return { from: [0, (cy + (tilt * w) / 2) / h], to: [1, (cy - (tilt * w) / 2) / h], corners: [[1, 1], [0, 1]] };
        }
        return { from: [(cx + tilt * cy) / w, 0], to: [(cx - tilt * (h - cy)) / w, 1], corners: [[1, 1], [1, 0]] };
      };
      LR.fx.split(host, { geometry, seed: 11 + i * 4 });
    });
  }

  /* Loops below the fight (the tape, the bobbing team art) only run while
     they're on screen, so they never cost the fight a frame. */
  function pauseOffscreen() {
    if (!('IntersectionObserver' in root)) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting)), {
      rootMargin: '120px 0px',
    });
    document.querySelectorAll('.tape, .teams').forEach((el) => io.observe(el));
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
    trackHeader();
    bindCopy();
    bindSound();
    buildMarquees();
    bindMenu();
    bindPfp();
    bindEasterEgg();
    sectionSplits();
    pauseOffscreen();
    if (LR.art) LR.art.init();

    const hosts = { left: $('fighter-left'), right: $('fighter-right') };
    const chars = { left: LR.rig.create('left'), right: LR.rig.create('right') };
    hosts.left.appendChild(chars.left.el);
    hosts.right.appendChild(chars.right.el);

    const heroBg = $('hero-bg');
    const arena = $('arena');
    const split = LR.fx.split(heroBg, { geometry: splitGeometry(heroBg, arena) });
    if ('ResizeObserver' in root) new ResizeObserver(() => split.set({})).observe(arena);

    let gsap = null;
    try {
      gsap = await ensureGsap();
    } catch (err) {
      console.error('[LEFT RIGHT] GSAP failed to load; showing a still frame.', err);
    }
    if (!gsap) return;

    const reduced = reducedQuery.matches;
    LR.idle.start(chars, hosts, { reduced });
    if (LR.drops) LR.drops.init({ chars, reduced }); // before the fight, which tells it your side
    LR.fight.init({ split, reduced });
    LR.milestones.init({ reduced, onUnlock: () => LR.fight.bothSwing() });
    if (LR.memes) LR.memes.init();
    if (LR.coin) LR.coin.init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
