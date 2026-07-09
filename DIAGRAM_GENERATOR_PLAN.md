# DIAGRAM_GENERATOR_PLAN.md — Diagram Generator Remediation & Enhancement Plan

> **Status: ACTIVE** (opened 2026-07-09, from a code review + live-browser QA pass of the tool as of commit `28b63ff`).
> **Executor:** any capable coding agent (Sonnet-class or better). Read `CLAUDE.md` first and follow its behavioral guidelines — surgical changes, verify chemistry, render before declaring done.
> **Retirement:** per project convention, delete this file once all phases are done and verified, migrate any durable invariants into `CLAUDE.md`/`TODO.md`, and log the retirement in `CHANGELOG.md` §Retired planning docs.

---

## 0. Context & How to Verify

**What this is:** `scaffold/diagram-generator/` is a teacher-facing SVG diagram generator (Bohr models, Lewis structures, ball-and-stick / space-filling models, reaction equation graphics, before/after particle chambers) with PNG export. Files:

```
scaffold/diagram-generator/
  index.html     UI + all event bindings + title/legend injection + export bindings
  app.js         window.ChemApp — all SVG renderers, formula/reaction parsers, PNG exporter
  app.css        standalone styles INCLUDING its own copy of the --dia-* tokens and .atom-* / .d-* diagram classes
  elements.js    identical copy of scaffold/assets/elements.js (window.GC_ELEMENTS, Z=1..36)
```

**Critical architectural fact:** the generator does **not** load `scaffold/assets/tokens.css` or `components.css`. It has its own `app.css` with duplicated tokens and diagram classes. Any fix that landed in `components.css` (like the invisible-circle fix, commit `0b98f03`) does NOT apply here unless replicated in `app.css`.

**Verification harness (use after every phase):**

1. `cd scaffold && python3 -m http.server 8901`, open `http://localhost:8901/diagram-generator/index.html`.
2. Check the browser console — the acceptance bar for Phase 0 is **zero** `<circle> attribute r: Expected length` errors in the generator.
3. Exercise all three tabs (Bohr / Molecules / Reactions) in **both light and dark mode** (theme toggle, top right).
4. A headless check is fine for dot-visibility assertions (Playwright: `circle.getBBox().width > 0` for every circle in `#graphicFrame svg`), but the final QA gate (§6) needs actual screenshots reviewed.

**Ordering:** phases are ordered by severity. Phase 0 ships first and alone if needed; later phases are independent of each other unless noted. Commit per phase (or per task within a phase), update `CHANGELOG.md` with each push per project policy.

---

## 1. Phase 0 — Critical rendering bugs (do first)

### P0-1 · Invisible electron dots everywhere ⚠ SHIP-BLOCKER

**Problem:** every circle created with a token radius attribute — `r="var(--dia-r-atom-sm)"` (Bohr electrons, `app.js` `drawBohrModel`) and `r="var(--dia-r-particle)"` (Lewis atom dots in `drawLewisAtom`, lone-pair dots in `drawLewisMolecule`) — fails SVG attribute parsing and collapses to r=0. **Verified live:** the Bohr tab renders shells + nucleus but zero electrons; every Lewis structure renders zero lone-pair/valence dots (H₂O shows a bare oxygen). This is the same bug fixed for lessons in `components.css` (commit `0b98f03`), which never reached the generator's standalone `app.css`.

**Fix:** add the same three rules to `app.css`, next to the existing `.atom-e` / diagram-class block (~line 606):

```css
/* SVG geometry attributes cannot take var() — a circle written as
   r="var(--dia-r-*)" fails attribute parsing and collapses to r=0.
   The CSS r property DOES accept var() and wins over the attribute.
   Tokens are unitless; in SVG, 1px = 1 user unit. (Same fix as
   components.css, commit 0b98f03 — this file doesn't load that.) */
circle[r="var(--dia-r-particle)"]{r:calc(var(--dia-r-particle) * 1px);}
circle[r="var(--dia-r-atom-sm)"]{r:calc(var(--dia-r-atom-sm) * 1px);}
circle[r="var(--dia-r-atom)"]{r:calc(var(--dia-r-atom) * 1px);}
```

