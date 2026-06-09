document.addEventListener("DOMContentLoaded", () => {
  const fatSatBtn = document.getElementById("fatSat");
  const fatUnsatBtn = document.getElementById("fatUnsat");
  const tempInput = document.getElementById("tempInput");
  const tempVal = document.getElementById("tempVal");
  const canvas = document.getElementById("simCanvas");
  const simTitle = document.getElementById("simTitle");
  const simText = document.getElementById("simText");

  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");
  const step4 = document.getElementById("step4");
  const step5 = document.getElementById("step5");
  const paragraphOutput = document.getElementById("paragraphOutput");
  const paragraphText = document.getElementById("paragraphText");
  const argStatus = document.getElementById("argStatus");

  if (!canvas) return;

  const svgNS = "http://www.w3.org/2000/svg";
  let currentFat = "saturated";
  let temperature = 20; // in °C
  let animTime = 0;
  let animFrameId = null;

  // Melting Points
  const mpSaturated = 45;
  const mpUnsaturated = 10;

  function createSVGElement(tag, attrs) {
    const el = document.createElementNS(svgNS, tag);
    for (let k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  // Draw a saturated hydrocarbon molecule path
  function getSaturatedPath(x, y, slide = 0) {
    const points = [];
    const stepX = 16;
    const stepY = 8;
    for (let i = 0; i < 9; i++) {
      const px = x + i * stepX + slide;
      const py = y + (i % 2 === 0 ? stepY : 0);
      points.push({ x: px, y: py });
    }
    return points;
  }

  // Draw an unsaturated hydrocarbon molecule path (kinked at carbon 4)
  function getUnsaturatedPath(x, y, slide = 0) {
    const points = [];
    const stepX = 16;
    const stepY = 8;
    
    // First 4 carbons are straight
    for (let i = 0; i < 4; i++) {
      const px = x + i * stepX + slide;
      const py = y + (i % 2 === 0 ? stepY : 0);
      points.push({ x: px, y: py });
    }

    // Carbons 4 to 8 are kinked at a 40-degree angle upwards
    const kinkAngle = -35 * Math.PI / 180; // 35 deg up
    let lastPt = points[points.length - 1];
    
    for (let i = 1; i < 5; i++) {
      const dist = 16;
      const localAngle = kinkAngle + (i % 2 === 0 ? 0.2 : 0);
      const px = lastPt.x + dist * Math.cos(localAngle);
      const py = lastPt.y + dist * Math.sin(localAngle);
      points.push({ x: px, y: py });
      lastPt = { x: px, y: py };
    }
    return points;
  }

  function drawFatMolecule(points, color) {
    const g = createSVGElement("g", {});
    
    // Draw bond lines
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[j = i + 1];
      
      // Highlight double bond for unsaturated fat at carbon index 3-4
      const isDouble = currentFat === "unsaturated" && i === 3;
      
      if (isDouble) {
        // Double bond lines
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        const nx = -dy / len * 2.2;
        const ny = dx / len * 2.2;

        g.appendChild(createSVGElement("line", {
          x1: p1.x + nx, y1: p1.y + ny, x2: p2.x + nx, y2: p2.y + ny,
          stroke: "var(--ink)", "stroke-width": 1.2
        }));
        g.appendChild(createSVGElement("line", {
          x1: p1.x - nx, y1: p1.y - ny, x2: p2.x - nx, y2: p2.y - ny,
          stroke: "var(--ink)", "stroke-width": 1.2
        }));
      } else {
        // Single bond line
        g.appendChild(createSVGElement("line", {
          x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
          stroke: "var(--ink-soft)", "stroke-width": 1.8
        }));
      }
    }

    // Draw Carbon spheres
    points.forEach((p, idx) => {
      const isDoubleBondCarbon = currentFat === "unsaturated" && (idx === 3 || idx === 4);
      g.appendChild(createSVGElement("circle", {
        cx: p.x, cy: p.y, r: 4.8,
        fill: isDoubleBondCarbon ? "var(--accent)" : "var(--ink-mute)",
        stroke: "var(--ink)", "stroke-width": 1
      }));
    });

    return g;
  }

  function renderSimulation() {
    canvas.innerHTML = "";
    animTime += 0.05;

    // Chamber border box
    canvas.appendChild(createSVGElement("rect", {
      x: 2, y: 2, width: 316, height: 196, rx: 6,
      fill: "none", stroke: "var(--ink)", "stroke-width": 1.5
    }));

    const mp = currentFat === "saturated" ? mpSaturated : mpUnsaturated;
    const isLiquid = temperature > mp;
    
    // Thermal vibration amplitude
    const vibAmp = (temperature * 0.08) + 0.3; 
    
    // Y-spacings and molecule count
    const numMolecules = 5;
    const positions = [];

    for (let i = 0; i < numMolecules; i++) {
      // Base y positions
      let baseY = 36 + i * (currentFat === "saturated" ? 31 : 34);
      let baseX = 45;

      // Stagger unsaturated rows slightly to reflect poor packing
      if (currentFat === "unsaturated") {
        baseX += (i % 2 === 0 ? 12 : -12);
        baseY += (i % 2 === 0 ? 4 : -4);
      }

      // 1. Calculate thermal vibration displacements
      const vibX = Math.sin(animTime * 6 + i * 2) * vibAmp;
      const vibY = Math.cos(animTime * 5 + i * 2) * vibAmp;

      // 2. Calculate liquid sliding translation
      let slideX = 0;
      if (isLiquid) {
        const speedMultiplier = (temperature - mp) * 0.05;
        slideX = Math.sin(animTime * 1.5 + i * 3) * (5 + speedMultiplier);
      }

      // Get points
      const points = currentFat === "saturated"
        ? getSaturatedPath(baseX + vibX, baseY + vibY, slideX)
        : getUnsaturatedPath(baseX + vibX, baseY + vibY, slideX);

      positions.push(points);
    }

    // 3. Draw London dispersion forces (LDF) lines between adjacent chains
    // Only draw LDF lines if molecules are close enough (weaker/fewer in liquid or unsaturated)
    if (!isLiquid) {
      for (let m = 0; m < numMolecules - 1; m++) {
        const topPts = positions[m];
        const botPts = positions[m + 1];

        // Draw dashed attraction lines between nearby carbons
        for (let i = 0; i < topPts.length; i += 2) {
          const pt1 = topPts[i];
          const pt2 = botPts[i];
          
          if (pt1 && pt2) {
            const dx = pt2.x - pt1.x;
            const dy = pt2.y - pt1.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // LDF operates at very short range
            const maxLdfDist = currentFat === "saturated" ? 38 : 42;
            if (dist < maxLdfDist) {
              const opacity = Math.max(0.1, 1 - (dist / maxLdfDist));
              canvas.appendChild(createSVGElement("line", {
                x1: pt1.x, y1: pt1.y, x2: pt2.x, y2: pt2.y,
                class: "imf-line", style: `opacity: ${opacity}; stroke: var(--accent);`
              }));
            }
          }
        }
      }
    }

    // 4. Render fat molecules
    positions.forEach(pts => {
      canvas.appendChild(drawFatMolecule(pts));
    });

    // Request next animation frame
    animFrameId = requestAnimationFrame(renderSimulation);
  }

  function updateReadout() {
    const mp = currentFat === "saturated" ? mpSaturated : mpUnsaturated;
    const isLiquid = temperature > mp;

    tempVal.textContent = `${temperature}°C`;

    if (currentFat === "saturated") {
      if (isLiquid) {
        simTitle.textContent = "Saturated Liquid (Melted)";
        simText.textContent = `At ${temperature}°C, thermal energy has broken the London dispersion forces. The straight saturated chains slide past one another in a disordered liquid state.`;
      } else {
        simTitle.textContent = "Saturated Solid";
        simText.textContent = `At ${temperature}°C, straight saturated fat chains are packed tightly together. Strong London dispersion forces (LDFs, shown in orange) hold them in a rigid solid grid.`;
      }
    } else {
      if (isLiquid) {
        simTitle.textContent = "Unsaturated Liquid";
        simText.textContent = `At ${temperature}°C, unsaturated fat chains are flowing liquids. Because the double-bond kinks pushed molecules apart, the LDF attractions were too weak to hold them solid.`;
      } else {
        simTitle.textContent = "Unsaturated Solid (Frozen)";
        simText.textContent = `At ${temperature}°C, unsaturated fat chains have finally frozen. Due to their kinks, they pack poorly with large gaps, requiring sub-room temperatures (below 10°C) to solidify.`;
      }
    }
  }

  // Slider input events
  tempInput.addEventListener("input", (e) => {
    temperature = parseInt(e.target.value);
    updateReadout();
  });

  // Toggle buttons
  fatSatBtn.addEventListener("click", () => {
    fatSatBtn.classList.add("active");
    fatUnsatBtn.classList.remove("active");
    currentFat = "saturated";
    updateReadout();
  });

  fatUnsatBtn.addEventListener("click", () => {
    fatUnsatBtn.classList.add("active");
    fatSatBtn.classList.remove("active");
    currentFat = "unsaturated";
    updateReadout();
  });

  // Start simulation loop
  renderSimulation();
  updateReadout();


  // ==========================================
  // SCIENTIFIC ARGUMENT BUILDER LOGIC
  // ==========================================
  const selects = [step1, step2, step3, step4, step5];

  function evaluateArgument() {
    let allCorrect = true;
    let anySelected = false;

    // Check each selector
    selects.forEach(sel => {
      const val = sel.value;
      if (val) anySelected = true;

      // Reset classes
      sel.classList.remove("correct-select", "wrong-select");

      if (val) {
        const isCorrect = (sel.id === "step1" && val === "sat") ||
                          (sel.id === "step2" && val === "strong") ||
                          (sel.id === "step3" && val === "mp") ||
                          (sel.id === "step4" && val === "baking") ||
                          (sel.id === "step5" && val === "trade");
        
        if (isCorrect) {
          sel.classList.add("correct-select");
        } else {
          sel.classList.add("wrong-select");
          allCorrect = false;
        }
      } else {
        allCorrect = false;
      }
    });

    // Generate output paragraph HTML
    if (!anySelected) {
      paragraphOutput.classList.remove("complete");
      paragraphText.innerHTML = "Select a statement for each step above to construct your material design argument...";
      argStatus.textContent = "Pending";
      argStatus.className = "status-badge-inline pending";
      return;
    }

    let pHTML = "";
    selects.forEach(sel => {
      const selectedOpt = sel.options[sel.selectedIndex];
      if (sel.value) {
        // Highlight correct segments in green, wrong in red
        const isCorrect = sel.classList.contains("correct-select");
        const colorClass = isCorrect ? "var(--good)" : "var(--accent)";
        pHTML += `<span style="color: ${colorClass}; font-weight: 500;">${selectedOpt.text}</span> `;
      } else {
        pHTML += `<span style="color: var(--ink-mute); font-style: italic;">[Select step ${sel.id.replace("step", "")}]</span> `;
      }
    });

    paragraphText.innerHTML = pHTML;

    // Update Status Badge
    if (allCorrect) {
      paragraphOutput.classList.add("complete");
      argStatus.textContent = "Correct!";
      argStatus.className = "status-badge-inline correct";
    } else {
      paragraphOutput.classList.remove("complete");
      argStatus.textContent = "Incomplete/Wrong";
      argStatus.className = "status-badge-inline wrong";
    }
  }

  selects.forEach(sel => {
    sel.addEventListener("change", evaluateArgument);
  });
});
