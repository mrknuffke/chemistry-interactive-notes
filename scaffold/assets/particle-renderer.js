/**
 * Particle-Scene Renderer
 * Constructs physical/chemical phase diagrams and reaction chamber sequences programmatically.
 * Adheres to CLAUDE.md and DIAGRAM_CONTRACT.md.
 */

function renderParticleScene(container, data) {
  // 0. Resolve container target
  const target = typeof container === 'string' ? document.querySelector(container) : container;
  if (!target) {
    console.error("Particle-Scene Renderer: Container target not found", container);
    return;
  }

  // 1. Data Model Normalization & Fallbacks
  const frame = data.frame || { panels: 1, labels: ["System"] };
  const panelsCount = Math.max(1, frame.panels || 1);
  const labels = frame.labels || [];
  const legend = data.legend || [];
  const particles = data.particles || [];

  // 2. Verification Gate (Particle Conservation)
  const panelCounts = Array.from({ length: panelsCount }, () => ({}));
  particles.forEach(p => {
    const pIdx = Number(p.panel);
    if (pIdx >= 0 && pIdx < panelsCount) {
      panelCounts[pIdx][p.type] = (panelCounts[pIdx][p.type] || 0) + 1;
    }
  });

  // Collect all unique particle types seen in particles or legend
  const allTypes = new Set([
    ...particles.map(p => p.type),
    ...legend.map(item => item.type)
  ]);

  let conservationError = false;
  if (panelsCount > 1) {
    for (const type of allTypes) {
      const firstPanelCount = panelCounts[0][type] || 0;
      for (let i = 1; i < panelsCount; i++) {
        const currentCount = panelCounts[i][type] || 0;
        if (currentCount !== firstPanelCount) {
          conservationError = true;
          break;
        }
      }
      if (conservationError) break;
    }
  }

  if (conservationError) {
    console.error("Conservation Error: Particle Count Mismatch across panels in the sequence.", panelCounts);
  }

  // 3. Dynamic Color & Shape Mapping
  // Color Palette rules (CLAUDE.md §5 / tokens.css): Accent is Vermilion, Cool is Blue, Ink Mute is Gray.
  const ELEMENT_COLORS = {
    'H': '#ffffff',
    'O': 'var(--accent)',
    'C': 'var(--ink-mute)',
    'N': 'var(--cool)',
    'Cl': 'var(--cool)',
    'Na': 'var(--ink-mute)'
  };
  const COLOR_CYCLE = [
    'var(--accent)',
    'var(--cool)',
    'var(--ink-mute)',
    'var(--ink-soft)',
    '#ffffff'
  ];

  const typeColors = {};
  const typeShapes = {}; // 'circle' | 'square'

  // Pre-populate shapes and colors based on legend
  legend.forEach((item, idx) => {
    // Color
    let color = ELEMENT_COLORS[item.type];
    if (!color) {
      color = COLOR_CYCLE[idx % COLOR_CYCLE.length];
    }
    typeColors[item.type] = color;

    // Shape classification (circles .d-particle vs squares .d-metal)
    // Check window.GC_ELEMENTS or common metal symbols
    const metals = ['Na', 'Mg', 'Al', 'K', 'Ca', 'Fe', 'Cu', 'Zn', 'Li', 'Ag', 'Au', 'Pb', 'Sn', 'Ni', 'Cr', 'Co', 'Mn', 'Ti'];
    let isMetal = false;
    if (window.GC_ELEMENTS && window.GC_ELEMENTS.bySym && window.GC_ELEMENTS.bySym[item.type]) {
      isMetal = window.GC_ELEMENTS.bySym[item.type].kind === 'metal';
    } else {
      isMetal = metals.includes(item.type);
    }
    typeShapes[item.type] = isMetal ? 'square' : 'circle';
  });

  // Ensure any untracked particle types get default styles
  particles.forEach(p => {
    if (!typeColors[p.type]) {
      typeColors[p.type] = 'var(--ink-mute)';
      typeShapes[p.type] = 'circle';
    }
  });

  // 4. Layout Dimensions (SVG User Units)
  const panelWidth = 150;
  const panelHeight = 150;
  const panelPadding = 20;
  const leftMargin = 10;
  const rightMargin = 10;
  const topMargin = 25;
  const bottomMargin = 10;

  const totalWidth = leftMargin + panelsCount * panelWidth + (panelsCount - 1) * panelPadding + rightMargin;
  const totalHeight = topMargin + panelHeight + bottomMargin;

  // 5. SVG Construction
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${totalWidth} ${totalHeight}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.style.width = "100%";
  svg.style.height = "auto";
  svg.style.display = "block";

  // Helper for setting SVG attributes and style
  function createSVGElement(tag, attrs = {}) {
    const el = document.createElementNS(svgNS, tag);
    for (const [key, val] of Object.entries(attrs)) {
      if (key === 'font-size') {
        el.style.fontSize = val;
      } else {
        el.setAttribute(key, val);
      }
    }
    return el;
  }

  // Determine boundary class
  // If frame has an explicit border setting, respect it. Otherwise, panels > 1 -> d-frame, panels === 1 -> d-wall.
  let boundaryClass = "d-frame";
  if (frame.border === "solid" || frame.style === "solid" || frame.type === "solid") {
    boundaryClass = "d-wall";
  } else if (frame.border === "dashed" || frame.style === "dashed" || frame.type === "dashed") {
    boundaryClass = "d-frame";
  } else {
    boundaryClass = panelsCount > 1 ? "d-frame" : "d-wall";
  }

  // Draw panels and panel labels
  for (let i = 0; i < panelsCount; i++) {
    const xOffset = leftMargin + i * (panelWidth + panelPadding);
    const yOffset = topMargin;

    // Panel Boundary Box
    svg.appendChild(createSVGElement("rect", {
      x: xOffset,
      y: yOffset,
      width: panelWidth,
      height: panelHeight,
      rx: 4,
      class: boundaryClass
    }));

    // Panel Label
    const labelText = labels[i] || "";
    if (labelText) {
      const txt = createSVGElement("text", {
        x: xOffset + panelWidth / 2,
        y: 18,
        "text-anchor": "middle",
        class: "d-label",
        style: "font-size: var(--dia-label-size); font-weight: 600;"
      });
      txt.textContent = labelText;
      svg.appendChild(txt);
    }
  }

  // Draw motion indicators and particles
  // Note: Drawing motion indicators first, so they render layered behind the particle body.
  const innerPadding = 12;
  const particleRadius = 7.5; // Matches var(--dia-r-atom)

  // Sub-step: Draw Indicators
  particles.forEach(p => {
    const pIdx = Number(p.panel);
    if (pIdx < 0 || pIdx >= panelsCount) return;

    const xOffset = leftMargin + pIdx * (panelWidth + panelPadding);
    const yOffset = topMargin;

    // Map percentage to panel's inner dimensions
    const cx = xOffset + innerPadding + (panelWidth - 2 * innerPadding) * (p.x / 100);
    const cy = yOffset + innerPadding + (panelHeight - 2 * innerPadding) * (p.y / 100);

    const energy = Math.max(1, Number(p.energy) || 1);

    if (p.motion === "vibrate") {
      // Draw small symmetrical square vibration brackets around the particle (solid state)
      for (let j = 1; j <= energy; j++) {
        const d = particleRadius + 2.5 + (j - 1) * 3;
        const h = 5; // half height of the bracket
        // Left square bracket "["
        svg.appendChild(createSVGElement("path", {
          d: `M ${(cx - d + 1.5).toFixed(1)} ${(cy - h).toFixed(1)} H ${(cx - d).toFixed(1)} V ${(cy + h).toFixed(1)} H ${(cx - d + 1.5).toFixed(1)}`,
          stroke: "var(--ink-mute)",
          "stroke-width": 0.8,
          fill: "none"
        }));
        // Right square bracket "]"
        svg.appendChild(createSVGElement("path", {
          d: `M ${(cx + d - 1.5).toFixed(1)} ${(cy - h).toFixed(1)} H ${(cx + d).toFixed(1)} V ${(cy + h).toFixed(1)} H ${(cx + d - 1.5).toFixed(1)}`,
          stroke: "var(--ink-mute)",
          "stroke-width": 0.8,
          fill: "none"
        }));
      }
    } else if (p.motion === "lump" || p.motion === "liquid" || p.motion === "slide") {
      // Draw single-sided round bracket curves for liquid state
      const seed = Math.sin(p.x * 12.9898 + p.y * 78.233) * 43758.5453;
      const isLeft = (seed - Math.floor(seed)) > 0.5;

      for (let j = 1; j <= energy; j++) {
        const d = particleRadius + 2 + (j - 1) * 3;
        const dStr = isLeft
          ? `M ${(cx - d).toFixed(1)} ${(cy - 5).toFixed(1)} Q ${(cx - d - 2).toFixed(1)} ${cy.toFixed(1)} ${(cx - d).toFixed(1)} ${(cy + 5).toFixed(1)}`
          : `M ${(cx + d).toFixed(1)} ${(cy - 5).toFixed(1)} Q ${(cx + d + 2).toFixed(1)} ${cy.toFixed(1)} ${(cx + d).toFixed(1)} ${(cy + 5).toFixed(1)}`;
        
        svg.appendChild(createSVGElement("path", {
          d: dStr,
          stroke: "var(--ink-mute)",
          "stroke-width": 0.8,
          fill: "none"
        }));
      }
    } else if (p.motion === "translate") {
      // Draw directional motion tails (liquid/gas state)
      // Deterministic angle based on coordinates to avoid change-on-rerender
      const seed = Math.sin(p.x * 12.9898 + p.y * 78.233) * 43758.5453;
      const angle = (seed - Math.floor(seed)) * 2 * Math.PI;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const px = -dy;
      const py = dx; // Perpendicular vectors

      // Center Line
      const tailLenCenter = particleRadius + 5 * energy;
      svg.appendChild(createSVGElement("line", {
        x1: cx - particleRadius * dx,
        y1: cy - particleRadius * dy,
        x2: cx - tailLenCenter * dx,
        y2: cy - tailLenCenter * dy,
        stroke: "var(--ink-mute)",
        "stroke-width": 1.0,
        opacity: 0.7,
        "stroke-linecap": "round"
      }));

      // Side Line 1
      if (energy >= 2) {
        const tailLenSide = particleRadius + 3 * energy;
        svg.appendChild(createSVGElement("line", {
          x1: (cx + 3.5 * px) - particleRadius * dx,
          y1: (cy + 3.5 * py) - particleRadius * dy,
          x2: (cx + 3.5 * px) - tailLenSide * dx,
          y2: (cy + 3.5 * py) - tailLenSide * dy,
          stroke: "var(--ink-mute)",
          "stroke-width": 0.8,
          opacity: 0.5,
          "stroke-linecap": "round"
        }));
      }

      // Side Line 2
      if (energy >= 3) {
        const tailLenSide = particleRadius + 2.5 * energy;
        svg.appendChild(createSVGElement("line", {
          x1: (cx - 3.5 * px) - particleRadius * dx,
          y1: (cy - 3.5 * py) - particleRadius * dy,
          x2: (cx - 3.5 * px) - tailLenSide * dx,
          y2: (cy - 3.5 * py) - tailLenSide * dy,
          stroke: "var(--ink-mute)",
          "stroke-width": 0.8,
          opacity: 0.5,
          "stroke-linecap": "round"
        }));
      }
    }
  });

  // Sub-step: Draw Particles
  particles.forEach(p => {
    const pIdx = Number(p.panel);
    if (pIdx < 0 || pIdx >= panelsCount) return;

    const xOffset = leftMargin + pIdx * (panelWidth + panelPadding);
    const yOffset = topMargin;

    const cx = xOffset + innerPadding + (panelWidth - 2 * innerPadding) * (p.x / 100);
    const cy = yOffset + innerPadding + (panelHeight - 2 * innerPadding) * (p.y / 100);

    const shape = typeShapes[p.type];
    const color = typeColors[p.type];

    if (shape === 'square') {
      // Metal particle (drawn as square using .d-metal)
      svg.appendChild(createSVGElement("rect", {
        x: cx - particleRadius,
        y: cy - particleRadius,
        width: particleRadius * 2,
        height: particleRadius * 2,
        rx: 1.5,
        class: "d-metal",
        style: `fill: ${color};`
      }));
    } else {
      // Normal particle (drawn as circle using .d-particle)
      svg.appendChild(createSVGElement("circle", {
        cx: cx,
        cy: cy,
        r: particleRadius,
        class: "d-particle",
        style: `fill: ${color};`
      }));
    }
  });

  // 6. Conservation Error Visual Tag
  if (conservationError) {
    const errorGroup = createSVGElement("g", { class: "conservation-error-tag" });
    const bannerWidth = 240;
    const bannerHeight = 18;
    const rx = 3;
    errorGroup.appendChild(createSVGElement("rect", {
      x: totalWidth / 2 - bannerWidth / 2,
      y: 2,
      width: bannerWidth,
      height: bannerHeight,
      rx: rx,
      fill: "var(--accent)"
    }));
    const errorText = createSVGElement("text", {
      x: totalWidth / 2,
      y: 14,
      "text-anchor": "middle",
      fill: "#ffffff",
      style: "font-family: var(--mono); font-size: 8px; font-weight: bold;"
    });
    errorText.textContent = "Conservation Error: Particle Count Mismatch";
    errorGroup.appendChild(errorText);
    svg.appendChild(errorGroup);
  }

  // 7. Render Output to Container
  target.innerHTML = "";
  target.appendChild(svg);

  // 8. Legend Block Builder
  if (legend.length > 0) {
    const legendContainer = document.createElement("div");
    legendContainer.className = "legend";

    legend.forEach(item => {
      const swatch = document.createElement("span");
      swatch.className = "swatch";

      const chip = document.createElement("span");
      chip.className = "chip";
      chip.style.backgroundColor = typeColors[item.type] || 'var(--ink-mute)';
      chip.style.flexShrink = "0";
      
      const shape = typeShapes[item.type];
      if (shape === 'square') {
        chip.style.borderRadius = "2px";
      } else {
        chip.style.borderRadius = "50%";
      }

      swatch.appendChild(chip);

      const labelText = document.createTextNode(item.label || item.type);
      swatch.appendChild(labelText);

      legendContainer.appendChild(swatch);
    });

    target.appendChild(legendContainer);
  }
}

// Support both ES imports and simple browser scripts
if (typeof window !== 'undefined') {
  window.renderParticleScene = renderParticleScene;
}
