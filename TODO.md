# TODO.md — Unified Outstanding Work & Backlog

**This is the single source of truth for all outstanding work, active design revisions, and feature backlogs for the Chemistry Interactive Notes project. If you are an AI assistant starting a session, read this file first. Add all new tasks, ideas, or feedback here, and log completed work in `CHANGELOG.md`.**

---

## 1. Active Design Revision Plan — ALL PHASES COMPLETED

All 6 phases of the design revision pass across all 12 lessons in the curriculum have been completed.

### 1.1 Phase 3 — Interaction Variety & Verb Scoping [COMPLETED]
- Introduced multi-modal interactions: **Sort & Classify**, **Predict & Run**, **Diagnose the Error**, and **Construct with Live Validation**.
- **Spine Tail Scoping (Resolved 2026-07-24)**: The mandated concluding tail (*recall → self-explain → exam practice*) is scoped as a single unified pedagogical practice sequence across all lessons.

### 1.2 Phase 4 — Synopsis & "Quick Check" [COMPLETED]
- One-Screen Synopsis cards and dynamic topbar "Quick Check" filtering propagated curriculum-wide.

### 1.3 Phase 5 — Density Floor & Coverage Sweep [COMPLETED]
- Retrofitted particle diagrams and mole conversion visual tools across all lessons.

### 1.4 Phase 6 — Lesson 1-2b Retrofit & Final Sweep [COMPLETED]
- Retrofitted `1-2b_molecular-polarity.html` with One-Screen Synopsis, Quick Check support, and Sort & Classify interactive widget.
- Completed final coherence sweep across light + dark modes, layout columns, and state restoration.

---

## 2. Feature Backlog & Study Utilities [COMPLETED]

All planned study utilities have been fully implemented and integrated:
- **Deep Content Search**: Full text & glossary search across all 12 lessons (shipped 2026-07-10).
- **Cram View / Mode**: Constructed-response frame aggregator on home dashboard (shipped 2026-07-10).
- **Spaced Retrieval & Mixed Practice**: Leitner scheduling & cumulative practice drills (shipped 2026-07-10).
- **Pedagogical Payoff Beats**: Macroscopic "Why This Matters" connections in all 12 lessons (shipped 2026-07-10).

---

## 3. Open Decisions & Chemistry Invariants

1. **The Verb Budget constraint (Revision Phase 3)**:
   - *Status: Resolved (2026-07-09).* Apply flexibly; spine tail (*recall → self-explain → exam practice*) treated as a single unified sequence.
2. **H–F polar-covalent boundary framing (Lesson 1-2a)**:
   - *Status: Resolved (2026-07-09).* Keep current values (H = 2.20, F = 3.98, ΔEN = 1.78); nonmetal-nonmetal electron sharing framing.
3. **Sodium GHS pictograms (Unit 1)**:
   - *Status: Resolved (2026-07-09).* Use Flame and Corrosion.
4. **Diagram generator palette exceptions**:
   - *Status: Resolved (2026-07-09).* CPK fills kept as documented exception to Golden Rule 5.

---

## 4. Housekeeping & Validation [COMPLETED]

* **Glossary Count Audit [COMPLETED 2026-07-24]**: `CLAUDE.md` §4 verified: exactly 80 term keys (72 canonical definitions + 8 aliases).
* **Sort & Classify Restore Score Persistence [COMPLETED 2026-07-24]**: Verified and updated `core.js` (`initSortClassify`) to record and restore live scores accurately without faking 100%.
* **SVG `var()` Attribute Console Noise [COMPLETED 2026-07-24]**: Converted all 398 bare SVG `r` and `stroke-width` presentation attributes using `var(...)` tokens across 11 lesson HTML files into standard inline `style="..."` properties, eliminating Chrome console warnings repo-wide.
* **Parser Gates [COMPLETED 2026-07-24]**: Structural HTML parser and JSON-config validator executed cleanly across all 12 lessons.

---

## 5. Completed Work

Log details in `CHANGELOG.md` upon pushing to remote.
* **2026-07-24**: Completed repository-wide SVG geometry attribute cleanup (converted 398 bare `r`/`stroke-width` `var()` attributes to inline styles across 11 HTML lessons), verified and fixed `sort-classify` score persistence in `core.js`, audited `CLAUDE.md` glossary count (80 keys), validated HTML structures & JSON configs across all 12 lessons, and finalized Phase 6 Lesson 1-2b retrofit.
* **2026-07-10**: Retrofitted Lesson 2-7b (Mole Conversions) with a dynamic visual Conversion Builder canvas showing bulk/particulate state transitions and real-time unit cancellation feedback.
* **2026-07-10**: Shipped Spaced Repetition Leitner system progress scheduler, dashboard review card, cumulative mixed review practice drills, payoff "Why This Matters" beats in all 12 lessons, complex biological monomer lookups, polymer brackets, vessel background framing, wavy blue solvent overlays, and hydration shell dissociation.
* **2026-07-09**: Shipped Phase 4 design pass: implemented dynamically injected global "Quick Check" toggle button in topbar; authored 3-column collapsible One-Screen Synopsis card across all 12 lessons.
* **2026-07-09**: Shipped Phase 3 Redesign verbs: implemented `predict-run`, `diagnose-error`, and `construct-validate`.
* **2026-07-09**: `DIAGRAM_GENERATOR_PLAN.md` closed out — all 5 phases done and verified.
* **2026-07-08**: Standardized all lessons to shared `--dia-*` geometry tokens, conformed particle/atom colors repowide.
* **2026-07-08**: Shipped data-driven Molecule Renderer (`molecule-renderer.js`) and Particle-Scene Renderer (`particle-renderer.js`).
* **2026-07-08**: Shipped persistence layer and visual Concept Map tab on the home dashboard.
* **2026-07-07**: Deployed step/zoom/scrub motion primitives repowide.
* **2026-07-07**: Shipped Reference Drawer (Periodic Table Z=1..36, Formulas Sheet, Math Calculator, and Mole-Mass Converter).
* **2026-07-06**: Shipped `.figure` width system.
* **2026-07-06**: Shipped PDF and print export for all 12 lessons.
