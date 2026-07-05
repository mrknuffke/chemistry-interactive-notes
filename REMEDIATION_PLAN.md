# REMEDIATION_PLAN.md — Consistency Pass Across Lessons

**Status: ✅ COMPLETE — implemented and browser-verified 2026-07-05.** Every item below is done. Nothing from this plan is outstanding. See "What's left" at the very bottom for the only two follow-ups, both outside this plan's original scope.
**Implementer:** Sonnet (author sign-off on the plan: Opus, same date). **Future reference:** Gemini and any later model — this file is the record of what was found and fixed; read it before touching any of the files it names.
**Reference build:** `scaffold/lessons/1-1b_periodic-trends-reactivity.html` — the most rigorously styled page; when in doubt, match it.

This plan came out of a full author review of the redone pages. The key finding: **most complaints are three or four systemic bugs surfacing on many pages, not dozens of independent ones.** Fix the shared assets and the guideline docs first — that kills them everywhere and stops them recurring. Then do the deep per-page work.

Two author decisions were baked in and implemented as specified:
- Free-text gate → **soft progress hint** (no numeric character count ever shown). ✅
- 2-7a formula parser → **broadened to accept all of `elements.js` (Z=1–36)**. ✅

---

## Root causes (traced to real code, not guesses) — all fixed

| Observation | Real cause | Location | Status |
|---|---|---|---|
| Click-through diagrams "stack one on top of the next" / dead space | A proper crossfade stepper (`data-motion="step"`) exists and works, but its `[data-step]` layers aren't `position:absolute`, so hidden frames still reserve vertical space. And it's used in only ONE place repo-wide (C-RXN). The other "click-through" diagrams are ad-hoc `flex-wrap` grids that show every frame at once. | `scaffold/assets/components.css:1493`, `scaffold/assets/core.js:1528` | ✅ Fixed (A1) |
| Recall shows line breaks mid-formula (CO / 2 / and H / 2 / O) | `.st-fields label` is `display:flex`. In a flex container every inline `<sub>` becomes its own flex item → its own line. Any formula in a recall prompt shatters. | `scaffold/assets/components.css:252` | ✅ Fixed (A4) |
| Balancer: heavier side floats up; adding mass makes a side lighter | Tilt sign inverted. `diff = leftMass - rightMass` rotates the heavy side up. | `scaffold/lessons/C-RXN.js:302` | ✅ Fixed |
| "Character limit — 0/30 characters, don't restrain students" | It's actually a MINIMUM gate (commit-before-reveal needs ≥ N chars), but the "0 / 30 characters" readout reads like a cap. | `scaffold/assets/core.js:633` | ✅ Fixed (A3) |
| Diagram won't lightbox (1-1a §8, 2-7a images) | Lightbox binds only `.diagram svg`. Anything not wrapped in `.diagram` (or an `<img>`) gets nothing. | `scaffold/assets/core.js:266` | ✅ Fixed (A2) |
| Baking-soda answer in red / box styles inconsistent | No single rule for reveal/answer boxes; green-means-correct is being violated. | `scaffold/lessons/2-7a_the-mole-molar-mass.html` | ✅ Fixed (A5) |
| Glossary terms not all underlined | No enforced coverage; terms typed as plain text. | all pages | ✅ Audited + fixed |

---

## Part A — Systemic fixes (shared assets + guideline docs) — ✅ ALL DONE

### A1. ✅ Sequenced diagrams → one blessed pattern (`data-motion="step"`)
- Fixed: `core.js`'s `initStepPrimitive` now measures each frame's natural height before touching layout, builds an internal `.step-stage` wrapper sized to the tallest frame, and moves every `[data-step]` frame into it as `position:absolute; inset:0`. Exactly one frame visible at a time, same physical space, no dead space, no jump between steps. Verified in browser (screenshot-checked frame-by-frame geometry: identical rect across all steps, fixed stage height).
- Converted the one real offender: 1-1a's crossover grid (Ar/K/Ca/Sc) → `data-motion="step"`, large single-frame stage.
- Documented as the only approved pattern in `INTERACTION_SPEC.md` §2.1, with a copy-paste snippet.

