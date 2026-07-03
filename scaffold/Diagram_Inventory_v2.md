# Diagram Inventory v2 — Implementation Spec
## Chemistry Interactive Notes · Supersedes Diagram Inventory v1 in full

**Scope:** single source of truth for every visual — appearance, tier, sizing, legends, captions, chemistry checks. Behavior contracts live in INTERACTION_SPEC.md; student-facing strings live in Content_Expansion_v2.md. Particle conventions (`.d-particle`, `.d-metal`, `.d-frame`, `.d-wall`, `.d-water`, phase markers, legend requirement, conservation) remain defined in CLAUDE.md and the References/ posters — Claude Code reads CLAUDE.md before touching any diagram.

**Tier system (from INTERACTION_SPEC §1):** T0 static · T1 steppable · T2 scrubbable · T3 zoom · W widget-embedded. Every T1–T3 visual must satisfy: no autoplay, reduced-motion state-swap fallback, keyboard operability, and a per-state `aria-label` (author them at build time from each state description below).

**Status tags:** `IMPLEMENTED` (do not modify unless instructed) · `NEW` · `⚑` (needs sign-off or verification before build).

**Standing decisions resolved from v1:** the three ⚑ DECISION items (C-RXN types card, C-RXN balancing, 1-3a Lewis walkthrough) are settled — types card is **tabbed**, both walkthroughs are **step-through builders** with decision gates (not passive step-throughs). The C-SPA exam scaffold is now **fillable** (scaffold widget), reversing v1.

---

## 1-1a · Atomic Structure & Electron Configuration

**IMPLEMENTED:** `s-parts` fluorine Bohr (2, 7) · `s-valence` electron-gain diagram · `s-builder` interactive Bohr builder Z = 1–36.

### V-11a-01 · s-hero · Fluorine vs. neon — NEW · T0
Two Bohr models side by side, vertical rule between. Left: F (2, 7), seven filled outer positions, one visible gap. Right: Ne (2, 8), complete. Valence electrons in vermilion per `s-parts` convention. Static — not the builder.
**Size:** `max-width: 580px` · **Legend:** `● core electrons · ● valence electrons` · **Caption:** `one electron separates reactive from inert`

### V-11a-02 · s-wrinkle · Energy-crossover filling — NEW · T1
Steppable, four states, one per element Z = 18 → 21 (Ar, K, Ca, Sc). Persistent backdrop: a vertical energy ladder with rungs 1s, 2s, 2p, 3s, 3p, **4s**, **3d**, 4p — 4s drawn *below* 3d, the crossover pair bracketed in vermilion. Each step highlights the vacancy that fills for that element and updates a running shell-configuration readout (2,8,8 → 2,8,8,1 → 2,8,8,2 → 2,8,9,2). Step labels: "argon: shell 3 pauses at 8" / "potassium: electron 19 takes 4s" / "calcium: 4s fills" / "scandium: 3d finally opens — the transition metals begin."
**Size:** `max-width: 520px` · **Caption:** `after 3p fills, 4s sits below 3d — the transition metals fill the gap`
**⚑ Chemistry check (carried from v1, still open):** the 4s/3d energy ordering shown is the standard pedagogical simplification for filling order through Z = 36. Honest > pretty: if David judges the simplification misleading at this level, fall back to K→Ca only (two states) with a text note. Note Sc's readout (2, 8, 9, 2) is correct shell notation for Sc.

### V-11a-03 · s-predict-val · Sulfur ionization — NEW · T1 (inside the reveal)
Three states: (1) neutral S atom, three shells, outer shows 6 filled + 2 gap positions; (2) two incoming electrons in transit, dashed markers, `○` gained-electron convention; (3) S²⁻, outer shell 8, charge label "2−." Same nucleus throughout — single-atom ionization, not a reaction; no `.d-frame` before/after box, single snapshot per state with state labels.
**Size:** `max-width: 580px` · **Legend:** `● core electrons · ● valence electrons · ○ electrons gained` · **Caption:** `the short path is gain 2, not lose 6`

