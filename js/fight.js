/* ==========================================================================
   LEFT RIGHT — the fight
   Pick a side (tick a ballot, or tap a half of the screen), then take on
   the other side, played by the computer. Fighting-game rules, debate-club
   names:
     Punch       J (or F) · the Punch pad · tap the fight
     Kick        K
     Block       hold L · hold the Block pad. Raise it just before a hit
                 lands to parry (GOTCHA!) and leave them wide open.
     Filibuster  Space, once your meter is full: a stream of BLAH.
   Hits in a row make named combos (COMBOS). Best of 3 rounds, 45 seconds
   each. Win the match and the next one is a level harder (brain()).
   Health, levels and records live in this browser only. The standings bar
   shows TEAM_STATE, which nothing on this page can change.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  /* ───────────────────────────────────────────────────────────────────────
     TEAM_STATE: the standings bar. Edit these two numbers by hand (0–100).
     They are what the bar shows; your visitors' clicks never change them.
     ─────────────────────────────────────────────────────────────────────── */
  const TEAM_STATE = { left: 52, right: 48 };

  /* ───────────────────────────────────────────────────────────────────────
     LIVE HOOK (optional). Set this to an endpoint that returns JSON like
         { "left": 52, "right": 48 }
     and the bar fetches it on load and every TEAM_STATE_POLL_MS. Leave it
     null to show TEAM_STATE exactly as written above. Local hits are never
     sent anywhere.
     ─────────────────────────────────────────────────────────────────────── */
  const TEAM_STATE_ENDPOINT = null;
  const TEAM_STATE_POLL_MS = 60000;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);
  const oneOf = (list) => list[Math.floor(Math.random() * list.length)];
  const other = (team) => (team === 'left' ? 'right' : 'left');

  async function fetchTeamState() {
    if (!TEAM_STATE_ENDPOINT) return null;
    try {
      const res = await fetch(TEAM_STATE_ENDPOINT, { headers: { Accept: 'application/json' }, cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const left = Number(data.left);
      const right = Number(data.right);
      if (!Number.isFinite(left) || !Number.isFinite(right)) throw new Error('expected { left, right } numbers');
      return { left: clamp(left, 0, 100), right: clamp(right, 0, 100) };
    } catch (err) {
      console.warn('[standings] live fetch failed, showing TEAM_STATE', err);
      return null;
    }
  }

  /* ───────────────────────────────────────────────────────────────────────
     GAME: the rules. Times are in milliseconds.
     ─────────────────────────────────────────────────────────────────────── */
  const GAME = {
    hp: 120,
    roundSeconds: 45,
    roundsToWin: 2,       // best of 3
    meterMax: 100,
    meterHit: 8,          // meter for landing a hit…
    meterTaken: 5,        // …taking one…
    meterBlock: 4,        // …blocking one…
    meterParry: 14,       // …and parrying one
    chainMs: 650,         // longest gap between moves that still counts as one combo
    bufferMs: 280,        // a move pressed this early is queued, not dropped
    parryMs: 170,         // raise your guard this close to a hit to parry it
    minGuardMs: 220,      // a tap on Block guards at least this long
    parryStun: 650,       // how long a parried attacker stays wide open
    chip: 0.12,           // blocked hits still do 12% (a blocked Filibuster: 35%)
    scaleStep: 0.1,       // every extra hit in a combo does 10% less…
    minScale: 0.45,       // …down to 45%
    stunDecay: 0.1,       // hit stun shrinks inside long combos, so they end
    minStun: 0.5,
    interruptBonus: 1.25, // for hitting someone in their wind-up
    breakerCost: 34,      // POINT OF ORDER! costs a third of the meter
    breakerStun: 520,
    spamGuard: 0.35,      // how much repeating yourself helps them block
    idleMs: 6000,         // no input for this long pauses the round
    finishMs: 3200,       // time to say the last word
    shift: 0.14,          // seam travel at a full health lead (arena share)
    fighterStep: 0.4,     // the fighters follow this much of it
  };

  /* The moves: the same for both sides. The computer just gets a brain. */
  const MOVES = {
    P: { name: 'Punch', dmg: 4, startup: 90, strike: 50, recovery: 150, hitstun: 360, blockstun: 150, penalty: 130, power: 0.5 },
    K: { name: 'Kick', dmg: 7, startup: 180, strike: 70, recovery: 240, hitstun: 450, blockstun: 200, penalty: 150, power: 0.8 },
    S: {
      name: 'Filibuster', dmg: 5, ticks: 4, gap: 110, startup: 300, strike: 120, recovery: 380,
      hitstun: 320, blockstun: 220, penalty: 0, chip: 0.35, parry: false, power: 0.4, effect: 'knockback',
    },
  };

  /* Named combos: P punch, K kick, B a hit you just blocked. Each move has to
     land within GAME.chainMs of the last. Longest first. */
  const COMBOS = [
    { seq: 'PPPPP', name: 'Talking point', bonus: 10, effect: 'stagger' },
    { seq: 'PKPK', name: 'Flip-flop', bonus: 9, effect: 'knockback' },
    { seq: 'KKK', name: 'Moving goalposts', bonus: 8, effect: 'knockback' },
    { seq: 'PPK', name: 'Hot take', bonus: 6, effect: 'launch' },
    { seq: 'KPP', name: 'Soundbite', bonus: 6, effect: 'stagger' },
    { seq: 'BP', name: 'Counterpoint', bonus: 5, effect: 'stagger' },
  ];
  const EFFECT_STUN = { stagger: 380, knockback: 300, launch: 480 };

  /* One stage per level; after the last one it's overtime, forever. */
  const STAGES = ['Group chat', 'Comment section', 'Town hall', 'Family dinner', 'Panel show', 'Talk radio', 'Prime-time debate', 'The final debate'];
  const stageName = (level) => (level <= STAGES.length ? STAGES[level - 1] : `Overtime ${level - STAGES.length}`);

  /* The computer's combos, easiest first; higher levels know more of them. */
  const STRINGS = ['P', 'PP', 'K', 'PPK', 'KPP', 'KKK', 'PKPK', 'PPPPP'];

  /* The opponent at each level. Level 1 telegraphs its attacks and blocks
     about half the time; by level 8 it reads spam, parries, counters and
     combos, and from there on it stays that way. */
  function brain(level) {
    const t = clamp(level / 8, 0, 1);
    return {
      level,
      think: lerp(480, 220, t),      // ms between decisions
      tell: lerp(440, 190, t),       // how long its "!" shows before an attack
      react: lerp(420, 150, t),      // how fast it notices your moves
      guess: lerp(0.12, 0.3, t),     // blocks on a hunch
      hold: lerp(0.45, 0.8, t),      // keeps blocking when your combo drops…
      reversal: lerp(0.3, 0.55, t),  // …or jabs straight back
      block: lerp(0.45, 0.72, t),    // blocks when you're on the attack
      parry: level < 3 ? 0 : lerp(0.06, 0.22, t),
      aggression: lerp(0.55, 0.85, t),
      patience: lerp(0, 0.6, t),     // won't swing into your block
      linkGap: lerp(150, 0, t),      // slack between the hits of its combos
      pressure: lerp(0.25, 0.7, t),  // keeps attacking after you block, or while you reel
      counter: lerp(0.45, 0.65, t),  // hits straight back after blocking you
      breaker: level < 2 ? 0 : lerp(0.1, 0.35, t),
      turtle: lerp(0, 0.2, t),       // extra blocking when it's losing
      interrupt: lerp(0.1, 0.5, t),  // jabs you out of a Filibuster wind-up
      special: level >= 2,
      strings: STRINGS.slice(0, 3 + Math.round(t * 5)),
      dmg: Math.min(1.25, 1 + 0.04 * (level - 1)),
    };
  }

  /* Arenas narrower than this (w/h) stack the fighters diagonally; matches the
     @container rule in css/style.css. */
  const STACK_RATIO = 1.6;

  /* Streak hype on the attacker's side, when there's no combo name to show. */
  const HYPE = { 4: 'Trending!', 6: 'Viral!', 8: 'Breaking news!', 10: "Ratio'd!", 12: 'Unprecedented!' };

  const WORDS = {
    P: ['POW!', 'BAM!', 'BONK!', 'WHAP!'],
    K: ['WHAM!', 'THWACK!', 'BOOF!', 'KAPOW!'],
    S: ['BLAH', 'BLAH', 'YADDA', 'ETC.'],
  };

  /* Automated tests may set window.__LR_TEST__ = { speed, quiet, bot } before
     the page loads (faster clock, no show, a scripted player). The page
     itself never does. */
  const TEST = root.__LR_TEST__ || null;
  const speed = (TEST && TEST.speed) || 1;
  const quiet = !!(TEST && TEST.quiet);
  const tally = TEST && TEST.onEvent ? TEST.onEvent : () => {};

  /* localStorage, wrapped: private mode or blocked storage just means no memory. */
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(`lr:${key}`);
        return v == null ? fallback : JSON.parse(v);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(`lr:${key}`, JSON.stringify(value));
      } catch {
        /* ignore */
      }
    },
  };
  const count = (key, fallback = 0) => Math.max(0, Math.floor(Number(store.get(key, fallback)) || 0));

  let gsap = null;
  let reduced = false;
  let el = {};
  let split = null;
  let cloud = null;
  let cloudHide = null;
  let standings = Object.assign({}, TEAM_STATE);
  let pushVec = { x: 0, y: 0 };
  let heroVisible = true;
  let lastSpace = -1e9;
  let announceCall = null;

  const st = {
    side: null,
    mode: 'pick', // pick | ready | intro | live | end | finish | over
    seq: 0,       // bumps on every restart, so stale sequences stop
    level: 1,
    round: 1,
    brain: null,
    timeLeft: GAME.roundSeconds * 1000,
    shownSecs: -1,
    lastInputAt: 0,
    taunted: -1e9,
    picking: false,
    finishCall: null,
    finishBy: null,
    stopUntil: 0,  // hit-stop: everything holds still until then (real time)
    nudged: false,
    dizzy: null,
    sway: null,
    hits: 0,
    wins: 0,
    losses: 0,
    best: 0,
  };
  const pauses = new Set();
  const F = { left: null, right: null };

  /* ---- the game clock -------------------------------------------------------
     Everything in a round runs on this clock, so pausing it (menu open, tab
     hidden, scrolled away, nobody pressing anything) freezes the round
     exactly, timer and all. Animations are fired from it and stay short. */

  const clock = { t: 0, q: [] };

  function after(ms, fn) {
    const ev = { at: clock.t + Math.max(0, ms), fn, dead: false };
    clock.q.push(ev);
    return ev;
  }

  function runDue() {
    for (;;) {
      let next = -1;
      for (let i = 0; i < clock.q.length; i++) {
        const ev = clock.q[i];
        if (!ev.dead && ev.at <= clock.t && (next < 0 || ev.at < clock.q[next].at)) next = i;
      }
      if (next < 0) break;
      const ev = clock.q.splice(next, 1)[0];
      ev.fn();
    }
    if (clock.q.length > 48) clock.q = clock.q.filter((ev) => !ev.dead);
  }

  /* ---- fighters ------------------------------------------------------------- */

  function fighter(team) {
    return {
      team,
      name: LR.rig.TEAMS[team].name,
      cpu: false,
      hp: GAME.hp,
      meter: 0,
      wins: 0,
      taken: 0,        // damage this round (none at all = LANDSLIDE!)
      move: null,      // the move in progress, wind-up to recovery
      stunUntil: 0,
      stunKind: 'hit', // hit (can't block) | block (can keep blocking)
      guard: false,
      guardAt: -1e9,
      guardHeld: false,
      guardMinUntil: 0,
      guardUntil: 0,   // computer: keep blocking until
      parryNext: false,
      parryReady: false,
      wasStunned: false,
      chain: [],       // recent moves, for named combos
      streak: 0,       // hits in a row on the other one
      buffer: null,
      history: [],     // your last moves (the computer reads spam)
      plan: null,      // computer: the combo it's throwing
      nextThink: 0,
      aim: 0,
    };
  }

  const foe = (f) => (f.team === 'left' ? F.right : F.left);
  const player = () => F[st.side];
  const cpu = () => F[other(st.side)];
  const canAct = (f) => !f.move && clock.t >= f.stunUntil;
  const canGuard = (f) => !f.move && (clock.t >= f.stunUntil || f.stunKind === 'block');

  function gain(f, n) {
    f.meter = clamp(f.meter + n, 0, GAME.meterMax);
  }

  function damage(f, amount) {
    if (!(amount > 0)) return;
    f.hp = Math.max(0, f.hp - amount);
    f.taken += amount;
    showPush();
  }

  /* ---- moves ---------------------------------------------------------------- */

  function startMove(f, key) {
    const m = MOVES[key];
    if (!m) return false;
    if (key === 'S') {
      if (f.meter < GAME.meterMax) return false;
      f.meter = 0;
    }
    const d = foe(f);
    const ticks = m.ticks || 1;
    const mv = { key, m, t0: clock.t, landAt: clock.t + m.startup, evs: [], fx: [], seen: false, blocked: false, penalised: false };
    f.move = mv;
    f.buffer = null;
    if (f.guard) setGuard(f, false);
    if (!f.cpu) {
      f.history.push({ k: key, t: clock.t });
      if (f.history.length > 6) f.history.shift();
      // a computer that saw this coming parries it
      if (d.guard && d.parryReady && m.parry !== false) {
        d.parryReady = false;
        d.parryNext = true;
        setGuard(d, false);
      }
    }
    show.windup(f, key);
    mv.evs.push(after(m.startup - m.strike, () => show.strike(f, d, mv)));
    for (let i = 0; i < ticks; i++) mv.evs.push(after(m.startup + i * (m.gap || 0), () => land(f, d, mv, i)));
    mv.evs.push(after(m.startup + (ticks - 1) * (m.gap || 0) + m.recovery, () => finishMove(f, mv)));
    renderHud();
    return true;
  }

  function finishMove(f, mv) {
    if (f.move !== mv) return;
    if (mv.blocked && !mv.penalised && mv.m.penalty) {
      mv.penalised = true; // blocked: stuck a little longer, open to a counter
      mv.evs.push(after(mv.m.penalty, () => finishMove(f, mv)));
      return;
    }
    f.move = null;
    if (f.plan) f.plan.next = clock.t + st.brain.linkGap;
    else if (f.cpu) f.nextThink = clock.t; // combo done: decide straight away
  }

  function cancelMove(f) {
    const mv = f.move;
    if (!mv) return;
    mv.evs.forEach((ev) => (ev.dead = true));
    mv.fx.forEach((x) => (x.kill ? x.kill() : x.remove()));
    f.move = null;
  }

  function land(a, d, mv, i) {
    if (a.move !== mv || st.mode !== 'live') return;
    const last = i === (mv.m.ticks || 1) - 1;
    if (d.guard) {
      if (i === 0 && mv.m.parry !== false && clock.t - d.guardAt <= GAME.parryMs) onParry(a, d, mv);
      else onBlock(a, d, mv, i);
    } else {
      onHit(a, d, mv, i, last, !!(d.move && clock.t < d.move.landAt));
    }
    if (last && a.move === mv) show.recover(a, mv.key);
    renderHud();
    checkKO();
  }

  function chainPush(f, key, t) {
    const prev = f.chain[f.chain.length - 1];
    if (prev && t - prev.t > GAME.chainMs) f.chain.length = 0;
    f.chain.push({ k: key, t });
    if (f.chain.length > 6) f.chain.shift();
    const keys = f.chain.map((c) => c.k).join('');
    const combo = COMBOS.find((c) => keys.endsWith(c.seq)) || null;
    if (combo) f.chain.length = 0;
    return combo;
  }

  function onHit(a, d, mv, i, last, interrupt) {
    const m = mv.m;
    const t = clock.t;
    tally(`${a.cpu ? 'cpu' : 'you'} hit ${mv.key}${interrupt ? ' interrupt' : ''}`);
    const inCombo = d.stunKind === 'hit' && t <= d.stunUntil + 40;
    a.streak = inCombo ? a.streak + 1 : 1;
    d.streak = 0;
    const boost = a.cpu ? st.brain.dmg : 1;
    const scale = Math.max(GAME.minScale, 1 - GAME.scaleStep * (a.streak - 1));
    let dmg = m.dmg * scale * boost * (interrupt ? GAME.interruptBonus : 1);

    // knocked out of whatever they were doing
    if (d.move) cancelMove(d);
    d.buffer = null;
    d.chain.length = 0;
    if (d.plan) {
      d.plan = null;
      show.tell(d, false);
    }

    let effect = last ? m.effect || null : null;
    const combo = mv.key === 'S' ? null : chainPush(a, mv.key, t);
    if (combo) {
      dmg += combo.bonus * scale * boost;
      effect = combo.effect;
    }
    const decay = Math.max(GAME.minStun, 1 - GAME.stunDecay * (a.streak - 1));
    d.stunUntil = t + (m.hitstun + (effect ? EFFECT_STUN[effect] : 0)) * decay;
    d.stunKind = 'hit';
    // the computer holds block through a combo, so it's up the moment the combo drops
    if (d.cpu && Math.random() < st.brain.hold + spam(a) * GAME.spamGuard) d.guardUntil = Math.max(d.guardUntil, d.stunUntil + rand(350, 700));
    damage(d, dmg);
    gain(a, GAME.meterHit);
    gain(d, GAME.meterTaken);

    if (!a.cpu) {
      st.hits += 1;
      store.set('hits', st.hits);
      if (a.streak > st.best) {
        st.best = a.streak;
        store.set('best', st.best);
      }
      renderLocal();
    }
    show.hit(a, d, mv, { i, combo, interrupt, effect, streak: a.streak });

    // the computer climbs out of long combos when it can afford to
    if (d.cpu && a.streak >= 3 && d.meter >= GAME.breakerCost && Math.random() < st.brain.breaker) {
      after(rand(60, 140), () => breaker(d, a));
    }
  }

  function onBlock(a, d, mv, i) {
    const m = mv.m;
    tally(`${d.cpu ? 'cpu' : 'you'} block`);
    const boost = a.cpu ? st.brain.dmg : 1;
    damage(d, m.dmg * (m.chip == null ? GAME.chip : m.chip) * boost);
    d.stunUntil = Math.max(d.stunUntil, clock.t + m.blockstun);
    d.stunKind = 'block';
    mv.blocked = true;
    a.chain.length = 0;
    a.streak = 0;
    gain(d, GAME.meterBlock);
    chainPush(d, 'B', clock.t);
    show.block(a, d);
    if (a.plan && Math.random() > st.brain.pressure) a.plan = null; // the computer backs off
    if (d.cpu && i === 0 && !d.plan && Math.random() < st.brain.counter) {
      const quick = st.brain.strings.filter((s) => s[0] === 'P');
      cpuPlan(d, oneOf(quick.length ? quick : ['P']), false);
    }
  }

  function onParry(a, d, mv) {
    tally(`${d.cpu ? 'cpu' : 'you'} parry`);
    cancelMove(a);
    a.stunUntil = clock.t + GAME.parryStun;
    a.stunKind = 'hit';
    a.chain.length = 0;
    a.streak = 0;
    if (a.plan) {
      a.plan = null;
      show.tell(a, false);
    }
    gain(d, GAME.meterParry);
    chainPush(d, 'B', clock.t);
    show.parry(a, d, mv);
    if (d.cpu) {
      const best = st.brain.strings.slice(-3);
      cpuPlan(d, st.brain.special && d.meter >= GAME.meterMax ? 'S' : oneOf(best), false);
    }
  }

  /* POINT OF ORDER!: block while stuck in a combo (3+ hits) to shove them off.
     Costs a third of the meter. */
  function breaker(d, a) {
    if (st.mode !== 'live' || d.meter < GAME.breakerCost || d.stunKind !== 'hit' || clock.t >= d.stunUntil) return false;
    tally(`${d.cpu ? 'cpu' : 'you'} breaker`);
    d.meter -= GAME.breakerCost;
    d.stunUntil = clock.t;
    if (a.move) cancelMove(a);
    a.stunUntil = clock.t + GAME.breakerStun;
    a.stunKind = 'hit';
    a.streak = 0;
    a.chain.length = 0;
    a.buffer = null;
    if (a.plan) {
      a.plan = null;
      show.tell(a, false);
    }
    damage(a, 3);
    show.breaker(d, a);
    renderHud();
    checkKO();
    return true;
  }

  /* ---- blocking -------------------------------------------------------------- */

  function setGuard(f, on) {
    f.guard = on;
    if (on) {
      // the computer only parries when it means to; yours is all timing
      f.guardAt = f.cpu && !f.parryNext ? -1e9 : clock.t;
      f.parryNext = false;
    }
    show.guard(f, on);
  }

  function updateGuard(f) {
    const want = f.cpu ? clock.t < f.guardUntil : f.guardHeld || clock.t < f.guardMinUntil;
    const able = canGuard(f);
    if (want && able && !f.guard) setGuard(f, true);
    else if ((!want || !able) && f.guard) setGuard(f, false);
  }

  /* ---- the computer ---------------------------------------------------------- */

  function spam(p) {
    const recent = p.history.filter((h) => clock.t - h.t < 3000);
    if (recent.length < 4) return 0;
    const n = {};
    let top = 0;
    recent.forEach((h) => (top = Math.max(top, (n[h.k] = (n[h.k] || 0) + 1))));
    return clamp((top - 3) / 3, 0, 1);
  }

  function cpuPlan(c, seq, telegraph = true) {
    tally(`plan ${telegraph ? 'tell' : 'quick'} ${seq}`);
    c.plan = { seq, i: 0, next: clock.t + (telegraph ? st.brain.tell : 0) };
    c.guardUntil = telegraph ? 0 : Math.min(c.guardUntil, c.stunUntil); // a counter keeps blocking until it can swing
    c.parryReady = false;
    if (telegraph) show.tell(c, seq === 'S' ? '!!' : '!');
  }

  function cpuStep(c, p) {
    const b = st.brain;
    const t = clock.t;

    // back on its feet after a combo: no block up? jab straight back
    const waking = c.wasStunned && c.stunKind === 'hit' && t >= c.stunUntil;
    c.wasStunned = t < c.stunUntil;
    if (waking && !c.plan && c.guardUntil <= t && Math.random() < b.reversal) cpuPlan(c, 'P', false);

    // mid-combo: throw the next move as soon as it can
    if (c.plan) {
      if (t >= c.plan.next && canAct(c)) {
        const key = c.plan.seq[c.plan.i];
        c.plan.i += 1;
        if (c.plan.i >= c.plan.seq.length) c.plan = null;
        show.tell(c, false);
        if (!startMove(c, key)) c.plan = null;
      }
      return;
    }

    // react to what you're throwing, if it notices in time
    const pm = p.move;
    if (pm && !pm.seen && t - pm.t0 >= b.react) {
      pm.seen = true;
      if (canGuard(c) && t < pm.landAt) {
        if (pm.key === 'S' && canAct(c) && Math.random() < b.interrupt) {
          cpuPlan(c, 'P', false);
          return;
        }
        const chance = b.block + spam(p) * GAME.spamGuard + (pm.key === 'S' ? 0.2 : 0) + (c.hp < GAME.hp * 0.25 ? b.turtle : 0);
        if (Math.random() < chance) {
          c.parryNext = b.parry > 0 && pm.m.parry !== false && Math.random() < b.parry + spam(p) * 0.2;
          if (c.parryNext && c.guard) setGuard(c, false); // re-raised fresh below
          c.guardUntil = Math.max(c.guardUntil, pm.landAt + ((pm.m.ticks || 1) - 1) * (pm.m.gap || 0) + rand(150, 400));
        }
      }
    }

    if (t < c.nextThink || !canAct(c)) return;
    c.nextThink = t + b.think * rand(0.7, 1.3);
    const sp = spam(p);
    if (sp >= 1 && t - st.taunted > 6000) {
      st.taunted = t;
      show.say(c, 'HEARD IT.');
    }
    // you're still reeling: keep the pressure on
    if (p.stunKind === 'hit' && t + MOVES.P.startup < p.stunUntil && Math.random() < b.pressure) {
      cpuPlan(c, oneOf(b.strings), false);
      return;
    }
    const last = p.history[p.history.length - 1];
    if (last && t - last.t < 400) {
      // you're on the attack: block it (and counter what it blocks), or jab back
      if (c.guardUntil > t) return;
      if (Math.random() < b.block + sp * GAME.spamGuard + (c.hp < GAME.hp * 0.25 ? b.turtle : 0)) {
        c.guardUntil = t + rand(300, 650);
        c.parryReady = b.parry > 0 && Math.random() < b.parry + sp * 0.2;
      } else if (Math.random() < b.reversal) {
        cpuPlan(c, 'P', false);
      }
      return;
    }
    // neutral: its turn
    if (p.guard && Math.random() < b.patience) return; // waits out your block
    if (b.special && c.meter >= GAME.meterMax && Math.random() < 0.5) {
      cpuPlan(c, 'S');
      return;
    }
    if (c.guardUntil <= t && Math.random() < b.guess + (c.hp < GAME.hp * 0.25 ? b.turtle : 0)) {
      c.guardUntil = t + rand(450, 900);
      c.parryReady = b.parry > 0 && Math.random() < b.parry;
      return;
    }
    if (Math.random() < b.aggression) cpuPlan(c, oneOf(b.strings));
  }

  /* ---- the loop -------------------------------------------------------------- */

  function step(dt) {
    clock.t += dt;
    runDue();
    if (st.mode !== 'live') return;
    st.timeLeft -= dt;
    const p = player();
    const c = cpu();
    if (p.buffer && canAct(p)) {
      const b = p.buffer;
      p.buffer = null;
      if (clock.t - b.at <= GAME.bufferMs) startMove(p, b.key);
    }
    updateGuard(p);
    cpuStep(c, p);
    updateGuard(c);
    if (TEST && TEST.bot) TEST.bot(LR.fight._test, clock.t);
    if (st.mode === 'live' && st.timeLeft <= 0) timeUp();
  }

  function frame(time, dt) {
    if (st.mode !== 'live' || pauses.size || performance.now() < st.stopUntil) return;
    const p = player();
    if (p.guardHeld) st.lastInputAt = clock.t;
    if (!TEST && clock.t - st.lastInputAt > GAME.idleMs && !p.move) {
      pause('idle');
      return;
    }
    let left = Math.min(dt, 50) * speed;
    while (left > 0 && st.mode === 'live' && !pauses.size) {
      const d = Math.min(left, 16);
      left -= d;
      step(d);
    }
    renderTimer();
  }

  /* ---- pausing ----------------------------------------------------------------- */

  function pause(reason) {
    if (pauses.has(reason)) return;
    pauses.add(reason);
    renderPause();
  }

  function unpause(reason) {
    if (!pauses.delete(reason)) return;
    if (!pauses.size && st.side) {
      st.lastInputAt = clock.t;
      const c = cpu();
      c.nextThink = Math.max(c.nextThink, clock.t + 450);
    }
    renderPause();
  }

  function renderPause() {
    if (!st.side) return; // the pick screen keeps its own bickering
    const idle = st.mode === 'live' && pauses.has('idle');
    const ready = st.mode === 'ready';
    const finish = st.mode === 'finish' && st.finishBy === st.side;
    el.hint.textContent = finish ? 'Press any attack!' : ready ? 'Throw a punch to start' : 'Paused · throw a punch';
    el.hint.classList.toggle('is-on', idle || ready || finish);
    el.timer.classList.toggle('is-paused', st.mode === 'live' && pauses.size > 0);
    // idle bickering between rounds; mid-fight and at the finish only the scripted lines
    LR.idle.chatter(ready || idle || st.mode === 'intro');
  }

  /* ---- rounds and matches ------------------------------------------------------ */

  function wait(seconds) {
    if (quiet) return Promise.resolve();
    return new Promise((resolve) => gsap.delayedCall(seconds, resolve));
  }

  function resetFighters(fresh) {
    ['left', 'right'].forEach((team) => {
      const f = F[team];
      cancelMove(f);
      Object.assign(f, {
        hp: GAME.hp, taken: 0, stunUntil: 0, stunKind: 'hit', guardMinUntil: 0, guardUntil: 0,
        parryNext: false, parryReady: false, wasStunned: false, buffer: null, plan: null, nextThink: 0, streak: 0,
      });
      if (f.guard) setGuard(f, false);
      f.chain.length = 0;
      f.history.length = 0;
      if (fresh) {
        f.meter = 0;
        f.wins = 0;
      }
      show.tell(f, false);
    });
  }

  function startMatch(opts = {}) {
    const seq = ++st.seq;
    clock.q.length = 0;
    st.mode = 'intro';
    st.round = 1;
    st.brain = brain(st.level);
    if (st.finishCall) st.finishCall.kill();
    st.stopUntil = 0;
    slowmo(1, 0);
    show.reset();
    resetFighters(true);
    renderHud();
    renderScore();
    renderPause();
    LR.idle.glare(false);
    const intro = opts.intro === false ? Promise.resolve() : announce(`Level ${st.level}`, 'paper', 0.55, stageName(st.level));
    say(`Level ${st.level}, ${stageName(st.level)}.`);
    intro.then(() => startRound(seq));
  }

  function startRound(seq) {
    if (seq !== st.seq) return;
    st.mode = 'intro';
    clock.q.length = 0;
    resetFighters(false);
    st.timeLeft = GAME.roundSeconds * 1000;
    st.shownSecs = -1;
    renderTimer();
    renderHud();
    cachePushVector();
    showPush();
    const final = F.left.wins === GAME.roundsToWin - 1 && F.right.wins === GAME.roundsToWin - 1;
    const label = final ? 'Final round' : `Round ${st.round}`;
    say(`${label}. Fight!`);
    if (!quiet) LR.sound.play('bell', 1);
    announce(label, 'paper', 0.5)
      .then(() => seq === st.seq && announce('Fight!', 'accent', 0.3))
      .then(() => {
        if (seq !== st.seq) return;
        st.mode = 'live';
        st.lastInputAt = clock.t;
        cpu().nextThink = clock.t + 650;
        LR.idle.glare(true);
        renderPause();
        nudgeSound();
      });
  }

  function checkKO() {
    if (st.mode !== 'live') return;
    const L = F.left;
    const R = F.right;
    if (L.hp > 0 && R.hp > 0) return;
    endRound(L.hp <= 0 && R.hp <= 0 ? null : L.hp <= 0 ? 'right' : 'left', 'ko');
  }

  function timeUp() {
    const diff = F.left.hp - F.right.hp;
    endRound(Math.abs(diff) < 0.5 ? null : diff > 0 ? 'left' : 'right', 'time');
  }

  function endRound(winnerTeam, how) {
    const seq = st.seq;
    st.mode = 'end';
    if (TEST && TEST.onRound) TEST.onRound({ winner: winnerTeam, how, you: player().hp, cpu: cpu().hp, secs: st.timeLeft / 1000 });
    clock.q.length = 0;
    ['left', 'right'].forEach((team) => {
      const f = F[team];
      cancelMove(f);
      f.plan = null;
      f.buffer = null;
      if (f.guard) setGuard(f, false);
      show.tell(f, false);
    });
    LR.idle.glare(false);
    renderPause();
    renderHud();

    if (!winnerTeam) {
      say(`${how === 'time' ? 'Time! Dead even.' : 'Double K.O.!'} Recount!`);
      if (!quiet) LR.sound.play('bell', 2);
      announce(how === 'time' ? 'Time!' : 'Double K.O.!', 'star', 0.6)
        .then(() => seq === st.seq && announce('Recount!', 'paper', 0.6))
        .then(() => {
          if (seq !== st.seq) return;
          st.round += 1;
          startRound(seq);
        });
      return;
    }

    const w = F[winnerTeam];
    const l = F[other(winnerTeam)];
    w.wins += 1;
    renderHud();
    const matchOver = w.wins >= GAME.roundsToWin;
    const landslide = w.taken === 0;
    say(`${how === 'ko' ? 'K.O.' : 'Time'}! ${w.name} takes round ${st.round}.${landslide ? ' Landslide!' : ''}`);
    if (!quiet) LR.sound.play('bell', 3);
    if (how === 'ko') {
      // the knockout lands in slow motion
      slowmo(0.3, 1100);
      zoomPunch(0.07);
      focusLines();
      flash(0.5, 'var(--paper)');
      buzz(w.team === st.side ? [30, 40, 90] : [90]);
    }
    let banner = announce(how === 'ko' ? 'K.O.!' : 'Time!', 'star', 0.8);
    if (landslide) banner = banner.then(() => seq === st.seq && announce('Landslide!', 'accent', 0.7));

    if (matchOver) {
      show.dazed(l);
      banner.then(() => seq === st.seq && finisher(w, l, seq));
      return;
    }
    const fall = how === 'ko' ? show.knockout(w, l) : show.slump(w, l);
    Promise.all([banner, fall]).then(() => {
      if (seq !== st.seq) return;
      st.round += 1;
      startRound(seq);
    });
  }

  /* SAY THE LAST WORD!: the loser stands there, dazed. You get a few seconds
     to press any attack; the computer never hesitates. */
  function finisher(w, l, seq) {
    if (seq !== st.seq) return;
    st.mode = 'finish';
    st.finishBy = w.team;
    const you = w.team === st.side;
    say(`Say the last word!${you ? ' Press any attack.' : ''}`);
    announce('Say the last word!', 'star', you ? 1 : 0.7);
    renderPause();
    if (you) {
      st.finishCall = gsap.delayedCall(quiet ? 0 : GAME.finishMs / 1000, () => st.mode === 'finish' && seq === st.seq && endMatch(w, l, seq));
    } else {
      st.finishCall = gsap.delayedCall(quiet ? 0 : 1.5, () => lastWord(w, l));
    }
  }

  function lastWord(w, l) {
    if (st.mode !== 'finish') return;
    const seq = st.seq;
    st.mode = 'over';
    if (st.finishCall) st.finishCall.kill();
    el.hint.classList.remove('is-on');
    say('OK. Last word.');
    show
      .lastWord(w, l)
      .then(() => seq === st.seq && announce('Last word.', 'accent', 0.6))
      .then(() => seq === st.seq && endMatch(w, l, seq, true));
  }

  function endMatch(w, l, seq, flattened) {
    if (seq !== st.seq) return;
    st.mode = 'over';
    el.hint.classList.remove('is-on');
    const you = w.team === st.side;
    if (you) {
      st.wins += 1;
      st.level += 1;
      store.set('wins', st.wins);
      store.set('level', st.level);
      confettiRain(w.team);
      buzz([20, 40, 20, 40, 60]);
    } else {
      st.losses += 1;
      store.set('losses', st.losses);
    }
    renderScore();
    say(`${w.name} wins! ${you ? `On to level ${st.level}: ${stageName(st.level)}.` : 'Rematch.'}`);
    announce(`${w.name} wins!`, 'star', 0.9)
      .then(() => {
        if (seq !== st.seq) return null;
        show.getUp(l, flattened);
        return you ? announce(`Level ${st.level}`, 'paper', 0.6, stageName(st.level)) : announce('Rematch!', 'paper', 0.5, `Level ${st.level} · ${stageName(st.level)}`);
      })
      .then(() => seq === st.seq && startMatch({ intro: false }));
  }

  /* ---- input ------------------------------------------------------------------- */

  function engage() {
    st.lastInputAt = clock.t;
    if (pauses.has('idle')) unpause('idle');
  }

  /** Punch / kick / Filibuster (P K S) for whoever is playing. */
  function press(key) {
    if (!st.side || st.picking || !heroVisible) return;
    if (st.mode === 'ready') {
      startMatch();
      return;
    }
    if (st.mode === 'finish') {
      if (st.finishBy === st.side) lastWord(player(), cpu());
      return;
    }
    if (st.mode !== 'live') return;
    engage();
    if (pauses.size) return;
    const p = player();
    if (key === 'S' && p.meter < GAME.meterMax) {
      show.notReady();
      return;
    }
    if (canAct(p)) startMove(p, key);
    else p.buffer = { key, at: clock.t };
  }

  function guardDown() {
    if (!st.side || st.picking || !heroVisible) return;
    const p = player();
    p.guardHeld = true;
    el.padBlock.classList.add('is-held');
    if (st.mode === 'ready') {
      startMatch();
      return;
    }
    if (st.mode !== 'live') return;
    engage();
    p.guardMinUntil = clock.t + GAME.minGuardMs;
    const c = cpu();
    if (p.stunKind === 'hit' && clock.t < p.stunUntil && c.streak >= 3) breaker(p, c);
  }

  function guardUp() {
    const p = st.side && player();
    if (p) p.guardHeld = false;
    if (el.padBlock) el.padBlock.classList.remove('is-held');
  }

  /* ---- the show: every animation and effect lives below ----------------------- */

  const fighterEl = (team) => (team === 'left' ? el.fighterL : el.fighterR);
  const actor = (team) => LR.idle.actor(team);
  const say = (text) => {
    if (quiet) return;
    el.live.textContent = '';
    el.live.textContent = text;
  };

  /* Poses for the fight, minus the channels the idle loop's rage owns. */
  function pose(name) {
    const p = Object.assign({}, LR.rig.POSES[name]);
    delete p.rage;
    delete p.throb;
    delete p.steam;
    return p;
  }

  const rigTo = (s, vars) => gsap.to(s, Object.assign({ overwrite: 'auto' }, vars));

  /* A point on a fighter's box as a fraction of it, measured from the side
     they face away from, in arena pixels. */
  function pointOn(team, fx, fy) {
    const box = fighterEl(team).getBoundingClientRect();
    const a = el.arena.getBoundingClientRect();
    return { x: box.left - a.left + box.width * (team === 'left' ? fx : 1 - fx), y: box.top - a.top + box.height * fy };
  }

  function awayFrom(team, dist) {
    const len = Math.hypot(pushVec.x, pushVec.y) || 1;
    const k = ((team === 'left' ? -1 : 1) * dist) / len;
    return { x: pushVec.x * k, y: pushVec.y * k };
  }

  function squash(target, big) {
    if (reduced || quiet || !target) return;
    gsap.set(target, { transition: 'none' });
    gsap.fromTo(
      target,
      { scaleX: big ? 1.28 : 1.12, scaleY: big ? 0.74 : 0.88 },
      { scaleX: 1, scaleY: 1, duration: big ? 0.75 : 0.4, ease: 'elastic.out(1.1, 0.32)', clearProps: 'transform,transition', overwrite: 'auto' },
    );
  }

  function confetti(team, origin) {
    if (reduced || quiet) return;
    const r = origin ? origin.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const colours = LR.fx.CONFETTI_COLOURS[team];
    for (let i = 0; i < 48; i++) {
      const piece = LR.fx.confetti(i, colours[i % colours.length]);
      piece.classList.add('confetti-piece');
      piece.style.left = `${cx}px`;
      piece.style.top = `${cy}px`;
      document.body.appendChild(piece);
      const a = rand(-Math.PI, 0);
      const v = rand(220, 600);
      gsap
        .timeline({ onComplete: () => piece.remove() })
        .set(piece, { x: -11, y: -8, rotation: rand(0, 360), scale: rand(0.7, 1.4) })
        .to(piece, { x: Math.cos(a) * v, y: Math.sin(a) * v * 0.9, rotation: `+=${rand(-540, 540)}`, duration: rand(0.5, 0.75), ease: 'power2.out' })
        .to(piece, { y: `+=${rand(260, 520)}`, x: `+=${rand(-70, 70)}`, rotation: `+=${rand(-320, 320)}`, opacity: 0, duration: rand(0.8, 1.3), ease: 'power1.in' });
    }
  }

  function flash(strength = 0.55, colour = '') {
    if (reduced || quiet) return;
    el.flash.style.background = colour;
    gsap.fromTo(el.flash, { opacity: strength }, { opacity: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
  }

  /* Screen shake; with a direction it kicks that way first (the way the hit went). */
  function shake(power, dir) {
    if (reduced || quiet) return;
    const amp = 3 + power * 10;
    gsap.fromTo(
      el.arena,
      {
        x: dir ? dir.x * amp : rand(-amp, amp),
        y: dir ? dir.y * amp + rand(-amp, amp) * 0.3 : rand(-amp, amp) * 0.7,
        rotation: rand(-0.5, 0.5) * power,
      },
      { x: 0, y: 0, rotation: 0, duration: 0.42, ease: 'elastic.out(1.2, 0.3)', overwrite: 'auto' },
    );
  }

  /* ---- juice: freeze frames, slow motion, bursts, buzz -------------------------
     Hit-stop freezes every animation and the round clock for a beat on
     impact (longer for bigger hits); knockouts land in slow motion. */

  let timeBase = 1;
  let slowToken = 0;
  const syncTime = () => gsap.globalTimeline.timeScale(performance.now() < st.stopUntil ? 0 : timeBase);

  function hitStop(ms) {
    if (reduced || quiet || !(ms > 0)) return;
    const until = performance.now() + ms;
    if (until <= st.stopUntil) return;
    st.stopUntil = until;
    syncTime();
    setTimeout(syncTime, ms + 4);
  }

  function slowmo(scale, ms) {
    if (!gsap || quiet || (reduced && scale !== 1)) return;
    const token = ++slowToken;
    timeBase = scale;
    syncTime();
    if (ms > 0) {
      setTimeout(() => {
        if (token !== slowToken) return;
        timeBase = 1;
        syncTime();
      }, ms);
    }
  }

  /* Phones buzz on impact (where the browser allows it). */
  function buzz(pattern) {
    if (quiet) return;
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch {
      /* no vibration here */
    }
  }

  function spawnAt(cls, p) {
    const n = document.createElement('span');
    n.className = cls;
    n.setAttribute('aria-hidden', 'true');
    n.style.left = `${p.x}px`;
    n.style.top = `${p.y}px`;
    el.arena.appendChild(n);
    gsap.set(n, { xPercent: -50, yPercent: -50 });
    return n;
  }

  /* Impact: a ring and a spray of sparks, flying the way the hit went. */
  function burst(d, attackerTeam, big) {
    if (quiet || reduced) return;
    const p = pointOn(d.team, 0.62, 0.46);
    const fw = fighterEl(d.team).offsetWidth;
    const dir = awayFrom(d.team, 1);
    const base = Math.atan2(dir.y, dir.x);
    const ring = spawnAt('impact-ring', p);
    gsap.fromTo(ring, { scale: 0.3, opacity: 1 }, { scale: big ? 2.8 : 1.9, opacity: 0, duration: 0.42, ease: 'power2.out', onComplete: () => ring.remove() });
    const colours = ['var(--star)', 'var(--paper)', attackerTeam === 'left' ? 'var(--red)' : 'var(--blue)'];
    const n = big ? 12 : 7;
    for (let i = 0; i < n; i++) {
      const sp = spawnAt('spark', p);
      sp.style.background = colours[i % colours.length];
      const a = base + rand(-1.3, 1.3) + (i % 4 === 3 ? Math.PI : 0);
      const dist = fw * rand(0.3, big ? 0.9 : 0.6);
      gsap.set(sp, { rotation: (a * 180) / Math.PI, scale: rand(0.8, big ? 1.7 : 1.25) });
      gsap.to(sp, { x: Math.cos(a) * dist, y: Math.sin(a) * dist, scaleX: 0.25, opacity: 0, duration: rand(0.32, 0.55), ease: 'power3.out', onComplete: () => sp.remove() });
    }
  }

  function makeFocusLines() {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'focus-lines');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    // wedges from the edges toward the middle, clipped to the arena (a small layer)
    let d = '';
    const edge = (t) => {
      const c = Math.cos(t);
      const s = Math.sin(t);
      const k = 50 / Math.max(Math.abs(c), Math.abs(s)); // distance to the square's edge
      return [50 + c * k, 50 + s * k, k];
    };
    const pt = (x, y) => `${x.toFixed(1)} ${y.toFixed(1)}`;
    for (let i = 0; i < 34; i++) {
      const a = (i / 34) * Math.PI * 2 + rand(-0.05, 0.05);
      const w = rand(0.02, 0.045);
      const [ex, ey, k] = edge(a);
      const inner = k * rand(0.62, 0.8);
      const [x1, y1] = edge(a - w);
      const [x2, y2] = edge(a + w);
      d += `M${pt(50 + Math.cos(a) * inner, 50 + Math.sin(a) * inner)}L${pt(x1, y1)}L${pt(ex, ey)}L${pt(x2, y2)}Z`;
    }
    svg.innerHTML = `<path d="${d}"/>`;
    return svg;
  }

  /* Comic speed lines flash in around the edges on the big moments. */
  function focusLines() {
    if (quiet || reduced || !el.focus) return;
    gsap.fromTo(el.focus, { opacity: 1, scale: 1.08 }, { opacity: 0, scale: 1, duration: 0.36, ease: 'power2.out', overwrite: 'auto' });
  }

  /* Camera punch-in on the big ones. */
  function zoomPunch(k) {
    if (quiet || reduced) return;
    gsap.fromTo(el.duel, { scale: 1 + k }, { scale: 1, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
  }

  /* A little starburst around a button (the Filibuster filling up). */
  function sparkle(target, team) {
    if (quiet || reduced || !target) return;
    const r = target.getBoundingClientRect();
    const colours = LR.fx.CONFETTI_COLOURS[team] || LR.fx.CONFETTI_COLOURS.neutral;
    for (let i = 0; i < 16; i++) {
      const piece = LR.fx.confetti(i, i % 2 ? '--star' : colours[i % colours.length]);
      piece.classList.add('confetti-piece');
      const a = (i / 16) * Math.PI * 2;
      piece.style.left = `${r.left + r.width / 2 + Math.cos(a) * r.width * 0.4}px`;
      piece.style.top = `${r.top + r.height / 2 + Math.sin(a) * r.height * 0.4}px`;
      document.body.appendChild(piece);
      gsap
        .timeline({ onComplete: () => piece.remove() })
        .set(piece, { x: -11, y: -8, rotation: rand(0, 360), scale: rand(0.5, 0.9) })
        .to(piece, { x: Math.cos(a) * rand(40, 90), y: Math.sin(a) * rand(30, 70), rotation: `+=${rand(-360, 360)}`, opacity: 0, duration: rand(0.5, 0.8), ease: 'power2.out' });
    }
  }

  /* Winning a match: confetti rains down in your colours. */
  function confettiRain(team) {
    if (quiet || reduced) return;
    const colours = LR.fx.CONFETTI_COLOURS[team];
    for (let i = 0; i < 70; i++) {
      const piece = LR.fx.confetti(i, colours[i % colours.length]);
      piece.classList.add('confetti-piece');
      piece.style.left = `${rand(0, innerWidth)}px`;
      piece.style.top = '-30px';
      document.body.appendChild(piece);
      gsap
        .timeline({ delay: rand(0, 0.6), onComplete: () => piece.remove() })
        .set(piece, { rotation: rand(0, 360), scale: rand(0.7, 1.4) })
        .to(piece, { y: innerHeight * rand(0.7, 1.05), x: `+=${rand(-90, 90)}`, rotation: `+=${rand(-720, 720)}`, duration: rand(1.4, 2.4), ease: 'power1.in' })
        .to(piece, { opacity: 0, duration: 0.3 }, '-=0.3');
    }
  }

  /* A ring flies off a pad button when it fires (mouse, touch or key).
     Web Animations on the ::after ring: restarts cleanly, no reflow. */
  function fire(btn) {
    if (!btn || quiet || reduced || typeof btn.animate !== 'function') return;
    try {
      btn.animate(
        [
          { opacity: 1, transform: 'scale(0.94)' },
          { opacity: 0, transform: 'scale(1.2)' },
        ],
        { duration: 400, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::after' },
      );
    } catch {
      /* no pseudo-element animations here: the squash still shows */
    }
  }

  /* Sound is off by default: the first time a round starts, the speaker
     button gives a little wiggle (no words, no autoplay). */
  function nudgeSound() {
    if (st.nudged || quiet || reduced || !LR.sound || LR.sound.enabled || !el.soundBtn) return;
    st.nudged = true;
    const b = el.soundBtn;
    b.classList.add('is-nudge');
    b.addEventListener('click', () => b.classList.remove('is-nudge'), { once: true });
  }

  function announce(text, tone = 'star', hold = 0.6, sub = '') {
    if (quiet) return Promise.resolve();
    return new Promise((resolve) => {
      const box = el.announceBox;
      el.announcer.textContent = text;
      el.announcer.className = `announcer__text announcer__text--${tone}`;
      el.announceSub.textContent = sub;
      el.announceSub.hidden = !sub;
      gsap.killTweensOf(box);
      if (announceCall) announceCall.kill();
      if (reduced) {
        gsap.set(box, { opacity: 1, scale: 1, rotation: 0 });
        announceCall = gsap.delayedCall(hold + 0.35, () => {
          gsap.set(box, { opacity: 0 });
          resolve();
        });
        return;
      }
      gsap
        .timeline({ onComplete: resolve })
        .fromTo(box, { opacity: 0, scale: 2.6, rotation: -9 }, { opacity: 1, scale: 1, rotation: -3, duration: 0.28, ease: 'back.out(2.2)' })
        .to(box, { scale: 1.07, duration: hold, ease: 'none' })
        .to(box, { opacity: 0, scale: 0.7, duration: 0.16, ease: 'power2.in' });
    });
  }

  /* Comic sound-effect words, flying off whoever got hit. */
  function word(team, text, kind) {
    if (quiet) return;
    const w = document.createElement('span');
    w.className = `word${kind ? ` word--${kind}` : ''}`;
    w.textContent = text;
    w.setAttribute('aria-hidden', 'true');
    const long = kind === 'big' || kind === 'shout';
    const p = pointOn(team, 0.62, long ? 0.3 : 0.4);
    w.style.left = `${p.x}px`;
    w.style.top = `${p.y}px`;
    el.arena.appendChild(w);
    gsap.set(w, { xPercent: -50, yPercent: -50 });
    const tilt = rand(-14, 14);
    const tl = gsap.timeline({ onComplete: () => w.remove() });
    if (reduced) {
      tl.set(w, { rotation: tilt, opacity: 1 }).to(w, { opacity: 0, duration: 0.2 }, long ? 0.8 : 0.45);
      return;
    }
    const drift = (team === 'left' ? -1 : 1) * rand(10, 34);
    tl.fromTo(w, { opacity: 1, scale: 0.3, rotation: tilt - 20 }, { scale: long ? 1.2 : 1, rotation: tilt, duration: 0.16, ease: 'back.out(3)' })
      .to(w, { x: drift, y: -rand(16, 34), duration: long ? 0.7 : 0.4, ease: 'power1.out' }, 0.1)
      .to(w, { opacity: 0, scale: 0.7, duration: 0.16, ease: 'power2.in' }, long ? 0.78 : 0.42);
  }

  /* Side callouts: the combo's name and the hit count, on the attacker's side. */
  function callout(team, name, hits) {
    if (quiet) return;
    const c = el.callout[team];
    if (hits > 0 && hits <= (c.lastHits || 0) && !name) c.name.textContent = ''; // a new streak: the old name goes
    c.lastHits = hits;
    if (name) c.name.textContent = name;
    c.hits.innerHTML = hits >= 2 ? `<b>${hits}</b> hits` : '';
    c.box.dataset.heat = hits >= 6 ? '3' : hits >= 4 ? '2' : '1';
    if (!c.name.textContent && !c.hits.textContent) return;
    gsap.killTweensOf(c.box);
    const lean = team === 'left' ? -1 : 1;
    if (reduced) gsap.set(c.box, { opacity: 1 });
    else {
      gsap.fromTo(c.box, { opacity: 1, scale: name ? 1.45 : 1.12, rotation: lean * 9 }, { scale: 1, rotation: lean * 4, duration: 0.3, ease: 'back.out(2.6)' });
      if (hits >= 2) gsap.fromTo(c.hits, { scale: 1.9, rotation: rand(-14, 14) }, { scale: 1, rotation: 0, duration: 0.38, ease: 'back.out(3)', overwrite: 'auto' });
    }
    if (c.hide) c.hide.kill();
    c.hide = gsap.delayedCall(name ? 1.3 : 0.9, () =>
      gsap.to(c.box, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          c.name.textContent = '';
          c.hits.textContent = '';
        },
      }),
    );
  }

  function puffCloud(n) {
    if (!cloud || quiet) return;
    const size = 0.55 + Math.min(n, 25) * 0.035;
    if (reduced) {
      gsap.set(cloud, { opacity: 1, scale: Math.min(size, 1) });
    } else {
      gsap.to(cloud, { opacity: 1, scale: size, rotation: rand(-4, 4), duration: 0.16, ease: 'back.out(3)', overwrite: 'auto' });
      const outline = cloud.querySelectorAll('.cloud-outline .puff');
      cloud.querySelectorAll('.cloud-fill .puff').forEach((f, i) => {
        const k = rand(0.86, 1.14);
        gsap.fromTo([f, outline[i]], { scale: k * 1.1 }, { scale: k, transformOrigin: '50% 50%', duration: 0.25, ease: 'back.out(3)', overwrite: 'auto' });
      });
      cloud.querySelectorAll('.cloud-limb').forEach((limb) => {
        gsap.fromTo(limb, { rotation: rand(-18, 18) }, { rotation: 0, svgOrigin: '160 125', duration: 0.3, ease: 'back.out(2)', overwrite: 'auto' });
      });
      cloud.querySelectorAll('.cloud-star').forEach((star) => {
        gsap.fromTo(star, { scale: 0.2, rotation: -90 }, { scale: rand(0.8, 1.25), rotation: 0, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(3)', overwrite: 'auto' });
      });
    }
    if (cloudHide) cloudHide.kill();
    cloudHide = gsap.delayedCall(0.75, () => gsap.to(cloud, { opacity: 0, scale: 0.2, duration: 0.3, ease: 'power2.in' }));
  }

  function hitStar(team, power, big) {
    if (reduced || quiet) return;
    const p = pointOn(team, 0.64, 0.5);
    const star = LR.fx.star();
    star.classList.add('hit-star');
    star.style.left = `${p.x}px`;
    star.style.top = `${p.y}px`;
    el.arena.appendChild(star);
    gsap.set(star, { xPercent: -50, yPercent: -50 });
    gsap
      .timeline({ onComplete: () => star.remove() })
      .fromTo(star, { scale: 0.2, rotation: rand(-60, 60) }, { scale: (big ? 1.8 : 0.9) + power * 0.4, rotation: '+=40', duration: 0.14, ease: 'back.out(3)' })
      .to(star, { scale: 0.2, opacity: 0, duration: 0.22, ease: 'power2.in' }, '+=0.05');
  }

  /* The Filibuster: a stream of BLAH from one mouth to the other face, each
     glyph arriving as its hit lands. */
  function glyphs(a, d, mv) {
    if (quiet) return;
    const m = mv.m;
    const from = pointOn(a.team, 0.74, 0.5);
    const to = pointOn(d.team, 0.62, 0.42);
    for (let i = 0; i < m.ticks; i++) {
      const g = document.createElement('span');
      g.className = 'glyph';
      g.textContent = WORDS.S[i % WORDS.S.length];
      g.setAttribute('aria-hidden', 'true');
      g.style.left = `${from.x}px`;
      g.style.top = `${from.y}px`;
      el.arena.appendChild(g);
      gsap.set(g, { xPercent: -50, yPercent: -50 });
      const tl = gsap.timeline({ delay: (i * m.gap) / 1000, onComplete: () => g.remove() });
      if (reduced) {
        tl.set(g, { x: to.x - from.x, y: to.y - from.y, opacity: 1 }).to(g, { opacity: 0, duration: 0.15 }, 0.2);
      } else {
        tl.fromTo(g, { opacity: 1, scale: 0.4, rotation: rand(-14, 14) }, { x: to.x - from.x, y: to.y - from.y + rand(-16, 16), scale: 1.1, duration: m.strike / 1000, ease: 'power1.in' })
          .to(g, { scale: 1.6, opacity: 0, duration: 0.16, ease: 'power2.out' });
      }
      mv.fx.push(tl, g);
    }
  }

  function dizzyStars(host, loop) {
    const wrap = document.createElement('div');
    wrap.className = 'dizzy';
    wrap.style.left = '25%';
    wrap.style.top = '-6%';
    const stars = [0, 1, 2].map(() => {
      const s = LR.fx.star();
      wrap.appendChild(s);
      return s;
    });
    host.appendChild(wrap);
    const orbit = { a: 0 };
    const r = wrap.getBoundingClientRect().width * 0.42;
    const tw = gsap.to(orbit, {
      a: Math.PI * 4,
      duration: 1.3,
      ease: 'none',
      repeat: loop ? -1 : 0,
      onUpdate: () =>
        stars.forEach((s, i) => {
          const t = orbit.a + (i * Math.PI * 2) / 3;
          gsap.set(s, { x: Math.cos(t) * r, y: Math.sin(t) * r * 0.3, scale: 0.8 + Math.sin(t) * 0.25, zIndex: Math.sin(t) > 0 ? 2 : 0 });
        }),
      onComplete: () => wrap.remove(),
    });
    return {
      kill() {
        tw.kill();
        wrap.remove();
      },
    };
  }

  function flinch(team, power) {
    const a = actor(team);
    a.hold(['face', 'body', 'arms'], 320);
    gsap.fromTo(
      a.s,
      { headRot: -12 - power * 6, lean: -6, x: -8 - power * 8, blink: 0.85 },
      { headRot: 0, lean: 5, x: 0, blink: 0, duration: 0.38, ease: 'power2.out', overwrite: 'auto' },
    );
    rigTo(a.s, { armL: 50, armR: 58, reachL: 1, reachR: 1, kickR: 0, legReach: 1, y: 0, duration: 0.12 });
    // the whole cutout squashes from the feet and springs back
    gsap.fromTo(a.s, { sx: 1 + 0.16 * power, sy: 1 - 0.13 * power }, { sx: 1, sy: 1, duration: 0.55, ease: 'elastic.out(1.2, 0.35)', overwrite: 'auto' });
  }

  const react = {
    knockback(team) {
      const box = fighterEl(team);
      const v = awayFrom(team, box.offsetWidth * 0.16);
      gsap
        .timeline()
        .to(box, { x: v.x, y: v.y, duration: 0.12, ease: 'power2.out', overwrite: 'auto' })
        .to(box, { x: 0, y: 0, duration: 0.45, ease: 'power2.inOut' }, '+=0.18');
    },
    launch(team) {
      const box = fighterEl(team);
      actor(team).hold(['body'], 800);
      gsap
        .timeline()
        .to(box, { y: -box.offsetHeight * 0.22, duration: 0.22, ease: 'power2.out', overwrite: 'auto' })
        .to(box, { y: 0, duration: 0.4, ease: 'bounce.out' });
      gsap.fromTo(actor(team).s, { rot: -12 }, { rot: 0, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
    },
    stagger(team) {
      const a = actor(team);
      a.hold(['body', 'face', 'arms'], 700);
      gsap.fromTo(a.s, { rot: -7, blink: 0.6 }, { rot: 0, blink: 0, duration: 0.75, ease: 'elastic.out(1.3, 0.2)', overwrite: 'auto' });
      rigTo(a.s, { armL: 64, armR: 70, reachL: 1, reachR: 1, kickR: 0, legReach: 1, duration: 0.15 });
    },
  };

  /* Put a fighter back to neutral (after a knockdown, or a restart mid-way). */
  function neutral(team) {
    const a = actor(team);
    if (!a) return;
    a.release();
    gsap.killTweensOf(a.s, 'x,y,rot,sx,sy,lean,bodySY,kickL,kickR,legReach,armL,armR,reachL,reachR,headRot,headX,headY,turn,blink,browL,browR,browTiltL,browTiltR,flop');
    gsap.set(a.s, {
      x: 0, y: 0, rot: 0, sx: 1, sy: 1, lean: 5, bodySY: 1, kickL: 0, kickR: 0, legReach: 1, armL: 40, armR: 14,
      reachL: 1, reachR: 1, headRot: 0, headX: 0, headY: 0, turn: 0, blink: 0, browL: 0, browR: 0, browTiltL: 0, browTiltR: 0, flop: 0,
    });
  }

  const show = {
    windup(f, key) {
      fighterEl(f.team).classList.add('is-front');
      fighterEl(other(f.team)).classList.remove('is-front');
      if (quiet) return;
      if (key === 'S') LR.sound.play('filibuster');
      if (reduced) return;
      const m = MOVES[key];
      const a = actor(f.team);
      const s = a.s;
      const secs = Math.max(0.04, (m.startup - m.strike) / 1000);
      const busy = m.startup + ((m.ticks || 1) - 1) * (m.gap || 0) + m.recovery + 80;
      if (key === 'P') {
        a.hold(['arms', 'body'], busy);
        f.aim = rand(-12, 16);
        rigTo(s, { armR: f.aim - 36, reachR: 0.9, lean: 2, duration: secs, ease: 'power1.out' });
      } else if (key === 'K') {
        a.hold(['arms', 'body'], busy);
        rigTo(s, { kickR: 28, legReach: 1, lean: -6, x: -4, armL: 54, armR: 30, duration: secs, ease: 'power1.out' });
      } else {
        a.hold(['arms', 'body', 'face', 'mouth'], busy);
        rigTo(s, { lean: -9, sy: 1.04, mouth: 0.3, headRot: -7, armL: 70, armR: 44, browL: 6, browR: 7, duration: secs, ease: 'power2.out' });
      }
    },
    strike(f, d, mv) {
      if (quiet) return;
      const key = mv.key;
      if (key === 'S') glyphs(f, d, mv);
      else LR.sound.play('whoosh');
      if (reduced) return;
      const s = actor(f.team).s;
      if (key === 'P') rigTo(s, { armR: f.aim, reachR: 1.55, lean: 13, x: 14, mouth: 1, duration: 0.05, ease: 'power3.out' });
      else if (key === 'K') rigTo(s, Object.assign({ duration: 0.07, ease: 'power3.out' }, pose('kick')));
      else rigTo(s, Object.assign({ sy: 1, duration: 0.12, ease: 'power3.out' }, pose('filibuster')));
    },
    recover(f, key) {
      if (quiet || reduced) return;
      const s = actor(f.team).s;
      if (key === 'K') rigTo(s, { kickR: 0, legReach: 1, lean: 5, x: 0, y: 0, headRot: 0, armL: 40, armR: 14, duration: 0.26, ease: 'back.out(1.6)' });
      else rigTo(s, Object.assign({ armR: rand(10, 30), reachR: 1, lean: 5, x: 0, sy: 1, headRot: 0, duration: 0.24, ease: 'back.out(2)' }, key === 'S' ? { armL: 40, headY: 0, spit: 0, browL: 0, browR: 0 } : null));
    },
    guard(f, on) {
      if (quiet) return;
      const sh = el.shield[f.team];
      gsap.killTweensOf(sh);
      if (reduced) gsap.set(sh, { opacity: on ? 1 : 0, scale: 1 });
      else if (on) gsap.fromTo(sh, { opacity: 1, scale: 0.6 }, { scale: 1, duration: 0.14, ease: 'back.out(3)' });
      else gsap.to(sh, { opacity: 0, scale: 0.8, duration: 0.12 });
      if (reduced) return;
      const a = actor(f.team);
      if (on) {
        a.hold(['arms', 'body', 'face'], 60000);
        rigTo(a.s, Object.assign({ duration: 0.08, ease: 'power2.out' }, pose('guard')));
      } else {
        a.unhold(['arms', 'body', 'face']);
        rigTo(a.s, { reachL: 1, reachR: 1, lean: 5, x: 0, headRot: 0, blink: 0, browL: 0, browR: 0, duration: 0.14, ease: 'power2.out' });
      }
    },
    hit(a, d, mv, info) {
      if (quiet) return;
      const key = mv.key;
      const big = !!info.combo || info.effect === 'launch';
      const power = Math.min(1, mv.m.power + (info.combo ? 0.35 : 0) + info.streak * 0.03);
      LR.sound.play(key === 'K' ? 'kick' : 'thwack', power);
      if (key !== 'S') {
        hitStar(d.team, power, big);
        puffCloud(info.streak + 2);
        word(d.team, oneOf(WORDS[key]), big ? 'big' : '');
      }
      if (info.combo) callout(a.team, `${info.combo.name}!`, info.streak);
      else if (info.interrupt) callout(a.team, 'Interruption!', info.streak);
      else callout(a.team, HYPE[info.streak] || '', info.streak);
      const you = !a.cpu;
      buzz(you ? (big ? 24 : key === 'K' ? 14 : 8) : 18);
      if (you) pulseBar();
      if (you && info.streak >= 2) LR.sound.play('combo', info.streak);
      jiggleHud(d.team, big ? 1 : 0.5);
      if (reduced) return;
      const heavy = big || key === 'K' || !!info.effect;
      hitStop(key === 'S' ? (info.effect ? 90 : 24) : big ? 115 : key === 'K' ? 70 : 42);
      burst(d, a.team, heavy);
      flinch(d.team, power);
      if (info.effect) react[info.effect](d.team);
      shake(big ? 1.2 : power * 0.8, awayFrom(d.team, 1));
      if (big) {
        zoomPunch(0.045);
        flash(0.16);
        focusLines();
      } else if (key === 'K') zoomPunch(0.02);
    },
    block(a, d) {
      if (quiet) return;
      LR.sound.play('block');
      word(d.team, 'BLOCK', 'block');
      if (reduced) return;
      gsap.fromTo(el.shield[d.team], { scale: 1.3 }, { scale: 1, duration: 0.25, ease: 'back.out(3)', overwrite: 'auto' });
      shake(0.12);
    },
    parry(a, d) {
      if (quiet) return;
      LR.sound.play('parry');
      word(d.team, 'GOTCHA!', 'shout');
      callout(d.team, 'Gotcha!', 0);
      buzz(d.cpu ? 20 : [15, 30, 25]);
      if (reduced) return;
      hitStop(130);
      burst(a, d.team, true);
      zoomPunch(0.04);
      focusLines();
      gsap.fromTo(el.shield[d.team], { scale: 1.5 }, { scale: 1, duration: 0.3, ease: 'back.out(3)', overwrite: 'auto' });
      flash(0.2);
      react.stagger(a.team);
    },
    breaker(d, a) {
      if (quiet) return;
      LR.sound.play('kick', 0.9);
      callout(d.team, 'Point of order!', 0);
      word(a.team, 'SHOVE!', 'shout');
      buzz(30);
      if (reduced) return;
      hitStop(100);
      burst(a, d.team, true);
      const s = actor(d.team).s;
      actor(d.team).hold(['arms', 'body'], 560);
      gsap
        .timeline()
        .to(s, Object.assign({ duration: 0.08, ease: 'power3.out', overwrite: 'auto' }, pose('uppercut')))
        .to(s, { armR: 14, reachR: 1, sy: 1, y: 0, lean: 5, headRot: 0, duration: 0.3, ease: 'back.out(2)' }, '+=0.18');
      flinch(a.team, 0.8);
      react.knockback(a.team);
      shake(0.8);
    },
    tell(f, text) {
      if (quiet) return;
      const t = el.tell[f.team];
      gsap.killTweensOf(t);
      if (!text) {
        if (reduced) gsap.set(t, { opacity: 0 });
        else gsap.to(t, { opacity: 0, scale: 0.5, duration: 0.1 });
        return;
      }
      t.textContent = text;
      if (reduced) {
        gsap.set(t, { opacity: 1, scale: 1, rotation: 0 });
        return;
      }
      gsap.fromTo(t, { opacity: 1, scale: 0.2, rotation: -25 }, { scale: 1, rotation: 0, duration: 0.22, ease: 'back.out(3)' });
      gsap.fromTo(t, { rotation: -6 }, { rotation: 6, duration: 0.07, ease: 'none', repeat: -1, yoyo: true, delay: 0.22 });
    },
    notReady() {
      if (quiet) return;
      if (LR.toast) LR.toast('Filibuster needs a full meter.');
      if (reduced) return;
      gsap.fromTo(el.padSpecial, { x: -7 }, { x: 0, duration: 0.4, ease: 'elastic.out(1.4, 0.2)', clearProps: 'transform' });
    },
    say(f, text) {
      if (quiet) return;
      LR.idle.say(actor(f.team), text, { hold: 1.1, force: true });
    },
    knockout(w, l) {
      if (quiet) return Promise.resolve();
      return new Promise((resolve) => {
        const loser = actor(l.team);
        const winner = actor(w.team);
        const box = fighterEl(l.team);
        loser.hold('all', 2600);
        winner.hold(['arms', 'body'], 1500);
        gsap.to(loser.bubble, { opacity: 0, duration: 0.08, overwrite: 'auto' });
        gsap.delayedCall(0.5, () => LR.idle.say(winner, 'HAHA OKAY', { hold: 1.1, force: true }));
        if (reduced) {
          gsap.delayedCall(1.4, () => {
            loser.release();
            winner.release();
            resolve();
          });
          return;
        }
        rigTo(winner.s, Object.assign({ duration: 0.2, ease: 'back.out(2)' }, pose('victory')));
        const away = l.team === 'left' ? -1 : 1;
        const ab = el.arena.getBoundingClientRect();
        const stacked = ab.width / ab.height < STACK_RATIO;
        const drift = stacked ? 0 : away * Math.min(ab.width, ab.height) * 0.12; // phones: spin in place
        const lift = ab.height * (stacked ? 0.12 : 0.34);
        const ls = loser.s;
        gsap
          .timeline({
            onComplete: () => {
              neutral(l.team);
              winner.release();
              resolve();
            },
          })
          .set(ls, { blink: 1, mouth: 0.9, flop: -1.2 })
          .to(box, { x: drift * 0.6, y: -lift, rotation: away * 200, duration: 0.42, ease: 'power2.out', overwrite: 'auto' })
          .to(box, { x: drift, y: 0, rotation: away * 360, duration: 0.42, ease: 'bounce.out' })
          .set(box, { rotation: 0 })
          .add(() => {
            gsap.set(ls, pose('ko'));
            dizzyStars(box, false);
          })
          .to(box, { x: drift * 0.8, duration: 1.1, ease: 'power1.inOut' })
          // back on their feet, still yelling
          .add(() => gsap.set(ls, { rot: 0, lean: 5, headRot: 0, blink: 0, x: 0, flop: 1 }))
          .fromTo(box, { scaleY: 0.78, scaleX: 1.15 }, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.35)' })
          .add(() => LR.idle.say(loser, 'OH COME ON', { hold: 1.1, force: true }), '<')
          .to(box, { x: 0, y: 0, duration: 0.35, ease: 'power2.inOut' }, '<0.1')
          .to({}, { duration: 0.2 });
      });
    },
    /* Lost on time: a sulk instead of a knockdown. */
    slump(w, l) {
      if (quiet) return Promise.resolve();
      const loser = actor(l.team);
      const winner = actor(w.team);
      loser.hold('all', 1400);
      winner.hold(['arms', 'body'], 1300);
      if (!reduced) {
        rigTo(winner.s, Object.assign({ duration: 0.2, ease: 'back.out(2)' }, pose('victory')));
        rigTo(loser.s, Object.assign({ duration: 0.3, ease: 'power2.out' }, pose('flinch'), { blink: 0.6 }));
      }
      gsap.delayedCall(0.4, () => LR.idle.say(loser, 'SOURCE?', { hold: 1, force: true }));
      return wait(1.5).then(() => {
        neutral(l.team);
        winner.release();
      });
    },
    /* Match point: the loser stands there seeing stars. */
    dazed(l) {
      if (quiet) return;
      const loser = actor(l.team);
      loser.hold('all', 60000);
      gsap.to(loser.bubble, { opacity: 0, duration: 0.08, overwrite: 'auto' });
      if (reduced) return;
      st.dizzy = dizzyStars(fighterEl(l.team), true);
      rigTo(loser.s, Object.assign({ duration: 0.3 }, pose('ko'), { x: 0 }));
      st.sway = gsap.fromTo(loser.s, { rot: -5 }, { rot: 5, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    },
    /* The last word: a giant "OK." lands on the loser and flattens them. */
    lastWord(w, l) {
      if (quiet) return Promise.resolve();
      const winner = actor(w.team);
      const box = fighterEl(l.team);
      const ab = el.arena.getBoundingClientRect();
      const bb = box.getBoundingClientRect();
      const b = document.createElement('span');
      b.className = `bubble last-word last-word--${l.team}`;
      b.textContent = 'OK.';
      b.setAttribute('aria-hidden', 'true');
      b.style.left = `${bb.left - ab.left + bb.width / 2}px`;
      b.style.top = `${bb.top - ab.top + bb.height * 0.12}px`;
      el.arena.appendChild(b);
      gsap.set(b, { xPercent: -50, yPercent: -100 }); // sits on their head
      winner.hold(['arms', 'body', 'face'], 2600);
      LR.sound.play('whoosh');
      if (reduced) {
        // no drop: it just appears over them
        b.style.top = `${bb.top - ab.top + bb.height * 0.55}px`;
        gsap.set(b, { yPercent: -50, opacity: 1 });
        return wait(1);
      }
      rigTo(winner.s, Object.assign({ duration: 0.15, ease: 'power2.out' }, pose('yell'), { spit: 0 }));
      const fallFrom = -(bb.top - ab.top + bb.height * 0.12) - b.offsetHeight - 40;
      const flat = bb.height * 0.74;
      return new Promise((resolve) => {
        gsap
          .timeline({ onComplete: resolve })
          .fromTo(b, { opacity: 1, y: fallFrom, rotation: -8, scale: 1.25 }, { y: 0, rotation: -3, scale: 1, duration: 0.34, ease: 'power3.in' })
          .add(() => {
            LR.sound.play('kick', 1);
            LR.sound.play('thwack', 1);
            shake(1.6);
            flash(0.3);
            zoomPunch(0.08);
            focusLines();
            hitStop(160);
            buzz([50, 30, 80]);
            if (st.sway) st.sway.kill();
            if (st.dizzy) st.dizzy.kill();
            st.sway = st.dizzy = null;
          })
          .to(b, { y: flat, duration: 0.12, ease: 'power4.out' })
          .to(box, { scaleY: 0.14, scaleX: 1.5, transformOrigin: '50% 100%', duration: 0.12, ease: 'power4.out', overwrite: 'auto' }, '<')
          .to({}, { duration: 0.9 });
      });
    },
    getUp(l, flattened) {
      if (st.dizzy) st.dizzy.kill();
      if (st.sway) st.sway.kill();
      st.dizzy = st.sway = null;
      el.arena.querySelectorAll('.last-word').forEach((b) =>
        quiet || reduced ? b.remove() : gsap.to(b, { opacity: 0, scale: 0.6, duration: 0.2, onComplete: () => b.remove() }),
      );
      if (quiet) return;
      neutral(l.team);
      const box = fighterEl(l.team);
      if (reduced || !flattened) {
        gsap.set(box, { clearProps: 'transform,transformOrigin' });
        return;
      }
      gsap.fromTo(
        box,
        { scaleY: 0.3, scaleX: 1.3, transformOrigin: '50% 100%' },
        { scaleY: 1, scaleX: 1, duration: 0.7, ease: 'elastic.out(1, 0.3)', overwrite: 'auto', clearProps: 'transform,transformOrigin' },
      );
      LR.idle.say(actor(l.team), 'OH COME ON', { hold: 1, force: true });
    },
    /* Clean slate: nothing left over from an interrupted match. */
    reset() {
      if (st.dizzy) st.dizzy.kill();
      if (st.sway) st.sway.kill();
      st.dizzy = st.sway = null;
      if (quiet) return;
      el.arena.querySelectorAll('.last-word, .word, .glyph, .dizzy').forEach((n) => n.remove());
      [el.fighterL, el.fighterR].forEach((box) => {
        gsap.killTweensOf(box);
        gsap.set(box, { clearProps: 'transform,transformOrigin' });
      });
      ['left', 'right'].forEach((team) => {
        neutral(team);
        gsap.set(el.shield[team], { opacity: 0 });
        gsap.set(el.tell[team], { opacity: 0 });
      });
    },
  };

  /* ---- HUD, standings, score ------------------------------------------------------ */

  function renderHud() {
    ['left', 'right'].forEach((team) => {
      const f = F[team];
      const h = el.hudSide[team];
      const hp = clamp(f.hp / GAME.hp, 0, 1);
      if (h.hp !== hp) {
        h.hp = hp;
        h.fill.style.transform = `scaleX(${hp.toFixed(4)})`;
        h.lag.style.transform = `scaleX(${hp.toFixed(4)})`;
        h.box.classList.toggle('is-low', hp < 0.3);
      }
      const meter = f.meter / GAME.meterMax;
      if (h.meter !== meter) {
        h.meter = meter;
        h.meterFill.style.transform = `scaleX(${meter.toFixed(4)})`;
        h.box.classList.toggle('is-ready', meter >= 1);
      }
      h.pips.forEach((pip, i) => pip.classList.toggle('is-won', i < f.wins));
    });
    if (!st.side) return;
    const m = player().meter / GAME.meterMax;
    el.padSpecial.style.setProperty('--meter', m.toFixed(3));
    if (m >= 1 && !el.padSpecial.classList.contains('is-ready') && st.mode === 'live') {
      sparkle(el.padSpecial, st.side);
      if (!quiet) LR.sound.play('ready');
    }
    el.padSpecial.classList.toggle('is-ready', m >= 1);
    el.padSpecial.setAttribute('aria-disabled', String(m < 1));
  }

  function renderTimer() {
    const secs = Math.max(0, Math.ceil(st.timeLeft / 1000));
    if (secs === st.shownSecs) return;
    st.shownSecs = secs;
    el.timer.textContent = secs;
    el.timer.classList.toggle('is-low', secs <= 10);
  }

  function renderScore() {
    el.hudLevel.textContent = `Lv ${st.level}`;
    el.record.textContent = `Your record (this browser only): level ${st.level} · won ${st.wins} · lost ${st.losses} · best combo ${st.best} ${st.best === 1 ? 'hit' : 'hits'}.`;
  }

  function renderStandings() {
    const total = standings.left + standings.right;
    const share = total > 0 ? standings.left / total : 0.5;
    el.battle.style.setProperty('--share-left', share.toFixed(4));
    el.numL.textContent = Math.round(standings.left);
    el.numR.textContent = Math.round(standings.right);
    el.bar.setAttribute('aria-label', `Standings: LEFT ${Math.round(standings.left)}, RIGHT ${Math.round(standings.right)}`);
    renderLocal();
  }

  /* Your hits show as a striped slice pushing from your side of the seam:
     visibly separate from TEAM_STATE, and capped so it can't take over. */
  /* The health bar of whoever got hit gives a shake. */
  function jiggleHud(team, k) {
    if (quiet || reduced) return;
    const box = el.hudSide[team] && el.hudSide[team].box;
    if (!box) return;
    const dir = team === 'left' ? -1 : 1;
    gsap.fromTo(box, { x: dir * 9 * k, y: -3 * k }, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1.4, 0.3)', overwrite: 'auto' });
  }

  function pulseBar() {
    if (quiet || reduced || !el.barClash) return;
    gsap.fromTo(el.barClash, { scale: 1.6, rotation: rand(-30, 30) }, { scale: 1, rotation: 0, duration: 0.35, ease: 'back.out(3)', overwrite: 'auto' });
    gsap.fromTo(el.myHits, { scale: 1.5 }, { scale: 1, duration: 0.3, ease: 'back.out(3)', overwrite: 'auto' });
  }

  function renderLocal() {
    const share = parseFloat(el.battle.style.getPropertyValue('--share-left')) || 0.5;
    const boost = st.side ? Math.min(st.hits * 0.002, 0.1) : 0;
    let from = share;
    let to = share;
    if (st.side === 'left') to = Math.min(1, share + boost);
    if (st.side === 'right') from = Math.max(0, share - boost);
    el.battle.classList.toggle('battle--mine-right', st.side === 'right');
    el.battle.style.setProperty('--mine-from', from.toFixed(4));
    el.battle.style.setProperty('--mine-to', to.toFixed(4));
    el.battle.style.setProperty('--edge', (st.side === 'right' ? from : to).toFixed(4));
    el.myHits.textContent = st.hits.toLocaleString('en-US');
  }

  function renderMoves() {
    const kbd = (k) => `<kbd>${k === 'B' ? 'Block' : k}</kbd>`;
    el.movesCombos.innerHTML = COMBOS.map(
      (c) => `<li><span class="moves__name">${c.name}</span><span class="moves__seq">${[...c.seq].map(kbd).join('')}</span></li>`,
    ).join('');
  }

  /* ---- the split: the seam slides toward whoever's losing -------------------------- */

  function cachePushVector() {
    const a = el.arena.getBoundingClientRect();
    if (!a.width || !a.height) return;
    if (a.width / a.height >= STACK_RATIO) {
      pushVec = { x: a.width * GAME.shift, y: 0 };
      return;
    }
    const L = el.fighterL.getBoundingClientRect();
    const R = el.fighterR.getBoundingClientRect();
    const dx = R.left + R.width / 2 - (L.left + L.width / 2);
    const dy = R.top + R.height / 2 - (L.top + L.height / 2);
    const d = Math.hypot(dx, dy) || 1;
    const len = Math.hypot(a.width, a.height) * GAME.shift;
    pushVec = { x: (dx / d) * len, y: (dy / d) * len };
  }

  /* The seam travels the full distance (the leader's colour eats the other
     half); the fighters only step part of the way, so nobody leaves the screen. */
  function showPush(instant) {
    if (quiet) return;
    const p = st.side && F.left ? (F.left.hp - F.right.hp) / GAME.hp : 0; // + = LEFT is ahead
    [
      [el.duel, GAME.fighterStep],
      [split && split.svg, 1],
    ].forEach(([target, k]) => {
      if (!target) return;
      const vars = { x: p * pushVec.x * k, y: p * pushVec.y * k };
      if (instant || reduced) gsap.set(target, vars);
      else gsap.to(target, Object.assign({ duration: 0.45, ease: 'back.out(1.6)', overwrite: 'auto' }, vars));
    });
  }

  /* ---- picking a side ---------------------------------------------------------------- */

  function setSide(team, opts = {}) {
    st.side = team;
    store.set('side', team);
    document.documentElement.dataset.team = team;
    el.panel.dataset.mode = 'play';
    el.hero.dataset.playing = '';
    el.play.hidden = false;
    el.hud.hidden = false;
    F[team].cpu = false;
    F[other(team)].cpu = true;
    el.hudSide[team].tag.textContent = 'You';
    el.hudSide[other(team)].tag.textContent = 'CPU';
    el.hudSide[team].box.classList.add('is-you');
    el.hudSide[other(team)].box.classList.remove('is-you');
    fighterEl(team).classList.add('is-front');
    fighterEl(other(team)).classList.remove('is-front');
    renderLocal();
    if (split) split.set({});
    cachePushVector();
    if (opts.silent) {
      st.mode = 'ready';
      resetFighters(true);
      renderHud();
      renderPause();
      showPush(true);
    }
  }

  /* A little ✗ in the box, like a real ballot. */
  function stamp(team) {
    document.querySelectorAll('[data-pick]').forEach((b) => b.classList.toggle('is-cast', b.dataset.pick === team));
    const marks = document.querySelectorAll(`[data-pick="${team}"] .ballot__mark path`);
    if (quiet || !marks.length) return;
    if (reduced) gsap.set(marks, { scale: 1, opacity: 1 });
    else gsap.fromTo(marks, { scale: 0, opacity: 1, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.24, stagger: 0.1, ease: 'back.out(3)', transformOrigin: '50% 50%' });
  }

  function pick(team, source) {
    if (!team || st.picking) return;
    const ballot = document.querySelector(`[data-pick="${team}"]`);
    const firstPick = !st.side;
    squash(source || ballot, true);
    confetti(team, source || ballot);
    document.documentElement.dataset.team = team; // flash in the new colour
    flash();
    LR.idle.say(actor(team), 'OF COURSE', { hold: 1 });
    gsap.delayedCall(0.35, () => LR.idle.say(actor(other(team)), 'TYPICAL', { hold: 1 }));
    if (!firstPick) {
      if (team !== st.side) {
        setSide(team);
        startMatch();
      }
      return;
    }
    st.picking = true;
    stamp(team);
    if (LR.toast) LR.toast(`Ballot cast: ${team === 'left' ? 'Left' : 'Right'}.`);
    gsap.delayedCall(quiet ? 0 : reduced ? 0.2 : 0.5, () => {
      st.picking = false;
      setSide(team);
      startMatch();
      el.padPunch.focus({ preventScroll: true });
    });
  }

  function arenaPick(e) {
    const a = el.arena.getBoundingClientRect();
    const x = e.clientX - a.left;
    const y = e.clientY - a.top;
    if (a.width / a.height >= STACK_RATIO) return x < a.width / 2 ? 'left' : 'right';
    // stacked: which side of the top-right → bottom-left diagonal?
    return x / a.width + y / a.height < 1 ? 'left' : 'right';
  }

  /* ---- wiring ------------------------------------------------------------------------ */

  const typing = (t) => t && /^(input|textarea|select)$/i.test(t.tagName);

  function bind() {
    document.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => pick(b.dataset.pick, b)));
    el.switchBtn.addEventListener('click', () => pick(other(st.side), el.switchBtn));

    // the pad: pointerdown for instant mashing; keyboard clicks (detail 0) too
    el.pad.querySelectorAll('[data-move]').forEach((btn) => {
      const key = btn.dataset.move;
      if (key === 'B') {
        btn.addEventListener('pointerdown', (e) => {
          if (e.button !== 0) return;
          e.preventDefault(); // no focus change, no long-press menu
          try {
            btn.setPointerCapture(e.pointerId);
          } catch {
            /* fine without it */
          }
          guardDown();
        });
        btn.addEventListener('pointerdown', () => fire(btn));
        ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((type) => btn.addEventListener(type, guardUp));
        btn.addEventListener('click', (e) => {
          if (e.detail !== 0) return;
          guardDown(); // a keyboard click is a short block (hold L for longer)
          guardUp();
        });
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
        return;
      }
      btn.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        squash(btn, false);
        fire(btn);
        press(key);
      });
      btn.addEventListener('click', (e) => {
        if (e.detail === 0 && performance.now() - lastSpace > 400) press(key);
      });
    });

    el.arena.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (!st.side) pick(arenaPick(e), null);
      else press('P');
    });

    const padFor = (key) => el.pad.querySelector(`[data-move="${key}"]`);
    root.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || !st.side || typing(e.target) || el.moves.open) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === 'l') {
        if (!e.repeat) {
          guardDown();
          fire(el.padBlock);
        }
        return;
      }
      // Space is the Filibuster while the fight is on screen and nothing else has focus
      const spaceIsOurs = k === ' ' && heroVisible && (!e.target.closest || !e.target.closest('a, button, summary, [contenteditable]') || e.target.closest('#pad'));
      if (spaceIsOurs) e.preventDefault();
      if (e.repeat) return;
      if (k === 'j' || k === 'f') {
        press('P');
        squash(padFor('P'), false);
        fire(padFor('P'));
      } else if (k === 'k') {
        press('K');
        squash(padFor('K'), false);
        fire(padFor('K'));
      } else if (spaceIsOurs) {
        lastSpace = performance.now();
        press('S');
        squash(el.padSpecial, false);
        fire(el.padSpecial);
      }
    });
    root.addEventListener('keyup', (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === 'l') guardUp();
      if (k === ' ' && performance.now() - lastSpace < 1500) e.preventDefault();
    });
    root.addEventListener('blur', guardUp);

    el.pfpBtn.addEventListener('click', () => {
      squash(el.pfpBtn, false);
      if (LR.pfp && st.side) LR.pfp.download(st.side);
    });

    // Moves: a proper dialog; the round waits while it's open
    const dlg = el.moves;
    const close = () => (typeof dlg.close === 'function' ? dlg.close() : dlg.removeAttribute('open'));
    el.movesBtn.addEventListener('click', () => {
      renderScore();
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
      pause('dialog');
    });
    dlg.addEventListener('close', () => unpause('dialog'));
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg || e.target.closest('[data-close]')) {
        close();
        if (typeof dlg.close !== 'function') unpause('dialog');
      }
    });

    document.addEventListener('visibilitychange', () => (document.hidden ? pause('hidden') : unpause('hidden')));
    if ('IntersectionObserver' in root) {
      new IntersectionObserver(
        ([entry]) => {
          heroVisible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
          if (heroVisible) unpause('offscreen');
          else pause('offscreen');
        },
        { threshold: [0, 0.25, 0.5] },
      ).observe(el.arena);
    }

    root.addEventListener('resize', () => {
      cachePushVector();
      showPush(true);
    });
  }

  /* ---- public -------------------------------------------------------------------------- */

  LR.fight = {
    TEAM_STATE,
    GAME,
    MOVES,
    COMBOS,
    STACK_RATIO,
    brain,
    get side() {
      return st.side;
    },
    /**
     * @param {{split?: object, reduced?: boolean}} ctx
     */
    init(ctx = {}) {
      gsap = root.gsap;
      reduced = !!ctx.reduced;
      split = ctx.split || null;
      const $ = (id) => document.getElementById(id);
      el = {
        hero: $('top'), arena: $('arena'), duel: $('duel'), fighterL: $('fighter-left'), fighterR: $('fighter-right'), clash: $('clash'),
        announceBox: $('announcer-box'), announcer: $('announcer'), announceSub: $('announcer-sub'), hint: $('hint'),
        panel: $('panel'), play: $('panel-play'), switchBtn: $('switch-side'),
        pfpBtn: $('pfp-btn'), soundBtn: $('sound-btn'), barClash: $('battle-clash'), pad: $('pad'), padPunch: $('pad-punch'), padBlock: $('pad-block'),
        padSpecial: $('pad-special'), movesBtn: $('moves-btn'), moves: $('moves'), movesCombos: $('moves-combos'),
        record: $('moves-record'), hud: $('hud'), timer: $('hud-timer'), hudLevel: $('hud-level'),
        battle: $('battle'), numL: $('num-left'), numR: $('num-right'), bar: $('battle-bar'),
        source: $('standings-source'), myHits: $('my-hits'), flash: $('flash'), live: $('live'),
        hudSide: {}, callout: {}, tell: {}, shield: {},
      };
      ['left', 'right'].forEach((team) => {
        const box = el.hud.querySelector(`[data-hud="${team}"]`);
        el.hudSide[team] = {
          box, tag: box.querySelector('.hud__tag'), fill: box.querySelector('.hp__fill'), lag: box.querySelector('.hp__lag'),
          meterFill: box.querySelector('.meter__fill'), pips: [...box.querySelectorAll('.pips i')], hp: -1, meter: -1,
        };
        const c = $(`callout-${team}`);
        el.callout[team] = { box: c, name: c.querySelector('.callout__name'), hits: c.querySelector('.callout__hits'), hide: null };
        const host = fighterEl(team);
        const tell = document.createElement('span');
        tell.className = 'tell';
        tell.setAttribute('aria-hidden', 'true');
        host.appendChild(tell);
        const shield = document.createElement('span');
        shield.className = 'shield';
        shield.setAttribute('aria-hidden', 'true');
        const ward = 'M8 14c15 13 15 79 0 92M20 5c19 17 19 93 0 110M32 22c10 12 10 64 0 76';
        shield.innerHTML = `<svg viewBox="0 0 44 120"><path class="ink" d="${ward}"/><path d="${ward}"/></svg>`;
        host.appendChild(shield);
        el.tell[team] = tell;
        el.shield[team] = shield;
      });

      F.left = fighter('left');
      F.right = fighter('right');
      st.hits = count('hits', store.get('punches', 0)); // "punches" was the old name
      st.wins = count('wins');
      st.losses = count('losses');
      st.best = count('best');
      st.level = Math.max(1, count('level', 1));

      cloud = LR.fx.cloud();
      el.clash.appendChild(cloud);
      el.focus = makeFocusLines();
      el.arena.appendChild(el.focus);
      $('battle-clash').appendChild(LR.fx.spark());

      renderMoves();
      renderStandings();
      renderScore();
      renderHud();
      renderTimer();
      bind();
      cachePushVector();
      gsap.ticker.add(frame);

      const saved = store.get('side', null);
      if (saved === 'left' || saved === 'right') setSide(saved, { silent: true });

      if (TEAM_STATE_ENDPOINT) {
        const refresh = () =>
          fetchTeamState().then((live) => {
            if (!live) return;
            standings = live;
            el.source.textContent = `Standings updated ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
            renderStandings();
          });
        refresh();
        setInterval(refresh, TEAM_STATE_POLL_MS);
      }

      if (TEST) {
        LR.fight._test = {
          st, F, clock, GAME, pauses, press, guardDown, guardUp, player, cpu, startMatch,
          canAct, spam,
        };
      }
    },
    /** Throw a punch (the old FIGHT button). */
    hit: () => press('P'),
    pick,
    /* Milestone celebration: both swing at thin air. Nobody gets hurt. */
    bothSwing() {
      if (st.mode === 'live' || st.mode === 'intro' || quiet) return;
      ['left', 'right'].forEach((team, i) => {
        const f = { team, aim: 0 };
        gsap.delayedCall(i * 0.06, () => {
          show.windup(f, 'P');
          gsap.delayedCall(0.05, () => show.strike(f, foe(f) || f, { key: 'P', m: MOVES.P, fx: [] }));
          gsap.delayedCall(0.1, () => {
            puffCloud(3);
            LR.sound.play('thwack', 0.6);
          });
          gsap.delayedCall(0.14, () => show.recover(f, 'P'));
        });
      });
    },
    /** Easter egg: hold the round while the two of them stare at you. */
    freeze(ms) {
      if (st.mode !== 'live') return;
      pause('stare');
      gsap.delayedCall(ms / 1000, () => unpause('stare'));
    },
  };
})(window);
