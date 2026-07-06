# TODO.md — Outstanding Work

**This is the single board for "what's left." If you're an LLM (Claude, Gemini, or otherwise) starting a fresh session in this repo, read this file first — it's the current state of the project, updated 2026-07-06.**

The project is otherwise in good shape: all 12 manifest lessons are built, a full repo-wide consistency/bug-fix pass completed on 2026-07-05 (see `REMEDIATION_PLAN.md`), and PDF/print export shipped 2026-07-06 (see `PDF_EXPORT_PLAN.md`). Nothing from either is outstanding.

---

## 1. Design-level revision pass — PRIORITY, next thing to do

**Status:** proposed, ready to start. **Spec:** [`REVISION_PLAN.md`](REVISION_PLAN.md).

This is the next work session's focus. It's a design-level pass on top of the (already-closed) bug fixes — a shared figure-sizing system, deploying the step/zoom/scrub motion primitives that exist but are barely used, breaking the "produce → reveal" interaction monotony, and making lessons re-enterable (persistence + synopsis) instead of read-once. Read `REVISION_PLAN.md` end to end before starting; Phase 1 (the figure system) is unblocked and should run first. Phases 2–6 have author sign-off items listed in that doc's §7 — check those before executing the phase they block.

---

## 2. PDF / print export of the lessons — DONE (2026-07-06)

**Status:** built and verified. **Details:** [`PDF_EXPORT_PLAN.md`](PDF_EXPORT_PLAN.md) (see the top of that file for the verification summary and one known accepted gap: bespoke per-lesson interactives outside the shared widget framework print their live control chrome as-is).

Any lesson now produces a clean, complete printout via ⌘P / "Save as PDF" or the new topbar Print button — gated widgets, recall blanks, predicts, mark schemes, and step/zoom motion all unroll to static answers, plus a glossary appendix. Only `scaffold/assets/components.css` and `scaffold/assets/core.js` were touched, per the zero-build ethos.

---

## 3. New feature ideas — see FEATURES.md

Forward-looking capability ideas (progress/memory layer, concept map, reference tools incl. dropdown periodic table + formulas/tables + calculator, etc.) live in [`FEATURES.md`](FEATURES.md). That's a backlog, not committed work. Note: `REVISION_PLAN.md` Phase 4 promotes the persistence/resume layer (`FEATURES.md` item 1) from backlog to committed work, contingent on the author sign-off in `REVISION_PLAN.md` §7 item 4.

---

## 4. Housekeeping / smaller items

- **Glossary count comment drifts.** `CLAUDE.md` §4 notes `glossary.js` has 80 entries; verify and update that number whenever you add/remove terms (there's no automated check).
- **`BUILD_PLAN.md` is historical.** Its session table is kept for provenance; it is *not* a live to-do list. Current status lives here and in `REMEDIATION_PLAN.md`.

---

## How to keep this file useful

When you finish something on this board, strike it through or delete it and note it in the relevant plan doc (`REMEDIATION_PLAN.md` for the consistency pass, `PDF_EXPORT_PLAN.md` for print work). When you discover new outstanding work, add it here — this file, not scattered code comments, is where "what's left" is supposed to live.
