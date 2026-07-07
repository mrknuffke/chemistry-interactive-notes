document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const presetButtons = document.getElementById("presetButtons");
  const formulaInput = document.getElementById("formulaInput");
  const calcBtn = document.getElementById("calcBtn");
  const calcTableBody = document.getElementById("calcTableBody");
  const totalMass = document.getElementById("totalMass");
  const canvas = document.getElementById("moleculeCanvas");

  // Atomic Mass Database (g/mol)
  const atomicMasses = {
    "H": { name: "Hydrogen", mass: 1.01, color: "#FFFFFF", radius: 5.5 },
    "He": { name: "Helium", mass: 4.00, color: "var(--ink-mute)", radius: 6.0 },
    "Li": { name: "Lithium", mass: 6.94, color: "var(--ink-mute)", radius: 7.0 },
    "Be": { name: "Beryllium", mass: 9.01, color: "var(--ink-mute)", radius: 7.2 },
    "B": { name: "Boron", mass: 10.81, color: "var(--ink-mute)", radius: 7.5 },
    "C": { name: "Carbon", mass: 12.01, color: "var(--ink-mute)", radius: 8.5 },
    "N": { name: "Nitrogen", mass: 14.01, color: "var(--ink-mute)", radius: 8.0 },
    "O": { name: "Oxygen", mass: 16.00, color: "var(--accent)", radius: 7.8 },
    "F": { name: "Fluorine", mass: 19.00, color: "var(--ink-mute)", radius: 7.6 },
    "Ne": { name: "Neon", mass: 20.18, color: "var(--ink-mute)", radius: 7.8 },
    "Na": { name: "Sodium", mass: 22.99, color: "var(--ink-mute)", radius: 9.2 },
    "Mg": { name: "Magnesium", mass: 24.31, color: "var(--ink-mute)", radius: 9.5 },
    "Al": { name: "Aluminum", mass: 26.98, color: "var(--ink-mute)", radius: 9.0 },
    "Si": { name: "Silicon", mass: 28.09, color: "var(--ink-mute)", radius: 8.8 },
    "P": { name: "Phosphorus", mass: 30.97, color: "var(--ink-mute)", radius: 8.5 },
    "S": { name: "Sulfur", mass: 32.06, color: "var(--ink-mute)", radius: 9.2 },
    "Cl": { name: "Chlorine", mass: 35.45, color: "var(--ink-mute)", radius: 10.5 },
    "Ar": { name: "Argon", mass: 39.95, color: "var(--ink-mute)", radius: 9.5 },
    "K": { name: "Potassium", mass: 39.10, color: "var(--ink-mute)", radius: 11.0 },
    "Ca": { name: "Calcium", mass: 40.08, color: "var(--ink-mute)", radius: 11.5 },
    "Sc": { name: "Scandium", mass: 44.96, color: "var(--ink-mute)", radius: 10.5 },
    "Ti": { name: "Titanium", mass: 47.87, color: "var(--ink-mute)", radius: 10.3 },
    "V": { name: "Vanadium", mass: 50.94, color: "var(--ink-mute)", radius: 10.2 },
    "Cr": { name: "Chromium", mass: 52.00, color: "var(--ink-mute)", radius: 10.0 },
    "Mn": { name: "Manganese", mass: 54.94, color: "var(--ink-mute)", radius: 10.0 },
    "Fe": { name: "Iron", mass: 55.85, color: "var(--ink-mute)", radius: 10.0 },
    "Co": { name: "Cobalt", mass: 58.93, color: "var(--ink-mute)", radius: 10.0 },
    "Ni": { name: "Nickel", mass: 58.69, color: "var(--ink-mute)", radius: 10.0 },
    "Cu": { name: "Copper", mass: 63.55, color: "var(--ink-mute)", radius: 10.2 },
    "Zn": { name: "Zinc", mass: 65.38, color: "var(--ink-mute)", radius: 10.0 },
    "Ga": { name: "Gallium", mass: 69.72, color: "var(--ink-mute)", radius: 9.5 },
    "Ge": { name: "Germanium", mass: 72.63, color: "var(--ink-mute)", radius: 9.3 },
    "As": { name: "Arsenic", mass: 74.92, color: "var(--ink-mute)", radius: 9.2 },
    "Se": { name: "Selenium", mass: 78.97, color: "var(--ink-mute)", radius: 9.2 },
    "Br": { name: "Bromine", mass: 79.90, color: "var(--ink-mute)", radius: 11.2 },
    "Kr": { name: "Krypton", mass: 83.80, color: "var(--ink-mute)", radius: 10.8 },
  };

  // Preset Layout Coordinates (for perfect structural sketches)
  const presetLayouts = {
    "H2O": [
      { sym: "O", x: 200, y: 100 },
      { sym: "H", x: 178, y: 82 },
      { sym: "H", x: 222, y: 82 }
    ],
    "CO2": [
      { sym: "C", x: 200, y: 100 },
      { sym: "O", x: 168, y: 100 },
      { sym: "O", x: 232, y: 100 }
    ],
    "NaCl": [
      { sym: "Na", x: 184, y: 100 },
      { sym: "Cl", x: 216, y: 100 }
    ],
    "NaHCO3": [
      { sym: "Na", x: 135, y: 100 },
      { sym: "C", x: 200, y: 100 },
      { sym: "O", x: 180, y: 82 },
      { sym: "O", x: 220, y: 82 },
      { sym: "O", x: 200, y: 124 },
      { sym: "H", x: 242, y: 82 }
    ],
    "CH4": [
      { sym: "C", x: 200, y: 100 },
      { sym: "H", x: 200, y: 76 },
      { sym: "H", x: 224, y: 108 },
      { sym: "H", x: 176, y: 112 },
      { sym: "H", x: 200, y: 124 }
    ],
    "C6H12O6": [
      // simplified ring representation
      { sym: "C", x: 180, y: 80 },
      { sym: "C", x: 220, y: 80 },
      { sym: "C", x: 240, y: 110 },
      { sym: "C", x: 220, y: 140 },
      { sym: "C", x: 180, y: 140 },
      { sym: "O", x: 160, y: 110 },
      { sym: "O", x: 155, y: 65 },
      { sym: "O", x: 245, y: 65 },
      { sym: "O", x: 270, y: 110 },
      { sym: "O", x: 245, y: 155 },
      { sym: "O", x: 155, y: 155 },
      { sym: "O", x: 200, y: 110 },
      // Hydrogens branching out
      { sym: "H", x: 180, y: 56 },
      { sym: "H", x: 220, y: 56 },
      { sym: "H", x: 256, y: 92 },
      { sym: "H", x: 236, y: 156 },
      { sym: "H", x: 164, y: 156 },
      { sym: "H", x: 144, y: 92 },
      { sym: "H", x: 138, y: 70 },
      { sym: "H", x: 262, y: 70 },
      { sym: "H", x: 284, y: 120 },
      { sym: "H", x: 256, y: 168 },
      { sym: "H", x: 144, y: 168 },
      { sym: "H", x: 200, y: 92 }
    ]
  };

  const svgNS = "http://www.w3.org/2000/svg";
  function createSVGElement(tag, attrs) {
    const el = document.createElementNS(svgNS, tag);
    for (let k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  // Parse formula supporting capitalizations, subscripts, and simple parentheses
  function parseFormula(formula) {
    formula = formula.replace(/\s+/g, "");
    
    // Parentheses bracket expander (e.g. Ca(OH)2 -> Ca(O2H2))
    const bracketRegex = /\(([^)]+)\)([0-9]*)/;
    let match;
    let limit = 10; // safety limit
    
    while ((match = bracketRegex.exec(formula)) !== null && limit > 0) {
      const inside = match[1];
      const countStr = match[2];
      const count = countStr === "" ? 1 : parseInt(countStr, 10);
      
      const parsedInside = parseFlatFormula(inside);
      if (!parsedInside) return null;
      
      let expanded = "";
      for (let sym in parsedInside) {
        expanded += sym + (parsedInside[sym] * count);
      }
      
      formula = formula.replace(match[0], expanded);
      limit--;
    }
    
    return parseFlatFormula(formula);
  }

  // Parses formula with NO brackets
  function parseFlatFormula(formula) {
    // Basic verification: must contain only symbols and numbers
    const formatTest = /^([A-Z][a-z]?[0-9]*)+$/;
    if (!formatTest.test(formula)) return null;

    const tokenRegex = /([A-Z][a-z]?)([0-9]*)/g;
    const elements = {};
    let match;
    let countLength = 0;

    while ((match = tokenRegex.exec(formula)) !== null) {
      const symbol = match[1];
      const qtyStr = match[2];
      const qty = qtyStr === "" ? 1 : parseInt(qtyStr, 10);

      elements[symbol] = (elements[symbol] || 0) + qty;
      countLength += match[0].length;
    }

    return countLength === formula.length ? elements : null;
  }

  // Main Calculation and Rendering Controller
  function calculateMolarMass(formula) {
    const parsed = parseFormula(formula);
    
    if (!parsed) {
      // Show error on table
      calcTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--accent); font-weight:600;">Invalid Formula. Try H2O or NaHCO3.</td></tr>`;
      totalMass.textContent = "— g/mol";
      
      // Clear Canvas
      canvas.innerHTML = "";
      return;
    }

    // Populate Table
    calcTableBody.innerHTML = "";
    let sum = 0;
    const atomList = []; // for SVG cluster

    for (let symbol in parsed) {
      const qty = parsed[symbol];
      const dbEntry = atomicMasses[symbol];
      const name = dbEntry ? dbEntry.name : "Unknown";
      const mass = dbEntry ? dbEntry.mass : 0;
      const subtotal = qty * mass;
      sum += subtotal;

      const tr = document.createElement("tr");
      if (!dbEntry) {
        // Unknown atom error in row
        tr.innerHTML = `
          <td style="color:var(--accent); font-weight:600;">${symbol}</td>
          <td>${qty}</td>
          <td colspan="2" style="color:var(--accent); font-style:italic;">Unknown element</td>
        `;
      } else {
        tr.innerHTML = `
          <td><b>${symbol}</b> <span style="font-size:0.68rem; color:var(--ink-mute);">${name}</span></td>
          <td>${qty}</td>
          <td>${mass.toFixed(2)}</td>
          <td style="font-weight:600; color:var(--ink);">${subtotal.toFixed(2)}</td>
        `;
      }
      calcTableBody.appendChild(tr);

      // Collect for drawing
      if (dbEntry) {
        for (let i = 0; i < qty; i++) {
          atomList.push({
            sym: symbol,
            radius: dbEntry.radius,
            color: dbEntry.color
          });
        }
      }
    }

    // Update sum
    totalMass.textContent = `${sum.toFixed(2)} g/mol`;

    // Draw molecule particle sketch
    drawMolecule(formula, atomList);
  }

  // Draws atoms clustered together as a particle
  function drawMolecule(formula, atomList) {
    canvas.innerHTML = "";

    // If it's a preset formula, we have pixel-perfect layout
    if (presetLayouts[formula]) {
      const layout = presetLayouts[formula];
      
      // Draw bonds first (so they go underneath atoms)
      drawPresetBonds(formula, layout);

      // Draw atoms
      layout.forEach(atom => {
        const dbEntry = atomicMasses[atom.sym];
        if (dbEntry) {
          const c = createSVGElement("circle", {
            cx: atom.x,
            cy: atom.y,
            r: dbEntry.radius * 1.3,
            fill: dbEntry.color,
            stroke: "var(--ink)",
            "stroke-width": 1.2
          });
          canvas.appendChild(c);

          // Atom labels (C, H, O)
          const text = createSVGElement("text", {
            x: atom.x,
            y: atom.y + 3.2,
            "text-anchor": "middle",
            fill: atom.sym === "H" ? "var(--ink)" : "#fff",
            "font-family": "var(--mono)",
            "font-size": "9px",
            "font-weight": "700"
          });
          text.textContent = atom.sym;
          canvas.appendChild(text);
        }
      });
      return;
    }

    // Procedural Clustered Layout for custom inputs
    // Central canvas coordinates: (200, 100) (box is 400x240, center is 200, 120)
    const cx = 200;
    const cy = 120;

    // Sort atoms: largest first, so center is filled with larger atoms
    atomList.sort((a, b) => b.radius - a.radius);

    const positions = [];
    
    // First atom in center
    positions.push({ x: cx, y: cy });

    // Procedural ring distribution
    let currentRing = 1;
    let placedInRing = 0;

    for (let i = 1; i < atomList.length; i++) {
      const ringCapacity = currentRing * 6;
      if (placedInRing >= ringCapacity) {
        currentRing++;
        placedInRing = 0;
      }

      const radiusOffset = currentRing * 20;
      const angle = (placedInRing / ringCapacity) * 2 * Math.PI;
      
      const x = cx + radiusOffset * Math.cos(angle) + (Math.random() - 0.5) * 5;
      const y = cy + radiusOffset * Math.sin(angle) + (Math.random() - 0.5) * 5;

      positions.push({ x: x, y: y });
      placedInRing++;
    }

    // Draw lines (bonds) connecting neighboring atoms
    for (let i = 0; i < atomList.length; i++) {
      for (let j = i + 1; j < atomList.length; j++) {
        const p1 = positions[i];
        const p2 = positions[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Connect if they are close enough
        if (dist < 38) {
          const bond = createSVGElement("line", {
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            stroke: "var(--ink-mute)",
            "stroke-width": 1.2,
            style: "opacity: 0.45"
          });
          canvas.appendChild(bond);
        }
      }
    }

    // Draw atoms
    for (let i = 0; i < atomList.length; i++) {
      const atom = atomList[i];
      const pos = positions[i];

      const c = createSVGElement("circle", {
        cx: pos.x,
        cy: pos.y,
        r: atom.radius * 1.25,
        fill: atom.color,
        stroke: "var(--ink)",
        "stroke-width": 1.2
      });
      canvas.appendChild(c);

      const label = createSVGElement("text", {
        x: pos.x,
        y: pos.y + 3.2,
        "text-anchor": "middle",
        fill: atom.sym === "H" ? "var(--ink)" : "#fff",
        "font-family": "var(--mono)",
        "font-size": "8.5px",
        "font-weight": "700"
      });
      label.textContent = atom.sym;
      canvas.appendChild(label);
    }
  }

  // Draw preset chemical bonds
  function drawPresetBonds(formula, layout) {
    if (formula === "H2O") {
      drawBond(layout[0], layout[1]);
      drawBond(layout[0], layout[2]);
    } else if (formula === "CO2") {
      // Double bonds
      drawBond(layout[0], layout[1], -2.5);
      drawBond(layout[0], layout[1], 2.5);
      drawBond(layout[0], layout[2], -2.5);
      drawBond(layout[0], layout[2], 2.5);
    } else if (formula === "NaCl") {
      drawBond(layout[0], layout[1], 0, true); // ionic electrostatic dashed line
    } else if (formula === "NaHCO3") {
      drawBond(layout[1], layout[2]); // C-O
      drawBond(layout[1], layout[3]); // C-O
      drawBond(layout[1], layout[4]); // C-O
      drawBond(layout[3], layout[5]); // O-H
      drawBond(layout[0], layout[4], 0, true); // Na+ ... O- ionic attraction
    } else if (formula === "CH4") {
      drawBond(layout[0], layout[1]);
      drawBond(layout[0], layout[2]);
      drawBond(layout[0], layout[3]);
      drawBond(layout[0], layout[4]);
    } else if (formula === "C6H12O6") {
      // ring covalent skeleton bonds
      drawBond(layout[0], layout[1]);
      drawBond(layout[1], layout[2]);
      drawBond(layout[2], layout[3]);
      drawBond(layout[3], layout[4]);
      drawBond(layout[4], layout[5]);
      drawBond(layout[5], layout[0]);

      drawBond(layout[0], layout[6]);
      drawBond(layout[1], layout[7]);
      drawBond(layout[2], layout[8]);
      drawBond(layout[3], layout[9]);
      drawBond(layout[4], layout[10]);

      drawBond(layout[6], layout[12]);
      drawBond(layout[7], layout[13]);
      drawBond(layout[8], layout[14]);
      drawBond(layout[9], layout[15]);
      drawBond(layout[10], layout[16]);
      drawBond(layout[11], layout[17]);
    }
  }

  function drawBond(a1, a2, offset = 0, isIonic = false) {
    const dx = a2.x - a1.x;
    const dy = a2.y - a1.y;
    const len = Math.sqrt(dx*dx + dy*dy);
    
    // Normal unit vectors
    const nx = -dy / len;
    const ny = dx / len;

    const line = createSVGElement("line", {
      x1: a1.x + nx * offset,
      y1: a1.y + ny * offset,
      x2: a2.x + nx * offset,
      y2: a2.y + ny * offset,
      stroke: "var(--ink-mute)",
      "stroke-width": isIonic ? 1.4 : 1.8,
      "stroke-dasharray": isIonic ? "3 3" : "none"
    });
    canvas.appendChild(line);
  }

  // Handle Preset Clicks
  presetButtons.addEventListener("click", (e) => {
    const target = e.target;
    if (target.classList.contains("chip")) {
      document.querySelectorAll("#presetButtons .chip").forEach(c => c.classList.remove("active"));
      target.classList.add("active");
      
      const formula = target.getAttribute("data-formula");
      formulaInput.value = formula;
      calculateMolarMass(formula);
    }
  });

  // Handle Calculate Button Clicks
  calcBtn.addEventListener("click", () => {
    // De-activate preset chips unless matched
    document.querySelectorAll("#presetButtons .chip").forEach(c => c.classList.remove("active"));
    const formula = formulaInput.value.trim();
    
    // Check if it matches a preset to restore chip highlighting
    const match = document.querySelector(`#presetButtons .chip[data-formula="${formula}"]`);
    if (match) match.classList.add("active");

    calculateMolarMass(formula);
  });

  // Calculate on pressing Enter in input field
  formulaInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      calcBtn.click();
    }
  });

  // Initialize
  calculateMolarMass("H2O");
});
