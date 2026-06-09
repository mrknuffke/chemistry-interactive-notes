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
        { num: "1 mol CH₄", den: "16.04 g CH₄", numVal: 1, denVal: 16.04, substance: "CH4", isCorrect: false },
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
    // Start unit e.g. "g H₂O" -> quantity unit "g", substance "H₂O"
    const startUnitParts = prob.startUnit.split(" ");
    const startQtyUnit = startUnitParts[0]; // "g" or "mol"
    const startSubstance = startUnitParts[1]; // "H₂O", "NaCl" etc.

    // Factor Denominator parts e.g. "18.02 g H₂O"
    const denParts = selectedFactor.den.split(" ");
    const denQtyUnit = denParts[1];
    const denSubstance = denParts[2];

    // Factor Numerator parts e.g. "1 mol H₂O"
    const numParts = selectedFactor.num.split(" ");
    const numQtyUnit = numParts[1];
    const numSubstance = numParts[2];

    // 1. Check if substance matches the problem
    if (selectedFactor.substance !== prob.factors[0].substance) {
      statusBadge.style.display = "inline-block";
      statusBadge.textContent = "Wrong Substance";
      statusBadge.className = "status-badge wrong";
      readoutTitle.textContent = "Incorrect Compound";
      readoutText.textContent = `You selected a conversion factor for ${selectedFactor.substance}, but this problem is asking about ${prob.factors[0].substance}. Make sure the compound formula in your conversion factor matches.`;
      finalResult.textContent = "?";
      nextBtn.disabled = true;
      return;
    }

    // 2. Check if units cancel correctly (Denominator cancels Starting Unit)
    if (denQtyUnit === startQtyUnit) {
      // Correct cancelation!
      startingUnitSpan.classList.add("canceled");
      slotDen.classList.add("canceled");

      // Calculate value
      const calculatedValue = prob.startVal * (selectedFactor.numVal / selectedFactor.denVal);
      // Format to matching sig figs or decimal places
      const formattedVal = calculatedValue.toFixed(2);

      finalResult.textContent = `${formattedVal} ${prob.correctUnit}`;

      statusBadge.style.display = "inline-block";
      statusBadge.textContent = "Correct Setup";
      statusBadge.className = "status-badge correct";

      readoutTitle.textContent = "Setup Balanced!";
      readoutText.textContent = prob.successDesc;

      // Allow navigation to the next problem
      nextBtn.disabled = currentIdx === problems.length - 1;
    } else if (numQtyUnit === startQtyUnit) {
      // Flipped conversion factor: starting unit matches numerator
      statusBadge.style.display = "inline-block";
      statusBadge.textContent = "Wrong Orientation";
      statusBadge.className = "status-badge wrong";

      readoutTitle.textContent = "Units Don't Cancel";
      readoutText.textContent = `By placing ${startQtyUnit} in the numerator, you are multiplying them: ${startQtyUnit} × ${startQtyUnit} = ${startQtyUnit}². You must flip the card so ${startQtyUnit} is in the denominator to divide and cancel.`;
      
      finalResult.textContent = "?";
      nextBtn.disabled = true;
    } else {
      // Shouldn't happen with our set of cards, but for completeness:
      statusBadge.style.display = "inline-block";
      statusBadge.textContent = "Wrong Layout";
      statusBadge.className = "status-badge wrong";
      readoutTitle.textContent = "No Cancelation";
      readoutText.textContent = `The starting unit (${prob.startUnit}) does not match either the numerator or denominator of the card. Choose a card with the correct starting units in the denominator.`;
      finalResult.textContent = "?";
      nextBtn.disabled = true;
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
