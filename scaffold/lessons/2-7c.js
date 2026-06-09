document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const ch4Input = document.getElementById("ch4Input");
  const o2Input = document.getElementById("o2Input");
  const progressInput = document.getElementById("progressInput");

  const ch4Val = document.getElementById("ch4Val");
  const o2Val = document.getElementById("o2Val");
  const progressVal = document.getElementById("progressVal");

  const bCH4 = document.getElementById("bCH4");
  const bO2 = document.getElementById("bO2");
  
  const cCH4 = document.getElementById("cCH4");
  const cO2 = document.getElementById("cO2");
  const cCO2 = document.getElementById("cCO2");
  const cH2O = document.getElementById("cH2O");

  const aCH4 = document.getElementById("aCH4");
  const aO2 = document.getElementById("aO2");
  const aCO2 = document.getElementById("aCO2");
  const aH2O = document.getElementById("aH2O");

  const rowBefore = document.getElementById("rowBefore");
  const rowChange = document.getElementById("rowChange");
  const rowAfter = document.getElementById("rowAfter");

  const limitingAlert = document.getElementById("limitingAlert");
  const limitingReactantName = document.getElementById("limitingReactantName");

  const bcaTitle = document.getElementById("bcaTitle");
  const bcaText = document.getElementById("bcaText");
  const canvas = document.getElementById("particleCanvas");

  const svgNS = "http://www.w3.org/2000/svg";

  // Coordinates for Reaction Centers (max 8 centers)
  const centers = [
    { cx: 75, cy: 55 },
    { cx: 200, cy: 55 },
    { cx: 325, cy: 55 },
    { cx: 75, cy: 130 },
    { cx: 200, cy: 130 },
    { cx: 325, cy: 130 },
    { cx: 125, cy: 205 },
    { cx: 275, cy: 205 }
  ];

  // Coordinates for Excess slots (max 16 slots, scattered to avoid overlaps)
  const excessSlots = [
    { x: 30, y: 95 },
    { x: 135, y: 95 },
    { x: 265, y: 95 },
    { x: 370, y: 95 },
    { x: 110, y: 20 },
    { x: 290, y: 20 },
    { x: 30, y: 170 },
    { x: 370, y: 170 },
    { x: 135, y: 170 },
    { x: 265, y: 170 },
    { x: 30, y: 20 },
    { x: 370, y: 20 },
    { x: 70, y: 225 },
    { x: 330, y: 225 },
    { x: 200, y: 235 },
    { x: 200, y: 180 }
  ];

  function createSVGElement(tag, attrs) {
    const el = document.createElementNS(svgNS, tag);
    for (let k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  // Molecular drawings builders
  function drawCH4(cx, cy, opacity = 1) {
    const g = createSVGElement("g", { transform: `translate(${cx}, ${cy})`, style: `opacity: ${opacity};` });
    
    // Bond lines
    const bonds = [
      { x1: 0, y1: 0, x2: 0, y2: -12 },
      { x1: 0, y1: 0, x2: 0, y2: 12 },
      { x1: 0, y1: 0, x2: -12, y2: 0 },
      { x1: 0, y1: 0, x2: 12, y2: 0 }
    ];
    bonds.forEach(b => {
      g.appendChild(createSVGElement("line", {
        x1: b.x1, y1: b.y1, x2: b.x2, y2: b.y2,
        stroke: "var(--ink-mute)", "stroke-width": 1.2
      }));
    });

    // Carbon
    g.appendChild(createSVGElement("circle", {
      cx: 0, cy: 0, r: 8.5,
      fill: "var(--ink-mute)", stroke: "var(--ink)", "stroke-width": 1.2
    }));
    const textC = createSVGElement("text", {
      x: 0, y: 2.8, "text-anchor": "middle",
      fill: "#ffffff", "font-family": "var(--mono)", "font-size": "8px", "font-weight": "700"
    });
    textC.textContent = "C";
    g.appendChild(textC);

    // Hydrogens
    const hPos = [
      { x: 0, y: -12 }, { x: 0, y: 12 }, { x: -12, y: 0 }, { x: 12, y: 0 }
    ];
    hPos.forEach(h => {
      g.appendChild(createSVGElement("circle", {
        cx: h.x, cy: h.y, r: 4.2,
        fill: "#ffffff", stroke: "var(--ink)", "stroke-width": 1
      }));
      const textH = createSVGElement("text", {
        x: h.x, y: h.y + 2.5, "text-anchor": "middle",
        fill: "var(--ink)", "font-family": "var(--mono)", "font-size": "7px", "font-weight": "700"
      });
      textH.textContent = "H";
      g.appendChild(textH);
    });

    return g;
  }

  function drawO2(cx, cy, opacity = 1) {
    const g = createSVGElement("g", { transform: `translate(${cx}, ${cy})`, style: `opacity: ${opacity};` });
    
    // Double bond line
    g.appendChild(createSVGElement("line", {
      x1: -7, y1: -2, x2: 7, y2: -2,
      stroke: "var(--ink-mute)", "stroke-width": 1
    }));
    g.appendChild(createSVGElement("line", {
      x1: -7, y1: 2, x2: 7, y2: 2,
      stroke: "var(--ink-mute)", "stroke-width": 1
    }));

    // Oxygen spheres
    const oPos = [{ x: -7, y: 0 }, { x: 7, y: 0 }];
    oPos.forEach(o => {
      g.appendChild(createSVGElement("circle", {
        cx: o.x, cy: o.y, r: 7.2,
        fill: "var(--accent)", stroke: "var(--ink)", "stroke-width": 1.2
      }));
      const textO = createSVGElement("text", {
        x: o.x, y: o.y + 2.5, "text-anchor": "middle",
        fill: "#ffffff", "font-family": "var(--mono)", "font-size": "8px", "font-weight": "700"
      });
      textO.textContent = "O";
      g.appendChild(textO);
    });

    return g;
  }

  function drawCO2(cx, cy, opacity = 1) {
    const g = createSVGElement("g", { transform: `translate(${cx}, ${cy})`, style: `opacity: ${opacity};` });

    // Double bonds
    g.appendChild(createSVGElement("line", { x1: -14, y1: -2, x2: 0, y2: -2, stroke: "var(--ink-mute)", "stroke-width": 1 }));
    g.appendChild(createSVGElement("line", { x1: -14, y1: 2, x2: 0, y2: 2, stroke: "var(--ink-mute)", "stroke-width": 1 }));
    g.appendChild(createSVGElement("line", { x1: 0, y1: -2, x2: 14, y2: -2, stroke: "var(--ink-mute)", "stroke-width": 1 }));
    g.appendChild(createSVGElement("line", { x1: 0, y1: 2, x2: 14, y2: 2, stroke: "var(--ink-mute)", "stroke-width": 1 }));

    // Oxygens
    const atoms = [
      { x: -14, y: 0, fill: "var(--accent)", label: "O" },
      { x: 14, y: 0, fill: "var(--accent)", label: "O" },
      { x: 0, y: 0, fill: "var(--ink-mute)", label: "C" }
    ];

    atoms.forEach(a => {
      g.appendChild(createSVGElement("circle", {
        cx: a.x, cy: a.y, r: a.label === "C" ? 8.5 : 7.2,
        fill: a.fill, stroke: "var(--ink)", "stroke-width": 1.2
      }));
      const text = createSVGElement("text", {
        x: a.x, y: a.y + (a.label === "C" ? 2.8 : 2.5), "text-anchor": "middle",
        fill: "#ffffff", "font-family": "var(--mono)", "font-size": "8px", "font-weight": "700"
      });
      text.textContent = a.label;
      g.appendChild(text);
    });

    return g;
  }

  function drawH2O(cx, cy, opacity = 1) {
    const g = createSVGElement("g", { transform: `translate(${cx}, ${cy})`, style: `opacity: ${opacity};` });

    // Bonds
    g.appendChild(createSVGElement("line", { x1: 0, y1: -2, x2: -9, y2: 7, stroke: "var(--ink-mute)", "stroke-width": 1 }));
    g.appendChild(createSVGElement("line", { x1: 0, y1: -2, x2: 9, y2: 7, stroke: "var(--ink-mute)", "stroke-width": 1 }));

    // Oxygen (central, shifted up slightly)
    g.appendChild(createSVGElement("circle", {
      cx: 0, cy: -2, r: 7.2,
      fill: "var(--accent)", stroke: "var(--ink)", "stroke-width": 1.2
    }));
    const textO = createSVGElement("text", {
      x: 0, y: 0.5, "text-anchor": "middle",
      fill: "#ffffff", "font-family": "var(--mono)", "font-size": "8px", "font-weight": "700"
    });
    textO.textContent = "O";
    g.appendChild(textO);

    // Hydrogens
    const hPos = [{ x: -9, y: 7 }, { x: 9, y: 7 }];
    hPos.forEach(h => {
      g.appendChild(createSVGElement("circle", {
        cx: h.x, cy: h.y, r: 4.2,
        fill: "#ffffff", stroke: "var(--ink)", "stroke-width": 1
      }));
      const textH = createSVGElement("text", {
        x: h.x, y: h.y + 2.5, "text-anchor": "middle",
        fill: "var(--ink)", "font-family": "var(--mono)", "font-size": "7px", "font-weight": "700"
      });
      textH.textContent = "H";
      g.appendChild(textH);
    });

    return g;
  }

  function updateSimulation() {
    const I_CH4 = parseInt(ch4Input.value);
    const I_O2 = parseInt(o2Input.value);
    const progressPercent = parseInt(progressInput.value);
    const progress = progressPercent / 100;

    // Update slider label readouts
    ch4Val.textContent = `${I_CH4} mol`;
    o2Val.textContent = `${I_O2} mol`;
    progressVal.textContent = `${progressPercent}%`;

    // 1. Calculate Limiting Reactant and maximum reaction extent
    // Stoichiometry: 1 CH4 + 2 O2 -> 1 CO2 + 2 H2O
    let x_max = 0;
    let limiting = "";
    
    if (I_CH4 > 0 || I_O2 > 0) {
      const x_ch4 = I_CH4;         // CH4 can react at most I_CH4 times
      const x_o2 = I_O2 / 2;       // O2 can react at most I_O2/2 times
      
      if (x_ch4 < x_o2) {
        x_max = x_ch4;
        limiting = "CH₄";
      } else if (x_o2 < x_ch4) {
        x_max = x_o2;
        limiting = "O₂";
      } else {
        x_max = x_ch4; // exact stoichiometric ratio
        limiting = "Both (Balanced)";
      }
    }

    const x = progress * x_max;

    // 2. Compute molar accounting values
    const before = { CH4: I_CH4, O2: I_O2, CO2: 0, H2O: 0 };
    const change = { CH4: -x, O2: -2 * x, CO2: x, H2O: 2 * x };
    const after = { CH4: I_CH4 - x, O2: I_O2 - 2 * x, CO2: x, H2O: 2 * x };

    // Update table values in HTML
    bCH4.textContent = before.CH4.toFixed(2);
    bO2.textContent = before.O2.toFixed(2);

    cCH4.textContent = change.CH4 >= 0 ? `+${change.CH4.toFixed(2)}` : change.CH4.toFixed(2);
    cO2.textContent = change.O2 >= 0 ? `+${change.O2.toFixed(2)}` : change.O2.toFixed(2);
    cCO2.textContent = change.CO2 >= 0 ? `+${change.CO2.toFixed(2)}` : change.CO2.toFixed(2);
    cH2O.textContent = change.H2O >= 0 ? `+${change.H2O.toFixed(2)}` : change.H2O.toFixed(2);

    aCH4.textContent = after.CH4.toFixed(2);
    aO2.textContent = after.O2.toFixed(2);
    aCO2.textContent = after.CO2.toFixed(2);
    aH2O.textContent = after.H2O.toFixed(2);

    // Apply limiting highlight styles in Table
    rowAfter.querySelectorAll("td").forEach(c => c.className = "");
    rowBefore.querySelectorAll("td").forEach(c => { if(c.id) c.className = "input-val"; });

    if (progressPercent === 100 && I_CH4 > 0 && I_O2 > 0) {
      limitingAlert.style.display = "flex";
      limitingReactantName.textContent = limiting;
      
      if (limiting === "CH₄" || limiting === "Both (Balanced)") {
        aCH4.className = "limiting-cell";
      }
      if (limiting === "O₂" || limiting === "Both (Balanced)") {
        aO2.className = "limiting-cell";
      }
    } else {
      limitingAlert.style.display = "none";
    }

    // 3. Update Analysis Dashboard descriptions
    if (I_CH4 === 0 && I_O2 === 0) {
      bcaTitle.textContent = "Empty Chamber";
      bcaText.textContent = "Add some starting methane and oxygen using the sliders above to begin the simulation.";
    } else if (progressPercent === 0) {
      bcaTitle.textContent = "Ready to React";
      bcaText.textContent = `Reactants are mixed in the chamber. You have prepared ${I_CH4} mol of methane and ${I_O2} mol of oxygen. Slide the Progress bar to ignite the fuel.`;
    } else if (progressPercent > 0 && progressPercent < 100) {
      bcaTitle.textContent = "Reaction in Progress";
      bcaText.textContent = `Molecules are colliding! Methane and oxygen are being consumed (Change row is negative) while carbon dioxide and water molecules are being constructed (Change row is positive).`;
    } else {
      // 100% progress
      bcaTitle.textContent = "Reaction Halted";
      if (limiting === "Both (Balanced)") {
        bcaText.textContent = `Perfect combustion! Reactants were mixed in the exact 1:2 stoichiometric ratio. Both methane and oxygen are fully consumed, leaving only ${after.CO2.toFixed(2)} mol of CO₂ and ${after.H2O.toFixed(2)} mol of H₂O in the chamber.`;
      } else {
        const excessName = limiting === "CH₄" ? "Oxygen (O₂)" : "Methane (CH₄)";
        const excessAmount = limiting === "CH₄" ? after.O2 : after.CH4;
        bcaText.textContent = `The reaction has halted because the limiting reactant (${limiting}) was fully consumed. Maximum water yield is ${after.H2O.toFixed(2)} mol. There is an excess of ${excessAmount.toFixed(2)} mol of ${excessName} left over, sitting unreacted in the chamber.`;
      }
    }

    // 4. Render SVG Particle chamber
    canvas.innerHTML = "";
    
    // Chamber border box
    canvas.appendChild(createSVGElement("rect", {
      x: 2, y: 2, width: 396, height: 246, rx: 6,
      fill: "none", stroke: "var(--ink)", "stroke-width": 2
    }));

    // Generate drawing counts
    // 1 mole = 2 molecules visual representation
    const totalReactCenters = Math.min(I_CH4, Math.floor(I_O2 / 2)) * 2;
    
    // Render Reaction Centers
    for (let i = 0; i < totalReactCenters; i++) {
      const coord = centers[i];
      const eventProgress = (x * 2) - i; // progress of this specific center (0 to 1)
      
      if (eventProgress <= 0) {
        // Unreacted state: Draw reactants (1 CH4 + 2 O2)
        canvas.appendChild(drawCH4(coord.cx, coord.cy, 1));
        canvas.appendChild(drawO2(coord.cx - 24, coord.cy - 18, 1));
        canvas.appendChild(drawO2(coord.cx + 24, coord.cy + 18, 1));
      } else if (eventProgress >= 1) {
        // Reacted state: Draw products (1 CO2 + 2 H2O)
        canvas.appendChild(drawCO2(coord.cx, coord.cy, 1));
        canvas.appendChild(drawH2O(coord.cx - 24, coord.cy - 18, 1));
        canvas.appendChild(drawH2O(coord.cx + 24, coord.cy + 18, 1));
      } else {
        // Transitioning: Cross-fade reactants and products
        const rOpacity = 1 - eventProgress;
        const pOpacity = eventProgress;
        
        // Reactants fading out
        canvas.appendChild(drawCH4(coord.cx, coord.cy, rOpacity));
        canvas.appendChild(drawO2(coord.cx - 24, coord.cy - 18, rOpacity));
        canvas.appendChild(drawO2(coord.cx + 24, coord.cy + 18, rOpacity));

        // Products fading in
        canvas.appendChild(drawCO2(coord.cx, coord.cy, pOpacity));
        canvas.appendChild(drawH2O(coord.cx - 24, coord.cy - 18, pOpacity));
        canvas.appendChild(drawH2O(coord.cx + 24, coord.cy + 18, pOpacity));

        // Add a micro-flame indicator to show reaction center is active
        const flame = createSVGElement("path", {
          d: "M-6,2 Q0,-14 6,2 Q10,12 0,14 Q-10,12 -6,2 Z",
          fill: "var(--accent)", transform: `translate(${coord.cx}, ${coord.cy - 28}) scale(0.6)`,
          style: `opacity: ${Math.sin(eventProgress * Math.PI) * 0.85};`
        });
        canvas.appendChild(flame);
      }
    }

    // Render Excess Reactants
    const excessCH4 = I_CH4 * 2 - totalReactCenters;
    const excessO2 = I_O2 * 2 - 2 * totalReactCenters;

    let excessIdx = 0;
    
    // Draw excess CH4
    for (let i = 0; i < excessCH4; i++) {
      if (excessIdx < excessSlots.length) {
        const slot = excessSlots[excessIdx++];
        canvas.appendChild(drawCH4(slot.x, slot.y, 1));
      }
    }

    // Draw excess O2
    for (let i = 0; i < excessO2; i++) {
      if (excessIdx < excessSlots.length) {
        const slot = excessSlots[excessIdx++];
        canvas.appendChild(drawO2(slot.x, slot.y, 1));
      }
    }
  }

  // Event Listeners for inputs
  ch4Input.addEventListener("input", () => {
    // When inputs change, reset reaction progress to 0% to prevent confusing states
    progressInput.value = 0;
    updateSimulation();
  });

  o2Input.addEventListener("input", () => {
    progressInput.value = 0;
    updateSimulation();
  });

  progressInput.addEventListener("input", updateSimulation);

  // Initialize
  updateSimulation();
});
