# CLAUDE.md — Behavioral Guidelines & Project Contract

## 1. Behavioral Guidelines (Reduce common LLM coding mistakes)

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**
Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Simplicity First
**Minimum code that solves the problem. Nothing speculative.**
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Surgical Changes
**Touch only what you must. Clean up only your own mess.**
When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.
- Every changed line should trace directly to the user's request.

### Goal-Driven Execution
**Define success criteria. Loop until verified.**
Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

---

## 2. Project Contract (Chemistry Interactive Text)

This repo builds a set of **interactive HTML review pages** for a high-school General Chemistry course (Semester 1). They are studied **outside class, after first exposure**, so the job is *retrieval practice woven with a second, differently-framed re-narration* — not first teaching, not a quiz bank.

`lessons/1-1b_periodic-trends-reactivity.html` is the **reference implementation**. Match its structure, pedagogy, and visual language. When in doubt, open it and follow it.

---

## 3. Golden Rules (Read before building anything)

1. **Hew to the review sheets, not the consensus notes.** The PLC has reviewed and committed to the review-sheet content; the consensus notes are stale and not yet updated. If something is only in the consensus notes (e.g. VSEPR, empirical formula), it is **not** headline content here. Source of truth = the review sheets in `References/` (inside `scaffold/References/`).
2. **Verify all chemistry.** Every periodic value, ΔEN cutoff, balanced equation, molar mass, and Bohr configuration goes into student materials. Check it. Do not trust memory or a plausible-looking number.
3. **Render before declaring done.** Most quality bugs are visual (a glitchy glyph, dead space, an arrow that's the wrong color, a misleading particle diagram). Open and test the page in a browser (light and dark mode) to actually check the output.
4. **Adhere to the particle-diagram conventions** in `References/` (see below). Diagrams must be chemically honest — a diagram that only *looks* energetic is worse than no diagram.
5. **One accent.** Vermilion is the only accent color. Green means "correct/positive" only. Cool→hot blue/red is for sequential heat-maps only. Don't introduce new hues.
6. **Concept-before-definition & term styling:** Always explain a concept in plain English *before* introducing/naming the term. Wrap defined terms in `<strong class="term">` — this applies the dashed vermilion underline AND triggers a hover/tap tooltip from `glossary.js` when the text slug matches a `GC_GLOSSARY` key. Add `data-term="slug"` to override the auto-slug when the visible text doesn't normalize cleanly. When you introduce a new defined term in a lesson, add it to `assets/glossary.js` too.
7. **No LaTeX formatting:** Never use LaTeX formatting syntax (like $H_2$, $O_2$, or $\Delta EN$) in HTML content. Instead, use HTML tags (e.g., `H<sub>2</sub>`, `O<sub>2</sub>`, `&Delta;EN`) to ensure proper, clean rendering in the browser without any math engines.
8. **Keep storylines/contexts light and tangential:** Focus heavily on the core chemistry, not the storylines. The storylines (e.g. roti prata, tawa) are tangential and can be referenced briefly, but always in a general way that works for any student, even if they are unfamiliar with the specific story context. Do not let contexts overwhelm chemical explanations.
9. **Follow the VOICE.md Prose Contract:** All student-facing text must follow the rules in `VOICE.md` (root directory): use second person ("you"), predict specific misconceptions by name, concrete before abstract, short declaratives, no throat-clearing, and describe consequences rather than just definitions. Widget feedback must explain the temptation of the incorrect choice, never just say "incorrect". Run the `VOICE.md` §6 QA pass (read aloud, check banned words, check misconceptions) before declaring any page done.
10. **Gated Interaction Contract (INTERACTION_SPEC.md):** Commit-before-reveal is mandatory on all widgets and predict prompts. Never let the student see the answer or proceed without committing an answer first. Parity for keyboard and touch, no persistence of state on reload. Green means correct/positive only; incorrect uses vermilion outline/text, never red fill. Follow the widget config patterns and motion controller specifications defined in `INTERACTION_SPEC.md` (root directory).
11. **Session Sequence & QA Gates:** Develop files strictly in the session sequence and using the QA gates and prompts specified in `BUILD_PLAN.md` (root directory).

---

## 4. File / Project Structure

### Root Planning & Guidelines Directory
```
CLAUDE.md               Behavioral guidelines & design constraints
README.md               Comprehensive project context, setup, and deployment notes
BUILDING.md             Step-by-step checklist for building a lesson
BUILD_PLAN.md           Roadmap sequence for development sessions
VOICE.md                Pedagogical tone and feedback text style contract
INTERACTION_SPEC.md     Specifications for retrieval widgets and motion controllers
Diagram_Inventory_v2.md SVG design details and particle diagram counts
Content_Expansion_v2.md Draft text/copy database for content updates
```

### Scaffold Web App Directory (`scaffold/`)
```
scaffold/
  assets/
    tokens.css       design tokens: fonts, colors, base type, grid bg, dark mode
    components.css   shared component library (frame, widgets, diagram conventions)
    core.js          shared behaviors (theme, TOC, nav, reveal, retrieval widgets, glossary tooltips)
    glossary.js      window.GC_GLOSSARY — 62 term definitions; drives hover tooltips on <strong class="term">
    elements.js      window.GC_ELEMENTS — canonical periodic data (Z=1..36); read from here, never retype
  lessons/
    <id>_<slug>.html one file per lesson; links ../assets/*, plus its own <id>.js
    <id>.js          lesson-specific interactives ONLY (Bohr builder, explorer…)
  References/        review sheets + convention posters (AUTHORITATIVE content/conventions)
  index.html         Home dashboard page and search portal
  lessons.json       Lessons database metadata (tracks progress and units)
```

Lesson HTML should be **mostly content**. Shared CSS/JS lives in `assets/`. If you find yourself copying a style or behavior between two lessons, lift it into `components.css` / `core.js` instead.

---

## 5. File Manifest (11 files; every PE within a 3-file cap)

Built from the review-sheet sub-targets, with shared chemistry deduplicated into canonical files.

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
- `C-SPA` Structure → Property → Argument — PS2-6 (all sub-targets). Owns the geometry → polarity → IMF reasoning. GHS-hazard and food-texture are two worked applications of the *same* argument; do not split into two files.

Decisions that are easy to re-make wrong, so they're fixed:
- **VSEPR**: not an assessed sub-target. At most a connective sentence inside `C-SPA`. Never a headline section.
- **Empirical formula**: absent from the Unit-2 review sheet. Omit.
- **Geometry/polarity** live in `C-SPA` (that's where the sheet locates them), not in `1-3a`. `1-3a` is Lewis-structures-only and stays lean.

---

## 6. Pedagogical Spine (Every lesson)

Retrieval **and** re-narration, interleaved — never narrate-then-quiz at the end. The reference order, adapt as content needs:

1. **Hook** — a concrete phenomenon/contrast (kept *light*; the chemistry stands on its own, not hostage to the unit storyline). One callback to the class phenomenon is fine; don't make the file depend on it.
2. **Re-narration** — a second, differently-framed explanation of the core idea, carried by **diagrams** as much as prose. Keep prose tight; if a block feels text-heavy, convert part of it to a diagram or a tap-to-expand.
3. **Signature interactive** — at least one per file; a second only where the content earns it (e.g. `2-7c` wants a fillable BCA table *and* a limiting-reactant visual; `C-RXN` wants a drag-to-balance equation).
4. **Predict-then-reveal** — make them commit before the answer.
5. **Recall** (fill-in-the-blank), **self-explain** (free text + model answer), **exam practice** (constructed response + self-scorable mark scheme with a ⚑ on the move that separates full from partial credit).

Each `<section>` ends with a `data-next` button; the topbar has a TOC built from `section[data-toc]`. Sections are numbered `01…NN` via `.section-tag .num`.

---

## 7. Visual Language

- **Fonts** (all open-source Google Fonts, loaded via `@import` in tokens.css):
  - Display / UI / headings: **Hanken Grotesk** (heavy weights)
  - Prose: **Spectral** (lining figures forced via `font-feature-settings`)
  - Labels / data / chemistry: **IBM Plex Mono**
- **Palette**: cool sage graph-paper ground, deep ink, single **vermilion** accent, **green** = correct/positive. Faint graph-paper grid is the signature texture. Light + dark mode (toggle persists in localStorage).
- **Heat-maps**: sequential quantities use a **cool→pale→hot** (blue→red) diverging scale with luminance-based text color. *Categorical* data (e.g. metal vs nonmetal reactivity) uses the vermilion/green split instead — keep these distinct.
- Don't over-format. Minimal headers; prose over bullet lists in explanations.
- **Diagram sizes & Lightbox zoom:** Static diagrams must have a spacious, readable size (use standard wrap classes like `.compass-wrap` (600px), `.single-atom-wrap` (600px), and `.octet-wrap` (640px) or set appropriate inline `max-width` like `480px` or `580px`). Clicking any diagram SVG automatically opens a high-resolution, centered Lightbox viewer overlay with en-dash/subscript support.

---

## 8. Particle-Diagram Conventions (From References/ posters — ADHERE)

These are the class's established modeling conventions. Reuse the `.d-*` classes in `components.css`.

- **Particles** = filled circles (`.d-particle`); some atoms as squares (`.d-metal`). Distinct fills per a **legend** (always include one).
- **Framing** = dashed box (`.d-frame`) wraps a before→after system; a single snapshot uses a solid box. Label Before / After.
- **Container** = solid open-top walls (`.d-wall`) + a blue wavy water line (`.d-water`).
- **Conservation** = atom counts MUST match before and after.
- **Phase & motion**: solid = **brackets**, liquid = **lumps**, gas = **tails**; more marks = hotter / more energy. (Bring these in for phase/IMF/reaction files — `2-2a`, `C-RXN`, `1-3b`.)
- **Energy** = energy-bar diagrams (conserved total; gain/loss shown; bars lost as heat). **Note:** Energy-bar diagrams are deferred to Unit 3 (next unit) and MUST NOT be used in Unit 2. Use only particle diagrams for Unit 2.
- **Atomic level** = Bohr model (see `1-1b.js`); animate electrons orbiting.
- **Honest > pretty.** If a diagram can't be made chemically correct at the level shown, simplify the claim (e.g. show single-particle ionization instead of a fake macro reaction) rather than fudge it.

---

## 9. Shared Widget Contract (In core.js, data-attribute driven)

- `[data-next]` → scroll to next `<section>`
- `section[data-toc="Label"]` → adds a TOC entry
- `.reveal` → fades in on scroll
- `[data-more="label"]` + following `.more-body` → expand/collapse
- `[data-predict="key"]` (with `.opt[data-correct]`) + `[data-reveal="key"]`
- `.recall` container with `.blank[data-answer="a|alt"]` + `[data-recall-check]` `[data-recall-reveal]` `[data-recall-reset]` `[data-recall-feedback]`
- `[data-peek]` + following `.peek-box`
- `[data-scheme]` inside `.exam-frame` (toggles the `.scheme`)
- `<strong class="term">` → hover/tap tooltip from `window.GC_GLOSSARY` (defined in `glossary.js`). Slug = normalized text content (lowercase, spaces→hyphens, strip punctuation). Override with `data-term="slug"`. No glossary entry = silent no-op. Requires `glossary.js` loaded after `core.js`.

`data-answer` accepts `|`-separated alternates; matching is case/space-insensitive.

Lesson-specific interactives go in `lessons/<id>.js` and must guard on element existence (`if (!el) return;`) so the file is safe to load anywhere.

---

## 10. Workflow Per Lesson

1. Read the relevant review sheet in `References/`. List the sub-targets.
2. Draft the section outline (hook → re-narration → interactive(s) → retrieval).
3. Decide the signature interactive(s) and any particle/energy diagrams.
4. Build the HTML (content + lesson JS), linking the shared assets. Script load order: `core.js` → `glossary.js` → `elements.js` (if needed) → `<id>.js`.
5. For every `<strong class="term">` you write, verify the slug exists in `glossary.js`. Add a new entry if needed; do not leave a term without a definition.
6. **Verify chemistry.** Open the page in a web browser (using a local server) and test it thoroughly in both light and dark modes.
7. Fix what you see. Repeat.

**Tone for prose:** direct, lightly wry, second-person, no fluff — match the voice in `1-1b` and the author's older notes. Spell out abbreviations on first use (e.g. "ionization energy (IE)") before using the short form.
