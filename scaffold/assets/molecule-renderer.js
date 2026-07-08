/**
 * Chemistry Interactive Notes - Shared Molecule Renderer
 * Programmatically renders chemical structures in SVG using project tokens and design rules.
 */

(function () {
  const SVGNS = "http://www.w3.org/2000/svg";

  // Helper to create SVG elements
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

  // Get style attributes for a given element symbol
  function getAtomStyle(el) {
    if (el === "H") {
      return {
        radius: 5,
        rToken: "var(--dia-r-atom-sm)",
        fill: "#ffffff",
        textFill: "var(--ink)",
        strokeWidth: "var(--dia-stroke)",
        textSize: "var(--dia-caption-size)",
        dy: 2.2
      };
    } else if (el === "O") {
      return {
        radius: 7.5,
        rToken: "var(--dia-r-atom)",
        fill: "var(--accent)",
        textFill: "#ffffff",
        strokeWidth: "var(--dia-stroke-bond)",
        textSize: "var(--dia-label-size)",
        dy: 2.8
      };
    } else {
      return {
        radius: 7.5,
        rToken: "var(--dia-r-atom)",
        fill: "var(--ink-mute)",
        textFill: "#ffffff",
        strokeWidth: "var(--dia-stroke-bond)",
        textSize: "var(--dia-label-size)",
        dy: 2.8
      };
    }
  }

  // Normalize angle to [0, 2 * PI)
  function normalizeAngle(angle) {
    let a = angle % (2 * Math.PI);
    if (a < 0) a += 2 * Math.PI;
    return a;
  }

  // Calculate lone pair angles based on existing bond angles
  function getLonePairAngles(bondAngles, numPairs) {
    const P = numPairs;
    if (P <= 0) return [];

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

    // Sort existing bond angles in ascending order
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
    const spacing = Math.min(0.65, maxGapSize / (P + 1));
    const angles = [];
    for (let k = 0; k < P; k++) {
      angles.push(normalizeAngle(gapMid + (k - (P - 1) / 2) * spacing));
    }
    return angles;
  }

  const MoleculeRenderer = {
    /**
     * Renders a molecule described by a JSON data model into an SVG container.
     * @param {Object} data - The molecule data (atoms, bonds, lonePairs).
     * @param {SVGElement|string} target - The SVG element or selector to render into.
     * @param {Object} options - Custom options (e.g. scale, padding).
     */
    render(data, target, options = {}) {
      const scale = options.scale || 35;
      const padding = options.padding || 20;

      // Resolve SVG element
      let svg = typeof target === "string" ? document.querySelector(target) : target;
      if (!svg || svg.tagName.toLowerCase() !== "svg") {
        svg = createSVGElement("svg");
      }

      // Clear existing content
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      // Explicitly set preserveAspectRatio as per DIAGRAM_CONTRACT.md
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

      if (!data || !data.atoms || data.atoms.length === 0) {
        return svg;
      }

      // 1. Calculate scaled coordinates and build atom index
      const atomMap = {};
      const scaledAtoms = data.atoms.map(atom => {
        const style = getAtomStyle(atom.el);
        const scaled = {
          id: atom.id,
          el: atom.el,
          x: atom.x * scale,
          y: atom.y * scale,
          style: style
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

      // Define viewBox bounds based on layout
      const boxW = (maxX - minX) + 2 * padding;
      const boxH = (maxY - minY) + 2 * padding;
      const viewBoxX = minX - padding;
      const viewBoxY = minY - padding;
      svg.setAttribute("viewBox", `${viewBoxX} ${viewBoxY} ${boxW} ${boxH}`);

      // 3. Draw Bonds first (so they sit underneath the atom circles)
      if (data.bonds) {
        data.bonds.forEach(bond => {
          const atomA = atomMap[bond.a];
          const atomB = atomMap[bond.b];
          if (!atomA || !atomB) return;

          const dx = atomB.x - atomA.x;
          const dy = atomB.y - atomA.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len === 0) return;

          // Unit vectors along and perpendicular to the bond axis
          const ux = dx / len;
          const uy = dy / len;
          const nx = -uy;
          const ny = ux;

          // Mathematically clip coordinates to atom edges (DIAGRAM_CONTRACT.md)
          const rA = atomA.style.radius;
          const rB = atomB.style.radius;

          const x1 = atomA.x + ux * rA;
          const y1 = atomA.y + uy * rA;
          const x2 = atomB.x - ux * rB;
          const y2 = atomB.y - uy * rB;

          const order = bond.order || 1;

          if (order === 1) {
            // Single bond
            svg.appendChild(createSVGElement("line", {
              x1: x1.toFixed(1),
              y1: y1.toFixed(1),
              x2: x2.toFixed(1),
              y2: y2.toFixed(1),
              stroke: "var(--ink-mute)",
              "stroke-width": "var(--dia-stroke-bond)"
            }));
          } else if (order === 2) {
            // Double bond - two parallel lines offset by 2.2px using the thinner stroke
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
            // Triple bond - center line + two offset lines
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

      // 4. Draw Lone Pairs
      if (data.lonePairs) {
        data.lonePairs.forEach(lp => {
          const atom = atomMap[lp.on];
          if (!atom) return;

          // Find all bond angles connected to this atom
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

          // Compute lone pair distribution angles
          const angles = getLonePairAngles(bondAngles, lp.count);
          const rA = atom.style.radius;
          const lpDist = rA + 4.5; // Positioning offset outside the bonding path
          const dotSpacing = 3.5; // Spacing within the pair
          const halfSpacing = dotSpacing / 2;

          angles.forEach(alpha => {
            // Radial center of the lone pair
            const lpx = atom.x + lpDist * Math.cos(alpha);
            const lpy = atom.y + lpDist * Math.sin(alpha);

            // Perpendicular direction vector
            const px = -Math.sin(alpha);
            const py = Math.cos(alpha);

            // Draw the two dots of the pair
            const dots = [
              { x: lpx + px * halfSpacing, y: lpy + py * halfSpacing },
              { x: lpx - px * halfSpacing, y: lpy - py * halfSpacing }
            ];

            dots.forEach(d => {
              svg.appendChild(createSVGElement("circle", {
                cx: d.x.toFixed(1),
                cy: d.y.toFixed(1),
                r: "var(--dia-r-particle)", // small dot token
                fill: "var(--accent)" // solid accent fill
              }));
            });
          });
        });
      }

      // 5. Draw Atoms (circles and element labels)
      scaledAtoms.forEach(atom => {
        const style = atom.style;

        // Draw outer circle
        svg.appendChild(createSVGElement("circle", {
          cx: atom.x.toFixed(1),
          cy: atom.y.toFixed(1),
          r: style.rToken,
          fill: style.fill,
          stroke: "var(--ink)",
          "stroke-width": style.strokeWidth
        }));

        // Draw element symbol label inside
        const text = createSVGElement("text", {
          x: atom.x.toFixed(1),
          y: (atom.y + style.dy).toFixed(1),
          "text-anchor": "middle",
          fill: style.textFill,
          "font-family": "var(--mono)",
          "font-weight": "700",
          "font-size": style.textSize // Ensures style="font-size: var(...)" is set inside createSVGElement
        });
        text.textContent = atom.el;
        svg.appendChild(text);
      });

      return svg;
    }
  };

  // Export to global scope
  window.MoleculeRenderer = MoleculeRenderer;
})();
