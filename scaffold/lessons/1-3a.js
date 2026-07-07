/* ============================================================
   1-3a LESSON INTERACTIVES
   Contains the signature Interactive Lewis Structure Lab (#lewisSvg).
   Supported molecules: H2, HF, H2O, NH3, CH4, O2, N2, CO2, CF4
   ============================================================ */

(function () {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('lewisSvg');
  if (!svg) return;

  // Append custom CSS rules for responsive hover effects and pointers
  const style = document.createElement('style');
  style.textContent = `
    .lewis-bond-group {
      cursor: pointer;
    }
    .lewis-bond-group:hover .lewis-bond-visual {
      stroke: var(--accent);
      opacity: 0.9;
    }
    .lewis-atom-group {
      cursor: pointer;
    }
    .lewis-atom-group:hover .lewis-atom-text {
      fill: var(--accent);
    }
  `;
  document.head.appendChild(style);

  // Molecule database (fixed geometry, target electron counts, and target bonds)
  const MOLECULES = {
    H2: {
      formula: 'H₂',
      name: 'Hydrogen',
      intro: 'Two hydrogen atoms share their only electrons. Each hydrogen needs only 2 electrons to fill its outer shell (the duet rule).',
      targetElec: 2,
      atoms: [
        { id: 'H1', sym: 'H', x: 110, y: 110 },
        { id: 'H2', sym: 'H', x: 210, y: 110 }
      ],
      bonds: [
        { atomA: 0, atomB: 1, targetOrder: 1 }
      ]
    },
    HF: {
      formula: 'HF',
      name: 'Hydrogen Fluoride',
      intro: 'Hydrogen bonds to fluorine. Hydrogen needs 2 electrons (duet), while fluorine needs 8 (octet) to become stable.',
      targetElec: 8,
      atoms: [
        { id: 'H1', sym: 'H', x: 110, y: 110 },
        { id: 'F1', sym: 'F', x: 210, y: 110 }
      ],
      bonds: [
        { atomA: 0, atomB: 1, targetOrder: 1 }
      ]
    },
    H2O: {
      formula: 'H₂O',
      name: 'Water',
      intro: 'Oxygen acts as the central atom, bonding to two hydrogen atoms. Oxygen needs 8 outer electrons to satisfy its octet, while hydrogen needs only 2 (duet).',
      targetElec: 8,
      atoms: [
        { id: 'O1', sym: 'O', x: 160, y: 110 },
        { id: 'H1', sym: 'H', x: 80, y: 110 },
        { id: 'H2', sym: 'H', x: 160, y: 180 }
      ],
      bonds: [
        { atomA: 0, atomB: 1, targetOrder: 1 },
        { atomA: 0, atomB: 2, targetOrder: 1 }
      ]
    },
    NH3: {
      formula: 'NH₃',
      name: 'Ammonia',
      intro: 'Nitrogen sits in the center, bonded to three outer hydrogen atoms. Nitrogen needs an octet, while each hydrogen needs a duet.',
      targetElec: 8,
      atoms: [
        { id: 'N1', sym: 'N', x: 160, y: 110 },
        { id: 'H1', sym: 'H', x: 80, y: 110 },
        { id: 'H2', sym: 'H', x: 160, y: 180 },
        { id: 'H3', sym: 'H', x: 240, y: 110 }
      ],
      bonds: [
        { atomA: 0, atomB: 1, targetOrder: 1 },
        { atomA: 0, atomB: 2, targetOrder: 1 },
        { atomA: 0, atomB: 3, targetOrder: 1 }
      ]
    },
    CH4: {
      formula: 'CH₄',
      name: 'Methane',
      intro: 'Carbon is the central atom, sharing single bonds with four outer hydrogen atoms to satisfy all duets and carbon\'s octet.',
      targetElec: 8,
      atoms: [
        { id: 'C1', sym: 'C', x: 160, y: 110 },
        { id: 'H1', sym: 'H', x: 80, y: 110 },
        { id: 'H2', sym: 'H', x: 160, y: 180 },
        { id: 'H3', sym: 'H', x: 240, y: 110 },
        { id: 'H4', sym: 'H', x: 160, y: 40 }
      ],
      bonds: [
        { atomA: 0, atomB: 1, targetOrder: 1 },
        { atomA: 0, atomB: 2, targetOrder: 1 },
        { atomA: 0, atomB: 3, targetOrder: 1 },
        { atomA: 0, atomB: 4, targetOrder: 1 }
      ]
    },
    O2: {
      formula: 'O₂',
      name: 'Oxygen',
      intro: 'Two highly electronegative oxygen atoms share electrons. To satisfy both octets with only 12 total valence electrons, they must form a double bond.',
      targetElec: 12,
      atoms: [
        { id: 'O1', sym: 'O', x: 110, y: 110 },
        { id: 'O2', sym: 'O', x: 210, y: 110 }
      ],
      bonds: [
        { atomA: 0, atomB: 1, targetOrder: 2 }
      ]
    },
    N2: {
      formula: 'N₂',
      name: 'Nitrogen',
      intro: 'Two nitrogen atoms share electrons. With only 10 total valence electrons, they must share three pairs to satisfy their octets, forming a triple bond.',
      targetElec: 10,
      atoms: [
        { id: 'N1', sym: 'N', x: 110, y: 110 },
        { id: 'N2', sym: 'N', x: 210, y: 110 }
      ],
      bonds: [
        { atomA: 0, atomB: 1, targetOrder: 3 }
      ]
    },
    CO2: {
      formula: 'CO₂',
      name: 'Carbon Dioxide',
      intro: 'Carbon sits in the center between two oxygens. The 16 valence electrons are shared via two double bonds, satisfying everyone\'s octet.',
      targetElec: 16,
      atoms: [
        { id: 'C1', sym: 'C', x: 160, y: 110 },
        { id: 'O1', sym: 'O', x: 80, y: 110 },
        { id: 'O2', sym: 'O', x: 240, y: 110 }
      ],
      bonds: [
        { atomA: 0, atomB: 1, targetOrder: 2 },
        { atomA: 0, atomB: 2, targetOrder: 2 }
      ]
    },
    CF4: {
      formula: 'CF₄',
      name: 'Carbon Tetrafluoride',
      intro: 'Carbon is bonded to four outer fluorine atoms. Each fluorine atom holds three lone pairs, while sharing a single bond with carbon.',
      targetElec: 32,
      atoms: [
        { id: 'C1', sym: 'C', x: 160, y: 110 },
        { id: 'F1', sym: 'F', x: 80, y: 110 },
        { id: 'F2', sym: 'F', x: 160, y: 180 },
        { id: 'F3', sym: 'F', x: 240, y: 110 },
        { id: 'F4', sym: 'F', x: 160, y: 40 }
      ],
      bonds: [
        { atomA: 0, atomB: 1, targetOrder: 1 },
        { atomA: 0, atomB: 2, targetOrder: 1 },
        { atomA: 0, atomB: 3, targetOrder: 1 },
        { atomA: 0, atomB: 4, targetOrder: 1 }
      ]
    }
  };

  // UI DOM elements
  const selectMol = document.getElementById('molSelect');
  const targetLabel = document.getElementById('targetElec');
  const drawnLabel = document.getElementById('drawnElec');
  const molFormula = document.getElementById('molFormula');
  const molName = document.getElementById('molName');
  const molIntro = document.getElementById('molIntro');
  const feedback = document.getElementById('lewisFeedback');
  const btnCheck = document.getElementById('btnCheck');
  const btnReset = document.getElementById('btnReset');

  // State variables
  let currentKey = 'H2O';
  let userLonePairs = []; // Index-aligned with active molecule atoms
  let userBonds = [];     // Index-aligned with active molecule bonds

  // Initial setup
  function initMolecule(key) {
    currentKey = key;
    const mol = MOLECULES[key];
    
    // Update texts
    molFormula.textContent = mol.formula;
    molName.textContent = mol.name;
    molIntro.textContent = mol.intro;
    targetLabel.textContent = mol.targetElec;
    
    // Initialize states
    userLonePairs = Array(mol.atoms.length).fill(0);
    userBonds = Array(mol.bonds.length).fill(0);
    
    // Reset feedback
    feedback.textContent = 'Click bonds and atoms to start building the structure.';
    feedback.className = 'feedback';
    
    updateDrawnCount();
    redraw();
  }

  // Calculate and update the drawn valence count
  function updateDrawnCount() {
    let bondElectrons = 0;
    userBonds.forEach(order => {
      bondElectrons += order * 2;
    });

    let loneElectrons = 0;
    userLonePairs.forEach(pairs => {
      loneElectrons += pairs * 2;
    });

    const totalDrawn = bondElectrons + loneElectrons;
    drawnLabel.textContent = totalDrawn;

    const mol = MOLECULES[currentKey];
    if (totalDrawn === mol.targetElec) {
      drawnLabel.style.color = 'var(--good)';
    } else {
      drawnLabel.style.color = 'var(--accent)';
    }
  }

  // Pre-calculate available compass directions for lone pairs on each atom
  function getFreeDirections(idx, mol) {
    const atom = mol.atoms[idx];
    const neighbors = [];
    
    mol.atoms.forEach((other, oIdx) => {
      if (oIdx === idx) return;
      const dx = other.x - atom.x;
      const dy = other.y - atom.y;
      
      if (Math.abs(dx) < 10 && dy < -20) neighbors.push('top');
      if (Math.abs(dx) < 10 && dy > 20) neighbors.push('bottom');
      if (Math.abs(dy) < 10 && dx < -20) neighbors.push('left');
      if (Math.abs(dy) < 10 && dx > 20) neighbors.push('right');
    });

    const allDirs = ['top', 'bottom', 'left', 'right'];
    const freeDirs = allDirs.filter(d => !neighbors.includes(d));

    // Priority sorting: put opposite direction to the single neighbor first
    if (neighbors.length === 1) {
      const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[neighbors[0]];
      freeDirs.sort((a, b) => {
        if (a === opposite) return -1;
        if (b === opposite) return 1;
        return 0;
      });
    }
    return freeDirs;
  }

  // Draw lone pairs around atom center
  function drawLonePairs(cx, cy, numPairs, freeDirs) {
    const dotSpacing = 4.5;
    const offset = 16;
    
    for (let i = 0; i < Math.min(numPairs, freeDirs.length); i++) {
      const dir = freeDirs[i];
      const dots = [];
      
      if (dir === 'top') {
        dots.push({ x: cx - dotSpacing, y: cy - offset });
        dots.push({ x: cx + dotSpacing, y: cy - offset });
      } else if (dir === 'bottom') {
        dots.push({ x: cx - dotSpacing, y: cy + offset });
        dots.push({ x: cx + dotSpacing, y: cy + offset });
      } else if (dir === 'left') {
        dots.push({ x: cx - offset, y: cy - dotSpacing });
        dots.push({ x: cx - offset, y: cy + dotSpacing });
      } else if (dir === 'right') {
        dots.push({ x: cx + offset, y: cy - dotSpacing });
        dots.push({ x: cx + offset, y: cy + dotSpacing });
      }

      dots.forEach(d => {
        const c = document.createElementNS(SVGNS, 'circle');
        c.setAttribute('cx', d.x.toFixed(1));
        c.setAttribute('cy', d.y.toFixed(1));
        c.setAttribute('r', 'var(--dia-r-particle)');
        c.setAttribute('fill', 'var(--accent)');
        svg.appendChild(c);
      });
    }
  }

  // Render SVG
  function redraw() {
    // Clear SVG
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    
    const mol = MOLECULES[currentKey];
    
    // 1. Draw Bonds
    mol.bonds.forEach((bond, bIdx) => {
      const atomA = mol.atoms[bond.atomA];
      const atomB = mol.atoms[bond.atomB];
      const order = userBonds[bIdx];

      const dx = atomB.x - atomA.x;
      const dy = atomB.y - atomA.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) return;
      
      const ux = dx / len;
      const uy = dy / len;
      const px = -uy;
      const py = ux;
      
      // Shorten line on both ends to clear chemical symbols
      const R = 18;
      const x1 = atomA.x + R * ux;
      const y1 = atomA.y + R * uy;
      const x2 = atomB.x - R * ux;
      const y2 = atomB.y - R * uy;

      // Group for mouse interaction and hover styling
      const g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 'lewis-bond-group');
      
      // Draw visible bond lines
      if (order === 0) {
        const line = document.createElementNS(SVGNS, 'line');
        line.setAttribute('class', 'lewis-bond-visual');
        line.setAttribute('x1', x1.toFixed(1));
        line.setAttribute('y1', y1.toFixed(1));
        line.setAttribute('x2', x2.toFixed(1));
        line.setAttribute('y2', y2.toFixed(1));
        line.setAttribute('stroke', 'var(--hair)');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-dasharray', '4 4');
        line.setAttribute('opacity', '0.4');
        g.appendChild(line);
      } else if (order === 1) {
        const line = document.createElementNS(SVGNS, 'line');
        line.setAttribute('class', 'lewis-bond-visual');
        line.setAttribute('x1', x1.toFixed(1));
        line.setAttribute('y1', y1.toFixed(1));
        line.setAttribute('x2', x2.toFixed(1));
        line.setAttribute('y2', y2.toFixed(1));
        line.setAttribute('stroke', 'var(--ink)');
        line.setAttribute('stroke-width', '2.2');
        g.appendChild(line);
      } else if (order === 2) {
        const w = 3; // spacing width
        const lines = [
          { x1: x1 + w * px, y1: y1 + w * py, x2: x2 + w * px, y2: y2 + w * py },
          { x1: x1 - w * px, y1: y1 - w * py, x2: x2 - w * px, y2: y2 - w * py }
        ];
        lines.forEach(coords => {
          const l = document.createElementNS(SVGNS, 'line');
          l.setAttribute('class', 'lewis-bond-visual');
          l.setAttribute('x1', coords.x1.toFixed(1));
          l.setAttribute('y1', coords.y1.toFixed(1));
          l.setAttribute('x2', coords.x2.toFixed(1));
          l.setAttribute('y2', coords.y2.toFixed(1));
          l.setAttribute('stroke', 'var(--ink)');
          l.setAttribute('stroke-width', '2.0');
          g.appendChild(l);
        });
      } else if (order === 3) {
        const w = 5.2;
        const lines = [
          { x1: x1, y1: y1, x2: x2, y2: y2 }, // center line
          { x1: x1 + w * px, y1: y1 + w * py, x2: x2 + w * px, y2: y2 + w * py },
          { x1: x1 - w * px, y1: y1 - w * py, x2: x2 - w * px, y2: y2 - w * py }
        ];
        lines.forEach(coords => {
          const l = document.createElementNS(SVGNS, 'line');
          l.setAttribute('class', 'lewis-bond-visual');
          l.setAttribute('x1', coords.x1.toFixed(1));
          l.setAttribute('y1', coords.y1.toFixed(1));
          l.setAttribute('x2', coords.x2.toFixed(1));
          l.setAttribute('y2', coords.y2.toFixed(1));
          l.setAttribute('stroke', 'var(--ink)');
          l.setAttribute('stroke-width', '1.8');
          g.appendChild(l);
        });
      }

      // Interaction overlay hit line (thick, transparent)
      const hit = document.createElementNS(SVGNS, 'line');
      hit.setAttribute('x1', x1.toFixed(1));
      hit.setAttribute('y1', y1.toFixed(1));
      hit.setAttribute('x2', x2.toFixed(1));
      hit.setAttribute('y2', y2.toFixed(1));
      hit.setAttribute('stroke', 'transparent');
      hit.setAttribute('stroke-width', '16');
      hit.setAttribute('cursor', 'pointer');
      g.appendChild(hit);

      // Event listener
      g.addEventListener('click', () => {
        userBonds[bIdx] = (userBonds[bIdx] + 1) % 4;
        updateDrawnCount();
        redraw();
      });

      svg.appendChild(g);
    });

    // 2. Draw Atoms
    mol.atoms.forEach((atom, aIdx) => {
      const numPairs = userLonePairs[aIdx];
      const freeDirs = getFreeDirections(aIdx, mol);

      const g = document.createElementNS(SVGNS, 'g');
      g.setAttribute('class', 'lewis-atom-group');

      // Draw lone pairs
      drawLonePairs(atom.x, atom.y, numPairs, freeDirs);

      // Background masking circle (prevents overlapping lines from clipping text)
      const mask = document.createElementNS(SVGNS, 'circle');
      mask.setAttribute('cx', atom.x);
      mask.setAttribute('cy', atom.y);
      mask.setAttribute('r', '15');
      mask.setAttribute('fill', 'var(--paper)');
      g.appendChild(mask);

      // Chemical Symbol Text
      const text = document.createElementNS(SVGNS, 'text');
      text.setAttribute('class', 'lewis-atom-text');
      text.setAttribute('x', atom.x);
      text.setAttribute('y', atom.y + 1); // small offset adjustment for vertical centering alignment
      text.setAttribute('font-family', 'var(--mono)');
      text.setAttribute('font-size', '24');
      text.setAttribute('font-weight', '700');
      text.setAttribute('fill', 'var(--ink)');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.textContent = atom.sym;
      g.appendChild(text);

      // Hit circle (wide, transparent)
      const hit = document.createElementNS(SVGNS, 'circle');
      hit.setAttribute('cx', atom.x);
      hit.setAttribute('cy', atom.y);
      hit.setAttribute('r', '24');
      hit.setAttribute('fill', 'transparent');
      hit.setAttribute('cursor', 'pointer');
      g.appendChild(hit);

      // Event listener to cycle lone pairs
      g.addEventListener('click', () => {
        userLonePairs[aIdx] = (userLonePairs[aIdx] + 1) % 4;
        updateDrawnCount();
        redraw();
      });

      svg.appendChild(g);
    });
  }

  // Validation Check
  function checkStructure() {
    const mol = MOLECULES[currentKey];
    
    // 1. Calculate total drawn
    let bondElectrons = 0;
    userBonds.forEach(order => {
      bondElectrons += order * 2;
    });

    let loneElectrons = 0;
    userLonePairs.forEach(pairs => {
      loneElectrons += pairs * 2;
    });

    const totalDrawn = bondElectrons + loneElectrons;
    
    // Check total valence pool first
    if (totalDrawn !== mol.targetElec) {
      feedback.className = 'feedback alert accent';
      if (totalDrawn < mol.targetElec) {
        feedback.textContent = `You drew ${totalDrawn} electrons. This is too few! The molecule needs ${mol.targetElec}. Check for missing lone pairs or bonds.`;
      } else {
        feedback.textContent = `You drew ${totalDrawn} electrons. This is too many! The molecule only needs ${mol.targetElec}. Check for extra lone pairs or bonds.`;
      }
      return;
    }

    // 2. Validate duet rule for Hydrogen (H)
    for (let i = 0; i < mol.atoms.length; i++) {
      const atom = mol.atoms[i];
      if (atom.sym === 'H') {
        // Find bonds connected to this Hydrogen
        let bondSum = 0;
        mol.bonds.forEach((bond, bIdx) => {
          if (bond.atomA === i || bond.atomB === i) {
            bondSum += userBonds[bIdx];
          }
        });

        // Hydrogen must have no lone pairs
        if (userLonePairs[i] > 0) {
          feedback.className = 'feedback alert accent';
          feedback.textContent = `Hydrogen (${atom.id}) cannot have lone pairs! It seeks only a single bond (2 electrons) to fill its duet.`;
          return;
        }

        // Hydrogen must form exactly one single bond
        if (bondSum === 0) {
          feedback.className = 'feedback alert accent';
          feedback.textContent = `Hydrogen (${atom.id}) is disconnected. It must form a single bond.`;
          return;
        }

        if (bondSum > 1) {
          feedback.className = 'feedback alert accent';
          feedback.textContent = `Hydrogen (${atom.id}) is forming too many bonds! It can only form one single bond (2 electrons total).`;
          return;
        }
      }
    }

    // 3. Validate octet rule for other atoms (C, N, O, F)
    for (let i = 0; i < mol.atoms.length; i++) {
      const atom = mol.atoms[i];
      if (atom.sym !== 'H') {
        let bondSum = 0;
        mol.bonds.forEach((bond, bIdx) => {
          if (bond.atomA === i || bond.atomB === i) {
            bondSum += userBonds[bIdx];
          }
        });

        const numLoneElectrons = userLonePairs[i] * 2;
        const totalOuter = (bondSum * 2) + numLoneElectrons;

        if (totalOuter !== 8) {
          feedback.className = 'feedback alert accent';
          const elementText = atom.sym === 'C' ? 'Carbon' : atom.sym === 'N' ? 'Nitrogen' : atom.sym === 'O' ? 'Oxygen' : 'Fluorine';
          if (totalOuter < 8) {
            feedback.textContent = `The central/outer ${elementText} atom has only ${totalOuter} electrons in its outer shell. It needs 8 to satisfy the octet rule. Try sharing a lone pair or adding one.`;
          } else {
            feedback.textContent = `The central/outer ${elementText} atom has ${totalOuter} electrons in its outer shell. This exceeds the octet rule limit of 8! Remove some lone pairs or double bonds.`;
          }
          return;
        }
      }
    }

    // 4. Success!
    feedback.className = 'feedback alert good';
    feedback.textContent = 'Correct! All atoms satisfy their octet/duet rules, and the total valence electron count matches the pool perfectly.';
  }

  // Event Listeners
  selectMol.addEventListener('change', (e) => {
    initMolecule(e.target.value);
  });

  btnCheck.addEventListener('click', checkStructure);

  btnReset.addEventListener('click', () => {
    initMolecule(currentKey);
  });

  // Start with Water (H2O) as the pre-selected option in HTML
  initMolecule('H2O');
})();
