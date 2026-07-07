/* ============================================================
   1-2a LESSON INTERACTIVES
   Contains the signature Interactive Bond Explorer (#bondSvg)
   Exposes the 4 bonding types dynamically based on EN differences.
   ============================================================ */

(function () {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('bondSvg');
  if (!svg || !window.GC_ELEMENTS) return;

  const EL = window.GC_ELEMENTS;
  const CX = 160, CY = 100;
  
  // Filter elements to main-group with valid EN values
  const POOL = EL.list.filter(e => e.mainGroup && e.en !== null);

  const selectA = document.getElementById('selectA');
  const selectB = document.getElementById('selectB');
  const enLabA = document.getElementById('enA');
  const enLabB = document.getElementById('enB');
  
  const textType = document.getElementById('bondTypeText');
  const textTitle = document.getElementById('bondTitle');
  const textDesc = document.getElementById('bondDesc');
  const textDelta = document.getElementById('deltaEnVal');
  const textChar = document.getElementById('bondCharVal');

  // Populate dropdowns
  function populateSelect(sel, defaultSym) {
    sel.innerHTML = '<option value="">-- Select --</option>';
    POOL.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.sym;
      opt.textContent = `${e.name} (${e.sym})`;
      if (e.sym === defaultSym) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  populateSelect(selectA, 'Na'); // default A: Sodium
  populateSelect(selectB, 'Cl'); // default B: Chlorine

  // Animation variables
  let animationId = null;
  let t = 0;
  let metallicElectrons = [];
  const numMetallicElectrons = 14;

  // Initialize metallic electrons positions and velocities
  for (let i = 0; i < numMetallicElectrons; i++) {
    metallicElectrons.push({
      x: Math.random() * 320,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5
    });
  }

  function getBondType(eA, eB, diff) {
    const isMetalA = eA.kind === 'metal';
    const isMetalB = eB.kind === 'metal';

    if (isMetalA && isMetalB) {
      return {
        type: 'Metallic',
        class: 'metallic',
        title: `Metallic Bond: ${eA.sym} + ${eB.sym}`,
        char: 'Delocalized sharing (low EN + low EN)',
        desc: `Both <b>${eA.name}</b> and <b>${eB.name}</b> are metals with a loose grip on their electrons. Since neither atom holds onto its valence electrons tightly, the electrons drift away from their parent nuclei. The valence electrons form a delocalized <strong class="term">sea of electrons</strong> that flows freely around a grid of positive metal cores, holding the metal together like electrostatic glue.`
      };
    }

    if (isMetalA || isMetalB) {
      const metal = isMetalA ? eA : eB;
      const nonmetal = isMetalA ? eB : eA;
      if (diff >= 1.7) {
        return {
          type: 'Ionic',
          class: 'ionic',
          title: `Ionic Bond: ${metal.sym} + ${nonmetal.sym}`,
          char: 'Electron transfer (&Delta;EN &ge; 1.7)',
          desc: `The nonmetal <b>${nonmetal.name}</b> has a much higher electronegativity (EN = ${nonmetal.en}) than the metal <b>${metal.name}</b> (EN = ${metal.en}). With a mismatch of &Delta;EN = ${diff.toFixed(2)}, the nonmetal pulls the electron completely away from the metal. This transfer forms a positive metal cation and a negative nonmetal anion, held together by a strong, attractive <strong class="term">electrostatic force</strong>.`
        };
      } else {
        return {
          type: 'Polar/Ionic Transition',
          class: 'ionic-trans',
          title: `Polar-Ionic Transition: ${metal.sym} + ${nonmetal.sym}`,
          char: 'Borderline ionic (&Delta;EN = ' + diff.toFixed(2) + ')',
          desc: `This bond is between a metal and a nonmetal, but their pulling difference (&Delta;EN = ${diff.toFixed(2)}) is slightly below 1.7. This is a transition state: the valence electron is mostly transferred to the nonmetal, but it still has some polar covalent character (sharing is extremely lopsided).`
        };
      }
    }

    // Both are nonmetals / metalloids
    if (diff < 0.5) {
      return {
        type: 'Nonpolar Covalent',
        class: 'nonpolar',
        title: `Nonpolar Covalent Bond: ${eA.sym} + ${eB.sym}`,
        char: 'Equal sharing (&Delta;EN &lt; 0.5)',
        desc: `Both nonmetals pull on the valence electrons with nearly equal strength (&Delta;EN = ${diff.toFixed(2)}). The electrons spend equal time shared in the middle. The resulting <strong class="term">nonpolar covalent bond</strong> has no charge separation or poles.`
      };
    } else {
      return {
        type: 'Polar Covalent',
        class: 'polar',
        title: `Polar Covalent Bond: ${eA.sym} + ${eB.sym}`,
        char: 'Unequal sharing (0.5 &le; &Delta;EN &lt; 1.7)',
        desc: `The higher-EN atom pulls the shared electrons closer. This unequal sharing in the <strong class="term">polar covalent bond</strong> creates a partial negative charge (<b>&delta;&minus;</b>) on the stronger atom and a partial positive charge (<b>&delta;+</b>) on the weaker one.`
      };
    }
  }

  function update() {
    const symA = selectA.value;
    const symB = selectB.value;

    if (!symA || !symB) {
      textType.textContent = 'Select two elements below...';
      textTitle.textContent = 'No bond selected';
      textDesc.innerHTML = 'Choose one element in each dropdown to build a bond. The tug-of-war will calculate in real time.';
      textDelta.textContent = '—';
      textChar.textContent = '—';
      enLabA.textContent = 'EN: —';
      enLabB.textContent = 'EN: —';
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      return;
    }

    const eA = EL.bySym[symA];
    const eB = EL.bySym[symB];
    const diff = Math.abs(eA.en - eB.en);

    enLabA.textContent = `EN: ${eA.en.toFixed(2)}`;
    enLabB.textContent = `EN: ${eB.en.toFixed(2)}`;
    
    textDelta.textContent = diff.toFixed(2);

    const b = getBondType(eA, eB, diff);
    textType.textContent = `${b.type} Bonding`;
    textTitle.textContent = b.title;
    textDesc.innerHTML = b.desc;
    textChar.textContent = b.char;

    // Restart animation
    if (animationId) cancelAnimationFrame(animationId);
    t = 0;
    
    function animate() {
      t += 0.045;
      drawSVG(eA, eB, b.class, diff);
      animationId = requestAnimationFrame(animate);
    }
    animate();
  }

  function drawSVG(eA, eB, bondClass, diff) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    
    const w = 320, h = 200;
    
    if (bondClass === 'metallic') {
      // 3x3 metallic lattice grid
      const cols = [70, 160, 250];
      const rows = [50, 100, 150];
      
      // Draw positive metal cores
      rows.forEach(y => {
        cols.forEach(x => {
          const core = document.createElementNS(SVGNS, 'circle');
          core.setAttribute('class', 'd-nuc');
          core.setAttribute('cx', x);
          core.setAttribute('cy', y);
          core.setAttribute('r', 'var(--dia-r-atom)');
          core.setAttribute('fill', 'var(--paper-3)');
          core.setAttribute('stroke', 'var(--hair)');
          svg.appendChild(core);

          const text = document.createElementNS(SVGNS, 'text');
          text.setAttribute('class', 'd-nuc-t');
          text.setAttribute('x', x);
          text.setAttribute('y', y + 3);
          text.setAttribute('text-anchor', 'middle');
          text.style.fontSize = 'var(--dia-caption-size)';
          text.textContent = '+';
          svg.appendChild(text);
        });
      });

      // Animate and draw delocalized electrons sea
      metallicElectrons.forEach(e => {
        e.x += e.vx;
        e.y += e.vy;
        
        // Wrap boundaries
        if (e.x < 10) { e.x = w - 10; }
        if (e.x > w - 10) { e.x = 10; }
        if (e.y < 10) { e.y = h - 10; }
        if (e.y > h - 10) { e.y = 10; }

        const dot = document.createElementNS(SVGNS, 'circle');
        dot.setAttribute('cx', e.x.toFixed(1));
        dot.setAttribute('cy', e.y.toFixed(1));
        dot.setAttribute('r', 'var(--dia-r-particle)');
        dot.setAttribute('fill', 'var(--accent)');
        svg.appendChild(dot);
      });

      return;
    }
    
    // For Covalent & Ionic: two main nuclei
    const xA = 90, xB = 230, y = 100;
    const isAHigher = eA.en >= eB.en;
    
    // Draw Nucleus A
    const nucA = document.createElementNS(SVGNS, 'circle');
    nucA.setAttribute('class', 'd-nuc');
    nucA.setAttribute('cx', xA);
    nucA.setAttribute('cy', y);
    nucA.setAttribute('r', 'var(--dia-r-atom)');
    nucA.setAttribute('fill', eA.kind === 'metal' ? 'var(--paper-3)' : 'var(--nucleus)');
    svg.appendChild(nucA);

    const txtA = document.createElementNS(SVGNS, 'text');
    txtA.setAttribute('class', 'd-nuc-t');
    txtA.setAttribute('x', xA);
    txtA.setAttribute('y', y + 3);
    txtA.setAttribute('text-anchor', 'middle');
    txtA.style.fontSize = 'var(--dia-label-size)';
    txtA.textContent = eA.sym;
    svg.appendChild(txtA);

    // Draw Nucleus B
    const nucB = document.createElementNS(SVGNS, 'circle');
    nucB.setAttribute('class', 'd-nuc');
    nucB.setAttribute('cx', xB);
    nucB.setAttribute('cy', y);
    nucB.setAttribute('r', 'var(--dia-r-atom)');
    nucB.setAttribute('fill', eB.kind === 'metal' ? 'var(--paper-3)' : 'var(--nucleus)');
    svg.appendChild(nucB);

    const txtB = document.createElementNS(SVGNS, 'text');
    txtB.setAttribute('class', 'd-nuc-t');
    txtB.setAttribute('x', xB);
    txtB.setAttribute('y', y + 3);
    txtB.setAttribute('text-anchor', 'middle');
    txtB.style.fontSize = 'var(--dia-label-size)';
    txtB.textContent = eB.sym;
    svg.appendChild(txtB);

    if (bondClass === 'nonpolar') {
      // Symmetrical shell rings
      const shellA = document.createElementNS(SVGNS, 'circle');
      shellA.setAttribute('class', 'd-shell');
      shellA.setAttribute('cx', xA); shellA.setAttribute('cy', y); shellA.setAttribute('r', 40);
      svg.appendChild(shellA);

      const shellB = document.createElementNS(SVGNS, 'circle');
      shellB.setAttribute('class', 'd-shell');
      shellB.setAttribute('cx', xB); shellB.setAttribute('cy', y); shellB.setAttribute('r', 40);
      svg.appendChild(shellB);

      // Figure-8 shared electrons
      const ex1 = CX + 70 * Math.sin(t);
      const ey1 = CY + 30 * Math.sin(2 * t);
      const ex2 = CX + 70 * Math.sin(t + Math.PI);
      const ey2 = CY + 30 * Math.sin(2 * (t + Math.PI));

      [ [ex1, ey1], [ex2, ey2] ].forEach(p => {
        const dot = document.createElementNS(SVGNS, 'circle');
        dot.setAttribute('cx', p[0].toFixed(1));
        dot.setAttribute('cy', p[1].toFixed(1));
        dot.setAttribute('r', 'var(--dia-r-particle)');
        dot.setAttribute('fill', 'var(--accent)');
        svg.appendChild(dot);
      });
      
    } else if (bondClass === 'polar') {
      // Asymmetrical shells skewed towards the higher EN atom
      const rA = isAHigher ? 45 : 30;
      const rB = isAHigher ? 30 : 45;
      
      const shellA = document.createElementNS(SVGNS, 'circle');
      shellA.setAttribute('class', 'd-shell');
      shellA.setAttribute('cx', xA); shellA.setAttribute('cy', y); shellA.setAttribute('r', rA);
      svg.appendChild(shellA);

      const shellB = document.createElementNS(SVGNS, 'circle');
      shellB.setAttribute('class', 'd-shell');
      shellB.setAttribute('cx', xB); shellB.setAttribute('cy', y); shellB.setAttribute('r', rB);
      svg.appendChild(shellB);

      // Skewed figure-8 electrons (pulled towards higher EN)
      const skew = isAHigher ? -20 : 20;
      const ex1 = CX + skew + 65 * Math.sin(t);
      const ey1 = CY + 26 * Math.sin(2 * t);
      const ex2 = CX + skew + 65 * Math.sin(t + Math.PI);
      const ey2 = CY + 26 * Math.sin(2 * (t + Math.PI));

      [ [ex1, ey1], [ex2, ey2] ].forEach(p => {
        const dot = document.createElementNS(SVGNS, 'circle');
        dot.setAttribute('cx', p[0].toFixed(1));
        dot.setAttribute('cy', p[1].toFixed(1));
        dot.setAttribute('r', 'var(--dia-r-particle)');
        dot.setAttribute('fill', 'var(--accent)');
        svg.appendChild(dot);
      });

      // Partial charge labels
      const dLabelA = document.createElementNS(SVGNS, 'text');
      dLabelA.setAttribute('x', xA - 32);
      dLabelA.setAttribute('y', y - 28);
      dLabelA.setAttribute('font-family', 'var(--mono)');
      dLabelA.style.fontSize = 'var(--dia-label-size)';
      dLabelA.setAttribute('fill', isAHigher ? 'var(--accent)' : 'var(--cool)');
      dLabelA.textContent = isAHigher ? 'δ−' : 'δ+';
      svg.appendChild(dLabelA);

      const dLabelB = document.createElementNS(SVGNS, 'text');
      dLabelB.setAttribute('x', xB + 20);
      dLabelB.setAttribute('y', y - 28);
      dLabelB.setAttribute('font-family', 'var(--mono)');
      dLabelB.style.fontSize = 'var(--dia-label-size)';
      dLabelB.setAttribute('fill', isAHigher ? 'var(--cool)' : 'var(--accent)');
      dLabelB.textContent = isAHigher ? 'δ+' : 'δ−';
      svg.appendChild(dLabelB);
      
    } else if (bondClass === 'ionic' || bondClass === 'ionic-trans') {
      // Ionic shell: metal has shed its outer ring (small radius), nonmetal has full ring
      const shellA = document.createElementNS(SVGNS, 'circle');
      shellA.setAttribute('class', 'd-shell');
      shellA.setAttribute('cx', xA); shellA.setAttribute('cy', y); shellA.setAttribute('r', eA.kind === 'metal' ? 22 : 40);
      svg.appendChild(shellA);

      const shellB = document.createElementNS(SVGNS, 'circle');
      shellB.setAttribute('class', 'd-shell');
      shellB.setAttribute('cx', xB); shellB.setAttribute('cy', y); shellB.setAttribute('r', eB.kind === 'metal' ? 22 : 40);
      svg.appendChild(shellB);

      // Repetitive transfer animation
      // transferVal goes from 0 to 100
      const transferVal = Math.floor(t * 15) % 100;
      
      let ex, ey;
      const metalIsA = eA.kind === 'metal';
      const sourceX = metalIsA ? xA : xB;
      const targetX = metalIsA ? xB : xA;

      if (transferVal < 35) {
        // Traveling from metal to nonmetal
        const ratio = transferVal / 35;
        ex = sourceX + (targetX - sourceX) * ratio;
        ey = y - 10 * Math.sin(ratio * Math.PI); // arching path
      } else {
        // Orbiting nonmetal
        const theta = (transferVal - 35) * 0.11;
        ex = targetX + 28 * Math.cos(theta);
        ey = y + 28 * Math.sin(theta);
      }

      const dot = document.createElementNS(SVGNS, 'circle');
      dot.setAttribute('cx', ex.toFixed(1));
      dot.setAttribute('cy', ey.toFixed(1));
      dot.setAttribute('r', 'var(--dia-r-particle)');
      dot.setAttribute('fill', 'var(--accent)');
      svg.appendChild(dot);

      // Full charge labels (+ and -)
      const chargeA = document.createElementNS(SVGNS, 'text');
      chargeA.setAttribute('x', xA - 30);
      chargeA.setAttribute('y', y - 25);
      chargeA.setAttribute('font-family', 'var(--display)');
      chargeA.setAttribute('font-weight', '700');
      chargeA.style.fontSize = '13px';
      chargeA.setAttribute('fill', eA.kind === 'metal' ? 'var(--cool)' : 'var(--accent)');
      chargeA.textContent = eA.kind === 'metal' ? '+' : '−';
      svg.appendChild(chargeA);

      const chargeB = document.createElementNS(SVGNS, 'text');
      chargeB.setAttribute('x', xB + 20);
      chargeB.setAttribute('y', y - 25);
      chargeB.setAttribute('font-family', 'var(--display)');
      chargeB.setAttribute('font-weight', '700');
      chargeB.style.fontSize = '13px';
      chargeB.setAttribute('fill', eB.kind === 'metal' ? 'var(--cool)' : 'var(--accent)');
      chargeB.textContent = eB.kind === 'metal' ? '+' : '−';
      svg.appendChild(chargeB);
    }
  }

  selectA.addEventListener('change', update);
  selectB.addEventListener('change', update);

  update();
})();
