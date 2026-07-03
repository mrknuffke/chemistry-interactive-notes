# BUILDING.md — per-lesson build checklist (handoff)

Read `CLAUDE.md` first — it is the contract. This file is the short, checkable
loop for building one lesson. `lessons/1-1b_*` is the reference exemplar: match it.
Work **one lesson at a time** in the session order defined in [BUILD_PLAN.md](file:///Users/dknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/BUILD_PLAN.md).

## Before writing
- [ ] Read the relevant review sheet in `References/` (Unit 1 / Unit 2 Review Sheet). List its sub-targets. That sheet — NOT the consensus notes — is the content source of truth.
- [ ] Read the lesson's block in [Content_Expansion_v2.md](file:///Users/dknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/Content_Expansion_v2.md) and [Diagram_Inventory_v2.md](file:///Users/dknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/Diagram_Inventory_v2.md).
- [ ] Confirm scope against the manifest in `CLAUDE.md` (which PEs, what's explicitly excluded — e.g. no VSEPR headline, no empirical formula).
- [ ] Verify the storyline/context is kept light and tangential. Ensure that chemical explanations and examples work for any student, even if they are unfamiliar with the specific story context.
- [ ] Draft the section outline (hook → re-narration → interactive(s) → predict-reveal → recall → self-explain → exam) and get it signed off.

## While writing
- [ ] HTML links `../assets/tokens.css` + `../assets/components.css`; ends with `../assets/core.js`, then `../assets/elements.js` (if it needs element data), then `<id>.js`. Lesson-specific JS goes ONLY in `lessons/<id>.js` and must guard `if (!el) return;`.
- [ ] **Never re-type periodic data.** Read it from `window.GC_ELEMENTS` (`assets/elements.js`). If you need a value that isn't there, add it there (verified), don't inline it in a lesson.
- [ ] **Follow the Widget & Motion contracts (INTERACTION_SPEC.md):** 
  - Reuse general widgets: `commit-reveal`, `faded-example`, `scaffold`, `step-builder`.
  - Reuse motion controllers: `step`, `scrub`, `zoom`.
  - Do NOT copy-paste widget behaviors or write inline interactive logic that belongs in `core.js` / `components.css`. Configure widgets via the JSON `<script class="w-config">` pattern.
  - Implement full keyboard (arrows/Enter) and touch parity.
  - Ensure zero persistence (state resets on reload).
- [ ] **Concept-before-definition & term styling:** Explain concepts in plain English *before* naming them. Wrap defined terms in `<strong class="term">` tags for visual focus and indexing.
- [ ] Each `<section>` has `data-toc="Label"` and ends in a `data-next` button; sections numbered `01…NN` via `.section-tag .num`.

## Non-negotiables (visual + chemical)
- [ ] No LaTeX formatting (e.g., $H_2$, $O_2$). Use standard HTML tags (e.g., `<sub>`, `&Delta;`, `–` or `&ndash;`) for formulas and math expressions.
- [ ] Ensure static diagrams are sufficiently sized (e.g., `.compass-wrap`, `.single-atom-wrap`, `.octet-wrap` or inline `max-width: 480px`/`580px`) and verified to work with the global Lightbox overlay zoom feature.
- [ ] ONE accent (vermilion). Green = correct/positive ONLY. Sequential heat-maps use cool→pale→hot; CATEGORICAL data uses the vermilion/green split. No new hues.
- [ ] Fonts: Hanken Grotesk (display) / Spectral (prose) / IBM Plex Mono (data).
- [ ] Particle diagrams obey the `References/` posters: filled-circle particles (square = metal), dashed before→after frame, solid walls + blue wavy water, **conserve atom counts**, motion = brackets(s)/lumps(l)/tails(g). 
  - **Note:** Energy-bar diagrams are deferred to Unit 3 (next unit) and MUST NOT be used in Unit 2. Use only particle diagrams. ALWAYS a legend.
- [ ] **Honest > pretty.** Don't stage a diagram you can't make chemically correct, and don't bolt on a poster convention where it isn't honest (e.g. no energy bars / phase motion in an atomic-structure lesson).
- [ ] **Follow the Voice Contract (VOICE.md):** 
  - Direct, slightly wry, second-person register ("you"). 
  - Predict misconceptions/wrong moves by name.
  - No throat-clearing openings (e.g. "It is important to note").
  - Keep storylines/contexts light and tangential.

## Before declaring done
- [ ] **Verify every value** that reaches a student (configs, ΔEN, molar masses, balanced equations). Check it — don't trust a plausible number.
- [ ] **VOICE.md §6 QA pass:**
  1. Read every paragraph aloud. Rewrite anything that doesn't sound like a teacher speaking directly to one student.
  2. Verify zero hits on the hard banned list (e.g., "Note that", "serves to", "Remember that").
  3. Ensure at least one named misconception or trap per concept section.
  4. Confirm all wrong-answer feedback strings explain the temptation rather than just stating correctness.
- [ ] **Interaction QA checks:**
  - Verify that reveal outputs are locked and unreachable without committing an answer first.
  - Verify `prefers-reduced-motion: reduce` behavior (transitions instant, no eases).
  - Check that the page resets cleanly on reload.
- [ ] Open the lesson file in a browser (using a local server) and test it thoroughly in both **light and dark modes**. Ensure all interactive widgets, layouts, and animations display correctly.
- [ ] Verify there are no console errors or warnings in the browser developer tools.

