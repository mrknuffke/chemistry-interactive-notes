# REVISION_PLAN.md — Design-Level Revision Pass

**Status: Phase 1 & 2 closed. Phase 4 completed 2026-07-08 with lesson persistence, state restoration, and Concept Map dashboard tab. Specification and contract requirements fully integrated.**
**Author of plan:** Opus (claude.ai), 2026-07-06. **Intended executor:** Claude Code, lesson-by-lesson, in the phase order below.
**Reads before this:** `CHANGELOG.md` (the bug-fix pass this builds on top of, and how its invariants ended up in `CLAUDE.md`/`INTERACTION_SPEC.md`), `VOICE.md`, `INTERACTION_SPEC.md`, `CLAUDE.md`.

---

## 0. What this plan is, and what it deliberately is not

The 2026-07-05 remediation pass was thorough and it is not being re-opened. It killed the acute defects — inverted balance tilt, formulas shattering in flex containers, DOM corruption in 2-7a/1-1a, lightbox binding, the char-cap UI, colour discipline, glossary coverage. Those are closed. Do not re-litigate them.

The problem is that the pass was scoped to *defects*, and the residual "this sucks" is not a defect. It is a set of **absent design decisions** — things that were never wrong, just never built, or built once and never propagated. A page can pass every bug check and still feel dead, incoherent, and textbook-shaped. That is exactly where this project sits.

Four findings, each traced to real code, not vibes:

| # | Finding | Evidence in the tree | Severity |
|---|---|---|---|
| F1 | **No figure system.** Six bespoke wrapper classes each hard-code a different pixel ceiling; there is no shared rule tying figure width to anything. | `components.css`: `.atom-svg` 360px, `.lever-svg` 300px, `.compass-wrap` 600px, `.single-atom-wrap` 600px, `.octet-wrap` 640px, `.ptable` 680px, and a bare `width:100%` for anything in `.diagram`. Prose column is 52rem (~830px). Same page can show a 300px figure beside an 830px one; the eye reads it as random. | High |
| F2 | **The motion system is built but not deployed.** `zoom` / `step` / `scrub` primitives exist, are tested in `_widget-test.html`, and are now bug-fixed — and appear once each in only 3 of 12 lessons (1-1a step, 2-7a zoom, C-RXN step). Nine lessons have zero `data-motion`. The entire Tversky-grounded T-tier taxonomy is, in practice, unused. | `grep data-motion lessons/*.html` → 1-1a:1, 2-7a:1, C-RXN:1, rest:0. | High |
| F3 | **One interaction verb, repeated.** Almost every section resolves to *produce something → press a button → reveal/check*. The retrieval **categories** vary (recognition, cloze, production, self-explanation, mark-scheme) but the **physical act** does not. By section 4 of 9 a student knows the shape of every remaining section. | Structural — read any lesson top to bottom. The two genuine exceptions (Bohr builder, balance beam) prove the point: they are the only sections that feel alive. | High |
| F4 | **Visual density is uneven, and some lessons starve.** SVG count per lesson runs 0 (2-7b) to 29 (1-2a); lesson JS runs 170 (1-1a) to 683 (2-2a) lines. Your own convention (CLAUDE.md) says particle diagrams should be frequent — more than one per section when content warrants — yet 2-7b has none. | `for f in lessons/*.js; do grep -c svg …` | Medium |

Two structural/architectural problems sit underneath those:

- **A1 — It is a textbook, not notes.** Every page is a linear front-to-back read. Nothing rewards a return visit or a lookup. The checkpoints (0/4) do not persist, so a student cannot resume, cannot see what they have not yet retrieved, cannot scan. For a tool whose entire thesis is *spaced, repeated retrieval*, the architecture fires once and never again.
- **A2 — The planning surface outweighs the product.** ~14 governance/plan docs describe a richer, more varied product than the one that got built (F2 is the sharpest instance: the spec mandates a motion taxonomy the lessons ignore). This is worth naming because the fix for F1–F4 is not more planning — it is propagation and deployment of things already specified.