### V-11a-04 · s-selfx · Li / Na / K row — NEW · T0
Three small Bohr models: Li (2, 1), Na (2, 8, 1), K (2, 8, 8, 1). Outer electron highlighted in each; horizontal bracket spanning all three labeled "1 valence electron each"; symbol + configuration beneath each.
**Size:** `max-width: 480px` · **Legend:** `● core electrons · ● valence electron` · **Caption:** `same outer count → same chemistry · the inner shells change, the pattern doesn't`

### V-11a-05 · s-exam · Element X (2, 8, 7) — NEW · T0
Single unlabeled Bohr model, 2, 8, 7; outer gap visually prominent (unfilled outline circle). No symbol, no Z.
**Size:** `max-width: 360px` · **Caption:** `7 valence electrons — one short of a full shell of 8`

---

## 1-1b · Periodic Trends & Reactivity

**IMPLEMENTED:** `s-position` shrink/grow pair · `s-reactivity` split diagram · `s-hazard` single-atom Na ionization (becomes the particulate layer of V-11b-04) · `s-explorer` trend explorer.

### V-11b-01 · s-hero · Na vs. Cu — NEW · T0
Left: Na full Bohr (2, 8, 1), outer electron highlighted. Right: Cu drawn schematically — labeled "transition metal," schematic outer shell only. Dashed arrow between, label "same table."
**⚑ Chemistry check (carried):** Cu is 2, 8, 18, 1 (the Cu exception). Do not attempt a precise Cu Bohr; the schematic label is the honest choice.
**Size:** `max-width: 580px` · **Legend:** `● core electrons · ● valence electron` · **Caption:** `position determines grip`

### V-11b-02 · s-predict-size · Na vs. Cl to scale — NEW · T0 (renders inside the reveal)
Bohr models to honest relative scale (Na ≈ 186 pm, Cl ≈ 99 pm — verify against a standard covalent/metallic radius table; scale meaningfully, not theatrically). Proton counts at each nucleus: 11p, 17p. Label above both: "same period (Period 3)."
**Size:** `max-width: 560px` · **Legend:** `● core electrons · ● valence electrons` · **Caption:** `more protons pulling the same shell inward → smaller atom`

### V-11b-03 · s-predict-react · Li vs. K ionization energy — NEW · T0 (inside the reveal)
Two vertical bars, same ink color (categorical pair, not a heat map): Li 520 kJ/mol (tall), K 419 kJ/mol. Dashed reference line at K's height; y-axis "ionization energy (kJ/mol)"; bracket per bar: "energy to remove 1 outer electron."
**⚑ Verify:** Li 520, K 419 kJ/mol (first IE).
**Size:** `max-width: 400px` · **Caption:** `lower in the group → farther, more shielded → cheaper electron → faster reaction`

### V-11b-04 · s-hazard · GHS bottle → Na atom — NEW · T3 zoom
Three levels. **Macro:** reagent bottle with GHS pictogram(s) per the Unit 1 phenomenon (verify which pictograms the PLC materials use for sodium — flame / corrosion). **Meso:** sodium metal surface, `.d-metal` squares in brackets (solid). **Particulate:** the existing implemented single-atom ionization diagram, reused as this layer. Zoom anchor: the pictogram on the label ring-highlighted during transit. Level labels: "the label on the bottle" / "the metal in the bottle" / "why the label is there."
**Size:** stage `max-width: 600px` · **Legend (particulate layer):** existing `● electron · ● valence electron (leaving)` · **Caption:** `the hazard diamond is a claim about one electron`

### V-11b-05 · s-selfx · IE trend grid — NEW · T0
Periodic table outline, no element detail; arrow right "IE increases →", arrow down "IE decreases ↓".
**Size:** `max-width: 360px` · **Caption:** `the same tug-of-war, two different knobs`

