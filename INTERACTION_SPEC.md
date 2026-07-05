# INTERACTION_SPEC.md — Widgets & Motion Primitives
## Chemistry Interactive Notes · core.js infrastructure contract

**Status:** Build contract for two infrastructure sessions (see BUILD_PLAN.md). Everything here lives in shared assets (`core.js`, `components.css`), is driven by data attributes and embedded JSON config, and contains zero lesson-specific logic. Lessons consume; they never define behavior inline. This document is the single source of truth for interaction behavior. Visual specs live in Diagram_Inventory_v2.md; student-facing strings live in Content_Expansion_v2.md.

---

## 0 · Design principles (binding)

1. **Retrieval before reveal, always.** No answer, model response, or next step becomes visible until the student has committed something — a selection, a typed response, or a step choice. If a reveal can be reached with zero student input, the widget is broken.
2. **No autoplay, no loops.** Nothing moves unless the student moves it. Motion exists to be controlled (stepped, scrubbed, zoomed), because learner-controlled animation is the only kind that reliably beats static panels.
3. **Reduced motion is a first-class mode.** Under `prefers-reduced-motion: reduce`, every transition becomes an instant state swap and every scrub/zoom presents its discrete states without tweening. No feature may exist only as motion.
4. **Feedback teaches.** Every wrong-choice feedback string is authored content (see VOICE.md Rule 10), passed in config — never a generic default.
5. **Keyboard and touch parity.** Every control operable by keyboard (arrow keys advance steps and scrubs; Enter commits) and by tap. Focus states use the existing token styles.
6. **No persistence.** State is in-memory per page load. No localStorage, no cookies. A review page should be safely re-doable from scratch every visit — resetting on reload is a feature, not a bug. (If persistence is ever wanted, it's a separate decision; do not add it opportunistically.)
7. **Green = correct only.** Existing color rule holds inside widgets: green appears exclusively for verified-correct states; vermilion is the accent and attention color; incorrect states use vermilion outline + feedback text, never red fills that read as punishment. This extends to **revealed-answer boxes**: `.w-reveal-area` (the model-answer/explanation panel every commit-reveal widget shows after commit) and `.scheme-card` (the exam mark-scheme reveal) share one green-bordered pattern — a revealed correct answer is a positive state, not a neutral or attention-getting one. Don't style a static "worked answer" box in vermilion; it reads as an error to students even when nothing is wrong.

---

## 1 · Tier taxonomy

Every visual in the project gets exactly one tier. Diagram_Inventory_v2.md assigns them.

| Tier | Name | Definition | Infrastructure |
|---|---|---|---|
| **T0** | Static | A single SVG state. No controls. | none (SVG conventions per CLAUDE.md) |
| **T1** | Steppable | 2–8 discrete states, student advances/retreats. | step controller |
| **T2** | Scrubbable | A continuous parameter drives a continuous redraw. | scrub controller |
| **T3** | Zoom | Fixed macro→particulate scale levels, student travels between them. | zoom stage |
| **W** | Widget | A task, not a picture. Student commits answers. | widget framework (§3) |

Rules of assignment:
- If the underlying idea is **temporal** (electrons transferring, gas escaping, coefficients rebalancing), minimum T1.
- If the underlying idea is a **continuous relationship** (ΔEN from 0 to 3.5, temperature vs. IMF disruption), T2.
- If the pedagogical point is **scale itself** (macro phenomenon ↔ particle model), T3.
- If the student should be **doing** rather than watching, W — and a W can embed a T1/T2/T3 as its visual.
- When in doubt between T0 and T1: T0. A step control on a diagram with nothing genuinely sequential is friction, not value.

---

## 2 · Motion primitives (core.js)

### 2.1 Step controller — `data-motion="step"`

Container holds N state layers (SVG groups or stacked elements), each tagged `data-step="1"…"N"`, authored as **direct children** of the `data-motion="step"` element (don't wrap them in an intermediate flex/sizing div — `core.js` normalizes into its own stage regardless, but starting clean avoids leftover styling on an emptied wrapper).

**This is the only approved way to sequence a diagram.** Never show every frame at once in a `flex-wrap`/grid layout with opacity toggling — frames must occupy the *same physical space* and crossfade, never stack side-by-side or reserve dead space when hidden.

Mechanism: on init, `core.js` measures each frame's natural height (while still in normal flow, before any positioning is applied), moves all frames into an internal `.step-stage` wrapper sized to the tallest frame, and switches every frame to `position:absolute; inset:0` so exactly one is visible at a time in that fixed-height stage. The step-controls bar (prev/next, dots, label) renders below the stage as a normal in-flow element.

Controls rendered by core.js: prev / next buttons, progress dots (one per state, current filled), optional per-step label line. Keyboard: ← →. On mobile, buttons are the primary control (no swipe requirement).

Config via data attributes: `data-step-count`, `data-step-start` (default 1), `data-step-labels` (optional, `|`-separated).

Transition: crossfade between layers (opacity + visibility, ~300 ms); instant swap under reduced motion. States must each be complete and honest on their own — a student who screenshots step 3 gets a correct diagram.

Minimal example:
```html
<div data-motion="step" data-step-count="3" data-step-labels="before|during|after" style="max-width:540px;margin:2rem auto;">
  <div data-step="1"><svg …>…</svg></div>
  <div data-step="2"><svg …>…</svg></div>
  <div data-step="3"><svg …>…</svg></div>
</div>
```

### 2.2 Scrub controller — `data-motion="scrub"`

A slider bound to a parameter that drives a redraw function. Because widgets are generalized, the redraw functions are a registry in core.js keyed by name: `data-scrub-fn="den-cloud"` etc. Each lesson visual that needs a scrub registers its draw function in the shared asset (one function per visual family, parameterized).

Config: `data-scrub-min`, `data-scrub-max`, `data-scrub-step`, `data-scrub-value` (initial), `data-scrub-label` (the parameter name shown), optional `data-scrub-marks` (labeled tick positions, e.g. `0.5:polar threshold|1.7:ionic threshold`).

Behavior: slider drag redraws continuously (throttled to animation frame). Keyboard: arrows move one step, Home/End jump to ends. Under reduced motion: identical (a user-driven scrub is already motion-on-demand), but any easing/tween between redraws is removed.

Scrubs can carry **targets**: `data-scrub-target="1.7"` + a prompt line renders a "find the value" micro-task — the slider handle shows a subtle confirm state when within tolerance. This turns watching into retrieval (e.g., "scrub to the ΔEN where sharing becomes transfer").

### 2.3 Zoom stage — `data-motion="zoom"`

Fixed scale levels (2 or 3), each a prepared SVG layer: **macro** (the phenomenon: tawa, bottle, teaspoon), optional **meso** (the material: crystal, surface, droplet), **particulate** (the `.d-*` particle panel, obeying all CLAUDE.md conventions).

Controls: a vertical scale rail on the side of the stage labeled with the levels (e.g., "what you see / what's there"), click/tap a level or drag the rail handle. Transition: simultaneous scale+crossfade (350 ms) from a `data-zoom-anchor` point on the macro layer (the region being magnified gets a vermilion dashed ring during transit so students see *where* the particle view lives inside the macro view). Reduced motion: instant swap, ring shown statically on the macro layer.

Rule: the particulate layer is a full citizen of the particle conventions — legend, conservation, phase markers. The zoom does not exempt it.

Config: `data-zoom-levels` (2 or 3), `data-zoom-labels`, `data-zoom-anchor` (x,y,r on the macro viewBox).

**Rail label constraint:** the rail buttons are 32px circles — `data-zoom-labels` entries must be a single glyph, digit, or 2–3 character abbreviation (e.g. "1×", "4×", "•••"), never a phrase. Put the descriptive phrase (e.g. "in the spoon") in the caption/prose beside the stage instead; long text in `data-zoom-labels` overflows the circle illegibly.

---

## 3 · Widget framework

All four widgets share a shell: a `<section>`-level container `data-widget="…"`, config in a child `<script type="application/json" class="w-config">` block, and shared machinery for commit gating, feedback rendering, and reset. Every widget renders a **Reset** control. All student-facing strings come from config — no defaults in code except structural labels ("Check", "Next", "Reset", "Show model answer").

### 3.1 Commit-before-reveal — `data-widget="commit-reveal"`

**Purpose:** Hard retrieval gate on every predict and exam section. Replaces any tap-to-reveal.

**Modes:**
- `choice` — 2–5 options rendered as buttons. Reveal is locked until one is selected. On reveal: the chosen option is marked, the correct option is marked (green), and the feedback string **for the chosen option** renders above the general reveal text. Every option, including the correct one, has its own feedback string in config.
- `free` — a textarea with `minChars` (default 25). Reveal button stays disabled until threshold met. **The gate must never surface as a character count or cap** ("12 / 30 characters" reads as a restriction) — show a soft, non-numeric hint instead (`w-progress-hint`: empty while untouched, "Keep going…" below threshold, "Ready" once met). On reveal: student text remains visible above the model text so they can compare line by line. This mode also replaces the existing self-explain "compare with model answer" pattern, unifying it.
- `drill` — a sequence of `choice` items presented one at a time with a running tally (n of N). Used for classification practice (e.g., reaction types). Tally is session-only.

**Config schema (choice):**
```json
{
  "mode": "choice",
  "prompt": "…",
  "options": [
    {"label": "…", "correct": false, "feedback": "…"},
    {"label": "…", "correct": true,  "feedback": "…"}
  ],
  "reveal": "…full teaching text, may include HTML…"
}
```

**States:** unanswered → committed → revealed. No re-answer after reveal (Reset returns to unanswered).

### 3.2 Faded worked example — `data-widget="faded-example"`

**Purpose:** The bridge between concept and independent retrieval. A fully worked **model case** paired with a parallel **your-turn case** where designated steps are blanked. This is the standard conversion for every v1 `[BRIDGE]`.

**Layout:** Two panels. Desktop: side by side (model left, your-turn right, steps row-aligned so the parallel structure is visible). Mobile: model first as a collapsible ("show the worked example"), then your-turn.

**Model panel:** every step shown as `step label → work → decision note` (the "why this move" sentence per VOICE.md).

**Your-turn panel:** each step is either `given` (rendered as text) or `blank`. Blank types:
- `numeric` — input with tolerance (`answer`, `tol`)
- `text` — input with accepted-answers array (case-insensitive, trimmed)
- `choice` — 2–4 inline option buttons

Each blank checks individually on commit (per-step "Check" or a single "Check all" — config flag `checkMode: "step" | "all"`; default `step`, because immediate per-step feedback keeps the student from compounding an early error). Wrong answer: vermilion outline + that blank's authored feedback + retry allowed (max 2 retries, then the answer shows with its feedback so the student can continue — a stuck student who quits learns less than one who's shown step 3 and completes steps 4–6).

**Config schema:**
```json
{
  "model": {
    "title": "…", 
    "steps": [{"label": "…", "work": "…", "why": "…"}]
  },
  "yours": {
    "title": "…",
    "steps": [
      {"label": "…", "given": "…"},
      {"label": "…", "blank": {"type": "numeric", "answer": 26, "tol": 0, "prompt": "…", "feedback_wrong": "…", "feedback_right": "…"}}
    ]
  }
}
```

### 3.3 Fillable scaffold — `data-widget="scaffold"`

**Purpose:** Structured multi-slot responses: the C-SPA five-step argument, BCA tables, molar-mass ledgers, atom-inventory ledgers. The structure is the scaffold; the student supplies the content.

**Modes:**
- `bank` — a statement bank; student taps/drags statements into slots. Distractor statements allowed (config marks them). Check marks each slot right/wrong; wrong slots return their statement to the bank with feedback. (This generalizes the existing C-SPA explorer's argument builder — refactor that lesson to consume this widget rather than bespoke code, when that lesson is next touched.)
- `free` — each slot is a textarea with its own model answer; on "Compare," each slot shows its model text beneath the student's, slot by slot (not one undifferentiated model blob — the per-slot pairing is the point).
- `table` — a grid of cells (rows × columns, headers from config), each cell `given` or `blank` (numeric/text as in §3.2). Built for BCA tables and calculation ledgers. Supports a per-column or per-row check.

**Layout:** slots render with their scaffold labels prominent (IBM Plex Mono) and connective arrows where the config declares a chain (`chain: true` draws the → connectors between slots, matching the argument-chain diagram language).

### 3.4 Step-through builder — `data-widget="step-builder"`

**Purpose:** Multi-step procedures where the *next move* is the thing being learned: Lewis structure construction, equation balancing. A step controller (T1) with a decision gate at each step.

**Behavior per step:** current state of the visual (SVG layer, as in §2.1) + a question ("Carbon has 4 electrons and needs 8. What's the move?") + 2–3 option buttons. Correct choice: brief confirm + advance (the visual transitions to the next state). Wrong choice: authored feedback, retry. After 2 wrong tries: the correct choice highlights with its feedback and a "continue" affordance.

**Difference from faded-example:** faded-example fades a *parallel case* after a worked model; step-builder gates the *canonical walkthrough itself*. Use step-builder for the first full walkthrough of a procedure, faded-example for the second pass.

**Config schema:**
```json
{
  "steps": [
    {
      "state": "svg-layer-id",
      "question": "…",
      "options": [
        {"label": "…", "correct": true, "feedback": "…"},
        {"label": "…", "correct": false, "feedback": "…"}
      ]
    }
  ],
  "finale": "…text shown on completion…"
}
```

---

## 4 · Accessibility & QA (all widgets and primitives)

- All controls are `<button>`/`<input>` elements, never click-handling divs.
- Live feedback regions use `aria-live="polite"`.
- SVG state layers get `role="img"` + per-state `aria-label` describing the state (author these in the inventory specs).
- Focus is moved to feedback on commit, and to the new state label on step advance.
- Touch targets ≥ 44 px.
- Playwright checks per widget (add to the existing screenshot harness): (a) reveal unreachable without commit; (b) reduced-motion mode renders all states; (c) keyboard-only completion of one full instance; (d) reset returns to pristine state.

## 5 · Definition of done for the infrastructure sessions

Session complete when: all four widgets + three motion primitives exist in `core.js`/`components.css`; a test page (`lessons/_widget-test.html`) instantiates every widget mode and every primitive with dummy config; all Playwright checks in §4 pass on the test page; zero lesson-specific strings or logic exist in the shared assets.
