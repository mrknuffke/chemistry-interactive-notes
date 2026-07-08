document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const rxnWaterBtn = document.getElementById("rxnWater");
  const rxnAmmoniaBtn = document.getElementById("rxnAmmonia");
  const reactantControls = document.getElementById("reactantControls");
  const productControls = document.getElementById("productControls");
  const balanceStatus = document.getElementById("balanceStatus");
  const tallyGrid = document.getElementById("tallyGrid");
  const canvas = document.getElementById("balanceCanvas");

  const svgNS = "http://www.w3.org/2000/svg";

  // Equations Database
  const equations = {
    water: {
      formulaStr: "2 H₂ + O₂ → 2 H₂O",
      reactants: [
        { name: "H₂", formula: "H₂", key: "H2", initial: 1, min: 1, max: 4, mass: 2.02 },
        { name: "O₂", formula: "O₂", key: "O2", initial: 1, min: 1, max: 4, mass: 32.00 }
      ],
      products: [
        { name: "H₂O", formula: "H₂O", key: "H2O", initial: 1, min: 1, max: 4, mass: 18.02 }
      ],
      // Balancing condition check function
      checkBalance: (coeffs) => {
        const leftH = (coeffs.H2 || 1) * 2;
        const leftO = (coeffs.O2 || 1) * 2;
        const rightH = (coeffs.H2O || 1) * 2;
        const rightO = (coeffs.H2O || 1) * 1;
        return {
          balanced: leftH === rightH && leftO === rightO,
          ledger: [
            { element: "Hydrogen (H)", left: leftH, right: rightH, match: leftH === rightH },
            { element: "Oxygen (O)", left: leftO, right: rightO, match: leftO === rightO }
          ]
        };
      }
    },
    ammonia: {
      formulaStr: "N₂ + 3 H₂ → 2 NH₃",
      reactants: [
        { name: "N₂", formula: "N₂", key: "N2", initial: 1, min: 1, max: 4, mass: 28.02 },
        { name: "H₂", formula: "H₂", key: "H2", initial: 1, min: 1, max: 4, mass: 2.02 }
      ],
      products: [
        { name: "NH₃", formula: "NH₃", key: "NH3", initial: 1, min: 1, max: 4, mass: 17.03 }
      ],
      checkBalance: (coeffs) => {
        const leftN = (coeffs.N2 || 1) * 2;
        const leftH = (coeffs.H2 || 1) * 2;
        const rightN = (coeffs.NH3 || 1) * 1;
        const rightH = (coeffs.NH3 || 1) * 3;
        return {
          balanced: leftN === rightN && leftH === rightH,
          ledger: [
            { element: "Nitrogen (N)", left: leftN, right: rightN, match: leftN === rightN },
            { element: "Hydrogen (H)", left: leftH, right: rightH, match: leftH === rightH }
          ]
        };
      }
    }
  };

  let currentRxn = "water";
  let coefficients = { H2: 1, O2: 1, H2O: 1, N2: 1, NH3: 1 };

  function createSVGElement(tag, attrs) {
    const el = document.createElementNS(svgNS, tag);
    for (let k in attrs) {
      if (k === 'font-size') {
        el.style.fontSize = attrs[k];
      } else {
        el.setAttribute(k, attrs[k]);
      }
    }
    return el;
  }

  // Molecule drawings
  function drawH2(cx, cy) {
    const g = createSVGElement("g", { transform: `translate(${cx}, ${cy})` });
    g.appendChild(createSVGElement("line", { x1: -5, y1: 0, x2: 5, y2: 0, stroke: "var(--ink-mute)", "stroke-width": "var(--dia-stroke)" }));
    
    [-5, 5].forEach(x => {
      g.appendChild(createSVGElement("circle", { cx: x, cy: 0, r: "var(--dia-r-atom-sm)", fill: "#ffffff", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke)" }));
      const text = createSVGElement("text", {
        x: x, y: 2.2, "text-anchor": "middle",
        fill: "var(--ink)", "font-family": "var(--mono)", "font-size": "var(--dia-caption-size)", "font-weight": "700"
      });
      text.textContent = "H";
      g.appendChild(text);
    });
    return g;
  }

  function drawO2(cx, cy) {
    const g = createSVGElement("g", { transform: `translate(${cx}, ${cy})` });
    g.appendChild(createSVGElement("line", { x1: -6, y1: -1.2, x2: 6, y2: -1.2, stroke: "var(--ink-mute)", "stroke-width": "var(--dia-stroke)" }));
    g.appendChild(createSVGElement("line", { x1: -6, y1: 1.2, x2: 6, y2: 1.2, stroke: "var(--ink-mute)", "stroke-width": "var(--dia-stroke)" }));

    [-6, 6].forEach(x => {
      g.appendChild(createSVGElement("circle", { cx: x, cy: 0, r: "var(--dia-r-atom)", fill: "var(--accent)", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke)" }));
      const text = createSVGElement("text", {
        x: x, y: 2.2, "text-anchor": "middle",
        fill: "#ffffff", "font-family": "var(--mono)", "font-size": "var(--dia-caption-size)", "font-weight": "700"
      });
      text.textContent = "O";
      g.appendChild(text);
    });
    return g;
  }

  function drawN2(cx, cy) {
    const g = createSVGElement("g", { transform: `translate(${cx}, ${cy})` });
    // Triple bond
    g.appendChild(createSVGElement("line", { x1: -6, y1: -2, x2: 6, y2: -2, stroke: "var(--ink-mute)", "stroke-width": "var(--dia-stroke)" }));
    g.appendChild(createSVGElement("line", { x1: -6, y1: 0, x2: 6, y2: 0, stroke: "var(--ink-mute)", "stroke-width": "var(--dia-stroke)" }));
    g.appendChild(createSVGElement("line", { x1: -6, y1: 2, x2: 6, y2: 2, stroke: "var(--ink-mute)", "stroke-width": "var(--dia-stroke)" }));

    [-6, 6].forEach(x => {
      g.appendChild(createSVGElement("circle", { cx: x, cy: 0, r: "var(--dia-r-atom)", fill: "var(--ink-mute)", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke)" }));
      const text = createSVGElement("text", {
        x: x, y: 2.2, "text-anchor": "middle",
        fill: "#ffffff", "font-family": "var(--mono)", "font-size": "var(--dia-caption-size)", "font-weight": "700"
      });
      text.textContent = "N";
      g.appendChild(text);
    });
    return g;
  }

  function drawH2O(cx, cy) {
    const g = createSVGElement("g", { transform: `translate(${cx}, ${cy})` });
    g.appendChild(createSVGElement("line", { x1: 0, y1: -2, x2: -7, y2: 5, stroke: "var(--ink-mute)", "stroke-width": "var(--dia-stroke)" }));
    g.appendChild(createSVGElement("line", { x1: 0, y1: -2, x2: 7, y2: 5, stroke: "var(--ink-mute)", "stroke-width": "var(--dia-stroke)" }));

    // Oxygen
    g.appendChild(createSVGElement("circle", { cx: 0, cy: -2, r: "var(--dia-r-atom)", fill: "var(--accent)", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke)" }));
    const textO = createSVGElement("text", {
      x: 0, y: 0.2, "text-anchor": "middle",
      fill: "#ffffff", "font-family": "var(--mono)", "font-size": "var(--dia-caption-size)", "font-weight": "700"
    });
    textO.textContent = "O";
    g.appendChild(textO);

    // Hydrogens
    [-7, 7].forEach(x => {
      g.appendChild(createSVGElement("circle", { cx: x, cy: 5, r: "var(--dia-r-atom-sm)", fill: "#ffffff", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke)" }));
      const textH = createSVGElement("text", {
        x: x, y: 7.2, "text-anchor": "middle",
        fill: "var(--ink)", "font-family": "var(--mono)", "font-size": "var(--dia-caption-size)", "font-weight": "700"
      });
      textH.textContent = "H";
      g.appendChild(textH);
    });
    return g;
  }

  function drawNH3(cx, cy) {
    const g = createSVGElement("g", { transform: `translate(${cx}, ${cy})` });
    g.appendChild(createSVGElement("line", { x1: 0, y1: -2, x2: -8, y2: 6, stroke: "var(--ink-mute)", "stroke-width": "var(--dia-stroke)" }));
    g.appendChild(createSVGElement("line", { x1: 0, y1: -2, x2: 8, y2: 6, stroke: "var(--ink-mute)", "stroke-width": "var(--dia-stroke)" }));
    g.appendChild(createSVGElement("line", { x1: 0, y1: -2, x2: 0, y2: 8, stroke: "var(--ink-mute)", "stroke-width": "var(--dia-stroke)" }));

    // Nitrogen
    g.appendChild(createSVGElement("circle", { cx: 0, cy: -2, r: "var(--dia-r-atom)", fill: "var(--ink-mute)", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke)" }));
    const textN = createSVGElement("text", {
      x: 0, y: 0.2, "text-anchor": "middle",
      fill: "#ffffff", "font-family": "var(--mono)", "font-size": "var(--dia-caption-size)", "font-weight": "700"
    });
    textN.textContent = "N";
    g.appendChild(textN);

    // Hydrogens
    const hPositions = [{ x: -8, y: 6 }, { x: 8, y: 6 }, { x: 0, y: 8 }];
    hPositions.forEach(p => {
      g.appendChild(createSVGElement("circle", { cx: p.x, cy: p.y, r: "var(--dia-r-atom-sm)", fill: "#ffffff", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke)" }));
      const textH = createSVGElement("text", {
        x: p.x, y: p.y + 2.2, "text-anchor": "middle",
        fill: "var(--ink)", "font-family": "var(--mono)", "font-size": "var(--dia-caption-size)", "font-weight": "700"
      });
      textH.textContent = "H";
      g.appendChild(textH);
    });
    return g;
  }

  function renderControls() {
    const eq = equations[currentRxn];
    
    // Reactants
    reactantControls.innerHTML = "";
    eq.reactants.forEach(r => {
      const row = document.createElement("div");
      row.className = "coeff-row";
      row.innerHTML = `
        <span class="coeff-name">${r.name}</span>
        <div class="coeff-adjuster">
          <button class="adjust-btn minus" data-key="${r.key}">&minus;</button>
          <span class="coeff-val" id="val-${r.key}">${coefficients[r.key]}</span>
          <button class="adjust-btn plus" data-key="${r.key}">+</button>
        </div>
      `;
      reactantControls.appendChild(row);
    });

    // Products
    productControls.innerHTML = "";
    eq.products.forEach(p => {
      const row = document.createElement("div");
      row.className = "coeff-row";
      row.innerHTML = `
        <span class="coeff-name">${p.name}</span>
        <div class="coeff-adjuster">
          <button class="adjust-btn minus" data-key="${p.key}">&minus;</button>
          <span class="coeff-val" id="val-${p.key}">${coefficients[p.key]}</span>
          <button class="adjust-btn plus" data-key="${p.key}">+</button>
        </div>
      `;
      productControls.appendChild(row);
    });

    // Wire up events
    document.querySelectorAll(".adjust-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const key = btn.dataset.key;
        const isPlus = btn.classList.contains("plus");
        const valSpan = document.getElementById(`val-${key}`);
        
        let val = coefficients[key];
        if (isPlus) {
          if (val < 4) val++;
        } else {
          if (val > 1) val--;
        }
        
        coefficients[key] = val;
        valSpan.textContent = val;
        
        updateState();
      });
    });
  }

  function updateState() {
    const eq = equations[currentRxn];
    
    // Disable/enable adjuster buttons at bounds
    document.querySelectorAll(".adjust-btn").forEach(btn => {
      const key = btn.dataset.key;
      const isPlus = btn.classList.contains("plus");
      const val = coefficients[key];
      
      if (isPlus) {
        btn.disabled = val >= 4;
      } else {
        btn.disabled = val <= 1;
      }
    });

    // Check balancing
    const result = eq.checkBalance(coefficients);

    // Update status badge
    if (result.balanced) {
      balanceStatus.textContent = "Balanced!";
      balanceStatus.className = "status-badge-inline balanced";
    } else {
      balanceStatus.textContent = "Unbalanced";
      balanceStatus.className = "status-badge-inline unbalanced";
    }

    // Update Ledger Table
    tallyGrid.innerHTML = "";
    result.ledger.forEach(item => {
      const box = document.createElement("div");
      box.className = "tally-box";
      box.innerHTML = `
        <div class="element-name">${item.element}</div>
        <div class="counts ${item.match ? 'match' : 'no-match'}">
          ${item.left} &nbsp; vs &nbsp; ${item.right}
        </div>
      `;
      tallyGrid.appendChild(box);
    });

    // Render Scale Drawing
    drawScale(eq, result.balanced);
  }

  function drawScale(eq, isBalanced) {
    canvas.innerHTML = "";

    // 1. Calculate weights to determine tilt
    let leftMass = 0;
    eq.reactants.forEach(r => {
      leftMass += coefficients[r.key] * r.mass;
    });

    let rightMass = 0;
    eq.products.forEach(p => {
      rightMass += coefficients[p.key] * p.mass;
    });

    // Calculate Tilt Angle in radians. Heavier side must sink (larger SVG y),
    // so a heavier left pan needs a NEGATIVE diff here (see lx/ly/rx/ry below).
    const diff = rightMass - leftMass;
    const maxDiff = 120; // scale factor
    const maxAngleDeg = 14; // max tilt degrees
    const tiltDeg = Math.max(-maxAngleDeg, Math.min(maxAngleDeg, (diff / maxDiff) * maxAngleDeg));
    const tiltRad = (tiltDeg * Math.PI) / 180;

    // 2. Base structure (Pillar, Base, Pivot) - Static
    // Pillar
    canvas.appendChild(createSVGElement("line", { x1: 200, y1: 100, x2: 200, y2: 240, class: "d-wall", stroke: "var(--ink-mute)" }));
    // Base plate
    canvas.appendChild(createSVGElement("line", { x1: 140, y1: 240, x2: 260, y2: 240, class: "d-wall" }));
    // Center Pivot joint
    canvas.appendChild(createSVGElement("circle", { cx: 200, cy: 100, r: "var(--dia-r-atom-sm)", fill: "var(--accent)", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke-bond)" }));

    // 3. Calculate dynamic pivot end coordinates for the beam bar (half-width = 110)
    const beamHalf = 110;
    const lx = 200 - beamHalf * Math.cos(tiltRad);
    const ly = 100 - beamHalf * Math.sin(tiltRad);

    const rx = 200 + beamHalf * Math.cos(tiltRad);
    const ry = 100 + beamHalf * Math.sin(tiltRad);

    // Draw main rotating beam bar
    canvas.appendChild(createSVGElement("line", {
      x1: lx, y1: ly, x2: rx, y2: ry,
      class: "d-wall"
    }));

    // Hanger loops at endpoints
    canvas.appendChild(createSVGElement("circle", { cx: lx, cy: ly, r: "var(--dia-r-particle)", fill: "none", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke-bond)" }));
    canvas.appendChild(createSVGElement("circle", { cx: rx, cy: ry, r: "var(--dia-r-particle)", fill: "none", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke-bond)" }));

    // 4. Render Left Pan (reactants) - hangs vertically from (lx, ly)
    const panH = 75; // vertical hanging length of strings
    const panW = 45; // half-width of plate
    const leftPlateY = ly + panH;

    // Hanging strings
    canvas.appendChild(createSVGElement("line", { x1: lx, y1: ly, x2: lx - panW, y2: leftPlateY, stroke: "var(--ink-soft)", "stroke-width": "var(--dia-stroke)" }));
    canvas.appendChild(createSVGElement("line", { x1: lx, y1: ly, x2: lx + panW, y2: leftPlateY, stroke: "var(--ink-soft)", "stroke-width": "var(--dia-stroke)" }));
    // Pan plate
    canvas.appendChild(createSVGElement("path", {
      d: `M ${lx - panW - 5} ${leftPlateY} L ${lx + panW + 5} ${leftPlateY} C ${lx + panW} ${leftPlateY + 6}, ${lx - panW} ${leftPlateY + 6}, ${lx - panW - 5} ${leftPlateY} Z`,
      fill: "var(--paper-2)", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke-bond)"
    }));

    // 5. Render Right Pan (products) - hangs vertically from (rx, ry)
    const rightPlateY = ry + panH;

    // Hanging strings
    canvas.appendChild(createSVGElement("line", { x1: rx, y1: ry, x2: rx - panW, y2: rightPlateY, stroke: "var(--ink-soft)", "stroke-width": "var(--dia-stroke)" }));
    canvas.appendChild(createSVGElement("line", { x1: rx, y1: ry, x2: rx + panW, y2: rightPlateY, stroke: "var(--ink-soft)", "stroke-width": "var(--dia-stroke)" }));
    // Pan plate
    canvas.appendChild(createSVGElement("path", {
      d: `M ${rx - panW - 5} ${rightPlateY} L ${rx + panW + 5} ${rightPlateY} C ${rx + panW} ${rightPlateY + 6}, ${rx - panW} ${rightPlateY + 6}, ${rx - panW - 5} ${rightPlateY} Z`,
      fill: "var(--paper-2)", stroke: "var(--ink)", "stroke-width": "var(--dia-stroke-bond)"
    }));

    // 6. Populate Left Pan molecules (Reactants)
    const leftCenterY = leftPlateY - 22;
    
    if (currentRxn === "water") {
      const h2Coeff = coefficients.H2;
      const o2Coeff = coefficients.O2;

      // H2 placement coordinates relative to left pan center (lx, leftCenterY)
      const h2Offsets = [
        { dx: -20, dy: 10 },
        { dx: -22, dy: -8 },
        { dx: -34, dy: 1 },
        { dx: -10, dy: -2 }
      ];
      for (let i = 0; i < h2Coeff; i++) {
        const coords = h2Offsets[i];
        canvas.appendChild(drawH2(lx + coords.dx, leftCenterY + coords.dy));
      }

      // O2 placement coordinates
      const o2Offsets = [
        { dx: 20, dy: 8 },
        { dx: 22, dy: -10 },
        { dx: 33, dy: -1 },
        { dx: 9, dy: -2 }
      ];
      for (let i = 0; i < o2Coeff; i++) {
        const coords = o2Offsets[i];
        canvas.appendChild(drawO2(lx + coords.dx, leftCenterY + coords.dy));
      }
    } else if (currentRxn === "ammonia") {
      const n2Coeff = coefficients.N2;
      const h2Coeff = coefficients.H2;

      // N2 placement
      const n2Offsets = [
        { dx: -20, dy: 7 },
        { dx: -22, dy: -10 },
        { dx: -33, dy: -1 },
        { dx: -9, dy: -2 }
      ];
      for (let i = 0; i < n2Coeff; i++) {
        const coords = n2Offsets[i];
        canvas.appendChild(drawN2(lx + coords.dx, leftCenterY + coords.dy));
      }

      // H2 placement
      const h2Offsets = [
        { dx: 20, dy: 9 },
        { dx: 22, dy: -9 },
        { dx: 33, dy: 0 },
        { dx: 9, dy: 0 }
      ];
      for (let i = 0; i < h2Coeff; i++) {
        const coords = h2Offsets[i];
        canvas.appendChild(drawH2(lx + coords.dx, leftCenterY + coords.dy));
      }
    }

    // 7. Populate Right Pan molecules (Products)
    const rightCenterY = rightPlateY - 22;

    if (currentRxn === "water") {
      const h2oCoeff = coefficients.H2O;
      const h2oOffsets = [
        { dx: -18, dy: 8 },
        { dx: 18, dy: 8 },
        { dx: 0, dy: -10 },
        { dx: 0, dy: 24 }
      ];
      for (let i = 0; i < h2oCoeff; i++) {
        const coords = h2oOffsets[i];
        canvas.appendChild(drawH2O(rx + coords.dx, rightCenterY + coords.dy));
      }
    } else if (currentRxn === "ammonia") {
      const nh3Coeff = coefficients.NH3;
      const nh3Offsets = [
        { dx: -18, dy: 8 },
        { dx: 18, dy: 8 },
        { dx: 0, dy: -10 },
        { dx: 0, dy: 24 }
      ];
      for (let i = 0; i < nh3Coeff; i++) {
        const coords = nh3Offsets[i];
        canvas.appendChild(drawNH3(rx + coords.dx, rightCenterY + coords.dy));
      }
    }

    // 8. Balanced Success Overlay!
    if (isBalanced) {
      const gSuccess = createSVGElement("g", { transform: "translate(200, 48)" });
      gSuccess.appendChild(createSVGElement("rect", {
        x: -42, y: -10, width: 84, height: 20, rx: 3,
        fill: "var(--good-soft)", stroke: "var(--good)", "stroke-width": "var(--dia-stroke-bond)"
      }));
      const text = createSVGElement("text", {
        x: 0, y: 4.5, "text-anchor": "middle",
        fill: "var(--good)", "font-family": "var(--display)", "font-weight": "800", "font-size": "var(--dia-label-size)", "letter-spacing": "0.05em"
      });
      text.textContent = "BALANCED!";
      gSuccess.appendChild(text);
      canvas.appendChild(gSuccess);
    }
  }

  // Switch equations event listeners
  rxnWaterBtn.addEventListener("click", () => {
    rxnWaterBtn.classList.add("active");
    rxnAmmoniaBtn.classList.remove("active");
    currentRxn = "water";
    renderControls();
    updateState();
  });

  rxnAmmoniaBtn.addEventListener("click", () => {
    rxnAmmoniaBtn.classList.add("active");
    rxnWaterBtn.classList.remove("active");
    currentRxn = "ammonia";
    renderControls();
    updateState();
  });

  // Initialize
  renderControls();
  updateState();
});
