# DIAGRAM_STANDARDIZATION.md

> **Status: Phase 0–2 done, Phase 3–4 not started (Phase 0 run 2026-07-07).** This is a design-level retrofit of the static and interactive diagrams. It overlaps with, and goes deeper than, `REVISION_PLAN.md` Phase 1 (which disciplines figure *width* via the `.figure--*` tiers, done); this plan disciplines what lives *inside* the SVG. See `TODO.md` §1a for current status and `DIAGRAM_CONTRACT.md` for the live invariants/token values (filled from the Phase 0 harvest, superseding the placeholder token names below).

Standardization plan for the static and interactive diagrams in Chemistry Interactive Notes. Fixes within‑figure breakage first (B), then cross‑figure drift (A), as one continuous retrofit rather than two separate projects.

---

## The core idea (read this before anything else)

B and A are not two jobs. They share one artifact: **the self‑contained SVG with a locked viewBox.**

- **B (containment)** builds that container: every diagram becomes a single SVG that scales as one rigid unit, so nothing overlaps and nothing reflows independently at different screen sizes.
- **A (consistency)** disciplines what goes *inside* that container: one shared unit, one set of primitives, one token source, so an oxygen atom is the same size in every figure.

Because A lives inside the container B builds, none of B's work is thrown away when A happens. That is the whole reason to do them in this order. If you did A first — standardized colors and radii — you'd still have figures collapsing on a phone, because the container was never fixed.

The two failure mechanisms this plan targets:

- **B — within‑figure breakage.** Labels collide at some widths and not others; elements overlap on mobile. This almost always means a figure is *not* one SVG — it's an SVG with HTML labels absolutely positioned on top, or a flex/grid box whose children scale on different rules than the artwork. Change the viewport, art and labels drift into each other.
- **A — cross‑figure drift.** Each figure is internally fine but they don't agree. Atom sizes, bond weights, and label type vary figure to figure because geometry is hand‑authored per figure with no shared source.

---

## The one artifact that makes this Sonnet‑safe: `DIAGRAM_CONTRACT.md`

A vibecoding loop drifts because the model re‑invents each diagram every session. A long standards document does not survive that — the model skims it and improvises. What survives is a **short, checkable contract that every session loads and checks its output against.**

Produce `DIAGRAM_CONTRACT.md` as the first thing this plan does. Keep it under one screen. It holds only invariants and their mechanical checks — no rationale, no prose. Every session prompt below ends by pointing at it.

Contract contents (fill values from Phase 0's harvest, don't invent them):

- Every diagram is exactly one root `<svg viewBox="…">`. No HTML text or shapes layered over diagram artwork. Interactive *controls* (buttons, sliders) are HTML, but they sit outside the SVG frame and never overlap its internals.
- `preserveAspectRatio="xMidYMid meet"`. The SVG scales as one rigid unit. Width is CSS (`100%` up to a max‑width); height follows the viewBox.
- All diagram text is `<text>` inside the SVG. No absolutely‑positioned label divs.
- One coordinate unit: `--dia-unit`. One atom radius = 1 unit. All geometry expressed in these units. viewBox dimensioned in units.
- No raw hex or px inside diagram SVGs. Every color, stroke width, radius, and label size references a `--dia-*` token. If a needed value has no token, stop and ask — do not invent one.
- Bonds draw center‑to‑center, then clip to the atom edge. No stub poking through a circle, no gap.
- Labels sit outside the atom's bounding radius. Lone pairs sit on a free arc, away from bonds.
- Particle scenes conserve particles: the count of each type is equal across all panels of a framed sequence. The renderer asserts this.

---

## Phase 0 — Audit and harvest (one session, no changes)

This replaces guessing at the B‑vs‑A split. Have Sonnet inventory every diagram and report, per figure: is it (a) one self‑contained SVG, (b) SVG + HTML overlay labels, or (c) pure HTML/CSS. Does it have a viewBox. Where does text live. And harvest the actual values in use — every atom radius, bond stroke width, element fill hex, label font size — as a frequency table.

