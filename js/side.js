/* ==========================================================================
   LEFT RIGHT — your side
   Picking a side changes the page, the same way for both sides (mirrored):

     [data-picked]          the text once you've picked. {US} Left/Right,
                            {THEM} the other one, {US_NAME} Lefty/Righty,
                            {THEM_NAME} the other fighter.
     [data-you] [data-rival]  on an art slot (js/art.js): JSON {pose, state}
                            for when that slot's fighter is yours / theirs.
     [data-team-card]       the two team cards: .is-yours / .is-rival, and
                            the Join button reads data-label-yours / -rival.

   Plus the page title. The colours follow [data-team] on <html> (CSS).
   Before a pick everything shows its neutral version, and both sides are
   always treated the same.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  const NAMES = {
    left: { team: 'Left', name: 'Lefty' },
    right: { team: 'Right', name: 'Righty' },
  };
  const other = (t) => (t === 'left' ? 'right' : 'left');
  const valid = (t) => t === 'left' || t === 'right';

  let side = null;
  let ready = false;
  let baseTitle = '';
  const listeners = [];

  function fill(tpl, team) {
    const us = NAMES[team];
    const them = NAMES[other(team)];
    return tpl
      .replace(/\{US_NAME\}/g, us.name)
      .replace(/\{THEM_NAME\}/g, them.name)
      .replace(/\{US\}/g, us.team)
      .replace(/\{THEM\}/g, them.team);
  }

  function apply() {
    const team = side;
    document.querySelectorAll('[data-picked]').forEach((el) => {
      const text = team ? fill(el.dataset.picked, team) : el.dataset.neutral;
      if (el.dataset.now === text) return;
      el.dataset.now = text;
      // split headlines keep their letters (js/scroll.js)
      if (el.dataset.split && LR.scroll) LR.scroll.setText(el, text);
      else el.textContent = text;
    });
    document.querySelectorAll('[data-team-card]').forEach((card) => {
      const t = card.dataset.teamCard;
      card.classList.toggle('is-yours', team === t);
      card.classList.toggle('is-rival', !!team && team !== t);
      const btn = card.querySelector('[data-pick]');
      if (btn) btn.textContent = !team ? btn.dataset.labelNeutral : team === t ? btn.dataset.labelYours : btn.dataset.labelRival;
    });
    if (LR.art) {
      document.querySelectorAll('[data-art][data-you], [data-art][data-rival]').forEach((slot) => {
        LR.art.role(slot, !team ? null : slot.dataset.art === team ? 'you' : 'rival');
      });
    }
    document.title = team ? `Team ${NAMES[team].team} · ${baseTitle}` : baseTitle;
    listeners.forEach((fn) => fn(team));
  }

  LR.side = {
    NAMES,
    other,
    fill,
    /** 'left' | 'right' | null */
    get: () => side,
    /** Call fn(team) whenever the side changes. */
    on(fn) {
      listeners.push(fn);
    },
    init() {
      baseTitle = document.title;
      document.querySelectorAll('[data-picked]').forEach((el) => {
        el.dataset.neutral = el.textContent.trim();
        el.dataset.now = el.dataset.neutral;
      });
      document.querySelectorAll('[data-team-card] [data-pick]').forEach((b) => (b.dataset.labelNeutral = b.textContent.trim()));
      ready = true;
      // a remembered pick themes the page straight away; the fight confirms it
      let saved = null;
      try {
        saved = JSON.parse(localStorage.getItem('lr:side') || 'null');
      } catch {
        saved = null;
      }
      if (valid(saved)) {
        document.documentElement.dataset.team = saved;
        this.set(saved);
      }
    },
    /** The fight calls this whenever you pick or switch. */
    set(team) {
      if (!valid(team) || team === side) return;
      side = team;
      if (ready) apply();
    },
  };
})(window);