---

## The loops to break (your phrase, made concrete)

You said "break the loops." There are four, and the plan is organised around them:

1. **The width loop** — every diagram type reinvents its own size. Break it with one figure primitive (Phase 1).
2. **The static loop** — processes are drawn as frozen T0 snapshots when a `step`/`zoom`/`scrub` primitive already exists to animate them. Break it by deploying the motion system that is already built (Phase 2).
3. **The interaction loop** — produce → reveal, forever. Break it with a wider interaction grammar and a per-lesson verb budget (Phase 3).
4. **The read-once loop** — the page is consumed linearly and abandoned. Break it with a scan/reference/resume layer so the notes are re-enterable (Phase 4).

---

## 1. Phase 1 — The figure system (do this first: highest leverage, lowest risk)

> **Overlaps `DIAGRAM_STANDARDIZATION.md` — read this before running Phase 1.** That plan retrofits figure *internals* (SVG containment, a shared `--dia-*` token layer, one coordinate unit, renderers); this Phase 1 governs figure *width* (the `.figure--*` wrapper tiers below). They touch the same wrappers from opposite sides. Resolve the sequencing decision in `DIAGRAM_STANDARDIZATION.md` §Relationship (which figure pass runs first, or whether they merge) before rewriting any wrapper, so the same markup isn't rewritten twice.

**Why first.** It is a pure shared-asset refactor. It touches `tokens.css` + `components.css` + a mechanical wrapper swap in the lesson HTML. It cannot break interactive logic. And it is the single biggest lever on the exact complaint you named out loud (random sizes, inconsistent formatting) — the same way the flex fix in the bug pass killed one class of problem everywhere at once.

**The design.** One primitive replaces all six ad-hoc wrappers. Width is chosen from a **small named set tied to the prose column**, never a raw pixel value, and the tier is chosen by *how much information the figure carries*, not by what kind of diagram it is.

Tokens (add to `tokens.css`). Root font-size is the browser default 16px (verified — `html` sets no font-size), so these are the real pixel widths:
```
--fig-sm:   24rem;   /* 384px — a single glyph, one atom, a lever; glance-sized on purpose */
--fig-md:   34rem;   /* 544px — a labelled particle diagram, a small process */
--fig-full: var(--prose);   /* 52rem / 832px — the default; matches the text column */
--fig-wide: 68rem;   /* 1088px — earns the width: multi-panel, before/after, wide process, data */
```

These are decided, not proposed. Reasoning: `sm` at 384px is a real step below the column so a lone lever or atom reads as a deliberate small figure, not an accident; `md` at 544px is the honest home for the old 360px atoms, which were reading as too small; `full` is pinned to the prose column so the default figure and the text share an edge; `wide` at 1088px is a genuine step up (1.3× full) while sitting comfortably inside the 78rem / 1248px content wrap. The ladder steps are distinct (1.42× / 1.53× / 1.31×), so a reader can feel the difference between tiers rather than seeing near-duplicates.

**Implementation catch the executor must handle:** body text lives in a 52rem `.narrow` wrapper, so a `--full` or `--wide` figure placed inside that wrapper is silently capped at 52rem no matter what its tier says. `--wide` figures (and any `--full` figure that should truly match the column) must sit outside `.narrow` or bleed out of it (negative-margin or a full-bleed container). If they do not, the `wide` tier is a no-op. Verify this in the browser, not just in the CSS.

Primitive (replace the six wrappers in `components.css`):
```
.figure          { margin: 1.75rem auto; }
.figure--sm      { max-width: var(--fig-sm); }
.figure--md      { max-width: var(--fig-md); }
.figure--full    { max-width: var(--fig-full); }
.figure--wide    { max-width: var(--fig-wide); }
.figure svg, .figure img { width: 100%; height: auto; display: block; }
.figure .diagram-cap { /* keep existing caption styling */ }
.figure .legend      { /* keep existing legend styling */ }
```