Two outputs:
1. A per‑figure table classifying each as clean‑SVG / overlay / html — this tells you what fraction of the pain is B (overlay + html rows) versus A (clean‑SVG rows that simply disagree with each other).
2. A values table. The most‑common existing value for each property becomes the token default. You standardize toward what's already most common, which minimizes visual churn.

Do not change anything this session. Audit only.

**Paste‑ready prompt:**

> Audit every diagram in the lessons. For each `<svg>` or diagram container, report in a markdown table: lesson file, section ID, whether it is (a) a single self‑contained SVG, (b) an SVG with HTML labels/shapes positioned over it, or (c) pure HTML/CSS with no SVG; whether a viewBox is present; and where its text lives (inside `<text>` vs HTML). Then produce a second table harvesting every distinct value in use across all diagrams for: atom/particle circle radius, bond/line stroke width, element fill color, and label font size — with a count of how many figures use each value. Change no files. Output both tables only.

---

## Phase 1 (B) — Containment pass

Convert every overlay and html‑CSS diagram into a single self‑contained SVG that scales rigidly. This is mechanical and per‑figure, which is exactly the kind of work Sonnet does well *if bounded*. Cap each session at a named handful of files.

Rules for the pass (these become the first half of the contract):
- One root `<svg viewBox>`. All artwork and all labels inside it as SVG elements.
- Kill every `position: absolute` label div inside a diagram; reflow it into `<text>`.
- `preserveAspectRatio="xMidYMid meet"`, width `100%` to a max, height from viewBox.
- For the interactive labs: only the *artwork* must be a contained SVG. The controls stay HTML, moved outside the SVG's frame so they can't overlay it.

Acceptance gate — a screenshot, not a claim. Playwright‑screenshot each touched figure at three widths: 1280, 768, 375. Pass = at every width the figure scales as one unit, no element overlaps another, all text legible. The model does not get to declare done; the three screenshots do.

Mechanical gate: after the pass, `grep` the diagram containers for `position:\s*absolute` — must return nothing.

**Paste‑ready prompt:**

> Following `DIAGRAM_CONTRACT.md`, convert these figures to self‑contained SVGs: [LIST 4–6 FILES/SECTIONS]. Each becomes one root `<svg viewBox>` with `preserveAspectRatio="xMidYMid meet"`, width 100% to its max, all text as `<text>` inside. Remove any absolutely‑positioned HTML labels layered over artwork. For interactive labs, contain only the artwork SVG; leave controls as HTML outside its frame. Do not restyle, recolor, or resize anything yet — this pass is containment only. After each file, Playwright‑screenshot every touched figure at 1280, 768, and 375 px and show me the shots. Then run `grep -rn "position:\s*absolute"` over the diagram containers and confirm it's empty.

---

## Phase 2 (A) — Diagram token layer

Now the containers exist. Define the shared vocabulary they'll fill. Add a diagram token block (in `tokens.css` or a `dia-tokens.css` it imports). Values come from Phase 0's harvest — pick the most‑common existing value as each default.

Minimum token set:
- `--dia-unit` — the atom‑radius base unit, in viewBox coordinate units.
- Per‑element fills: `--dia-el-h`, `--dia-el-o`, `--dia-el-c`, `--dia-el-n`, `--dia-el-na`, `--dia-el-cl`, … one per element you actually draw.
- `--dia-bond-w` (in units), `--dia-bond-len` (default single‑bond length in units).
- `--dia-label-size`, `--dia-legend-size`, `--dia-caption-size`.
- `--dia-frame-stroke`, `--dia-frame-dash` (your dashed framing box), `--dia-gap` (spacing unit).

No figure changes this session. This step only defines the words; Phase 3 makes figures speak them.

**Paste‑ready prompt:**