### V-11b-06 · s-exam · Rb / K position — NEW · T0
Thumbnail table, Groups 1–2 and 17–18 visible, rest grayed. K (Period 4) and Rb (Period 5) marked, vertical connector labeled "same group." Z values beside marks. Ink + vermilion only.
**Size:** `max-width: 360px` · **Caption:** `same group, K above Rb · lower = looser grip`

---

## 1-2a · Bonding & Electronegativity

**IMPLEMENTED:** `s-forces` attraction/repulsion balance · `s-interactive` bond explorer.

### V-12a-01 · s-hero · ΔEN scrub — NEW · T2 ★ signature
Replaces v1's static spectrum bar and four-panel bond-type card. A scrub slider (ΔEN 0 → 3.5) drives a two-atom drawing: at 0 the shared electron cloud sits centered; approaching 0.5 it shifts and δ⁺/δ⁻ labels fade in; past 1.7 the cloud snaps fully to the winning atom, +/− ion labels replace the δ pair, and a dashed electrostatic attraction line appears. Region band under the slider: nonpolar covalent / polar covalent / ionic, thresholds ticked in vermilion at 0.5 and 1.7. Live readout shows a real bond example nearest the current ΔEN (0 → Cl–Cl · 0.35 → C–H · 0.96 → H–Cl · 1.24 → O–H · 2.23 → Na–Cl). Scrub targets per INTERACTION_SPEC §2.2: 0.5 ± 0.1 ("where partial charges first appear") and 1.7 ± 0.1 ("where sharing becomes taking"). Static side panel: metallic bonding — `+` cores in a loose grid, free electron dots — labeled "metal + metal — nobody grips; the electrons pool" (metallic has no ΔEN address; keep it visually adjacent, not on the axis).
**⚑ Verify all EN/ΔEN values** against Pauling values (`window.GC_ELEMENTS` if present).
**Size:** full section width · **Caption:** `electrons don't vanish — they shift · ΔEN tells you how far`

### V-12a-02 · s-selfx · Ionic lattice vs. metallic sea — NEW · T0
Left: alternating Na⁺/Cl⁻ grid, electrons localized on Cl⁻; label "ionic — electrons transferred and fixed." Right: Al³⁺ cores (`.d-metal` squares) with free electron dots between; label "metallic — electrons delocalized and mobile."
**Size:** `max-width: 600px` · **Legend:** `● Na⁺ · ● Cl⁻ (localized electrons) · ■ Al³⁺ core · · free valence electrons` · **Caption:** `the sea flows; the lattice doesn't`

---

## 1-2b · Molecular Polarity — ⚑ LESSON EXISTENCE UNVERIFIED

**⚑ This lesson is absent from the content audit (not truncated — absent).** Confirm the HTML file exists and harvest real section IDs before building. Standing rule holds: geometry is shown as given fact; VSEPR is never named or derived.

### V-12b-01 · s-hero · CO₂ vs. H₂O dipoles — NEW · T0
Left: O=C=O linear, δ⁺ on C, δ⁻ on each O, two outward dipole arrows, "net dipole = 0." Right: H₂O bent (~104°, shown schematically, angle unexplained), arrows converging toward O, net arrow toward O. Structural style (atom circles + bond lines), not `.d-*`.
**Size:** `max-width: 580px` · **Caption:** `same polar bonds · different geometry · different molecular polarity`

### V-12b-02 · s-concept · CH₄ vs. NH₃ — NEW · T0 (renders beside the faded-example widget)
Left: CH₄, four symmetric H, small outward bond arrows with cancellation marks; "nonpolar overall · LDF only." Right: NH₃ pyramidal, lone pair drawn above N, arrows toward N, net arrow; "polar overall · dipole-dipole + H-bonding." Geometry shown, not explained; no angles labeled.
**Size:** `max-width: 560px` · **Caption:** `bond polarity + geometry = molecular polarity`

---

## 1-3a · Lewis Structures

**IMPLEMENTED:** `s-sharing` water Lewis diagram · `s-lab` Lewis structure lab.

