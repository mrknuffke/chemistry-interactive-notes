# TODO.md — Unified Outstanding Work & Backlog

**This is the single source of truth for all outstanding work, active design revisions, and feature backlogs for the Chemistry Interactive Notes project. If you are an AI assistant starting a session, read this file first. Add all new tasks, ideas, or feedback here, and log completed work in `CHANGELOG.md`.**

---

## 1. Active Design Revision Plan — PENDING PHASES

These tasks represent remaining phases of the Semester 1 design pass to improve interaction variety and notes usability. Reference spec: `REVISION_PLAN.md` (deleted/archived 2026-07-08).

### 1.1 Phase 3 — Break the Interaction Monotony
Currently, retrieval sections rely on the same physical interaction: *produce something → click check → reveal*. We need to introduce a wider variety of physical actions:
1. **Sort & Classify**: Drag items into categorical bins (e.g., classifying reaction types, sorting physical vs. chemical changes, grouping polar vs. nonpolar molecules).
2. **Predict & Run**: Commit a prediction first, then run a simulation model where the visual particle representation *is* the feedback, rather than a block of text.
3. **Diagnose the Error**: Show a common incorrect student solution (such as a wrong Lewis structure or unbalanced equation) and have the student find/diagnose the mistake.
4. **Construct with Live Validation**: Build an configuration, formula, or structure with real-time valence, charge, or octet alerts as they assemble it.
* **The Verb Budget Constraint**: No more than two consecutive sections in a lesson may share the same interaction verb. Every lesson must have at least one dynamic `manipulate → observe consequence` interactive.
* **Sequencing**: Build a reference redesign in one lesson (such as `2-7a` or `C-RXN`), obtain author approval on the feel, then propagate across the remaining 11 lessons.
* **Propagation progress**: `C-RXN` (reference, 2026-07-09) and `2-2a` (physical-vs-chemical sort drill, 2026-07-09) have Sort & Classify. Remaining candidates: `1-2b` (polar vs. nonpolar — fold into the Phase 6 retrofit), plus Diagnose-the-Error and Construct-with-Live-Validation verbs, which have no implementation yet.
* **Open note (spine tail)**: every lesson's mandated recall → self-explain → exam tail is three consecutive produce-check sections; decide whether the verb budget counts these as one verb or whether the tail needs its own variety treatment before propagating further.

### 1.2 Phase 4 (Remaining) — Synopsis & "Quick Check"
While the persistence layer is complete, we still need features that make the lessons functional as returning *study notes* rather than a linear, one-time textbook:
* **One-Screen Synopsis**: Place a collapsed element at the top of every lesson outlining its 3–5 core claims, displaying the primary visual figure, and listing a retrieval checklist.
* **"Quick Check" Path**: Add a toggle button at the top of the lesson that filters out narrative prose, collapsing the page down strictly to the interactive retrieval widgets for quick spaced review.

### 1.3 Phase 5 — Density Floor & Coverage Sweep
* **Visual Density Audit**: Every section discussing particulate/atomic-level chemistry must have a corresponding particle diagram. 
* **Target Lesson**: Retrofit `2-7b` (Mole Conversions), which currently has **0 SVGs**, to include standardized particle diagrams for the conversion paths.

### 1.4 Phase 6 — Lesson 1-2b Retrofit & Final Sweep
* **Lesson 1-2b Retrofit**: Retrofit `1-2b_molecular-polarity.html` (built before the design revision pass) to the unified standards (synopsis, verb budget, quick check).
* **Final Coherence QA**: Render all 12 lessons in light + dark modes, verify the figure widths match the layout column, and check that all widgets restore state correctly.

---

## 2. Feature Backlog & Study Utilities

These are forward-looking capability ideas. They respect the project ethos: **zero-build, shared-asset, no backend, local-only (localStorage).**

