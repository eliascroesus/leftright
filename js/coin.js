/* ==========================================================================
   LEFT RIGHT — tokenomics
   Edit TOKENOMICS by hand. Everything here is shown exactly as written, so
   only put in what is true and final. Until the allocation is final, leave
   it empty: the bar says "To be announced" instead of making numbers up.
   ========================================================================== */
(function (root) {
  'use strict';

  const LR = (root.LR = root.LR || {});

  const TOKENOMICS = {
    supply: '{{TOTAL_SUPPLY}}',   // e.g. '1,000,000,000'
    chain: '{{CHAIN}}',           // e.g. 'Solana'
    tax: '{{TAX}}',               // e.g. '0% buy / 0% sell'
    // Where the supply goes, in percent (should add up to 100). Up to five
    // rows are drawn; anything past that folds into "Other".
    allocation: [
      // { label: 'Liquidity pool', pct: 90 },
      // { label: 'Community airdrop', pct: 5 },
      // { label: 'Team (locked)', pct: 5 },
    ],
  };

  /* Categorical order, checked for colour-blind separation on the paper
     background (blue, red, amber, green, purple). Never cycled. */
  const COLOURS = ['#1e59cd', '#e03931', '#d8920f', '#23946a', '#8a4fd8'];

  /* The joke chart. Clearly labelled as one. */
  const ARGUENOMICS = [
    { label: 'Left', pct: 50, colour: 'var(--red)' },
    { label: 'Right', pct: 50, colour: 'var(--blue)' },
    { label: 'Listening', pct: 0, colour: 'var(--locked)' },
  ];

  const fmt = (n) => `${Math.round(n * 10) / 10}%`;

  function fold(rows) {
    const clean = rows.filter((r) => r && r.label && Number(r.pct) > 0).map((r) => ({ label: String(r.label), pct: Number(r.pct) }));
    if (clean.length <= 5) return clean;
    const head = clean.slice(0, 4);
    const rest = clean.slice(4).reduce((a, r) => a + r.pct, 0);
    return head.concat([{ label: 'Other', pct: rest }]);
  }

  let tip = null;
  function showTip(seg, text) {
    if (!tip) {
      tip = document.createElement('span');
      tip.className = 'chart-tip';
      tip.setAttribute('role', 'tooltip');
      document.body.appendChild(tip);
    }
    tip.textContent = text;
    const r = seg.getBoundingClientRect();
    tip.style.left = `${r.left + r.width / 2}px`;
    tip.style.top = `${r.top + window.scrollY - 8}px`;
    tip.classList.add('is-on');
  }
  const hideTip = () => tip && tip.classList.remove('is-on');

  /* A horizontal stacked bar (part-to-whole) + a legend that doubles as the table. */
  function bar(host, rows, opts = {}) {
    host.textContent = '';
    const track = document.createElement('div');
    track.className = 'alloc__bar';
    const legend = document.createElement('ul');
    legend.className = 'alloc__legend';
    if (!rows.length) {
      track.classList.add('is-tba');
      track.innerHTML = '<span class="alloc__tba">Allocation to be announced</span>';
      host.append(track);
      return;
    }
    const total = rows.reduce((a, r) => a + r.pct, 0) || 1;
    rows.forEach((r, i) => {
      const colour = r.colour || COLOURS[i];
      const share = (r.pct / total) * 100;
      if (r.pct > 0) {
        const seg = document.createElement('span');
        seg.className = 'alloc__seg';
        seg.style.flexGrow = String(share);
        seg.style.background = colour;
        seg.tabIndex = 0;
        seg.setAttribute('aria-label', `${r.label}: ${fmt(r.pct)}`);
        if (share >= 12) seg.innerHTML = `<span class="alloc__in">${fmt(r.pct)}</span>`;
        const text = `${r.label} · ${fmt(r.pct)}`;
        seg.addEventListener('pointerenter', () => showTip(seg, text));
        seg.addEventListener('focus', () => showTip(seg, text));
        seg.addEventListener('pointerleave', hideTip);
        seg.addEventListener('blur', hideTip);
        track.appendChild(seg);
      }
      const li = document.createElement('li');
      li.innerHTML = `<span class="alloc__key" style="background:${colour}"></span><span class="alloc__label"></span><b class="alloc__pct">${fmt(r.pct)}</b>`;
      li.querySelector('.alloc__label').textContent = r.label;
      legend.appendChild(li);
    });
    host.append(track, legend);
    if (opts.note) {
      const p = document.createElement('p');
      p.className = 'alloc__note';
      p.textContent = opts.note;
      host.appendChild(p);
    }
  }

  LR.coin = {
    TOKENOMICS,
    init() {
      const set = (id, v) => {
        const n = document.getElementById(id);
        if (n) n.textContent = v;
      };
      set('tok-supply', TOKENOMICS.supply);
      set('tok-chain', TOKENOMICS.chain);
      set('tok-tax', TOKENOMICS.tax);
      const alloc = document.getElementById('tok-alloc');
      if (alloc) bar(alloc, fold(TOKENOMICS.allocation));
      const joke = document.getElementById('tok-joke');
      if (joke) bar(joke, ARGUENOMICS, { note: 'Audited by nobody. Peer-reviewed by the group chat.' });
      root.addEventListener('scroll', hideTip, { passive: true });
    },
  };
})(window);