### V-13a-01 · s-hero · Stick bond vs. Lewis — NEW · T0
Left: H–H stick. Right: H:H with shared pair. Labels "stick diagram" / "Lewis structure," note "same bond — different level of detail."
**Size:** `max-width: 360px` · **Caption:** `a Lewis structure maps where the valence electrons actually live`

### V-13a-02 · s-sharing · CO₂ walkthrough — NEW · W (step-builder states) ★ signature
Six SVG state layers consumed by the step-builder (decision gates and all strings in Content_Expansion_v2.md):
1. bare formula CO₂ with per-atom valence callouts (C: 4 · O: 6 · O: 6)
2. three separated atoms, C centered
3. O–C–O single bonds; budget readout "16 − 4 = 12"
4. three lone pairs per O; budget "0 remaining"; C's count flagged "4 — short"
5. lone pair on each O highlighted with a promote-to-bond arrow
6. O=C=O complete; audit ledger "each O: 8 ✓ · C: 8 ✓"
Budget readout persistent across states. Electron dots per `s-sharing` convention.
**Size:** standard section width · **Caption (finale state):** `when the audit fails, promote lone pairs to bonds — never invent electrons`

### V-13a-03 · s-selfx · Why H can't be central — NEW · T0
Left: H drawn central with 4 electrons, struck through; "impossible — hydrogen's shell caps at 2." Right: correct H₂O, O central. 
**Size:** `max-width: 480px` · **Caption:** `hydrogen's outer shell is the first shell — capacity 2, not 8`

---

## 1-3b · IMFs & Properties

**IMPLEMENTED:** `s-attraction` bonds-vs-IMFs · `s-types` hierarchy prose section · `s-interactive` IMF & phase lab.

### V-13b-01 · s-hero · Three-force hierarchy — NEW · T0
Three panels: LDF (two nonpolar blobs, sparse dash, "weak, temporary, universal") · dipole-dipole (δ⁺/δ⁻ pair, "stronger, permanent alignment") · hydrogen bond (explicit H and O/N atoms, "strongest, needs H on N/O/F").
**Size:** `max-width: 600px` · **Caption:** `stronger IMF → higher boiling point · lower vapor pressure`

### V-13b-02 · s-bulk · Water-bead zoom — NEW · T3
Three levels. **Macro:** water beading on a leaf surface. **Meso:** one droplet, surface curve emphasized. **Particulate:** H₂O molecules with hydrogen-bond dashes, surface molecules pulled inward (net-inward dash asymmetry at the surface). `.d-*` conventions on the particulate layer; liquid lumps phase marker.
**Size:** stage `max-width: 600px` · **Legend (particulate):** `● H₂O molecule · --- hydrogen bond` · **Caption:** `a bead of water is a tug-of-war you can see from across the room`

### V-13b-03 · s-predict · Three-column IMF density — NEW · T0 (inside the reveal)
Columns CH₄ / HCl / NH₃: molecule groups with dash density increasing left to right; δ labels on HCl; explicit N–H···N contact in the NH₃ column. Boiling points beneath: −161 °C · −85 °C · −33 °C.
**⚑ Verify** the three boiling points.
**Size:** `max-width: 580px` · **Caption:** `stronger IMF → molecules held closer → more energy to separate → higher BP`

### V-13b-04 · s-exam · Acetone vs. ethanol — NEW · T0
Simplified structural formulas. Acetone: C=O flagged, "no O–H or N–H → dipole-dipole only." Ethanol: O–H circled, "O–H present → hydrogen bonding."
**Size:** `max-width: 560px` · **Caption:** `the O–H group is the key structural feature — not just that oxygen is present`

---

## 2-2a · Physical vs. Chemical Change

**IMPLEMENTED:** `s-contrasts` particle-panel contrasts · `s-builder` change lab.

