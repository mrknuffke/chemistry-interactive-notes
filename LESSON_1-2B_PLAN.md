# LESSON_1-2B_PLAN.md — Build Plan: Lesson 1-2b · Molecular Polarity

**Status:** approved for build (author decision, 2026-07-05). Not yet built.
**Executor:** written to be executed by a fresh session (Sonnet or otherwise) with no prior context. Read `CLAUDE.md`, `BUILDING.md`, `VOICE.md`, and `INTERACTION_SPEC.md` before writing any HTML. `lessons/1-1b_periodic-trends-reactivity.html` is the exemplar — when anything below is ambiguous, open it and match it.

---

## 1. Decision record & scope boundary (binding)

The author has resolved the scope conflict flagged in `TODO.md` §2: **1-2b exists as its own lesson**, the 12th file, alongside (not replacing) `C-SPA`. The division of labor that makes this non-duplicative:

| Lesson | Owns | 1-2b must NOT re-teach it |
|---|---|---|
| `1-2a` | ΔEN → bond classification (nonpolar/polar covalent, ionic) | Cite the cutoffs as known; one-sentence refresher max |
| **`1-2b` (new)** | **Bond polarity + given shape → cancel or reinforce → molecular polarity → which IMF type is available** | — |
| `1-3b` | IMF hierarchy in depth; IMF → boiling point / properties | Name the three IMF types as the payoff; don't re-derive them |
| `C-SPA` | Packing/LDF for fats; the 5-part written argument; GHS | No fats, no packing density, no GHS here |

1-2b is the missing link in the chain 1-2a → **1-2b** → 1-3b → C-SPA. Concretely: `1-3b` (line ~427) already asserts "carbon dioxide is a nonpolar molecule" without ever explaining *why* — 1-2b is the page that earns that sentence.

**Standing rule (from `Diagram_Inventory_v2.md` and `CLAUDE.md` §5): geometry is shown as given fact. VSEPR is never named, never derived, never a headline.** Say "water is bent — that's the shape it has," not why it's bent.

**Review-sheet basis (Unit 1 Review Sheet, `scaffold/References/`):** PS1-2.1 (ΔEN bond table — the prerequisite), the polarity↔IMF table (nonpolar molecule → LDF; polar molecule → dipole-dipole; H on N/O/F → H-bonding), and PS2-6.1's Layer 2 ("what molecular geometry and polarity result? What IMF type dominates?"). The sheet's own resource list includes CK-12 "Molecular Polarity," PhET "Molecule Polarity," and CC Chemistry #23 — this content is sheet-committed, not consensus-notes-only.

**Seed content:** the `LESSON 1-2b · Molecular Polarity` block in `Content_Expansion_v2.md` (~lines 166–210) — its prose and faded-example strings are pre-approved copy; use them near-verbatim (one chemistry fix, §6). Diagram specs: `Diagram_Inventory_v2.md` `V-12b-01` / `V-12b-02`.

---

## 2. Files

| File | Action |
|---|---|
| `scaffold/lessons/1-2b_molecular-polarity.html` | **Create.** Copy head/topbar/theme-toggle/TOC/footer scaffolding from `1-1b_periodic-trends-reactivity.html`. Script order: `../assets/core.js` → `../assets/glossary.js` → `../assets/elements.js` → `1-2b.js`. |
| `scaffold/lessons/1-2b.js` | **Create.** Signature interactive only (§5). Every hook guards `if (!el) return;`. |
| `scaffold/lessons.json` | **Edit.** Add lesson entry + glossary entries (§7, §8). |
| `scaffold/index.html` | **Edit.** Add lesson card + sync inline `MANIFEST_DATA` (§8). |
| `TODO.md`, `CLAUDE.md`, `BUILD_PLAN.md`, `PDF_EXPORT_PLAN.md` | **Edit after QA passes** (§9). |
| `Content_Expansion_v2.md`, `Diagram_Inventory_v2.md` | **Delete after QA passes** — sanctioned by `TODO.md` §2 ("kept solely because 1-2b is unbuilt"). |

