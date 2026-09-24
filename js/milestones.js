/* ==========================================================================
   LEFT RIGHT — milestones
   --------------------------------------------------------------------------
   Edit MILESTONES by hand. Each entry:
     id         unique string (used to remember which ones a visitor has seen)
     label      short story beat (never a price target)
     timestamp  ISO date string, shown on hover once unlocked (or null)
     state      'locked' | 'unlocked'
   Flip a milestone to 'unlocked' and redeploy: every visitor who hasn't seen
   it yet gets the pop animation and both fighters throw a swing, once.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  const MILESTONES = [
    { id: 'm1', label: '{{MILESTONE_1_LABEL}}', timestamp: '2026-09-01T12:00:00Z', state: 'unlocked' },
    { id: 'm2', label: '{{MILESTONE_2_LABEL}}', timestamp: '2026-09-18T12:00:00Z', state: 'unlocked' },
    { id: 'm3', label: '{{MILESTONE_3_LABEL}}', timestamp: null, state: 'locked' },
    { id: 'm4', label: '{{MILESTONE_4_LABEL}}', timestamp: null, state: 'locked' },
    { id: 'm5', label: '{{MILESTONE_5_LABEL}}', timestamp: null, state: 'locked' },
    { id: 'm6', label: '{{MILESTONE_6_LABEL}}', timestamp: null, state: 'locked' },
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

  LR.milestones = {
    MILESTONES,
    /**
     * Render the row and celebrate anything unlocked since the last visit.
     * @param {HTMLElement} host  the <ol>
     * @param {{onUnlock?: (m) => void, reduced?: boolean}} [opts]
     */
    init(host, opts = {}) {
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
