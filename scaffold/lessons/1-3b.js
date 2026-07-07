/* ============================================================
   1-3b LESSON INTERACTIVES
   Contains the signature Interactive IMF & Phase Lab (#phaseSvg).
   Illustrates phase changes (solid, liquid, gas) and IMF behaviors.
   ============================================================ */

(function () {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('phaseSvg');
  if (!svg) return;

  // Substance data
  const SUBSTANCES = {
    CO2: {
      formula: 'CO₂',
      name: 'Carbon Dioxide',
      imf: 'LDF (Weakest)',
      bp: '−78°C (Sublimes)',
      vp: 'Highest',
      sol: 'Soluble in nonpolar solvents (hexane)',
      desc: 'Carbon dioxide is nonpolar and only attracts neighbors via weak London dispersion forces. It sublimes directly to gas at standard pressure because its attractions are easily overcome by minimal thermal energy.'
    },
    acetone: {
      formula: 'C₃H₆O',
      name: 'Acetone',
      imf: 'Dipole-Dipole (Moderate)',
      bp: '56°C',
      vp: 'Moderate',
      sol: 'Soluble in both polar and nonpolar solvents',
      desc: 'Acetone is polar due to its electronegative carbon-oxygen double bond. Its permanent dipoles align to pull neighboring molecules together, creating moderate boiling and evaporation rates.'
    },
    H2O: {
      formula: 'H₂O',
      name: 'Water',
      imf: 'Hydrogen Bonding (Strongest)',
      bp: '100°C',
      vp: 'Lowest',
      sol: 'Soluble in polar/ionic solvents (water)',
      desc: 'Water molecules contain highly polar O–H bonds that form exceptionally strong hydrogen bonds with neighboring lone pairs. This powerful attraction holds water in the liquid phase until 100°C.'
    }
  };

  // UI DOM elements
  const tabs = document.querySelectorAll('#substanceTabs button');
  const tempSlider = document.getElementById('tempSlider');
  const tempLabel = document.getElementById('tempLabel');
  const subFormula = document.getElementById('subFormula');
  const subName = document.getElementById('subName');
  const subDesc = document.getElementById('subDesc');
  const valImf = document.getElementById('valImf');
  const valBp = document.getElementById('valBp');
  const valVp = document.getElementById('valVp');
  const valSol = document.getElementById('valSol');

  // Animation states
  let activeSubKey = 'CO2';
  let activePhase = 0; // 0 = Solid, 1 = Liquid, 2 = Gas
  let animationId = null;
  let t = 0;

  // Molecule positions & velocities
  const numMolecules = 6;
  const molecules = [];

  // Solid fixed coordinates (3x2 grid)
  const solidCoords = [
    { x: 90, y: 75 },  { x: 160, y: 75 },  { x: 230, y: 75 },
    { x: 90, y: 140 }, { x: 160, y: 140 }, { x: 230, y: 140 }
  ];

  // Initialize molecules
  for (let i = 0; i < numMolecules; i++) {
    molecules.push({
      x: solidCoords[i].x,
      y: solidCoords[i].y,
      vx: (Math.random() - 0.5) * 2.5,
      vy: (Math.random() - 0.5) * 2.5,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.05,
      id: i
    });
  }

  // Trigonometric coordinate rotation helper
  function rotatePoint(px, py, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: px * cos - py * sin,
      y: px * sin + py * cos
    };
  }

  // Update logic
  function update() {
    t += 0.05;
    
    molecules.forEach(m => {
      if (activePhase === 0) {
        // SOLID: vibrate in place
        const base = solidCoords[m.id];
        m.x = base.x + Math.sin(t * 12 + m.id) * 1.2;
        m.y = base.y + Math.cos(t * 12 + m.id) * 1.2;
        m.angle = 0.2 * Math.sin(t * 2 + m.id); // slight sway
      } else if (activePhase === 1) {
        // LIQUID: drift in container and cluster towards the bottom-center
        m.x += m.vx * 0.45;
        m.y += m.vy * 0.45;
        m.angle += m.vAngle * 0.3;

        // Apply visual gravity + center-seeking force
        m.vy += 0.06; // gravity pull
        m.vx += (160 - m.x) * 0.003; // central attraction

        // Boundary bounce (liquid container bounds: x 40..280, y 60..180)
        const minX = 45, maxX = 275;
        const minY = 65, maxY = 185;

        if (m.x < minX) { m.x = minX; m.vx *= -1; }
        if (m.x > maxX) { m.x = maxX; m.vx *= -1; }
        if (m.y < minY) { m.y = minY; m.vy *= -1; }
        if (m.y > maxY) { m.y = maxY; m.vy *= -1; }

        // Cohesion drag
        m.vx *= 0.98;
        m.vy *= 0.98;

        // Small random push to maintain movement
        if (Math.abs(m.vx) < 0.1) m.vx += (Math.random() - 0.5) * 0.5;
        if (Math.abs(m.vy) < 0.1) m.vy += (Math.random() - 0.5) * 0.5;
        
      } else if (activePhase === 2) {
        // GAS: fly fast and fill the whole viewport
        m.x += m.vx * 1.5;
        m.y += m.vy * 1.5;
        m.angle += m.vAngle * 1.2;

        const minX = 20, maxX = 300;
        const minY = 20, maxY = 200;

        if (m.x < minX) { m.x = minX; m.vx *= -1; }
        if (m.x > maxX) { m.x = maxX; m.vx *= -1; }
        if (m.y < minY) { m.y = minY; m.vy *= -1; }
        if (m.y > maxY) { m.y = maxY; m.vy *= -1; }
      }
    });
  }

  // Draw logic
  function draw() {
    // Clear SVG
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // Draw container boundaries
    const border = document.createElementNS(SVGNS, 'rect');
    border.setAttribute('x', '10');
    border.setAttribute('y', '10');
    border.setAttribute('width', '300');
    border.setAttribute('height', '200');
    border.setAttribute('class', 'd-wall');
    border.setAttribute('fill', 'none');
    svg.appendChild(border);

    // 1. Draw Intermolecular Forces (IMFs)
    if (activePhase === 0) {
      // SOLID: Draw fixed network of attractions (dashed lines)
      const connections = [
        [0, 1], [1, 2], [3, 4], [4, 5], // horizontal
        [0, 3], [1, 4], [2, 5],         // vertical
        [0, 4], [1, 3], [1, 5], [2, 4]  // diagonals
      ];
      connections.forEach(pair => {
        const mA = molecules[pair[0]];
        const mB = molecules[pair[1]];
        drawImfLine(mA.x, mA.y, mB.x, mB.y);
      });
    } else if (activePhase === 1) {
      // LIQUID: Draw dynamic IMFs between close molecules (distance < 78)
      for (let i = 0; i < numMolecules; i++) {
        for (let j = i + 1; j < numMolecules; j++) {
          const mA = molecules[i];
          const mB = molecules[j];
          const dx = mB.x - mA.x;
          const dy = mB.y - mA.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 78) {
            drawImfLine(mA.x, mA.y, mB.x, mB.y);
          }
        }
      }
    }
    // GAS has 0 IMFs (attractions fully broken)

    // 2. Draw Molecules
    molecules.forEach(m => {
      // Draw motion tails (gas only)
      if (activePhase === 2) {
        const tail = document.createElementNS(SVGNS, 'line');
        tail.setAttribute('x1', m.x.toFixed(1));
        tail.setAttribute('y1', m.y.toFixed(1));
        tail.setAttribute('x2', (m.x - m.vx * 5).toFixed(1));
        tail.setAttribute('y2', (m.y - m.vy * 5).toFixed(1));
        tail.setAttribute('stroke', 'var(--ink-mute)');
        tail.setAttribute('stroke-width', 'var(--dia-stroke-bond)');
        tail.setAttribute('opacity', '0.45');
        svg.appendChild(tail);
      }

      // Draw brackets around molecules (solid only)
      if (activePhase === 0) {
        drawSolidBrackets(m.x, m.y);
      }

      // Render the molecular structure
      drawMolecule(activeSubKey, m.x, m.y, m.angle);
    });
  }

  // Draw IMF dashed line helper
  function drawImfLine(x1, y1, x2, y2) {
    const line = document.createElementNS(SVGNS, 'line');
    line.setAttribute('x1', x1.toFixed(1));
    line.setAttribute('y1', y1.toFixed(1));
    line.setAttribute('x2', x2.toFixed(1));
    line.setAttribute('y2', y2.toFixed(1));
    line.setAttribute('stroke', 'var(--accent)');
    line.setAttribute('stroke-dasharray', '3 2');
    line.setAttribute('stroke-width', '1.8');
    svg.appendChild(line);
  }

  // Draw solid brackets helper
  function drawSolidBrackets(cx, cy) {
    const lPath = `M ${(cx - 15).toFixed(1)} ${(cy - 12).toFixed(1)} H ${(cx - 18).toFixed(1)} V ${(cy + 12).toFixed(1)} H ${(cx - 15).toFixed(1)}`;
    const rPath = `M ${(cx + 15).toFixed(1)} ${(cy - 12).toFixed(1)} H ${(cx + 18).toFixed(1)} V ${(cy + 12).toFixed(1)} H ${(cx + 15).toFixed(1)}`;

    [lPath, rPath].forEach(dStr => {
      const p = document.createElementNS(SVGNS, 'path');
      p.setAttribute('d', dStr);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke', 'var(--ink-mute)');
      p.setAttribute('stroke-width', 'var(--dia-stroke)');
      svg.appendChild(p);
    });
  }

  // Render molecular geometry
  function drawMolecule(type, cx, cy, angle) {
    const g = document.createElementNS(SVGNS, 'g');
    
    // Relative coordinates based on substance geometry
    let atoms = [];
    let bonds = [];

    if (type === 'CO2') {
      // Linear O = C = O
      atoms = [
        { sym: 'C', x: 0, y: 0, r: 'var(--dia-r-atom)', fill: 'var(--ink-soft)' },
        { sym: 'O', x: -15, y: 0, r: 'var(--dia-r-atom)', fill: 'var(--cool)' },
        { sym: 'O', x: 15, y: 0, r: 'var(--dia-r-atom)', fill: 'var(--cool)' }
      ];
      // Double bonds
      bonds = [
        { type: 'double', x1: -14, y1: 0, x2: 0, y2: 0 },
        { type: 'double', x1: 0, y1: 0, x2: 14, y2: 0 }
      ];
    } else if (type === 'acetone') {
      // Planar T-shape skeleton
      atoms = [
        { sym: 'C', x: 0, y: 0, r: 'var(--dia-r-atom)', fill: 'var(--ink-soft)' },
        { sym: 'O', x: 0, y: -14, r: 'var(--dia-r-atom)', fill: 'var(--cool)' },
        { sym: 'C', x: -12, y: 8, r: 'var(--dia-r-atom)', fill: 'var(--ink-mute)' },
        { sym: 'C', x: 12, y: 8, r: 'var(--dia-r-atom)', fill: 'var(--ink-mute)' }
      ];
      // Bonds: 1 double C=O, 2 single C-C
      bonds = [
        { type: 'double', x1: 0, y1: 0, x2: 0, y2: -13 },
        { type: 'single', x1: 0, y1: 0, x2: -12, y2: 8 },
        { type: 'single', x1: 0, y1: 0, x2: 12, y2: 8 }
      ];
    } else if (type === 'H2O') {
      // Bent shape O - H
      atoms = [
        { sym: 'O', x: 0, y: -4, r: 'var(--dia-r-atom)', fill: 'var(--cool)' },
        { sym: 'H', x: -11, y: 6, r: 'var(--dia-r-atom-sm)', fill: 'var(--paper-3)' },
        { sym: 'H', x: 11, y: 6, r: 'var(--dia-r-atom-sm)', fill: 'var(--paper-3)' }
      ];
      // Single bonds
      bonds = [
        { type: 'single', x1: 0, y1: -4, x2: -11, y2: 6 },
        { type: 'single', x1: 0, y1: -4, x2: 11, y2: 6 }
      ];
    }

    // Draw Covalent Bonds (lines)
    bonds.forEach(b => {
      const p1 = rotatePoint(b.x1, b.y1, angle);
      const p2 = rotatePoint(b.x2, b.y2, angle);

      if (b.type === 'single') {
        const line = document.createElementNS(SVGNS, 'line');
        line.setAttribute('x1', (cx + p1.x).toFixed(1));
        line.setAttribute('y1', (cy + p1.y).toFixed(1));
        line.setAttribute('x2', (cx + p2.x).toFixed(1));
        line.setAttribute('y2', (cy + p2.y).toFixed(1));
        line.setAttribute('stroke', 'var(--ink)');
        line.setAttribute('stroke-width', '1.8');
        g.appendChild(line);
      } else if (b.type === 'double') {
        // Calculate perpendicular offsets for double parallel lines
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len;
        const uy = dy / len;
        const px = -uy * 1.8;
        const py = ux * 1.8;

        const l1 = document.createElementNS(SVGNS, 'line');
        l1.setAttribute('x1', (cx + p1.x + px).toFixed(1));
        l1.setAttribute('y1', (cy + p1.y + py).toFixed(1));
        l1.setAttribute('x2', (cx + p2.x + px).toFixed(1));
        l1.setAttribute('y2', (cy + p2.y + py).toFixed(1));
        l1.setAttribute('stroke', 'var(--ink)');
        l1.setAttribute('stroke-width', 'var(--dia-stroke-bond)');
        g.appendChild(l1);

        const l2 = document.createElementNS(SVGNS, 'line');
        l2.setAttribute('x1', (cx + p1.x - px).toFixed(1));
        l2.setAttribute('y1', (cy + p1.y - py).toFixed(1));
        l2.setAttribute('x2', (cx + p2.x - px).toFixed(1));
        l2.setAttribute('y2', (cy + p2.y - py).toFixed(1));
        l2.setAttribute('stroke', 'var(--ink)');
        l2.setAttribute('stroke-width', 'var(--dia-stroke-bond)');
        g.appendChild(l2);
      }
    });

    // Draw Atom Cores (circles)
    atoms.forEach(a => {
      const p = rotatePoint(a.x, a.y, angle);
      const c = document.createElementNS(SVGNS, 'circle');
      c.setAttribute('cx', (cx + p.x).toFixed(1));
      c.setAttribute('cy', (cy + p.y).toFixed(1));
      c.setAttribute('r', a.r);
      c.setAttribute('fill', a.fill);
      c.setAttribute('stroke', 'var(--ink)');
      c.setAttribute('stroke-width', 'var(--dia-stroke-bond)');
      g.appendChild(c);
    });

    svg.appendChild(g);
  }

  // Update property readout display
  function updateReadout() {
    const data = SUBSTANCES[activeSubKey];
    subFormula.textContent = data.formula;
    subName.textContent = data.name;
    subDesc.textContent = data.desc;
    valImf.textContent = data.imf;
    valBp.textContent = data.bp;
    valVp.textContent = data.vp;
    valSol.textContent = data.sol;

    // Apply color highlights based on relative strength
    if (activeSubKey === 'CO2') {
      valImf.style.color = 'var(--accent)';
      valVp.style.color = 'var(--accent)';
    } else if (activeSubKey === 'acetone') {
      valImf.style.color = 'var(--ink)';
      valVp.style.color = 'var(--ink)';
    } else if (activeSubKey === 'H2O') {
      valImf.style.color = 'var(--good)';
      valVp.style.color = 'var(--good)';
    }
  }

  // Frame Loop
  function loop() {
    update();
    draw();
    animationId = requestAnimationFrame(loop);
  }

  // Initialize state on tabs click
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      activeSubKey = tab.dataset.sub;
      updateReadout();
    });
  });

  // Slider change listener
  tempSlider.addEventListener('input', (e) => {
    activePhase = parseInt(e.target.value);
    
    // Reset velocities if phase switches to keep particles bouncing at proper speeds
    molecules.forEach(m => {
      const scale = activePhase === 2 ? 1.6 : 0.8;
      m.vx = (Math.random() - 0.5) * 2.2 * scale;
      m.vy = (Math.random() - 0.5) * 2.2 * scale;
      if (activePhase === 1) {
        // clustered cluster starting velocity
        m.vx *= 0.6;
        m.vy *= 0.6;
      }
    });

    // Update slider label text
    const labels = ['Cool (Solid)', 'Warm (Liquid)', 'Hot (Gas)'];
    tempLabel.textContent = labels[activePhase];

    // Highlight text based on phase
    if (activePhase === 0) {
      tempLabel.style.color = 'var(--cool)';
    } else if (activePhase === 1) {
      tempLabel.style.color = 'var(--ink-soft)';
    } else {
      tempLabel.style.color = 'var(--accent)';
    }
  });

  // Start animation loop
  updateReadout();
  loop();
})();
