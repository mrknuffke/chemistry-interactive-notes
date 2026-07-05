# TODO.md — Outstanding Work

**This is the single board for "what's left." If you're an LLM (Claude, Gemini, or otherwise) starting a fresh session in this repo, read this file first — it's the current state of the project, updated 2026-07-05.**

The project is otherwise in good shape: all 11 manifest lessons are built, and a full repo-wide consistency/bug-fix pass just completed (see `REMEDIATION_PLAN.md` for what was fixed and the invariants now enforced). Nothing from that pass is outstanding.

---

## 1. PDF / print export of the lessons — spec written, NOT built

**Status:** planned, not implemented. **Spec:** [`PDF_EXPORT_PLAN.md`](PDF_EXPORT_PLAN.md).

The author wants "pretty, well-formatted PDF printouts of the lessons." A full implementation plan has been written for a future model to execute — read `PDF_EXPORT_PLAN.md` end to end before starting. It's designed to stay within the project's zero-build, shared-asset ethos (a `print.css` + a small print-mode JS hook, optionally a batch generator script). Two author-facing decisions are flagged inside that doc; surface them before you build.

---

## 2. Lesson 1-2b (Molecular Polarity) — existence AND scope both unresolved

**Status:** the file `scaffold/lessons/1-2b_*.html` does **not** exist (confirmed 2026-07-05). Before building it, resolve a genuine scope question — don't just start building from the seed spec.

**The scope question:** `CLAUDE.md` §5 fixes the decision that **geometry/polarity live in `C-SPA`**, and that VSEPR is never a headline. But `BUILD_PLAN.md` (session 14) and `Content_Expansion_v2.md` (the `LESSON 1-2b · Molecular Polarity` block, ~line 166) both carry a seed spec for a *separate* 1-2b polarity lesson. These two intentions conflict: is 1-2b a real 12th lesson, or is its content already meant to be absorbed into C-SPA? **This needs an author decision before any build.** Do not assume.

If the author confirms 1-2b should be built as its own file:
- Seed content: the `LESSON 1-2b` block in `Content_Expansion_v2.md`; diagrams in `Diagram_Inventory_v2.md` (`V-12b-*` specs).
- Follow `BUILDING.md` and every invariant in `CLAUDE.md` §3 (including the six added after the remediation pass).
- Open sub-questions from `BUILD_PLAN.md`: none block a from-scratch build except the scope question above.

Those two docs (`Content_Expansion_v2.md`, `Diagram_Inventory_v2.md`) are being **kept solely because 1-2b is unbuilt** — once 1-2b is resolved (built or formally cancelled), they can be retired.

---

## 3. Housekeeping / smaller items

- **Glossary count comment drifts.** `CLAUDE.md` §4 notes `glossary.js` has 80 entries; verify and update that number whenever you add/remove terms (there's no automated check).
- **`BUILD_PLAN.md` is historical.** Its session table is kept for provenance; it is *not* a live to-do list. Current status lives here and in `REMEDIATION_PLAN.md`.

---

## How to keep this file useful

When you finish something on this board, strike it through or delete it and note it in the relevant plan doc (`REMEDIATION_PLAN.md` for the consistency pass, `PDF_EXPORT_PLAN.md` for print work). When you discover new outstanding work, add it here — this file, not scattered code comments, is where "what's left" is supposed to live.
