# CHANGELOG.md — Development Milestones

A dated, one-line record of what shipped. This is not a to-do list (see [`TODO.md`](TODO.md)) and not a build spec (see the plan doc each entry links to, where one still exists) — just the fact that something happened, so a new session can skim history instead of doing `git log` archaeology.

**Add a line here every time you push to the GitHub repo** — one entry, dated, summarizing what the push contains. See `CLAUDE.md` §4 / `TODO.md` for the policy.

---

- **2026-07-06** — Design-level revision pass proposed and made the next priority. See `REVISION_PLAN.md`. (`5f3d807`)
- **2026-07-06** — PDF/print export built and verified for all 12 lessons: print CSS, `core.js` print hook, topbar Print button, glossary appendix. One known accepted gap: bespoke per-lesson interactives (visual equation balancer, Bohr builders, trend explorers) print their live control chrome as-is rather than unrolling — see `INTERACTION_SPEC.md`. (`c61e4cf`)
- **2026-07-05** — Lesson `1-2b` (Molecular Polarity) built — the 12th and final manifest lesson. (`dacc4f2`)
- **2026-07-05** — TODO board added; planning docs refreshed. (`7aca068`)
- **2026-07-05** — Repo-wide consistency/bug-fix pass across all lessons and shared assets: step-motion stacking bug, formula mid-line-break bug, free-text character-cap removed in favor of a soft hint, lightbox coverage extended to every diagram, reaction-balance tilt-direction bug, glossary coverage audit. Invariants folded into `CLAUDE.md` golden rules 12–15 and `INTERACTION_SPEC.md`. (`3257802`)
- **2026-07-05** — Voice-note feedback pass on lessons 1-1a and 1-1b; local Whisper transcription pipeline established. (`7ebfe8c`)
- **2026-07-05** — `CLAUDE.md` consolidated with LLM behavioral guidelines; `core.js` syntax error fixed. (`1f7536a`)
- **2026-07-03** — Lesson 1-1a and C-RXN interactives updated; glossary tooltips restored across all pages. (`925947d`, `40cc16d`)
- **2026-06-10** — Tooltip/glossary system merged into `main` via PR #1. (`9b42724`)
- **2026-06-09** — Tooltip/glossary system built: `glossary.js`, `.gc-tooltip` styles, `initGlossaryTooltips()`; wired into all 11 lesson files that existed at the time; 18 missing entries backfilled. (`7b2fad4`, `00012e0`, `e92574f`)
- **2026-06-09** — Initial commit: deploy workflow, documentation, CC BY-NC-SA license. Project renamed to Chemistry Interactive Text. (`1f8a10c`, `912e0d3`)

---

## Retired planning docs

Docs below were deleted once their content was fully built/verified and any durable facts migrated into permanent docs (`CLAUDE.md`, `INTERACTION_SPEC.md`, etc.). Full detail on what they contained is in git history (`git log -- <filename>`).

- **`LESSON_1-2B_PLAN.md`** — build plan for lesson 1-2b. Retired 2026-07-06 after the lesson shipped (`dacc4f2`).
- **`BUILD_PLAN.md`** — original 14-session build roadmap for all 12 lessons + shared infrastructure. Retired 2026-07-06; all sessions closed out, nothing left to track.
- **`REMEDIATION_PLAN.md`** — record of the 2026-07-05 repo-wide consistency/bug-fix pass (root-cause table, per-page fixes, doc-staleness audit). Its six carry-forward invariants are now golden rules 12–15 in `CLAUDE.md` plus the green-only rule (golden rule 5) and the glossary-slug warning (golden rule 6). Retired 2026-07-06; nothing left un-migrated.
- **`PDF_EXPORT_PLAN.md`** — spec and build record for PDF/print export (built and verified `c61e4cf`). Its durable contract — every widget type needs a case in `renderWidgetPrint()`, and the accepted gap that bespoke interactives print live control chrome as-is — now lives in `INTERACTION_SPEC.md` §3.5. Retired 2026-07-06.