**The rule, written into CLAUDE.md as golden rule 16:** default every figure to `--full`. Drop to `sm`/`md` only when the figure genuinely reads better small (a lone atom, a single lever). Go `wide` only when the figure is doing enough work to earn bleeding past the text column. **No figure ever sets a raw pixel width again.**

**Migration map** (mechanical, one pass):

| Current wrapper | New class | Notes |
|---|---|---|
| `.atom-svg` (360px) | `.figure .figure--md` | most were too small; md is a real bump |
| `.lever-svg` (300px) | `.figure .figure--sm` | a lever is a glance-figure; sm is honest |
| `.compass-wrap` (600px) | `.figure .figure--full` | |
| `.single-atom-wrap` (600px) | `.figure .figure--full` | |
| `.octet-wrap` (640px) | `.figure .figure--full` | |
| `.ptable` (680px) | `.figure .figure--wide` | keep `min-width:520px` so it never collapses |
| bare `.diagram` (100%) | wrap in `.figure .figure--full` | |

**Paste-ready Claude Code prompt:**
> Read `REVISION_PLAN.md` §1 and `INTERACTION_SPEC.md`. (1) Add the four `--fig-*` tokens to `tokens.css`. (2) Add the `.figure` primitive to `components.css` and remove the six superseded wrapper rules (`.atom-svg`, `.lever-svg`, `.compass-wrap`, `.single-atom-wrap`, `.octet-wrap`, and the width portion of `.ptable`) once nothing references them. (3) Rewrite every figure wrapper across all 12 lesson HTML files per the migration map. Preserve every caption, legend, and `.diagram` lightbox hook. (4) Add golden rule 16 to CLAUDE.md. Verify with Playwright: screenshot every lesson in light and dark mode, confirm no figure is narrower than its content needs and no figure overflows the column, and confirm lightboxing still fires on every figure.

**Author sign-off before running:** none. The tiers are decided above. Run it, then react to the rendered result — if a specific tier feels wrong once you see real figures at those widths, it is a one-line token change, not a rebuild.

---

## 2. Phase 2 — Deploy the motion system that already exists

**The gap.** `INTERACTION_SPEC.md` specifies a motion taxonomy. `core.js` implements `initStepPrimitive`, `initZoomPrimitive`, `initScrubPrimitive`. `_widget-test.html` proves all three work. And then the lessons use them three times total. Every sequential or scale-based idea that is currently a frozen T0 snapshot is a place the product is quietly ignoring its own design system.

**The principle (not motion for its own sake — tie to the Tversky rationale already in your taxonomy):**
- **`step`** for anything that happens *in sequence*: balancing an equation, building a Lewis structure atom by atom, filling electron shells, a mole-conversion chain, a reaction proceeding reactants → products.
- **`zoom`** for anything that changes *scale*: mole ↔ particle count, atomic ↔ bulk sample, a labelled macro object → its particle-level structure.
- **`scrub`** for anything that varies *continuously*: a trend across a period or down a group, energy along a reaction coordinate, temperature driving phase motion.

**Deployment target:** every lesson gets **at least one** motion primitive replacing a static snapshot of a process or scale change, wherever the content contains one. Candidate map (executor confirms against actual section content; author confirms the chemistry):

