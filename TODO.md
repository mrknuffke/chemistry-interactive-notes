# TODO.md — Outstanding Work

**This is the single board for "what's left." If you're an LLM (Claude, Gemini, or otherwise) starting a fresh session in this repo, read this file first — it's the current state of the project, updated 2026-07-06.**

The project is otherwise in good shape: all 12 manifest lessons are built, a full repo-wide consistency/bug-fix pass completed on 2026-07-05, and PDF/print export shipped 2026-07-06 (see [`CHANGELOG.md`](CHANGELOG.md) for the dated history of all three). Nothing from any of them is outstanding.

---

## 1. Design-level revision pass — PRIORITY, next thing to do

**Status:** proposed, ready to start. **Spec:** [`REVISION_PLAN.md`](REVISION_PLAN.md).

This is the next work session's focus. It's a design-level pass on top of the (already-closed) bug fixes — a shared figure-sizing system, deploying the step/zoom/scrub motion primitives that exist but are barely used, breaking the "produce → reveal" interaction monotony, and making lessons re-enterable (persistence + synopsis) instead of read-once. Read `REVISION_PLAN.md` end to end before starting; Phase 1 (the figure system) is unblocked and should run first. Phases 2–6 have author sign-off items listed in that doc's §7 — check those before executing the phase they block.

**Sequencing note:** `REVISION_PLAN.md` Phase 1 (figure *width* tiers) overlaps the diagram-standardization workstream in §1a below (figure *internals*). Both touch the figure wrappers — resolve the sequencing decision in `DIAGRAM_STANDARDIZATION.md` §Relationship before starting either figure pass, so the same wrappers aren't rewritten twice.

---

## 1a. Diagram standardization — PROPOSED, adjacent to the revision pass

**Status:** proposed, not started (added 2026-07-06). **Spec:** [`DIAGRAM_STANDARDIZATION.md`](DIAGRAM_STANDARDIZATION.md).

A design-level retrofit that fixes the "janky diagrams" problem at a deeper layer than `REVISION_PLAN.md` Phase 1: within-figure breakage first (make every diagram one self-contained `<svg viewBox>` that scales as a rigid unit — no HTML labels drifting over artwork), then cross-figure drift (a shared `--dia-*` token layer + one coordinate unit so an oxygen atom is the same size everywhere), then optional data-driven renderers so consistency is structural rather than re-enforced each session. Phased and Sonnet-safe: Phase 0 is an audit that changes nothing, and each later phase names 3–6 files, ends in Playwright screenshots, and checks against a short `DIAGRAM_CONTRACT.md` the plan produces.

This is **adjacent to, not a replacement for,** the revision pass. `REVISION_PLAN.md` Phase 1 sizes figures (outer width); this plan fixes their internals (SVG containment + tokens). See `DIAGRAM_STANDARDIZATION.md` §Relationship for the open sequencing call (which of the two figure passes runs first, or whether they merge) — decide it before either starts.

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