### V-22a-01 · s-hero · Tawa zoom — NEW · T3 ★ signature
Two levels, two targets. **Macro:** tawa scene — ghee melting on one side, dough browning on the other (this replaces the v1 split-panel hero). **Particulate:** tapping the ghee anchors into a fat-molecule panel (same polygon particles before/after, arrangement loosened — physical); tapping the dough anchors into a reaction panel (reactant shapes → new product shapes + gas particles with tails escaping — chemical). Both particulate panels obey `.d-frame`, conservation, phase markers.
**Size:** stage `max-width: 620px` · **Legend:** per panel · **Caption:** `two changes on one pan · only one of them makes new molecules`

### V-22a-02 · s-mass · Closed vs. open system — NEW · T1 (upgrade from v1's static)
Four states: (1) both containers loaded, scales read equal; (2) reactions run; (3) gas particles (tails) stay trapped under the sealed lid on the left, escape above the `.d-wall` open walls on the right; (4) final scale readings — left unchanged, right lower, with the escaped particles still drawn above the boundary, counted. Atom conservation visibly holds in every state: escaped atoms remain on canvas, outside the boundary.
**Size:** `max-width: 600px` · **Legend:** `● solid reactant · ● solid product · ● gas product` · **Caption:** `conservation of mass is always true · the system boundary is what your scale can see`

### V-22a-03 · s-exam · Butter vs. dough — NEW · T0
Two columns of `.d-frame` before/after panels. Left (physical): fat particles, brackets → lumps, IMF dashes present → absent, particles identical. Right (chemical): reactant shapes A/B → product shapes C/D, gas with tails escaping above the frame. Atom counts conserved within each column.
**Size:** `max-width: 580px` · **Legend:** per column · **Caption:** `trace the bonds to classify the change`

---

## 2-7a · The Mole & Molar Mass

**IMPLEMENTED:** `s-builder` molar mass builder · `s-scale` recipe-scaling section.

### V-27a-01 · s-hero · Teaspoon zoom — NEW · T3
Three levels. **Macro:** teaspoon of baking soda on a balance reading 4.2 g. **Meso:** powder grains. **Particulate:** field of NaHCO₃ formula units (schematic labeled clusters — this layer is a conceptual illustration, not a `.d-*` phase diagram; density implies uncountability, edge fade suggests continuation). Level labels: "on the scale" / "in the spoon" / "the count you can't do."
**Size:** stage `max-width: 560px` · **Caption:** `4.2 g is easy to measure · the count is the problem this page solves`

### V-27a-02 · s-dozen · Atom-to-mole bridge — NEW · T0
Left: one ¹²C atom, "1 atom · 12 amu." Center: "× 6.022 × 10²³" bracket, IBM Plex Mono. Right: balance icon, "12 g · 1 mole."
**Size:** `max-width: 580px` · **Caption:** `atomic mass units → grams per mole · Avogadro's number is the bridge`

### V-27a-03 · s-molarmass · NaHCO₃ ledger — NEW · T0 (the worked half of the faded pair)
Formula large in IBM Plex Mono; four annotation lines (Na 1 × 22.99 · H 1 × 1.01 · C 1 × 12.01 · O 3 × 16.00 = 48.00); rule; **84.01 g/mol** boxed. SVG text with tspan for subscripts — verify rendering.
**⚑ Verify** atomic masses against the table / `window.GC_ELEMENTS`.
**Size:** `max-width: 440px` · **Caption:** `subscripts give the count · the table gives the mass · multiply, then sum`

*(The CaCO₃ your-turn ledger and the sucrose exam ledger are scaffold-widget tables, not SVGs — strings in Content_Expansion_v2.md.)*

---

## 2-7b · Mole Conversions

**IMPLEMENTED:** `s-map` mole map (grams ↔ moles).

### V-27b-01 · s-hero · Three-node hub — NEW · T0 · ⚑ conditional
Particles — **Moles** (hub, bolder) — Grams; four labeled arrows (÷/× 6.022 × 10²³, ×/÷ molar mass); no direct particles↔grams path drawn.
**⚑ Check `s-map` first:** if the implemented map already shows the three-node hub, skip this visual entirely.
**Size:** `max-width: 480px` · **Caption:** `moles is always the middle stop · there is no direct road from grams to particles`

