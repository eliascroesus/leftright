/* ==========================================================================
   LEFT RIGHT — the fight
   Pick a side (buttons, or click a half of the screen), then brawl:
   mash FIGHT (or tap the arena, or press F). Hits push the clash toward
   the other side; the other side punches back. Push them all the way for a
   K.O.; they bounce straight back up, because the fight never ends.
   Rounds, punches and combos are counted in this browser only.
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
     null to show TEAM_STATE exactly as written above. Local punches are
     never sent anywhere.
     ─────────────────────────────────────────────────────────────────────── */
  const TEAM_STATE_ENDPOINT = null;
  const TEAM_STATE_POLL_MS = 60000;

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

  /* Game tuning. Push runs -1 (you're shoved off) … +1 (you win the round). */
  const GAME = {
    hitPush: 0.022,     // per punch, before the combo bonus
    comboBonus: 0.03,   // +3% push per combo step, capped at 15 steps
    comboWindow: 450,   // ms between punches that keeps a combo going
    superEvery: 10,     // every 10th combo hit is a SUPER haymaker
    superPush: 0.1,
    cpuPush: 0.055,     // the other side's punches
    cpuDelay: [0.5, 1.2], // seconds between their punches in round 1…
    cpuRamp: 0.12,      // …and 12% quicker every round after
    restAfter: 7,       // seconds without a punch before the round rests
    shift: 0.14,        // how far the seam travels at full push (arena share)
    fighterStep: 0.4,   // the fighters follow this much of it
  };

  /* Arenas narrower than this (w/h) stack the fighters diagonally; matches the
     @container rule in css/style.css. */
  const STACK_RATIO = 1.6;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const now = () => performance.now();

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

  let gsap = null;
  let reduced = false;
  let el = {};
  let split = null;
  let cloud = null;
  let cloudHide = null;
  let standings = Object.assign({}, TEAM_STATE);
  let pushVec = { x: 0, y: 0 };

  const st = {
    side: null,
    mode: 'idle', // idle | intro | live | rest | ko | frozen
    round: 1,
    push: 0,
    combo: 0,
    lastHit: 0,
    lastInput: 0,
    cpuCall: null,
    punches: 0,
    won: 0,
    lost: 0,
    best: 0,
  };

  const other = (team) => (team === 'left' ? 'right' : 'left');
  const actor = (team) => LR.idle.actor(team);
  const fighterEl = (team) => (team === 'left' ? el.fighterL : el.fighterR);
  const say = (text) => {
    el.live.textContent = '';
    el.live.textContent = text;
  };

  /* ---- standings bar ------------------------------------------------------ */

  function renderStandings() {
    const total = standings.left + standings.right;
    const share = total > 0 ? standings.left / total : 0.5;
    el.battle.style.setProperty('--share-left', share.toFixed(4));
    el.numL.textContent = Math.round(standings.left);
    el.numR.textContent = Math.round(standings.right);
    el.bar.setAttribute('aria-label', `Standings: LEFT ${Math.round(standings.left)}, RIGHT ${Math.round(standings.right)}`);
    renderLocal();
  }

  /* Your punches show as a striped slice pushing from your side of the seam:
     visibly separate from TEAM_STATE, and capped so it can't take over. */
  function renderLocal() {
    const share = parseFloat(el.battle.style.getPropertyValue('--share-left')) || 0.5;
    const boost = st.side ? Math.min(st.punches * 0.002, 0.1) : 0;
    let from = share;
    let to = share;
    if (st.side === 'left') to = Math.min(1, share + boost);
    if (st.side === 'right') from = Math.max(0, share - boost);
    el.battle.classList.toggle('battle--mine-right', st.side === 'right');
    el.battle.style.setProperty('--mine-from', from.toFixed(4));
    el.battle.style.setProperty('--mine-to', to.toFixed(4));
    el.battle.style.setProperty('--edge', (st.side === 'right' ? from : to).toFixed(4));
    el.myPunches.textContent = st.punches.toLocaleString('en-US');
  }

  function renderScore() {
    el.score.innerHTML = `Rounds won <b>${st.won}</b> · lost <b>${st.lost}</b> · this browser only`;
    el.roundLabel.textContent = `Round ${st.round}`;
  }

  /* ---- juice: confetti, flash, shake, squash ------------------------------------ */

  function squash(target, big) {
    if (reduced || !target) return;
    gsap.set(target, { transition: 'none' });
    gsap.fromTo(
      target,
      { scaleX: big ? 1.28 : 1.12, scaleY: big ? 0.74 : 0.88 },
      { scaleX: 1, scaleY: 1, duration: big ? 0.75 : 0.4, ease: 'elastic.out(1.1, 0.32)', clearProps: 'transform,transition', overwrite: 'auto' },
    );
  }

  function confetti(team, origin) {
    if (reduced) return;
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

  function flash(strength = 0.55) {
    if (reduced) return;
    gsap.fromTo(el.flash, { opacity: strength }, { opacity: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
  }

  function shake(power) {
    if (reduced) return;
    const amp = 3 + power * 10;
    gsap.fromTo(
      el.arena,
      { x: rand(-amp, amp), y: rand(-amp, amp) * 0.7, rotation: rand(-0.5, 0.5) * power },
      { x: 0, y: 0, rotation: 0, duration: 0.42, ease: 'elastic.out(1.2, 0.3)', overwrite: 'auto' },
    );
  }

  function announce(text, tone = 'star', hold = 0.6) {
    return new Promise((resolve) => {
      const a = el.announcer;
      a.textContent = text;
      a.className = `announcer__text${tone === 'accent' ? ' announcer__text--accent' : tone === 'paper' ? ' announcer__text--paper' : ''}`;
      gsap.killTweensOf(a);
      if (reduced) {
        gsap.set(a, { opacity: 1, scale: 1, rotation: 0 });
        gsap.delayedCall(hold + 0.35, () => {
          gsap.set(a, { opacity: 0 });
          resolve();
        });
        return;
      }
      gsap
        .timeline({ onComplete: resolve })
        .fromTo(a, { opacity: 0, scale: 2.6, rotation: -9 }, { opacity: 1, scale: 1, rotation: -3, duration: 0.28, ease: 'back.out(2.2)' })
        .to(a, { scale: 1.07, duration: hold, ease: 'none' })
        .to(a, { opacity: 0, scale: 0.7, duration: 0.16, ease: 'power2.in' });
    });
  }

  function showCombo(n) {
    if (n < 3) return;
    const c = el.combo;
    c.textContent = n % GAME.superEvery === 0 ? `${n} hits · super!` : `${n} hit combo`;
    c.style.color = 'var(--accent)';
    gsap.killTweensOf(c);
    if (reduced) {
      gsap.set(c, { opacity: 1 });
      gsap.to(c, { opacity: 0, delay: 0.9, duration: 0.2 });
      return;
    }
    gsap.fromTo(c, { opacity: 1, scale: 1.6, rotation: rand(-8, 8) }, { scale: 1, duration: 0.3, ease: 'back.out(3)' });
    gsap.to(c, { opacity: 0, y: -10, duration: 0.25, delay: 0.8, ease: 'power1.in', onComplete: () => gsap.set(c, { y: 0 }) });
  }

  /* ---- the brawl cloud ------------------------------------------------------------- */

  function puffCloud(combo) {
    if (!cloud) return;
    const size = 0.55 + Math.min(combo, 25) * 0.035;
    if (reduced) {
      gsap.set(cloud, { opacity: 1, scale: Math.min(size, 1) });
    } else {
      gsap.to(cloud, { opacity: 1, scale: size, rotation: rand(-4, 4), duration: 0.16, ease: 'back.out(3)', overwrite: 'auto' });
      const outline = cloud.querySelectorAll('.cloud-outline .puff');
      const fills = cloud.querySelectorAll('.cloud-fill .puff');
      fills.forEach((f, i) => {
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

  function hitStar(defender, power, big) {
    if (reduced) return;
    const box = fighterEl(defender.team).getBoundingClientRect();
    const arena = el.arena.getBoundingClientRect();
    const fx = defender.team === 'left' ? 0.64 : 0.36;
    const star = LR.fx.star();
    star.classList.add('hit-star');
    star.style.left = `${box.left - arena.left + box.width * fx}px`;
    star.style.top = `${box.top - arena.top + box.height * 0.5}px`;
    el.arena.appendChild(star);
    gsap
      .timeline({ onComplete: () => star.remove() })
      .fromTo(star, { scale: 0.2, rotation: rand(-60, 60) }, { scale: (big ? 1.8 : 0.9) + power * 0.4, rotation: '+=40', duration: 0.14, ease: 'back.out(3)' })
      .to(star, { scale: 0.2, opacity: 0, duration: 0.22, ease: 'power2.in' }, '+=0.05');
  }

  /* ---- punches ------------------------------------------------------------------------ */

  function flinch(defender, power) {
    const s = defender.s;
    defender.hold(['face', 'body'], 320);
    gsap.fromTo(
      s,
      { headRot: -12 - power * 6, lean: -6, x: -8 - power * 8, blink: 0.85 },
      { headRot: 0, lean: 5, x: 0, blink: 0, duration: 0.38, ease: 'power2.out', overwrite: 'auto' },
    );
  }

  function swing(attacker, defender, opts = {}) {
    if (!attacker || !defender) return;
    const s = attacker.s;
    const power = opts.power == null ? 0.5 : opts.power;
    attacker.hold(['arms', 'body'], opts.super ? 720 : 380);
    fighterEl(attacker.team).classList.add('is-front');
    fighterEl(defender.team).classList.remove('is-front');
    LR.sound.play('whoosh');
    if (reduced) {
      // Static pose: the characters don't move; the hit still counts.
      LR.sound.play('thwack', power);
      puffCloud(opts.combo || 3);
      if (opts.onLand) opts.onLand();
      return;
    }
    gsap.to(s, { mouth: 1, duration: 0.06, overwrite: 'auto' });
    const land = () => {
      flinch(defender, power);
      hitStar(defender, power, opts.super);
      puffCloud(opts.combo || 3);
      shake(opts.super ? 1.4 : power);
      LR.sound.play('thwack', opts.super ? 1 : power);
      if (opts.onLand) opts.onLand();
    };
    const tl = gsap.timeline();
    if (opts.super) {
      tl.to(s, { armL: -30, lean: -9, x: -10, duration: 0.14, ease: 'power2.in', overwrite: 'auto' })
        .to(s, { armL: 196, reachL: 1.35, lean: 17, x: 22, duration: 0.2, ease: 'power3.in' })
        .add(land)
        .to(s, { armL: 44, reachL: 1, lean: 5, x: 0, duration: 0.38, ease: 'back.out(2)' }, '+=0.1');
    } else {
      const aim = rand(-12, 16);
      tl.to(s, { armR: aim - 36, reachR: 0.9, lean: 2, duration: 0.05, ease: 'power1.out', overwrite: 'auto' })
        .to(s, { armR: aim, reachR: 1.5 + power * 0.18, lean: 13, x: 14, duration: 0.07, ease: 'power3.out' })
        .add(land)
        .to(s, { armR: rand(10, 30), reachR: 1, lean: 5, x: 0, duration: 0.22, ease: 'back.out(2)' }, '+=0.03');
    }
  }

  /* Milestone celebration: both throw a swing at once. Nobody gets pushed. */
  function bothSwing() {
    const L = actor('left');
    const R = actor('right');
    swing(L, R, { power: 0.6 });
    gsap.delayedCall(0.05, () => swing(R, L, { power: 0.6 }));
  }

  /* ---- the round --------------------------------------------------------------------- */

  function cachePushVector() {
    const a = el.arena.getBoundingClientRect();
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

  /* The seam travels the full distance (the winner's colour eats the loser's
     half); the fighters only step part of the way, so nobody leaves the screen. */
  function showPush(instant) {
    const p = st.push * (st.side === 'right' ? -1 : 1); // + = the clash moves toward RIGHT
    const moves = [
      [el.duel, GAME.fighterStep],
      [split && split.svg, 1],
    ];
    moves.forEach(([target, k]) => {
      if (!target) return;
      const vars = { x: p * pushVec.x * k, y: p * pushVec.y * k };
      if (instant || reduced) gsap.set(target, vars);
      else gsap.to(target, Object.assign({ duration: 0.45, ease: 'back.out(1.6)', overwrite: 'auto' }, vars));
    });
  }

  function scheduleCpu() {
    if (st.cpuCall) st.cpuCall.kill();
    const speed = 1 + (st.round - 1) * GAME.cpuRamp;
    st.cpuCall = gsap.delayedCall(rand(GAME.cpuDelay[0], GAME.cpuDelay[1]) / speed, () => {
      if (st.mode !== 'live') return;
      if (now() - st.lastInput > GAME.restAfter * 1000) {
        rest();
        return;
      }
      swing(actor(other(st.side)), actor(st.side), {
        power: 0.45,
        onLand: () => {
          if (st.mode !== 'live') return;
          st.push = clamp(st.push - GAME.cpuPush, -1, 1);
          showPush();
          checkKO();
        },
      });
      scheduleCpu();
    });
  }

  function rest() {
    st.mode = 'rest';
    el.hint.classList.add('is-on');
  }

  function startRound() {
    st.mode = 'intro';
    st.push = 0;
    st.combo = 0;
    cachePushVector();
    showPush();
    renderScore();
    say(`Round ${st.round}. Fight!`);
    LR.sound.play('bell', 1);
    announce(`Round ${st.round}`, 'paper', 0.55)
      .then(() => announce('Fight!', 'accent', 0.35))
      .then(() => {
        if (st.mode !== 'intro') return;
        st.mode = 'live';
        st.lastInput = now();
        scheduleCpu();
      });
  }

  function checkKO() {
    if (st.mode !== 'live') return;
    if (st.push >= 1) knockout(true);
    else if (st.push <= -1) knockout(false);
  }

  function dizzyStars(host) {
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
    return gsap.to(orbit, {
      a: Math.PI * 4,
      duration: 1.3,
      ease: 'none',
      onUpdate: () =>
        stars.forEach((s, i) => {
          const t = orbit.a + (i * Math.PI * 2) / 3;
          gsap.set(s, { x: Math.cos(t) * r, y: Math.sin(t) * r * 0.3, scale: 0.8 + Math.sin(t) * 0.25, zIndex: Math.sin(t) > 0 ? 2 : 0 });
        }),
      onComplete: () => wrap.remove(),
    });
  }

  function knockout(playerWon) {
    st.mode = 'ko';
    if (st.cpuCall) st.cpuCall.kill();
    const loserTeam = playerWon ? other(st.side) : st.side;
    const loser = actor(loserTeam);
    const winner = actor(other(loserTeam));
    const box = fighterEl(loserTeam);
    if (playerWon) st.won += 1;
    else st.lost += 1;
    store.set('won', st.won);
    store.set('lost', st.lost);
    renderScore();
    say(playerWon ? `K.O.! You win round ${st.round}.` : `K.O.! You lose round ${st.round}.`);
    LR.sound.play('bell', 3);
    announce('K.O.!', 'star', 0.9);
    flash(0.35);

    loser.hold('all', 2600);
    winner.hold(['arms', 'body'], 1500);
    const away = loserTeam === 'left' ? -1 : 1;
    const arenaBox = el.arena.getBoundingClientRect();
    const stacked = arenaBox.width / arenaBox.height < STACK_RATIO;
    const drift = stacked ? 0 : away * Math.min(arenaBox.width, arenaBox.height) * 0.12; // phones: spin in place
    const lift = arenaBox.height * (stacked ? 0.12 : 0.34);
    const ls = loser.s;
    const ws = winner.s;
    gsap.to([loser.bubble, el.combo], { opacity: 0, duration: 0.08, overwrite: 'auto' });

    // winner: arms up, full yell
    if (!reduced) gsap.to(ws, { armL: 80, armR: 76, mouth: 1, lean: 2, duration: 0.2, ease: 'back.out(2)' });
    gsap.delayedCall(0.5, () => LR.idle.say(winner, 'HAHA OKAY', { hold: 1.1, force: true }));

    const tl = gsap.timeline({
      onComplete: () => {
        loser.release();
        winner.release();
        st.round += 1;
        startRound();
      },
    });
    if (reduced) {
      tl.to({}, { duration: 1.4 }); // no launch, no spin: just the banner, then the next round
      return;
    }
    tl.set(ls, { blink: 1, mouth: 0.9, flop: -1.2 })
      .to(box, { x: drift * 0.6, y: -lift, rotation: away * 200, duration: 0.42, ease: 'power2.out' })
      .to(box, { x: drift, y: 0, rotation: away * 360, duration: 0.42, ease: 'bounce.out' })
      .set(box, { rotation: 0 })
      .add(() => {
        gsap.set(ls, Object.assign({}, LR.rig.POSES.ko));
        dizzyStars(box);
      })
      .to(box, { x: drift * 0.8, duration: 1.1, ease: 'power1.inOut' })
      // back on their feet, still yelling
      .add(() => gsap.set(ls, { rot: 0, lean: 5, headRot: 0, blink: 0, x: 0, flop: 1 }))
      .fromTo(box, { scaleY: 0.78, scaleX: 1.15 }, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.35)' })
      .add(() => LR.idle.say(loser, 'OH COME ON', { hold: 1.1, force: true }), '<')
      .to(box, { x: 0, y: 0, duration: 0.35, ease: 'power2.inOut' }, '<0.1')
      .to({}, { duration: 0.2 });
    // everyone back to the middle
    st.push = 0;
    gsap.delayedCall(1.4, () => showPush());
  }

  /* ---- input --------------------------------------------------------------------------- */

  function hit() {
    if (!st.side || st.mode === 'ko' || st.mode === 'frozen') return;
    const t = now();
    st.lastInput = t;
    if (st.mode === 'rest') {
      st.mode = 'live';
      scheduleCpu();
    }
    el.hint.classList.remove('is-on');
    st.combo = t - st.lastHit < GAME.comboWindow ? st.combo + 1 : 1;
    st.lastHit = t;
    st.punches += 1;
    if (st.combo > st.best) {
      st.best = st.combo;
      store.set('best', st.best);
    }
    store.set('punches', st.punches);
    renderLocal();
    squash(el.fightBtn, false);
    const isSuper = st.combo % GAME.superEvery === 0;
    const power = Math.min(1, 0.35 + st.combo * 0.05);
    showCombo(st.combo);
    swing(actor(st.side), actor(other(st.side)), {
      power,
      super: isSuper,
      combo: st.combo,
      onLand: () => {
        if (st.mode !== 'live') return;
        st.push = clamp(st.push + (isSuper ? GAME.superPush : GAME.hitPush * (1 + Math.min(st.combo, 15) * GAME.comboBonus)), -1, 1);
        showPush();
        checkKO();
      },
    });
  }

  function setSide(team, opts = {}) {
    st.side = team;
    store.set('side', team);
    document.documentElement.dataset.team = team;
    el.panel.dataset.mode = 'play';
    el.play.hidden = false;
    el.sideChip.textContent = team === 'left' ? 'Left' : 'Right';
    fighterEl(team).classList.add('is-front');
    fighterEl(other(team)).classList.remove('is-front');
    renderLocal();
    if (split) split.set({});
    cachePushVector();
    if (opts.silent) {
      st.mode = 'rest';
      el.hint.classList.add('is-on');
      showPush(true);
      return;
    }
    say(`You picked ${team === 'left' ? 'LEFT' : 'RIGHT'}.`);
    startRound();
  }

  function pick(team, source) {
    if (!team) return;
    squash(source, true);
    confetti(team, source);
    document.documentElement.dataset.team = team; // flash in the new colour
    flash();
    const firstPick = !st.side;
    const switching = st.side && st.side !== team;
    if (switching) {
      st.round = 1;
      st.push = 0;
      if (st.cpuCall) st.cpuCall.kill();
    }
    setSide(team);
    // both yell at the newcomer
    LR.idle.say(actor(team), 'OF COURSE', { hold: 1 });
    gsap.delayedCall(0.35, () => LR.idle.say(actor(other(team)), 'TYPICAL', { hold: 1 }));
    if (firstPick || switching) el.fightBtn.focus({ preventScroll: true });
  }

  function arenaPick(e) {
    const a = el.arena.getBoundingClientRect();
    const x = e.clientX - a.left;
    const y = e.clientY - a.top;
    if (a.width / a.height >= STACK_RATIO) return x < a.width / 2 ? 'left' : 'right';
    // stacked: which side of the top-right → bottom-left diagonal?
    return x / a.width + y / a.height < 1 ? 'left' : 'right';
  }

  function bind() {
    document.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => pick(b.dataset.pick, b)));
    el.switchBtn.addEventListener('click', () => pick(other(st.side), el.fightBtn));

    // FIGHT: pointerdown for instant mashing; keyboard clicks (detail 0) too.
    el.fightBtn.addEventListener('pointerdown', (e) => {
      if (e.button === 0) hit();
    });
    el.fightBtn.addEventListener('click', (e) => {
      if (e.detail === 0) hit();
    });

    el.arena.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (!st.side) pick(arenaPick(e), null);
      else hit();
    });

    root.addEventListener('keydown', (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.key === 'f' || e.key === 'F') && st.side && !/input|textarea|select/i.test(e.target.tagName)) hit();
    });

    el.pfpBtn.addEventListener('click', () => {
      squash(el.pfpBtn, false);
      if (LR.pfp && st.side) LR.pfp.download(st.side);
    });

    root.addEventListener('resize', () => {
      cachePushVector();
      showPush(true);
    });
  }

  LR.fight = {
    TEAM_STATE,
    GAME,
    STACK_RATIO,
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
        heroBg: $('hero-bg'), arena: $('arena'), duel: $('duel'), fighterL: $('fighter-left'), fighterR: $('fighter-right'),
        clash: $('clash'), combo: $('combo'), announcer: $('announcer'), hint: $('hint'), panel: $('panel'),
        play: $('panel-play'), sideChip: $('side-chip'), roundLabel: $('round-label'),
        switchBtn: $('switch-side'), fightBtn: $('fight-btn'), pfpBtn: $('pfp-btn'), score: $('score'),
        battle: $('battle'), numL: $('num-left'), numR: $('num-right'), bar: $('battle-bar'),
        source: $('standings-source'), myPunches: $('my-punches'), flash: $('flash'), live: $('live'),
      };
      st.punches = Math.max(0, Number(store.get('punches', 0)) || 0);
      st.won = Math.max(0, Number(store.get('won', 0)) || 0);
      st.lost = Math.max(0, Number(store.get('lost', 0)) || 0);
      st.best = Math.max(0, Number(store.get('best', 0)) || 0);

      cloud = LR.fx.cloud();
      el.clash.appendChild(cloud);
      const spark = LR.fx.spark();
      $('battle-clash').appendChild(spark);

      renderStandings();
      renderScore();
      bind();
      cachePushVector();

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
    },
    hit,
    pick,
    bothSwing,
    /** Easter egg: hold the fight while the two of them stare at you. */
    freeze(ms) {
      if (st.mode !== 'live' && st.mode !== 'rest') return;
      const was = st.mode;
      st.mode = 'frozen';
      if (st.cpuCall) st.cpuCall.kill();
      gsap.delayedCall(ms / 1000, () => {
        if (st.mode !== 'frozen') return;
        st.mode = was;
        st.lastInput = now();
        if (was === 'live') scheduleCpu();
      });
    },
  };
})(window);
