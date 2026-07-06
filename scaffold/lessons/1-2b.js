/* ============================================================
   1-2b LESSON INTERACTIVES
   Signature interactive: "Cancel or reinforce?" — a five-molecule
   two-step classifier (judge the bond, judge the shape) that only
   reveals a verdict after both steps are committed.
   ============================================================ */
(function () {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

  const svg = document.getElementById('molSvg');
  const tabsEl = document.getElementById('molTabs');
  if (!svg || !tabsEl || !window.GC_ELEMENTS) return;

  const EL = window.GC_ELEMENTS;
  const en = sym => EL.bySym[sym].en;
  const round2 = n => Math.round(n * 100) / 100;
  const classify = diff => (diff < 0.5 ? 'nonpolar' : 'polar');

  const stepLabelEl = document.getElementById('stepLabel');
  const stepPromptEl = document.getElementById('stepPrompt');
  const stepGivenEl = document.getElementById('stepGiven');
  const stepOptionsEl = document.getElementById('stepOptions');
  const stepFeedbackEl = document.getElementById('stepFeedback');
  const contBtn = document.getElementById('molContinue');
  const resetBtn = document.getElementById('molReset');
  const deltaReadout = document.getElementById('molDelta');
  const bondCallReadout = document.getElementById('molBondCall');
  const verdictBox = document.getElementById('verdictBox');
  const verdictTitle = document.getElementById('verdictTitle');
  const verdictText = document.getElementById('verdictText');

  const MOLECULES = [
    {
      id: 'O2', label: 'O&#8322;', kind: 'diatomic', atoms: ['O', 'O'],
      shapeGiven: 'O&#8322; has one bond. Whatever dipole that bond has IS the molecule’s dipole — there’s nothing else to cancel or reinforce against.',
      verdict: 'nonpolar', imf: 'LDF only',
      payoff: 'Same element on both ends, so &Delta;EN is exactly zero. There’s no tug-of-war to have in the first place.',
      feedback: {
        nonpolar: { correct: true, text: 'Right — identical atoms pull identically. &Delta;EN = 0.00, the smallest possible value.' },
        polar: { correct: false, text: 'Tempting — oxygen is genuinely electronegative. But &Delta;EN measures a <em>difference</em>, and oxygen paired with oxygen is a tie: &Delta;EN = 0.00.' }
      }
    },
    {
      id: 'HCl', label: 'HCl', kind: 'diatomic', atoms: ['H', 'Cl'],
      shapeGiven: 'HCl has one bond. Whatever dipole that bond has IS the molecule’s dipole — there’s nothing else to cancel or reinforce against.',
      verdict: 'polar', imf: 'dipole-dipole (not hydrogen bonding — chlorine isn’t nitrogen, oxygen, or fluorine)',
      payoff: 'One bond, one dipole, nothing to cancel it. HCl is polar, but the H isn’t bonded to N, O, or F, so it stops at dipole-dipole.',
      feedback: {
        polar: { correct: true, text: 'Right — chlorine pulls harder. &Delta;EN = 0.96, solidly past the 0.5 line.' },
        nonpolar: { correct: false, text: 'Chlorine and hydrogen aren’t close in pulling power — &Delta;EN = 0.96, well past the 0.5 cutoff for a real bond dipole.' }
      }
    },
    {
      id: 'CO2', label: 'CO&#8322;', kind: 'polyatomic', atoms: ['C', 'O'],
      shapeQuestion: 'Linear: O=C=O, with both oxygens directly across from carbon. Do the two C=O pulls cancel or reinforce?',
      shapeAnswer: 'cancel',
      shapeFeedback: {
        cancel: { correct: true, text: 'Right — linear shape, opposite pulls, exact cancellation. Polar bonds, nonpolar molecule.' },
        reinforce: { correct: false, text: 'This is the trap: “the bonds are polar, so the molecule must be polar.” But CO&#8322; is a straight line — the two oxygens sit on exactly opposite sides of carbon, so their pulls point in exactly opposite directions.' }
      },
      verdict: 'nonpolar', imf: 'LDF only',
      payoff: 'Polar bonds, canceled by a straight shape. CO&#8322; gets London dispersion forces only — part of why it’s already a gas at &minus;78&deg;C.',
      feedback: {
        polar: { correct: true, text: 'Right — oxygen pulls harder here. &Delta;EN = 0.89. Each C=O bond has a real dipole; the question is what the molecule’s shape does with it.' },
        nonpolar: { correct: false, text: 'Carbon and oxygen aren’t close in electronegativity — &Delta;EN = 0.89, past the 0.5 line. Each C=O bond really is polar.' }
      }
    },
    {
      id: 'H2O', label: 'H&#8322;O', kind: 'polyatomic', atoms: ['O', 'H'],
      shapeQuestion: 'Bent, about 104&deg; between the two O–H bonds — not a straight line. Do the two O–H pulls cancel or reinforce?',
      shapeAnswer: 'reinforce',
      shapeFeedback: {
        reinforce: { correct: true, text: 'Right — bent, not linear. Both pulls point generally toward oxygen, so instead of canceling they gang up into a net pull.' },
        cancel: { correct: false, text: 'Tempting, since water also has two identical bonds like CO&#8322; — but water isn’t a straight line. Both O–H pulls point generally toward the same atom, and a bent shape doesn’t give them a way to cancel.' }
      },
      verdict: 'polar', imf: 'dipole-dipole + hydrogen bonding',
      payoff: 'Polar bonds that don’t cancel, plus H bonded directly to O — water gets the whole set. That’s a big part of why it’s a liquid up to 100&deg;C.',
      feedback: {
        polar: { correct: true, text: 'Right — oxygen wins decisively. &Delta;EN = 1.24, the most polar bond among these five.' },
        nonpolar: { correct: false, text: 'Oxygen and hydrogen are not evenly matched — &Delta;EN = 1.24, solidly polar. Every O–H bond pulls hard toward oxygen.' }
      }
    },
    {
      id: 'CH4', label: 'CH&#8324;', kind: 'polyatomic', atoms: ['C', 'H'],
      shapeQuestion: 'Four H arranged symmetrically around carbon. Do the four C–H pulls cancel or reinforce?',
      shapeAnswer: 'cancel',
      shapeFeedback: {
        cancel: { correct: true, text: 'Right — perfect symmetry is the cancellation machine. Every pull has an equal, opposite partner somewhere in the arrangement.' },
        reinforce: { correct: false, text: 'Four bonds arranged with perfect symmetry around one center is exactly the setup where pulls cancel — every pull has an equal, opposite partner. (And these particular pulls barely exist to begin with.)' }
      },
      verdict: 'nonpolar', imf: 'LDF only',
      payoff: 'Barely-there bond pulls, and a symmetric shape cancels even those. LDF only — methane boils at &minus;162&deg;C, the coldest of this set.',
      feedback: {
        nonpolar: { correct: true, text: 'Right — &Delta;EN = 0.35, under the 0.5 line. There’s barely a tug-of-war here to begin with.' },
        polar: { correct: false, text: 'Carbon and hydrogen are close in electronegativity — &Delta;EN = 0.35, under the 0.5 line most chemists use for a real bond dipole.' }
      }
    }
  ];

  let current = null;
  let state = {};

  function resetState() {
    state = { bondDone: false, bondChoice: null, shapeDone: false, shapeChoice: null };
  }

  function renderTabs() {
    tabsEl.innerHTML = '';
    MOLECULES.forEach(m => {
      const b = document.createElement('button');
      b.className = 'tab' + (current && current.id === m.id ? ' active' : '');
      b.type = 'button';
      b.innerHTML = m.label;
      b.addEventListener('click', () => selectMolecule(m.id));
      tabsEl.appendChild(b);
    });
  }

  function selectMolecule(id) {
    current = MOLECULES.find(m => m.id === id);
    resetState();
    renderTabs();
    renderStep();
  }

  function optionButton(label) {
    const b = document.createElement('button');
    b.className = 'w-opt';
    b.type = 'button';
    b.innerHTML = label;
    return b;
  }

  function onBondChoice(choice, btn) {
    if (state.bondDone) return;
    const fb = current.feedback[choice];
    const diff = round2(Math.abs(en(current.atoms[0]) - en(current.atoms[1])));
    const correctCall = classify(diff);

    $$('.w-opt', stepOptionsEl).forEach(b => b.setAttribute('disabled', 'true'));
    btn.classList.add(fb.correct ? 'correct' : 'wrong');
    if (!fb.correct) {
      const okBtn = $$('.w-opt', stepOptionsEl).find(b => b.textContent.trim().toLowerCase() === correctCall);
      if (okBtn) okBtn.classList.add('correct');
    }
    stepFeedbackEl.innerHTML = fb.text;
    stepFeedbackEl.className = 'w-feedback ' + (fb.correct ? 'correct' : 'wrong');

    state.bondDone = true;
    state.bondChoice = choice;
    deltaReadout.innerHTML = '&Delta;EN = ' + diff.toFixed(2);
    bondCallReadout.textContent = correctCall;
    drawMolecule('bond');

    contBtn.style.display = '';
    contBtn.textContent = 'Continue →';
    contBtn.onclick = () => renderStep();
  }

  function onShapeChoice(choice, btn) {
    if (state.shapeDone) return;
    const fb = current.shapeFeedback[choice];

    $$('.w-opt', stepOptionsEl).forEach(b => b.setAttribute('disabled', 'true'));
    btn.classList.add(fb.correct ? 'correct' : 'wrong');
    if (!fb.correct) {
      const okBtn = $$('.w-opt', stepOptionsEl).find(b => b.textContent.trim().toLowerCase() === current.shapeAnswer);
      if (okBtn) okBtn.classList.add('correct');
    }
    stepFeedbackEl.innerHTML = fb.text;
    stepFeedbackEl.className = 'w-feedback ' + (fb.correct ? 'correct' : 'wrong');

    state.shapeDone = true;
    state.shapeChoice = choice;

    contBtn.style.display = '';
    contBtn.textContent = 'See the verdict';
    contBtn.onclick = () => renderStep();
  }

  function renderStep() {
    stepFeedbackEl.textContent = '';
    stepFeedbackEl.className = 'w-feedback';
    contBtn.style.display = 'none';
    verdictBox.style.display = 'none';
    stepOptionsEl.innerHTML = '';
    stepGivenEl.style.display = 'none';

    if (!current) {
      stepLabelEl.textContent = 'Pick a molecule above to begin';
      stepPromptEl.textContent = '';
      deltaReadout.textContent = '—';
      bondCallReadout.textContent = '—';
      drawMolecule(null);
      return;
    }

    const diff = round2(Math.abs(en(current.atoms[0]) - en(current.atoms[1])));
    const correctCall = classify(diff);

    if (!state.bondDone) {
      stepLabelEl.textContent = 'Step 1 · Judge the bond';
      stepPromptEl.innerHTML = current.atoms[0] + '–' + current.atoms[1] + ': is this bond polar or nonpolar?';
      deltaReadout.textContent = '—';
      bondCallReadout.textContent = '—';
      ['nonpolar', 'polar'].forEach(choice => {
        const btn = optionButton(choice.charAt(0).toUpperCase() + choice.slice(1));
        btn.addEventListener('click', () => onBondChoice(choice, btn));
        stepOptionsEl.appendChild(btn);
      });
      drawMolecule(null);
      return;
    }

    deltaReadout.innerHTML = '&Delta;EN = ' + diff.toFixed(2);
    bondCallReadout.textContent = correctCall;

    if (!state.shapeDone) {
      if (current.kind === 'diatomic') {
        stepLabelEl.textContent = 'Step 2 · Shape (given)';
        stepPromptEl.textContent = '';
        stepGivenEl.style.display = 'block';
        stepGivenEl.innerHTML = current.shapeGiven;
        contBtn.style.display = '';
        contBtn.textContent = 'See the verdict';
        contBtn.onclick = () => { state.shapeDone = true; renderStep(); };
      } else {
        stepLabelEl.textContent = 'Step 2 · Cancel or reinforce?';
        stepPromptEl.innerHTML = current.shapeQuestion;
        ['cancel', 'reinforce'].forEach(choice => {
          const btn = optionButton(choice.charAt(0).toUpperCase() + choice.slice(1));
          btn.addEventListener('click', () => onShapeChoice(choice, btn));
          stepOptionsEl.appendChild(btn);
        });
      }
      drawMolecule('bond');
      return;
    }

    showVerdict();
  }

  function showVerdict() {
    stepLabelEl.textContent = 'Verdict';
    stepPromptEl.textContent = '';
    verdictBox.style.display = 'block';
    verdictTitle.textContent = (current.verdict === 'polar' ? 'Polar molecule' : 'Nonpolar molecule') + ' · ' + current.imf;
    verdictText.innerHTML = current.payoff;
    drawMolecule('verdict');
  }

  resetBtn.addEventListener('click', () => {
    if (!current) return;
    resetState();
    renderStep();
  });

  /* ---- SVG drawing ---- */
  function clearSvg() { while (svg.firstChild) svg.removeChild(svg.firstChild); }

  function svgEl(tag, attrs, text) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    svg.appendChild(e);
    return e;
  }

  function atom(cx, cy, r, label, heavy) {
    svgEl('circle', { cx, cy, r, fill: heavy ? 'var(--paper-3)' : 'var(--paper)', stroke: 'var(--ink)', 'stroke-width': 1.3 });
    svgEl('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', 'font-family': 'var(--mono)', 'font-weight': 700, 'font-size': r > 14 ? 12 : 10, fill: 'var(--ink)' }, label);
  }

  function bond(x1, y1, x2, y2, double) {
    if (double) {
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
      const ox = -dy / len * 3, oy = dx / len * 3;
      svgEl('line', { x1: x1 + ox, y1: y1 + oy, x2: x2 + ox, y2: y2 + oy, stroke: 'var(--ink)', 'stroke-width': 2 });
      svgEl('line', { x1: x1 - ox, y1: y1 - oy, x2: x2 - ox, y2: y2 - oy, stroke: 'var(--ink)', 'stroke-width': 2 });
    } else {
      svgEl('line', { x1, y1, x2, y2, stroke: 'var(--ink)', 'stroke-width': 2 });
    }
  }

  function delta(x, y, sign) {
    svgEl('text', { x, y, 'text-anchor': 'middle', 'font-family': 'var(--mono)', 'font-weight': 700, 'font-size': 12, fill: sign === '+' ? 'var(--cool)' : 'var(--accent)' }, 'δ' + sign);
  }

  let arrowSeq = 0;
  function arrow(x1, y1, x2, y2, opts) {
    opts = opts || {};
    arrowSeq++;
    const id = 'mol-arr-' + arrowSeq;
    let defs = svg.querySelector('defs');
    if (!defs) defs = svgEl('defs', {});
    const marker = document.createElementNS(SVGNS, 'marker');
    marker.setAttribute('id', id);
    marker.setAttribute('markerWidth', 6);
    marker.setAttribute('markerHeight', 6);
    marker.setAttribute('refX', 5);
    marker.setAttribute('refY', 3);
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('viewBox', '0 0 6 6');
    const path = document.createElementNS(SVGNS, 'path');
    path.setAttribute('d', 'M0 0 L6 3 L0 6 z');
    path.setAttribute('fill', opts.color || 'var(--accent)');
    marker.appendChild(path);
    defs.appendChild(marker);
    svgEl('line', {
      x1, y1, x2, y2,
      stroke: opts.color || 'var(--accent)',
      'stroke-width': opts.width || 1.8,
      'stroke-dasharray': opts.solid ? '' : '4 3',
      'marker-end': 'url(#' + id + ')'
    });
  }

  function caption(x, y, text, bold) {
    svgEl('text', { x, y, 'text-anchor': 'middle', 'font-family': 'var(--mono)', 'font-size': 10, 'font-weight': bold ? 700 : 400, fill: 'var(--ink-mute)' }, text);
  }

  function drawO2(level) {
    clearSvg();
    const y = 110, xL = 110, xR = 210;
    atom(xL, y, 18, 'O', true);
    atom(xR, y, 18, 'O', true);
    bond(xL + 18, y, xR - 18, y, true);
    if (level === 'bond') caption(160, 160, 'identical atoms — no charge separation');
    if (level === 'verdict') caption(160, 160, 'nonpolar molecule · LDF only', true);
  }

  function drawHCl(level) {
    clearSvg();
    const y = 110, xL = 95, xR = 220;
    atom(xL, y, 13, 'H', false);
    atom(xR, y, 18, 'Cl', true);
    bond(xL + 13, y, xR - 18, y, false);
    if (level === 'bond' || level === 'verdict') {
      delta(xL, y - 26, '+');
      delta(xR, y - 26, '−');
    }
    if (level === 'verdict') {
      arrow(xL + 18, y - 12, xR - 24, y - 12, {});
      caption(160, 160, 'polar molecule · dipole-dipole only', true);
    }
  }

  function drawCO2(level) {
    clearSvg();
    const y = 110, xL = 85, xC = 160, xR = 235;
    atom(xL, y, 17, 'O', true);
    atom(xC, y, 16, 'C', true);
    atom(xR, y, 17, 'O', true);
    bond(xL + 17, y, xC - 16, y, true);
    bond(xC + 16, y, xR - 17, y, true);
    if (level === 'bond' || level === 'verdict') {
      delta(xC, y - 28, '+');
      delta(xL, y - 28, '−');
      delta(xR, y - 28, '−');
    }
    if (level === 'verdict') {
      arrow(xC - 12, y - 15, xL + 22, y - 15, {});
      arrow(xC + 12, y - 15, xR - 22, y - 15, {});
      caption(160, 160, 'pulls cancel exactly · net dipole = 0');
      caption(160, 176, 'nonpolar molecule · LDF only', true);
    }
  }

  function drawH2O(level) {
    clearSvg();
    const ox = 160, oy = 55, h1x = 105, h1y = 135, h2x = 215, h2y = 135;
    atom(ox, oy, 17, 'O', true);
    atom(h1x, h1y, 13, 'H', false);
    atom(h2x, h2y, 13, 'H', false);
    bond(h1x, h1y, ox, oy, false);
    bond(h2x, h2y, ox, oy, false);
    if (level === 'bond' || level === 'verdict') {
      delta(ox, oy - 24, '−');
      delta(h1x - 12, h1y + 18, '+');
      delta(h2x + 12, h2y + 18, '+');
    }
    if (level === 'verdict') {
      arrow(h1x + 12, h1y - 14, ox - 18, oy + 20, {});
      arrow(h2x - 12, h2y - 14, ox + 18, oy + 20, {});
      arrow(ox, h1y, ox, oy + 24, { width: 2.6, solid: true });
      caption(160, 168, 'pulls reinforce · net dipole toward O');
      caption(160, 184, 'polar molecule · dipole-dipole + H-bonding', true);
    }
  }

  function drawCH4(level) {
    clearSvg();
    const cx = 160, cy = 105;
    atom(cx, cy, 16, 'C', true);
    const hs = [[cx, cy - 55], [cx, cy + 55], [cx - 55, cy], [cx + 55, cy]];
    hs.forEach(([hx, hy]) => { bond(cx, cy, hx, hy, false); });
    hs.forEach(([hx, hy]) => { atom(hx, hy, 12, 'H', false); });
    if (level === 'verdict') {
      hs.forEach(([hx, hy]) => {
        const dx = (hx - cx), dy = (hy - cy);
        arrow(cx + dx * 0.32, cy + dy * 0.32, cx + dx * 0.78, cy + dy * 0.78, { width: 1.3 });
      });
      caption(cx, 188, 'symmetric pulls cancel');
      caption(cx, 204, 'nonpolar molecule · LDF only', true);
    }
  }

  function drawMolecule(level) {
    if (!current) { clearSvg(); return; }
    const fn = { O2: drawO2, HCl: drawHCl, CO2: drawCO2, H2O: drawH2O, CH4: drawCH4 }[current.id];
    if (fn) fn(level);
  }

  renderTabs();
  renderStep();
})();