### V-27b-02 · s-da · Worked two-step chain (H₂O) — NEW · T0 (the worked half of the faded pair)
Boxes: "9.01 g H₂O" → factor "× (1 mol / 18.02 g)" with grams struck through, "g cancels ✓" → "0.500 mol" → factor "× (6.022 × 10²³ / 1 mol)", mol struck through → "3.01 × 10²³ molecules." Canceled units grayed/struck; surviving units full ink.
**Size:** `max-width: 580px` · **Caption:** `units tell you which fraction to write · if units don't cancel, the setup is wrong`

---

## 2-7c · Stoichiometry & BCA Tables *(newly covered — v1's "not in the audit" note was wrong; it is built, with a BCA simulator)*

**IMPLEMENTED:** `s-simulator` BCA simulator with reaction-progress slider (already a T2-class interactive; leave untouched).

### V-27c-01 · s-recipe · Recipe-ratio particle panel — NEW · T0
Left half: 5 cheese + 6 bread drawn as countable icons → 3 sandwiches + 2 cheese remaining (leftovers visually set aside, not deleted — conservation instinct). Right half: the same logic on CH₄ + 2 O₂ → CO₂ + 2 H₂O with mole labels. Parallel layout so the analogy is spatial.
**Size:** `max-width: 600px` · **Caption:** `coefficients are a ratio, not an inventory`

### V-27c-02 · s-bca · BCA fill table — NEW · W (scaffold, table mode)
Grid: columns CH₄ · O₂ · CO₂ · H₂O; rows Before (given) / Change (blanks) / After (blanks). Styling: headers Hanken Grotesk, values IBM Plex Mono; Change row visually tied to the equation's coefficients (coefficient chips above each column). All cell values and feedback in Content_Expansion_v2.md.
**Size:** standard section width

---

## C-RXN · Reaction Types & Balancing

**IMPLEMENTED:** `s-balancer` visual balancer.

### V-crxn-01 · s-hero · 2 Na + Cl₂ → 2 NaCl — NEW · T1
Three states: (1) before — Na `.d-metal` squares in brackets (solid), Cl₂ bonded pairs with tails (gas); (2) rearrangement — bonds opening, particles in transit; (3) after — Na⁺/Cl⁻ pairs in brackets (solid). Atom-inventory ledger persistent and constant across all states: "Na: 2 → 2 ✓ · Cl: 2 → 2 ✓."
**⚑ Verify** 2 Na(s) + Cl₂(g) → 2 NaCl(s).
**Size:** `max-width: 580px` · **Legend:** `■ Na/Na⁺ · ● Cl/Cl⁻ · --- ionic attraction` · **Caption:** `atoms are never created or destroyed · only rearranged`

### V-crxn-02 · s-types · Six-type tabbed card — NEW · W (tabs) — DECISION RESOLVED: tabbed
Six tabs (Synthesis / Decomposition / Single repl. / Double repl. / Combustion / Neutralization). Tab body: pattern in IBM Plex Mono, one balanced example, one-line signature (all six bodies written in Content_Expansion_v2.md). Follows the classify drill (commit-reveal, drill mode — items in the content doc).
**Size:** standard section width · **Caption:** `recognize the pattern first · the equation follows from the type`

### V-crxn-03 · s-law · Methane balancing walkthrough — NEW · W (step-builder states) ★ signature — DECISION RESOLVED: step-through with gates
Four SVG states (gates and strings in Content_Expansion_v2.md):
1. unbalanced equation; ledger C 1=1 ✓ (green) · H 4≠2 ✗ · O 2≠3 ✗ (✗ rows vermilion)
2. coefficient **2** before H₂O circled in vermilion; ledger H 4=4 ✓ · O 2≠4 ✗
3. coefficient **2** before O₂ circled; ledger all ✓
4. final equation, full green ledger
**Size:** standard section width · **Caption (finale):** `coefficients balance the ledger · subscripts define the molecule · never touch a subscript`