### A2. ✅ Lightbox every diagram
- `core.js`'s lightbox binder now selects `.diagram svg, .diagram img` (was `.diagram svg` only).
- Added `.diagram` wrapper to every previously-unwrapped static diagram found: 1-1a §8 self-explain diagram, 2-7a's mole-bridge diagram and baking-soda worked example.
- Confirmed (by full-repo scan) every other unwrapped `<svg>` in the codebase is either topbar UI chrome or a live interactive builder canvas (`atomSvg`, `bondSvg`, `lewisSvg`, etc.) — those are correctly excluded, matching the established 1-1a/1-1b pattern.

### A3. ✅ Free-text gate → soft progress hint
- `core.js`'s `mode: "free"` widget now shows `w-progress-hint`: empty while untouched, "Keep going…" below threshold, "Ready" (accent-colored) once met. No number, no cap, ever.

### A4. ✅ Formula-safe recall / self-test
- All 26 `.st-fields label` instances across 6 files (1-1a, 2-7b, 2-2a, C-SPA, C-RXN, 2-7c) now wrap their prompt text in a `<span>` so inline `<sub>` can't be torn onto its own line by the flex container.
- Added a `.formula { white-space: nowrap }` utility class to `components.css` for future inline-formula use.

### A5. ✅ One rule for answer/reveal boxes + color discipline
- `.w-reveal-area` (used by every commit-reveal widget's model-answer panel) recolored from vermilion to green, matching `.scheme-card`'s existing correct pattern — this was a repo-wide inconsistency, not just 2-7a.
- 2-7a's baking-soda worked-answer box recolored from vermilion to green.
- Documented the rule in `INTERACTION_SPEC.md` §0 rule 7.

### A6. ✅ Glossary coverage
- Ran a full-repo audit for **silently-broken tooltips** (a term tagged `<strong class="term">` whose auto-generated slug doesn't match any real glossary key) — found and fixed exactly one: 1-3b's "intermolecular forces" (plural) was never resolving against the `intermolecular-force` (singular) key. Verified fixed by simulating the hover event and confirming the tooltip populates.
- Tagged concrete, verified misses: `conservation-of-mass` and `open-system` in 2-2a; `subscript` and `precipitate` in C-RXN; `design-trade-off` in C-SPA.
- Left generic/repeat vocabulary (reactants, products, coefficient, subscript used in passing, etc.) untagged where the term is established prior-lesson knowledge rather than newly introduced here — tagging every occurrence would violate the "first substantive mention only" convention the reference build (1-1b) already follows correctly.

---

## Part B — Per-page fixes — ✅ ALL DONE

### C-RXN (Reaction Types & Balancing) — ✅
- Glossary terms tagged (conservation of mass, subscript, precipitate).
- Hero stepper already used the correct pattern; benefits automatically from the A1 CSS fix.
- **Balance tilt fixed**: `diff = rightMass - leftMass` (was inverted). Verified in browser: for water synthesis, reactants (34.02 g/mol) now correctly sink, products (18.02 g/mol) correctly rise.
- **Neutralization reframed as beyond the assessment boundary**: tab renamed "Neutralization (bonus)", its panel gets an explicit boundary note, the drill's H₂SO₄+KOH item now marks "Double replacement" correct (was "Acid-Base neutralization"), and the section framing/closing summary now says "five" reaction types instead of "six."
- Recall line-break and char-counter issues resolved via A4/A3 automatically.
- **Bonus fix (not in original plan):** the hero stepper's atom-inventory ledger used an invalid `<span>` inside an SVG `<text>` element, which browsers can't parse as SVG — it was spilling out as full-size HTML text below the diagram. Converted to `<tspan>`.

### 1-1a (Atomic Structure & Electron Config) — ✅
- Crossover diagram converted to the A1 stepper, large single-frame stage.
- `"shell 3 (it can hold 18)"` → `"shell 3"` (giveaway removed).
- `"Number of valence electrons"` → `"# valence electrons"`.
- §8 self-explain diagram now wrapped in `.diagram`, lightboxable.
- **Bonus fix (not in original plan):** the recall section (§07) had a corrupted `<span data-recall-feedback>` that swallowed the entire §08 self-explain section's opening tags inside it, silently breaking the DOM for everything after. Fixed.

### 2-7a (The Mole & Molar Mass) — ✅
- **Bonus fix (not in original plan, found before the zoom rebuild could even be assessed):** the whole page had two separate HTML corruptions — a duplicate stray closing tag after §03, and a next-cue button that swallowed the entire §05 opening `<section>` tag inside its own `<span>`. This is what was actually causing the "texture scale reasoning box looks broken / doesn't match the site aesthetic" complaint — the box was rendering inside a badly-nested DOM tree, not a font/styling problem. Both fixed; verified the page is now structurally clean top to bottom.
- **Zoom rail rebuilt**: root cause was two-fold — (1) `data-zoom-labels` held full phrases ("on the scale", "in the spoon") crammed into 32px circles, illegible; (2) `initZoomPrimitive` in `core.js` never applied the `.zoom-level-layer` CSS class needed for the crossfade/positioning to work at all, so clicking a rail button did nothing visible. Both are shared-asset/global fixes now (also applied to `_widget-test.html`'s zoom example, which had the same label bug). Verified: clicking Out/Mid/In now correctly crossfades between the scale, powder-grain, and crystal-lattice views.
- Mole-bridge diagram and baking-soda example made lightboxable (A2); baking-soda box recolored to green (A5).
- **Formula parser broadened**: added the 11 missing period-4 elements (Sc, Ti, V, Cr, Mn, Co, Ni, Ga, Ge, As, Se) to `2-7a.js`'s local atomic-mass table (verified standard atomic weights). Spot-checked CoCO₃ → 118.94 g/mol, matches hand calculation exactly.

### 1-1b (Periodic Trends — reference build) — ✅
- Found and fixed the actual bug: the static "Down a group" lever diagram (distinct from the correct animated Bohr builder below it) showed Lithium with only 1 shell/1 electron total (should be 2 shells, 2+1 electrons) and Potassium with only 3 shells/1 electron total (should be 4 shells, 2+8+8+1 — missing a whole shell). Redrawn with exact, verified electron counts matching the canonical `GC_ELEMENTS` shell data. Verified in both light and dark mode.
- Everything else the author approved was left untouched.

### Remaining pages (1-2a, 1-3a, 1-3b, 2-2a, 2-7b, 2-7c, C-SPA) — ✅ swept
- Confirmed via full-repo scans: no sequential "show-all" diagram grids remain (the only `flex-wrap` hits left are dropdown/selector rows, not diagrams); every static diagram is lightbox-wrapped (only UI chrome and live interactive canvases are excluded, by design); `.st-fields` formula fix applied everywhere it's used.
- Glossary audit per file; concrete fixes applied to 2-2a (conservation-of-mass, open-system), 1-3b (fixed the broken IMF tooltip), and C-SPA (design-trade-off).

---

## Part C — Guideline-doc updates — ✅ ALL DONE

- **CLAUDE.md** — golden rules 12–15 added (step-motion only, lightbox-everywhere, no-character-cap, formula-nowrap).
- **INTERACTION_SPEC.md** — §2.1 rewritten with the real stage mechanism + a minimal authoring example; §2.3 gained the zoom-rail label-length constraint; §3.1 gained the soft-hint gate spec; §0 rule 7 extended to cover revealed-answer boxes.
- **BUILDING.md** — added a handoff note at the top (pointing at 1-1b and the six invariants, and at this file for incident history) and five new QA-gate checkboxes (glossary coverage, lightbox coverage, formula-nowrap, no sequential grids, color discipline).

---

## Part D — Execution order — ✅ followed exactly as specified

1. Shared assets (A1–A5 CSS/JS) → verified on `_widget-test.html` via headless-Chrome screenshots (not just code review).
2. Guideline docs (Part C).
3. Deep per-page fixes: C-RXN → 1-1a → 2-7a → 1-1b, each verified live in the browser before moving on.
4. Swept remaining pages (A2/A4/A6).
5. Rendered every touched page in light AND dark mode; ran a full structural HTML parser + JSON-config validator across all 12 lesson files after every batch of edits to catch corruption immediately (this is how the 2-7a and 1-1a HTML corruptions were caught).

---

## Invariants to carry forward (the short list) — now enforced in CLAUDE.md/INTERACTION_SPEC.md/BUILDING.md

1. Sequence diagrams with `data-motion="step"`, in-place crossfade — never show-all grids.
2. Every diagram lives in `.diagram` and is lightboxable.
3. No character-cap UI on free text — soft hint only.
4. Formulas never wrap mid-formula.
5. Green = correct/positive only; worked answers are neutral ink.
6. Every defined term is `<strong class="term">` with a slug in `glossary.js` — and if you use `data-term`, double-check the slug actually exists (a stale override is a silent no-op, not an error).

---

## What's left

Nothing from this plan, and nothing from the doc-audit either — both are fully closed out.

1. **Nothing has been committed yet.** All changes described above (plus the doc-audit cleanup below) are sitting in the working tree / index.

---

## Doc-audit addendum (2026-07-05, same session)

Per a follow-up request, every planning/reference doc in the repo was checked for staleness. Full findings:

| Doc | Status | Action taken |
|---|---|---|
| `BUILD_PLAN.md` | Stale — tracked file-existence for lessons that are now all built (except 1-2b) | Status banner added; session table updated to strike through sessions 4–13 (files confirmed to exist); session 14 (1-2b) confirmed still not built and left open |
| `CLAUDE.md` §4 file listing | Stale — missing `REMEDIATION_PLAN.md`; didn't flag `content_audit.md`/`Ongoing Work/` as non-canonical; glossary.js comment said "62 term definitions," actual count is 80 | Fixed all three |
| `CLAUDE.md` §5 file manifest | Stale — only 1-1b marked "(done)", implying the other 10 weren't, when all 11 exist | Fixed: all 11 confirmed built; 1-2b explicitly called out as the one real gap |
| `README.md` project-structure tree | Missing `REMEDIATION_PLAN.md` | Added |
| `content_audit.md` | Orphaned, stale, unreferenced (see above) | **Deleted** (author approved) |
| `Ongoing Work/*.md` (5 files) | Leftover from the 2026-07-03 `temp-interactives` merge, which duplicated these docs into root + `scaffold/` + `Ongoing Work/` at once; a follow-up commit cleaned up `scaffold/` but missed `Ongoing Work/`. The **directory** is legitimate (voice-note staging, per CLAUDE.md) — only these 5 files inside it were stale. | **Deleted** (author approved, after confirming each was either byte-identical to root or a strict subset with zero unique content — verified by diffing against both current root and git HEAD before removing). The `Ongoing Work/` directory itself was left alone; it's now simply empty again, ready for the next voice note. |
| `Content_Expansion_v2.md`, `Diagram_Inventory_v2.md` | Partially superseded — their content for all 11 built lessons has already been pulled into those lessons' HTML; only the 1-2b block is still "live" | Kept (author's call) until 1-2b is built; noted in CLAUDE.md §4 that they now only actively feed that one remaining lesson |
| `VOICE.md`, `INTERACTION_SPEC.md` (root), `BUILDING.md` | Current, actively maintained (INTERACTION_SPEC.md and BUILDING.md updated earlier this same session) | No issues |
| `lessons.json` | Static metadata, no staleness found | No issues |
| `scaffold/lessons/_widget-test.html` | Intentional dev-only fixture, correctly excluded from `lessons.json`/`index.html` nav | No issues, not a doc |
