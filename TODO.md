# TODO.md — Outstanding Work

**This is the single board for "what's left." If you're an LLM (Claude, Gemini, or otherwise) starting a fresh session in this repo, read this file first — it's the current state of the project, updated 2026-07-06.**

The project is otherwise in good shape: all 12 manifest lessons are built, a full repo-wide consistency/bug-fix pass completed on 2026-07-05, and PDF/print export shipped 2026-07-06 (see [`CHANGELOG.md`](CHANGELOG.md) for the dated history of all three). Nothing from any of them is outstanding.

---

## 1. Design-level revision pass — PRIORITY, next thing to do

**Status:** Phase 1 done; Phase 2 unblocked and in progress. **Spec:** [`REVISION_PLAN.md`](REVISION_PLAN.md).

A design-level pass on top of the (already-closed) bug fixes — a shared figure-sizing system, deploying the step/zoom/scrub motion primitives that exist but are barely used, breaking the "produce → reveal" interaction monotony, and making lessons re-enterable (persistence + synopsis) instead of read-once. Phase 1 (the figure system) shipped 2026-07-06. Phase 2 (motion deployment) sign-off items (§7 items 2, 3, 5) resolved 2026-07-07; `1-1a`'s step primitive extended from 4 to 6 steps (K→Ga shell-filling, per the deployment map) — first lesson of the Phase 2 rollout, the rest of the map in §2 of the plan is still outstanding. Phases 3–6 still have open author sign-off items (§7 items 4, 6) — check those before executing the phase they block.

**Sequencing:** resolved 2026-07-07 — `REVISION_PLAN.md` Phase 1 (figure *width* tiers) ran first and is done; the diagram-standardization workstream in §1a below (figure *internals*) is now in progress on top of it.

---

## 1a. Diagram standardization — IN PROGRESS (Phase 0–2 done, Phase 3 underway, Phase 4 not started)

**Spec:** [`DIAGRAM_STANDARDIZATION.md`](DIAGRAM_STANDARDIZATION.md). **Contract:** [`DIAGRAM_CONTRACT.md`](DIAGRAM_CONTRACT.md).

A design-level retrofit that fixes the "janky diagrams" problem at a deeper layer than `REVISION_PLAN.md` Phase 1: within-figure breakage first (make every diagram one self-contained `<svg viewBox>` that scales as a rigid unit), then cross-figure drift (a shared `--dia-*` token layer so an oxygen atom is the same size everywhere), then optional data-driven renderers. `REVISION_PLAN.md` Phase 1 sized figures (outer width, done); this plan fixes their internals.

**Done (2026-07-07):**
- **Phase 0 (audit)** — full harvest across all 12 lessons + their JS. Found the containment problem (B) was mostly already solved: 0 HTML-overlay-over-SVG violations anywhere. Found 2 genuine containment bugs (missing `viewBox`) and 1 color-consistency violation (a bespoke ~20-color hex palette in `2-7a.js`, isolated to that file). Radius/stroke/font-size are fragmented as the plan predicted (20+/12/17 distinct values).
- **Phase 1 (B), scoped down per the audit** — fixed the 2 missing-viewBox bugs: `2-7a` `#moleculeCanvas` and `2-7c` `#particleCanvas` now have `viewBox="0 0 400 250"` (matching their existing 16:10 CSS aspect-ratio) + explicit `preserveAspectRatio`. Verified responsive at 900px and 375px widths. No other containment work was needed.
- **Phase 2 (A), token layer** — added `--dia-r-particle`, `--dia-r-atom`, `--dia-stroke`, `--dia-stroke-bond`, `--dia-label-size`, `--dia-caption-size` to `tokens.css`, defaults from the Phase 0 harvest's most-common values. Adjusted from the plan's original template: one `--dia-unit` became two (`--dia-r-particle`/`--dia-r-atom` — the harvest showed a clear bimodal split, not one size), and the proposed per-element color tokens (`--dia-el-h`, `--dia-el-o`, …) were dropped — color is already consistently role-based via the existing `.d-*` classes and global palette, confirmed by the harvest (97%+ already `var(--token)`). No figures were touched this phase, per the plan's own constraint.
- **Phase 3 (coordinate-scale retrofit), batch 1 of N — `2-7a`, `1-1b`, `1-2a`, `1-2b`.** Retrofitted every static and JS-driven diagram in these 4 files to the token layer (radius/stroke-width/font-size), and fixed `2-7a.js`'s bespoke hex palette in the same pass (per §Standing rule 1 note below — grouped since both are per-figure work on the same file). Also fixed `2-7a.js`'s Chlorine using `var(--good)` (green), a golden-rule-5 violation. Added a third radius token, `--dia-r-atom-sm` (5), discovered mid-retrofit: molecule ball-diagrams deliberately draw hydrogen smaller than its bonded atom, a real recurring pattern the original 2-token scale couldn't represent. Found and fixed a real cross-cutting bug: `font-size="var(--token)"` as a bare SVG presentation attribute is silently invalid in Chrome (falls back to the inherited 22px body font-size) — `r`/`stroke-width`/`fill` all resolve `var()` correctly as bare attributes, `font-size` does not. Documented in `DIAGRAM_CONTRACT.md` §9. Some radius values deliberately left un-retrofitted where they feed further JS arithmetic (bond-endpoint offsets) rather than being a final attribute value — `DIAGRAM_CONTRACT.md` §10. Verified every change via rendered screenshots (not just DOM/computed-style checks, per the font-size bug above) across all interactive states (bond-type modes, molecule presets).

**Not started:** the remaining ~8 lessons' worth of Phase 3 retrofit (1-1a, 1-3a, 1-3b, 2-2a, 2-7b, 2-7c, C-RXN, C-SPA), and Phase 4 (data-driven renderers).

---

## 2. PDF / print export of the lessons — DONE (2026-07-06)

**Status:** built and verified. **Details:** [`CHANGELOG.md`](CHANGELOG.md); the print contract (incl. one known accepted gap: bespoke per-lesson interactives outside the shared widget framework print their live control chrome as-is) lives in `INTERACTION_SPEC.md` §3.5.

Any lesson now produces a clean, complete printout via ⌘P / "Save as PDF" or the topbar Print button — gated widgets, recall blanks, predicts, mark schemes, and step/zoom motion all unroll to static answers, plus a glossary appendix. Only `scaffold/assets/components.css` and `scaffold/assets/core.js` were touched, per the zero-build ethos.

---

## 3. New feature ideas — see FEATURES.md

Forward-looking capability ideas (progress/memory layer, concept map, reference tools incl. dropdown periodic table + formulas/tables + calculator, etc.) live in [`FEATURES.md`](FEATURES.md). That's a backlog, not committed work. Note: `REVISION_PLAN.md` Phase 4 promotes the persistence/resume layer (`FEATURES.md` item 1) from backlog to committed work, contingent on the author sign-off in `REVISION_PLAN.md` §7 item 4.

---

## 4. Housekeeping / smaller items

- **Glossary count comment drifts.** `CLAUDE.md` §4 notes `glossary.js` has 80 entries; verify and update that number whenever you add/remove terms (there's no automated check).

---

## How to keep this file useful

When you finish something on this board, strike it through or delete it and note it in `CHANGELOG.md`. When you discover new outstanding work, add it here — this file, not scattered code comments, is where "what's left" is supposed to live.

**Every push to GitHub also gets a `CHANGELOG.md` entry** — one dated line summarizing what shipped. `TODO.md` is what's left; `CHANGELOG.md` is what's done — keep them separate.