> Create the diagram token layer per `DIAGRAM_CONTRACT.md`. Add a `--dia-*` block covering: base unit, one fill per element we draw, bond stroke width and default length, label/legend/caption sizes, and frame stroke/dash/gap. Use the most‑common existing value from the Phase 0 harvest as each default so visual churn is minimal. Wire it into the token pipeline but change no diagram files yet. Show me the block.

---

## Phase 3 (A) — Coordinate‑scale retrofit

Walk every contained SVG and make it obey the shared unit. One atom = `--dia-unit`; viewBox dimensioned in units; bond lengths, stroke widths, and label sizes all referencing tokens; every hardcoded hex and px replaced by a `--dia-*` reference. This is where oxygen becomes the same size everywhere and figures start agreeing.

Per‑figure and rule‑driven, so bound it — a few files per session, same as Phase 1.

Acceptance: pull any two retrofitted figures side by side. Atoms match, bond weights match, labels match. Plus the mechanical gate: `grep` the diagram SVGs for raw hex (`#[0-9a-fA-F]`) and bare px on geometry — must come back empty.

**Paste‑ready prompt:**

> Following `DIAGRAM_CONTRACT.md`, retrofit these figures to the shared coordinate scale: [LIST 4–6 FILES/SECTIONS]. Express all geometry in `--dia-unit` (one atom = 1 unit), dimension each viewBox in units, and replace every hardcoded color, stroke width, radius, and label size with the matching `--dia-*` token. Preserve each figure's layout and meaning — only the units and sources change. After the batch, screenshot two of the figures side by side so I can confirm atoms, bonds, and labels agree, then `grep` the diagram SVGs for raw hex and bare‑px geometry and confirm both are empty.

---

## Phase 4 (A) — Renderers (the durable fix)

Everything above stabilizes the existing figures. This step stops future drift: diagrams become **data plus one renderer**, so consistency is structural, not a discipline you re‑enforce each session. This is the largest work and the most drift‑prone, so it gets the tightest contract and per‑item screenshot verification.

Three families, one shared base (the tokens from Phase 2):

**Molecule renderer** — atoms, bonds, lone pairs from data. Covers Lewis, structural, and the IMF molecule pairs, where the worst drift lives.

Data model:
```
{
  atoms: [
    { id: "O1", el: "O", x: 0,  y: 0 },
    { id: "H1", el: "H", x: -1, y: 0.6 },
    { id: "H2", el: "H", x: 1,  y: 0.6 }
  ],
  bonds: [ { a: "O1", b: "H1", order: 1 }, { a: "O1", b: "H2", order: 1 } ],
  lonePairs: [ { on: "O1", count: 2 } ]
}
```
Renderer contract: coordinates in atom‑radius units; element → radius/fill/label come from tokens, never from the data row; bonds draw center‑to‑center then clip to the atom edge; labels place outside the atom's bounding radius with a collision nudge; lone pairs sit on the free arc away from bonds. Adding a molecule (H₂O, CO₂, NH₃, CH₄, …) is adding a data row, not drawing a picture.

**Particle‑scene renderer** — particles, frame, legend, motion from data. Covers the Unit 1/2 particle diagrams and the phase/IMF scenes. Your `.d-*` classes already own appearance; this makes the renderer own *layout*, which the classes never did.

Data model:
```
{
  frame: { panels: 2, labels: ["before", "after"] },
  legend: [ { type: "H", label: "hydrogen" }, { type: "O", label: "oxygen" } ],
  particles: [
    { type: "H", panel: 0, x, y, motion: "vibrate", energy: 1 },
    { type: "O", panel: 1, x, y, motion: "translate", energy: 2 }
  ]
}
```
`motion` maps to your existing vocabulary — vibrate → symmetrical bumps, translate → tails, and energy count sets how many decorations. The renderer asserts conservation: each particle type's count is equal across panels, and it errors loudly if a scene violates it. That turns a pedagogical rule into a build‑time check.

**Schematics** (mole map, force arrows, energy bars) stay bespoke — they're simple and rarely break — but they consume the same `--dia-*` tokens so type and color still match the rest.

