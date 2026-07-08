/* ============================================================
   1-1a LESSON INTERACTIVES
   Two interactives unique to this lesson:
     1. Bohr + configuration builder  (#abSvg)  — signature
     2. Configuration self-test       (#stConfig)
   Periodic data comes from ../assets/elements.js (window.GC_ELEMENTS).
   Shared behaviors (theme, toc, predict-reveal, recall, peek, scheme)
   come from ../assets/core.js — do NOT duplicate them here.
   ============================================================ */

/* ---------- BOHR + CONFIGURATION BUILDER ---------- */
(function () {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('abSvg');
  if (!svg || !window.GC_ELEMENTS) return;
  const EL = window.GC_ELEMENTS;
  const CX = 170, CY = 170, NUC_R = 18;
  const R = [38, 74, 110, 146];            // shell radii by shell index
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let z = 9;                               // start on fluorine (the hook)
  let electrons = [], rot = 0, last = 0;

  const el = id => document.getElementById(id);

  function describe(e) {
    const t = EL.tendency(e);
    if (e.z === 1) return 'Hydrogen has a single electron in one shell. That first shell is full at 2 (not 8), so hydrogen can lose its electron to form H⁺, or — less often — gain one to fill the shell.';
    if (!e.mainGroup) {
      let s = e.name + ' is a transition metal. Notice the fourth shell already holds electrons while the third is still filling toward 18 — so its outer-shell count doesn’t give a simple valence the way main-group elements do.';
      if (e.anomaly) s += ' (' + e.name + ' even borrows one electron from the fourth shell into the third for a little extra stability.)';
      return s;
    }
    if (e.kind === 'noble') return e.name + '’s outer shell is full with ' + e.valence + ' electrons, so it has no reason to lose or gain. That’s exactly why it’s inert.';
    if (t.dir === 'lose') return e.name + ' has ' + e.valence + ' valence electron' + (e.valence > 1 ? 's' : '') + '. The short path to a full shell is to lose ' + e.valence + ', forming ' + e.sym + t.charge + '. With only a few to give up, it behaves as a metal.';
    if (t.dir === 'gain') return e.name + ' has ' + e.valence + ' valence electrons — ' + t.need + ' short of a full octet. It tends to gain ' + t.need + ', forming ' + e.sym + t.charge + ', which makes it a reactive nonmetal.';
    return e.name + ' has 4 valence electrons — equally far from emptying or filling its outer shell, so it tends to share electrons rather than fully lose or gain them.';
  }

  function build() {
    const e = EL.byZ[z];
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    electrons = [];
    const lastShell = e.shells.length - 1;

    // rings
    e.shells.forEach((_, i) => {
      const ring = document.createElementNS(SVGNS, 'circle');
      ring.setAttribute('class', 'atom-shell');
      ring.setAttribute('cx', CX); ring.setAttribute('cy', CY); ring.setAttribute('r', R[i]);
      ring.style.strokeWidth = 'var(--dia-stroke)';
      svg.appendChild(ring);
    });
    // electrons (created after rings so they sit on top)
    e.shells.forEach((cnt, i) => {
      const valence = e.mainGroup && i === lastShell;
      for (let k = 0; k < cnt; k++) {
        const dot = document.createElementNS(SVGNS, 'circle');
        dot.setAttribute('class', valence ? 'atom-e-val' : 'atom-e');
        dot.setAttribute('r', 'var(--dia-r-atom-sm)');
        svg.appendChild(dot);
        electrons.push({ el: dot, shell: i, base: (2 * Math.PI / cnt) * k - Math.PI / 2 });
      }
    });
    // nucleus + label
    const nuc = document.createElementNS(SVGNS, 'circle');
    nuc.setAttribute('class', 'atom-nucleus'); nuc.setAttribute('cx', CX); nuc.setAttribute('cy', CY); nuc.setAttribute('r', NUC_R);
    svg.appendChild(nuc);
    const lab = document.createElementNS(SVGNS, 'text');
    lab.setAttribute('class', 'atom-nuc-label'); lab.setAttribute('x', CX); lab.setAttribute('y', CY + 1);
    lab.setAttribute('text-anchor', 'middle'); lab.setAttribute('dominant-baseline', 'middle');
    lab.style.fontSize = 'var(--dia-label-size)';
    lab.textContent = e.z + 'p';
    svg.appendChild(lab);

    // config string (valence shell in accent for main-group)
    el('abConfig').innerHTML = e.shells.map((n, i) =>
      (e.mainGroup && i === lastShell) ? '<span class="vshell">' + n + '</span>' : '' + n
    ).join('<span class="sep">, </span>');

    // valence pill
    if (!e.mainGroup) el('abVal').innerHTML = 'Transition metal — valence isn’t a simple outer-shell count';
    else if (e.kind === 'noble') el('abVal').innerHTML = '<b>' + e.valence + '</b> valence electrons — a full shell';
    else el('abVal').innerHTML = '<b>' + e.valence + '</b> valence electron' + (e.valence > 1 ? 's' : '') + ' in the outer shell';

    // readouts
    el('abZlab').textContent = 'Z = ' + e.z;
    el('abName').textContent = e.name;
    el('abZ').textContent = e.z;
    el('abShells').textContent = e.shells.length;
    el('abRoTitle').textContent = e.name + ' · ' + e.z + ' proton' + (e.z > 1 ? 's' : '');
    el('abRoText').textContent = describe(e);

    el('abPrev').disabled = (z === 1);
    el('abNext').disabled = (z === 36);
    document.querySelectorAll('#abJump .chip').forEach(c => c.classList.toggle('active', +c.dataset.z === z));
  }

  function frame(t) {
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 0; last = t;
    if (!reduce) rot += dt * 0.5;
    electrons.forEach(e => {
      const r = R[e.shell], a = e.base + rot * (1 / (e.shell + 1));
      e.el.setAttribute('cx', (CX + r * Math.cos(a)).toFixed(2));
      e.el.setAttribute('cy', (CY + r * Math.sin(a)).toFixed(2));
    });
    requestAnimationFrame(frame);
  }

  el('abPrev').addEventListener('click', () => { if (z > 1) { z--; build(); } });
  el('abNext').addEventListener('click', () => { if (z < 36) { z++; build(); } });
  el('abJump').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    z = +b.dataset.z; build();
  });

  build();
  requestAnimationFrame(frame);
})();

