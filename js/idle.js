/* ==========================================================================
   LEFT RIGHT — idle loop: the always-on yelling
   Per fighter: mouth flaps in syllables (with the odd full scream and spit),
   fists shake, the body jitters like a paper cutout, feet stamp, eyes
   blink every 3–5 s and follow your cursor (or glare at the other one).
   Shared: a 30 s rage build that ends in steam from the ears, and speech
   bubbles bickering about nothing. Each side runs on slightly different
   timing so it never looks mirrored.
   Only transforms and opacity change (see js/rig.js).
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  /* Content-free bickering, debate-stage style: no issues, no names, no
     slogans. Both sides draw from the same pool. */
  const LINES = [
    'SOURCE?', 'TYPICAL', 'READ A BOOK', 'HAHA OKAY', "YOU DON'T GET IT", 'OH REALLY?', 'OF COURSE', 'OH COME ON',
    'FACT CHECK!', 'LET ME FINISH', 'NEXT QUESTION', 'POINT OF ORDER', 'NO COMMENT', 'I HAVE THE FLOOR', 'RESPECTFULLY, NO',
  ];

  const RAGE_SECONDS = 30; // calm → steam, then it starts over

  let gsap = null;
  let actors = [];
  let paused = false;
  let chatter = true; // idle speech bubbles (the fight quiets them mid-round)
  let glare = false; // mid-round they only have eyes for each other
  let staring = false;
  let reduced = false;
  let rageTl = null;
  let lastLine = '';
  const pointer = { x: 0, y: 0, at: -1e9 };

  const now = () => performance.now();
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  /* ---- one fighter ---------------------------------------------------- */

  function makeActor(char, host, cfg) {
    const s = char.state;
    const holds = { arms: 0, body: 0, mouth: 0, face: 0 };
    const calls = [];
    const bubble = document.createElement('span');
    bubble.className = 'bubble';
    bubble.setAttribute('aria-hidden', 'true');
    host.appendChild(bubble);

    const actor = {
      char,
      s,
      team: char.team.id,
      host,
      bubble,
      speed: cfg.speed,
      eye: null,
      eyeAt: -1e9,
      /** Keep the idle loop's hands off some channels while the fight animates them. */
      hold(what, ms) {
        const keys = what === 'all' ? Object.keys(holds) : [].concat(what);
        keys.forEach((k) => (holds[k] = Math.max(holds[k], now() + ms)));
      },
      free: (k) => now() >= holds[k],
      /** Hand some channels straight back (e.g. when a block is let go). */
      unhold(what) {
        [].concat(what).forEach((k) => (holds[k] = 0));
      },
      release() {
        Object.keys(holds).forEach((k) => (holds[k] = 0));
      },
    };

    // self-rescheduling loops that skip their work while paused
    function loop(work, delay) {
      const c = {};
      const run = () => {
        if (!paused) work();
        c.call = gsap.delayedCall(delay(), run);
      };
      c.call = gsap.delayedCall(delay() * Math.random(), run);
      calls.push(c);
    }

    // mouth: a syllable every ~0.15–0.25 s, sometimes a sustained scream
    function syllable() {
      if (paused || !actor.free('mouth')) {
        actor.mouthCall = gsap.delayedCall(0.12, syllable);
        return;
      }
      const scream = Math.random() < 0.16;
      const open = scream ? 1 : rand(0.5, 0.95);
      const up = rand(0.055, 0.09) * cfg.speed;
      const hold = scream ? rand(0.3, 0.55) : rand(0.015, 0.05);
      const down = rand(0.05, 0.08) * cfg.speed;
      const shut = Math.random() < 0.3 ? rand(0.06, 0.2) : rand(0.25, 0.45);
      const tl = gsap.timeline({ onComplete: syllable });
      tl.to(s, { mouth: open, duration: up, ease: 'power2.out' }).to(s, { mouth: shut, duration: down, ease: 'power1.in' }, up + hold);
      if (actor.free('face')) {
        tl.to(s, { headY: -2 - open * 3, headRot: rand(-2, 4), duration: up, ease: 'power2.out' }, 0).to(
          s,
          { headY: 0, duration: down + hold, ease: 'power1.inOut' },
          up,
        );
      }
      if (actor.free('body')) {
        tl.to(s, { bodySY: 1 + open * 0.025, duration: up }, 0).to(s, { bodySY: 1, duration: down }, up + hold);
      }
      tl.to(s, { flop: rand(-0.5, 0.9), duration: 0.6, ease: 'elastic.out(1, 0.35)' }, 0);
      if (scream) {
        s.spit = 0;
        tl.to(s, { spit: 1, duration: 0.55, ease: 'none' }, 0);
        if (actor.free('body')) tl.to(s, { lean: 11, duration: up * 1.5, ease: 'power2.out' }, 0).to(s, { lean: 5, duration: 0.4, ease: 'power2.inOut' }, up + hold);
        if (actor.free('face')) tl.to(s, { browL: 4, browR: 5, duration: up }, 0).to(s, { browL: 0, browR: 0, duration: 0.3 }, up + hold);
      }
      actor.mouthTl = tl;
    }

    actor.start = () => {
      syllable();
      // fists shake up and down
      loop(
        () => {
          if (!actor.free('arms')) return;
          const high = Math.random() < 0.35;
          gsap.to(s, {
            armL: high ? rand(52, 72) : rand(18, 48),
            armR: high ? rand(38, 58) : rand(-8, 30),
            duration: rand(0.16, 0.3) * cfg.speed,
            ease: 'back.out(2)',
            overwrite: 'auto',
          });
        },
        () => rand(0.22, 0.5) * cfg.speed,
      );
      // cutout jitter, ~12 fps on purpose
      loop(
        () => {
          if (!actor.free('body')) return;
          s.x = rand(-1.3, 1.3);
          s.rot = rand(-0.7, 0.7);
        },
        () => 1 / 12,
      );
      // foot stamp
      loop(
        () => {
          if (!actor.free('body')) return;
          const leg = Math.random() < 0.5 ? 'legL' : 'legR';
          gsap.to(s, { [leg]: rand(5, 9), duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.out' });
        },
        () => rand(1.2, 2.6) * cfg.speed,
      );
      // blink
      loop(
        () => {
          if (!actor.free('face')) return;
          gsap.to(s, { blink: 1, duration: 0.06, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        },
        () => rand(3, 5),
      );
    };

    actor.stop = () => {
      if (actor.mouthTl) actor.mouthTl.kill();
      if (actor.mouthCall) actor.mouthCall.kill();
      calls.forEach((c) => c.call && c.call.kill());
      calls.length = 0;
    };

    // pupils: smooth follow
    actor.lookX = gsap.quickTo(s, 'lookX', { duration: 0.25, ease: 'power3.out' });
    actor.lookY = gsap.quickTo(s, 'lookY', { duration: 0.25, ease: 'power3.out' });
    return actor;
  }

  /* ---- speech bubbles --------------------------------------------------- */

  function say(actor, text, opts = {}) {
    if (!actor || (!opts.force && !actor.free('mouth'))) return;
    const b = actor.bubble;
    let line = text;
    if (!line) {
      do line = pick(LINES);
      while (line === lastLine && LINES.length > 1);
    }
    lastLine = line;
    b.textContent = line;
    gsap.killTweensOf(b);
    const tilt = actor.team === 'left' ? -1 : 1;
    gsap.fromTo(
      b,
      { opacity: 0, scale: 0.3, rotation: tilt * 10 },
      { opacity: 1, scale: 1, rotation: tilt * rand(-1, 4), duration: 0.35, ease: 'back.out(3)' },
    );
    gsap.to(b, { opacity: 0, scale: 0.6, duration: 0.18, ease: 'power2.in', delay: opts.hold || rand(1.05, 1.5) });
  }

  function scheduleBubbles() {
    let turn = Math.random() < 0.5 ? 0 : 1;
    const next = () => {
      gsap.delayedCall(rand(0.9, 1.7), () => {
        if (!paused && chatter) {
          const a = actors[turn];
          const b = actors[1 - turn];
          say(a);
          if (Math.random() < 0.2) gsap.delayedCall(0.3, () => !paused && say(b));
          turn = 1 - turn;
        }
        next();
      });
    };
    next();
  }

  /* ---- rage: calm → red → steam, every 30 s, for both at once ----------- */

  function steamPuff(actor, delay) {
    const s = actor.s;
    gsap
      .timeline({ delay })
      .set(s, { steam: 0 })
      .to(s, { steam: 1, duration: 1.25, ease: 'power1.out' }, 0)
      .to(s, { hatY: -26, hatRot: -8, duration: 0.14, ease: 'power2.out' }, 0)
      .to(s, { hatY: 0, hatRot: 0, duration: 0.7, ease: 'bounce.out' }, 0.14)
      .to(s, { flop: 1.3, duration: 0.1 }, 0)
      .to(s, { flop: 0, duration: 0.9, ease: 'elastic.out(1, 0.3)' }, 0.1);
  }

  function startRage() {
    const states = actors.map((a) => a.s);
    rageTl = gsap.timeline({ repeat: -1 });
    rageTl
      .fromTo(states, { rage: 0.05 }, { rage: 1, duration: RAGE_SECONDS, ease: 'none' })
      .add(() => actors.forEach((a, i) => steamPuff(a, i * 0.07)))
      .to(states, { rage: 0.05, duration: 0.9, ease: 'power2.out' }, '+=0.1')
      .to({}, { duration: 0.4 });
  }

  /* ---- per-frame: eyes + vein throb, then draw both rigs ----------------- */

  function refreshEye(actor, t) {
    if (t - actor.eyeAt > 250) {
      actor.eye = actor.char.eyeCentre();
      actor.eyeAt = t;
    }
    return actor.eye;
  }

  function tick() {
    const t = now();
    const cursorLive = t - pointer.at < 2500;
    actors.forEach((a) => refreshEye(a, t)); // reads first…
    actors.forEach((a, i) => {
      // …then writes
      const s = a.s;
      s.throb = Math.max(0, (s.rage - 0.4) / 0.6) * (0.5 + 0.5 * Math.sin(t / 95 + i));
      if (!reduced && a.free('face') && a.eye) {
        const target = cursorLive && !glare ? pointer : actors[1 - i].eye;
        if (target) {
          let dx = target.x - a.eye.x;
          let dy = target.y - a.eye.y;
          const d = Math.hypot(dx, dy) || 1;
          const k = Math.min(1, d / 140);
          a.lookX(((dx / d) * k * a.char.team.facing));
          a.lookY((dy / d) * k);
        }
      }
      a.char.apply();
    });
  }

  /* ---- public ------------------------------------------------------------ */

  const idle = {
    LINES,
    get actors() {
      return actors;
    },
    get paused() {
      return paused;
    },
    /**
     * @param {{left: object, right: object}} chars rigs from LR.rig.create
     * @param {{left: HTMLElement, right: HTMLElement}} hosts fighter containers
     */
    start(chars, hosts, opts = {}) {
      gsap = root.gsap;
      reduced = !!opts.reduced;
      actors = [
        makeActor(chars.left, hosts.left, { speed: 1 }),
        makeActor(chars.right, hosts.right, { speed: 1.08 }),
      ];
      gsap.ticker.add(tick);
      root.addEventListener(
        'pointermove',
        (e) => {
          pointer.x = e.clientX;
          pointer.y = e.clientY;
          pointer.at = now();
        },
        { passive: true },
      );
      if (reduced) {
        // Static pose: no loop, no bubbles, no drifting pupils.
        actors.forEach((a) => a.char.pose('idle'));
        return idle;
      }
      actors.forEach((a) => a.start());
      startRage();
      scheduleBubbles();
      return idle;
    },
    actor: (team) => actors.find((a) => a.team === team),
    say,
    pause() {
      paused = true;
    },
    resume() {
      paused = false;
    },
    /** Idle speech bubbles on/off (forced lines still show). */
    chatter(on) {
      chatter = !!on;
    },
    /** Pupils lock on the opponent instead of following the cursor. */
    glare(on) {
      glare = !!on;
    },
    /** Easter egg: freeze, stare at the camera, then carry on yelling. */
    stare() {
      if (staring || !actors.length) return;
      staring = true;
      paused = true;
      if (rageTl) rageTl.pause();
      actors.forEach((a) => {
        a.stop();
        gsap.killTweensOf(a.s);
        gsap.to(a.bubble, { opacity: 0, duration: 0.1 });
      });
      const cam = LR.rig.POSES.camera;
      const snapTo = { turn: cam.turn, mouth: cam.mouth, lookX: 0, lookY: 0, browL: cam.browL, browR: cam.browR, browTiltL: cam.browTiltL, browTiltR: cam.browTiltR, lean: 1, headRot: 0, headY: 0, x: 0, rot: 0, spit: 0 };
      gsap
        .timeline({
          onComplete: () => {
            staring = false;
            paused = false;
            if (rageTl) rageTl.resume();
            actors.forEach((a) => a.start());
          },
        })
        .to({}, { duration: reduced ? 0 : 0.45 }) // frozen mid-yell
        .add(() => actors.forEach((a) => a.hold('all', 1700)))
        .add(() => actors.forEach((a) => gsap.to(a.s, Object.assign({ duration: 0.12, ease: 'power3.out' }, snapTo))))
        .add(() => actors.forEach((a) => gsap.to(a.s, { blink: 1, duration: 0.05, yoyo: true, repeat: 1, delay: 0.7 })))
        .to({}, { duration: 1.5 })
        .add(() => actors.forEach((a) => gsap.to(a.s, { turn: 0, browL: 0, browR: 0, browTiltL: 0, browTiltR: 0, lean: 5, mouth: 0.9, duration: 0.14, ease: 'power3.out' })))
        .to({}, { duration: 0.15 });
    },
  };

  LR.idle = idle;
})(window);
