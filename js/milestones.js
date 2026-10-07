/* ==========================================================================
   LEFT RIGHT — roadmap
   --------------------------------------------------------------------------
   Edit PHASES and MILESTONES by hand. Each milestone:
     id     unique string (remembers which ones a visitor has already seen)
     phase  1, 2 or 3
     label  a short story beat. Never a price, never a return.
     done   true once it has happened
   Tick one (done: true) and redeploy: every returning visitor gets a toast,
   both fighters throw a swing, and its box pops when the roadmap scrolls
   into view. Once per visitor.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  const PHASES = ['Pick a side', 'Raise your voice', 'Never log off'];

  const MILESTONES = [
    { id: 'launch', phase: 1, label: 'Launch the argument', done: true },
    { id: 'line', phase: 1, label: 'Draw the line down the middle', done: true },
    { id: 'holders-1k', phase: 1, label: '1,000 holders', done: false },
    { id: 'trending', phase: 1, label: 'Both sides trending on X', done: false },
    { id: 'listings', phase: 2, label: 'CoinGecko and CoinMarketCap listings', done: false },
    { id: 'meme-war', phase: 2, label: 'The first meme war', done: false },
    { id: 'holders-10k', phase: 2, label: '10,000 holders', done: false },
    { id: 'merch', phase: 2, label: 'Merch nobody asked for', done: false },
    { id: 'holders-100k', phase: 3, label: '100,000 holders', done: false },
    { id: 'global', phase: 3, label: 'The argument goes global', done: false },
    { id: 'winner', phase: 3, label: "Someone finally wins (they won't)", done: false },
  ];

  const SEEN_KEY = 'lr:milestones-seen';
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';

  /** The ids seen before, or null on a first visit. */
  function readSeen() {
    try {
      const raw = localStorage.getItem(SEEN_KEY);
      if (raw === null) return null;
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v : [];
    } catch {
      return null;
    }
  }

  function writeSeen(ids) {
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
    } catch {
      /* private mode etc.: the pop just replays next visit */
    }
  }

  function render(host) {
    host.textContent = '';
    const next = MILESTONES.find((m) => !m.done);
    PHASES.forEach((name, i) => {
      const n = i + 1;
      const items = MILESTONES.filter((m) => m.phase === n);
      const li = document.createElement('li');
      li.className = 'phase';
      if (next && next.phase === n) li.classList.add('is-now');
      li.innerHTML = '<span class="phase__n"></span><h3 class="phase__name"></h3><ul class="phase__list"></ul>';
      li.querySelector('.phase__n').textContent = `Phase ${n}`;
      li.querySelector('.phase__name').textContent = name;
      const list = li.querySelector('.phase__list');
      items.forEach((m) => {
        const item = document.createElement('li');
        item.className = `phase__item${m.done ? ' is-done' : ''}`;
        item.dataset.id = m.id;
        item.innerHTML = `<span class="phase__box" aria-hidden="true">${m.done ? CHECK : ''}</span><span><span class="visually-hidden"></span></span>`;
        const text = item.lastChild;
        text.firstChild.textContent = m.done ? 'Done: ' : 'To do: ';
        text.appendChild(document.createTextNode(m.label));
        if (m === next) {
          const tag = document.createElement('span');
          tag.className = 'phase__next';
          tag.textContent = 'Next';
          text.appendChild(tag);
        }
        list.appendChild(item);
      });
      host.appendChild(li);
    });
  }

  /* Pop the fresh ticks once the roadmap is on screen (they're visible the
     whole time; the pop is a bonus). */
  function popWhenSeen(host, ids, reduced) {
    const gsap = root.gsap;
    if (!gsap || reduced || !ids.length) return;
    const marks = ids.map((id) => host.querySelector(`[data-id="${id}"] .phase__box`)).filter(Boolean);
    if (!marks.length) return;
    const pop = () =>
      gsap.to(marks, {
        keyframes: [
          { scale: 1.6, rotation: -16, duration: 0.16, ease: 'power2.out' },
          { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' },
        ],
        stagger: 0.16,
        delay: 0.2,
      });
    if (!('IntersectionObserver' in root)) return pop();
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        pop();
      },
      { threshold: 0.35 },
    );
    io.observe(host);
  }

  LR.milestones = {
    PHASES,
    MILESTONES,
    /**
     * Draw the roadmap, and celebrate anything ticked since the last visit.
     * @param {{onUnlock?: (m) => void, reduced?: boolean}} [opts]
     */
    init(opts = {}) {
      const host = document.getElementById('phases');
      if (!host) return;
      render(host);
      const seen = readSeen();
      const done = MILESTONES.filter((m) => m.done).map((m) => m.id);
      writeSeen(done);
      if (seen === null) {
        // first visit: no news, just the boxes popping in
        popWhenSeen(host, done, opts.reduced);
        return;
      }
      const fresh = MILESTONES.filter((m) => m.done && !seen.includes(m.id));
      if (!fresh.length) return;
      popWhenSeen(host, fresh.map((m) => m.id), opts.reduced);
      fresh.forEach((m, i) =>
        setTimeout(() => {
          if (LR.toast) LR.toast(`Roadmap: ${m.label}. Done.`);
          if (opts.onUnlock) opts.onUnlock(m);
        }, 1200 + i * 1800),
      );
    },
  };
})(window);
