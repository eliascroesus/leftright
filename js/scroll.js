/* ==========================================================================
   LEFT RIGHT — scroll
   Everything that moves as you scroll (GSAP ScrollTrigger): headlines pop in
   letter by letter (cascading from your side once you've picked one), cards
   land, stamps slam, the seam pushes toward the other side, the meme wall
   slides sideways on desktop, the tapes lean into your scroll, and your
   fighter rides along in the corner. Transform and opacity only.

   Nothing waits to be revealed if it's already on screen, and with
   prefers-reduced-motion nothing animates or hides at all (the progress
   bar and the corner fighter still work, without motion).

   One GSAP quirk shapes this file: while GSAP animates an element it folds
   the CSS `rotate` / `scale` properties (the cards' tilts, the picked-side
   scales) into its own transform. So reveals note each element's resting
   tilt, land on it, then hand the element back to the CSS (clearProps), and
   anything the CSS scales by state is moved through a wrapper instead.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  let gsap = null;
  let ST = null;
  let reduced = false;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const side = () => (LR.side && LR.side.get()) || null;
  /* Things cascade from your side; from the middle before you pick. */
  const cascade = () => (side() === 'left' ? 'start' : side() === 'right' ? 'end' : 'center');
  /* An element's resting tilt and scale (its CSS `rotate` / `scale`), read
     before GSAP touches it. */
  const tilt = (el) => parseFloat(getComputedStyle(el).rotate) || 0;
  const size = (el) => parseFloat(getComputedStyle(el).scale) || 1;
  const HAND_BACK = 'transform,opacity,visibility';

  /* ---- headline letters ------------------------------------------------------ */

  /* Split a headline into letters for the pop; screen readers get the words. */
  function split(el, text) {
    const t = (text != null ? text : el.textContent).trim();
    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = t;
    const vis = document.createElement('span');
    vis.className = 'letters';
    vis.setAttribute('aria-hidden', 'true');
    t.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        vis.appendChild(document.createTextNode(' '));
        return;
      }
      const w = document.createElement('span');
      w.className = 'w';
      for (const c of part) {
        const ch = document.createElement('span');
        ch.className = 'ch';
        ch.textContent = c;
        w.appendChild(ch);
      }
      vis.appendChild(w);
    });
    el.append(sr, vis);
    el.dataset.split = '1';
    return $$('.ch', vis);
  }

  function popLetters(chars, delay = 0) {
    if (!chars.length) return;
    gsap.fromTo(
      chars,
      { yPercent: 115, rotation: () => gsap.utils.random(-26, 26), scale: 0.5, autoAlpha: 0 },
      { yPercent: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 0.7, delay, ease: 'back.out(2.2)', stagger: { each: 0.03, from: cascade() }, overwrite: true },
    );
  }

  /* ---- reveal once: hide now, play when it scrolls into view -------------------- */

  const waiting = new Set();

  function reveal(trigger, hide, show, start = 'top 88%') {
    if (!trigger) return;
    // already on screen (or above it): leave it exactly as it is
    if (trigger.getBoundingClientRect().top < innerHeight * 0.92) return;
    hide();
    trigger.dataset.pending = '1';
    let st = null;
    const item = {
      trigger,
      play() {
        if (!waiting.delete(item)) return;
        delete trigger.dataset.pending;
        if (st) st.kill();
        show();
      },
    };
    waiting.add(item);
    st = ST.create({ trigger, start, onEnter: () => item.play(), onLeave: () => item.play(), onEnterBack: () => item.play() });
  }

  /* Belt and braces: whatever has come into view by the end of a scroll plays. */
  function sweep() {
    waiting.forEach((item) => {
      if (item.trigger.getBoundingClientRect().top < innerHeight) item.play();
    });
  }

  /* Hide a group (`from`), then land each one back on its resting tilt and
     scale and give it back to the CSS. */
  function land(trigger, els, from, to = {}, start) {
    els = els.filter(Boolean);
    if (!els.length) return;
    let rest = [];
    reveal(
      trigger,
      () => {
        rest = els.map((el) => ({ r: tilt(el), s: size(el) }));
        gsap.set(els, from);
      },
      () =>
        gsap.to(
          els,
          Object.assign(
            {
              x: 0, y: 0, xPercent: 0, yPercent: 0, rotationY: 0, autoAlpha: 1,
              rotation: (i) => rest[i].r,
              scale: (i) => rest[i].s,
              duration: 0.7, ease: 'back.out(1.6)', stagger: 0.09, overwrite: true, clearProps: HAND_BACK,
            },
            to,
          ),
        ),
      start,
    );
  }

  /* ---- the sections ------------------------------------------------------------- */

  function heads() {
    $$('.sec-head').forEach((head) => {
      const h = $('.mega', head);
      const kicker = $('.kicker', head);
      const lede = $('.sec-lede', head);
      if (h) split(h);
      let kTilt = 0;
      reveal(
        head,
        () => {
          if (kicker) {
            kTilt = tilt(kicker);
            gsap.set(kicker, { scale: 0, rotation: -30 });
          }
          if (h) gsap.set($$('.ch', h), { autoAlpha: 0 });
          if (lede) gsap.set(lede, { y: 26, autoAlpha: 0 });
        },
        () => {
          if (kicker) gsap.to(kicker, { scale: 1, rotation: kTilt, duration: 0.6, ease: 'back.out(3)', clearProps: HAND_BACK });
          if (h) popLetters($$('.ch', h), 0.08);
          if (lede) gsap.to(lede, { y: 0, autoAlpha: 1, duration: 0.5, delay: 0.35, ease: 'power2.out', clearProps: HAND_BACK });
        },
      );
    });
    // Join's headline sits on the ledge, not in a .sec-head
    const join = $('#join-title');
    if (join) {
      split(join);
      const inner = join.parentElement;
      const after = $$('.sec-lede, .join__btns', inner);
      reveal(
        inner,
        () => {
          gsap.set($$('.ch', join), { autoAlpha: 0 });
          gsap.set(after, { y: 30, autoAlpha: 0 });
        },
        () => {
          popLetters($$('.ch', join), 0.1);
          gsap.to(after, { y: 0, autoAlpha: 1, duration: 0.6, delay: 0.4, stagger: 0.12, ease: 'back.out(1.8)', clearProps: HAND_BACK });
        },
      );
    }
  }

  function teams() {
    const box = $('.teams');
    if (!box) return;
    // the cards slide in from their own sides, then the VS slams down
    land(box, $$('.team', box), { xPercent: (i) => (i ? 70 : -70), rotation: (i) => (i ? 12 : -12) }, { duration: 0.95, ease: 'back.out(1.3)', stagger: 0 }, 'top 82%');
    land(box, [$('.teams__vs', box)], { scale: 0, rotation: -70, autoAlpha: 0 }, { duration: 0.6, delay: 0.5, ease: 'back.out(3.5)' }, 'top 82%');
    const board = $('.scoreboard');
    land(board, [board], { y: 60, autoAlpha: 0 });
  }

  function buy() {
    const steps = $$('.step');
    land($('.steps'), steps, { y: 100, rotation: (i) => (i % 2 ? 10 : -10), scale: 0.85, autoAlpha: 0 }, { stagger: { each: 0.1, from: cascade() } });
    ['.buy-row', '.contract'].forEach((sel) => {
      const el = $(sel);
      land(el, [el], { y: 50, autoAlpha: 0 });
    });
    // the two heads by the headline swing in from the edges as you scroll
    $$('.sec-head__l, .sec-head__r').forEach((el) => {
      const dir = el.classList.contains('sec-head__l') ? -1 : 1;
      const rest = tilt(el);
      gsap.fromTo(
        el,
        { xPercent: dir * 90, rotation: rest + dir * 30 },
        { xPercent: 0, rotation: rest, ease: 'none', scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'top 25%', scrub: 0.6 } },
      );
    });
  }

  function tokenomics() {
    const supply = $('.supply__num');
    land($('.supply'), [supply], { scale: 0.3, rotation: -8, autoAlpha: 0 }, { duration: 1, ease: 'elastic.out(1, 0.55)' });
    // rubber stamps: big, then SLAM
    const stamps = $$('.stamp');
    let rest = [];
    reveal(
      $('.stamps'),
      () => {
        rest = stamps.map(tilt);
        gsap.set(stamps, { scale: 2.2, rotation: (i) => (i % 2 ? 18 : -18), autoAlpha: 0 });
      },
      () =>
        gsap.to(stamps, {
          keyframes: [
            { scale: 1, rotation: (i) => rest[i], autoAlpha: 1, duration: 0.28, ease: 'power4.in' },
            { scale: 1.07, duration: 0.07, ease: 'power1.out' },
            { scale: 1, duration: 0.3, ease: 'back.out(3)' },
          ],
          stagger: 0.15,
          clearProps: HAND_BACK,
        }),
    );
    land($('.pizza'), [$('.pizza__art')], { rotation: -240, scale: 0.2, autoAlpha: 0 }, { duration: 1.1, ease: 'back.out(1.3)' });
    land($('.pizza'), $$('.pizza__tag'), { scale: 0 }, { duration: 0.5, delay: 0.75, stagger: 0.12, ease: 'back.out(3)' });
    const alloc = $('.alloc');
    land(alloc, [alloc], { x: 90, rotation: 4, autoAlpha: 0 }, { duration: 0.8 });
  }

  function roadmap() {
    land(
      $('.phases'),
      $$('.phase'),
      { y: 130, x: (i) => (i - 1) * 70, rotation: (i) => (i - 1) * 9, autoAlpha: 0 },
      { duration: 0.85, ease: 'back.out(1.5)', stagger: { each: 0.15, from: cascade() } },
    );
    // the two of them climb into view from the bottom of the section
    $$('.roadmap__peek').forEach((el) => {
      gsap.fromTo(el, { yPercent: 75 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '#roadmap', start: 'center bottom', end: 'bottom bottom', scrub: 0.6 } });
    });
  }

  function memes() {
    const ctas = $('.meme-ctas');
    land(ctas, [ctas], { y: 40, autoAlpha: 0 });
    land($('#stickers'), $$('#stickers > li'), { scale: 0, rotation: () => gsap.utils.random(-70, 70) }, { duration: 0.9, ease: 'elastic.out(1, 0.5)', stagger: { each: 0.07, from: cascade() } });
  }

  /* Desktop: the meme wall is a rail. The headline and the wall pin, and the
     wall slides sideways while you keep scrolling down. Phones get a grid. */
  function memeRail(mm) {
    const stage = $('.meme-stage');
    const rail = $('.meme-rail');
    const wall = $('#meme-wall');
    if (!stage || !rail || !wall) return;
    mm.add('(min-width: 1024px) and (min-height: 720px)', () => {
      rail.classList.add('is-rail');
      const dist = () => Math.max(0, wall.scrollWidth - rail.clientWidth);
      const top = () => ($('#site-head') ? $('#site-head').offsetHeight : 0) + 8;
      gsap.to(wall, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: { trigger: stage, start: () => `top ${top()}px`, end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      return () => rail.classList.remove('is-rail');
    });
    mm.add('(max-width: 1023px), (max-height: 719px)', () => {
      land(wall, $$('.meme-card', wall), { y: 90, rotation: () => gsap.utils.random(-12, 12), scale: 0.8, autoAlpha: 0 }, { duration: 0.75 });
    });
  }

  function airdrops() {
    const head = $('.drops-head');
    land(head, [head], { y: 30, autoAlpha: 0 });
    // trading cards flipping over (the stash can redraw, so look them up late)
    reveal(
      $('#drop-stash'),
      () => gsap.set($$('#drop-stash .drop'), { rotationY: -100, transformPerspective: 800, autoAlpha: 0 }),
      () =>
        gsap.fromTo(
          $$('#drop-stash .drop'),
          { rotationY: -100, transformPerspective: 800, autoAlpha: 0 },
          { rotationY: 0, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.6)', stagger: { each: 0.09, from: cascade() }, overwrite: true, clearProps: HAND_BACK },
        ),
    );
    const card = $('#airdrop-card');
    land(card, [card], { y: 70, rotation: -3, autoAlpha: 0 }, { duration: 0.8 });
  }

  function faq() {
    land($('.faq'), $$('.faq details'), { x: (i) => (i % 2 ? 70 : -70), autoAlpha: 0 }, { duration: 0.6, ease: 'power3.out', stagger: 0.07 });
  }

  /* Scrubbed: they rise over the ledge; the footer's LEFT and RIGHT slide in. */
  function ends() {
    $$('.join__head').forEach((el) => {
      gsap.fromTo(el, { yPercent: 75 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '#join', start: 'top bottom', end: 'top 30%', scrub: 0.6 } });
    });
    const footer = $('.footer');
    $$('.footer__word > span').forEach((el, i) => {
      gsap.fromTo(el, { xPercent: i ? 70 : -70 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: footer, start: 'top bottom', end: 'top 45%', scrub: 0.6 } });
    });
  }

  /* The red/blue seam in a section shoves over toward the other side as you
     scroll through it (down, once the team cards stack). */
  function seams() {
    $$('[data-split]').forEach((host) => {
      const svg = $('.split-art', host);
      if (!svg) return;
      const cards = $$('.team', host);
      let stacked = false;
      ST.create({
        trigger: host,
        start: 'top bottom',
        end: 'bottom top',
        onRefresh: () => {
          stacked = cards.length === 2 && cards[1].getBoundingClientRect().top >= cards[0].getBoundingClientRect().bottom - 8;
        },
        onUpdate: (self) => {
          const s = side();
          const push = (s === 'left' ? 1 : s === 'right' ? -1 : 0) * 12 * Math.min(1, self.progress * 2.2);
          gsap.set(svg, stacked ? { yPercent: push * 0.6, xPercent: 0 } : { xPercent: push, yPercent: 0 });
        },
      });
    });
  }

  /* The tapes lean into your scroll and spring back when you stop. */
  function tapes() {
    const leans = $$('.tape').map((tape) => {
      const lean = gsap.quickTo(tape, 'skewX', { duration: 0.45, ease: 'power3' });
      ST.create({ trigger: tape, start: 'top bottom', end: 'bottom top', onUpdate: (self) => lean(gsap.utils.clamp(-16, 16, self.getVelocity() / -220)) });
      return lean;
    });
    ST.addEventListener('scrollEnd', () => leans.forEach((lean) => lean(0)));
  }

  /* Leaving the fight: the poster's LEFT and RIGHT split apart. */
  function heroExit() {
    $$('.poster__word').forEach((el, i) => {
      gsap.to(el, { xPercent: i ? 45 : -45, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: 0.5 } });
    });
  }

  /* The first thing you see: "Pick a side." pops in (only on the pick screen). */
  function heroTitle() {
    const words = $('.hero__words');
    if (!words || side()) return;
    popLetters(split(words), 0.25);
  }

  /* ---- always on (no motion needed) ---------------------------------------------- */

  function progress() {
    const bar = $('.scroll-bar');
    if (!bar) return;
    const set = gsap.quickSetter(bar, 'scaleX');
    ST.create({ start: 0, end: 'max', onUpdate: (self) => set(self.progress) });
  }

  /* Your fighter in the corner: a pose and a line for each section. */
  const BUDDY = [
    ['sides', 'victory', { rage: 0.1, mouth: 1 }, "THAT'S US"],
    ['how-to-buy', 'camera', { rage: 0 }, 'EASY'],
    ['tokenomics', 'steam', { rage: 1, throb: 1, steam: 0.62, mouth: 0.9 }, 'BORING'],
    ['roadmap', 'flail', { rage: 0.3, mouth: 1 }, 'NO PROMISES'],
    ['memes', 'yell', { mouth: 1, rage: 0.4 }, 'POST IT'],
    ['airdrop', 'victory', { rage: 0, mouth: 1 }, 'DRIP'],
    ['faq', 'camera', { rage: 0 }, 'ACTUALLY'],
  ];

  function buddy() {
    const box = $('#buddy');
    const img = $('#buddy-img');
    const say = $('#buddy-say');
    if (!box || !img || !say || !LR.art) return;
    let current = null;
    let inRange = false;
    let quiet = 0;
    const show = () => box.classList.toggle('is-on', inRange && !!side());
    const pose = (entry) => {
      current = entry;
      const s = side();
      if (!s || !entry) return;
      const [, name, state, line] = entry;
      img.src = LR.art.url(s, { pose: name, state, view: 'bust', width: 320, drip: LR.drops ? LR.drops.equipped() : undefined });
      if (!reduced && typeof img.animate === 'function') {
        img.animate([{ transform: 'translateY(18%) scale(0.86, 1.1)' }, { transform: 'none' }], { duration: 450, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
      }
      say.textContent = line;
      say.classList.add('is-on');
      clearTimeout(quiet);
      quiet = setTimeout(() => say.classList.remove('is-on'), 1900);
    };
    BUDDY.forEach((entry) => {
      const sec = document.getElementById(entry[0]);
      if (!sec) return;
      ST.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => self.isActive && pose(entry) });
    });
    // out once the fight is behind you, gone again at Join (they're both there)
    ST.create({
      trigger: '#top',
      start: 'bottom 70%',
      endTrigger: '#join',
      end: 'top 80%',
      onToggle: (self) => {
        inRange = self.isActive;
        show();
      },
    });
    if (LR.side) {
      LR.side.on(() => {
        show();
        if (current) pose(current);
      });
    }
  }

  /* ---- public ---------------------------------------------------------------------- */

  let ready = false;

  LR.scroll = {
    /** Swap a split headline's words (your side changed): re-split, and
        pop the new words in if it's on screen. */
    setText(el, text) {
      const chars = split(el, text);
      if (!ready || reduced) return;
      if (el.closest('[data-pending]')) {
        gsap.set(chars, { autoAlpha: 0 }); // its reveal is still to come
        return;
      }
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) popLetters(chars);
    },
    /** @param {{reduced?: boolean}} ctx */
    init(ctx = {}) {
      gsap = root.gsap;
      ST = root.ScrollTrigger;
      if (!gsap || !ST) return;
      gsap.registerPlugin(ST);
      reduced = !!ctx.reduced;
      progress();
      buddy();
      if (!reduced) {
        const mm = gsap.matchMedia();
        memeRail(mm); // pins first, so everything below measures after the pin space
        heroTitle();
        heroExit();
        heads();
        teams();
        buy();
        tokenomics();
        roadmap();
        memes();
        airdrops();
        faq();
        ends();
        seams();
        tapes();
        ST.addEventListener('scrollEnd', sweep);
        ST.addEventListener('refresh', sweep);
      }
      ready = true;
      ST.refresh();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ST.refresh());
      // opening an FAQ answer changes the page height: re-measure what's below it
      let t = 0;
      $$('details').forEach((d) =>
        d.addEventListener('toggle', () => {
          clearTimeout(t);
          t = setTimeout(() => ST.refresh(), 120);
        }),
      );
    },
  };
})(window);