Convert family by family. Molecule family first (highest drift), then particle scenes, then leave schematics as token‑only. Each converted item gets a Playwright screenshot compared against its pre‑conversion shot; meaning must be preserved, only consistency improves.

**Paste‑ready prompt (per family):**

> Build the [molecule | particle‑scene] renderer per `DIAGRAM_CONTRACT.md`, using the data model in `DIAGRAM_STANDARDIZATION.md` §Phase 4. Element/particle appearance comes only from `--dia-*` tokens, never from the data. [For molecules: bonds clip to atom edges; labels and lone pairs avoid collisions.] [For particle scenes: assert equal particle counts across panels and error if violated.] Then convert these figures to data + renderer: [LIST 3–5]. Screenshot each converted figure against its previous version and show me both so I can confirm meaning is unchanged. Do not touch any other family this session.

---

## Standing rules — how to keep Sonnet on‑contract

These are the guardrails that make the plan survive a multi‑session vibecoding loop. Put them in `DIAGRAM_CONTRACT.md` too; every session obeys them.

1. **One concern per session.** Never containment *and* restyle in the same pass. Never two renderer families at once. Mixed sessions are where drift enters.
2. **Bounded scope, named files.** Each session names its 3–6 target files. The model finishes those and stops — no wandering into figure 20 and half‑doing it.
3. **Extend, never invent.** Colors, sizes, radii come from tokens. A value with no token is a stop‑and‑ask, not an improvised hex. State this as a hard rule.
4. **Acceptance is a screenshot.** Every session ends with Playwright shots at 1280 / 768 / 375. "Done" is the image, not the model's word.
5. **Mechanical gates per phase.** After B: no `position: absolute` in diagram containers. After A‑scale: no raw hex, no bare‑px geometry in diagram SVGs. These are grep‑able pass/fail, no judgment needed.
6. **The contract is loaded every session.** Not summarized, not assumed — loaded. It's short enough to include verbatim in every prompt if needed.

---

## Open items for you

- **My architecture assumptions are unverified.** I've written this against a remembered stack (tokens.css, components.css, core.js, `.d-*` classes). Phase 0 exists to confirm it. If the audit finds the diagrams already route through a shared helper, Phase 4 shrinks to fixing that helper rather than building renderers.
- **Schematic boundary.** I've drawn the line at mole map / force arrows / energy bars staying bespoke. If those are *also* drifting, they fold into a third small renderer — but I'd bet they aren't, so don't pre‑build it.
- **Bohr diagrams.** Not assigned to a family above. They're either their own tiny renderer (nucleus + shells + electrons) or a "shell mode" on the molecule renderer. Decide after Phase 0 shows how many you actually have.
- **Lewis‑via‑library.** Considered and rejected earlier (loses your house style and deliberate simplifications). Flagging it here only so the decision is on the record and doesn't get relitigated mid‑build.

---

## Relationship to `REVISION_PLAN.md` (sequencing note — added on ingest 2026-07-06)

This plan and `REVISION_PLAN.md` Phase 1 both touch the figure system but at different layers:

- **`REVISION_PLAN.md` Phase 1** governs figure **width** — the outer `.figure` / `.figure--sm|md|full|wide` wrapper tiers and the migration off the six bespoke pixel-ceiling wrappers.
- **This plan** governs figure **internals** — viewBox containment (B), then the `--dia-*` token layer and coordinate scale (A), then data-driven renderers.

They are complementary, not competing: the width wrapper sits outside the contained SVG this plan produces. **Resolved 2026-07-07: option (a).** `REVISION_PLAN.md` Phase 1 ran first (width tiers), then this plan's Phase 0 audit ran, confirming no rewrite conflict — Phase 1's wrapper migration and this plan's containment fixes touched disjoint concerns (outer wrapper class vs. inner `viewBox`) with zero overlap in the two files Phase 1(B) actually touched.
