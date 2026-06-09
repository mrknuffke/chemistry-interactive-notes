# CLAUDE.md — Gen Chem Interactive Notes

This repo builds a set of **interactive HTML review pages** for a high-school
General Chemistry course (Semester 1). They are studied **outside class, after
first exposure**, so the job is *retrieval practice woven with a second,
differently-framed re-narration* — not first teaching, not a quiz bank.

`lessons/1-1b_periodic-trends-reactivity.html` is the **reference
implementation**. Match its structure, pedagogy, and visual language. When in
doubt, open it and follow it.

---

## Golden rules (read before building anything)

1. **Hew to the review sheets, not the consensus notes.** The PLC has reviewed
   and committed to the review-sheet content; the consensus notes are stale and
   not yet updated. If something is only in the consensus notes (e.g. VSEPR,
   empirical formula), it is **not** headline content here. Source of truth =
   the review sheets in `References/`.
2. **Verify all chemistry.** Every periodic value, ΔEN cutoff, balanced
   equation, molar mass, and Bohr configuration goes into student materials.
   Check it. Do not trust memory or a plausible-looking number.
3. **Render before declaring done.** Most quality bugs are visual (a glitchy
   glyph, dead space, an arrow that's the wrong color, a misleading particle
   diagram). Open and test the page in a browser (light and dark mode) to actually check the output.
4. **Adhere to the particle-diagram conventions** in `References/` (see below).
   Diagrams must be chemically honest — a diagram that only *looks* energetic is
   worse than no diagram.
5. **One accent.** Vermilion is the only accent color. Green means
   "correct/positive" only. Cool→hot blue/red is for sequential heat-maps only.
   Don't introduce new hues.
6. **Concept-before-definition & term styling:** Always explain a concept in plain English *before* introducing/naming the term. Wrap defined terms in `<strong class="term">` (styled with a dashed vermilion underline in CSS) to aid visual focus and support future automated glossary index search.

---

## File / project structure

```
assets/
  tokens.css       design tokens: fonts, colors, base type, grid bg, dark mode
  components.css   shared component library (frame, widgets, diagram conventions)
  core.js          shared behaviors (theme, TOC, nav, reveal, retrieval widgets)
lessons/
  <id>_<slug>.html one file per lesson; links ../assets/*, plus its own <id>.js
  <id>.js          lesson-specific interactives ONLY (Bohr builder, explorer…)
References/         review sheets + convention posters (AUTHORITATIVE content/conventions)
```

Lesson HTML should be **mostly content**. Shared CSS/JS lives in `assets/`.
If you find yourself copying a style or behavior between two lessons, lift it
into `components.css` / `core.js` instead.

---

## The file manifest (11 files; every PE within a 3-file cap)

Built from the review-sheet sub-targets, with shared chemistry deduplicated into
canonical files.

**Unit-1-specific**
- `1-1a` Atomic Structure & Electron Configuration — PS1-1.2, .3
- `1-1b` Periodic Trends & Reactivity — PS1-1.1, .4, .5   ← REFERENCE BUILD (done)
- `1-2a` Bonding & Electronegativity — PS1-2.1
- `1-3a` Lewis Structures — PS1-3.4 (Lewis only; **no VSEPR headline**)
- `1-3b` IMFs & Properties — PS1-3.5 (+ HS-PS1-3 investigation coda)

**Unit-2-specific**
- `2-2a` Physical vs Chemical Change & Particle Diagrams — PS1-2.1, .4
- `2-7a` The Mole & Molar Mass — PS1-7.1, .5
- `2-7b` Mole Conversions — PS1-7.2 (empirical formula NOT included — absent from sheet)
- `2-7c` Stoichiometry — molar ratios, BCA, limiting/excess — PS1-7.3, .4

**Shared canonical (serve both units)**
- `C-RXN` Reaction Types & Balancing — PS1-2.2, .3 (replaces a per-unit copy in each)
- `C-SPA` Structure → Property → Argument — PS2-6 (all sub-targets). Owns the
  geometry → polarity → IMF reasoning. GHS-hazard and food-texture are two
  worked applications of the *same* argument; do not split into two files.

Decisions that are easy to re-make wrong, so they're fixed:
- **VSEPR**: not an assessed sub-target. At most a connective sentence inside
  `C-SPA`. Never a headline section.