| Lesson | Static snapshot that should move | Primitive |
|---|---|---|
| 1-1a | electron-shell filling (already has one step; add shell-by-shell fill) | `step` |
| 1-1b | trend across period / down group | `scrub` — **SKIPPED 2026-07-07**: the reference-build lesson already has two rich bespoke interactives covering this (the `s-atom` period/group Bohr stepper and the `s-explorer` tap-to-compare heat-map); author decided not to retrofit them onto the shared scrub primitive or touch the lesson this pass. The one true T0 static diagram (the `s-reactivity` metallic/nonmetallic compass) was identified as a real scrub candidate but deferred along with the rest. |
| 1-2a | bond character as ΔEN varies (ionic → polar → nonpolar) | `scrub` |
| 1-2b | dipole vectors summing to net polarity | `step` |
| 1-3a | Lewis structure built atom-by-atom, octet checked per step | `step` |
| 1-3b | IMF strength vs. property (boiling point) as you vary the molecule | `scrub` |
| 2-2a | a physical vs. chemical change at particle level, before → after | `step` |
| 2-7a | already has zoom — good; leave it | — |
| 2-7b | the mole-conversion chain (grams → mol → particles) walked one arrow at a time | `step` |
| 2-7c | limiting-reactant BCA table filling row by row | `step` |
| C-RXN | already has step — extend to the reaction-type classifier | `step` |
| C-SPA | the fat melt → re-solidify lamination zoom (ghee flows on the hot tawa, re-solidifies into thin films → layer barriers → flaky texture; no steam — see §7 item 5) | `zoom` |

**Hard constraints (already in the spec — enforce them):** no autoplay loops; everything scrubbable or steppable by the student; `prefers-reduced-motion` fallback on every one.

**Paste-ready prompt (run per lesson, not all at once):**
> Read `REVISION_PLAN.md` §2 and `INTERACTION_SPEC.md` §2. In `<LESSON>`, locate the static diagram identified in the deployment map and rebuild it using the `<PRIMITIVE>` motion primitive from `core.js`, following the `_widget-test.html` reference exactly. Keep the T0 content as the `prefers-reduced-motion` fallback. Do not invent a new primitive. Verify with Playwright frame-by-frame that stage height is fixed, one frame shows at a time, and the reduced-motion fallback renders the full static diagram.

---

## 3. Phase 3 — Break the interaction loop

**The diagnosis, precisely.** The retrieval *pedagogy* is already good and varied. The *interaction grammar* is one verb: produce → reveal. The two sections everyone remembers as good (Bohr builder, balance beam) are the only two where the verb is **manipulate → observe consequence**. That is the missing grammar, not more quiz types.

**The wider grammar to introduce** (each is a distinct physical act, not a reskinned reveal gate):

1. **Manipulate → consequence.** Change an input, watch a particle diagram / value / structure update live. Generalise the Bohr builder and the balancer into a reusable pattern. *This is the one every lesson should have at least once.*
2. **Sort / classify.** Drag items into bins (reaction types, IMF strength order, physical vs. chemical, polar vs. nonpolar). Retrieval as categorisation, not recall-and-type.
3. **Predict → run.** Commit a prediction, then *run the actual thing* and see whether the particle-level result matches — the model is the feedback, not a text reveal.
4. **Diagnose the error.** Show a *wrong* worked example; student finds the mistake. Inverts the reveal — the student is the marker. Pairs naturally with the mark-scheme sections you already have.
5. **Construct with live validation.** Build a Lewis structure / formula / configuration and get continuous valence/octet/charge feedback as you build, not after you submit.

**The verb budget (new golden rule + INTERACTION_SPEC entry):**
- No more than **two consecutive sections** may share the same interaction verb.
- Every lesson contains **at least one manipulate→consequence** interactive, not only reveal gates.
- Reveal gates are still fine — they are just no longer allowed to be the *whole* page.

**Sequence of work.** This is per-lesson design, so do it as: (a) build one reference conversion — take 2-7a or C-RXN and re-grammar it to the budget, screenshot it, get author sign-off that this is the target feel; (b) then a per-lesson pass using that as the pattern. Do **not** batch all 12 blind.

**Paste-ready prompt (reference build, run once):**
> Read `REVISION_PLAN.md` §3. Take `<REFERENCE LESSON>` and revise its section sequence to satisfy the verb budget: introduce at least one manipulate→consequence interactive, at least one non-reveal verb (sort, diagnose-the-error, or predict→run), and ensure no more than two consecutive sections share a verb. Reuse existing `core.js` widgets where possible; flag any genuinely new widget type before building it. Keep all VOICE.md constraints. Screenshot the full page for author review before touching any other lesson.

