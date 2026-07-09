# CLAUDE.md — Behavioral Guidelines & Project Contract

> **New session? Read [`TODO.md`](TODO.md) first** — it's the current, unified single source of truth for what's left to do, including design-level revision plans, open curriculum decisions, and the feature backlog. All 12 manifest lessons are built, a full consistency/bug-fix pass is done, and PDF/print export is built and verified (see [`CHANGELOG.md`](CHANGELOG.md) for the dated history of all three).

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

### Voice Note Feedback Workflow
**Automate transcription, verify changes, and clean up audio files.**
When the user points to an audio feedback file (e.g. `.m4a`, `.mp3`, `.wav`) under `Ongoing Work/` or mentions one:
1. **Transcribe**: Set up and execute a local Python script using `openai-whisper` and `imageio-ffmpeg` (with `ssl._create_default_https_context = ssl._create_unverified_context` to bypass macOS certificate checks).
2. **Operationalize**: Transcribe the file, review the transcript, create a concrete implementation plan, and obtain user sign-off.
3. **Clean Up**: Delete the audio feedback file immediately after the changes have been implemented and verified. Never leave audio files in the repository.

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
6. **Concept-before-definition & term styling:** Always explain a concept in plain English *before* introducing/naming the term. Wrap defined terms in `<strong class="term">` — this applies the dashed vermilion underline AND triggers a hover/tap tooltip from `glossary.js` when the text slug matches a `GC_GLOSSARY` key. Add `data-term="slug"` to override the auto-slug when the visible text doesn't normalize cleanly. When you introduce a new defined term in a lesson, add it to `assets/glossary.js` too. A mismatched slug (auto-generated or a stale `data-term` override) is a **silent no-op** — no error, just no tooltip — so after adding or editing a term, verify the slug actually resolves against `glossary.js` rather than assuming it does.
7. **No LaTeX formatting:** Never use LaTeX formatting syntax (like $H_2$, $O_2$, or $\Delta EN$) in HTML content. Instead, use HTML tags (e.g., `H<sub>2</sub>`, `O<sub>2</sub>`, `&Delta;EN`) to ensure proper, clean rendering in the browser without any math engines.
8. **Keep storylines/contexts light and tangential:** Focus heavily on the core chemistry, not the storylines. The storylines (e.g. roti prata, tawa) are tangential and can be referenced briefly, but always in a general way that works for any student, even if they are unfamiliar with the specific story context. Do not let contexts overwhelm chemical explanations.
9. **Follow the VOICE.md Prose Contract:** All student-facing text must follow the rules in `VOICE.md` (root directory): use second person ("you"), predict specific misconceptions by name, concrete before abstract, short declaratives, no throat-clearing, and describe consequences rather than just definitions. Widget feedback must explain the temptation of the incorrect choice, never just say "incorrect". Run the `VOICE.md` §6 QA pass (read aloud, check banned words, check misconceptions) before declaring any page done.
10. **Gated Interaction Contract (INTERACTION_SPEC.md):** Commit-before-reveal is mandatory on all widgets and predict prompts. Never let the student see the answer or proceed without committing an answer first. Parity for keyboard and touch, no persistence of state on reload. Green means correct/positive only; incorrect uses vermilion outline/text, never red fill. Follow the widget config patterns and motion controller specifications defined in `INTERACTION_SPEC.md` (root directory).
11. **QA Gates:** Every ⚑ chemistry item verified before build; no reveal reachable without a commit; a reduced-motion pass; a `VOICE.md` §6 pass; screenshots reviewed at both widths before a session closes. (Historical session-by-session sequencing lived in the now-retired `BUILD_PLAN.md` — see `CHANGELOG.md` — but the gates themselves are still binding on any new work.)
12. **Sequenced diagrams use the step motion primitive only.** Any "click through frames" diagram must use `data-motion="step"` (see `INTERACTION_SPEC.md`), which crossfades one frame in place inside a fixed-height stage. Never show every frame at once in a `flex-wrap` grid — that stacks/scatters frames instead of replacing them and was a repeated bug.
13. **Every diagram is lightboxable.** Wrap every static diagram (SVG or image) in `<div class="diagram">...<div class="diagram-cap">...</div></div>`. `core.js` binds a click-to-zoom lightbox to anything matching `.diagram svg, .diagram img` — a diagram outside that wrapper silently gets no lightbox.
14. **Free-text gates never show a character cap.** Commit-before-reveal free-response widgets (`mode: "free"`) enforce a minimum length before enabling the check button, but the UI must never display a number or a cap (no "12 / 30 characters"). Show a soft, non-numeric progress hint instead (see `core.js`'s `w-progress-hint`).
15. **Chemical formulas never break across a line.** Never place a `<sub>`-bearing formula as the sole content of a flex or grid item without wrapping it — flex/grid containers turn each inline run (including a bare `<sub>`) into its own item, tearing "CO<sub>2</sub>" onto multiple lines. Wrap inline formulas in a `<span>` (or `.formula` for pure nowrap) before they sit inside `.st-fields label` or similar flex containers.
16. **One figure primitive.** Every figure's width comes from `.figure` plus a named tier — `.figure--sm` (24rem), `.figure--md` (34rem), `.figure--full` (52rem, matches the prose column), or `.figure--wide` (68rem) — never a raw pixel value. Default every figure to `--full`. Drop to `sm`/`md` only when the figure genuinely reads better small (a lone atom, a single lever); go `--wide` only when it earns bleeding past the text column, and only outside (or bled out of) `.narrow`, whose 52rem cap otherwise silently overrides `--wide`.
17. **Unified Reference Center (References Drawer):** Any global study helper (like the Periodic Table, formulas/tables, calculator, or other quick converters) must be built inside the slide-out drawer layout (`#ptableDrawer` and `.ptable-panel` inside `assets/core.js` / `assets/components.css`) rather than creating standalone widgets or loading raw elements. Content added here must read strictly from the canonical lesson data or committed review sheets in `scaffold/References/`.

---

## 4. File / Project Structure

### Root Planning & Guidelines Directory
```
CLAUDE.md               Behavioral guidelines & design constraints
TODO.md                 ← START HERE each session: the unified single source of truth for outstanding work, design revisions, and feature backlog
CHANGELOG.md            Dated, one-line log of what shipped — add an entry every time you push to GitHub
README.md               Comprehensive project context, setup, and deployment notes
BUILDING.md             Step-by-step checklist for building a lesson
DIAGRAM_STANDARDIZATION.md  Diagram retrofit: SVG containment + shared --dia-* token layer + renderers (closed 2026-07-08)
VOICE.md                Pedagogical tone and feedback text style contract
INTERACTION_SPEC.md     Specifications for retrieval widgets and motion controllers
```
`Ongoing Work/` is the voice-note feedback staging folder (see the Voice Note Feedback Workflow above) — it should otherwise stay empty. A stale, out-of-sync duplicate of five of the docs above once lived there (leftover from an incomplete doc-consolidation merge) and has been removed; don't recreate it there. An orphaned `content_audit.md` content-gap snapshot has likewise been removed — re-run a fresh audit if one is needed rather than trusting an old one. `Diagram_Inventory_v2.md` and `Content_Expansion_v2.md` (the 1-2b seed docs) have been retired now that 1-2b is built — don't recreate them. `BUILD_PLAN.md`, `LESSON_1-2B_PLAN.md`, `REMEDIATION_PLAN.md`, `PDF_EXPORT_PLAN.md`, `REVISION_PLAN.md`, and `FEATURES.md` have likewise been retired now that their work is done and their durable facts migrated into this file, `TODO.md`, `INTERACTION_SPEC.md`, and `BUILDING.md` — see `CHANGELOG.md` for what each covered; don't recreate them.

**Update `CHANGELOG.md` every time you push to the GitHub repo** (every push to `main` triggers the live-site deploy — see `README.md` §Automated Publishing). Add one dated line summarizing what the push contains before or as part of that push. This is separate from `TODO.md` (current/outstanding work): the changelog is a append-only historical record, never edited after the fact.

### Scaffold Web App Directory (`scaffold/`)
```
scaffold/
  assets/
    tokens.css       design tokens: fonts, colors, base type, grid bg, dark mode
    components.css   shared component library (frame, widgets, diagram conventions)
    core.js          shared behaviors (theme, TOC, nav, reveal, retrieval widgets, glossary tooltips)
    glossary.js      window.GC_GLOSSARY — 80 term definitions (check count on edit — this drifts); drives hover tooltips on <strong class="term">
    elements.js      window.GC_ELEMENTS — canonical periodic data (Z=1..36); read from here, never retype
  lessons/
    <id>_<slug>.html one file per lesson; links ../assets/*, plus its own <id>.js
    <id>.js          lesson-specific interactives ONLY (Bohr builder, explorer…)
  References/        review sheets + convention posters (AUTHORITATIVE content/conventions)
  index.html         Home dashboard page and search portal
  lessons.json       Lessons database metadata (tracks progress and units)
  diagram-generator/ teacher-facing SVG diagram generator (Bohr/Lewis/models/reactions + PNG export); standalone assets, does NOT load tokens.css/components.css
```

Lesson HTML should be **mostly content**. Shared CSS/JS lives in `assets/`. If you find yourself copying a style or behavior between two lessons, lift it into `components.css` / `core.js` instead.

---

## 5. File Manifest (12 files; every PE within a 3-file cap)

Built from the review-sheet sub-targets, with shared chemistry deduplicated into canonical files.

**All 12 files below are built and exist in `scaffold/lessons/`** (confirmed 2026-07-05; see `CHANGELOG.md` for the build-order and bug-fix-pass history). This section is about scope/coverage, not QA state.

**Unit-1-specific**
- `1-1a` Atomic Structure & Electron Configuration — PS1-1.2, .3
- `1-1b` Periodic Trends & Reactivity — PS1-1.1, .4, .5   ← REFERENCE BUILD (match this one's discipline)
- `1-2a` Bonding & Electronegativity — PS1-2.1
- `1-2b` Molecular Polarity — PS1-2.1 (bond polarity + shape → molecular polarity → IMF; geometry shown as given fact, **no VSEPR**)
- `1-3a` Lewis Structures — PS1-3.4 (Lewis only; **no VSEPR headline**)
- `1-3b` IMFs & Properties — PS1-3.5 (+ HS-PS1-3 investigation coda)

**Unit-2-specific**
- `2-2a` Physical vs Chemical Change & Particle Diagrams — PS1-2.1, .4
- `2-7a` The Mole & Molar Mass — PS1-7.1, .5
- `2-7b` Mole Conversions — PS1-7.2 (empirical formula NOT included — absent from sheet)
- `2-7c` Stoichiometry — molar ratios, BCA, limiting/excess — PS1-7.3, .4

**Shared canonical (serve both units)**
- `C-RXN` Reaction Types & Balancing — PS1-2.2, .3 (replaces a per-unit copy in each)
- `C-SPA` Structure → Property → Argument — PS2-6 (all sub-targets). Owns the fatty-acid shape → packing → LDF → property → argument reasoning and the GHS/food-texture applications; do not split into two files.

Decisions that are easy to re-make wrong, so they're fixed:
- **VSEPR**: not an assessed sub-target. At most a connective sentence inside `1-2b` or `C-SPA`. Never a headline section.
- **Empirical formula**: absent from the Unit-2 review sheet. Omit.
- **Bond polarity + shape → molecular polarity → IMF** lives in `1-2b` (general case: which IMF a molecule gets). `C-SPA` owns the fatty-acid-specific packing/argument application, not general molecular polarity. Neither lives in `1-3a`, which stays Lewis-structures-only.

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
