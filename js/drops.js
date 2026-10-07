/* ==========================================================================
   LEFT RIGHT — airdrops
   Two kinds, kept well apart:
     1. Crate drops (the game). Win your first round, and every match after
        that, and a crate parachutes into the arena with a piece of drip for
        your fighter: hats, shades, laser eyes, a gold chain. Cosmetic only,
        worth nothing, kept in this browser. Your fighter and your PFP wear it.
     2. The token airdrop (real, if there ever is one). Its card lives in
        index.html (#airdrop-card): set data-status and the placeholders
        there. This file only reads data-status to show the right state.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  /* What the crates can drop. `slot` is where it's worn (one per slot);
     `id` matches the art in js/rig.js. Tiers only change the odds. */
  const DRIP = [
    { id: 'party', slot: 'hat', name: 'Party hat', tier: 'Common' },
    { id: 'shades', slot: 'face', name: 'Deal-with-it shades', tier: 'Common' },
    { id: 'chain', slot: 'neck', name: 'Gold chain', tier: 'Rare' },
    { id: 'propeller', slot: 'hat', name: 'Propeller cap', tier: 'Rare' },
    { id: 'laser', slot: 'face', name: 'Laser eyes', tier: 'Epic' },
    { id: 'crown', slot: 'hat', name: 'Crown', tier: 'Legendary' },
  ];
  const WEIGHT = { Common: 4, Rare: 3, Epic: 2, Legendary: 1 };
  const SLOTS = ['hat', 'face', 'neck'];
  const KEY = 'lr:drip';

  const TEST = root.__LR_TEST__ || null;
  const quiet = !!(TEST && TEST.quiet);

  let gsap = null;
  let reduced = false;
  let chars = null;
  let side = null;
  let el = {};

  /* ---- the stash (localStorage, wrapped: no storage just means no memory) */

  function load() {
    const blank = { owned: [], wear: { hat: null, face: null, neck: null }, crates: 0 };
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!v || !Array.isArray(v.owned)) return blank;
      const owned = v.owned.filter((id) => DRIP.some((d) => d.id === id));
      const wear = {};
      SLOTS.forEach((s) => {
        const id = v.wear && v.wear[s];
        wear[s] = owned.includes(id) && DRIP.find((d) => d.id === id).slot === s ? id : null;
      });
      return { owned, wear, crates: Math.max(0, Number(v.crates) || 0) };
    } catch {
      return blank;
    }
  }

  const stash = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(stash));
    } catch {
      /* private mode etc. */
    }
  }

  const item = (id) => DRIP.find((d) => d.id === id);
  const equipped = () => Object.assign({}, stash.wear);

  /** Pick a drop you don't own yet (weighted by tier), or null if you have it all. */
  function roll() {
    const left = DRIP.filter((d) => !stash.owned.includes(d.id));
    if (!left.length) return null;
    // the very first crate is always something you can see from across the room
    if (!stash.owned.length) return left.find((d) => d.id === 'shades') || left[0];
    const total = left.reduce((a, d) => a + WEIGHT[d.tier], 0);
    let r = Math.random() * total;
    for (const d of left) {
      r -= WEIGHT[d.tier];
      if (r <= 0) return d;
    }
    return left[left.length - 1];
  }

  /* ---- wearing it -------------------------------------------------------- */

  /** Your fighter wears your drip; the computer's fighter wears none. */
  function dress() {
    if (!chars) return;
    ['left', 'right'].forEach((team) => {
      const c = chars[team];
      if (!c) return;
      const d = team === side ? equipped() : { hat: null, face: null, neck: null };
      c.setDrip(d);
      if (c.el.parentNode) c.el.parentNode.classList.toggle('has-hat', !!d.hat); // speech bubbles sit higher
    });
    if (LR.memes) LR.memes.refresh(); // the meme maker draws your fighter in your drip too
  }

  function wear(id) {
    const d = item(id);
    if (!d || !stash.owned.includes(id)) return;
    stash.wear[d.slot] = stash.wear[d.slot] === id ? null : id;
    save();
    dress();
    renderStash();
  }

  /* ---- art ------------------------------------------------------------------ */

  /* A bust of your fighter wearing one piece of drip (static, never animated). */
  function bust(team, drip, cls) {
    const c = LR.rig.create(team || 'left', {
      pose: 'idle',
      static: true,
      drip: Object.assign({ hat: null, face: null, neck: null }, drip),
      state: { mouth: 0.75, lookX: 0.25, lookY: 0.05, rage: 0.15, spin: 0.5 },
    });
    c.el.setAttribute('viewBox', '-20 -110 440 480');
    c.el.classList.add(cls || 'bust');
    c.el.style.setProperty('--ow', '2.2px');
    return c.el;
  }

  const CRATE_SVG = `
<svg class="crate__art" viewBox="0 0 140 190" aria-hidden="true">
  <g class="crate__chute">
    <path class="crate__strings" d="M16 54 46 120M48 60 58 118M92 60 82 118M124 54 94 120"/>
    <path class="crate__canopy" d="M8 58C8 22 36 4 70 4s62 18 62 54c-10-8-20-8-31 0-10-8-21-8-31 0-10-8-21-8-31 0-10-8-21-8-31 0z"/>
    <path class="crate__panel" d="M39 58C39 26 52 6 70 4c18 2 31 22 31 54-10-8-21-8-31 0-10-8-21-8-31 0z"/>
    <path class="crate__seam" d="M70 4v54"/>
  </g>
  <g class="crate__box">
    <rect class="crate__wood" x="34" y="114" width="72" height="66" rx="5"/>
    <path class="crate__plank" d="M34 136h72M34 158h72"/>
    <path class="crate__brace" d="M38 118l64 58M102 118 38 176"/>
    <rect class="crate__lid" x="28" y="106" width="84" height="14" rx="4"/>
    <circle class="crate__sticker" cx="70" cy="147" r="15"/>
    <path class="crate__q" d="M64 142a6 6 0 1 1 9 5c-2 1-3 2-3 5M70 157v1"/>
  </g>
</svg>`;

  /* ---- the drop ------------------------------------------------------------- */

  function arenaPoint(node, fx, fy) {
    const a = el.arena.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    return { x: r.left - a.left + r.width * fx, y: r.top - a.top + r.height * fy };
  }

  function burstConfetti(x, y, team) {
    if (reduced) return;
    const a = el.arena.getBoundingClientRect();
    const colours = (LR.fx.CONFETTI_COLOURS[team] || LR.fx.CONFETTI_COLOURS.neutral).concat(['--star']);
    for (let i = 0; i < 40; i++) {
      const piece = LR.fx.confetti(i, colours[i % colours.length]);
      piece.classList.add('confetti-piece');
      piece.style.left = `${a.left + x}px`;
      piece.style.top = `${a.top + y}px`;
      document.body.appendChild(piece);
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
      const v = 160 + Math.random() * 320;
      gsap
        .timeline({ onComplete: () => piece.remove() })
        .set(piece, { x: -11, y: -8, rotation: Math.random() * 360, scale: 0.6 + Math.random() * 0.8 })
        .to(piece, { x: Math.cos(ang) * v, y: Math.sin(ang) * v, rotation: '+=420', duration: 0.6, ease: 'power2.out' })
        .to(piece, { y: '+=300', opacity: 0, rotation: '+=200', duration: 0.9, ease: 'power1.in' });
    }
  }

  /**
   * Parachute a crate into the arena, open it, and put the drop on your
   * fighter. Resolves when the show is over (so the match can carry on).
   */
  function crate(team) {
    if (quiet || !gsap || !el.arena) return Promise.resolve(null);
    const got = roll();
    stash.crates += 1;
    if (got) {
      stash.owned.push(got.id);
      stash.wear[got.slot] = got.id; // new drip goes straight on
    }
    save();

    return new Promise((resolve) => {
      const arena = el.arena;
      const fighter = document.getElementById(team === 'left' ? 'fighter-left' : 'fighter-right');
      const aw = arena.clientWidth;
      const ah = arena.clientHeight;
      const fw = fighter.offsetWidth;
      const size = Math.max(70, Math.min(fw * 0.42, 150));
      const box = document.createElement('div');
      box.className = 'crate';
      box.innerHTML = CRATE_SVG;
      box.style.width = `${size}px`;
      box.style.left = `${aw / 2 - size / 2}px`;
      box.style.top = `${ah * 0.62 - size * 1.36}px`;
      box.dataset.team = team;
      arena.appendChild(box);
      const chute = box.querySelector('.crate__chute');
      const body = box.querySelector('.crate__box');
      const lid = box.querySelector('.crate__lid');

      const card = document.createElement('div');
      card.className = 'loot';
      card.setAttribute('aria-hidden', 'true');
      const tier = got ? got.tier : 'Bonus';
      card.dataset.tier = tier.toLowerCase();
      card.innerHTML = `<span class="loot__kicker">Airdrop!</span><span class="loot__art"></span><b class="loot__name">${got ? got.name : 'Bragging rights'}</b><span class="loot__tier">${got ? tier : 'You have it all'}</span>`;
      card.querySelector('.loot__art').appendChild(bust(team, got ? { [got.slot]: got.id } : equipped(), 'bust'));
      arena.appendChild(card);
      gsap.set(card, { xPercent: -50, yPercent: -50, left: aw / 2, top: ah * 0.42, opacity: 0, scale: 0.2 });

      const done = () => {
        box.remove();
        card.remove();
        renderStash();
        resolve(got);
      };
      if (el.live) el.live.textContent = got ? `Airdrop! You got the ${got.name}.` : 'Airdrop! You already have every drop.';

      const land = () => {
        LR.sound.play('kick', 0.6);
        if (navigator.vibrate) {
          try {
            navigator.vibrate(30);
          } catch {
            /* fine */
          }
        }
      };
      const reveal = () => {
        LR.sound.play('ready');
        LR.sound.play('thwack', 0.9);
        burstConfetti(aw / 2, ah * 0.6, team);
        if (got) {
          const actor = LR.idle && LR.idle.actor(team);
          if (actor) LR.idle.say(actor, oneOf(['NEW DRIP', 'LOOK AT ME', 'DRIP CHECK', 'FIRST TRY']), { hold: 1.2, force: true });
        }
      };
      const putOn = () => {
        dress();
        if (!reduced) gsap.fromTo(fighter, { scaleX: 1.12, scaleY: 0.9 }, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'elastic.out(1.2, 0.35)', clearProps: 'scale' });
      };

      if (reduced) {
        gsap.set(card, { opacity: 1, scale: 1 });
        reveal();
        gsap.delayedCall(1.6, () => {
          putOn();
          done();
        });
        return;
      }

      const head = arenaPoint(fighter, 0.5, 0.3);
      const fromTop = -(ah * 0.62 - size * 1.36) - size * 0.4; // starts at the top of the arena
      gsap
        .timeline({ onComplete: done })
        .fromTo(box, { y: fromTop, rotation: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 1.25, ease: 'sine.inOut' })
        .to(box, { opacity: 1, duration: 0.01 }, 0.2)
        .to(box, { rotation: 10, duration: 0.42, ease: 'sine.inOut', yoyo: true, repeat: 2 }, 0)
        .to(box, { rotation: 0, duration: 0.12 })
        .add(land)
        .to(chute, { y: -size * 0.5, opacity: 0, rotation: -25, transformOrigin: '50% 100%', duration: 0.35, ease: 'power2.out' }, '<')
        .fromTo(body, { scaleX: 1.25, scaleY: 0.75, transformOrigin: '50% 100%' }, { scaleX: 1, scaleY: 1, duration: 0.4, ease: 'elastic.out(1.3, 0.35)' }, '<')
        // it wants out
        .to(body, { rotation: -6, transformOrigin: '50% 100%', duration: 0.07, yoyo: true, repeat: 5, ease: 'sine.inOut' }, '+=0.05')
        .to(body, { rotation: 0, duration: 0.05 })
        .to(lid, { y: -size * 0.7, rotation: -40, opacity: 0, transformOrigin: '50% 50%', duration: 0.4, ease: 'power2.out' })
        .add(reveal, '<')
        .to(body, { scaleY: 0.2, opacity: 0, transformOrigin: '50% 100%', duration: 0.25, ease: 'power2.in' }, '<0.1')
        .to(card, { opacity: 1, scale: 1, rotation: -3, duration: 0.45, ease: 'back.out(2.4)' }, '<')
        .to(card, { scale: 1.06, duration: 1.1, ease: 'none' })
        .to(card, { left: head.x, top: head.y, scale: 0.15, opacity: 0, rotation: 20, duration: 0.42, ease: 'power3.in' })
        .add(putOn);
    });
  }

  const oneOf = (list) => list[Math.floor(Math.random() * list.length)];

  /* ---- the Airdrop section --------------------------------------------------- */

  function renderStash() {
    if (!el.stash) return;
    el.stash.textContent = '';
    DRIP.forEach((d) => {
      const owned = stash.owned.includes(d.id);
      const on = stash.wear[d.slot] === d.id;
      const li = document.createElement('li');
      li.className = `drop${owned ? '' : ' is-locked'}${on ? ' is-on' : ''}`;
      li.dataset.tier = d.tier.toLowerCase();
      const art = document.createElement('span');
      art.className = 'drop__art';
      art.appendChild(bust(side || 'left', { [d.slot]: d.id }));
      li.appendChild(art);
      const meta = document.createElement('span');
      meta.className = 'drop__meta';
      meta.innerHTML = `<b class="drop__name">${owned ? d.name : '???'}</b><span class="drop__tier">${d.tier}</span>`;
      li.appendChild(meta);
      if (owned) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `btn btn--sm drop__btn${on ? ' btn--accent' : ''}`;
        b.setAttribute('aria-pressed', String(on));
        b.textContent = on ? 'Wearing' : 'Wear';
        b.setAttribute('aria-label', `${on ? 'Take off' : 'Wear'} the ${d.name}`);
        b.addEventListener('click', () => wear(d.id));
        li.appendChild(b);
      } else {
        const s = document.createElement('span');
        s.className = 'drop__how';
        s.textContent = 'Win a match';
        li.appendChild(s);
      }
      el.stash.appendChild(li);
    });
    if (el.count) el.count.textContent = `${stash.owned.length}/${DRIP.length}`;
    if (el.next) {
      el.next.textContent = stash.owned.length >= DRIP.length
        ? 'You have every drop. Crates still fall, now with confetti only.'
        : stash.crates ? 'Next crate: win a match.' : 'First crate: win a round.';
    }
  }

  /* The token airdrop card: index.html sets data-status (soon | live | ended). */
  function renderAirdropCard() {
    const card = document.getElementById('airdrop-card');
    if (!card) return;
    const status = card.dataset.status || 'soon';
    const label = { soon: 'Not live yet', live: 'Live', ended: 'Ended' }[status] || 'Not live yet';
    const pill = card.querySelector('[data-airdrop-status]');
    if (pill) pill.textContent = label;
    const claim = card.querySelector('[data-airdrop-claim]');
    if (claim) {
      const live = status === 'live';
      claim.toggleAttribute('aria-disabled', !live);
      if (!live) {
        claim.removeAttribute('href');
        claim.setAttribute('aria-disabled', 'true');
        claim.textContent = status === 'ended' ? 'Claim window closed' : 'Claim link appears here';
      }
    }
  }

  LR.drops = {
    DRIP,
    equipped,
    get state() {
      return { owned: stash.owned.slice(), wear: equipped(), crates: stash.crates };
    },
    /** Has this browser had its first crate yet? */
    get started() {
      return stash.crates > 0;
    },
    /**
     * @param {{chars: {left: object, right: object}, reduced?: boolean}} ctx
     */
    init(ctx = {}) {
      gsap = root.gsap;
      reduced = !!ctx.reduced;
      chars = ctx.chars || null;
      el = {
        arena: document.getElementById('arena'),
        stash: document.getElementById('drop-stash'),
        count: document.getElementById('drop-count'),
        next: document.getElementById('drop-next'),
        live: document.getElementById('live'),
      };
      renderStash();
      renderAirdropCard();
    },
    /** Called by the fight when you pick (or switch) a side. */
    onSide(team) {
      side = team;
      dress();
      renderStash();
    },
    crate,
    wear,
  };
})(window);