**Author sign-off:** the verb budget itself (§7 item 6) — "no 2 consecutive same verb" may be too strict for a short lesson; you decide the exact rule.

---

## 4. Phase 4 — Notes, not a textbook (the re-enterable layer)

**The point.** Right now the only way to use a lesson is to read it end to end. Notes get *returned to*. This phase makes each lesson re-enterable in three ways:

- **A one-screen synopsis** at the top of every lesson (collapsed by default): the 3–5 load-bearing claims, the single most important figure, and the retrieval checklist. A returning student hits this without re-reading the narration. This is also the seed of the already-built PDF export (`INTERACTION_SPEC.md` §3.5) — same content, two surfaces.
- **A "quick check" path**: a control that jumps straight to the retrieval tasks and skips the prose, for the 2nd+ visit. The narration is for first exposure; the retrieval is for every visit after.
- **A persistence / resume layer**: make the existing 0/4 checkpoints actually persist per lesson (they currently reset), so a student can leave, come back, resume, and *see what they have not yet retrieved*. This is the single change that turns the whole retrieval architecture from fire-once into spaced. It is item 1 in `FEATURES.md`'s backlog — this plan promotes it to committed work because without it the pedagogical thesis does not hold.

> **Storage note for the executor:** if the persistence layer is built inside a Claude.ai *artifact*, browser `localStorage`/`sessionStorage` are unavailable there and the `window.storage` key-value API must be used instead. On the live GitHub Pages site there is no such restriction, but keep the storage access behind one small module so the same lesson code runs in both places. Confirm the target surface before building (§7 item 4).

**Cross-lesson reference tools** (also from `FEATURES.md`, pull the highest-value two): a persistent dropdown periodic table and a formula/constants sheet, available from the topbar on every lesson, so the notes double as a reference during retrieval instead of sending the student elsewhere.

**Paste-ready prompt (synopsis + quick-check, run per lesson after Phases 1–3):**
> Read `REVISION_PLAN.md` §4. For `<LESSON>`, add a collapsed one-screen synopsis (load-bearing claims + primary figure + retrieval checklist) and a "quick check" control that scrolls/filters to the retrieval sections only. Reuse existing components; match VOICE.md. Do not duplicate content — the synopsis references the same figure, it does not redraw it.

**Paste-ready prompt (persistence, run once, shared asset):**
> Read `REVISION_PLAN.md` §4 and `FEATURES.md` item 1. Build a small persistence module that stores per-lesson checkpoint completion and surfaces, on each lesson and on the index, what has and has not been retrieved. Gate all storage access behind one module so it works on both GitHub Pages and inside a Claude artifact. Verify resume works across a page reload.

---

## 5. Phase 5 — Density floor + coverage sweep

With the figure system (Phase 1) and motion (Phase 2) in place, do a per-lesson audit against a written floor:

- **Floor:** at least one particle/atomic diagram per section whose content is particulate (this is already your stated convention — it is just not met). 2-7b (0 SVG) is the worst offender and gets a real diagram pass, not a token one.
- **Variance cap:** no lesson should carry ~4× another lesson's visual weight for comparable scope. Use the SVG-count spread (0–29) as the smell test, not a hard metric.

**Paste-ready prompt (per starved lesson):**
> Read `REVISION_PLAN.md` §5, `CLAUDE.md` particle-diagram conventions, and `Diagram_Inventory_v2.md`. Audit `<LESSON>` against the density floor. For each particulate section lacking a diagram, add one following the `.d-*` conventions (filled circles + legend, conserved particles, phase-motion vocabulary) and the new `.figure` system. Verify chemistry against the lesson's PLC review sheet before drawing.

---

## 6. Phase 6 — Finish 1-2b, then a final coherence sweep