---

## C-SPA · Structure → Property → Argument

**IMPLEMENTED:** `s-explorer` heat-the-chains interactive with argument builder (⚑ refactor target: its argument builder becomes the scaffold widget's bank mode when this lesson is next touched — behavior identical, code shared).

### V-cspa-01 · s-hero · Five-step chain — NEW · T0
Five boxes with vermilion arrows: Structural Feature → IMF Strength → Macroscopic Property → Material Function → Design Trade-off. Example line under each in small IBM Plex Mono (straight chain / tight packing → strong LDF / solid at room temp / separates the layers / oil makes it flat). Stacks to two rows on narrow screens.
**Size:** `max-width: 580px` · **Caption:** `every step hangs from the one before · a complete argument traces all five`

### V-cspa-02 · s-hero · Prata zoom — NEW · T3 · ⚑ BLOCKED
Three levels. **Macro:** roti prata cross-section, visible flaky layers. **Meso:** one fat layer between two dough sheets. **Particulate:** straight saturated chains packed tight between dough boundaries, LDF dashes.
**⚑ BLOCKED on David's verification of the lamination/steam mechanism against Unit 2 phenomenon materials. Do not build until signed off.**
**Size:** stage `max-width: 600px` · **Caption:** `flakiness is a molecular packing decision`

### V-cspa-04 · s-structure · Saturated vs. unsaturated packing — NEW · T0 (carried from v1, unchanged)
Line-bond zig-zag chains, not `.d-*` circles. Left: 2–3 straight chains flush, LDF dashes along full length; "straight chain · tight packing · strong LDF · single bonds — free rotation — overall straight." Right: same count of chains, each with one pronounced cis kink (~30° deviation — prominent, not exaggerated); visible gaps; sparse dashes; "kinked chain · loose packing · weak LDF · double bond — rigid — permanent bend."
**Size:** `max-width: 580px` · **Caption:** `straight → tight packing → strong LDF · kinked → gaps → weak LDF`

### V-cspa-03 · s-exam · Argument scaffold — NEW · W (scaffold, free mode) — v1 REVERSED
Five chained slots (same visual language as V-cspa-01, arrows included), each a textarea with per-slot model answer (strings in Content_Expansion_v2.md). Slot 3 carries the ⚑ linking-mark flag visually.
**Size:** standard section width · **Caption:** `each step must explicitly connect to the next · a skipped link breaks the argument`

---

## Verification checklist (run before each lesson's build session)

**Structural:**
- 1-2b: confirm the lesson file exists; harvest real section IDs (the audit contains none).
- 2-7b: check `s-map` scope before building V-27b-01.
- All 1-2b geometry visuals: shape shown as fact, VSEPR never named.

**Chemistry:**
- Pauling EN and every ΔEN on V-12a-01 and in 1-2a/1-2b widget strings (C 2.55 · H 2.20 · O 3.44 · N 3.04 · F 3.98 · Cl 3.16 · Na 0.93)
- Li 520 / K 419 kJ/mol first IE (V-11b-03)
- Na ≈ 186 pm / Cl ≈ 99 pm radii (V-11b-02)
- Boiling points −161 / −85 / −33 °C (V-13b-03); stearic 69 °C / oleic 13 °C (C-SPA strings)
- Molar masses: H₂O 18.02 · CO₂ 44.01 · NaHCO₃ 84.01 · CaCO₃ 100.09 · sucrose 342.34 g/mol
- Balanced equations: 2 Na + Cl₂ → 2 NaCl · CH₄ + 2 O₂ → CO₂ + 2 H₂O · all six classify-drill equations (C-RXN strings)
- K→Ga energy-ordering simplification: David's sign-off (V-11a-02)
- H–F boundary-case framing: David's sign-off (1-2a item 2 strings)
- Roti prata lamination mechanism: David's sign-off (V-cspa-02 and C-SPA s-argument step 4)
- GHS pictograms for sodium per PLC/Unit 1 materials (V-11b-04 macro layer)
