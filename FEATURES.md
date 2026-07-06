# FEATURES.md — Feature Backlog / Ideas Board

**Purpose:** the running list of *net-new capabilities* being considered for the site — the "what would make it more captivating and more useful" ideas. This is a backlog, not a commitment: nothing here is approved or scoped for build yet. When an item is picked up, spin it into its own `*_PLAN.md` (like `PDF_EXPORT_PLAN.md`) and move the status here.

> Distinct from [`TODO.md`](TODO.md) (outstanding work on the *existing* 12 lessons) and `REMEDIATION_PLAN.md` (the completed bug pass). This file is forward-looking scope.

All ideas must respect the project ethos: **zero-build, shared-asset, no backend, local-only (localStorage).** No new hues, one accent (see `CLAUDE.md` §3).

---

## 0. Recommended first move

**The progress / memory layer (§1) is the highest-leverage item.** It converts the site from "very good interactive notes" into a *study system*, and it's the prerequisite that makes the dashboard, interleaved practice, and concept map worth building. Everything in §1 shares one `progress.js` + one localStorage record. Start there.

---

## 1. Progress / memory layer  ⭐ recommended first

**Promoted to committed work:** `REVISION_PLAN.md` Phase 4 pulls the persistence/resume slice of this item (not the full dashboard/scheduling scope below) out of backlog status, contingent on the author sign-off in that doc's §7 item 4 (target surface: GitHub Pages only, or also inside a Claude artifact). Check `REVISION_PLAN.md` before starting this.

**The core gap:** by design, widget state dies on reload (`INTERACTION_SPEC.md`). That keeps a single widget honest, but it means the site has *no memory of the learner* — the biggest miss for material studied outside class after first exposure.

Keep the per-widget "no persistence on reload" rule intact (a widget still resets so you can't peek at an answer). Add a **separate, opt-in progress record** — the two aren't in conflict: one prevents peeking, the other tracks that you eventually got it right.

- **1.1 — Learner dashboard.** Home page shows per-lesson mastery: which sections have committed answers, which widgets were missed, last-visited, "due for review." Turns the lesson list into a study tool.
- **1.2 — Scheduled spaced retrieval.** The site already *does* retrieval; it doesn't *schedule* it, which is where memory gains live. A "review N cards due today" mode pulls the recall/predict/exam items the student previously missed. Most research-backed upgrade available.
- **1.3 — Cumulative / interleaved practice.** Each lesson is a silo; exam performance comes from interleaving topics. A "mixed practice" mode samples items across lessons. Trivial once items are individually addressable — which §1 makes them.

---

## 2. More captivating

- **2.1 — Concept map / "you are here."** Chemistry is a dependency graph (radius → IE → EN → bonding → polarity → IMF → properties). One visual map of that spine, with the learner's position and mastery lit up, gives a sense of journey a lesson list can't — and makes the C-SPA structure→property→argument throughline visible instead of implicit.
- **2.2 — A "why this matters" payoff per lesson.** Storylines stay light (per golden rules), but a single closing beat — "here's the real phenomenon this reasoning unlocks" — rewards finishing. A payoff, not a story the lesson is hostage to.
- **2.3 — Earned, not decorative, motion.** Let students manipulate one more variable in an honest diagram — e.g. drag ΔEN and watch bond character slide ionic↔covalent — rather than click through fixed frames. Manipulation, not animation.

---

## 3. More useful

- **3.1 — PDF / print export.** Already on the board with a written spec: [`PDF_EXPORT_PLAN.md`](PDF_EXPORT_PLAN.md). Genuinely useful for offline/paper studiers.
- **3.2 — Content search (not just titles).** The index has a search portal; if it indexes glossary terms and section text, it becomes a reference students reach for mid-homework.
- **3.3 — Per-lesson "exam-only" cram view.** Collapse a lesson to just its constructed-response items + mark schemes.

---

## 4. Reference tools (persistent, available from any lesson)

A shared, always-reachable reference tray — think a slide-out panel or topbar dropdowns present on every lesson page, built from the shared assets so it stays consistent everywhere. All three below read from existing canonical data; none should re-type chemistry values (`CLAUDE.md` §3 golden rule 2).

- **4.1 — Dropdown periodic table.** A slide-out / dropdown periodic table reachable from the topbar of any lesson. Build it **entirely from `assets/elements.js`** (Z=1..36 already carries group, period, Bohr shells, radius, IE, EN, and metal/nonmetal/metalloid/noble kind). Tap an element → its key data + Bohr shell config. Reuse the existing heat-map convention for trend shading (cool→hot for sequential radius/IE/EN; the vermilion/green categorical split for metal vs nonmetal — keep those distinct, `CLAUDE.md` §7). Lightboxable like any diagram. *Note the current data ceiling: Z≤36 and transition-metal radius/IE/EN are intentionally `null` — decide whether the table shows periods 1–4 only or extends the dataset first.*
- **4.2 — Reference formulas & tables.** A quick-reference sheet reachable from any lesson: the equations and constants students need while working (molar mass / mole–mass–particle relationships, Avogadro's number, ΔEN → bond-type cutoffs, common polyatomic ions, activity/solubility guidance as the review sheets define them). Source every value from `References/` and existing lesson content — do not introduce anything not on the committed review sheets (`CLAUDE.md` §3 golden rule 1). Most relevant to `2-7a/b/c` and `C-RXN`.
- **4.3 — In-page calculator.** A lightweight calculator for the arithmetic the mole/stoichiometry lessons demand (mole ↔ mass ↔ particles, molar-ratio scaling, limiting-reactant checks). Should complement, never replace, the gated BCA/conversion widgets — it's a scratchpad, not an answer key, so keep it clearly separate from any commit-before-reveal interaction (`INTERACTION_SPEC.md`).

---

## How to use this file

- Add new ideas here as they surface; keep them one-line-plus-rationale.
- When an idea is picked for build: get author sign-off, write a dedicated `*_PLAN.md`, and mark the item here with a link + status.
- Ship an idea → strike it here and record it in its plan doc.