### 2.1 Spaced Retrieval & Practice
* **Scheduled Spaced Retrieval**: Add a "Review Due Today" mode on the index dashboard (`index.html`) that pulls questions the student previously missed or needs to retrieve based on spacing algorithms.
* **Cumulative / Interleaved Practice**: Create a "Mixed Review" practice mode that samples retrieval items randomly across all 12 lessons.

### 2.2 Pedagogical Reinforcements
* **Payoff Beats**: Add a closing "why this matters" payoff beat to the end of each lesson—connecting the core chemistry reasoning to a real-world macroscopic phenomenon without adding heavy narrative baggage.

### 2.3 Index Study Utilities
* **Deep Content Search**: Upgrade the search filter on `index.html` to index and search glossary terms (`glossary.js`) and actual section texts inside the HTML files, rather than only matching titles and hardcoded card tags.
* **Cram View**: Add a toggle on the index or within lessons to collapse a lesson strictly down to its constructed-response exam questions and mark schemes.

---

## 3. Open Decisions & Chemistry Invariants

Verify these curriculum decisions and rules before starting work on their respective areas:

1. **The Verb Budget constraint (Revision Phase 3)**:
   - *Status: Resolved (2026-07-09).* Apply flexibly: allow exceptions for short lessons (under 4 sections) where forcing three distinct verbs might feel contrived.
2. **H–F polar-covalent boundary framing (Lesson 1-2a)**:
   - *Status: Resolved (2026-07-09).* Keep current values (H = 2.20, F = 3.98, ΔEN = 1.78) and explain that because both are nonmetals, they share electrons (polar covalent) despite being above the 1.7 threshold (already implemented).
3. **Sodium GHS pictograms (Unit 1)**:
   - *Status: Resolved (2026-07-09).* Use **Flame** (Flammable/Water-Reactive) and **Corrosion** (Corrosive to skin/eyes). Added details to [1-1b_periodic-trends-reactivity.html](file:///Users/dknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/1-1b_periodic-trends-reactivity.html).

---

## 4. Housekeeping & Validation

* **Glossary Count Comment Drift**: `CLAUDE.md` §4 lists the glossary as having 80 entries. Verify this count whenever modifying `scaffold/assets/glossary.js` (there is no automated check).
* **Sort & Classify restore fakes a perfect score**: the persistence restore path in `core.js` (`initSortClassify`, "Assume perfect score on complete restore") shows a completed drill as N/N on reload even if the live run scored lower. Either persist the real score in the checkpoint payload or drop the score line from the restored state.
* **SVG `var()` attribute console noise**: every lesson using `--dia-*` radius/stroke tokens as bare SVG attributes (e.g. `r="var(--dia-r-atom)"`, repo-wide since the diagram-token pass) makes Chrome log an "Expected length" error per circle — ~270 on 2-2a alone. Rendering is unaffected (the SVG2 presentation-attribute → CSS path resolves the token), so this is cosmetic; fix would be setting geometry via inline `style` or a stylesheet rule instead of attributes.
* **Parser Gates**: Run the structural HTML parser and JSON-config validator across all 12 lessons after modifying layout files to prevent DOM corruption.

---

## 5. Completed Work

Log details in `CHANGELOG.md` upon pushing to remote.
* **2026-07-08**: Standardized all lessons to shared `--dia-*` geometry tokens, conformed particle/atom colors repowide, and resolved Chrome text-size bugs.
* **2026-07-08**: Shipped data-driven Molecule Renderer (`molecule-renderer.js`) and Particle-Scene Renderer (`particle-renderer.js`), with test coverage in `_widget-test.html`.
* **2026-07-08**: Shipped persistence layer (state restoration and scroll-to-last-checkpoint on reload) and visual Concept Map tab on the home dashboard.
* **2026-07-07**: Deployed step/zoom/scrub motion primitives repowide.
* **2026-07-07**: Shipped Reference Drawer (Periodic Table Z=1..36, Formulas Sheet, Math Calculator, and Mole-Mass Converter).
* **2026-07-06**: Shipped `.figure` width system.
* **2026-07-06**: Shipped PDF and print export for all 12 lessons.
