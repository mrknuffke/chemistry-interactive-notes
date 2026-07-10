document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const problemCounter = document.getElementById("problemCounter");
  const problemText = document.getElementById("problemText");
  const startingValue = document.getElementById("startingValue");
  const factorSlot = document.getElementById("factorSlot");
  const finalResult = document.getElementById("finalResult");
  const factorCards = document.getElementById("factorCards");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const readoutTitle = document.getElementById("readoutTitle");
  const readoutText = document.getElementById("readoutText");
  const statusBadge = document.getElementById("statusBadge");
  const builderCanvas = document.getElementById("builderCanvas");

  // Conversion Problems Database
  const problems = [
    {
      text: "A chemistry experiment produces a small sample of water. How many moles of water are in 36.04 grams of H₂O?",
      startVal: 36.04,
      startUnit: "g H₂O",
      targetUnit: "mol H₂O",
      correctVal: 2.00,
      correctUnit: "mol H₂O",
      factors: [
        { num: "1 mol H₂O", den: "18.02 g H₂O", numVal: 1, denVal: 18.02, substance: "H2O", isCorrect: true },
        { num: "18.02 g H₂O", den: "1 mol H₂O", numVal: 18.02, denVal: 1, substance: "H2O", isCorrect: false },
        { num: "1 mol NaCl", den: "58.44 g NaCl", numVal: 1, denVal: 58.44, substance: "NaCl", isCorrect: false },
        { num: "58.44 g NaCl", den: "1 mol NaCl", numVal: 58.44, denVal: 1, substance: "NaCl", isCorrect: false }
      ],
      successDesc: "Excellent! The unit 'g H₂O' in the denominator cancels out the starting 'g H₂O', leaving only 'mol H₂O' as the final unit. Mathematically: 36.04 × (1 / 18.02) = 2.00 moles of water."
    },
    {
      text: "For a reaction, you need to weigh out sodium chloride. How many grams of NaCl are in 2.50 moles of NaCl?",
      startVal: 2.50,
      startUnit: "mol NaCl",
      targetUnit: "g NaCl",
      correctVal: 146.10,
      correctUnit: "g NaCl",
      factors: [
        { num: "58.44 g NaCl", den: "1 mol NaCl", numVal: 58.44, denVal: 1, substance: "NaCl", isCorrect: true },
        { num: "1 mol NaCl", den: "58.44 g NaCl", numVal: 1, denVal: 58.44, substance: "NaCl", isCorrect: false },
        { num: "18.02 g H₂O", den: "1 mol H₂O", numVal: 18.02, denVal: 1, substance: "H2O", isCorrect: false },
        { num: "1 mol H₂O", den: "18.02 g H₂O", numVal: 1, denVal: 18.02, substance: "H2O", isCorrect: false }
      ],
      successDesc: "Perfect! Placing '1 mol NaCl' in the denominator cancels out the starting 'mol NaCl', leaving 'g NaCl' as the final unit. Mathematically: 2.50 × (58.44 / 1) = 146.10 grams of table salt."
    },
    {
      text: "A flask contains 88.02 grams of carbon dioxide gas. How many moles of CO₂ gas are inside the flask?",
      startVal: 88.02,
      startUnit: "g CO₂",
      targetUnit: "mol CO₂",
      correctVal: 2.00,
      correctUnit: "mol CO₂",
      factors: [
        { num: "1 mol CO₂", den: "44.01 g CO₂", numVal: 1, denVal: 44.01, substance: "CO2", isCorrect: true },
        { num: "44.01 g CO₂", den: "1 mol CO₂", numVal: 44.01, denVal: 1, substance: "CO2", isCorrect: false },
        { num: "1 mol CH₄", den: "16.04 g CH₄", numVal: 1, denVal: 16.04, substance: "CH4", isCorrect: false },
        { num: "16.04 g CH₄", den: "1 mol CH₄", numVal: 16.04, denVal: 1, substance: "CH4", isCorrect: false }
      ],
      successDesc: "Spot on! The unit 'g CO₂' in the starting value is canceled by the 'g CO₂' in the denominator, leaving 'mol CO₂'. Mathematically: 88.02 × (1 / 44.01) = 2.00 moles of CO₂."
    },
    {
      text: "A Bunsen burner combusts methane gas. How many grams of methane are in 0.50 moles of CH₄ gas?",
      startVal: 0.50,
      startUnit: "mol CH₄",
      targetUnit: "g CH₄",
      correctVal: 8.02,
      correctUnit: "g CH₄",
      factors: [
        { num: "16.04 g CH₄", den: "1 mol CH₄", numVal: 16.04, denVal: 1, substance: "CH4", isCorrect: true },
        { num: "1 mol CH₄", den: "16.04 g CH₄", numVal: 16.04, denVal: 1, substance: "CH4", isCorrect: false },
        { num: "44.01 g CO₂", den: "1 mol CO₂", numVal: 44.01, denVal: 1, substance: "CO2", isCorrect: false },
        { num: "1 mol CO₂", den: "44.01 g CO₂", numVal: 1, denVal: 44.01, substance: "CO2", isCorrect: false }
      ],
      successDesc: "Correct! The 'mol CH₄' in the denominator cancels the starting 'mol CH₄', resulting in grams of methane. Mathematically: 0.50 × (16.04 / 1) = 8.02 grams of CH₄."
    },
    {
      text: "A baking recipe requires 168.02 grams of sodium bicarbonate (NaHCO₃). How many moles of NaHCO₃ does this represent?",
      startVal: 168.02,
      startUnit: "g NaHCO₃",
      targetUnit: "mol NaHCO₃",
      correctVal: 2.00,
      correctUnit: "mol NaHCO₃",
      factors: [
        { num: "1 mol NaHCO₃", den: "84.01 g NaHCO₃", numVal: 1, denVal: 84.01, substance: "NaHCO3", isCorrect: true },
        { num: "84.01 g NaHCO₃", den: "1 mol NaHCO₃", numVal: 84.01, denVal: 1, substance: "NaHCO3", isCorrect: false },
        { num: "1 mol H₂O", den: "18.02 g H₂O", numVal: 1, denVal: 18.02, substance: "H2O", isCorrect: false },
        { num: "18.02 g H₂O", den: "1 mol H₂O", numVal: 18.02, denVal: 1, substance: "H2O", isCorrect: false }
      ],
      successDesc: "Fantastic! The starting unit 'g NaHCO₃' is canceled by the denominator unit, leaving moles. Mathematically: 168.02 × (1 / 84.01) = 2.00 moles of NaHCO₃."
    }
  ];

  let currentIdx = 0;
  let selectedFactor = null;

  function loadProblem(idx) {
    currentIdx = idx;
    selectedFactor = null;
    const prob = problems[currentIdx];

    // Update progress elements
    problemCounter.textContent = `Problem ${idx + 1} of ${problems.length}`;
    problemText.textContent = prob.text;

    // Reset setup display (uncanceled units)
    startingValue.innerHTML = `${prob.startVal} <span class="unit-text">${prob.startUnit}</span>`;
    finalResult.textContent = "?";
    
    // Clear slot
    factorSlot.className = "slot-box";
    factorSlot.innerHTML = "Click a card below to slot it here";

    // Reset feedback
    readoutTitle.textContent = "Awaiting setup...";
    readoutText.textContent = `Look for the conversion factor card that puts the starting unit (${prob.startUnit}) in the denominator so that the units cancel properly.`;
    statusBadge.style.display = "none";
    statusBadge.className = "status-badge";

    // Disable / enable navigation
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = true; // Wait for correct answer to proceed

    // Render cards
    factorCards.innerHTML = "";
    prob.factors.forEach((factor, fIdx) => {
      const card = document.createElement("div");
      card.className = "factor-card";
      card.setAttribute("data-fidx", fIdx);
      card.innerHTML = `
        <div class="fraction-block">
          <div class="num-line">${factor.num}</div>
          <div class="den-line">${factor.den}</div>
        </div>
      `;
      card.addEventListener("click", () => selectCard(fIdx));
      factorCards.appendChild(card);
    });

    drawVisualPath("initial");
  }

  function selectCard(fIdx) {
    const prob = problems[currentIdx];
    selectedFactor = prob.factors[fIdx];

    // Highlight selected card
    const cards = factorCards.querySelectorAll(".factor-card");
    cards.forEach((c, idx) => {
      if (idx === fIdx) {
        c.classList.add("selected");
      } else {
        c.classList.remove("selected");
      }
    });

    // Populate slot box
    factorSlot.className = "slot-box active";
    factorSlot.innerHTML = `
      <div class="fraction-block">
        <div class="num-line" id="slotNum">${selectedFactor.num}</div>
        <div class="den-line" id="slotDen">${selectedFactor.den}</div>
      </div>
    `;

    evaluateSetup();
  }

  function evaluateSetup() {
    if (!selectedFactor) return;

    const prob = problems[currentIdx];
    const slotNum = document.getElementById("slotNum");
    const slotDen = document.getElementById("slotDen");
    const startingUnitSpan = startingValue.querySelector(".unit-text");

    // Clear cancelation classes
    startingUnitSpan.classList.remove("canceled");
    slotNum.classList.remove("canceled");
    slotDen.classList.remove("canceled");

    // Extract unit string parts for logic checks
    const startUnitParts = prob.startUnit.split(" ");
    const startQtyUnit = startUnitParts[0]; // "g" or "mol"

    const denParts = selectedFactor.den.split(" ");
    const denQtyUnit = denParts[1];

    const numParts = selectedFactor.num.split(" ");
    const numQtyUnit = numParts[1];

    // 1. Check if substance matches the problem
    if (selectedFactor.substance !== prob.factors[0].substance) {
      statusBadge.style.display = "inline-block";
      statusBadge.textContent = "Wrong Substance";
      statusBadge.className = "status-badge wrong";
      readoutTitle.textContent = "Incorrect Compound";
      readoutText.textContent = `You selected a conversion factor for ${selectedFactor.substance}, but this problem is asking about ${prob.factors[0].substance}. Make sure the compound formula in your conversion factor matches.`;
      finalResult.textContent = "?";
      nextBtn.disabled = true;
      drawVisualPath("wrong-substance");
      return;
    }

    // 2. Check if units cancel correctly (Denominator cancels Starting Unit)
    if (denQtyUnit === startQtyUnit) {
      // Correct cancelation!
      startingUnitSpan.classList.add("canceled");
      slotDen.classList.add("canceled");

      // Calculate value
      const calculatedValue = prob.startVal * (selectedFactor.numVal / selectedFactor.denVal);
      const formattedVal = calculatedValue.toFixed(2);

      finalResult.textContent = `${formattedVal} ${prob.correctUnit}`;

      statusBadge.style.display = "inline-block";
      statusBadge.textContent = "Correct Setup";
      statusBadge.className = "status-badge correct";

      readoutTitle.textContent = "Setup Balanced!";
      readoutText.textContent = prob.successDesc;

      // Allow navigation to the next problem
      nextBtn.disabled = currentIdx === problems.length - 1;
      drawVisualPath("correct");
    } else if (numQtyUnit === startQtyUnit) {
      // Flipped conversion factor: starting unit matches numerator
      statusBadge.style.display = "inline-block";
      statusBadge.textContent = "Wrong Orientation";
      statusBadge.className = "status-badge wrong";

      readoutTitle.textContent = "Units Don't Cancel";
      readoutText.textContent = `By placing ${startQtyUnit} in the numerator, you are multiplying them: ${startQtyUnit} × ${startQtyUnit} = ${startQtyUnit}². You must flip the card so ${startQtyUnit} is in the denominator to divide and cancel.`;
      
      finalResult.textContent = "?";
      nextBtn.disabled = true;
      drawVisualPath("wrong-orientation");
    } else {
      statusBadge.style.display = "inline-block";
      statusBadge.textContent = "Wrong Layout";
      statusBadge.className = "status-badge wrong";
      readoutTitle.textContent = "No Cancelation";
      readoutText.textContent = `The starting unit (${prob.startUnit}) does not match either the numerator or denominator of the card. Choose a card with the correct starting units in the denominator.`;
      finalResult.textContent = "?";
      nextBtn.disabled = true;
      drawVisualPath("wrong-orientation");
    }
  }

  // Navigation Event Listeners
  prevBtn.addEventListener("click", () => {
    if (currentIdx > 0) loadProblem(currentIdx - 1);
  });

  nextBtn.addEventListener("click", () => {
    if (currentIdx < problems.length - 1) loadProblem(currentIdx + 1);
  });

  // SVG Drawing Helpers
  function createSVGElement(tag, attrs = {}) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (let k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  function drawVisualPath(state) {
    if (!builderCanvas) return;
    builderCanvas.innerHTML = "";

    const prob = problems[currentIdx];
    
    // Determine start and target quantities/units
    const startQty = prob.startUnit.split(" ")[0]; // "g" or "mol"
    const startSubst = prob.startUnit.split(" ")[1]; // "H₂O", "NaCl" etc.
    const targetQty = prob.correctUnit.split(" ")[0]; // "mol" or "g"
    
    // Draw Left Panel (Start State) at x=65, y=60, r=40
    const leftGroup = createSVGElement("g", { id: "left-panel" });
    const leftBg = createSVGElement("circle", {
      cx: 65, cy: 60, r: 40,
      fill: "none", stroke: "var(--hair)", "stroke-width": 1, "stroke-dasharray": "3 3"
    });
    leftGroup.appendChild(leftBg);
    
    // Draw start content
    drawSubstance(leftGroup, startSubst, startQty, 65, 60);
    
    // Label for left panel
    const leftLabel = createSVGElement("text", {
      x: 65, y: 114, "text-anchor": "middle",
      "font-family": "var(--mono)", "font-size": "9px", "font-weight": "600",
      fill: "var(--ink-soft)"
    });
    leftLabel.textContent = `${prob.startVal} ${prob.startUnit}`;
    leftGroup.appendChild(leftLabel);
    
    builderCanvas.appendChild(leftGroup);

    // Draw Right Panel (Target State) at x=295, y=60, r=40
    const rightGroup = createSVGElement("g", { id: "right-panel" });
    const rightBg = createSVGElement("circle", {
      cx: 295, cy: 60, r: 40,
      fill: "none", stroke: "var(--hair)", "stroke-width": 1, "stroke-dasharray": "3 3"
    });
    rightGroup.appendChild(rightBg);
    
    // Label for right panel
    const rightLabel = createSVGElement("text", {
      x: 295, y: 114, "text-anchor": "middle",
      "font-family": "var(--mono)", "font-size": "9px", "font-weight": "600",
      fill: "var(--ink-soft)"
    });

    if (state === "initial") {
      const qText = createSVGElement("text", {
        x: 295, y: 68, "text-anchor": "middle",
        "font-family": "var(--display)", "font-size": "24px", "font-weight": "700",
        fill: "var(--ink-mute)"
      });
      qText.textContent = "?";
      rightGroup.appendChild(qText);
      rightLabel.textContent = `? ${prob.correctUnit}`;
    } else if (state === "correct") {
      drawSubstance(rightGroup, startSubst, targetQty, 295, 60);
      rightLabel.textContent = `${prob.correctVal.toFixed(2)} ${prob.correctUnit}`;
    } else {
      const errText = createSVGElement("text", {
        x: 295, y: 68, "text-anchor": "middle",
        "font-family": "var(--display)", "font-size": "24px", "font-weight": "700",
        fill: "var(--accent)"
      });
      errText.textContent = "⚠";
      rightGroup.appendChild(errText);
      rightLabel.textContent = "Error";
    }
    rightGroup.appendChild(rightLabel);
    builderCanvas.appendChild(rightGroup);

    // Draw Middle Arrow & Factor Bridge
    const bridgeGroup = createSVGElement("g", { id: "bridge" });
    const arrow = createSVGElement("path", {
      "marker-end": "url(#bridge-arr)"
    });
    
    const arrowText = createSVGElement("text", {
      x: 180, "text-anchor": "middle",
      "font-family": "var(--mono)", "font-size": "8px"
    });
    
    const defs = createSVGElement("defs");
    const marker = createSVGElement("marker", {
      id: "bridge-arr", markerWidth: 5, markerHeight: 5,
      refX: 4, refY: 2.5, orient: "auto", viewBox: "0 0 5 5"
    });
    const markerPath = createSVGElement("path", {
      d: "M 0 0 L 5 2.5 L 0 5 z"
    });
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    builderCanvas.appendChild(defs);

    if (state === "initial") {
      arrow.setAttribute("d", "M 115,60 L 240,60");
      arrow.setAttribute("stroke", "var(--ink-mute)");
      arrow.setAttribute("stroke-width", "1.5");
      arrow.setAttribute("stroke-dasharray", "4 4");
      markerPath.setAttribute("fill", "var(--ink-mute)");
      
      arrowText.setAttribute("y", 50);
      arrowText.setAttribute("fill", "var(--ink-mute)");
      arrowText.textContent = "Select factor";
    } else if (state === "correct") {
      arrow.setAttribute("d", "M 115,60 L 240,60");
      arrow.setAttribute("stroke", "var(--good)");
      arrow.setAttribute("stroke-width", "2.5");
      markerPath.setAttribute("fill", "var(--good)");
      
      arrowText.setAttribute("y", 46);
      arrowText.setAttribute("fill", "var(--good)");
      arrowText.setAttribute("font-weight", "bold");
      
      if (selectedFactor) {
        const factorNumText = selectedFactor.num.split(" ")[0] + " " + selectedFactor.num.split(" ")[1];
        const factorDenText = selectedFactor.den.split(" ")[0] + " " + selectedFactor.den.split(" ")[1];
        arrowText.textContent = `× (${factorNumText} / ${factorDenText})`;
      }
      
      const checkBadgeBg = createSVGElement("circle", {
        cx: 180, cy: 60, r: 8,
        fill: "var(--good)"
      });
      const checkBadgeText = createSVGElement("text", {
        x: 180, y: 63, "text-anchor": "middle",
        "font-family": "var(--display)", "font-size": "10px", "font-weight": "bold",
        fill: "var(--paper)"
      });
      checkBadgeText.textContent = "✓";
      bridgeGroup.appendChild(checkBadgeBg);
      bridgeGroup.appendChild(checkBadgeText);
    } else if (state === "wrong-orientation") {
      arrow.setAttribute("d", "M 115,60 L 240,60");
      arrow.setAttribute("stroke", "var(--accent)");
      arrow.setAttribute("stroke-width", "2");
      markerPath.setAttribute("fill", "var(--accent)");
      
      arrowText.setAttribute("y", 46);
      arrowText.setAttribute("fill", "var(--accent)");
      arrowText.textContent = "Units multiply!";
      
      const subText = createSVGElement("text", {
        x: 180, y: 55, "text-anchor": "middle",
        "font-family": "var(--mono)", "font-size": "7px",
        fill: "var(--accent)"
      });
      subText.textContent = `(${startQty} × ${startQty} = ${startQty}²)`;
      bridgeGroup.appendChild(subText);
      
      const errBadgeBg = createSVGElement("circle", {
        cx: 180, cy: 60, r: 8,
        fill: "var(--accent)"
      });
      const errBadgeText = createSVGElement("text", {
        x: 180, y: 63, "text-anchor": "middle",
        "font-family": "var(--display)", "font-size": "10px", "font-weight": "bold",
        fill: "var(--paper)"
      });
      errBadgeText.textContent = "✗";
      bridgeGroup.appendChild(errBadgeBg);
      bridgeGroup.appendChild(errBadgeText);
    } else if (state === "wrong-substance") {
      arrow.setAttribute("d", "M 115,60 L 240,60");
      arrow.setAttribute("stroke", "var(--accent)");
      arrow.setAttribute("stroke-width", "2");
      markerPath.setAttribute("fill", "var(--accent)");
      
      arrowText.setAttribute("y", 50);
      arrowText.setAttribute("fill", "var(--accent)");
      arrowText.textContent = "Wrong compound!";
      
      const errBadgeBg = createSVGElement("circle", {
        cx: 180, cy: 60, r: 8,
        fill: "var(--accent)"
      });
      const errBadgeText = createSVGElement("text", {
        x: 180, y: 63, "text-anchor": "middle",
        "font-family": "var(--display)", "font-size": "10px", "font-weight": "bold",
        fill: "var(--paper)"
      });
      errBadgeText.textContent = "✗";
      bridgeGroup.appendChild(errBadgeBg);
      bridgeGroup.appendChild(errBadgeText);
    }
    
    bridgeGroup.appendChild(arrow);
    bridgeGroup.appendChild(arrowText);
    builderCanvas.appendChild(bridgeGroup);
  }

  function drawSubstance(group, substance, type, cx, cy) {
    const isWater = (substance === "H₂O" || substance === "H2O");
    const isCO2 = (substance === "CO₂" || substance === "CO2");
    const isCH4 = (substance === "CH₄" || substance === "CH4");
    const isNaHCO3 = (substance === "NaHCO₃" || substance === "NaHCO3");

    if (type === "g") {
      if (isWater) {
        const beaker = createSVGElement("path", {
          d: `M ${cx - 15},${cy - 12} L ${cx - 15},${cy + 15} L ${cx + 15},${cy + 15} L ${cx + 15},${cy - 12}`,
          fill: "none", stroke: "var(--ink)", "stroke-width": "1.5", "stroke-linecap": "round"
        });
        const spout = createSVGElement("path", {
          d: `M ${cx - 15},${cy - 12} L ${cx - 18},${cy - 12}`,
          fill: "none", stroke: "var(--ink)", "stroke-width": "1.5", "stroke-linecap": "round"
        });
        const liquid = createSVGElement("path", {
          d: `M ${cx - 15},${cy} Q ${cx - 7},${cy - 2} ${cx + 7},${cy} T ${cx + 15},${cy} L ${cx + 15},${cy + 14} L ${cx - 15},${cy + 14} Z`,
          fill: "var(--water)", opacity: "0.3"
        });
        const liquidTop = createSVGElement("path", {
          d: `M ${cx - 15},${cy} Q ${cx - 7},${cy - 2} ${cx + 7},${cy} T ${cx + 15},${cy}`,
          fill: "none", stroke: "var(--water)", "stroke-width": "1"
        });
        group.appendChild(liquid);
        group.appendChild(liquidTop);
        group.appendChild(beaker);
        group.appendChild(spout);
      } else if (substance === "NaCl") {
        const boat = createSVGElement("polygon", {
          points: `${cx - 20},${cy + 5} ${cx - 14},${cy + 18} ${cx + 14},${cy + 18} ${cx + 20},${cy + 5}`,
          fill: "none", stroke: "var(--ink)", "stroke-width": "1.2", "stroke-linejoin": "round"
        });
        const salt = createSVGElement("path", {
          d: `M ${cx - 12},${cy + 17} Q ${cx},${cy + 2} ${cx + 12},${cy + 17} Z`,
          fill: "var(--paper-2)", stroke: "var(--ink-mute)", "stroke-width": "0.8"
        });
        group.appendChild(boat);
        group.appendChild(salt);
      } else if (isCO2) {
        const flask = createSVGElement("path", {
          d: `M ${cx - 5},${cy - 15} L ${cx - 5},${cy - 6} L ${cx - 18},${cy + 18} L ${cx + 18},${cy + 18} L ${cx + 5},${cy - 6} L ${cx + 5},${cy - 15} Z`,
          fill: "none", stroke: "var(--ink)", "stroke-width": "1.5", "stroke-linejoin": "round"
        });
        const cork = createSVGElement("rect", {
          x: cx - 4, y: cy - 18, width: 8, height: 4,
          fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": "0.8"
        });
        group.appendChild(flask);
        group.appendChild(cork);
      } else if (isCH4) {
        const burner = createSVGElement("path", {
          d: `M ${cx - 3},${cy + 18} L ${cx - 3},${cy + 5} L ${cx + 3},${cy + 5} L ${cx + 3},${cy + 18}`,
          fill: "var(--ink-mute)", stroke: "var(--ink)", "stroke-width": "1.2"
        });
        const base = createSVGElement("path", {
          d: `M ${cx - 8},${cy + 18} L ${cx + 8},${cy + 18}`,
          stroke: "var(--ink)", "stroke-width": "2"
        });
        const flame = createSVGElement("path", {
          d: `M ${cx},${cy - 14} Q ${cx - 6},${cy - 2} ${cx},${cy + 4} Q ${cx + 6},${cy - 2} ${cx},${cy - 14} Z`,
          fill: "var(--water)", opacity: "0.6", stroke: "var(--water)", "stroke-width": "1"
        });
        group.appendChild(burner);
        group.appendChild(base);
        group.appendChild(flame);
      } else if (isNaHCO3) {
        const dish = createSVGElement("path", {
          d: `M ${cx - 20},${cy + 8} Q ${cx},${cy + 18} ${cx + 20},${cy + 8}`,
          fill: "none", stroke: "var(--ink)", "stroke-width": "1.2"
        });
        const powder = createSVGElement("path", {
          d: `M ${cx - 15},${cy + 12} Q ${cx},${cy + 2} ${cx + 15},${cy + 12} Z`,
          fill: "var(--paper-2)", stroke: "var(--ink-mute)", "stroke-width": "0.8"
        });
        group.appendChild(dish);
        group.appendChild(powder);
      }
    } else {
      if (isWater) {
        const molPos = [
          { x: cx - 10, y: cy - 10 },
          { x: cx + 10, y: cy - 10 },
          { x: cx - 10, y: cy + 12 },
          { x: cx + 10, y: cy + 12 }
        ];
        molPos.forEach(pos => {
          const ox = createSVGElement("circle", {
            cx: pos.x, cy: pos.y, r: 4,
            fill: "var(--accent)"
          });
          const h1 = createSVGElement("circle", {
            cx: pos.x - 3.8, cy: pos.y + 3.8, r: 2.2,
            fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": "0.6"
          });
          const h2 = createSVGElement("circle", {
            cx: pos.x + 3.8, cy: pos.y + 3.8, r: 2.2,
            fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": "0.6"
          });
          const b1 = createSVGElement("line", {
            x1: pos.x, y1: pos.y, x2: pos.x - 3.8, y2: pos.y + 3.8,
            stroke: "var(--ink)", "stroke-width": "0.8"
          });
          const b2 = createSVGElement("line", {
            x1: pos.x, y1: pos.y, x2: pos.x + 3.8, y2: pos.y + 3.8,
            stroke: "var(--ink)", "stroke-width": "0.8"
          });
          group.appendChild(b1);
          group.appendChild(b2);
          group.appendChild(ox);
          group.appendChild(h1);
          group.appendChild(h2);
        });
      } else if (substance === "NaCl") {
        const spacing = 10;
        for (let row = -1; row <= 1; row++) {
          for (let col = -1; col <= 1; col++) {
            const px = cx + col * spacing;
            const py = cy + row * spacing;
            const isCl = (row + col) % 2 !== 0;
            const ion = createSVGElement("circle", {
              cx: px, cy: py,
              r: isCl ? 4.5 : 3,
              fill: isCl ? "var(--good)" : "var(--ink-mute)",
              stroke: "var(--ink)", "stroke-width": "0.6"
            });
            group.appendChild(ion);
          }
        }
      } else if (isCO2) {
        const molPos = [
          { x: cx, y: cy - 12, rot: 0 },
          { x: cx - 11, y: cy + 4, rot: 40 },
          { x: cx + 11, y: cy + 4, rot: -40 },
          { x: cx, y: cy + 16, rot: 10 }
        ];
        molPos.forEach(pos => {
          const g = createSVGElement("g", {
            transform: `translate(${pos.x}, ${pos.y}) rotate(${pos.rot})`
          });
          const b1 = createSVGElement("line", {
            x1: -7, y1: 0, x2: 7, y2: 0,
            stroke: "var(--ink)", "stroke-width": "0.8"
          });
          const c = createSVGElement("circle", {
            cx: 0, cy: 0, r: 3.8,
            fill: "var(--ink-soft)"
          });
          const o1 = createSVGElement("circle", {
            cx: -7, cy: 0, r: 3,
            fill: "var(--accent)"
          });
          const o2 = createSVGElement("circle", {
            cx: 7, cy: 0, r: 3,
            fill: "var(--accent)"
          });
          g.appendChild(b1);
          g.appendChild(c);
          g.appendChild(o1);
          g.appendChild(o2);
          group.appendChild(g);
        });
      } else if (isCH4) {
        const molPos = [
          { x: cx - 11, y: cy - 10 },
          { x: cx + 11, y: cy - 10 },
          { x: cx - 11, y: cy + 11 },
          { x: cx + 11, y: cy + 11 }
        ];
        molPos.forEach(pos => {
          const offsets = [
            { dx: -4.5, dy: 0 }, { dx: 4.5, dy: 0 },
            { dx: 0, dy: -4.5 }, { dx: 0, dy: 4.5 }
          ];
          offsets.forEach(off => {
            const b = createSVGElement("line", {
              x1: pos.x, y1: pos.y, x2: pos.x + off.dx, y2: pos.y + off.dy,
              stroke: "var(--ink)", "stroke-width": "0.6"
            });
            group.appendChild(b);
          });
          const c = createSVGElement("circle", {
            cx: pos.x, cy: pos.y, r: 4,
            fill: "var(--ink-soft)"
          });
          group.appendChild(c);
          offsets.forEach(off => {
            const h = createSVGElement("circle", {
              cx: pos.x + off.dx, cy: pos.y + off.dy, r: 2,
              fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": "0.5"
            });
            group.appendChild(h);
          });
        });
      } else if (isNaHCO3) {
        const items = [
          { x: cx - 12, y: cy - 8, isNa: true },
          { x: cx + 12, y: cy - 8, isNa: false },
          { x: cx - 10, y: cy + 10, isNa: false },
          { x: cx + 10, y: cy + 10, isNa: true },
          { x: cx, y: cy, isNa: true }
        ];
        items.forEach(item => {
          if (item.isNa) {
            const na = createSVGElement("circle", {
              cx: item.x, cy: item.y, r: 3.5,
              fill: "var(--ink-mute)", stroke: "var(--ink)", "stroke-width": "0.8"
            });
            group.appendChild(na);
          } else {
            const c = createSVGElement("circle", {
              cx: item.x, cy: item.y, r: 2.8,
              fill: "var(--ink-soft)"
            });
            const o1 = createSVGElement("circle", {
              cx: item.x - 4, cy: item.y + 2, r: 2.5,
              fill: "var(--accent)"
            });
            const o2 = createSVGElement("circle", {
              cx: item.x + 4, cy: item.y + 2, r: 2.5,
              fill: "var(--accent)"
            });
            const o3 = createSVGElement("circle", {
              cx: item.x, cy: item.y - 4, r: 2.5,
              fill: "var(--accent)"
            });
            group.appendChild(o1);
            group.appendChild(o2);
            group.appendChild(o3);
            group.appendChild(c);
          }
        });
      }
    }
  }

  // Navigation Event Listeners
  prevBtn.addEventListener("click", () => {
    if (currentIdx > 0) loadProblem(currentIdx - 1);
  });

  nextBtn.addEventListener("click", () => {
    if (currentIdx < problems.length - 1) loadProblem(currentIdx + 1);
  });

  // Initialize
  loadProblem(0);
});
