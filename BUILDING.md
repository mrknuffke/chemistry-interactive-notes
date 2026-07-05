# BUILDING.md — Per-Lesson Build Checklist (Handoff)

Read `CLAUDE.md` first — it is the contract. All code changes should strictly adhere to the [LLM Behavioral Guidelines](CLAUDE.md#1-behavioral-guidelines-reduce-common-llm-coding-mistakes). This file is the checkable build loop for building or updating a lesson. `lessons/1-1b_*` and `lessons/1-1a_*` (inside `scaffold/lessons/`) are the two worked exemplars: match them. Work **one lesson at a time**.

---

## Before Writing
- [ ] Open the lesson's **review sheet** in `scaffold/References/` (Unit 1 / Unit 2 Review Sheet). List its sub-targets. That sheet — NOT the consensus notes — is the content source of truth.
- [ ] Confirm scope against the manifest in `CLAUDE.md` (which PEs, what's explicitly excluded — e.g. no VSEPR headline, no empirical formula).
- [ ] Verify the storyline/context is kept light and tangential. Ensure that chemical explanations and examples work for any student, even if they are unfamiliar with the specific story context.
- [ ] Draft the section outline (hook → re-narration → interactive(s) → predict-reveal → recall → self-explain → exam) and get it signed off.

---

## While Writing
- [ ] HTML links `../assets/tokens.css` + `../assets/components.css` (relative to `scaffold/lessons/`); ends with `../assets/core.js`, then `../assets/glossary.js`, then `../assets/elements.js` (if it needs element data), then `<id>.js`. Lesson-specific JS goes ONLY in `scaffold/lessons/<id>.js` and must guard `if (!el) return;`.
- [ ] **Never re-type periodic data.** Read it from `window.GC_ELEMENTS` (served from `scaffold/assets/elements.js`). If you need a value that isn't there, add it there (verified), don't inline it in a lesson.
- [ ] Reuse shared classes: `.interactive` frame, `.readout`, retrieval widgets (`data-predict`/`data-reveal`, `.recall`/`.blank`, `data-peek`, `data-scheme`), and the `.d-*` / `.atom-*` diagram classes. If you'd copy a style/behavior between two lessons, lift it into `scaffold/assets/components.css` / `scaffold/assets/core.js`.
- [ ] **Concept-before-definition & term styling:** Explain concepts in plain English *before* naming them. Wrap defined terms in `<strong class="term">` — this triggers the hover tooltip from `glossary.js`. For every term you wrap, confirm its slug exists in `scaffold/assets/glossary.js` (key = lowercase, spaces→hyphens, punctuation stripped). Add a new entry if it's missing. Use `data-term="slug"` when the visible text doesn't normalize to the right key.
- [ ] Each `<section>` has `data-toc="Label"` and ends in a `data-next` button; sections numbered `01…NN` via `.section-tag .num`.

---

## Non-Negotiables (Visual + Chemical)
- [ ] No LaTeX formatting (e.g., $H_2$, $O_2$). Use standard HTML tags (e.g., `<sub>`, `&Delta;`, `–` or `&ndash;`) for formulas and math expressions.
- [ ] Ensure static diagrams are sufficiently sized (e.g., `.compass-wrap`, `.single-atom-wrap`, `.octet-wrap` or inline `max-width: 480px`/`580px`) and verified to work with the global Lightbox overlay zoom feature.
- [ ] ONE accent (vermilion). Green = correct/positive ONLY. Sequential heat-maps use cool→pale→hot; CATEGORICAL data uses the vermilion/green split. No new hues.
- [ ] Fonts: Hanken Grotesk (display) / Spectral (prose) / IBM Plex Mono (data).
- [ ] Particle diagrams obey the `scaffold/References/` posters: filled-circle particles (square = metal), dashed before→after frame, solid walls + blue wavy water, **conserve atom counts**, motion = brackets(s)/lumps(l)/tails(g).
      *Note: Energy-bar diagrams are deferred to Unit 3 (next unit) and MUST NOT be used in Unit 2. Use only particle diagrams. ALWAYS a legend.*
- [ ] **Honest > pretty.** Don't stage a diagram you can't make chemically correct, and don't bolt on a poster convention where it isn't honest (e.g. no energy bars / phase motion in an atomic-structure lesson).

---

## Before Declaring Done
- [ ] **Verify every value** that reaches a student (configs, ΔEN, molar masses, balanced equations). Check it — don't trust a plausible number.
- [ ] Open the lesson file in a browser (using a local server) and test it thoroughly in both **light and dark modes**. Ensure all interactive widgets, layouts, and animations display correctly.
- [ ] No console errors or warnings in the browser developer tools.
