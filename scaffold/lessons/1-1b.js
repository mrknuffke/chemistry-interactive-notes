/* ============================================================
   1-1b LESSON INTERACTIVES
   Two signature interactives unique to this lesson:
     1. Animated Bohr builder  (#atomSvg)
     2. Periodic-trend explorer (#ptable)
   Shared behaviors (theme, toc, predict-reveal, recall, etc.)
   come from ../assets/core.js — do NOT duplicate them here.
   ============================================================ */

/* ---------- ANIMATED BOHR BUILDER ---------- */
(function () {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('atomSvg');
  if (!svg) return;
  const CX = 160, CY = 160;
  const PERIOD = [
    { name: 'Lithium', sym: 'Li', z: 3, shells: [2, 1] }, { name: 'Beryllium', sym: 'Be', z: 4, shells: [2, 2] },
    { name: 'Boron', sym: 'B', z: 5, shells: [2, 3] }, { name: 'Carbon', sym: 'C', z: 6, shells: [2, 4] },
    { name: 'Nitrogen', sym: 'N', z: 7, shells: [2, 5] }, { name: 'Oxygen', sym: 'O', z: 8, shells: [2, 6] },
    { name: 'Fluorine', sym: 'F', z: 9, shells: [2, 7] }, { name: 'Neon', sym: 'Ne', z: 10, shells: [2, 8] }
  ];
  const GROUP = [
    { name: 'Lithium', sym: 'Li', z: 3, shells: [2, 1] }, { name: 'Sodium', sym: 'Na', z: 11, shells: [2, 8, 1] },
    { name: 'Potassium', sym: 'K', z: 19, shells: [2, 8, 8, 1] }
  ];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mode = 'period', idx = 0;
  let rings = [], electrons = [], nucEl = null, nucLabel = null;
  let curR = [], tgtR = [], curNuc = 18, tgtNuc = 18, rot = 0, last = 0;

  const targetRing = (i) => mode === 'period'
    ? [34, 90][i] - (i === 1 ? idx * 2.2 : idx * 0.88)
    : 28 + i * 30;

  function build() {
    const data = (mode === 'period' ? PERIOD : GROUP)[idx];
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    rings = []; electrons = [];
    const total = data.shells.length;
    tgtR = data.shells.map((_, i) => targetRing(i));
    if (curR.length !== total) curR = tgtR.slice();
    tgtNuc = mode === 'period' ? 16 + idx * 0.8 : 16;
    data.shells.forEach((cnt, i) => {
      const ring = document.createElementNS(SVGNS, 'circle');
      ring.setAttribute('class', 'atom-shell');
      ring.setAttribute('cx', CX); ring.setAttribute('cy', CY); ring.setAttribute('r', curR[i] || tgtR[i]);
      svg.appendChild(ring); rings.push(ring);
      for (let e = 0; e < cnt; e++) {
        const dot = document.createElementNS(SVGNS, 'circle');
        dot.setAttribute('class', 'atom-e'); dot.setAttribute('r', 'var(--dia-r-particle)');
        svg.appendChild(dot);
        electrons.push({ el: dot, shell: i, base: (2 * Math.PI / cnt) * e - Math.PI / 2 });
      }
    });
    nucEl = document.createElementNS(SVGNS, 'circle');
    nucEl.setAttribute('class', 'atom-nucleus'); nucEl.setAttribute('cx', CX); nucEl.setAttribute('cy', CY); nucEl.setAttribute('r', curNuc);
    svg.appendChild(nucEl);
    nucLabel = document.createElementNS(SVGNS, 'text');
    nucLabel.setAttribute('class', 'atom-nuc-label'); nucLabel.setAttribute('x', CX); nucLabel.setAttribute('y', CY + 1);
    nucLabel.setAttribute('text-anchor', 'middle'); nucLabel.setAttribute('dominant-baseline', 'middle'); nucLabel.setAttribute('font-size', '12');
    nucLabel.textContent = data.z + 'p';
    svg.appendChild(nucLabel);

    document.getElementById('atomName').textContent = data.name;
    document.getElementById('atomZ').textContent = data.z;
    document.getElementById('atomShells').textContent = total;
    document.getElementById('atomMode').textContent = mode === 'period' ? 'across period 2' : 'down group 1';
    document.getElementById('atomRoTitle').textContent = data.name + ' \u00b7 ' + data.z + ' protons';
    document.getElementById('atomRoText').textContent = mode === 'period'
      ? 'Still just two shells \u2014 every new electron crowds into the same outer shell. But the nucleus keeps gaining protons (' + data.z + ' now), pulling that shell in tighter. More pull, same distance: the atom shrinks left to right.'
      : data.name + ' has ' + total + ' shell' + (total > 1 ? 's' : '') + '. Each step down adds a whole new shell, so the outer electron sits farther out and shielded by the inner shells. The nucleus can\u2019t hold it as tightly \u2014 the atom grows and that electron gets easier to lose.';
    document.getElementById('atomPrev').disabled = (idx === 0);
    document.getElementById('atomNext').disabled = (idx === (mode === 'period' ? PERIOD : GROUP).length - 1);
  }
  function frame(t) {
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 0; last = t;
    if (!reduce) rot += dt * 0.55;
    for (let i = 0; i < curR.length; i++) { curR[i] += ((tgtR[i] || curR[i]) - curR[i]) * 0.16; if (rings[i]) rings[i].setAttribute('r', curR[i].toFixed(2)); }
    curNuc += (tgtNuc - curNuc) * 0.16; if (nucEl) nucEl.setAttribute('r', curNuc.toFixed(2));
    electrons.forEach(e => {
      const r = curR[e.shell] || 0, a = e.base + rot * (1 / (e.shell + 1));
      e.el.setAttribute('cx', (CX + r * Math.cos(a)).toFixed(2));
      e.el.setAttribute('cy', (CY + r * Math.sin(a)).toFixed(2));
    });
    requestAnimationFrame(frame);
  }
  document.getElementById('atomPrev').addEventListener('click', () => { if (idx > 0) { idx--; build(); } });
  document.getElementById('atomNext').addEventListener('click', () => { const m = (mode === 'period' ? PERIOD : GROUP); if (idx < m.length - 1) { idx++; build(); } });
  document.getElementById('atomTabs').addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b) return;
    document.querySelectorAll('#atomTabs .tab').forEach(t => t.classList.remove('active')); b.classList.add('active');
    mode = b.dataset.mode; idx = 0; curR = []; build();
  });
  build(); requestAnimationFrame(frame);
})();