Note: the PNG exporter (`exportSVGToPNG`) already resolves `var()` inside attributes itself, so exports were surviving; no exporter change needed. (The console will still log one parse warning per circle — that's the known cosmetic issue already tracked in `TODO.md` §4.)

**Verify:** Fluorine Bohr model shows 9 electron dots (2 inner, 7 vermilion valence); H₂O Lewis shows 4 lone-pair dots on O; single-atom Lewis (e.g. N) shows 5 dots. Headless assertion: no circle in `#graphicFrame svg` has `getBBox().width === 0`.

### P0-2 · Default element selections silently ignored

**Problem:** in `index.html`, both `<select>` populations set `opt.selected = true` (a DOM *property*) and then append `opt.cloneNode(true)` — properties don't survive cloning, so the Bohr tab opens on Hydrogen instead of the intended Fluorine, and the Molecules atom selector ignores its intended Chlorine default. **Verified live** (screenshot shows "Bohr Model: Hydrogen" on load).

**Fix:** append `opt` directly (the clone serves no purpose — each loop creates its own option), or simpler and more robust: drop the `opt.selected` lines and set `bohrSelect.value = "F";` / `molElementSelect.value = "Cl";` once after each population loop, before the initial `updateFilenameAndTitle()` / `triggerRender()` calls.

**Verify:** fresh load shows "Bohr Model: Fluorine" with 9 electrons; Molecules → Single Atom shows Cl selected.

---

## 2. Phase 1 — Layout bugs (Reactions tab)

### P1-1 · Combined reaction view overlaps itself

**Problem:** when both "Molecular Equation Graphic" and "Before/After Particle Chambers" are checked, `triggerRender()` (index.html) nests the two SVGs inside a compound `viewBox="0 0 520 320"` SVG, positioned with `x`/`y` only. An inner `<svg>` without explicit `width`/`height` fills 100% of the outer viewport, so both children render at full size on top of each other. **Verified live:** the equation row collides with the chamber frames, and the injected title text lands *inside* the left chamber.

**Fix:** give each nested SVG explicit dimensions matching its own viewBox:

- `eqSvg` (viewBox `0 0 520 120`): set `width="520" height="120" y="0"`.
- `chamSvg` (viewBox `0 0 340 185`): set `width="340" height="185" x="90" y="125"`.

(125 + 185 = 310 fits the 320-high outer box; keep the outer viewBox as-is.) The title/legend injection appends below `vh` of the *outer* SVG and will land correctly once the children stop overflowing.

**Verify:** with `2 H2 + O2 -> 2 H2O` and both boxes checked: equation graphic on top, two chambers below, no overlap, title below everything. Check both phases dropdowns still render tails/brackets/lumps.

### P1-2 · Equation graphic uses fixed positions that collide

**Problem:** `drawReactionMolecules` (app.js) hard-codes the arrow at x=245 and products starting at x=305, regardless of how wide the reactant side actually got; coefficient clusters (`dx = (c - (coeff-1)/2) * 28`, `dy = ±10`) can collide with the "+" and coefficient glyphs. **Verified live** with `CH4 + 2 O2 -> CO2 + 2 H2O`: the second O₂ overlaps the arrow region and the products crowd the "+".

**Fix (keep it simple):** make the layout flow: after laying out reactants, place the arrow at `currentX + 15`, start products at `arrowX + 45`, and when a species has coeff > 1, advance `currentX` by the actual cluster width (`(coeff - 1) * 28 + 30`) instead of `(coeff - 1) * 14 + 30`. After the loop, set the SVG's viewBox width to `currentX + 30` (height stays 120) so the drawing is neither clipped nor swimming in dead space. The compound view in P1-1 must then read the equation SVG's real viewBox width instead of assuming 520 (set the outer compound viewBox width to `max(eqWidth, 520)` and re-center the chambers).

**Verify:** `CH4 + 2 O2 -> CO2 + 2 H2O` and `2 H2 + O2 -> 2 H2O` both render with no overlaps; a 3-term side (`CH4 + 2 O2 + N2 -> ...`) stays readable.

---

## 3. Phase 2 — Chemistry honesty (Golden Rules 2 & 4)

### P2-1 · Ionic compounds drawn as covalent Lewis structures ⚑

**Problem:** NaCl renders as `Na—Cl` with a bond line, lone pairs, δ+/δ− partial charges, and a net dipole arrow — a covalent depiction of an ionic compound. The `NaCl` template also fails electron bookkeeping (1 bond + 4 lone pairs = 10 e⁻ drawn vs 8 valence e⁻ supplied). The class convention is an ion pair: `Na⁺` (no dots) next to `[Cl]⁻` in brackets with 8 dots.

**Fix:** in `drawLewisMolecule` (and the generic diatomic path of `parseFormulaToMolecule`), detect ionic bonds using the `kind` field from `GC_ELEMENTS`: a bond joining a `metal` to a `nonmetal` is ionic. (Metal–nonmetal is the class's framing — per `TODO.md` §3.2, H–F stays covalent despite ΔEN 1.78 *because both are nonmetals*, so keying off `kind` rather than ΔEN alone matches the curriculum.) When ionic:

- Render as two separated ions: cation symbol with superscript charge and **zero** dots; anion in square brackets with a full octet (8 dots) and superscript charge. Reuse the existing `.lewis-bracket` / `.lewis-bracket-charge` styling from `drawLewisAtom`'s ion mode.
- Suppress the bond line, bond-dipole arrows, partial charges, and net dipole for ionic species (full charges, not partials). If any polarity checkbox is on, say why in `#moleculesInfo` ("ionic — full charges shown, not δ+/δ−").
- Replace or delete the covalent `NaCl` entry in `MOLECULE_TEMPLATES` accordingly.

**⚑ Verify chemistry:** confirm the metal-vs-nonmetal ionic rule and the ion-pair drawing convention against the Unit 1 bonding review sheet in `scaffold/References/` before building. Also confirm the 0.4 ΔEN cutoff used for bond-dipole arrows (`renderDipoleAnnotations`, `dEN >= 0.4`) matches the review sheet's polar/nonpolar boundary; adjust if the sheet says otherwise.

**Verify:** `NaCl` renders as `Na⁺ [Cl]⁻` ion pair; `KF` (generic path, not a template) does too; `HF` still renders covalent with δ+/δ−.

### P2-2 · Electron-count self-check for generated structures

**Problem:** the generic formula parser fabricates structures that don't conserve electrons. Example: SO₃ (not a template) gets three single bonds + 1 lone pair on S + 2 lone pairs per O = 20 e⁻ drawn, but 6 + 3×6 = 24 valence e⁻ are available. Silent, plausible-looking, wrong — the worst kind per Golden Rule 4.

**Fix (do NOT build a full Lewis solver):** add a validation pass wherever molecule data is about to be rendered (one shared function): `drawn = 2 × Σ(bond orders) + 2 × Σ(lonePair counts)`; `expected = Σ valence(atom)` from `GC_ELEMENTS`. On mismatch, render anyway but show a prominent warning in `#molSearchStatus` / `#moleculesInfo`: *"⚠ Drawn structure shows N electrons but the atoms supply M valence electrons — this auto-generated structure is not chemically valid. Edit the JSON below to correct it."* Skip the check when any atom has `valence === null` (transition metals).

**Verify:** all templates pass clean (spot-check H₂O = 8/8, CO₂ = 16/16, CO = 10/10, N₂ = 10/10); `SO3` triggers the warning; `BF3` passes (24/24).

### P2-3 · Same-element triatomics fabricate wrong structures

**Problem:** `O3` falls through `parseFormulaToMolecule`'s triatomic path with central=outer=O and gets two double bonds (wrong — ozone is a resonance case, 18 e⁻, not 20).

**Fix:** in the triatomic/tetratomic/pentatomic paths, if all atoms are the same element (only one entry in `elementCounts`), return `null` so the UI shows the existing "unknown formula — edit JSON" fallback. Ozone isn't in the curriculum; refusing honestly beats fabricating.

**Verify:** `O3` shows the unknown-formula status, not a fake structure.

### P2-4 · Palette-rule exceptions — decide and document (author sign-off)

**Problem:** the tool breaks `CLAUDE.md` Golden Rule 5 in three places: CPK fill for Cl uses `--good` (green = correct-only), N uses `--cool`, and δ+ renders in `--cool` blue while δ− is vermilion (blue/red is reserved for sequential heat maps).

**Action:** this is a decision, not a fix — ask the author. Recommended default if unreachable: (a) keep CPK fills as a documented, deliberate exception (CPK is an external convention students will meet again; note the exception in this repo's docs when retiring this plan), but (b) render both δ+ and δ− in vermilion (sign already disambiguates them), removing the blue. Whatever is decided, record it in `TODO.md` §3 as a resolved decision.

---

## 4. Phase 3 — Export & reuse

### P3-1 · "Copy SVG" produces markup that only renders inside this app

**Problem:** the copy button serializes the live SVG, which is full of `var(--accent)`-style references and classes (`.atom-shell`, `.d-frame`) whose styles live in `app.css`. Pasted anywhere else (Slides, Docs, another site) it renders unstyled or invisible. The PNG exporter already solved this (var-resolution over attributes + embedded `<style>` block).

**Fix:** extract that logic from `exportSVGToPNG` into a shared `prepareStandaloneSVG(svgEl)` → returns a self-contained clone; use it in **both** the copy handler and the PNG path. Add a **"Download SVG"** button next to Export PNG (same standalone clone, `Blob` + object-URL download, filename from `filenameInput` + `.svg`) — vector output beats PNG for print. Replace the `alert()` on copy with an inline "Copied ✓" state on the button.

**Verify:** paste copied SVG into a bare `about:blank` document (or a scratch HTML file with no CSS) — it renders identically to the preview, dots included.

### P3-2 · PNG export silently fails at high resolution

**Problem:** `exportSVGToPNG` multiplies the user scale by `baseRes = 8`. At 4x that's 32× — the combined reaction view (520×320) becomes a ~16,640 × 10,240 canvas (~170 MP), past browser canvas limits, yielding a blank download with **no error**.

**Fix:** clamp the effective multiplier so the long edge stays ≤ 8192 px: `totalScale = Math.min(scale * 8, 8192 / Math.max(width, height))`. Also add an `img.onerror` handler that surfaces a visible failure message instead of doing nothing.

**Verify:** export the combined reaction view at 4x — file downloads and is non-blank; a Bohr model at 4x still comes out sharp (~10,880 px wide is over the cap, so expect the clamp to kick in — confirm output is still ≥ 8K on the long edge and crisp).

### P3-3 · Dark-mode exports bake a dark background into worksheets

**Problem:** the exporter reads computed CSS variables from the live document, so exporting while in dark mode produces dark-background PNGs — wrong for printed worksheets, easy to do by accident.

**Fix:** add an "Export with light theme" checkbox (default **on**) in the export bar. Implementation sketch: if dark mode is active and the option is checked, temporarily remove the `dark` class from `<html>`, snapshot `getComputedStyle`, restore the class — all synchronous, no visible flash (or read the vars from a hidden `:not(.dark)`-scoped probe element if flicker appears). Known accepted gap, note it in the UI title-attribute: webfonts can't load inside a blob-SVG image, so exported text uses system font fallbacks.

**Verify:** toggle dark mode, export — PNG has the light `--card` background; uncheck the option, export — dark background.

### P3-4 · "Copy lesson HTML" — feed the lessons directly

**Problem:** the tool's real job is producing diagrams for lesson pages, and Golden Rule 13 requires every static diagram be wrapped in `<div class="diagram">…<div class="diagram-cap">…</div></div>` to get the lightbox. Today that wrapping is manual.

**Fix:** add a "Copy lesson HTML" button that emits:

```html
<div class="diagram">
  {SVG}
  <div class="diagram-cap">{title input text}</div>
</div>
```

Crucially, this variant should **keep** the `var(--…)` references and classes (lessons load `tokens.css`/`components.css`, so tokens resolve and theme-adapt there — that's a feature), but it must emit token radii in the components.css-compatible attribute form so the lesson-side `circle[r="var(--dia-r-*)"]` rules apply. Add a note in the button's title-attribute that the author still chooses the `.figure` width tier per Golden Rule 16 when placing it.

**Verify:** paste the output into a scratch section of any lesson, serve, confirm it renders with dots, adapts to dark mode, and lightboxes on click.

---

## 5. Phase 4 — Housekeeping

### P4-1 · Reaction parser accepts garbage silently

**Problem:** `parseFormula` (app.js, reactions path) doesn't validate element symbols. `h2o -> h2o` parses as zero atoms per side and reports **"Equation is BALANCED! ⚑"** — a lowercase typo produces a confident wrong answer. (`parseFormulaToMolecule` already validates against `GC_ELEMENTS.bySym`; the reaction path doesn't.)

**Fix:** validate every parsed symbol against `GC_ELEMENTS.bySym`; also reject a formula whose regex matches consume less than the whole token (catches stray lowercase runs). On failure, show which token was bad in `#reactionStatus`. Add a static hint to the status/placeholder that parentheses (e.g. `Ca(OH)2`) are not supported.

**Verify:** `h2o -> h2o` and `CH4 + Xx -> CO2` both show a clear error naming the bad token; valid equations behave as before.

### P4-2 · Duplicated molecule name map

**Problem:** the common-name map exists twice — `parseFormulaToMolecule` in `app.js` (name → formula) and `updateFilenameAndTitle` in `index.html` (formula → display name). They will drift.

**Fix:** single source in `app.js`: one structure holding `{ formula, commonName, display }` per species, exposed as `window.ChemApp.COMMON_NAMES`; derive both lookups from it; delete the copy in `index.html`.

**Verify:** typing `ammonia` still loads NH₃ and the title still reads "Ammonia (NH₃) — Lewis Structure".

### P4-3 · Discoverability & docs

**Problem:** the generator isn't linked from the `scaffold/index.html` dashboard and isn't mentioned in `CLAUDE.md`'s file-structure section — a future session (human or AI) can easily not know it exists.

**Fix:** (a) add a small link/card on the index dashboard (header utility area, not a lesson card — this is a teacher tool, not student content); (b) add one line to `CLAUDE.md` §4's directory listing: `diagram-generator/  teacher-facing SVG diagram generator (Bohr/Lewis/models/reactions + PNG export); standalone assets, does NOT load tokens.css/components.css`. That last clause is the durable invariant that caused P0-1 — it must survive this plan's retirement.

---

## 6. Final QA Gate & Close-out

1. Full manual pass on all three tabs, light **and** dark mode, at desktop and a narrow (~900 px) width; screenshots reviewed (project QA gate).
2. Console shows zero *new* errors (the pre-existing cosmetic `var()` attribute warnings tracked in `TODO.md` §4 are acceptable — but Phase 0's CSS rules must make the generator's circles *render* regardless).
3. Export matrix: Copy SVG → bare document; Download SVG; PNG at 2x and 4x for the largest (combined reaction) view; lesson-HTML paste test.
4. Every ⚑ item in Phase 2 checked against `scaffold/References/` review sheets before its code shipped.
5. `CHANGELOG.md` updated with each push (project policy).
6. Retire this plan: migrate durable facts (P4-3's invariant; the P2-4 palette decision) into `CLAUDE.md`/`TODO.md`, delete this file, and add it to `CHANGELOG.md` §Retired planning docs.
