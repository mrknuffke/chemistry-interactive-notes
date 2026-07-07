document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const tabs = document.querySelectorAll("#changeTabs .tab");
  const slider = document.getElementById("changeSlider");
  const progressValue = document.getElementById("progressValue");
  const svg = document.getElementById("changeSvg");
  const tallyGrid = document.getElementById("tallyGrid");
  const changeTitle = document.getElementById("changeTitle");
  const changeText = document.getElementById("changeText");

  // State
  let activeTab = "water"; // water, salt, combust
  let progress = 0; // 0 to 100

  // Details for each state
  const changeData = {
    water: {
      title: "Water Phase Change (Physical)",
      text: "Solid ice molecules are highly organized and vibrate in fixed positions. Drag the slider to add heat and watch them slide into liquid water, and then boil into escaping gaseous steam. In all three phases, the individual H<sub>2</sub>O molecules remain completely intact."
    },
    salt: {
      title: "Dissolving Salt (Physical / Dissolution)",
      text: "Solid sodium chloride (NaCl) consists of an alternating ionic crystal lattice. As it dissolves, polar water molecules orient their charges (partial negative Oxygen toward Na⁺, partial positive Hydrogen toward Cl⁻), pulling them away into solution as hydrated ions."
    },
    combust: {
      title: "Methane Combustion (Chemical)",
      text: "Methane (CH<sub>4</sub>) and Oxygen (O<sub>2</sub>) react under heat. The reactant molecules collide, breaking their covalent bonds, and rearrange to form Carbon Dioxide (CO<sub>2</sub>) and Water (H<sub>2</sub>O) products. Total mass is perfectly conserved, but the substances are entirely new."
    }
  };

  // Set up SVG namespace helper
  const svgNS = "http://www.w3.org/2000/svg";
  function createSVGElement(tag, attrs) {
    const el = document.createElementNS(svgNS, tag);
    for (let k in attrs) {
      // font-size as a bare presentation attribute silently ignores var() and
      // falls back to the inherited page font-size -- must go through style.
      if (k === "font-size") el.style.fontSize = attrs[k];
      else el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  // Linear interpolation helper
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  // Interpolate point helper
  function lerpPoint(p1, p2, amt) {
    return {
      x: lerp(p1.x, p2.x, amt),
      y: lerp(p1.y, p2.y, amt)
    };
  }

  // Draw water molecule helper (bent geometry)
  function drawWater(cx, cy, angle, scale = 1, opacity = 1) {
    const group = createSVGElement("g", { style: `opacity: ${opacity}` });
    
    // Oxygen (Red)
    const ox = createSVGElement("circle", {
      cx: cx,
      cy: cy,
      r: 6.5 * scale,
      fill: "var(--accent)",
      stroke: "var(--ink)",
      "stroke-width": 1.1
    });
    group.appendChild(ox);

    // Calculate Hydrogen offsets based on angle
    const r_oh = 5.2 * scale;
    const a1 = angle - 52 * Math.PI / 180;
    const a2 = angle + 52 * Math.PI / 180;

    const h1x = cx + r_oh * Math.cos(a1);
    const h1y = cy + r_oh * Math.sin(a1);
    const h2x = cx + r_oh * Math.cos(a2);
    const h2y = cy + r_oh * Math.sin(a2);

    // Hydrogens (White)
    const h1 = createSVGElement("circle", {
      cx: h1x,
      cy: h1y,
      r: 3.5 * scale,
      fill: "#fff",
      stroke: "var(--ink)",
      "stroke-width": 0.9
    });
    const h2 = createSVGElement("circle", {
      cx: h2x,
      cy: h2y,
      r: 3.5 * scale,
      fill: "#fff",
      stroke: "var(--ink)",
      "stroke-width": 0.9
    });
    group.appendChild(h1);
    group.appendChild(h2);

    return group;
  }

  // Draw methane molecule helper (tetrahedral planar projection)
  function drawMethane(cx, cy, opacity = 1) {
    const group = createSVGElement("g", { style: `opacity: ${opacity}` });
    
    // Carbon (Grey/Ink-mute)
    const carbon = createSVGElement("circle", {
      cx: cx,
      cy: cy,
      r: 'var(--dia-r-atom)',
      fill: "var(--ink-mute)",
      stroke: "var(--ink)",
      "stroke-width": 'var(--dia-stroke-bond)'
    });

    // 4 Hydrogens (White) in tetrahedral cross
    const offsets = [
      { dx: 0, dy: -8 },
      { dx: 8, dy: 3 },
      { dx: -5, dy: 7 },
      { dx: -7, dy: -3 }
    ];

    offsets.forEach(off => {
      const line = createSVGElement("line", {
        x1: cx,
        y1: cy,
        x2: cx + off.dx,
        y2: cy + off.dy,
        stroke: "var(--ink)",
        "stroke-width": 0.8
      });
      group.appendChild(line);
    });

    group.appendChild(carbon);

    offsets.forEach(off => {
      const h = createSVGElement("circle", {
        cx: cx + off.dx,
        cy: cy + off.dy,
        r: 'var(--dia-r-atom-sm)',
        fill: "#fff",
        stroke: "var(--ink)",
        "stroke-width": 'var(--dia-stroke)'
      });
      group.appendChild(h);
    });

    return group;
  }

  // Draw Oxygen molecule (O2 pair)
  function drawOxygenMolecule(cx, cy, angle, opacity = 1) {
    const group = createSVGElement("g", { style: `opacity: ${opacity}` });
    const dx = 5.2 * Math.cos(angle);
    const dy = 5.2 * Math.sin(angle);

    const o1 = createSVGElement("circle", {
      cx: cx - dx,
      cy: cy - dy,
      r: 6.2,
      fill: "var(--accent)",
      stroke: "var(--ink)",
      "stroke-width": 1.1
    });
    const o2 = createSVGElement("circle", {
      cx: cx + dx,
      cy: cy + dy,
      r: 6.2,
      fill: "var(--accent)",
      stroke: "var(--ink)",
      "stroke-width": 1.1
    });

    group.appendChild(o1);
    group.appendChild(o2);
    return group;
  }

  // Draw Carbon Dioxide (CO2 linear)
  function drawCO2(cx, cy, angle, opacity = 1) {
    const group = createSVGElement("g", { style: `opacity: ${opacity}` });
    const dx = 8.5 * Math.cos(angle);
    const dy = 8.5 * Math.sin(angle);

    // Carbon (center, grey)
    const carbon = createSVGElement("circle", {
      cx: cx,
      cy: cy,
      r: 'var(--dia-r-atom)',
      fill: "var(--ink-mute)",
      stroke: "var(--ink)",
      "stroke-width": 'var(--dia-stroke-bond)'
    });

    // 2 Oxygens (red)
    const o1 = createSVGElement("circle", {
      cx: cx - dx,
      cy: cy - dy,
      r: 6.5,
      fill: "var(--accent)",
      stroke: "var(--ink)",
      "stroke-width": 1.1
    });
    const o2 = createSVGElement("circle", {
      cx: cx + dx,
      cy: cy + dy,
      r: 6.5,
      fill: "var(--accent)",
      stroke: "var(--ink)",
      "stroke-width": 1.1
    });

    group.appendChild(o1);
    group.appendChild(o2);
    group.appendChild(carbon);
    return group;
  }

  // Render function
  function render() {
    // Clear SVG
    svg.innerHTML = "";

    // Draw Beaker container
    const beaker = createSVGElement("path", {
      d: "M 110,65 L 110,210 L 290,210 L 290,65",
      fill: "none",
      stroke: "var(--ink)",
      "stroke-width": 2.5,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    });
    svg.appendChild(beaker);

    // Calculate progress fraction (0 to 1)
    const t = progress / 100;

    if (activeTab === "water") {
      renderWater(t);
    } else if (activeTab === "salt") {
      renderSalt(t);
    } else if (activeTab === "combust") {
      renderCombust(t);
    }

    renderTally();
  }

  // Water phase change rendering logic
  function renderWater(t) {
    // Solid Ice layout (9 molecules in lattice)
    const iceGrid = [
      { x: 170, y: 140, a: -Math.PI/2 },
      { x: 200, y: 140, a: -Math.PI/2 },
      { x: 230, y: 140, a: -Math.PI/2 },
      { x: 155, y: 165, a: -Math.PI/2 },
      { x: 185, y: 165, a: -Math.PI/2 },
      { x: 215, y: 165, a: -Math.PI/2 },
      { x: 245, y: 165, a: -Math.PI/2 },
      { x: 170, y: 190, a: -Math.PI/2 },
      { x: 200, y: 190, a: -Math.PI/2 },
      { x: 230, y: 190, a: -Math.PI/2 }
    ].slice(0, 9); // just 9 molecules

    // Liquid layout (loose group at bottom)
    const liquidGrid = [
      { x: 140, y: 200, a: 0.2 },
      { x: 165, y: 202, a: -0.4 },
      { x: 190, y: 203, a: 0.8 },
      { x: 215, y: 202, a: 1.4 },
      { x: 240, y: 201, a: -1.2 },
      { x: 265, y: 198, a: -0.1 },
      { x: 152, y: 180, a: 0.6 },
      { x: 180, y: 183, a: -0.8 },
      { x: 208, y: 184, a: 0.3 },
      { x: 236, y: 182, a: -1.0 }
    ].slice(0, 9);

    // Gas layout (flying apart, escaping)
    const gasGrid = [
      { x: 130, y: 160, a: 1.1, tx: -6, ty: 12 },
      { x: 165, y: 120, a: -0.6, tx: -10, ty: -10 },
      { x: 205, y: 145, a: 2.1, tx: 8, ty: 10 },
      { x: 240, y: 110, a: 0.5, tx: 10, ty: -12 },
      { x: 268, y: 165, a: -1.5, tx: 12, ty: 8 },
      // escaping gas molecules (outside or at top rim)
      { x: 145, y: 50, a: -0.2, tx: -4, ty: -15 },
      { x: 200, y: 40, a: 1.2, tx: 0, ty: -18 },
      { x: 250, y: 52, a: -0.9, tx: 4, ty: -16 },
      { x: 190, y: 12, a: 0.4, tx: -2, ty: -20 }
    ];

    // Solid brackets
    if (t < 0.33) {
      const bOpacity = 1 - (t / 0.33);
      const b1 = createSVGElement("path", {
        d: "M 135,130 L 130,130 L 130,200 L 135,200",
        fill: "none",
        stroke: "var(--ink-mute)",
        "stroke-width": 1.2,
        style: `opacity: ${bOpacity}`
      });
      const b2 = createSVGElement("path", {
        d: "M 265,130 L 270,130 L 270,200 L 265,200",
        fill: "none",
        stroke: "var(--ink-mute)",
        "stroke-width": 1.2,
        style: `opacity: ${bOpacity}`
      });
      svg.appendChild(b1);
      svg.appendChild(b2);
    }

    // Draw molecules
    for (let i = 0; i < 9; i++) {
      let cx, cy, angle;
      let motionTail = null;

      if (t <= 0.4) {
        // Solid to Liquid Transition
        const amt = t / 0.4;
        const p1 = iceGrid[i];
        const p2 = liquidGrid[i];
        
        // Add solid vibration jitter at t=0
        const jitterX = t === 0 ? (Math.random() - 0.5) * 0.8 : 0;
        const jitterY = t === 0 ? (Math.random() - 0.5) * 0.8 : 0;

        cx = lerp(p1.x, p2.x, amt) + jitterX;
        cy = lerp(p1.y, p2.y, amt) + jitterY;
        angle = lerp(p1.a, p2.a, amt);
      } else {
        // Liquid to Gas Transition
        const amt = (t - 0.4) / 0.6;
        const p1 = liquidGrid[i];
        const p2 = gasGrid[i];
        cx = lerp(p1.x, p2.x, amt);
        cy = lerp(p1.y, p2.y, amt);
        angle = lerp(p1.a, p2.a, amt);

        // Add gas motion tails (rising lines)
        if (t > 0.6) {
          const tailOpacity = (t - 0.6) / 0.4;
          const tx = p2.tx * 1.2;
          const ty = p2.ty * 1.2;
          motionTail = createSVGElement("line", {
            x1: cx - tx,
            y1: cy - ty,
            x2: cx - tx * 0.4,
            y2: cy - ty * 0.4,
            stroke: "var(--ink-mute)",
            "stroke-width": 1,
            "stroke-dasharray": "1.5 1.5",
            style: `opacity: ${tailOpacity}`
          });
        }
      }

      if (motionTail) svg.appendChild(motionTail);
      svg.appendChild(drawWater(cx, cy, angle));
    }
  }

  // Salt dissolving rendering logic
  function renderSalt(t) {
    // 9 NaCl ions (5 Na+ Purple, 4 Cl- Green)
    const solidIons = [
      { x: 175, y: 135, r: 'var(--dia-r-atom)', type: "na", fill: "var(--ink-mute)" },
      { x: 200, y: 135, r: 10.5, type: "cl", fill: "var(--accent)" },
      { x: 225, y: 135, r: 'var(--dia-r-atom)', type: "na", fill: "var(--ink-mute)" },
      { x: 175, y: 160, r: 10.5, type: "cl", fill: "var(--accent)" },
      { x: 200, y: 160, r: 'var(--dia-r-atom)', type: "na", fill: "var(--ink-mute)" },
      { x: 225, y: 160, r: 10.5, type: "cl", fill: "var(--accent)" },
      { x: 175, y: 185, r: 'var(--dia-r-atom)', type: "na", fill: "var(--ink-mute)" },
      { x: 200, y: 185, r: 10.5, type: "cl", fill: "var(--accent)" },
      { x: 225, y: 185, r: 'var(--dia-r-atom)', type: "na", fill: "var(--ink-mute)" }
    ];

    // Fully dissolved scattered locations
    const dissolvedIons = [
      { x: 135, y: 95 },
      { x: 265, y: 170 },
      { x: 260, y: 95 },
      { x: 140, y: 170 },
      { x: 200, y: 125 },
      { x: 205, y: 185 },
      { x: 135, y: 130 },
      { x: 265, y: 130 },
      { x: 200, y: 70 }
    ];

    // 8 hydration water molecules
    // At t=0, scattered. At t=1, oriented around corresponding ion indices.
    const hWaterSolid = [
      { x: 130, y: 70, a: 0.5 },
      { x: 270, y: 70, a: -1.2 },
      { x: 125, y: 110, a: 1.8 },
      { x: 275, y: 110, a: -0.3 },
      { x: 130, y: 150, a: -2.2 },
      { x: 270, y: 150, a: 0.9 },
      { x: 145, y: 195, a: 2.7 },
      { x: 255, y: 195, a: -0.5 }
    ];

    // Hydration alignments for t=1 (oriented toward nearest ion centers)
    // Positive Na+ (indices 0, 2, 4, 6, 8) attracts partial negative Oxygen (center of water, angle pointing away from ion center)
    // Negative Cl- (indices 1, 3, 5, 7) attracts partial positive Hydrogens (angle pointing directly toward ion center)
    const hWaterDissolved = [
      { x: 135 - 16, y: 95, a: Math.PI },        // Na+ (0) - Oxygen faces in, tail points left (PI)
      { x: 265 - 18, y: 170, a: 0 },             // Cl- (1) - Hydrogens face in, tail points left (0)
      { x: 260 + 16, y: 95, a: 0 },              // Na+ (2) - Oxygen faces in, tail points right (0)
      { x: 140 + 18, y: 170, a: Math.PI },       // Cl- (3) - Hydrogens face in, tail points right (PI)
      { x: 200, y: 125 + 16, a: Math.PI/2 },     // Na+ (4) - Oxygen faces in, tail points down (PI/2)
      { x: 205, y: 185 - 18, a: -Math.PI/2 },    // Cl- (5) - Hydrogens face in, tail points up (-PI/2)
      { x: 135 + 16, y: 130, a: 0 },             // Na+ (6) - Oxygen faces in, tail points right (0)
      { x: 265 + 18, y: 130, a: Math.PI }        // Cl- (7) - Hydrogens face in, tail points right (PI)
    ];

    // Render 8 hydration water molecules
    for (let i = 0; i < 8; i++) {
      const p1 = hWaterSolid[i];
      const p2 = hWaterDissolved[i];
      const cx = lerp(p1.x, p2.x, t);
      const cy = lerp(p1.y, p2.y, t);
      const angle = lerp(p1.a, p2.a, t);

      svg.appendChild(drawWater(cx, cy, angle, 0.85, 0.8));
    }

    // Render 9 Ions (Na and Cl)
    for (let i = 0; i < 9; i++) {
      const ion = solidIons[i];
      const dest = dissolvedIons[i];
      const cx = lerp(ion.x, dest.x, t);
      const cy = lerp(ion.y, dest.y, t);

      const circle = createSVGElement("circle", {
        cx: cx,
        cy: cy,
        r: ion.r,
        fill: ion.fill,
        stroke: "var(--ink)",
        "stroke-width": "var(--dia-stroke-bond)"
      });
      svg.appendChild(circle);

      // Add '+' or '-' text sign on ion
      const signText = ion.type === "na" ? "+" : "−";
      const fontSize = ion.type === "na" ? "var(--dia-label-size)" : "13px";
      const textY = ion.type === "na" ? cy + 3.5 : cy + 4.5;
      const text = createSVGElement("text", {
        x: cx,
        y: textY,
        "text-anchor": "middle",
        fill: "#fff",
        "font-family": "var(--mono)",
        "font-weight": "700",
        "font-size": fontSize
      });
      text.textContent = signText;
      svg.appendChild(text);
    }
  }

  // Methane Combustion rendering logic (CH4 + 2O2 -> CO2 + 2H2O)
  function renderCombust(t) {
    // 2 Methane molecules (CH4)
    // Starting positions: left
    const ch4Solid = [
      { x: 140, y: 110 },
      { x: 140, y: 170 }
    ];
    // Intermediate collide position (t=0.5): center
    const ch4Collide = [
      { x: 185, y: 135 },
      { x: 185, y: 145 }
    ];

    // 4 Oxygen molecules (O2)
    // Starting positions: right
    const o2Solid = [
      { x: 260, y: 100, a: 0.3 },
      { x: 260, y: 130, a: -0.6 },
      { x: 260, y: 160, a: 1.1 },
      { x: 260, y: 190, a: -0.2 }
    ];
    // Intermediate collide positions (t=0.5): center
    const o2Collide = [
      { x: 215, y: 125, a: 0.8 },
      { x: 215, y: 155, a: -0.4 },
      { x: 200, y: 130, a: 1.4 },
      { x: 200, y: 160, a: -0.9 }
    ];

    // Product positions (t=1): 2 CO2 (middle) and 4 H2O (top steam)
    const co2Final = [
      { x: 175, y: 100, a: 0 },
      { x: 225, y: 100, a: Math.PI/2 }
    ];
    const h2oFinal = [
      { x: 130, y: 35, a: -Math.PI/2 },
      { x: 175, y: 25, a: -Math.PI/2 },
      { x: 225, y: 25, a: -Math.PI/2 },
      { x: 270, y: 35, a: -Math.PI/2 }
    ];

    if (t < 0.5) {
      // PHASE 1: Reactants heading toward collision / bonds intact
      const amt = t / 0.5;

      // Draw 2 Methane molecules
      for (let i = 0; i < 2; i++) {
        const p1 = ch4Solid[i];
        const p2 = ch4Collide[i];
        const cx = lerp(p1.x, p2.x, amt);
        const cy = lerp(p1.y, p2.y, amt);
        svg.appendChild(drawMethane(cx, cy, 1 - amt * 0.4)); // fade slightly as they break
      }

      // Draw 4 Oxygen molecules
      for (let i = 0; i < 4; i++) {
        const p1 = o2Solid[i];
        const p2 = o2Collide[i];
        const cx = lerp(p1.x, p2.x, amt);
        const cy = lerp(p1.y, p2.y, amt);
        const a = lerp(p1.a, p2.a, amt);
        svg.appendChild(drawOxygenMolecule(cx, cy, a, 1 - amt * 0.4));
      }
    } else {
      // PHASE 2: Re-combining into CO2 and H2O
      const amt = (t - 0.5) / 0.5;

      // Draw transition soup state (very brief fade in of products)
      // Draw 2 CO2 molecules
      for (let i = 0; i < 2; i++) {
        const startX = 200;
        const startY = 140;
        const p2 = co2Final[i];
        const cx = lerp(startX, p2.x, amt);
        const cy = lerp(startY, p2.y, amt);
        const a = lerp(0, p2.a, amt);
        svg.appendChild(drawCO2(cx, cy, a, amt));
      }

      // Draw 4 H2O molecules
      for (let i = 0; i < 4; i++) {
        const startX = 200;
        const startY = 140;
        const p2 = h2oFinal[i];
        const cx = lerp(startX, p2.x, amt);
        const cy = lerp(startY, p2.y, amt);
        const a = lerp(-Math.PI/2, p2.a, amt);

        // Add gas steam tail
        if (amt > 0.4) {
          const tailOpacity = (amt - 0.4) / 0.6;
          const tail = createSVGElement("line", {
            x1: cx,
            y1: cy + 12,
            x2: cx,
            y2: cy + 6,
            stroke: "var(--ink-mute)",
            "stroke-width": 1,
            "stroke-dasharray": "1.5 1.5",
            style: `opacity: ${tailOpacity}`
          });
          svg.appendChild(tail);
        }

        svg.appendChild(drawWater(cx, cy, a, 0.95, amt));
      }

      // Draw reaction transition spark lines around center at start of Phase 2
      if (amt < 0.3) {
        const sparkOpacity = 1 - (amt / 0.3);
        const sparkGroup = createSVGElement("g", { style: `opacity: ${sparkOpacity}` });
        const sparks = [
          { x1: 200, y1: 140, x2: 180, y2: 120 },
          { x1: 200, y1: 140, x2: 220, y2: 120 },
          { x1: 200, y1: 140, x2: 180, y2: 160 },
          { x1: 200, y1: 140, x2: 220, y2: 160 }
        ];
        sparks.forEach(s => {
          const l = createSVGElement("line", {
            x1: s.x1,
            y1: s.y1,
            x2: s.x2,
            y2: s.y2,
            stroke: "var(--accent)",
            "stroke-width": 1.5,
            "stroke-dasharray": "2 2"
          });
          sparkGroup.appendChild(l);
        });
        svg.appendChild(sparkGroup);
      }
    }
  }

  // Populate dynamic dashboard tallies
  function renderTally() {
    tallyGrid.innerHTML = "";

    const beforeTally = {};
    const afterTally = {};

    if (activeTab === "water") {
      // 9 H2O molecules = 18 Hydrogen, 9 Oxygen
      beforeTally["Hydrogen (H)"] = 18;
      beforeTally["Oxygen (O)"] = 9;
      afterTally["Hydrogen (H)"] = 18;
      afterTally["Oxygen (O)"] = 9;
    } else if (activeTab === "salt") {
      // 5 Na+ ions, 4 Cl- ions, 8 H2O (16 H, 8 O)
      beforeTally["Sodium (Na)"] = 5;
      beforeTally["Chlorine (Cl)"] = 4;
      beforeTally["Hydrogen (H)"] = 16;
      beforeTally["Oxygen (O)"] = 8;

      afterTally["Sodium (Na)"] = 5;
      afterTally["Chlorine (Cl)"] = 4;
      afterTally["Hydrogen (H)"] = 16;
      afterTally["Oxygen (O)"] = 8;
    } else if (activeTab === "combust") {
      // 2 CH4 + 4 O2 = 2 Carbon, 8 Hydrogen, 8 Oxygen
      beforeTally["Carbon (C)"] = 2;
      beforeTally["Hydrogen (H)"] = 8;
      beforeTally["Oxygen (O)"] = 8;

      afterTally["Carbon (C)"] = 2;
      afterTally["Hydrogen (H)"] = 8;
      afterTally["Oxygen (O)"] = 8;
    }

    // Generate dashboard cards
    for (let element in beforeTally) {
      const bCount = beforeTally[element];
      const aCount = afterTally[element];
      const matchClass = bCount === aCount ? "match" : "mismatch";

      const item = document.createElement("div");
      item.className = "tally-item";
      item.innerHTML = `
        <div>${element}</div>
        <div class="tally-num ${matchClass}">${bCount} &rarr; ${aCount}</div>
      `;
      tallyGrid.appendChild(item);
    }
  }

  // Handle Tab Switch
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeTab = tab.getAttribute("data-change");

      // Reset progress
      progress = 0;
      slider.value = 0;
      progressValue.textContent = "0%";

      // Update info texts
      const data = changeData[activeTab];
      changeTitle.innerHTML = data.title;
      changeText.innerHTML = data.text;

      render();
    });
  });

  // Handle Slider Input
  slider.addEventListener("input", (e) => {
    progress = parseInt(e.target.value);
    progressValue.textContent = `${progress}%`;
    render();
  });

  // Initialize
  render();
});
