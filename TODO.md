# TODO.md — Outstanding Work

**This is the single board for "what's left." If you're an LLM (Claude, Gemini, or otherwise) starting a fresh session in this repo, read this file first — it's the current state of the project, updated 2026-07-05.**

The project is otherwise in good shape: all 12 manifest lessons are built, and a full repo-wide consistency/bug-fix pass completed on 2026-07-05 (see `REMEDIATION_PLAN.md` for what was fixed and the invariants now enforced). Nothing from that pass is outstanding.

---

## 1. PDF / print export of the lessons — DONE (2026-07-06)

**Status:** built and verified. **Details:** [`PDF_EXPORT_PLAN.md`](PDF_EXPORT_PLAN.md) (see the top of that file for the verification summary and one known accepted gap: bespoke per-lesson interactives outside the shared widget framework print their live control chrome as-is).

Any lesson now produces a clean, complete printout via ⌘P / "Save as PDF" or the new topbar Print button — gated widgets, recall blanks, predicts, mark schemes, and step/zoom motion all unroll to static answers, plus a glossary appendix. Only `scaffold/assets/components.css` and `scaffold/assets/core.js` were touched, per the zero-build ethos.

---

## 2. New feature ideas — see FEATURES.md

Forward-looking capability ideas (progress/memory layer, concept map, reference tools incl. dropdown periodic table + formulas/tables + calculator, etc.) live in [`FEATURES.md`](FEATURES.md). That's a backlog, not committed work — pull an item into its own `*_PLAN.md` when it's approved for build.

---

## 3. Housekeeping / smaller items

- **Glossary count comment drifts.** `CLAUDE.md` §4 notes `glossary.js` has 80 entries; verify and update that number whenever you add/remove terms (there's no automated check).
- **`BUILD_PLAN.md` is historical.** Its session table is kept for provenance; it is *not* a live to-do list. Current status lives here and in `REMEDIATION_PLAN.md`.

---

## How to keep this file useful

When you finish something on this board, strike it through or delete it and note it in the relevant plan doc (`REMEDIATION_PLAN.md` for the consistency pass, `PDF_EXPORT_PLAN.md` for print work). When you discover new outstanding work, add it here — this file, not scattered code comments, is where "what's left" is supposed to live.