/* ---------- CONFIGURATION SELF-TEST ---------- */
(function () {
  const promptName = document.getElementById('stName');
  if (!promptName || !window.GC_ELEMENTS) return;
  const EL = window.GC_ELEMENTS;
  const POOL = EL.list.filter(e => e.mainGroup);   // valence is well-defined here

  const elName = promptName;
  const elMeta = document.getElementById('stMeta');
  const inCfg = document.getElementById('stConfig');
  const inVal = document.getElementById('stValence');
  const fb = document.getElementById('stFeedback');
  let cur = EL.bySym['S'];                          // matches the static placeholder

  const nums = s => (String(s).match(/\d+/g) || []).map(Number);
  const eqArr = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

  function load(e) {
    cur = e;
    elName.textContent = e.name;
    elMeta.textContent = e.sym + ' · Z = ' + e.z;
    inCfg.value = ''; inVal.value = '';
    inCfg.className = ''; inVal.className = '';
    fb.textContent = ''; fb.className = 'feedback';
  }
  function next() {
    let e; do { e = POOL[Math.floor(Math.random() * POOL.length)]; } while (e.sym === cur.sym);
    load(e);
  }
  function check() {
    const cfgOk = eqArr(nums(inCfg.value), cur.shells);
    const valOk = nums(inVal.value).length === 1 && nums(inVal.value)[0] === cur.valence;
    inCfg.className = inCfg.value.trim() ? (cfgOk ? 'correct' : 'wrong') : '';
    inVal.className = inVal.value.trim() ? (valOk ? 'correct' : 'wrong') : '';
    if (cfgOk && valOk) { fb.textContent = 'Both right — nice. Try another.'; fb.className = 'feedback good'; }
    else if (cfgOk && !valOk) { fb.textContent = 'Configuration’s right; recount the outer shell for the valence.'; fb.className = 'feedback accent'; }
    else if (!cfgOk && valOk) { fb.textContent = 'Valence is right; recheck the shell counts.'; fb.className = 'feedback accent'; }
    else { fb.textContent = 'Not yet — fill inside-out (2, then 8…) and recount.'; fb.className = 'feedback accent'; }
  }
  function reveal() {
    inCfg.value = EL.config(cur); inVal.value = cur.valence;
    inCfg.className = 'shown'; inVal.className = 'shown';
    fb.textContent = 'Answer shown — try the next one from memory.'; fb.className = 'feedback accent';
  }

  document.getElementById('stCheck').addEventListener('click', check);
  document.getElementById('stReveal').addEventListener('click', reveal);
  document.getElementById('stNext').addEventListener('click', next);
  [inCfg, inVal].forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') check(); }));

  load(cur);
})();
