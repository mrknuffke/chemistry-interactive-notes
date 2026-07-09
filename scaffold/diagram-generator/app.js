/* ============================================================
   DIAGRAM GENERATOR APP — LOGIC ENGINE
   Adheres to DIAGRAM_CONTRACT.md, CLAUDE.md, and project conventions.
   ============================================================ */

(function () {
  const SVGNS = "http://www.w3.org/2000/svg";

  // Check database availability
  if (!window.GC_ELEMENTS) {
    console.error("elements.js not loaded!");
    return;
  }
  const EL = window.GC_ELEMENTS;

  // CPK Elements Color mapping (derived from design tokens)
  const CPK_COLORS = {
    'H': { fill: "#ffffff", stroke: "var(--ink)", text: "var(--ink)", isSmall: true },
    'O': { fill: "var(--accent)", stroke: "var(--ink)", text: "#ffffff" },
    'C': { fill: "var(--ink-mute)", stroke: "var(--ink)", text: "#ffffff" },
    'N': { fill: "var(--cool)", stroke: "var(--ink)", text: "#ffffff" },
    'Cl': { fill: "var(--good)", stroke: "var(--ink)", text: "#ffffff" },
    'Na': { fill: "var(--ink-soft)", stroke: "var(--ink)", text: "#ffffff" },
    'F': { fill: "var(--accent-soft)", stroke: "var(--ink)", text: "#ffffff" },
    'S': { fill: "var(--hot)", stroke: "var(--ink)", text: "#ffffff" },
    'K': { fill: "var(--cool)", stroke: "var(--ink)", text: "#ffffff" },
    'Ca': { fill: "var(--ink-soft)", stroke: "var(--ink)", text: "#ffffff" }
  };

  const DEFAULT_CPK = { fill: "var(--ink-mute)", stroke: "var(--ink)", text: "#ffffff" };

  function getCPK(sym) {
    return CPK_COLORS[sym] || DEFAULT_CPK;
  }

  // Single source for common-name <-> formula <-> display-name lookups.
  // Previously duplicated as a name->formula map here and a separate
  // formula->display map in index.html, which could drift out of sync.
  const COMMON_NAMES = [
    { formula: 'H2O', commonName: 'water', display: 'Water (H₂O)' },
    { formula: 'NH3', commonName: 'ammonia', display: 'Ammonia (NH₃)' },
    { formula: 'CH4', commonName: 'methane', display: 'Methane (CH₄)' },
    { formula: 'CO2', commonName: 'carbon dioxide', display: 'Carbon Dioxide (CO₂)' },
    { formula: 'CO', commonName: 'carbon monoxide', display: 'Carbon Monoxide (CO)' },
    { formula: 'H2', commonName: 'hydrogen', display: 'Hydrogen (H₂)' },
    { formula: 'O2', commonName: 'oxygen', display: 'Oxygen (O₂)' },
    { formula: 'N2', commonName: 'nitrogen', display: 'Nitrogen (N₂)' },
    { formula: 'Cl2', commonName: 'chlorine', display: 'Chlorine (Cl₂)' },
    { formula: 'F2', commonName: 'fluorine', display: 'Fluorine (F₂)' },
    { formula: 'Br2', commonName: 'bromine', display: 'Bromine (Br₂)' },
    { formula: 'I2', commonName: 'iodine', display: 'Iodine (I₂)' },
    { formula: 'HF', commonName: 'hydrogen fluoride', display: 'Hydrogen Fluoride (HF)' },
    { formula: 'HCl', commonName: 'hydrogen chloride', display: 'Hydrogen Chloride (HCl)' },
    { formula: 'HBr', commonName: 'hydrogen bromide', display: 'Hydrogen Bromide (HBr)' },
    { formula: 'HI', commonName: 'hydrogen iodide', display: 'Hydrogen Iodide (HI)' },
    { formula: 'NaCl', commonName: 'sodium chloride', display: 'Sodium Chloride (NaCl)' },
    { formula: 'SO2', commonName: 'sulfur dioxide', display: 'Sulfur Dioxide (SO₂)' },
    { formula: 'SO3', commonName: 'sulfur trioxide', display: 'Sulfur Trioxide (SO₃)' },
    { formula: 'H2S', commonName: 'hydrogen sulfide', display: 'Hydrogen Sulfide (H₂S)' },
    { formula: 'CCl4', commonName: 'carbon tetrachloride', display: 'Carbon Tetrachloride (CCl₄)' },
    { formula: 'CF4', commonName: 'carbon tetrafluoride', display: 'Carbon Tetrafluoride (CF₄)' },
    { formula: 'SiO2', commonName: 'silicon dioxide', display: 'Silicon Dioxide (SiO₂)' }
  ];
  const NAME_TO_FORMULA = {};
  const FORMULA_TO_DISPLAY = {};
  COMMON_NAMES.forEach(e => {
    NAME_TO_FORMULA[e.commonName] = e.formula;
    FORMULA_TO_DISPLAY[e.formula.toLowerCase()] = e.display;
  });
  function getDisplayName(formula) {
    return FORMULA_TO_DISPLAY[(formula || "").toLowerCase()] || null;
  }

  // Predefined Coordinate Templates for Molecules
  const MOLECULE_TEMPLATES = {
    H2: {
      atoms: [
        { id: "H1", el: "H", x: -0.7, y: 0 },
        { id: "H2", el: "H", x: 0.7, y: 0 }
      ],
      bonds: [
        { a: "H1", b: "H2", order: 1 }
      ],
      lonePairs: []
    },
    HF: {
      atoms: [
        { id: "H1", el: "H", x: -0.8, y: 0 },
        { id: "F1", el: "F", x: 0.6, y: 0 }
      ],
      bonds: [
        { a: "H1", b: "F1", order: 1 }
      ],
      lonePairs: [
        { on: "F1", count: 3 }
      ]
    },
    HCl: {
      atoms: [
        { id: "H1", el: "H", x: -0.9, y: 0 },
        { id: "Cl1", el: "Cl", x: 0.5, y: 0 }
      ],
      bonds: [
        { a: "H1", b: "Cl1", order: 1 }
      ],
      lonePairs: [
        { on: "Cl1", count: 3 }
      ]
    },
    H2O: {
      atoms: [
        { id: "O1", el: "O", x: 0, y: -0.2 },
        { id: "H1", el: "H", x: -0.9, y: 0.5 },
        { id: "H2", el: "H", x: 0.9, y: 0.5 }
      ],
      bonds: [
        { a: "O1", b: "H1", order: 1 },
        { a: "O1", b: "H2", order: 1 }
      ],
      lonePairs: [
        { on: "O1", count: 2 }
      ]
    },
    NH3: {
      atoms: [
        { id: "N1", el: "N", x: 0, y: -0.2 },
        { id: "H1", el: "H", x: -1.0, y: 0.4 },
        { id: "H2", el: "H", x: 1.0, y: 0.4 },
        { id: "H3", el: "H", x: 0, y: 0.9 }
      ],
      bonds: [
        { a: "N1", b: "H1", order: 1 },
        { a: "N1", b: "H2", order: 1 },
        { a: "N1", b: "H3", order: 1 }
      ],
      lonePairs: [
        { on: "N1", count: 1 }
      ]
    },
    CH4: {
      atoms: [
        { id: "C1", el: "C", x: 0, y: 0 },
        { id: "H1", el: "H", x: -1.0, y: 0 },
        { id: "H2", el: "H", x: 1.0, y: 0 },
        { id: "H3", el: "H", x: 0, y: -1.0 },
        { id: "H4", el: "H", x: 0, y: 1.0 }
      ],
      bonds: [
        { a: "C1", b: "H1", order: 1 },
        { a: "C1", b: "H2", order: 1 },
        { a: "C1", b: "H3", order: 1 },
        { a: "C1", b: "H4", order: 1 }
      ],
      lonePairs: []
    },
    CF4: {
      atoms: [
        { id: "C1", el: "C", x: 0, y: 0 },
        { id: "F1", el: "F", x: -1.1, y: 0 },
        { id: "F2", el: "F", x: 1.1, y: 0 },
        { id: "F3", el: "F", x: 0, y: -1.1 },
        { id: "F4", el: "F", x: 0, y: 1.1 }
      ],
      bonds: [
        { a: "C1", b: "F1", order: 1 },
        { a: "C1", b: "F2", order: 1 },
        { a: "C1", b: "F3", order: 1 },
        { a: "C1", b: "F4", order: 1 }
      ],
      lonePairs: [
        { on: "F1", count: 3 },
        { on: "F2", count: 3 },
        { on: "F3", count: 3 },
        { on: "F4", count: 3 }
      ]
    },
    O2: {
      atoms: [
        { id: "O1", el: "O", x: -0.7, y: 0 },
        { id: "O2", el: "O", x: 0.7, y: 0 }
      ],
      bonds: [
        { a: "O1", b: "O2", order: 2 }
      ],
      lonePairs: [
        { on: "O1", count: 2 },
        { on: "O2", count: 2 }
      ]
    },
    N2: {
      atoms: [
        { id: "N1", el: "N", x: -0.7, y: 0 },
        { id: "N2", el: "N", x: 0.7, y: 0 }
      ],
      bonds: [
        { a: "N1", b: "N2", order: 3 }
      ],
      lonePairs: [
        { on: "N1", count: 1 },
        { on: "N2", count: 1 }
      ]
    },
    CO2: {
      atoms: [
        { id: "C1", el: "C", x: 0, y: 0 },
        { id: "O1", el: "O", x: -1.1, y: 0 },
        { id: "O2", el: "O", x: 1.1, y: 0 }
      ],
      bonds: [
        { a: "C1", b: "O1", order: 2 },
        { a: "C1", b: "O2", order: 2 }
      ],
      lonePairs: [
        { on: "O1", count: 2 },
        { on: "O2", count: 2 }
      ]
    },
    CO: {
      atoms: [
        { id: "C1", el: "C", x: -0.6, y: 0 },
        { id: "O1", el: "O", x: 0.6, y: 0 }
      ],
      bonds: [
        { a: "C1", b: "O1", order: 3 }
      ],
      lonePairs: [
        { on: "C1", count: 1 },
        { on: "O1", count: 1 }
      ]
    },
    // Ionic (metal-nonmetal): Lewis mode renders this as a Na+ [Cl]- ion
    // pair via drawIonPairMolecule and ignores bonds/lonePairs below.
    // They're kept only for ball-and-stick/space-filling mode, which still
    // draws a connecting stick between the ion pair.
    NaCl: {
      atoms: [
        { id: "Na1", el: "Na", x: -0.7, y: 0 },
        { id: "Cl1", el: "Cl", x: 0.7, y: 0 }
      ],
      bonds: [
        { a: "Na1", b: "Cl1", order: 1 }
      ],
      lonePairs: [
        { on: "Cl1", count: 4 }
      ]
    }
  };

  // Helper to create SVG elements with styling attributes handled correctly
  function createSVGElement(tag, attrs = {}) {
    const el = document.createElementNS(SVGNS, tag);
    for (const [key, val] of Object.entries(attrs)) {
      if (key === "font-size") {
        el.style.fontSize = val;
      } else {
        el.setAttribute(key, val);
      }
    }
    return el;
  }

  // ============================================================
  // CSS VARIABLE COMPILER & STANDALONE SVG / PNG EXPORT
  // ============================================================

  // Temporarily drop dark mode (if active) to read light-theme computed
  // vars, run fn synchronously with them, then restore — no visible flash
  // since no paint happens between the class toggle and its restoration.
  function withComputedStyles(useLightTheme, fn) {
    const root = document.documentElement;
    const wasDark = useLightTheme && root.classList.contains("dark");
    if (wasDark) root.classList.remove("dark");
    try {
      return fn(getComputedStyle(root));
    } finally {
      if (wasDark) root.classList.add("dark");
    }
  }

  // Clone an SVG and make it self-contained: resolve var(--...) references
  // inside attributes (SVG geometry attrs don't accept var() at all, and a
  // pasted/standalone document has no access to this page's CSS custom
  // properties either way) and embed the diagram-class styles it depends on.
  // Returns a clone that renders identically with zero external CSS.
  function prepareStandaloneSVG(svgElement, computedStyles, options = {}) {
    const clonedSvg = svgElement.cloneNode(true);

    const varNames = [
      '--paper', '--paper-2', '--paper-3', '--card', '--ink', '--ink-soft', '--ink-mute',
      '--accent', '--accent-soft', '--good', '--good-soft',
      '--nucleus', '--electron', '--shell', '--cool', '--hot', '--water',
      '--mono', '--serif', '--display'
    ];

    // Resolve var(--...) inside attributes of the cloned SVG dynamically
    const allElements = clonedSvg.querySelectorAll("*");
    allElements.forEach(el => {
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        if (attr.value.includes("var(")) {
          const match = attr.value.match(/var\(([^)]+)\)/);
          if (match) {
            const varName = match[1].trim();
            let computedVal = computedStyles.getPropertyValue(varName).trim();
            if (computedVal) {
              if (["r", "cx", "cy", "width", "height", "x", "y", "stroke-width"].includes(attr.name)) {
                computedVal = computedVal.replace(/px|em|rem/g, "");
              }
              attr.value = computedVal;
            }
          }
        }
      }
    });

    let cssVarsRule = ':root {\n';
    varNames.forEach(v => {
      let val = computedStyles.getPropertyValue(v).trim();
      if (val) {
        cssVarsRule += `  ${v}: ${val};\n`;
      }
    });
    cssVarsRule += '}\n';

    // Embed critical SVG styles
    const styles = `
      ${cssVarsRule}
      svg { ${options.transparentBg ? '' : 'background-color: ' + computedStyles.getPropertyValue('--card') + ';'} }
      .atom-shell { fill: none; stroke: var(--shell); stroke-width: 1px; }
      .atom-e { fill: var(--electron); stroke: var(--ink); stroke-width: 0.6px; }
      .atom-e-val { fill: var(--accent); stroke: var(--ink); stroke-width: 0.6px; }
      .atom-nucleus { fill: var(--nucleus); }
      .atom-nuc-label { fill: #ffffff; font-family: var(--mono); font-weight: 600; }
      .d-particle { stroke: var(--ink); stroke-width: 1.2px; }
      .d-metal { stroke: var(--ink); stroke-width: 1.2px; }
      .d-shell { fill: none; stroke: var(--shell); stroke-width: 0.8px; }
      .d-nuc { fill: var(--nucleus); }
      .d-nuc-t { fill: #fff; font-family: var(--mono); font-weight: 600; }
      .d-frame { fill: none; stroke: var(--ink-mute); stroke-width: 1.5px; stroke-dasharray: 6 4; }
      .d-wall { fill: none; stroke: var(--ink); stroke-width: 2.2px; stroke-linecap: round; stroke-linejoin: round; }
      .d-water { fill: none; stroke: var(--water); stroke-width: 1.8px; }
      .d-arrow { stroke: var(--ink); stroke-width: 1.6px; }
      .d-label { font-family: var(--display); font-weight: 600; fill: var(--ink); }
      .d-sub { font-family: var(--mono); fill: var(--ink-mute); }
      .lewis-bracket { stroke: var(--ink); stroke-width: 1.5px; fill: none; }
      .lewis-bracket-charge { font-family: var(--mono); font-weight: 600; fill: var(--ink); }
    `;

    const styleEl = createSVGElement("style");
    styleEl.textContent = styles;
    clonedSvg.insertBefore(styleEl, clonedSvg.firstChild);

    return clonedSvg;
  }

  function getViewBoxSize(svgElement) {
    const viewBox = svgElement.getAttribute("viewBox");
    let width = 400, height = 400;
    if (viewBox) {
      const parts = viewBox.split(/\s+/).map(Number);
      if (parts.length === 4) {
        width = parts[2];
        height = parts[3];
      }
    }
    return { width, height };
  }

  function downloadStandaloneSVG(svgElement, filename = 'diagram.svg', options = {}) {
    const useLightTheme = options.lightTheme !== false;
    const svgStr = withComputedStyles(useLightTheme, (computedStyles) => {
      const clonedSvg = prepareStandaloneSVG(svgElement, computedStyles, options);
      return new XMLSerializer().serializeToString(clonedSvg);
    });
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = filename;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportSVGToPNG(svgElement, filename = 'diagram.png', scale = 2, options = {}) {
    const useLightTheme = options.lightTheme !== false;
    const onError = options.onError || (() => {});

    withComputedStyles(useLightTheme, (computedStyles) => {
      const clonedSvg = prepareStandaloneSVG(svgElement, computedStyles, options);
      const { width, height } = getViewBoxSize(clonedSvg);

      // Base multiplier ensures crisp output even for small SVG viewBoxes,
      // clamped so the long edge never exceeds common browser canvas limits
      // (an uncapped multiplier can silently produce a blank download).
      const baseRes = 8;
      const maxEdge = 8192;
      const requestedScale = scale * baseRes;
      const totalScale = Math.min(requestedScale, maxEdge / Math.max(width, height));
      const canvasW = Math.round(width * totalScale);
      const canvasH = Math.round(height * totalScale);
      clonedSvg.setAttribute("width", canvasW);
      clonedSvg.setAttribute("height", canvasH);

      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(clonedSvg);
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const cardColor = computedStyles.getPropertyValue('--card') || '#F5F8F4';

      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = canvasW;
        canvas.height = canvasH;
        const ctx = canvas.getContext('2d');

        if (!options.transparentBg) {
          ctx.fillStyle = cardColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.download = filename;
        a.href = pngUrl;
        a.click();

        URL.revokeObjectURL(url);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        onError(new Error("PNG export failed to rasterize the diagram (image load error)."));
      };
      img.src = url;
    });
  }

  // ============================================================
  // BOHR DIAGRAM GENERATOR
  // ============================================================
  function calculateIonShells(e, charge) {
    let totalElectrons = e.z - charge;
    if (totalElectrons < 0) totalElectrons = 0;

    if (charge === 0) return [...e.shells];

    if (e.mainGroup) {
      let shells = [...e.shells];
      if (charge > 0) {
        let lost = charge;
        while (lost > 0 && shells.length > 0) {
          let lastIdx = shells.length - 1;
          if (shells[lastIdx] <= lost) {
            lost -= shells[lastIdx];
            shells.pop();
          } else {
            shells[lastIdx] -= lost;
            lost = 0;
          }
        }
        return shells;
      } else {
        let gain = -charge;
        let lastIdx = shells.length - 1;
        let capacity = (shells.length === 1 && e.z <= 2) ? 2 : 8;
        let space = capacity - shells[lastIdx];
        if (space > 0) {
          let fill = Math.min(space, gain);
          shells[lastIdx] += fill;
          gain -= fill;
        }
        if (gain > 0) {
          shells.push(gain);
        }
        return shells;
      }
    } else {
      let shells = [];
      let remaining = totalElectrons;
      const caps = [2, 8, 18, 32];
      for (let cap of caps) {
        if (remaining <= 0) break;
        let fill = Math.min(remaining, cap);
        shells.push(fill);
        remaining -= fill;
      }
      if (remaining > 0) {
        shells[shells.length - 1] += remaining;
      }
      return shells;
    }
  }

  function drawBohrModel(element, charge = 0, highlightValence = true) {
    const svg = createSVGElement("svg", {
      viewBox: "0 0 340 340",
      preserveAspectRatio: "xMidYMid meet"
    });

    const CX = 170, CY = 170;
    const NUC_R = 18;
    const R = [38, 74, 110, 146];

    const shells = calculateIonShells(element, charge);
    const lastShellIdx = shells.length - 1;

    // Draw bracket frame for ions
    if (charge !== 0) {
      // brackets
      svg.appendChild(createSVGElement("path", {
        d: "M 25,25 H 12 V 315 H 25 M 315,25 H 328 V 315 H 315",
        class: "lewis-bracket"
      }));
      // charge
      const chargeText = charge > 0 ? (charge === 1 ? "+" : charge + "+") : (charge === -1 ? "−" : Math.abs(charge) + "−");
      const textEl = createSVGElement("text", {
        x: 330,
        y: 28,
        class: "lewis-bracket-charge",
        "font-size": "14px"
      });
      textEl.textContent = chargeText;
      svg.appendChild(textEl);
    }

    // Draw shell rings
    shells.forEach((_, i) => {
      svg.appendChild(createSVGElement("circle", {
        cx: CX,
        cy: CY,
        r: R[i],
        class: "atom-shell"
      }));
    });

    // Draw electron dots
    shells.forEach((cnt, i) => {
      const isValence = highlightValence && element.mainGroup && (i === lastShellIdx);
      for (let k = 0; k < cnt; k++) {
        const dot = createSVGElement("circle", {
          r: "var(--dia-r-atom-sm)",
          class: isValence ? "atom-e-val" : "atom-e"
        });
        const angle = (2 * Math.PI / cnt) * k - Math.PI / 2;
        const cx = CX + R[i] * Math.cos(angle);
        const cy = CY + R[i] * Math.sin(angle);
        dot.setAttribute("cx", cx.toFixed(2));
        dot.setAttribute("cy", cy.toFixed(2));
        svg.appendChild(dot);
      }
    });

    // Draw central nucleus
    svg.appendChild(createSVGElement("circle", {
      cx: CX,
      cy: CY,
      r: NUC_R,
      class: "atom-nucleus"
    }));

    // Proton count label inside nucleus
    const label = createSVGElement("text", {
      x: CX,
      y: CY + 0.5,
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      class: "atom-nuc-label",
      "font-size": "var(--dia-label-size)"
    });
    label.textContent = element.z + "p";
    svg.appendChild(label);

    return svg;
  }

  // ============================================================
  // LEWIS DIAGRAM GENERATOR
  // ============================================================
  function drawLewisAtom(element, charge = 0, options = {}) {
    const svg = createSVGElement("svg", {
      viewBox: "0 0 150 150",
      preserveAspectRatio: "xMidYMid meet"
    });

    const CX = 75, CY = 75;

    // Draw bracket frame for ions (skipped via options.noBracket for a bare
    // cation in an ion pair, e.g. Na+, which convention writes unbracketed)
    if (charge !== 0) {
      if (!options.noBracket) {
        svg.appendChild(createSVGElement("path", {
          d: "M 42,30 H 30 V 120 H 42 M 108,30 H 120 V 120 H 108",
          class: "lewis-bracket"
        }));
      }
      const chargeText = charge > 0 ? (charge === 1 ? "+" : charge + "+") : (charge === -1 ? "−" : Math.abs(charge) + "−");
      const textEl = createSVGElement("text", {
        x: options.noBracket ? CX + 13 : 122,
        y: options.noBracket ? CY - 12 : 32,
        class: "lewis-bracket-charge",
        "font-size": "12px"
      });
      textEl.textContent = chargeText;
      svg.appendChild(textEl);
    }

    // Draw central element symbol
    let textFill = "var(--ink)";
    if (options.useCPKColors) {
      const cpk = getCPK(element.sym);
      textFill = (element.sym === "H") ? "var(--ink)" : cpk.fill;
    }
    const symText = createSVGElement("text", {
      x: CX,
      y: CY + 3.5,
      "text-anchor": "middle",
      fill: textFill,
      "font-family": "var(--mono)",
      "font-weight": "700",
      "font-size": "15px"
    });
    symText.textContent = element.sym;
    svg.appendChild(symText);

    // Calculate valence count for this atom/ion (capped between 0 and 8)
    let v = element.valence;
    if (v === null) v = 0; // default for transition metals
    if (charge !== 0 && element.mainGroup) {
      v = v - charge;
      if (v < 0) v = 0;
      if (v > 8) v = 8;
    }

    // Place dots based on valence count (Hund's rule order: Top, Right, Bottom, Left)
    const dotSpacing = 3.5;
    const dotOffset = 12;
    const dotRadius = "var(--dia-r-particle)";

    // Define coordinates of dot slots for each side
    const slots = [
      // Top
      [{ cx: CX - dotSpacing / 2, cy: CY - dotOffset }, { cx: CX + dotSpacing / 2, cy: CY - dotOffset }],
      // Right
      [{ cx: CX + dotOffset, cy: CY - dotSpacing / 2 }, { cx: CX + dotOffset, cy: CY + dotSpacing / 2 }],
      // Bottom
      [{ cx: CX - dotSpacing / 2, cy: CY + dotOffset }, { cx: CX + dotSpacing / 2, cy: CY + dotOffset }],
      // Left
      [{ cx: CX - dotOffset, cy: CY - dotSpacing / 2 }, { cx: CX - dotOffset, cy: CY + dotSpacing / 2 }]
    ];

    let sideCounts = [0, 0, 0, 0];
    for (let i = 0; i < v; i++) {
      let side = i % 4;
      sideCounts[side]++;
    }

    // Draw dots
    sideCounts.forEach((count, side) => {
      if (count === 1) {
        let cx = CX;
        let cy = CY;
        if (side === 0) cy = CY - dotOffset;
        else if (side === 1) cx = CX + dotOffset;
        else if (side === 2) cy = CY + dotOffset;
        else if (side === 3) cx = CX - dotOffset;

        svg.appendChild(createSVGElement("circle", {
          cx: cx,
          cy: cy,
          r: dotRadius,
          fill: "var(--accent)"
        }));
      } else if (count === 2) {
        slots[side].forEach(slot => {
          svg.appendChild(createSVGElement("circle", {
            cx: slot.cx,
            cy: slot.cy,
            r: dotRadius,
            fill: "var(--accent)"
          }));
        });
      }
    });

    return svg;
  }

  // Draw lone pairs helper (based on bond angles)
  function normalizeAngle(angle) {
    let a = angle % (2 * Math.PI);
    if (a < 0) a += 2 * Math.PI;
    return a;
  }

  function getLonePairAngles(bondAngles, numPairs, isCardinal = false) {
    const P = numPairs;
    if (P <= 0) return [];

    if (isCardinal) {
      if (bondAngles.length === 0) {
        if (P === 1) return [-Math.PI / 2];
        if (P === 2) return [-Math.PI / 2, Math.PI / 2];
        if (P === 3) return [0, -Math.PI / 2, Math.PI / 2];
        return [0, Math.PI / 2, Math.PI, -Math.PI / 2];
      }
      if (bondAngles.length === 1) {
        const beta = normalizeAngle(bondAngles[0]);
        if (P === 1) return [normalizeAngle(beta + Math.PI)];
        if (P === 2) return [normalizeAngle(beta + Math.PI / 2), normalizeAngle(beta - Math.PI / 2)];
        if (P === 3) return [normalizeAngle(beta + Math.PI), normalizeAngle(beta + Math.PI / 2), normalizeAngle(beta - Math.PI / 2)];
        return [normalizeAngle(beta + Math.PI), normalizeAngle(beta + Math.PI / 2), normalizeAngle(beta - Math.PI / 2), beta];
      }
      if (bondAngles.length === 2) {
        const beta1 = normalizeAngle(bondAngles[0]);
        const beta2 = normalizeAngle(bondAngles[1]);
        const slots = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
        const unused = slots.filter(s => {
          return Math.abs(normalizeAngle(s - beta1)) > 0.15 && Math.abs(normalizeAngle(s - beta2)) > 0.15;
        });
        return unused.slice(0, P);
      }
      if (bondAngles.length === 3) {
        const beta1 = normalizeAngle(bondAngles[0]);
        const beta2 = normalizeAngle(bondAngles[1]);
        const beta3 = normalizeAngle(bondAngles[2]);
        const slots = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
        const unused = slots.filter(s => {
          return Math.abs(normalizeAngle(s - beta1)) > 0.15 && 
                 Math.abs(normalizeAngle(s - beta2)) > 0.15 &&
                 Math.abs(normalizeAngle(s - beta3)) > 0.15;
        });
        return unused.slice(0, P);
      }
    }

    if (bondAngles.length === 0) {
      if (P === 1) return [-Math.PI / 2];
      if (P === 2) return [-Math.PI / 2, Math.PI / 2];
      if (P === 3) return [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];
      return [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    }

    if (bondAngles.length === 1) {
      const beta = bondAngles[0];
      const alpha = normalizeAngle(beta + Math.PI);
      if (P === 1) return [alpha];
      if (P === 2) return [alpha - 0.6, alpha + 0.6];
      if (P === 3) return [alpha - 0.75, alpha, alpha + 0.75];
      return [alpha - 0.9, alpha - 0.3, alpha + 0.3, alpha + 0.9];
    }

    const sorted = [...bondAngles].map(normalizeAngle).sort((a, b) => a - b);
    let maxGapSize = 0;
    let gapStart = 0;

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      const next = sorted[(i + 1) % sorted.length];
      let gapSize = next - current;
      if (gapSize < 0) gapSize += 2 * Math.PI;

      if (gapSize > maxGapSize) {
        maxGapSize = gapSize;
        gapStart = current;
      }
    }

    const gapMid = normalizeAngle(gapStart + maxGapSize / 2);
    const spacing = Math.min(1.5, maxGapSize / (P + 1));
    const angles = [];
    for (let k = 0; k < P; k++) {
      angles.push(normalizeAngle(gapMid + (k - (P - 1) / 2) * spacing));
    }
    return angles;
  }

  // ============================================================
  // DIPOLE & PARTIAL CHARGE RENDERER
  // ============================================================
  function renderDipoleAnnotations(svg, data, scale, padding, options = {}) {
    if (!data || !data.atoms || data.atoms.length === 0) return;

    const showCharges = options.showPartialCharges || false;
    const showBondDipoles = options.showBondDipoles || false;
    const showNetDipole = options.showNetDipole || false;

    if (!showCharges && !showBondDipoles && !showNetDipole) return;

    // 1. Resolve electronegativities from periodic list
    const atomList = data.atoms.map(a => {
      const elData = EL.bySym[a.el];
      const en = elData ? elData.en : null;
      return {
        ...a,
        en: en,
        x: a.x * scale,
        y: a.y * scale,
        radius: (a.el === "H") ? 5.0 : 7.5
      };
    });

    const atomMap = {};
    atomList.forEach(a => { atomMap[a.id] = a; });

    // Add marker defs for arrowheads if they don't exist
    let defs = svg.querySelector("defs");
    if (!defs) {
      defs = createSVGElement("defs");
      svg.insertBefore(defs, svg.firstChild);
    }

    // Create markers
    if (!defs.querySelector("#dipole-arrowhead")) {
      const marker = createSVGElement("marker", {
        id: "dipole-arrowhead",
        markerWidth: 6,
        markerHeight: 6,
        refX: 5,
        refY: 3,
        orient: "auto",
        viewBox: "0 0 6 6"
      });
      const path = createSVGElement("path", {
        d: "M0 0 L6 3 L0 6 z",
        fill: "var(--accent)"
      });
      marker.appendChild(path);
      defs.appendChild(marker);
    }

    if (!defs.querySelector("#net-dipole-arrowhead")) {
      const marker = createSVGElement("marker", {
        id: "net-dipole-arrowhead",
        markerWidth: 8,
        markerHeight: 8,
        refX: 6,
        refY: 4,
        orient: "auto",
        viewBox: "0 0 8 8"
      });
      const path = createSVGElement("path", {
        d: "M0 0 L8 4 L0 8 z",
        fill: "var(--ink-mute)",
        opacity: "0.35"
      });
      marker.appendChild(path);
      defs.appendChild(marker);
    }

    const chargeScore = {};
    atomList.forEach(a => { chargeScore[a.id] = 0; });

    let netDx = 0;
    let netDy = 0;

    // Compute molecule centroid for outward-facing dipole arrow offset
    let centroidX = 0, centroidY = 0;
    atomList.forEach(a => { centroidX += a.x; centroidY += a.y; });
    centroidX /= atomList.length;
    centroidY /= atomList.length;

    let polarBondIdx = 0;

    if (data.bonds) {
      data.bonds.forEach(bond => {
        const a = atomMap[bond.a];
        const b = atomMap[bond.b];
        if (!a || !b) return;
        if (a.en === null || b.en === null) return;

        const dEN = Math.abs(a.en - b.en);
        if (dEN >= 0.4) {
          const pos = (a.en < b.en) ? a : b;
          const neg = (a.en < b.en) ? b : a;

          chargeScore[pos.id] += 1;
          chargeScore[neg.id] -= 1;

          const dx = neg.x - pos.x;
          const dy = neg.y - pos.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;

          netDx += ux * dEN;
          netDy += uy * dEN;

          if (showBondDipoles) {
            let nx = -uy;
            let ny = ux;

            // Flip normal to always point AWAY from molecule centroid (ensures symmetry)
            const bondMidX = (pos.x + neg.x) / 2;
            const bondMidY = (pos.y + neg.y) / 2;
            const toCentroidX = centroidX - bondMidX;
            const toCentroidY = centroidY - bondMidY;
            const dot = nx * toCentroidX + ny * toCentroidY;
            if (Math.abs(dot) < 0.01) {
              // Collinear case (e.g. CO2): alternate sides for each polar bond
              if (polarBondIdx % 2 === 1) {
                nx = -nx;
                ny = -ny;
              }
            } else if (dot > 0) {
              nx = -nx;
              ny = -ny;
            }
            
            const offsetSide = 5.5;
            const startDist = pos.radius + 3;
            const endDist = neg.radius + 3;

            const x1 = pos.x + ux * startDist + nx * offsetSide;
            const y1 = pos.y + uy * startDist + ny * offsetSide;
            const x2 = neg.x - ux * endDist + nx * offsetSide;
            const y2 = neg.y - uy * endDist + ny * offsetSide;

            // Dipole tail cross
            const crossLen = 2.0;
            svg.appendChild(createSVGElement("line", {
              x1: (x1 - nx * crossLen).toFixed(1),
              y1: (y1 - ny * crossLen).toFixed(1),
              x2: (x1 + nx * crossLen).toFixed(1),
              y2: (y1 + ny * crossLen).toFixed(1),
              stroke: "var(--accent)",
              "stroke-width": 0.8
            }));

            // Dipole arrow line
            svg.appendChild(createSVGElement("line", {
              x1: x1.toFixed(1),
              y1: y1.toFixed(1),
              x2: x2.toFixed(1),
              y2: y2.toFixed(1),
              stroke: "var(--accent)",
              "stroke-width": 0.8,
              "stroke-dasharray": "3 2",
              "marker-end": "url(#dipole-arrowhead)"
            }));
            }
            polarBondIdx++;
          }
      });
    }

    // Draw partial charges (delta positive/negative)
    if (showCharges) {
      atomList.forEach(a => {
        const score = chargeScore[a.id];
        if (score === 0) return;

        const sign = score > 0 ? "+" : "−";
        // Both delta signs render in the single accent color (Golden Rule 5:
        // blue/red is reserved for sequential heat maps); the +/- sign
        // already disambiguates positive from negative partial charge.
        const color = "var(--accent)";

        let sumBx = 0;
        let sumBy = 0;
        if (data.bonds) {
          data.bonds.forEach(bond => {
            if (bond.a === a.id || bond.b === a.id) {
              const otherId = bond.a === a.id ? bond.b : bond.a;
              const other = atomMap[otherId];
              if (other) {
                const dx = other.x - a.x;
                const dy = other.y - a.y;
                const len = Math.hypot(dx, dy) || 1;
                sumBx += dx / len;
                sumBy += dy / len;
              }
            }
          });
        }

        let ux = 0;
        let uy = -1;
        const bondCount = Math.hypot(sumBx, sumBy);
        if (bondCount > 0.05) {
          ux = -sumBx / bondCount;
          uy = -sumBy / bondCount;
        }

        const offsetDist = a.radius + 9;
        const cx = a.x + ux * offsetDist;
        const cy = a.y + uy * offsetDist;

        const txt = createSVGElement("text", {
          x: cx.toFixed(1),
          y: (cy + 2.5).toFixed(1),
          "text-anchor": "middle",
          fill: color,
          "font-family": "var(--mono)",
          "font-weight": "700",
          "font-size": "5px"
        });
        txt.textContent = "δ" + sign;
        svg.appendChild(txt);
      });
    }

    // Draw Net Molecular Dipole Arrow
    const netLen = Math.hypot(netDx, netDy);
    if (showNetDipole && netLen > 0.15) {
      const ux = netDx / netLen;
      const uy = netDy / netLen;
      const nx = -uy;
      const ny = ux;

      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      atomList.forEach(a => {
        minX = Math.min(minX, a.x);
        maxX = Math.max(maxX, a.x);
        minY = Math.min(minY, a.y);
        maxY = Math.max(maxY, a.y);
      });

      let centerX, centerY;
      if (options.netDipoleOffset) {
        centerX = maxX + 22;
        centerY = (minY + maxY) / 2;
      } else {
        centerX = (minX + maxX) / 2;
        centerY = (minY + maxY) / 2;
      }

      const arrowLength = 25;
      const x1 = centerX - ux * (arrowLength / 2);
      const y1 = centerY - uy * (arrowLength / 2);
      const x2 = centerX + ux * (arrowLength / 2);
      const y2 = centerY + uy * (arrowLength / 2);

      // Tail cross segment
      const crossLen = 3.0;
      svg.appendChild(createSVGElement("line", {
        x1: (x1 - nx * crossLen).toFixed(1),
        y1: (y1 - ny * crossLen).toFixed(1),
        x2: (x1 + nx * crossLen).toFixed(1),
        y2: (y1 + ny * crossLen).toFixed(1),
        stroke: "var(--ink-mute)",
        "stroke-width": 1.1,
        opacity: "0.35"
      }));

      // Main arrow body
      svg.appendChild(createSVGElement("line", {
        x1: x1.toFixed(1),
        y1: y1.toFixed(1),
        x2: x2.toFixed(1),
        y2: y2.toFixed(1),
        stroke: "var(--ink-mute)",
        "stroke-width": 1.1,
        opacity: "0.35",
        "marker-end": "url(#net-dipole-arrowhead)"
      }));
    }
  }

  // ============================================================
  // ELECTRON DENSITY CLOUD RENDERER
  // ============================================================
  function renderElectronDensityClouds(svg, scaledAtoms, atomMap, data, options = {}) {
    if (!options.showElectronClouds) return;

    const cloudGroup = createSVGElement("g", { class: "electron-clouds" });

    // Bond clouds: elongated ellipses along each bond
    if (data.bonds) {
      data.bonds.forEach(bond => {
        const atomA = atomMap[bond.a];
        const atomB = atomMap[bond.b];
        if (!atomA || !atomB) return;

        const mx = (atomA.x + atomB.x) / 2;
        const my = (atomA.y + atomB.y) / 2;
        const dx = atomB.x - atomA.x;
        const dy = atomB.y - atomA.y;
        const bondLen = Math.hypot(dx, dy);
        if (bondLen === 0) return;

        const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
        const rx = bondLen * 0.45; // semi-major along bond
        const ry = 5.5;            // semi-minor perpendicular

        const order = bond.order || 1;
        const cloudColor = "var(--accent)";
        const cloudOpacity = order === 1 ? 0.08 : (order === 2 ? 0.12 : 0.16);

        cloudGroup.appendChild(createSVGElement("ellipse", {
          cx: mx.toFixed(1),
          cy: my.toFixed(1),
          rx: rx.toFixed(1),
          ry: ry.toFixed(1),
          transform: `rotate(${angleDeg.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)})`,
          fill: cloudColor,
          opacity: cloudOpacity.toFixed(2),
          stroke: "none"
        }));
      });
    }

    // Lone pair clouds: smaller ovals radiating outward from each atom
    if (data.lonePairs) {
      const isCardinal = (options.lewisLayout === "cardinal");

      data.lonePairs.forEach(lp => {
        const atom = atomMap[lp.on];
        if (!atom) return;

        const bondAngles = [];
        if (data.bonds) {
          data.bonds.forEach(bond => {
            let otherId = null;
            if (bond.a === atom.id) otherId = bond.b;
            else if (bond.b === atom.id) otherId = bond.a;
            if (otherId && atomMap[otherId]) {
              const other = atomMap[otherId];
              bondAngles.push(Math.atan2(other.y - atom.y, other.x - atom.x));
            }
          });
        }

        const angles = getLonePairAngles(bondAngles, lp.count, isCardinal);
        const lpCloudDist = 10;
        const lpCloudColor = "var(--cool)";

        angles.forEach(alpha => {
          const cx = atom.x + lpCloudDist * Math.cos(alpha);
          const cy = atom.y + lpCloudDist * Math.sin(alpha);
          const angleDeg = alpha * (180 / Math.PI);

          cloudGroup.appendChild(createSVGElement("ellipse", {
            cx: cx.toFixed(1),
            cy: cy.toFixed(1),
            rx: "6",
            ry: "4",
            transform: `rotate(${angleDeg.toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)})`,
            fill: lpCloudColor,
            opacity: "0.10",
            stroke: "none"
          }));
        });
      });
    }

    // Insert clouds BEHIND other elements (first child after any defs)
    const defs = svg.querySelector("defs");
    if (defs && defs.nextSibling) {
      svg.insertBefore(cloudGroup, defs.nextSibling);
    } else {
      svg.insertBefore(cloudGroup, svg.firstChild);
    }
  }

  // Metal-to-nonmetal bond = ionic (the class's framing per TODO.md §3.2:
  // H-F stays covalent despite dEN 1.78 because both are nonmetals, so
  // bonding character is keyed off element `kind`, not dEN alone).
  function isIonicPair(elSymA, elSymB) {
    const a = EL.bySym[elSymA];
    const b = EL.bySym[elSymB];
    if (!a || !b) return false;
    return (a.kind === "metal" && b.kind === "nonmetal") ||
           (a.kind === "nonmetal" && b.kind === "metal");
  }

  // Ion-pair convention: cation is bare symbol + charge (no dots, no
  // bracket); anion is bracketed with a full octet. Returns null if either
  // element lacks a defined main-group tendency (falls back to covalent path).
  function drawIonPairMolecule(data, options = {}) {
    const [atomA, atomB] = data.atoms;
    const elA = EL.bySym[atomA.el];
    const elB = EL.bySym[atomB.el];
    const [catEl, anEl] = (elA.kind === "metal") ? [elA, elB] : [elB, elA];

    const catTend = window.GC_ELEMENTS.tendency(catEl);
    const anTend = window.GC_ELEMENTS.tendency(anEl);
    if (!catTend || !anTend || catTend.dir !== "lose" || anTend.dir !== "gain") return null;

    const svg = createSVGElement("svg", {
      viewBox: "0 0 300 150",
      preserveAspectRatio: "xMidYMid meet"
    });

    const catSvg = drawLewisAtom(catEl, catTend.need, { ...options, noBracket: true });
    catSvg.setAttribute("x", "0");
    catSvg.setAttribute("y", "0");
    catSvg.setAttribute("width", "150");
    catSvg.setAttribute("height", "150");
    svg.appendChild(catSvg);

    const anSvg = drawLewisAtom(anEl, -anTend.need, options);
    anSvg.setAttribute("x", "150");
    anSvg.setAttribute("y", "0");
    anSvg.setAttribute("width", "150");
    anSvg.setAttribute("height", "150");
    svg.appendChild(anSvg);

    return svg;
  }

  // Electron-count self-check for a generated Lewis structure: does the
  // drawn bond+lone-pair total match the valence electrons the atoms
  // actually supply? Catches the generic parser fabricating structures
  // that don't conserve electrons (e.g. SO3). Returns null when the check
  // doesn't apply (a transition-metal atom with no valence, or an ionic pair).
  function checkElectronCount(data) {
    if (!data || !data.atoms || !data.bonds) return null;
    if (data.atoms.some(a => { const el = EL.bySym[a.el]; return !el || el.valence == null; })) return null;
    if (data.atoms.length === 2 && data.bonds.length === 1 && isIonicPair(data.atoms[0].el, data.atoms[1].el)) return null;

    const drawn = 2 * data.bonds.reduce((s, b) => s + (b.order || 1), 0)
                + 2 * (data.lonePairs || []).reduce((s, lp) => s + (lp.count || 0), 0);
    const expected = data.atoms.reduce((s, a) => s + EL.bySym[a.el].valence, 0);
    return { valid: drawn === expected, drawn, expected };
  }

  function drawLewisMolecule(data, options = {}) {
    if (data && data.atoms && data.atoms.length === 2 && data.bonds && data.bonds.length === 1) {
      const [a1, a2] = data.atoms;
      if (isIonicPair(a1.el, a2.el)) {
        const ionSvg = drawIonPairMolecule(data, options);
        if (ionSvg) return ionSvg;
      }
    }

    const svg = createSVGElement("svg", {
      preserveAspectRatio: "xMidYMid meet"
    });

    if (!data || !data.atoms || data.atoms.length === 0) return svg;

    const scale = 22;
    // Adjust padding to fit dipole markings
    const padding = (options.showPartialCharges || options.showNetDipole) ? 26 : 20;

    const isCardinal = (options.lewisLayout === "cardinal");
    let snappedAngles = null;
    const cardinalStyle = options.cardinalSnapStyle || "auto";

    if (isCardinal && cardinalStyle !== "auto") {
      const numOuter = data.atoms.length - 1;
      if (numOuter === 2) {
        const map = {
          "bent-down": [Math.PI, Math.PI / 2],
          "bent-right": [Math.PI / 2, 0],
          "bent-up": [0, 3 * Math.PI / 2],
          "bent-left": [3 * Math.PI / 2, Math.PI],
          "linear-h": [Math.PI, 0],
          "linear-v": [3 * Math.PI / 2, Math.PI / 2]
        };
        snappedAngles = map[cardinalStyle];
      } else if (numOuter === 3) {
        const map = {
          "bent-down": [Math.PI, Math.PI / 2, 0],
          "bent-right": [Math.PI / 2, 0, 3 * Math.PI / 2],
          "bent-up": [0, 3 * Math.PI / 2, Math.PI],
          "bent-left": [3 * Math.PI / 2, Math.PI, Math.PI / 2]
        };
        snappedAngles = map[cardinalStyle];
      }
    }

    // 1. Calculate scaled coordinates and build atom index
    const atomMap = {};
    const scaledAtoms = data.atoms.map((atom, idx) => {
      const isH = (atom.el === "H");
      let x = atom.x * scale;
      let y = atom.y * scale;

      // If cardinal, snap outer atoms relative to central atom (first atom in list)
      if (isCardinal && idx > 0 && data.atoms[0]) {
        const central = data.atoms[0];
        const dx = atom.x - central.x;
        const dy = atom.y - central.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) {
          let snapped;
          if (snappedAngles && snappedAngles[idx - 1] !== undefined) {
            snapped = snappedAngles[idx - 1];
          } else {
            const angle = Math.atan2(dy, dx);
            snapped = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2);
          }
          x = (central.x * scale) + (len * scale) * Math.cos(snapped);
          y = (central.y * scale) + (len * scale) * Math.sin(snapped);
        }
      }

      const scaled = {
        id: atom.id,
        el: atom.el,
        x: x,
        y: y,
        radius: isH ? 5.0 : 7.5
      };
      atomMap[atom.id] = scaled;
      return scaled;
    });

    // 2. Compute bounding box for viewBox sizing
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    scaledAtoms.forEach(atom => {
      minX = Math.min(minX, atom.x);
      maxX = Math.max(maxX, atom.x);
      minY = Math.min(minY, atom.y);
      maxY = Math.max(maxY, atom.y);
    });

    let boxW = (maxX - minX) + 2 * padding + 15;
    let boxH = (maxY - minY) + 2 * padding + 22; 
    let viewBoxX = minX - padding - 7.5;
    let viewBoxY = minY - padding - 7.5;

    if (options.showNetDipole && options.netDipoleOffset) {
      boxW += 35; // extra width room on the right for offset net dipole arrow
    }

    svg.setAttribute("viewBox", `${viewBoxX} ${viewBoxY} ${boxW} ${boxH}`);

    // 3. Draw Bonds (lines)
    if (data.bonds) {
      data.bonds.forEach(bond => {
        const atomA = atomMap[bond.a];
        const atomB = atomMap[bond.b];
        if (!atomA || !atomB) return;

        const dx = atomB.x - atomA.x;
        const dy = atomB.y - atomA.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return;

        const ux = dx / len;
        const uy = dy / len;
        const nx = -uy;
        const ny = ux;

        const offsetDist = 8.5;
        const x1 = atomA.x + ux * offsetDist;
        const y1 = atomA.y + uy * offsetDist;
        const x2 = atomB.x - ux * offsetDist;
        const y2 = atomB.y - uy * offsetDist;

        const order = bond.order || 1;

        if (order === 1) {
          svg.appendChild(createSVGElement("line", {
            x1: x1.toFixed(1),
            y1: y1.toFixed(1),
            x2: x2.toFixed(1),
            y2: y2.toFixed(1),
            stroke: "var(--ink)",
            "stroke-width": "var(--dia-stroke-bond)"
          }));
        } else if (order === 2) {
          const offset = 2.2;
          const lines = [
            { x1: x1 + nx * offset, y1: y1 + ny * offset, x2: x2 + nx * offset, y2: y2 + ny * offset },
            { x1: x1 - nx * offset, y1: y1 - ny * offset, x2: x2 - nx * offset, y2: y2 - ny * offset }
          ];
          lines.forEach(l => {
            svg.appendChild(createSVGElement("line", {
              x1: l.x1.toFixed(1),
              y1: l.y1.toFixed(1),
              x2: l.x2.toFixed(1),
              y2: l.y2.toFixed(1),
              stroke: "var(--ink)",
              "stroke-width": "var(--dia-stroke)"
            }));
          });
        } else if (order === 3) {
          const offset = 3.5;
          const lines = [
            { x1: x1, y1: y1, x2: x2, y2: y2 },
            { x1: x1 + nx * offset, y1: y1 + ny * offset, x2: x2 + nx * offset, y2: y2 + ny * offset },
            { x1: x1 - nx * offset, y1: y1 - ny * offset, x2: x2 - nx * offset, y2: y2 - ny * offset }
          ];
          lines.forEach(l => {
            svg.appendChild(createSVGElement("line", {
              x1: l.x1.toFixed(1),
              y1: l.y1.toFixed(1),
              x2: l.x2.toFixed(1),
              y2: l.y2.toFixed(1),
              stroke: "var(--ink)",
              "stroke-width": "var(--dia-stroke)"
            }));
          });
        }
      });
    }

    // 4. Draw Lone Pairs
    if (data.lonePairs) {
      data.lonePairs.forEach(lp => {
        const atom = atomMap[lp.on];
        if (!atom) return;

        const bondAngles = [];
        if (data.bonds) {
          data.bonds.forEach(bond => {
            let otherId = null;
            if (bond.a === atom.id) otherId = bond.b;
            else if (bond.b === atom.id) otherId = bond.a;

            if (otherId && atomMap[otherId]) {
              const other = atomMap[otherId];
              const dx = other.x - atom.x;
              const dy = other.y - atom.y;
              bondAngles.push(Math.atan2(dy, dx));
            }
          });
        }

        const angles = getLonePairAngles(bondAngles, lp.count, isCardinal);
        const lpDist = 11.5;
        const dotSpacing = 5.0; // Increased spacing between dots of lone pairs
        const halfSpacing = dotSpacing / 2;

        angles.forEach(alpha => {
          const lpx = atom.x + lpDist * Math.cos(alpha);
          const lpy = atom.y + lpDist * Math.sin(alpha);
          const px = -Math.sin(alpha);
          const py = Math.cos(alpha);

          const dots = [
            { x: lpx + px * halfSpacing, y: lpy + py * halfSpacing },
            { x: lpx - px * halfSpacing, y: lpy - py * halfSpacing }
          ];

          dots.forEach(d => {
            svg.appendChild(createSVGElement("circle", {
              cx: d.x.toFixed(1),
              cy: d.y.toFixed(1),
              r: "var(--dia-r-particle)",
              fill: "var(--accent)"
            }));
          });
        });
      });
    }

    // 5. Draw Atom Symbols
    scaledAtoms.forEach(atom => {
      let textFill = "var(--ink)";
      if (options.useCPKColors) {
        const cpk = getCPK(atom.el);
        textFill = (atom.el === "H") ? "var(--ink)" : cpk.fill;
      }
      const text = createSVGElement("text", {
        x: atom.x.toFixed(1),
        y: (atom.y + 3.0).toFixed(1),
        "text-anchor": "middle",
        fill: textFill,
        "font-family": "var(--mono)",
        "font-weight": "700",
        "font-size": "11px"
      });
      text.textContent = atom.el;
      svg.appendChild(text);
    });

    // 6. Draw electron density clouds (behind everything else)
    renderElectronDensityClouds(svg, scaledAtoms, atomMap, data, options);

    // 7. Draw dipoles/partial charges
    renderDipoleAnnotations(svg, data, scale, padding, options);

    return svg;
  }

  function drawMolecularModel(data, mode = "ball-and-stick", options = {}) {
    const svg = createSVGElement("svg", {
      preserveAspectRatio: "xMidYMid meet"
    });

    if (!data || !data.atoms || data.atoms.length === 0) return svg;

    const scale = (mode === "particle") ? 18 : 22;
    const padding = (options.showPartialCharges || options.showNetDipole) ? 26 : 20;

    const sortedAtoms = [...data.atoms].sort((a, b) => {
      if (a.el === "H" && b.el !== "H") return 1;
      if (a.el !== "H" && b.el === "H") return -1;
      return 0;
    });

    // 1. Calculate scaled coordinates and styles
    const atomMap = {};
    const scaledAtoms = sortedAtoms.map(atom => {
      const cpk = getCPK(atom.el);
      let radius = 7.5;
      if (mode === "particle") {
        radius = cpk.isSmall ? 8.0 : 11.0;
      } else {
        radius = cpk.isSmall ? 5.0 : 7.5;
      }

      const scaled = {
        id: atom.id,
        el: atom.el,
        x: atom.x * scale,
        y: atom.y * scale,
        radius: radius,
        cpk: cpk
      };
      atomMap[atom.id] = scaled;
      return scaled;
    });

    const atomMapById = {};
    scaledAtoms.forEach(sa => { atomMapById[sa.id] = sa; });

    // 2. Compute bounding box for viewBox sizing
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    scaledAtoms.forEach(atom => {
      minX = Math.min(minX, atom.x - atom.radius);
      maxX = Math.max(maxX, atom.x + atom.radius);
      minY = Math.min(minY, atom.y - atom.radius);
      maxY = Math.max(maxY, atom.y + atom.radius);
    });

    let boxW = (maxX - minX) + 2 * padding;
    let boxH = (maxY - minY) + 2 * padding + (options.showNetDipole ? 15 : 0);
    let viewBoxX = minX - padding;
    let viewBoxY = minY - padding;

    if (options.showNetDipole && options.netDipoleOffset) {
      boxW += 35; // extra width room on the right for offset net dipole arrow
    }

    svg.setAttribute("viewBox", `${viewBoxX} ${viewBoxY} ${boxW} ${boxH}`);

    // 3. Draw Bonds (Ball & Stick mode only)
    if (mode === "ball-and-stick" && data.bonds) {
      data.bonds.forEach(bond => {
        const atomA = atomMapById[bond.a];
        const atomB = atomMapById[bond.b];
        if (!atomA || !atomB) return;

        const dx = atomB.x - atomA.x;
        const dy = atomB.y - atomA.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return;

        const ux = dx / len;
        const uy = dy / len;
        const nx = -uy;
        const ny = ux;

        const rA = atomA.radius;
        const rB = atomB.radius;
        const x1 = atomA.x + ux * rA;
        const y1 = atomA.y + uy * rA;
        const x2 = atomB.x - ux * rB;
        const y2 = atomB.y - uy * rB;

        const order = bond.order || 1;

        if (order === 1) {
          svg.appendChild(createSVGElement("line", {
            x1: x1.toFixed(1),
            y1: y1.toFixed(1),
            x2: x2.toFixed(1),
            y2: y2.toFixed(1),
            stroke: "var(--ink-mute)",
            "stroke-width": "var(--dia-stroke-bond)"
          }));
        } else if (order === 2) {
          const offset = 2.2;
          const lines = [
            { x1: x1 + nx * offset, y1: y1 + ny * offset, x2: x2 + nx * offset, y2: y2 + ny * offset },
            { x1: x1 - nx * offset, y1: y1 - ny * offset, x2: x2 - nx * offset, y2: y2 - ny * offset }
          ];
          lines.forEach(l => {
            svg.appendChild(createSVGElement("line", {
              x1: l.x1.toFixed(1),
              y1: l.y1.toFixed(1),
              x2: l.x2.toFixed(1),
              y2: l.y2.toFixed(1),
              stroke: "var(--ink-mute)",
              "stroke-width": "var(--dia-stroke)"
            }));
          });
        } else if (order === 3) {
          const offset = 3.5;
          const lines = [
            { x1: x1, y1: y1, x2: x2, y2: y2 },
            { x1: x1 + nx * offset, y1: y1 + ny * offset, x2: x2 + nx * offset, y2: y2 + ny * offset },
            { x1: x1 - nx * offset, y1: y1 - ny * offset, x2: x2 - nx * offset, y2: y2 - ny * offset }
          ];
          lines.forEach(l => {
            svg.appendChild(createSVGElement("line", {
              x1: l.x1.toFixed(1),
              y1: l.y1.toFixed(1),
              x2: l.x2.toFixed(1),
              y2: l.y2.toFixed(1),
              stroke: "var(--ink-mute)",
              "stroke-width": "var(--dia-stroke)"
            }));
          });
        }
      });
    }

    // 4. Draw Atoms
    scaledAtoms.forEach(atom => {
      svg.appendChild(createSVGElement("circle", {
        cx: atom.x.toFixed(1),
        cy: atom.y.toFixed(1),
        r: atom.radius,
        fill: atom.cpk.fill,
        stroke: "var(--ink)",
        "stroke-width": mode === "particle" ? "1.0" : "1.2"
      }));

      if (mode === "ball-and-stick" || mode === "particle") {
        const dy = (mode === "particle") ? (atom.cpk.isSmall ? 2.0 : 3.0) : (atom.cpk.isSmall ? 2.2 : 2.8);
        const text = createSVGElement("text", {
          x: atom.x.toFixed(1),
          y: (atom.y + dy).toFixed(1),
          "text-anchor": "middle",
          fill: atom.cpk.text,
          "font-family": "var(--mono)",
          "font-weight": "700",
          "font-size": (mode === "particle") ? (atom.cpk.isSmall ? "6px" : "9px") : (atom.cpk.isSmall ? "var(--dia-caption-size)" : "var(--dia-label-size)")
        });
        text.textContent = atom.el;
        svg.appendChild(text);
      }
    });

    // 5. Draw dipoles/partial charges
    renderDipoleAnnotations(svg, data, scale, padding, options);

    return svg;
  }

  // ============================================================
  // REACTION & PARTICLE DIAGRAM GENERATOR
  // ============================================================
  // Returns null (instead of a silently-empty/partial tally) when a token
  // contains an unknown element symbol or characters the regex can't
  // consume (e.g. a stray lowercase run like "h2o" matches nothing and
  // previously fell through to an empty atom count — a typo that read as
  // "balanced" with zero atoms on both sides).
  function parseFormula(formula) {
    const counts = {};
    const regex = /([A-Z][a-z]*)(\d*)/g;
    let match;
    let consumedLength = 0;
    while ((match = regex.exec(formula)) !== null) {
      let element = match[1];
      let count = match[2] ? parseInt(match[2]) : 1;
      if (!EL.bySym[element]) return null;
      counts[element] = (counts[element] || 0) + count;
      consumedLength += match[0].length;
    }
    if (consumedLength !== formula.length) return null;
    return counts;
  }

  function parseReaction(rxnStr) {
    const sides = rxnStr.split(/->|→/);
    if (sides.length !== 2) return null;

    const parseSide = (sideText) => {
      return sideText.split("+").map(term => {
        term = term.trim();
        const match = term.match(/^(\d*)\s*(.*)$/);
        let coeff = match[1] ? parseInt(match[1]) : 1;
        let formula = match[2].trim().replace(/\s/g, "");
        return { coeff, formula };
      }).filter(t => t.formula.length > 0);
    };

    const reactants = parseSide(sides[0]);
    const products = parseSide(sides[1]);

    // Validate every term up front so a bad token (unknown element, stray
    // lowercase typo, or unsupported syntax like parentheses) is reported
    // by name instead of silently tallying to zero atoms on both sides.
    const badTerm = [...reactants, ...products].find(t => parseFormula(t.formula) === null);
    if (badTerm) {
      return { error: true, badToken: badTerm.formula };
    }

    const leftAtoms = {};
    const rightAtoms = {};

    reactants.forEach(r => {
      const atomMap = parseFormula(r.formula);
      for (const [el, count] of Object.entries(atomMap)) {
        leftAtoms[el] = (leftAtoms[el] || 0) + count * r.coeff;
      }
    });

    products.forEach(p => {
      const atomMap = parseFormula(p.formula);
      for (const [el, count] of Object.entries(atomMap)) {
        rightAtoms[el] = (rightAtoms[el] || 0) + count * p.coeff;
      }
    });

    let balanced = true;
    const allElements = new Set([...Object.keys(leftAtoms), ...Object.keys(rightAtoms)]);
    for (const el of allElements) {
      if (leftAtoms[el] !== rightAtoms[el]) {
        balanced = false;
        break;
      }
    }

    return { reactants, products, leftAtoms, rightAtoms, balanced };
  }

  function renderMoleculeToGroup(formula, scale = 16) {
    const data = MOLECULE_TEMPLATES[formula];
    const group = createSVGElement("g");

    if (!data) {
      const circle = createSVGElement("circle", {
        cx: 0, cy: 0, r: 8,
        fill: "var(--ink-mute)", stroke: "var(--ink)", "stroke-width": 1.0
      });
      group.appendChild(circle);
      const text = createSVGElement("text", {
        x: 0, y: 2.8, "text-anchor": "middle",
        fill: "#fff", "font-family": "var(--mono)", "font-size": "8px", "font-weight": "700"
      });
      text.textContent = formula;
      group.appendChild(text);
      return group;
    }

    data.bonds.forEach(bond => {
      const atomA = data.atoms.find(a => a.id === bond.a);
      const atomB = data.atoms.find(a => a.id === bond.b);
      if (!atomA || !atomB) return;

      const dx = atomB.x - atomA.x;
      const dy = atomB.y - atomA.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) return;

      const ux = dx / len;
      const uy = dy / len;
      const nx = -uy;
      const ny = ux;

      const rA = (atomA.el === "H") ? 5.0 / 36 : 7.5 / 36;
      const rB = (atomB.el === "H") ? 5.0 / 36 : 7.5 / 36;

      const x1 = (atomA.x + ux * rA) * scale;
      const y1 = (atomA.y + uy * rA) * scale;
      const x2 = (atomB.x - ux * rB) * scale;
      const y2 = (atomB.y - uy * rB) * scale;

      const order = bond.order || 1;
      const offset = 1.2;

      if (order === 1) {
        group.appendChild(createSVGElement("line", {
          x1: x1, y1: y1, x2: x2, y2: y2,
          stroke: "var(--ink-mute)", "stroke-width": 1.0
        }));
      } else if (order === 2) {
        group.appendChild(createSVGElement("line", {
          x1: x1 + nx * offset, y1: y1 + ny * offset, x2: x2 + nx * offset, y2: y2 + ny * offset,
          stroke: "var(--ink-mute)", "stroke-width": 0.8
        }));
        group.appendChild(createSVGElement("line", {
          x1: x1 - nx * offset, y1: y1 - ny * offset, x2: x2 - nx * offset, y2: y2 - ny * offset,
          stroke: "var(--ink-mute)", "stroke-width": 0.8
        }));
      } else if (order === 3) {
        group.appendChild(createSVGElement("line", {
          x1: x1, y1: y1, x2: x2, y2: y2,
          stroke: "var(--ink-mute)", "stroke-width": 0.8
        }));
        group.appendChild(createSVGElement("line", {
          x1: x1 + nx * (offset * 1.5), y1: y1 + ny * (offset * 1.5), x2: x2 + nx * (offset * 1.5), y2: y2 + ny * (offset * 1.5),
          stroke: "var(--ink-mute)", "stroke-width": 0.6
        }));
        group.appendChild(createSVGElement("line", {
          x1: x1 - nx * (offset * 1.5), y1: y1 - ny * (offset * 1.5), x2: x2 - nx * (offset * 1.5), y2: y2 - ny * (offset * 1.5),
          stroke: "var(--ink-mute)", "stroke-width": 0.6
        }));
      }
    });

    data.atoms.forEach(atom => {
      const cpk = getCPK(atom.el);
      const isH = (atom.el === "H");
      const radius = isH ? 4.5 : 6.5;

      group.appendChild(createSVGElement("circle", {
        cx: atom.x * scale,
        cy: atom.y * scale,
        r: radius,
        fill: cpk.fill,
        stroke: "var(--ink)",
        "stroke-width": 1.0
      }));

      const text = createSVGElement("text", {
        x: atom.x * scale,
        y: atom.y * scale + (isH ? 1.8 : 2.2),
        "text-anchor": "middle",
        fill: cpk.text,
        "font-family": "var(--mono)",
        "font-weight": "700",
        "font-size": isH ? "5.5px" : "8px"
      });
      text.textContent = atom.el;
      group.appendChild(text);
    });

    return group;
  }

  function drawReactionMolecules(rxn) {
    const svg = createSVGElement("svg", {
      viewBox: "0 0 520 120",
      preserveAspectRatio: "xMidYMid meet"
    });

    const scale = 14;
    const CY = 60;

    let currentX = 30;
    
    rxn.reactants.forEach((r, idx) => {
      if (r.coeff > 1) {
        const txt = createSVGElement("text", {
          x: currentX, y: CY + 5,
          "font-family": "var(--display)", "font-weight": "800", "font-size": "18px",
          fill: "var(--ink)", "text-anchor": "middle"
        });
        txt.textContent = r.coeff;
        svg.appendChild(txt);
        currentX += 20;
      }

      for (let c = 0; c < r.coeff; c++) {
        const molGroup = renderMoleculeToGroup(r.formula, scale);
        let dx = 0;
        let dy = 0;
        if (r.coeff > 1) {
          dx = (c - (r.coeff - 1) / 2) * 28;
          dy = (c % 2 === 0) ? -10 : 10;
        }
        molGroup.setAttribute("transform", `translate(${currentX + dx}, ${CY + dy})`);
        svg.appendChild(molGroup);
      }

      currentX += r.coeff > 1 ? (r.coeff - 1) * 28 + 30 : 30;

      if (idx < rxn.reactants.length - 1) {
        const plus = createSVGElement("text", {
          x: currentX, y: CY + 5,
          "font-family": "var(--display)", "font-weight": "800", "font-size": "16px",
          fill: "var(--ink)", "text-anchor": "middle"
        });
        plus.textContent = "+";
        svg.appendChild(plus);
        currentX += 30;
      }
    });

    const arrowX = currentX + 15;
    svg.appendChild(createSVGElement("line", {
      x1: arrowX, y1: CY, x2: arrowX + 30, y2: CY,
      stroke: "var(--ink)", "stroke-width": 2, "stroke-linecap": "round"
    }));
    svg.appendChild(createSVGElement("path", {
      d: `M ${arrowX + 25},${CY - 4} L ${arrowX + 31},${CY} L ${arrowX + 25},${CY + 4}`,
      fill: "none", stroke: "var(--ink)", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round"
    }));

    currentX = arrowX + 45;

    rxn.products.forEach((p, idx) => {
      if (p.coeff > 1) {
        const txt = createSVGElement("text", {
          x: currentX, y: CY + 5,
          "font-family": "var(--display)", "font-weight": "800", "font-size": "18px",
          fill: "var(--ink)", "text-anchor": "middle"
        });
        txt.textContent = p.coeff;
        svg.appendChild(txt);
        currentX += 20;
      }

      for (let c = 0; c < p.coeff; c++) {
        const molGroup = renderMoleculeToGroup(p.formula, scale);
        let dx = 0;
        let dy = 0;
        if (p.coeff > 1) {
          dx = (c - (p.coeff - 1) / 2) * 28;
          dy = (c % 2 === 0) ? -10 : 10;
        }
        molGroup.setAttribute("transform", `translate(${currentX + dx}, ${CY + dy})`);
        svg.appendChild(molGroup);
      }

      currentX += p.coeff > 1 ? (p.coeff - 1) * 28 + 30 : 30;

      if (idx < rxn.products.length - 1) {
        const plus = createSVGElement("text", {
          x: currentX, y: CY + 5,
          "font-family": "var(--display)", "font-weight": "800", "font-size": "16px",
          fill: "var(--ink)", "text-anchor": "middle"
        });
        plus.textContent = "+";
        svg.appendChild(plus);
        currentX += 30;
      }
    });

    svg.setAttribute("viewBox", `0 0 ${(currentX + 30).toFixed(0)} 120`);

    return svg;
  }

  function drawMotionTails(svg, cx, cy, radius, energy = 1) {
    const seed = Math.sin(cx * 12.9898 + cy * 78.233) * 43758.5453;
    const angle = (seed - Math.floor(seed)) * 2 * Math.PI;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const px = -dy;
    const py = dx;

    const tailLenCenter = radius + 4 * energy;
    svg.appendChild(createSVGElement("line", {
      x1: (cx - radius * dx).toFixed(1),
      y1: (cy - radius * dy).toFixed(1),
      x2: (cx - tailLenCenter * dx).toFixed(1),
      y2: (cy - tailLenCenter * dy).toFixed(1),
      stroke: "var(--ink-mute)",
      "stroke-width": 0.8,
      opacity: 0.6,
      "stroke-linecap": "round"
    }));

    if (energy >= 2) {
      const tailLenSide = radius + 2.5 * energy;
      svg.appendChild(createSVGElement("line", {
        x1: (cx + 2.5 * px - radius * dx).toFixed(1),
        y1: (cy + 2.5 * py - radius * dy).toFixed(1),
        x2: (cx + 2.5 * px - tailLenSide * dx).toFixed(1),
        y2: (cy + 2.5 * py - tailLenSide * dy).toFixed(1),
        stroke: "var(--ink-mute)", "stroke-width": 0.6, opacity: 0.4, "stroke-linecap": "round"
      }));
    }
  }

  function drawVibrateBrackets(svg, cx, cy, radius) {
    const d = radius + 2.5;
    const h = 4;
    svg.appendChild(createSVGElement("path", {
      d: `M ${(cx - d + 1).toFixed(1)} ${(cy - h).toFixed(1)} H ${(cx - d).toFixed(1)} V ${(cy + h).toFixed(1)} H ${(cx - d + 1).toFixed(1)}`,
      stroke: "var(--ink-mute)", "stroke-width": 0.6, fill: "none"
    }));
    svg.appendChild(createSVGElement("path", {
      d: `M ${(cx + d - 1).toFixed(1)} ${(cy - h).toFixed(1)} H ${(cx + d).toFixed(1)} V ${(cy + h).toFixed(1)} H ${(cx + d - 1).toFixed(1)}`,
      stroke: "var(--ink-mute)", "stroke-width": 0.6, fill: "none"
    }));
  }

  function drawLiquidLump(svg, cx, cy, radius) {
    const seed = Math.sin(cx * 12.9898 + cy * 78.233) * 43758.5453;
    const isLeft = (seed - Math.floor(seed)) > 0.5;
    const d = radius + 2.0;

    const dStr = isLeft
      ? `M ${(cx - d).toFixed(1)} ${(cy - 4).toFixed(1)} Q ${(cx - d - 1.5).toFixed(1)} ${cy.toFixed(1)} ${(cx - d).toFixed(1)} ${(cy + 4).toFixed(1)}`
      : `M ${(cx + d).toFixed(1)} ${(cy - 4).toFixed(1)} Q ${(cx + d + 1.5).toFixed(1)} ${cy.toFixed(1)} ${(cx + d).toFixed(1)} ${(cy + 4).toFixed(1)}`;

    svg.appendChild(createSVGElement("path", {
      d: dStr, stroke: "var(--ink-mute)", "stroke-width": 0.6, fill: "none"
    }));
  }

  function drawChamberMolecule(svg, formula, cx, cy, state = "gas") {
    const data = MOLECULE_TEMPLATES[formula];
    const scale = 8.5;

    if (!data) {
      svg.appendChild(createSVGElement("circle", {
        cx: cx, cy: cy, r: 4.5,
        fill: "var(--ink-mute)", stroke: "var(--ink)", "stroke-width": 1.0
      }));
      return;
    }

    if (state === "gas") {
      drawMotionTails(svg, cx, cy, 6.5, 1);
    } else if (state === "solid") {
      drawVibrateBrackets(svg, cx, cy, 6.5);
    } else if (state === "liquid") {
      drawLiquidLump(svg, cx, cy, 6.5);
    }

    data.bonds.forEach(bond => {
      const atomA = data.atoms.find(a => a.id === bond.a);
      const atomB = data.atoms.find(a => a.id === bond.b);
      if (!atomA || !atomB) return;

      const x1 = cx + atomA.x * scale;
      const y1 = cy + atomA.y * scale;
      const x2 = cx + atomB.x * scale;
      const y2 = cy + atomB.y * scale;

      svg.appendChild(createSVGElement("line", {
        x1: x1.toFixed(1), y1: y1.toFixed(1), x2: x2.toFixed(1), y2: y2.toFixed(1),
        stroke: "var(--ink-mute)", "stroke-width": 0.7
      }));
    });

    data.atoms.forEach(atom => {
      const cpk = getCPK(atom.el);
      const isH = (atom.el === "H");
      const radius = isH ? 2.5 : 4.0;
      const ax = cx + atom.x * scale;
      const ay = cy + atom.y * scale;

      svg.appendChild(createSVGElement("circle", {
        cx: ax.toFixed(1), cy: ay.toFixed(1), r: radius,
        fill: cpk.fill, stroke: "var(--ink)", "stroke-width": 0.8
      }));
    });
  }

  function drawParticleChambers(rxn, stateBefore = "gas", stateAfter = "gas") {
    const svg = createSVGElement("svg", {
      viewBox: "0 0 340 185",
      preserveAspectRatio: "xMidYMid meet"
    });

    const panelW = 150;
    const panelH = 150;
    const TY = 25;
    const leftOffset = 10;
    const rightOffset = 180;

    svg.appendChild(createSVGElement("rect", {
      x: leftOffset, y: TY, width: panelW, height: panelH, rx: 4,
      class: "d-frame"
    }));
    const labelBefore = createSVGElement("text", {
      x: leftOffset + panelW / 2, y: 18, "text-anchor": "middle", class: "d-label",
      style: "font-size: var(--dia-label-size); font-weight: 600;"
    });
    labelBefore.textContent = "BEFORE";
    svg.appendChild(labelBefore);

    svg.appendChild(createSVGElement("rect", {
      x: rightOffset, y: TY, width: panelW, height: panelH, rx: 4,
      class: "d-frame"
    }));
    const labelAfter = createSVGElement("text", {
      x: rightOffset + panelW / 2, y: 18, "text-anchor": "middle", class: "d-label",
      style: "font-size: var(--dia-label-size); font-weight: 600;"
    });
    labelAfter.textContent = "AFTER";
    svg.appendChild(labelAfter);

    const positionsList = [
      { x: 30, y: 35 }, { x: 120, y: 115 }, { x: 75, y: 75 },
      { x: 115, y: 40 }, { x: 35, y: 110 }, { x: 75, y: 125 },
      { x: 75, y: 30 }, { x: 30, y: 75 }, { x: 120, y: 75 }
    ];

    let beforeMols = [];
    rxn.reactants.forEach(r => {
      for (let k = 0; k < r.coeff; k++) {
        beforeMols.push(r.formula);
      }
    });

    beforeMols.forEach((formula, idx) => {
      const pos = positionsList[idx % positionsList.length];
      const cx = leftOffset + pos.x + (Math.sin(idx * 5) * 5);
      const cy = TY + pos.y + (Math.cos(idx * 3) * 5);
      drawChamberMolecule(svg, formula, cx, cy, stateBefore);
    });

    let afterMols = [];
    rxn.products.forEach(p => {
      for (let k = 0; k < p.coeff; k++) {
        afterMols.push(p.formula);
      }
    });

    afterMols.forEach((formula, idx) => {
      const pos = positionsList[idx % positionsList.length];
      const cx = rightOffset + pos.x + (Math.sin(idx * 8) * 5);
      const cy = TY + pos.y + (Math.cos(idx * 4) * 5);
      drawChamberMolecule(svg, formula, cx, cy, stateAfter);
    });

    return svg;
  }

  function parseFormulaToMolecule(inputStr) {
    inputStr = inputStr.trim();
    if (!inputStr) return null;

    const lowerInput = inputStr.toLowerCase();
    let formula = NAME_TO_FORMULA[lowerInput] || inputStr;

    // Check case-insensitive preset formulas
    const presetKeys = Object.keys(MOLECULE_TEMPLATES);
    const matchedKey = presetKeys.find(k => k.toLowerCase() === formula.toLowerCase());
    if (matchedKey) {
      return {
        formula: matchedKey,
        name: NAME_TO_FORMULA[lowerInput] ? inputStr : matchedKey,
        data: MOLECULE_TEMPLATES[matchedKey]
      };
    }

    // Parse chemical formula components
    const regex = /([A-Z][a-z]*)(\d*)/g;
    let match;
    let totalAtoms = 0;
    const elementCounts = {};

    while ((match = regex.exec(formula)) !== null) {
      const el = match[1];
      const count = match[2] ? parseInt(match[2]) : 1;
      
      if (!window.GC_ELEMENTS.bySym[el]) {
        return null; // Invalid element symbol
      }
      
      elementCounts[el] = (elementCounts[el] || 0) + count;
      totalAtoms += count;
    }

    if (totalAtoms === 0) return null;

    // Monatomic fallback
    if (totalAtoms === 1) {
      const el = Object.keys(elementCounts)[0];
      return {
        formula: formula,
        name: formula,
        data: {
          atoms: [{ id: el + "1", el: el, x: 0, y: 0 }],
          bonds: [],
          lonePairs: []
        }
      };
    }

    const elements = Object.keys(elementCounts);
    
    // Pattern 1: Diatomic (e.g. HCl, O2)
    if (totalAtoms === 2) {
      const elA = elements[0];
      const elB = elements[1] || elA;
      const valA = window.GC_ELEMENTS.bySym[elA].valence || 1;
      const valB = window.GC_ELEMENTS.bySym[elB].valence || 1;
      const isH = (elA === "H" || elB === "H");
      const order = isH ? 1 : Math.min(8 - valA, 8 - valB);

      const lpA = Math.max(0, Math.floor((valA - order) / 2));
      const lpB = Math.max(0, Math.floor((valB - order) / 2));

      return {
        formula: formula,
        name: formula,
        data: {
          atoms: [
            { id: elA + "1", el: elA, x: -0.6, y: 0 },
            { id: elB + "2", el: elB, x: 0.6, y: 0 }
          ],
          bonds: [
            { a: elA + "1", b: elB + "2", order: order }
          ],
          lonePairs: [
            ...(lpA > 0 ? [{ on: elA + "1", count: lpA }] : []),
            ...(lpB > 0 ? [{ on: elB + "2", count: lpB }] : [])
          ]
        }
      };
    }

    // Same-element polyatomics (e.g. O3/ozone) are resonance cases the
    // central/outer AB(n) patterns below can't represent honestly — refuse
    // rather than fabricate a structure (Golden Rule 4). Diatomics (O2, Cl2)
    // are unaffected; the pattern above already handles those correctly.
    if (elements.length === 1 && totalAtoms >= 3) return null;

    // Pattern 2: Triatomic AB2 (e.g. H2O, CO2, SO2)
    if (totalAtoms === 3) {
      let central = null;
      let outer = null;
      for (const [el, cnt] of Object.entries(elementCounts)) {
        if (cnt === 1) central = el;
        if (cnt === 2) outer = el;
      }
      if (!central || !outer) {
        central = elements[0];
        outer = elements[1] || central;
      }

      const valA = window.GC_ELEMENTS.bySym[central].valence || 4;
      const valB = window.GC_ELEMENTS.bySym[outer].valence || 1;
      const isBent = ["O", "S", "Se", "Te"].includes(central) || (valA === 6) || ["H2O", "H2S", "SO2", "OF2", "O3"].includes(formula.toUpperCase());

      let order = 1;
      if (valB === 6 && valA >= 4) order = 2; // double bond to oxygen

      const sumOrders = order * 2;
      const lpA = Math.max(0, Math.floor((valA - sumOrders) / 2));
      const lpB = Math.max(0, Math.floor((valB - order) / 2));

      if (isBent) {
        return {
          formula: formula,
          name: formula,
          data: {
            atoms: [
              { id: central + "1", el: central, x: 0, y: -0.2 },
              { id: outer + "2", el: outer, x: -0.9, y: 0.5 },
              { id: outer + "3", el: outer, x: 0.9, y: 0.5 }
            ],
            bonds: [
              { a: central + "1", b: outer + "2", order: order },
              { a: central + "1", b: outer + "3", order: order }
            ],
            lonePairs: [
              ...(lpA > 0 ? [{ on: central + "1", count: lpA }] : []),
              { on: outer + "2", count: lpB },
              { on: outer + "3", count: lpB }
            ]
          }
        };
      } else {
        // Linear
        return {
          formula: formula,
          name: formula,
          data: {
            atoms: [
              { id: central + "1", el: central, x: 0, y: 0 },
              { id: outer + "2", el: outer, x: -1.1, y: 0 },
              { id: outer + "3", el: outer, x: 1.1, y: 0 }
            ],
            bonds: [
              { a: central + "1", b: outer + "2", order: order },
              { a: central + "1", b: outer + "3", order: order }
            ],
            lonePairs: [
              ...(lpA > 0 ? [{ on: central + "1", count: lpA }] : []),
              { on: outer + "2", count: lpB },
              { on: outer + "3", count: lpB }
            ]
          }
        };
      }
    }

    // Pattern 3: Tetratomic AB3 (e.g. NH3, BF3, SO3)
    if (totalAtoms === 4) {
      let central = null;
      let outer = null;
      for (const [el, cnt] of Object.entries(elementCounts)) {
        if (cnt === 1) central = el;
        if (cnt === 3) outer = el;
      }
      if (!central || !outer) {
        central = elements[0];
        outer = elements[1] || central;
      }

      const valA = window.GC_ELEMENTS.bySym[central].valence || 5;
      const valB = window.GC_ELEMENTS.bySym[outer].valence || 1;
      const isPyramidal = ["N", "P", "As"].includes(central) || (valA === 5);

      let order = 1;
      const sumOrders = order * 3;
      const lpA = Math.max(0, Math.floor((valA - sumOrders) / 2));
      const lpB = Math.max(0, Math.floor((valB - order) / 2));

      if (isPyramidal) {
        return {
          formula: formula,
          name: formula,
          data: {
            atoms: [
              { id: central + "1", el: central, x: 0, y: -0.2 },
              { id: outer + "2", el: outer, x: -1.0, y: 0.4 },
              { id: outer + "3", el: outer, x: 1.0, y: 0.4 },
              { id: outer + "4", el: outer, x: 0, y: 0.9 }
            ],
            bonds: [
              { a: central + "1", b: outer + "2", order: order },
              { a: central + "1", b: outer + "3", order: order },
              { a: central + "1", b: outer + "4", order: order }
            ],
            lonePairs: [
              ...(lpA > 0 ? [{ on: central + "1", count: lpA }] : []),
              { on: outer + "2", count: lpB },
              { on: outer + "3", count: lpB },
              { on: outer + "4", count: lpB }
            ]
          }
        };
      } else {
        // Trigonal Planar
        return {
          formula: formula,
          name: formula,
          data: {
            atoms: [
              { id: central + "1", el: central, x: 0, y: 0 },
              { id: outer + "2", el: outer, x: 0, y: -1.0 },
              { id: outer + "3", el: outer, x: -0.86, y: 0.5 },
              { id: outer + "4", el: outer, x: 0.86, y: 0.5 }
            ],
            bonds: [
              { a: central + "1", b: outer + "2", order: order },
              { a: central + "1", b: outer + "3", order: order },
              { a: central + "1", b: outer + "4", order: order }
            ],
            lonePairs: [
              ...(lpA > 0 ? [{ on: central + "1", count: lpA }] : []),
              { on: outer + "2", count: lpB },
              { on: outer + "3", count: lpB },
              { on: outer + "4", count: lpB }
            ]
          }
        };
      }
    }

    // Pattern 4: Pentatomic AB4 (e.g. CH4, CF4)
    if (totalAtoms === 5) {
      let central = null;
      let outer = null;
      for (const [el, cnt] of Object.entries(elementCounts)) {
        if (cnt === 1) central = el;
        if (cnt === 4) outer = el;
      }
      if (!central || !outer) {
        central = elements[0];
        outer = elements[1] || central;
      }

      const valA = window.GC_ELEMENTS.bySym[central].valence || 4;
      const valB = window.GC_ELEMENTS.bySym[outer].valence || 1;

      let order = 1;
      const sumOrders = order * 4;
      const lpA = Math.max(0, Math.floor((valA - sumOrders) / 2));
      const lpB = Math.max(0, Math.floor((valB - order) / 2));

      return {
        formula: formula,
        name: formula,
        data: {
          atoms: [
            { id: central + "1", el: central, x: 0, y: 0 },
            { id: outer + "2", el: outer, x: -1.0, y: 0 },
            { id: outer + "3", el: outer, x: 1.0, y: 0 },
            { id: outer + "4", el: outer, x: 0, y: -1.0 },
            { id: outer + "5", el: outer, x: 0, y: 1.0 }
          ],
          bonds: [
            { a: central + "1", b: outer + "2", order: order },
            { a: central + "1", b: outer + "3", order: order },
            { a: central + "1", b: outer + "4", order: order },
            { a: central + "1", b: outer + "5", order: order }
          ],
          lonePairs: [
            ...(lpA > 0 ? [{ on: central + "1", count: lpA }] : []),
            { on: outer + "2", count: lpB },
            { on: outer + "3", count: lpB },
            { on: outer + "4", count: lpB },
            { on: outer + "5", count: lpB }
          ]
        }
      };
    }

    return null;
  }

  // Export classes to global namespace
  window.ChemApp = {
    getCPK,
    TEMPLATES: MOLECULE_TEMPLATES,
    exportPNG: exportSVGToPNG,
    downloadSVG: downloadStandaloneSVG,
    prepareStandaloneSVG,
    drawBohrModel,
    drawLewisAtom,
    drawLewisMolecule,
    drawMolecularModel,
    parseReaction,
    drawReactionMolecules,
    drawParticleChambers,
    calculateIonShells,
    createSVGElement,
    parseFormulaToMolecule,
    isIonicPair,
    checkElectronCount,
    COMMON_NAMES,
    getDisplayName
  };
})();