- **Empirical formula**: absent from the Unit-2 review sheet. Omit.
- **Geometry/polarity** live in `C-SPA` (that's where the sheet locates them),
  not in `1-3a`. `1-3a` is Lewis-structures-only and stays lean.

---

## Pedagogical spine (every lesson)

Retrieval **and** re-narration, interleaved — never narrate-then-quiz at the end.
The reference order, adapt as content needs:

1. **Hook** — a concrete phenomenon/contrast (kept *light*; the chemistry stands
   on its own, not hostage to the unit storyline). One callback to the class
   phenomenon is fine; don't make the file depend on it.
2. **Re-narration** — a second, differently-framed explanation of the core idea,
   carried by **diagrams** as much as prose. Keep prose tight; if a block feels
   text-heavy, convert part of it to a diagram or a tap-to-expand.
3. **Signature interactive** — at least one per file; a second only where the
   content earns it (e.g. `2-7c` wants a fillable BCA table *and* a
   limiting-reactant visual; `C-RXN` wants a drag-to-balance equation).
4. **Predict-then-reveal** — make them commit before the answer.
5. **Recall** (fill-in-the-blank), **self-explain** (free text + model answer),
   **exam practice** (constructed response + self-scorable mark scheme with a ⚑
   on the move that separates full from partial credit).

Each `<section>` ends with a `data-next` button; the topbar has a TOC built from
`section[data-toc]`. Sections are numbered `01…NN` via `.section-tag .num`.

---

## Visual language

- **Fonts** (all open-source Google Fonts, loaded via `@import` in tokens.css):
  - Display / UI / headings: **Hanken Grotesk** (heavy weights)
  - Prose: **Spectral** (lining figures forced via `font-feature-settings`)
  - Labels / data / chemistry: **IBM Plex Mono**
- **Palette**: cool sage graph-paper ground, deep ink, single **vermilion**
  accent, **green** = correct/positive. Faint graph-paper grid is the signature
  texture. Light + dark mode (toggle persists in localStorage).
- **Heat-maps**: sequential quantities use a **cool→pale→hot** (blue→red)
  diverging scale with luminance-based text color. *Categorical* data (e.g.
  metal vs nonmetal reactivity) uses the vermilion/green split instead — keep
  these distinct.
- Don't over-format. Minimal headers; prose over bullet lists in explanations.

---

## Particle-diagram conventions (from `References/` posters — ADHERE)

These are the class's established modeling conventions. Reuse the `.d-*` classes
in `components.css`.

- **Particles** = filled circles (`.d-particle`); some atoms as squares
  (`.d-metal`). Distinct fills per a **legend** (always include one).
- **Framing** = dashed box (`.d-frame`) wraps a before→after system; a single
  snapshot uses a solid box. Label Before / After.
- **Container** = solid open-top walls (`.d-wall`) + a blue wavy water line
  (`.d-water`).
- **Conservation** = atom counts MUST match before and after.
- **Phase & motion**: solid = **brackets**, liquid = **lumps**, gas = **tails**;
  more marks = hotter / more energy. (Bring these in for phase/IMF/reaction
  files — `2-2a`, `C-RXN`, `1-3b`.)
- **Energy** = energy-bar diagrams (conserved total; gain/loss shown; bars
  lost as heat). Use for any energy-accounting visual.
- **Atomic level** = Bohr model (see `1-1b.js`); animate electrons orbiting.
- Honest > pretty. If a diagram can't be made chemically correct at the level
  shown, simplify the claim (e.g. show single-particle ionization instead of a
  fake macro reaction) rather than fudge it.

---

## Shared widget contract (in `core.js`, data-attribute driven)

- `[data-next]` → scroll to next `<section>`
- `section[data-toc="Label"]` → adds a TOC entry
- `.reveal` → fades in on scroll
- `[data-more="label"]` + following `.more-body` → expand/collapse
- `[data-predict="key"]` (with `.opt[data-correct]`) + `[data-reveal="key"]`
- `.recall` container with `.blank[data-answer="a|alt"]` + `[data-recall-check]`
  `[data-recall-reveal]` `[data-recall-reset]` `[data-recall-feedback]`
- `[data-peek]` + following `.peek-box`
- `[data-scheme]` inside `.exam-frame` (toggles the `.scheme`)

`data-answer` accepts `|`-separated alternates; matching is case/space-insensitive.

Lesson-specific interactives go in `lessons/<id>.js` and must guard on element
existence (`if (!el) return;`) so the file is safe to load anywhere.

---

## Workflow per lesson

1. Read the relevant review sheet in `References/`. List the sub-targets.
2. Draft the section outline (hook → re-narration → interactive(s) → retrieval).
3. Decide the signature interactive(s) and any particle/energy diagrams.
4. Build the HTML (content + lesson JS), linking the shared assets.
5. **Verify chemistry.** Open the page in a web browser (using a local server) and test it thoroughly in both light and dark modes.
6. Fix what you see. Repeat.

Tone for prose: direct, lightly wry, second-person, no fluff — match the voice in
`1-1b` and the author's older notes. Spell out abbreviations on first use
(e.g. "ionization energy (IE)") before using the short form.