/* ---------- PERIODIC-TREND EXPLORER ---------- */
(function () {
  const tableEl = document.getElementById('ptable');
  if (!tableEl) return;
  // [sym, Z, group, period, radius_pm, IE_kJ/mol, EN_Pauling, kind]
  const E = [
    ['H', 1, 1, 1, 53, 1312, 2.20, 'nonmetal'], ['He', 2, 18, 1, 31, 2372, null, 'noble'],
    ['Li', 3, 1, 2, 167, 520, 0.98, 'metal'], ['Be', 4, 2, 2, 112, 899, 1.57, 'metal'],
    ['B', 5, 13, 2, 87, 801, 2.04, 'metalloid'], ['C', 6, 14, 2, 67, 1086, 2.55, 'nonmetal'],
    ['N', 7, 15, 2, 56, 1402, 3.04, 'nonmetal'], ['O', 8, 16, 2, 48, 1314, 3.44, 'nonmetal'],
    ['F', 9, 17, 2, 42, 1681, 3.98, 'nonmetal'], ['Ne', 10, 18, 2, 38, 2081, null, 'noble'],
    ['Na', 11, 1, 3, 190, 496, 0.93, 'metal'], ['Mg', 12, 2, 3, 145, 738, 1.31, 'metal'],
    ['Al', 13, 13, 3, 118, 578, 1.61, 'metal'], ['Si', 14, 14, 3, 111, 786, 1.90, 'metalloid'],
    ['P', 15, 15, 3, 98, 1012, 2.19, 'nonmetal'], ['S', 16, 16, 3, 88, 1000, 2.58, 'nonmetal'],
    ['Cl', 17, 17, 3, 79, 1251, 3.16, 'nonmetal'], ['Ar', 18, 18, 3, 71, 1521, null, 'noble'],
    ['K', 19, 1, 4, 243, 419, 0.82, 'metal'], ['Ca', 20, 2, 4, 194, 590, 1.00, 'metal'],
    ['Ga', 31, 13, 4, 136, 579, 1.81, 'metal'], ['Ge', 32, 14, 4, 125, 762, 2.01, 'metalloid'],
    ['As', 33, 15, 4, 114, 947, 2.18, 'metalloid'], ['Se', 34, 16, 4, 103, 941, 2.55, 'nonmetal'],
    ['Br', 35, 17, 4, 94, 1140, 2.96, 'nonmetal'], ['Kr', 36, 18, 4, 88, 1351, 3.00, 'noble']
  ];
  const REACT = { Li: .55, Na: .78, K: .96, Be: .18, Mg: .40, Ca: .62, Al: .30, Ga: .28, F: 1, Cl: .82, Br: .68, O: .86, S: .58, Se: .48, N: .55, P: .42, As: .30, C: .25, Si: .20, Ge: .18, B: .15, H: .45, He: .02, Ne: .02, Ar: .03, Kr: .05 };
  const FIELD = { radius: 4, ie: 5, en: 6 };
  const META = {
    radius: { name: 'Atomic radius', unit: 'pm', across: 'decreases', down: 'increases', text: 'Atoms shrink left\u2192right (more protons pulling the same shell inward) and grow top\u2192bottom (each row adds a shell).' },
    ie: { name: 'Ionization energy', unit: 'kJ/mol', across: 'increases', down: 'decreases', text: 'The energy to remove an outer electron. Tightly held electrons (small atoms, top-right) are hardest to pull off. The small zig-zags are real \u2014 they come from sub-shell stability.' },
    en: { name: 'Electronegativity', unit: 'Pauling', across: 'increases', down: 'decreases', text: 'How strongly an atom pulls on shared electrons. It peaks at fluorine, top-right. Noble gases are left blank because they barely bond.' },
    react: { name: 'Reactivity', unit: 'relative', across: '\u2014 splits \u2014', down: '\u2014 splits \u2014', text: 'Not one gradient. Metals (warm) get more reactive down-and-left as they lose electrons more easily; nonmetals (cool) get more reactive up-and-right as they grab electrons harder; noble gases are inert.' }
  };
  const TRACK = { 1: 1, 2: 2, 13: 4, 14: 5, 15: 6, 16: 7, 17: 8, 18: 9 };

  // color helpers
  const mix = (a, b, t) => [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)];
  const lum = c => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
  const COOL = [62, 111, 165], PALE = [236, 233, 219], HOT = [206, 72, 46];
  const seqColor = t => t < 0.5 ? mix(COOL, PALE, t * 2) : mix(PALE, HOT, (t - 0.5) * 2);
  const METAL = [206, 72, 46], NONMETAL = [46, 125, 87];
  const catColor = (base, r) => mix(mix(base, [245, 245, 240], 0.78), base, r);
  const rgb = c => 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
  const paintCell = (cell, c) => { cell.style.background = rgb(c); cell.style.color = lum(c) > 0.55 ? '#15201C' : '#F4F6F4'; };

  const legendEl = document.getElementById('legend');
  const roName = document.getElementById('roName'), roText = document.getElementById('roText');
  const roAcross = document.getElementById('roAcross'), roDown = document.getElementById('roDown');
  const cmpHint = document.getElementById('cmpHint'), cmpOut = document.getElementById('cmpOut');
  let current = 'radius', selected = [];
  const cellMap = {}, elBySym = {}; E.forEach(e => elBySym[e[0]] = e);

  const grid = {}; E.forEach(e => { grid[e[3] + '-' + TRACK[e[2]]] = e; });
  for (let p = 1; p <= 4; p++) for (let track = 1; track <= 9; track++) {
    const e = grid[p + '-' + track];
    const cell = document.createElement('div');
    if (track === 3) { cell.className = 'pcell spacer'; tableEl.appendChild(cell); continue; }
    cell.className = 'pcell';
    if (e) {
      cell.classList.add('has-data'); cell.dataset.sym = e[0];
      cell.innerHTML = '<span class="z">' + e[1] + '</span><span class="sym">' + e[0] + '</span><span class="val"></span>';
      cell.addEventListener('click', () => selectEl(e[0])); cellMap[e[0]] = cell;
    } else cell.style.visibility = 'hidden';
    tableEl.appendChild(cell);
  }
  function paint() {
    const m = META[current];
    roName.textContent = m.name; roText.textContent = m.text; roAcross.textContent = m.across; roDown.textContent = m.down;
    if (current === 'react') {
      legendEl.innerHTML = '<span class="swatch"><span class="chip" style="background:' + rgb(catColor(METAL, .85)) + '"></span>metal \u2014 loses e\u207B</span>' +
        '<span class="swatch"><span class="chip" style="background:' + rgb(catColor(NONMETAL, .85)) + '"></span>nonmetal \u2014 gains e\u207B</span>' +
        '<span class="swatch"><span class="chip" style="background:var(--card)"></span>noble \u2014 inert</span>';
    } else {
      const vals = E.map(e => e[FIELD[current]]).filter(v => v != null); const mn = Math.min(...vals), mx = Math.max(...vals);
      legendEl.innerHTML = '<span>low</span><span class="bar" style="background:linear-gradient(90deg,' + rgb(COOL) + ',' + rgb(PALE) + ',' + rgb(HOT) + ')"></span><span>high</span><span style="margin-left:.5rem;">' + mn + '\u2013' + mx + ' ' + m.unit + '</span>';
    }
    E.forEach(e => {
      const cell = cellMap[e[0]], vs = cell.querySelector('.val'); cell.classList.remove('dim'); cell.style.color = '';
      if (current === 'react') {
        const r = REACT[e[0]];
        if (e[7] === 'noble') { cell.style.background = 'var(--card)'; cell.classList.add('dim'); vs.textContent = 'inert'; }
        else if (e[7] === 'metal') { paintCell(cell, catColor(METAL, r)); vs.textContent = ''; }
        else { paintCell(cell, catColor(NONMETAL, r)); vs.textContent = ''; }
      } else {
        const v = e[FIELD[current]];
        if (v == null) { cell.style.background = 'var(--card)'; cell.classList.add('dim'); vs.textContent = 'n/a'; }
        else { const vals = E.map(x => x[FIELD[current]]).filter(x => x != null); const mn = Math.min(...vals), mx = Math.max(...vals); paintCell(cell, seqColor((v - mn) / (mx - mn))); vs.textContent = (current === 'en') ? v.toFixed(2) : v; }
      }
    });
    refreshSel();
  }
  function selectEl(s) { const i = selected.indexOf(s); if (i >= 0) selected.splice(i, 1); else { selected.push(s); if (selected.length > 2) selected.shift(); } refreshSel(); compare(); }
  function refreshSel() { Object.values(cellMap).forEach(c => c.classList.remove('selected')); selected.forEach(s => cellMap[s] && cellMap[s].classList.add('selected')); }
  function compare() {
    if (selected.length < 2) { cmpOut.textContent = selected.length === 1 ? 'Pick one more\u2026' : ''; return; }
    const a = elBySym[selected[0]], b = elBySym[selected[1]]; cmpHint.style.display = 'none';
    if (current === 'react') {
      const ra = REACT[a[0]], rb = REACT[b[0]]; const hi = ra >= rb ? a : b, lo = ra >= rb ? b : a;
      const note = (hi[7] === lo[7]) ? '' : ' (and they react by different mechanisms \u2014 one loses electrons, the other gains)';
      cmpOut.innerHTML = '<b>' + hi[0] + '</b> is the more reactive of the two' + note + '.'; return;
    }
    const f = FIELD[current], va = a[f], vb = b[f];
    if (va == null || vb == null) { cmpOut.innerHTML = 'One of these is a noble gas with no ' + META[current].name.toLowerCase() + ' value.'; return; }
    const hi = va >= vb ? a : b, m = META[current], fmt = v => (current === 'en') ? v.toFixed(2) : v;
    cmpOut.innerHTML = '<b>' + hi[0] + '</b> has the higher ' + m.name.toLowerCase() + ' \u2014 ' + a[0] + ' ' + fmt(va) + ' ' + m.unit + ' vs ' + b[0] + ' ' + fmt(vb) + ' ' + m.unit + '.';
  }
  document.getElementById('trendTabs').addEventListener('click', e => {
    const b = e.target.closest('.tab'); if (!b) return;
    document.querySelectorAll('#trendTabs .tab').forEach(t => t.classList.remove('active')); b.classList.add('active');
    current = b.dataset.trend; paint(); compare();
  });
  paint();
})();
