/* ==========================================================================
   LEFT RIGHT — milestones
   --------------------------------------------------------------------------
   Edit MILESTONES by hand. Each entry:
     id         unique string (used to remember which ones a visitor has seen)
     label      short story beat (never a price target)
     timestamp  ISO date string, shown once unlocked (or null)
     state      'locked' | 'unlocked'
     icon       roadmap picture: flag | rocket | crate | megaphone | planet | trophy
   Flip a milestone to 'unlocked' and redeploy: every visitor who hasn't seen
   it yet gets the pop animation and both fighters throw a swing, once.
   The same list draws the star row under the fight and the space roadmap
   (#roadmap-stage) further down.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  const MILESTONES = [
    { id: 'm1', label: '{{MILESTONE_1_LABEL}}', timestamp: '2026-09-01T12:00:00Z', state: 'unlocked', icon: 'flag' },
    { id: 'm2', label: '{{MILESTONE_2_LABEL}}', timestamp: '2026-09-18T12:00:00Z', state: 'unlocked', icon: 'rocket' },
    { id: 'm3', label: '{{MILESTONE_3_LABEL}}', timestamp: null, state: 'locked', icon: 'crate' },
    { id: 'm4', label: '{{MILESTONE_4_LABEL}}', timestamp: null, state: 'locked', icon: 'megaphone' },
    { id: 'm5', label: '{{MILESTONE_5_LABEL}}', timestamp: null, state: 'locked', icon: 'planet' },
    { id: 'm6', label: '{{MILESTONE_6_LABEL}}', timestamp: null, state: 'locked', icon: 'trophy' },
  ];

  const SEEN_KEY = 'lr:milestones-seen';
  const DATE = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  function readSeen() {
    try {
      const v = JSON.parse(localStorage.getItem(SEEN_KEY) || '[]');
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }

  function writeSeen(ids) {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
    } catch {
      /* private mode etc.: the pop just replays next visit */
    }
  }

  function formatDate(ts) {
    const d = ts ? new Date(ts) : null;
    return d && !isNaN(d) ? DATE.format(d) : '';
  }

  function starPath() {
    const m = LR.fx && LR.fx.art.star.match(/ d="([^"]+)"/);
    return m ? m[1] : '';
  }

  function render(list, host) {
    const d = starPath();
    host.textContent = '';
    list.forEach((m, i) => {
      const unlocked = m.state === 'unlocked';
      const date = formatDate(m.timestamp);
      const li = document.createElement('li');
      li.className = `ms ${unlocked ? 'is-unlocked' : 'is-locked'}`;
      li.dataset.id = m.id;
      li.tabIndex = 0;
      li.setAttribute('aria-label', unlocked ? `Milestone ${i + 1}: ${m.label}${date ? `, unlocked ${date}` : ''}` : `Milestone ${i + 1}: locked`);
      li.innerHTML =
        `<svg class="ms__star" viewBox="0 0 60 60" aria-hidden="true"><path d="${d}"/></svg>` +
        `<span class="ms__n" aria-hidden="true">${i + 1}</span>` +
        `<span class="ms__tip" aria-hidden="true"></span>`;
      const tip = li.querySelector('.ms__tip');
      const b = document.createElement('b');
      b.textContent = unlocked ? m.label : 'Locked';
      tip.appendChild(b);
      if (unlocked && date) {
        const t = document.createElement('time');
        t.dateTime = m.timestamp;
        t.textContent = date;
        tip.appendChild(t);
      } else if (!unlocked) {
        tip.appendChild(document.createTextNode('Not yet'));
      }
      host.appendChild(li);
    });
  }

  /* ---- the space roadmap ------------------------------------------------- */

  const ICONS = {
    flag: '<path class="ri-pole" d="M20 54V10"/><path class="ri-a" d="M21 11c10-5 18 5 30 0v20c-12 5-20-5-30 0z"/>',
    rocket: '<path class="ri-a" d="M32 6c10 8 14 20 12 34H20C18 26 22 14 32 6z"/><circle class="ri-b" cx="32" cy="24" r="6"/><path class="ri-b" d="M20 34 12 46h10zM44 34l8 12H42z"/><path class="ri-fire" d="M25 41h14l-7 15z"/>',
    crate: '<path class="ri-chute" d="M10 28C10 14 20 6 32 6s22 8 22 22c-7-4-15-4-22 0-7-4-15-4-22 0z"/><path class="ri-line" d="M12 28l12 14M52 28 40 42"/><rect class="ri-wood" x="21" y="38" width="22" height="20" rx="2"/><path class="ri-line" d="M21 48h22"/>',
    megaphone: '<path class="ri-a" d="M12 26h10l22-12v34L22 36H12z"/><path class="ri-b" d="M16 36l4 14h7l-4-14z"/><path class="ri-line" d="M50 22c4 4 4 14 0 18"/>',
    planet: '<circle class="ri-a" cx="32" cy="32" r="16"/><path class="ri-ring" d="M8 38c4 8 44-6 48-14 2-5-8-6-16-4"/><circle class="ri-b" cx="27" cy="27" r="4"/>',
    trophy: '<path class="ri-a" d="M20 10h24v14a12 12 0 0 1-24 0z"/><path class="ri-line" d="M20 14h-7c0 9 4 13 9 14M44 14h7c0 9-4 13-9 14"/><path class="ri-b" d="M28 36h8v10h-8z"/><rect class="ri-a" x="20" y="46" width="24" height="8" rx="2"/>',
  };

  /* Spots around the orbit (percent of the stage), clockwise from top left. */
  const SPOTS = [[13, 24], [9, 64], [34, 86], [68, 86], [91, 64], [86, 22]];

  function roadmap(host, opts = {}) {
    if (!host) return;
    const list = host.querySelector('.roadmap__list');
    if (!list) return;
    list.textContent = '';
    const next = MILESTONES.findIndex((m) => m.state !== 'unlocked');
    MILESTONES.forEach((m, i) => {
      const unlocked = m.state === 'unlocked';
      const status = unlocked ? 'Done' : i === next ? 'Next' : 'Soon';
      const date = formatDate(m.timestamp);
      const li = document.createElement('li');
      li.className = `stop stop--${status.toLowerCase()}`;
      const [x, y] = SPOTS[i % SPOTS.length];
      li.style.setProperty('--x', `${x}%`);
      li.style.setProperty('--y', `${y}%`);
      li.innerHTML =
        `<span class="stop__icon" aria-hidden="true"><svg viewBox="0 0 64 64">${ICONS[m.icon] || ICONS.planet}</svg></span>` +
        '<span class="stop__text"><span class="stop__n"></span><b class="stop__label"></b><span class="stop__when"></span></span>';
      li.querySelector('.stop__n').textContent = `Phase ${i + 1} · ${status}`;
      li.querySelector('.stop__label').textContent = m.label;
      li.querySelector('.stop__when').textContent = unlocked ? date || 'Done' : 'Date TBA';
      list.appendChild(li);
    });

    // a little rocket on the inner orbit, only while the roadmap is on screen
    const gsap = root.gsap;
    const ship = host.querySelector('.roadmap__ship');
    if (!gsap || !ship || opts.reduced) return;
    const orbit = { a: 0.3 };
    const tween = gsap.to(orbit, {
      a: Math.PI * 2 + 0.3,
      duration: 22,
      ease: 'none',
      repeat: -1,
      paused: true,
      onUpdate: () => {
        const x = 50 + Math.cos(orbit.a) * 27;
        const y = 50 + Math.sin(orbit.a) * 17;
        gsap.set(ship, { left: `${x}%`, top: `${y}%`, rotation: (orbit.a * 180) / Math.PI + 90, zIndex: Math.sin(orbit.a) > 0 ? 3 : 1 });
      },
    });
    if ('IntersectionObserver' in root) {
      new IntersectionObserver(([e]) => (e.isIntersecting ? tween.play() : tween.pause())).observe(host);
    } else tween.play();
  }

  LR.milestones = {
    MILESTONES,
    /**
     * Render the row and celebrate anything unlocked since the last visit.
     * @param {HTMLElement} host  the <ol>
     * @param {{onUnlock?: (m) => void, reduced?: boolean}} [opts]
     */
    init(host, opts = {}) {
      roadmap(document.getElementById('roadmap-stage'), opts);
      if (!host) return;
      render(MILESTONES, host);
      const seen = readSeen();
      const fresh = MILESTONES.filter((m) => m.state === 'unlocked' && !seen.includes(m.id));
      if (!fresh.length) return;
      writeSeen(seen.concat(fresh.map((m) => m.id)));
      const gsap = root.gsap;
      fresh.forEach((m, i) => {
        const el = host.querySelector(`[data-id="${m.id}"] .ms__star`);
        const delay = 1.2 + i * 0.9;
        if (gsap && el && !opts.reduced) {
          gsap.fromTo(el, { scale: 0.2, rotation: -160 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', delay });
        }
        if (opts.onUnlock) setTimeout(() => opts.onUnlock(m), delay * 1000);
      });
    },
  };
})(window);