- ~~**Build 1-2b** (molecular polarity)~~ — done; 1-2b shipped 2026-07-05 (see `CHANGELOG.md`), before this revision pass was proposed. It was **not** built natively to the new standard (figure system, motion, verb budget, synopsis), so it still needs the retrofit sweep below like every other lesson — it isn't exempt.
- **Final sweep:** render all 12 in light + dark, confirm the figure system is uniform, confirm every lesson meets the verb budget and the motion floor, confirm the synopsis + persistence work everywhere. Then commit — note nothing has been committed since the remediation pass either, so this is also the moment to land that work.

---

## 7. Author sign-off items (conceptual + taste calls only you can make)

These block the phases noted. Chemistry-accuracy items are yours to verify against PLC materials — I flag, I do not resolve. I can cross-check any of them against the Unit 1 / Unit 2 review sheets already in the project if you want a second read, but the PLC sheet is authoritative, not me.

1. **Figure tier breakpoints** — DECIDED: 24 / 34 / 52 / 68 rem (§1). No longer blocks Phase 1. React to the rendered result if a tier feels off; it is a one-line change.
2. **Motion deployment map** (blocks Phase 2) — is the lesson→primitive mapping in §2 right, or would you move any?
3. **K→Ga 4s/3d energy-ordering simplification** — DECIDED 2026-07-07: use the existing n+l/Aufbau simplification already built in `1-1a` (electron 19 takes 4s before 3d because 4s is momentarily lower energy; 3d dips back below 4s once 4s is full, so Sc–Zn finish shell 3; Cr/Cu single-electron-promotion exceptions stay flagged as beyond the assessment boundary, per the existing "Show the two exceptions" toggle). No longer blocks Phase 2's shell-fill extension for 1-1a.
4. **Persistence target surface + scope** (blocks Phase 4) — GitHub Pages only, or must it also run inside a Claude artifact? And is the FEATURES backlog item approved for build now?
5. **Roti prata lamination/steam mechanism** — DECIDED 2026-07-07: drop "steam" — it isn't in the Unit 2 Review Sheet or Consensus Notes' fat/lamination section (Arc 3) and was a conflation with a separate Arc 1 driving question about dough puffing/gas production, which is a different (chemical-reaction) mechanism, not C-SPA's structure→property territory. The C-SPA zoom is **fat melt → re-solidify lamination only**: ghee melts and flows on the hot tawa, then re-solidifies into thin films that create solid layer barriers → flaky texture (Review Sheet, Arc 3 fats section, verbatim mechanism). No longer blocks Phase 2's C-SPA zoom; update the §2 deployment-map row description accordingly when building it.
6. **The verb budget rule** (blocks Phase 3) — is "no more than two consecutive same-verb sections" right, too strict, or too loose?

Still-open chemistry items from prior sessions that touch this work if the relevant lessons get revised: H–F polar-covalent boundary framing (ΔEN 1.78) for 1-2a; which GHS pictograms the PLC uses for sodium (Unit 1). Fold these in when those lessons come up.

---

## 8. Execution order + QA protocol

**Order:** 1 → 2 → 3 (reference build first, sign-off, then per-lesson) → 4 → 5 → 6. Phase 1 is the unblocked, do-it-now win. Phases 2–5 run **lesson by lesson**, not batched, matching your existing build cadence.

**QA per phase (matches your Playwright tooling and the remediation pass's discipline):**
- Screenshot every touched page in **light and dark** before moving on.
- After every batch, run the structural HTML parser + JSON-config validator across all 12 lessons — this is what caught the 2-7a/1-1a DOM corruptions last time; keep it.
- For motion: verify fixed stage height frame-by-frame and confirm the `prefers-reduced-motion` fallback renders the full static content.
- For the figure system: confirm no figure is smaller than its content needs and none overflows; confirm lightbox still fires.
- Commit after each phase — the tree is currently uncommitted back to the remediation pass, which is a real risk in itself.