No changes to `tokens.css`, `components.css`, `core.js`, `glossary.js` (§7), or `elements.js` are expected. If a style/behavior seems missing, check whether a shared class already covers it before adding anything.

---

## 3. Section architecture

Seven sections, numbered `01…07` via `.section-tag .num`, each with `data-toc` and a closing `data-next` button (last section ends like 1-1b's finale instead). Section ids and content:

### 01 · `s-hero` — data-toc="Opening"
Hook per the seed spec, verbatim: CO₂ has two polar bonds and is nonpolar; water has two polar bonds and is one of the most polar molecules there is — same ingredient, opposite result; the difference is shape. Diagram **V-12b-01** (§6). No storyline dependency — the phenomenon carries itself.

### 02 · `s-concept` — data-toc="Two Inputs"
Re-narration, using the seed prose block near-verbatim: the trap ("the bonds are polar, so the molecule is polar — sometimes"), CO₂ as the clean cancellation case, water as the refuses-to-line-up case, then the **"one idea to hold onto"** callout: molecular polarity takes two inputs — how polar the bonds are (ΔEN) and where they point (shape); you can't skip either. Wrap first substantive mentions: `<strong class="term">bond dipole</strong>`, `<strong class="term">molecular polarity</strong>`, `<strong class="term" data-term="partial-charge">partial charges</strong>`, `<strong class="term">net dipole</strong>`, `<strong class="term">dipole cancellation</strong>` — all five slugs already exist in `glossary.js` (§7). Concept before definition: describe the tug-of-war adding up before naming "molecular polarity."

### 03 · `s-faded` — data-toc="Worked & Your Turn"
`data-widget="faded-example"` with the exact model/yours steps from the seed spec (methane worked model, ammonia "yours" with choice blanks — all prompt/feedback strings are written there; transcribe them faithfully, converting formulas to `<sub>` HTML). JSON config pattern: copy the shape used in `1-1a_atomic-structure-electron-config.html` (~line 618, the calcium faded example) — `<script type="application/json" class="w-config">` inside the `data-widget` div. Diagram **V-12b-02** renders beside/above the widget.

### 04 · `s-explorer` — data-toc="Cancel or Reinforce?"
The signature interactive (§5). Give this section the alternate-background treatment C-SPA's explorer section uses (`background:var(--paper-2)` + hairline borders).

### 05 · `s-predict` — data-toc="Predict First"
Three gated predict items (`[data-predict]` with `.opt` buttons + `[data-reveal]`), commit-before-reveal, reveal text following the fixed trace skeleton from the seed: *"Bonds and ΔEN → shape → cancel or reinforce → molecular polarity → IMF type."*

- **P1 — Cl₂:** "Chlorine gas, Cl<sub>2</sub> — polar or nonpolar molecule, and what IMF does it get?" Correct: nonpolar, LDF only (ΔEN = 0.00 — identical atoms; there's no tug-of-war at all). Wrong-option feedback must name the temptation (e.g. "chlorine is very electronegative, so it feels polar — but polarity is a *difference*, and Cl vs. Cl is a tie").
- **P2 — CCl₄ (the discriminator):** four genuinely polar C–Cl bonds (ΔEN = 0.61), perfectly symmetric arrangement → everything cancels → nonpolar molecule, LDF only. The wrong option is the lesson's headline trap ("polar bonds, so polar molecule") — the feedback must say exactly why it tempts and where it breaks.
- **P3 — the H-bonding club:** "HCl has a strongly polar H–Cl bond. Does liquid HCl have hydrogen bonding?" Correct: no — dipole-dipole only; hydrogen bonding requires H bonded directly to N, O, or F, and chlorine isn't in the club. (This guards the most common IMF misidentification.)

### 06 · `s-recall` — data-toc="Recall"
One `.recall` block, ~5 blanks (`data-answer` with `|` alternates), covering: ΔEN judges **bonds**; shape decides whether bond dipoles **cancel**; symmetric arrangement of equal pulls → **nonpolar** molecule; polar molecules gain **dipole-dipole** attractions; H bonded directly to **N, O, or F** unlocks hydrogen bonding. Include check / reveal / reset buttons + feedback div per the shared contract.

### 07 · `s-selfx` + `s-exam` — data-toc="Self-Explain" / data-toc="Exam Practice"
Two sections (numbered 07 and 08 if you keep them separate — match 1-1b's pattern of separate sections; adjust `NN` accordingly).

- **Self-explain:** the seed's framing prose (trace shape → molecular polarity → IMF type → energy to separate → boiling point; the "water has O–H so it has hydrogen bonds" shortcut gets the right answer for the wrong reason) followed by a free-text commit gate (`mode: "free"`, minChars ≈ 60, **no visible character count — soft `w-progress-hint` only**) asking: why is water a liquid up to 100 °C while CO₂ is already a gas at −78 °C? Model answer revealed only after commit. **Chemistry fix — do not copy the seed's "CO₂ boils 78 degrees below freezing":** at normal pressure CO₂ *sublimes* (solid → gas at −78 °C); phrase it as "already a gas at −78 °C" / "leaves the solid state at −78 °C" and never say CO₂ "boils."
- **Exam practice:** `.exam-frame` constructed response + self-scorable mark scheme behind `[data-scheme]`. Prompt: *"Methane (CH<sub>4</sub>) boils at −162 °C. Ammonia (NH<sub>3</sub>) boils at −33 °C — about 130 degrees higher — even though the molecules have nearly the same mass (16.05 vs 17.04 g/mol). Construct the full argument for the difference: bonds → shape → molecular polarity → IMF → boiling point."* Mark scheme points: (1) C–H is essentially nonpolar (ΔEN 0.35) while N–H is polar (ΔEN 0.84); (2) ⚑ **CH₄'s symmetric shape cancels what little pull there is, while NH₃'s pyramid makes the three N–H pulls reinforce into a net dipole** — the ⚑ flags this as the move separating full from partial credit, because it's the shape step everyone skips; (3) CH₄ gets LDF only, NH₃ gets dipole-dipole *plus* hydrogen bonding (H directly on N); (4) stronger attractions need more thermal energy to break apart → much higher boiling point. Note: NH₃ deliberately reappears from the faded example — there the student classified it step-by-step; here they must produce the whole written chain unprompted. That's spaced re-use, not accidental duplication.

---

## 4. Voice & interaction rules that apply everywhere here

- `VOICE.md` prose contract: second person, short declaratives, misconceptions predicted *by name* ("here's the trap…"), concrete before abstract, no throat-clearing. Every wrong-answer feedback string explains the *temptation* of that choice — never bare "incorrect." Run the VOICE.md §6 QA pass before declaring done.
- `INTERACTION_SPEC.md`: commit-before-reveal on every widget and predict item; keyboard/touch parity; no widget state persists across reload; green = correct/positive only; wrong answers get vermilion outline/text, never red fill.
- No LaTeX anywhere: `H<sub>2</sub>O`, `&Delta;EN`, `&delta;+` / `&delta;&minus;`, `&ndash;` for bond dashes.
- Chemical formulas inside flex/grid containers get wrapped in `<span>`/`.formula` so `<sub>` runs can't be torn across lines.
- Spell out on first use: "electronegativity difference (ΔEN)", "London dispersion forces (LDF)", "intermolecular force (IMF)".

---

## 5. Signature interactive — "Cancel or Reinforce?" (`1-2b.js`)

A five-molecule classification machine: the student runs the two-input decision on each molecule, committing at every step before anything is revealed. Pattern the DOM/select/SVG approach on `1-2a.js` (the bond explorer) and the gating discipline on `INTERACTION_SPEC.md` §3.1.

**Molecules and verified verdicts** (EN values must be *read from `window.GC_ELEMENTS`* at runtime — `en` field, e.g. `GC_ELEMENTS.find(e => e.sym === 'O').en`; never retype them):

| Molecule | Bond ΔEN | Bond call | Shape (given as fact) | Cancel? | Verdict | IMF |
|---|---|---|---|---|---|---|
| O<sub>2</sub> | 0.00 | nonpolar | linear diatomic | (one bond, no dipole) | nonpolar | LDF only |
| HCl | 0.96 | polar | diatomic | nothing to cancel against | polar | dipole-dipole (NOT H-bonding — Cl isn't N/O/F) |
| CO<sub>2</sub> | 0.89 (C–O) | polar | linear, O on opposite ends | cancel | nonpolar | LDF only |
| H<sub>2</sub>O | 1.24 (O–H) | polar | bent (~104°, shown, never explained) | reinforce | polar | dipole-dipole + H-bonding |
| CH<sub>4</sub> | 0.35 (C–H) | essentially nonpolar | four H, symmetric | cancel (little to cancel) | nonpolar | LDF only |

**Flow per molecule** (student picks a molecule from a row of buttons; each molecule is independent):
1. **Judge the bonds.** The bond pair is shown *without* the ΔEN number. Student commits "polar" / "nonpolar." On commit: the readout computes and displays ΔEN from `GC_ELEMENTS`, states the call against the 0.5 / 1.7 cutoffs, and gives temptation-aware feedback on a miss.
2. **Judge the geometry.** The shape appears (structural SVG, as fact). For the two diatomics this step is a *given* card ("one bond — its dipole IS the molecule's dipole; nothing to cancel against"), no commit. For the three polyatomics the student commits "cancel" / "reinforce."
3. **Verdict reveal.** Only after both commits: the SVG gains its dipole arrows (per-bond arrows; either cancellation marks or a net-dipole arrow), the verdict line ("nonpolar molecule · LDF only" etc.), and one payoff sentence. Show no boiling points here (CCl₄-style size effects are out of scope; BPs live in the self-explain/exam items where they're controlled).

**Rules:** all controls are real `<button>`s (keyboard parity); state resets on reload; the verdict is unreachable without the commits (no CSS-only hiding of answers — gate in JS); SVG colors stay within ink + vermilion (net-dipole arrow = vermilion; per-bond arrows = ink; δ labels in IBM Plex Mono); the whole stage sits in a `.diagram`-wrapped block only if it's static — an interactive stage does NOT need the lightbox, so don't wrap the live SVG in `.diagram` (wrap only static diagrams, §6). Guard every entry point with `if (!el) return;`.

---

## 6. Static diagrams (both lightboxable)

Build exactly per `Diagram_Inventory_v2.md`; both are structural style (atom circles + bond lines), **not** `.d-*` particle conventions, so no particle legend is required — the caption carries the labeling.

- **V-12b-01 · `s-hero` · CO₂ vs H₂O dipoles.** Left: O=C=O linear, δ⁺ on C, δ⁻ on each O, two outward dipole arrows, "net dipole = 0." Right: H₂O bent (~104°, drawn schematically, angle never explained), arrows converging toward O, net arrow toward O. `max-width: 580px`. Caption: `same polar bonds · different geometry · different molecular polarity`.
- **V-12b-02 · `s-faded` · CH₄ vs NH₃.** Left: CH₄, four symmetric H, small outward bond arrows with cancellation marks, "nonpolar overall · LDF only." Right: NH₃ pyramidal, lone pair drawn above N, arrows toward N, net arrow, "polar overall · dipole-dipole + H-bonding." No angles labeled. `max-width: 560px`. Caption: `bond polarity + geometry = molecular polarity`.

Every static diagram sits in `<div class="diagram">…<div class="diagram-cap">…</div></div>` so `core.js` binds the lightbox. Verify each opens in the lightbox with its caption, in both themes. Use `var(--…)` tokens for all SVG fills/strokes so dark mode works.

**Verified chemistry for anything the page states** (cross-checked against `assets/elements.js` 2026-07-05 — recheck, don't trust this table blindly): Pauling EN H 2.20 · C 2.55 · N 3.04 · O 3.44 · S 2.58 · Cl 3.16. ΔEN: C–H 0.35 · N–H 0.84 · O–H 1.24 · C–O 0.89 · C–Cl 0.61 · H–Cl 0.96. Cutoffs (class convention, matches review sheet + glossary): < 0.5 nonpolar covalent · 0.5–1.7 polar covalent · > 1.7 ionic. Boiling points: CH₄ −162 °C · NH₃ −33 °C · H₂O 100 °C; CO₂ **sublimes** at −78 °C (never "boils"). Molar masses: CH₄ 16.05 g/mol · NH₃ 17.04 g/mol. Water's angle ≈ 104° — show, never explain.

---

## 7. Glossary

All terms this lesson needs **already exist** in `assets/glossary.js`: `molecular-polarity`, `bond-dipole`, `net-dipole`, `dipole-cancellation`, `partial-charge`, `electronegativity-difference`, `polar-covalent-bond`, `nonpolar-covalent-bond`, `london-dispersion-force`, `dipole-dipole-force`, `hydrogen-bond`. Expected new entries: **zero** — so the "80 entries" count in `CLAUDE.md` §4 should still hold; verify the count anyway and fix the comment if it drifted. For every `<strong class="term">` you write, confirm the auto-slug (lowercase, spaces→hyphens, punctuation stripped) hits one of these keys, or add `data-term="…"`. If visible text is plural/inflected (e.g. "bond dipoles"), use `data-term="bond-dipole"`.

---

## 8. Site integration (do all of these — the dashboard has TWO copies of the manifest)

1. **`scaffold/lessons.json`** — insert after the `1-2a` entry:
   ```json
   {
     "id": "1-2b",
     "slug": "1-2b_molecular-polarity",
     "title": "Molecular Polarity",
     "unit": "1",
     "pes": ["HS-PS1-2"],
     "description": "Combine bond polarity (ΔEN) with molecular shape to decide whether bond dipoles cancel or reinforce — and which IMF that unlocks."
   }
   ```
   Also add glossary rows (same array, keep house format) for the terms this lesson *owns*: `molecular polarity`, `bond dipole`, `net dipole`, `dipole cancellation` — `lessonId: "1-2b"`, `sectionId: "s-concept"`, definitions copied from `glossary.js` so the two stores agree.
2. **`scaffold/index.html` inline `MANIFEST_DATA`** (~line 393) — this is a duplicate of `lessons.json` consumed by the dashboard's progress renderer, search, and glossary tab. Apply the *same* lesson entry and glossary rows there. If the two stores drift, the dashboard silently misses the lesson.
3. **`scaffold/index.html` lesson card** — the Unit 1 card list is hardcoded HTML. Insert a card between the `1-2a` card (~line 124) and the `1-3a` card (~line 148), cloning the exact card structure: link to `lessons/1-2b_molecular-polarity.html`, badge `1-2b`, status span `id="status-1-2b"`, checkpoint text `id="text-1-2b"` ("0/4 checkpoints"), progress bar `id="bar-1-2b"`, and a `data-search` string covering: `molecular polarity bond dipole net dipole cancel reinforce shape geometry polar nonpolar molecule ΔEN IMF LDF dipole-dipole hydrogen bonding CO2 H2O CH4 NH3`.
4. **Progress/checkpoints** — the shared widgets (`data-predict`, `.recall`, `data-peek`, `data-scheme`, `data-widget`) self-register with `core.js`'s checkpoint system; the custom explorer does not need to (matches other lessons). After building, open the dashboard, complete a widget in 1-2b, and confirm the card's status/progress bar updates from localStorage (`gc-textbook-progress`).
5. **Cross-references in prose** — refer back to 1-2a's ΔEN cutoffs and forward to 1-3b's IMF→property story in prose the way existing lessons do (plain sentences, no nav elements). Do not add new navigation UI.

---

## 9. Doc updates after QA passes (not before)

- **`TODO.md`** — remove/strike §2 (resolved: built), note the resolution and that the two seed docs were retired. Point to this plan for the record.
- **`CLAUDE.md`** — §5: 1-2b is no longer "does not exist"; record it as the 12th file (`1-2b` Molecular Polarity — PS1-2.1 bridge, geometry-as-fact, no VSEPR) and reconcile the "11 files" phrasing. Top banner: drop "the unresolved 1-2b lesson." §4: remove the `Content_Expansion_v2.md` / `Diagram_Inventory_v2.md` lines (files deleted) and update the `Ongoing Work` note only if touched. Keep edits surgical.
- **`BUILD_PLAN.md`** — session 14 row + open question 1: mark resolved/built with date.
- **`PDF_EXPORT_PLAN.md`** — "all 11 lessons" → 12 (one spot, ~line 115).
- **Repo-wide check** — `grep -rn "11 lessons\|11 manifest\|all 11"` across root `*.md` and `scaffold/` and reconcile hits.
- **Delete** `Content_Expansion_v2.md` and `Diagram_Inventory_v2.md` (sanctioned by `TODO.md` §2). Everything 1-2b needed from them is captured here or in the built lesson.

---

## 10. Build order

1. Read `CLAUDE.md`, `BUILDING.md`, `VOICE.md`, `INTERACTION_SPEC.md`; open `1-1b_*.html` and `1-1a_*.html` (faded-example config), plus `1-2a.js` (explorer pattern).
2. Build the HTML skeleton (head/topbar/TOC/footer from 1-1b) with all sections stubbed → verify: page loads from a local server, TOC populates, theme toggle works.
3. Write sections 01–02 prose + V-12b-01 → verify: lightbox, both themes, terms tooltip on hover.
4. Build the faded example (03) + V-12b-02 → verify: gates hold (no reveal before commit), keyboard works, wrong-answer feedback strings render.
5. Build the explorer (04, `1-2b.js`) → verify: ΔEN readouts match hand-computed values from §6, verdicts gated behind both commits, reload wipes state, no console errors.
6. Build predict/recall/self-explain/exam (05–07) → verify: every gate commits-before-reveals; free-text gate shows no character numbers; mark scheme ⚑ present.
7. Site integration (§8) → verify: dashboard card appears between 1-2a and 1-3a, search finds it, glossary tab shows the new rows, progress bar moves after completing a checkpoint.
8. Full QA (§11), then doc updates + deletions (§9).

---

## 11. Verification checklist (before declaring done)

- [ ] Every number on the page re-verified against `GC_ELEMENTS` / §6 (ΔENs, cutoffs, boiling points, molar masses).
- [ ] CO₂ is never said to "boil"; sublimation phrasing used.
- [ ] VSEPR never named; no geometry explanation anywhere; no bond angles explained (104° may be *shown* unexplained).
- [ ] Both static diagrams open in the lightbox with captions; light **and** dark mode checked page-wide (SVGs use tokens).
- [ ] All commit gates hold: predict, faded blanks, explorer, free-text, mark scheme. Nothing reachable answer-first.
- [ ] Free-text gate shows a soft progress hint, no numbers.
- [ ] Green appears only on correct/positive; wrong = vermilion outline/text; net-dipole arrows vermilion, bond arrows ink; no new hues.
- [ ] Every `<strong class="term">` resolves to a `glossary.js` key (hover a sample of each); glossary count comment in `CLAUDE.md` §4 verified.
- [ ] No formula torn across lines inside any flex/grid container.
- [ ] No sequential-frames grid anywhere (any click-through uses `data-motion="step"` — this lesson shouldn't need one).
- [ ] Zero console errors/warnings in both themes.
- [ ] VOICE.md §6 QA pass done (read aloud, banned words, misconceptions named).
- [ ] `lessons.json` ↔ `MANIFEST_DATA` byte-equivalent for the 1-2b entries; dashboard card, search, glossary tab, and progress all confirmed live.

---

## 12. Defaults already chosen (flag in your summary; don't block on them)

These were judgment calls made in this plan; surface them to the author in the final report rather than asking up front:

1. **Slug/title:** `1-2b_molecular-polarity` / "Molecular Polarity."
2. **NH₃ reappears in the exam** after starring in the faded example (deliberate spaced re-use at a higher-production skill level). If the author prefers a fresh molecule, the safe swap is H₂S-free — do NOT use HF (ΔEN 1.78 crosses the class's 1.7 ionic line) or HCl-vs-Cl₂ boiling points (Cl₂ actually boils *higher*; size effects would undermine the page's claim).
3. **Explorer shows no boiling points** (avoids CCl₄-style size confounds); BPs appear only in the controlled self-explain/exam comparisons.
4. **Seed docs deleted** after QA per `TODO.md` §2's standing note.
