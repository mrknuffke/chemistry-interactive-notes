# Content Expansion v2 — All Lessons
## Chemistry Interactive Notes · Supersedes Content Expansion Draft v1 in full

**How to read this document.** Each lesson lists only the sections that change. For each section: the change type, the infrastructure it uses (widget from INTERACTION_SPEC.md, visual ID from Diagram_Inventory_v2.md), and the **complete student-facing text** — prose, prompts, options, feedback strings, model answers. Nothing here is a placeholder; strings ship as written unless David edits them. All prose obeys VOICE.md.

**Division of labor between documents:** visual appearance, sizing, and SVG specs live only in Diagram_Inventory_v2.md (referenced here as `[V-…]`). Behavior lives only in INTERACTION_SPEC.md. This document owns words.

**Manifest correction from v1:** the content audit covers **2-7c (Stoichiometry & BCA Tables)** — it is built, including a BCA simulator. The v1 inventory's claim that 2-7c was absent from the audit is wrong. Conversely, **1-2b (Molecular Polarity) does not appear in the audit at all** — not truncated, absent. Its section IDs below are inferred and its very existence as a built file must be verified before its build session (see BUILD_PLAN.md open questions).

**Change type tags:**
`[PROSE]` new or replacement prose · `[GATE]` convert reveal to commit-reveal widget · `[FADED]` faded worked example widget · `[SCAFFOLD]` fillable scaffold widget · `[STEPBUILD]` step-through builder widget · `[VIS]` visual (tier per inventory)

---

# LESSON 1-1a · Atomic Structure & Electron Configuration

## s-hero
`[VIS → V-11a-01]` Fluorine vs. neon comparison (T0). Existing prose stays — it is already the voice target.

## s-wrinkle · The K → Ga wrinkle
The existing prose is good; keep it. Add the following extension **after** the existing "Because at that point the fourth shell sits at slightly lower energy…" paragraph, then the visual, then the faded example.

`[PROSE]` — insert:

> "Slightly lower energy" deserves one more sentence, because it sounds like hand-waving and isn't. Inside shell 3 there's a region called the 3d subshell — the part that holds electrons 9 through 18 of that shell. After shell 3 reaches 8, the next open spot in shell 3 is 3d, and 3d sits *above* the first spot in shell 4 (called 4s). Electrons don't care about your shell numbering. They fill the lowest-energy vacancy, period. So electron 19 takes 4s. Then, once 4s holds two electrons, their repulsion nudges the energies again, 3d dips back underneath, and the next ten electrons — scandium through zinc, the transition metals — go back and finish shell 3 before shell 4 resumes at gallium.

`[VIS → V-11a-02]` Energy-crossover filling order (T1, steppable: Ar → K → Ca → Sc → … the student steps through Z = 18 → 21 and watches which vacancy fills).

`[FADED]` — after the visual. Model case: potassium. Your turn: calcium.

**Model panel — "Watch it once: potassium, Z = 19"**
- Step 1 · Fill shell 1 → "2 electrons. 2 placed." · *why:* "Innermost first, always."
- Step 2 · Fill shell 2 → "8 electrons. 10 placed." · *why:* "Second shell caps at 8."
- Step 3 · Fill shell 3 to 8 → "18 placed." · *why:* "Shell 3 pauses at 8 — its 3d region is higher-energy than shell 4's opening."
- Step 4 · Place electron 19 → "Shell 4. Configuration: 2, 8, 8, 1." · *why:* "Here's where most people write 2, 8, 9. The 4s vacancy is lower energy than 3d, so electron 19 skips ahead."
- Step 5 · Read the valence count → "1." · *why:* "One outer electron — which is why potassium behaves like sodium: same count, same chemistry, easier to lose."

**Your-turn panel — "Now you: calcium, Z = 20"**
- Step 1 (given): "Shells 1 and 2 fill: 2, then 8. 10 placed."
- Step 2 (given): "Shell 3 fills to 8. 18 placed."
- Step 3 (blank · choice): "Electrons 19 and 20 go to…" — options:
  - "shell 3 (it can hold 18)" → feedback: "It can, eventually — but the 3d region of shell 3 sits above 4s in energy right now. Lowest vacancy wins. They go to shell 4."
  - **"shell 4"** ✓ → feedback: "Right — 4s is the lowest open spot until shell 4 holds two electrons."
- Step 4 (blank · text, accepted: "2,8,8,2" / "2, 8, 8, 2"): "Write the full configuration." — wrong feedback: "Walk the placements: 2, then 8, then 8, then the last two in shell 4."
- Step 5 (blank · numeric, answer 2): "Valence electrons?" — wrong feedback: "Valence = outer shell count only. Shell 4 holds 2. The 8 underneath are locked away."
- Step 6 (blank · choice): "So in a reaction, calcium will most likely…" — options:
  - **"lose 2 electrons → Ca²⁺"** ✓ → feedback: "Shortest path to a full outer shell: drop the 2, expose the full 8 underneath."
  - "gain 6 electrons → Ca⁶⁻" → feedback: "That completes the shell too — but pulling in six electrons costs far more than shedding two. Atoms take the cheap route."

## s-predict-val · Predict: gain or lose?
`[GATE]` commit-reveal, choice mode. `[VIS → V-11a-03]` sulfur ionization (T1: before → electrons in transit → after).

- Prompt: "Sulfur's configuration is 2, 8, 6. To reach a full outer shell, what does sulfur do?"
- Options and feedback:
  - "Lose 6 electrons" → "This lands on a full shell too — the 8 underneath. But moving six electrons is enormously more expensive than moving two. Atoms take the shortest path."
  - **"Gain 2 electrons"** ✓ → "Shortest path wins. Sulfur pulls in two and becomes S²⁻, configuration 2, 8, 8."
  - "Lose 2 electrons" → "Losing 2 leaves the outer shell at 4 — further from full than where it started. Check what losing does to the count before choosing a direction."
  - "Gain 6 electrons" → "Shells cap at 8 here. Six more would overflow it. Sulfur only needs 2 to close the shell."
- Reveal text: keep the existing reveal prose (it's already in voice), followed by the T1 visual.

## s-selfx
`[VIS → V-11a-04]` Li / Na / K same-valence row (T0), placed before the prompt.

## s-exam
`[VIS → V-11a-05]` element X (2, 8, 7) unlabeled Bohr (T0). `[GATE]` free mode on the written answer, minChars 40, hint text: "write your answer first — even a rough one. Comparing beats reading."

---

# LESSON 1-1b · Periodic Trends & Reactivity

## s-hero
`[VIS → V-11b-01]` Na vs. Cu position contrast (T0). Existing prose stays.

## s-predict-size · Which is bigger?
`[GATE]` choice. `[VIS → V-11b-02]` Na vs. Cl to scale (T0), shown inside the reveal, not before it — the diagram is the answer.

- Prompt: "Sodium and chlorine sit in the same row of the table — same outermost shell. Which atom is bigger?"
- Options:
  - **"Sodium"** ✓ → "Same shell, but chlorine has 17 protons pulling it inward and sodium only 11. More pull, smaller atom — even though chlorine has more electrons."
  - "Chlorine" → "The instinct is 'more electrons = bigger.' But those electrons are going into the *same* shell, while the nucleus gains protons. Seventeen protons reel that shell in harder than eleven do."
  - "About the same" → "Same shell, yes — but the pull on it isn't the same. Count the protons."
- Reveal: existing reveal prose + V-11b-02.

## s-predict-react · Which is more reactive?
`[GATE]` choice. `[VIS → V-11b-03]` Li vs. K ionization energy bars (T0), inside the reveal.

- Prompt: "Lithium and potassium are both Group 1 metals — both need to lose one electron. Which reacts more violently with water?"
- Options:
  - "Lithium" → "Reasonable guess — lithium is smaller and 'tighter' sounds more energetic. But tight is the problem: lithium's outer electron is close to the nucleus and hard to remove. Reactivity for a metal is about how *easily* the electron leaves."
  - **"Potassium"** ✓ → "Potassium's outer electron sits two shells farther out, shielded by more inner electrons. It costs 419 kJ/mol to remove, versus lithium's 520. Cheaper electron, faster reaction."
  - "Equally — both lose one electron" → "What they do is the same; what it *costs* isn't. The electron's distance from the nucleus sets the price, and the price sets the violence."

## s-hazard
`[VIS → V-11b-04]` **new zoom (T3)**: GHS-labeled bottle → sodium metal surface → single Na atom shedding its valence electron (the existing implemented single-atom diagram becomes the particulate layer). Level labels: "the label on the bottle" / "the metal in the bottle" / "why the label is there." Caption: `the hazard diamond is a claim about one electron`

## s-selfx
`[VIS → V-11b-05]` IE trend direction grid (T0), before the prompt.

## s-exam
`[VIS → V-11b-06]` Rb/K position thumbnail (T0). `[GATE]` free mode, minChars 40.

---

# LESSON 1-2a · Bonding & Electronegativity

## s-hero
`[VIS → V-12a-01]` **ΔEN scrub (T2)** — replaces the v1 static spectrum bar *and* the v1 four-panel bond-type card with one instrument: a slider from ΔEN 0 to 3.5 drives a two-atom drawing whose shared electron cloud slides from centered (0) to lopsided (δ⁺/δ⁻ appearing near 0.5) to fully transferred ions (at 1.7, the cloud snaps to the winner and the +/− labels appear). Threshold marks at 0.5 and 1.7. Scrub targets (micro-tasks under the slider): "drag to where partial charges first appear" (0.5 ± 0.1) and "drag to where sharing becomes taking" (1.7 ± 0.1). A separate static side panel shows metallic bonding, which has no ΔEN address: "metal + metal — nobody grips; the electrons pool."

`[PROSE]` — replacement hero prose:

> Every atom pulls on bonding electrons with some grip strength — that's electronegativity. Fluorine grips hardest of any element (3.98). Cesium barely holds on (0.79). When two atoms bond, their grips compete, and the *difference* between them — ΔEN — tells you who's winning and by how much. Drag the slider and watch what a bond does as the contest gets more lopsided. This page is about reading any bond from two numbers.

## s-tug · The electronegativity tug-of-war
`[PROSE]` — insert before the four-type list (voice-tuned v1):

> Nearly even grips — two similar nonmetals — and the electrons sit near the middle. Nobody wins; nothing charges up. That's a nonpolar covalent bond.
>
> One atom grips distinctly harder and the electrons spend most of their time on that side — but they never fully abandon the weaker atom. The winning side goes slightly negative (δ⁻), the losing side slightly positive (δ⁺). Polar covalent: still a shared bond, but a lopsided one.
>
> Make the mismatch enormous — a metal that barely holds its electron against a nonmetal that grabs everything — and "sharing" stops being the right word. The nonmetal takes the electron outright. Now you have two ions, one +, one −, stuck together by plain electrostatic attraction. Ionic.
>
> And when metal bonds to metal, neither atom holds on. Both release their outer electrons into a shared pool that flows among all the positive cores at once — the reason metals conduct and bend instead of shattering. Metallic.

## s-predict · Test your intuition
`[GATE]` two choice items (drill mode, 2 items).

**Item 1**
- Prompt: "Carbon (EN 2.55) bonds to hydrogen (EN 2.20). What kind of bond?"
- Options:
  - **"Nonpolar covalent"** ✓ → "ΔEN = |2.55 − 2.20| = 0.35, under the 0.5 line. The electrons split nearly evenly — which is why hydrocarbons are so stubbornly nonpolar."
  - "Polar covalent" → "Do the subtraction before trusting the vibe: |2.55 − 2.20| = 0.35. That's under 0.5 — too even a match for partial charges to matter."
  - "Ionic" → "Ionic needs a mismatch of 1.7 or more — a metal-versus-nonmetal rout. Two mid-strength nonmetals gripping at 2.55 and 2.20 is nearly a tie."

**Item 2**
- Prompt: "Hydrogen (EN 2.20) bonds to fluorine (EN 3.98). ΔEN = 1.78 — just past the 1.7 line. What kind of bond is H–F, really?"
- Options:
  - "Ionic — 1.78 ≥ 1.7, the number decides" → "This is exactly why the threshold is a guideline and not a wall. Both H and F are nonmetals that hold their electrons hard; neither fully surrenders one. The bond is covalent — savagely polar, but covalent."
  - **"Polar covalent — extremely polar, but still shared"** ✓ → "Right. The 1.7 line is a rule of thumb, and H–F is the classic case that sits on it. Two nonmetals means the electron is fought over, not handed over. Chemists file HF under polar covalent."
  - "Nonpolar covalent" → "A grip mismatch of 1.78 is one of the most lopsided contests on the whole table — fluorine is the strongest gripper there is. This bond is about as polar as a covalent bond gets."

## s-selfx
`[VIS → V-12a-02]` ionic lattice vs. metallic sea (T0), before the prompt.

## s-recall
`[PROSE]` one framing line before the blanks: "You've watched ΔEN decide where electrons end up. Now pull the thresholds and the four bond types from memory — slider's gone."

## s-exam
`[FADED]` before the exam prompt. Model: C–O in CO₂. Your turn: Na–Cl.

**Model — "Worked: carbon–oxygen"**
- Step 1 · Look up grips → "C = 2.55, O = 3.44." · *why:* "Always start from the numbers, not the reputation of the elements."
- Step 2 · ΔEN → "|3.44 − 2.55| = 0.89." · *why:* "Absolute difference — order doesn't matter."
- Step 3 · Classify → "0.5 ≤ 0.89 < 1.7 → polar covalent." · *why:* "Between the lines: shared, but lopsided. δ⁻ on O, δ⁺ on C."
- Step 4 · Macroscopic consequence → "CO₂ stays molecular. No free ions, so it doesn't conduct." · *why:* "Bond type predicts electrical behavior — that's why this classification is worth anything."

**Your turn — "Now: sodium–chlorine"**
- Step 1 (given): "Na = 0.93, Cl = 3.16."
- Step 2 (blank · numeric, answer 2.23, tol 0.01): "ΔEN = ?" — wrong feedback: "|3.16 − 0.93|. Subtract, then drop the sign."
- Step 3 (blank · choice): "Classification?" — options: "polar covalent" → "2.23 is far past the 1.7 line — and this time it's a metal versus a nonmetal, the classic rout." / **"ionic"** ✓ → "A weak-grip metal against a strong-grip nonmetal: the electron is taken, not shared. Na⁺ and Cl⁻."
- Step 4 (blank · choice): "So solid NaCl dissolved in water will…" — options: **"conduct — the ions come free and carry charge"** ✓ → "That's the observable payoff of 'ionic': mobile charged particles." / "not conduct — salt water is still just salt and water" → "Dissolving an ionic solid liberates its ions. Mobile charges are exactly what a current needs."

`[GATE]` then the existing exam prompt (water vs. aluminum contrast), free mode, minChars 60.

---

# LESSON 1-2b · Molecular Polarity ⚑ EXISTENCE UNVERIFIED

**⚑ This lesson is absent from the content audit.** Confirm the HTML file exists and pull real section IDs before building anything below. If it doesn't exist, this content is the seed spec for creating it.

## s-hero
`[VIS → V-12b-01]` CO₂ vs. H₂O dipole comparison (T0).

`[PROSE]`:

> CO₂ has two polar bonds and is a nonpolar molecule. Water has two polar bonds and is one of the most polar molecules there is. Same ingredient, opposite result — the difference is shape. This page is about the step everyone skips: after you've judged the bonds, you still have to ask where they point.

## s-concept · Bond polarity vs. molecular polarity
`[PROSE]` — replacement:

> Here's the trap: "the bonds are polar, so the molecule is polar." Sometimes. Bond polarity is one tug-of-war, judged by ΔEN. Molecular polarity asks whether all the tugs-of-war *add up* to a net pull — and pulls in opposite directions cancel.
>
> CO₂ is the clean case. Each C=O bond is genuinely polar — oxygen wins, δ⁻ on each O, δ⁺ on the carbon. But the molecule is a straight line with the two oxygens on opposite ends. Their pulls point exactly away from each other and cancel to zero. No end of the molecule is more negative than the other. Nonpolar molecule, polar bonds and all.
>
> Water refuses to line up. Its two O–H bonds sit at about 104° to each other — bent, not straight. Both pulls point generally toward the oxygen, so instead of canceling they gang up. The oxygen end of the molecule runs δ⁻, the hydrogen end δ⁺. Water is polar because of its *shape*, not just its bonds.
>
> **The one idea to hold onto**
> Molecular polarity takes two inputs: how polar the bonds are (ΔEN) and where they point (shape). Polar bonds in a symmetric arrangement usually cancel — nonpolar molecule. Polar bonds in a lopsided arrangement don't — polar molecule. You can't skip either input.

`[FADED]` Model: methane. Your turn: ammonia. `[VIS → V-12b-02]` CH₄ vs. NH₃ (T0) beside it.

**Model — "Worked: methane, CH₄"**
- Step 1 · Bond polarity → "C–H: ΔEN = 0.35 → essentially nonpolar bonds." · *why:* "Judge the bonds before the shape. Weak pulls can't add up to much no matter where they point."
- Step 2 · Shape → "Four H arranged symmetrically around C." · *why:* "Perfect symmetry is the cancellation machine: every pull has an equal, opposite partner."
- Step 3 · Verdict → "Nonpolar molecule." · *why:* "Nonpolar bonds + symmetric shape — nothing survives."
- Step 4 · IMF consequence → "London dispersion forces only." · *why:* "This is where the classification cashes out: no net dipole means no dipole-dipole attraction available."

**Your turn — "Now: ammonia, NH₃"**
- Step 1 (blank · choice): "N–H has ΔEN = 0.84. The bonds are…" — options: **"polar"** ✓ → "0.84 sits squarely between 0.5 and 1.7. Each N–H pull points toward the nitrogen." / "nonpolar" → "0.84 clears the 0.5 line comfortably. These pulls are real."
- Step 2 (given): "Shape: nitrogen holds three H below and a lone pair above — a squat pyramid, not a flat triangle."
- Step 3 (blank · choice): "With all three pulls angled toward N, the bond dipoles…" — options: **"reinforce — they add to a net pull toward N"** ✓ → "The lone-pair side of the molecule runs δ⁻; the hydrogen side δ⁺." / "cancel — three pulls always balance out" → "Three pulls cancel only if they're arranged flat and symmetric. Pyramidal isn't — all three lean the same general direction."
- Step 4 (blank · choice): "So NH₃'s intermolecular forces are…" — options: "LDF only" → "LDF is always present, but a polar molecule has more on offer." / "dipole-dipole only" → "Close — but check what the hydrogens are bonded *to*. H directly on N (or O, or F) unlocks the strongest IMF of all." / **"dipole-dipole plus hydrogen bonding"** ✓ → "Polar molecule → dipole-dipole; H bonded directly to N → hydrogen bonding on top. This is why ammonia boils 130 degrees above methane."

## s-predict
`[GATE]` — convert every predict item to choice mode using this fixed trace as the reveal skeleton (fill per item once real prompts are confirmed): "Bonds and ΔEN → shape → cancel or reinforce → molecular polarity → IMF type." No reveal without a committed classification.

## s-selfx
`[PROSE]` framing before the CO₂ vs. H₂O boiling-point prompt:

> Trace the whole chain before you write: shape → molecular polarity → IMF type → energy to separate → boiling point. The common shortcut — "water has O–H bonds so it has hydrogen bonds" — gets the right answer for the wrong reason and will fail you on the next molecule. The reason CO₂ boils 78 degrees below freezing isn't that it lacks O–H. It's that its shape cancels its polarity, locking it out of everything except LDF.

---

# LESSON 1-3a · Lewis Structures

## s-hero
`[VIS → V-13a-01]` stick bond vs. Lewis structure (T0). Existing prose stays.

## s-sharing · Why atoms share
`[PROSE]` — add after the existing conceptual prose:

> Knowing *why* atoms share doesn't draw the structure for you. Drawing is a procedure — six moves, same order every time. The whole game is an electron budget: count what you have, spend it in the right order, and check the books at the end.
>
> 1. **Count the budget.** Add every atom's valence electrons. That total is all you get — no deposits, no overdrafts.
> 2. **Pick the center.** The atom that appears once (and usually grips electrons least). Never hydrogen — its shell caps at 2, so it can only ever hold one bond.
> 3. **Spend on single bonds.** One bond from center to each outer atom, 2 electrons each.
> 4. **Fill the outer atoms.** Lone pairs on the terminal atoms until each has 8. (Hydrogen is already done at 2.)
> 5. **Dump the remainder on the center.** Whatever's left sits on the central atom as lone pairs.
> 6. **Audit the center.** If it has 8, done. If it's short, don't reach for new electrons — there are none. Convert a lone pair on an outer atom into a second bond. Repeat until the center hits 8.

`[STEPBUILD → V-13a-02]` — the CO₂ walkthrough becomes a step-through builder. Visual states per inventory; decision gates:

- **Step 1** — state: bare formula CO₂. Q: "Total valence electrons?"
  - "10" → "You budgeted one oxygen. C brings 4, and *each* O brings 6: 4 + 6 + 6."
  - **"16"** ✓ → "4 from carbon, 6 from each oxygen. Sixteen is the whole budget — spend carefully."
  - "18" → "Carbon brings 4, not 6 — count its column on the table, not oxygen's."
- **Step 2** — state: three atoms, unconnected. Q: "Which atom goes in the center?"
  - **"Carbon"** ✓ → "Appears once, grips electrons less than oxygen. Center."
  - "Oxygen" → "There are two of them — repeated atoms almost always ride on the outside. And oxygen out-grips carbon, which also argues against center."
- **Step 3** — state: O–C–O single bonds drawn. Q: "Two single bonds are placed. Electrons remaining?"
  - "14" → "A bond costs 2 electrons, not 1. Two bonds = 4 spent."
  - **"12"** ✓ → "16 − 4. Twelve left to place."
  - "8" → "Each bond costs 2 — two bonds cost 4 total, not 4 each."
- **Step 4** — state: bonds only. Q: "Where do the 12 go first?"
  - **"Lone pairs on the oxygens, until each has 8"** ✓ → "Outer atoms fill first. Three lone pairs each: exactly 12. Budget: zero."
  - "On the carbon — it's the center" → "The center gets the *leftovers*, and only after the outer atoms are full. Fill the oxygens first."
- **Step 5** — state: full octets on O, C showing 4. Q: "The budget is empty and carbon has only 4 electrons. The move?"
  - "Find more electrons" → "There are none. Sixteen was the whole budget — that's the discipline of the count in step 1."
  - **"Convert a lone pair on each oxygen into a second bond"** ✓ → "Shared electrons count for both atoms. Each new bond raises carbon's count by 2 without spending anything."
  - "Leave carbon at 4" → "An incomplete center means the structure is wrong, not that carbon is special. Carbon wants 8 like everyone else here."
- **Step 6** — state: O=C=O complete. Q: "Final audit — how many electrons around each oxygen now?"
  - "6" → "Count both what it keeps and what it shares: 2 lone pairs (4) plus a double bond (4)."
  - **"8"** ✓ → "Two lone pairs + a double bond = 8. Carbon: two double bonds = 8. Books balanced."
- **Finale:** "That's the whole procedure, and it never changes: count, center, bonds, outer, remainder, audit. When the audit fails, you promote lone pairs to bonds — you never invent electrons."

## s-predict
`[GATE]` — convert existing counting-practice items to choice or numeric commit (pull exact prompts from the built page; every item gates its reveal).

## s-selfx
`[VIS → V-13a-03]` why hydrogen can't be central (T0), before the prompt.

## s-exam · NCl₃
`[FADED]` before the exam prompt. Model: NH₃, fully worked. Your turn: NCl₃.

**Model — "Worked: ammonia, NH₃"**
- Step 1 · Budget → "N brings 5, each H brings 1: 5 + 3 = 8." · *why:* "Count before you draw, every time."
- Step 2 · Center → "N. Hydrogen can't be central — its shell caps at 2." · *why:* "The one-bond-only rule for H settles it instantly."
- Step 3 · Bonds → "Three N–H bonds: 6 spent, 2 left." · *why:* "Center to each outer atom, 2 electrons apiece."
- Step 4 · Outer atoms → "Each H already has 2 from its bond. Done." · *why:* "Hydrogen's full shell is 2, not 8 — the most commonly forgotten fact in this unit."
- Step 5 · Remainder → "The last 2 electrons sit on N as one lone pair." · *why:* "Leftovers always go to the center."
- Step 6 · Audit → "N: 3 bonds (6) + 1 lone pair (2) = 8. ✓" · *why:* "Books balanced; structure done."

**Your turn — "Now: NCl₃. Same skeleton, bigger budget."**
- Step 1 (blank · numeric, answer 26): "Total valence electrons?" — wrong feedback: "N brings 5; each Cl brings 7 — chlorine is in fluorine's column, not hydrogen's. 5 + 21."
- Step 2 (given): "N is central — appears once."
- Step 3 (blank · numeric, answer 20): "Three N–Cl bonds are placed. Electrons remaining?" — wrong feedback: "Three bonds spend 6 from the budget of 26."
- Step 4 (blank · numeric, answer 18): "Unlike hydrogen, each Cl needs a full 8. How many electrons do the three chlorines absorb as lone pairs?" — wrong feedback: "Each Cl has 2 from its bond and needs 6 more — three lone pairs apiece. 3 × 6."
- Step 5 (blank · numeric, answer 1): "Electrons left after the chlorines: 2. Lone pairs on N?" — wrong feedback: "Two electrons make exactly one pair — and it lands on the center."
- Step 6 (blank · choice): "Audit nitrogen." — options: **"3 bonds + 1 lone pair = 8 ✓"** ✓ → "Identical bookkeeping to NH₃ — the skeleton didn't change, only the budget did." / "3 bonds = 6, structure incomplete" → "You dropped the lone pair from step 5. Bonds *plus* lone pairs make the count."

`[GATE]` then the existing exam prompt, free mode, minChars 50.

---

# LESSON 1-3b · IMFs & Properties

## s-hero
`[VIS → V-13b-01]` three-force hierarchy (T0). Existing prose stays.

## s-bulk · Bulk scale evidence
`[VIS → V-13b-02]` **new zoom (T3)**: water beading on a leaf (macro) → droplet surface (meso) → H₂O molecules with hydrogen-bond dashes pulling inward (particulate). Level labels: "what you see" / "the surface" / "what's actually pulling." Caption: `a bead of water is a tug-of-war you can see from across the room`

## s-predict · Ranking properties
`[GATE]` choice. `[VIS → V-13b-03]` three-column IMF density panel (T0) inside the reveal.

- Prompt: "Methane (CH₄), hydrogen chloride (HCl), ammonia (NH₃). Which needs the highest temperature to boil?"
- Options:
  - "CH₄" → "Methane's C–H bonds are nonpolar (ΔEN 0.35) and its shape is symmetric — LDF only, the weakest grip in the set. It boils at −161 °C, the *lowest* of the three."
  - "HCl" → "Good middle instinct — HCl is a genuinely polar molecule with dipole-dipole forces. But check the strongest card in the deck: is any hydrogen bonded directly to N, O, or F in this set?"
  - **"NH₃"** ✓ → "Polar molecule *and* H bonded directly to N — that unlocks hydrogen bonding, the strongest IMF here. The boiling points tell the story: −161 °C, −85 °C, −33 °C."
- Reveal — full trace (replaces the passive v1 text, same content, post-commit):

> Trace each one the same way. **CH₄:** nonpolar bonds, symmetric shape, no net dipole — LDF only. **HCl:** one polar bond (ΔEN 0.96) with nowhere to hide — a polar molecule, dipole-dipole. **NH₃:** polar N–H bonds, pyramidal shape, pulls reinforce — polar; and because the H sits directly on nitrogen, hydrogen bonding stacks on top. The ranking CH₄ < HCl < NH₃ isn't three facts; it's one chain run three times.

## s-predict (second) · Like dissolves like
`[GATE]` choice.

- Prompt: "Oil won't dissolve in water. Will it dissolve in hexane — a nonpolar solvent held together only by LDF?"
- Options:
  - **"Yes"** ✓ → "The competition is fair now: oil offers hexane LDF, and LDF is all hexane's molecules have with each other. Nothing gets squeezed out. They mix."
  - "No — oil doesn't dissolve in anything" → "Oil failed in water for a specific reason, not a general one. Ask what the solvent's molecules would have to give up to make room."
- Reveal:

> "Like dissolves like" isn't a rule to memorize — it's a competition to referee. For oil to dissolve in water, oil molecules have to shove between water molecules. But water is holding onto water with hydrogen bonds, and the best oil can offer is weak LDF. Water isn't trading hydrogen bonds for that; it squeezes the oil back out. In hexane the trade is even — LDF for LDF — so the oil slides right in. Polar dissolves polar and nonpolar dissolves nonpolar because mixing only happens when the new attractions can pay for the old ones.

## s-recall
`[PROSE]` framing line: "Three forces, one hierarchy, one chain: IMF type → strength → boiling point and vapor pressure. Pull it from memory."

## s-selfx
`[PROSE]` framing before the water vs. CO₂ prompt:

> Run the full chain: shape → molecular polarity → IMF type → strength → boiling point. If your explanation is "water has O–H bonds, so hydrogen bonding," you're right about water and wrong about the question — because it doesn't explain why CO₂, a heavier molecule with polar bonds of its own, boils 178 degrees lower. CO₂'s linear shape cancels its polarity and locks it out of everything but LDF. Shape is the hinge of the whole comparison.

## s-exam
`[VIS → V-13b-04]` acetone vs. ethanol structure comparison (T0). `[GATE]` free mode on the exam answer, minChars 50.

---

# LESSON 2-2a · Physical vs. Chemical Change & Particle Diagrams

## s-hero
`[VIS → V-22a-01]` **new zoom (T3)**: the tawa scene (macro: ghee melting beside dough browning) → two-target particulate layer (ghee: same fat molecules, new arrangement · dough: bonds broken, new molecules, gas leaving). Level labels: "on the tawa" / "among the molecules." Caption: `two changes on one pan · only one of them makes new molecules`

## s-concept
`[PROSE]` — add after existing prose, before the summary callout:

> The reason this distinction trips people is that the *visible signs* overlap. Bubbles? Boiling water bubbles (physical) and baking soda in vinegar bubbles (chemical). Color change? Food dye spreading is physical; meat browning is chemical. Your eyes can suggest; they can't rule. The verdict is always at the particle level: are covalent bonds inside molecules breaking and reforming? Yes → chemical. No → physical.
>
> Three cases students argue about, settled:
>
> **Dissolving salt** — physical. The ionic lattice pulls apart, but every Na⁺ and every Cl⁻ comes out of the water exactly what it went in as. No covalent bond touched. Boil off the water and the same salt is sitting in the pan.
>
> **Melting ice** — physical. H₂O going in, H₂O coming out. The O–H bonds inside each molecule never open; only the hydrogen bonds *between* molecules give way to heat.
>
> **Burning wood** — chemical, and the one-way street proves it. The molecules in wood are gone — rebuilt into CO₂ and H₂O with different bonds entirely. You cannot unburn wood.

## s-mass · Conservation & systems
`[PROSE]` — replacement for the bridge:

> No reaction has ever created or destroyed an atom. Every atom present before is present after — in a product, in a dissolved ion, in a gas. So why does bread dough *weigh less* after baking?
>
> Because your scale has a boundary, and gases don't respect it. In a sealed flask — a closed system — vinegar and baking soda react and the reading doesn't move, because everything the reaction makes is still trapped inside. In an open oven, the same chemistry makes CO₂ and steam, and those molecules leave. The atoms aren't gone. They're in the kitchen air. They're just not standing on your scale anymore.
>
> **The one idea to hold onto**
> Conservation of mass is always true for the universe. When a scale seems to disagree, the scale isn't measuring the universe — find the atoms that crossed the boundary.

`[VIS → V-22a-02]` closed vs. open system (upgrade to T1, steppable: mix → react → gas escapes/stays → read the scale).

## s-predict
`[PROSE]` — decision procedure before the prompts:

> Before you commit on each one, run three checks: Do covalent bonds inside the molecules break and reform? Does something genuinely new appear — new substance, new properties? Could you get the original back without running a reaction? Bonds untouched and the original recoverable: physical. Bonds rebuilt into something new: chemical.

`[GATE]` — both existing predict prompts convert to choice mode (physical / chemical), each with per-option feedback written against the three checks (pull exact prompt wording from the built page).

## s-exam
`[VIS → V-22a-03]` butter melting vs. dough browning two-column particle comparison (T0). `[GATE]` free mode, minChars 60.

---

# LESSON 2-7a · The Mole & Molar Mass

## s-hero
`[VIS → V-27a-01]` **new zoom (T3)**: teaspoon of baking soda on a scale reading 4.2 g (macro) → powder grains (meso) → NaHCO₃ formula units, uncountably many (particulate). Level labels: "on the scale" / "in the spoon" / "the count you can't do." Caption: `4.2 g is easy to measure · the count is the problem this page solves`

## s-dozen · The mole concept
`[PROSE]` — replacement/extension:

> You can't count atoms. No instrument does it, and the numbers would be absurd anyway. So chemists count the way a bakery counts eggs — in a fixed group. Theirs is a dozen; ours is a mole: exactly 6.022 × 10²³ of anything. Atoms, molecules, ions, electrons — a mole of any of them is that same number. It's Avogadro's number, and it wasn't pulled from a hat. It was chosen to make one specific trick work: **an element's atomic mass in amu equals its molar mass in grams.** One carbon-12 atom weighs 12 amu; one mole of them weighs 12 g. Iron reads 55.85 on the table; a mole of iron is 55.85 g. The periodic table you already own is secretly a table of gram-sized masses.
>
> That's the whole usefulness of the mole: it's a bridge between the scale of atoms (unweighable) and the scale of your lab bench (a balance and some grams). You weigh grams. You compute moles. You now know the count.
>
> 6.022 × 10²³ refuses to be pictured, but you can hold it. Eighteen milliliters of water — a couple of sips — is one mole of water molecules. The entire number fits in your mouth. Going the other way: counting the molecules in that sip at one per second would take about 19 quadrillion years, over a million times the age of the universe. The number is enormous because molecules are that small.
>
> **The one idea to hold onto**
> The mole is a *count*, not a mass. A mole of iron and a mole of sulfur contain the identical number of atoms and weigh completely different amounts — a dozen bowling balls and a dozen golf balls are both twelve.

`[VIS → V-27a-02]` atom-to-mole scale bridge (T0).

## s-molarmass · Calculating molar mass
`[PROSE]` — before the builder:

> Molar mass is a reading-and-adding job. The formula tells you how many of each atom; the table tells you what each one weighs per mole; multiply and sum, unit g/mol. Every mistake in this calculation is one of two mistakes: misreading a subscript, or forgetting that a subscript after a parenthesis multiplies everything inside it.

`[FADED]` Model: NaHCO₃ (matches the existing ledger visual `[V-27a-03]`). Your turn: CaCO₃ as a `table`-mode scaffold ledger.

**Model — "Worked: baking soda, NaHCO₃"**
- Na · "1 × 22.99 = 22.99" · *why:* "No subscript means one."
- H · "1 × 1.01 = 1.01"
- C · "1 × 12.01 = 12.01"
- O · "3 × 16.00 = 48.00" · *why:* "The subscript belongs to oxygen alone — three oxygens, one of everything else."
- Sum · "**84.01 g/mol**" · *why:* "Add the products, not the atomic masses."

**Your turn — "Now: chalk, CaCO₃"** (ledger cells; blanks numeric)
- Ca (blank, answer 40.08, tol 0.02) — wrong feedback: "Read calcium's mass straight off the table: 40.08. One calcium."
- C (blank, answer 12.01, tol 0.02)
- O (blank, answer 48.00, tol 0.02) — wrong feedback: "The ₃ multiplies: 3 × 16.00. Forgetting a subscript is the classic error in this entire topic."
- Sum (blank, answer 100.09, tol 0.05) — right feedback: "100.09 g/mol. One mole of chalk is about a hundred grams — a number you can hold."

## s-predict
`[GATE]` — existing scale-reasoning prompt converts to choice mode (pull wording from the built page).

## s-exam · Sucrose
Existing prompt stays. `[GATE]` free/numeric commit before the mark scheme shows; add a scaffold `table` ledger for C₁₂H₂₂O₁₁ (blanks: 12 × 12.01 = 144.12 · 22 × 1.01 = 22.22 · 11 × 16.00 = 176.00 · sum **342.34 g/mol**) as the self-check the student fills *after* committing a written answer.

---

# LESSON 2-7b · Mole Conversions

## s-hero
`[VIS → V-27b-01]` three-node conversion hub (T0). ⚑ Check overlap with the implemented `s-map` diagram before building; if `s-map` already shows the hub, skip V-27b-01 entirely.

## s-da · Dimensional analysis
`[VIS → V-27b-02]` two-step conversion chain, worked, H₂O (T0 — the worked half of the faded pair below renders as this diagram).

`[FADED]` Model: 9.01 g H₂O → molecules. Your turn: 22.0 g CO₂ → molecules.

**Model — "Worked: how many molecules in 9.01 g of water?"**
- Step 1 · Destination check → "Grams → molecules. No direct road exists; the route runs through moles." · *why:* "Moles is always the middle stop."
- Step 2 · Grams → moles → "9.01 g × (1 mol / 18.02 g) = 0.500 mol." · *why:* "Molar mass goes on the bottom so grams cancels. If the units don't cancel, the fraction is upside down."
- Step 3 · Moles → molecules → "0.500 mol × (6.022 × 10²³ / 1 mol) = 3.01 × 10²³ molecules." · *why:* "Avogadro's number rides on top this time — mol has to cancel."

**Your turn — "Now: how many molecules in 22.0 g of CO₂?"**
- Step 1 (blank · numeric, answer 44.01, tol 0.02): "Molar mass of CO₂?" — wrong feedback: "12.01 + 2 × 16.00. The subscript is on the oxygen."
- Step 2 (blank · numeric, answer 0.500, tol 0.005): "Moles of CO₂?" — wrong feedback: "22.0 g × (1 mol / 44.01 g). Grams on the bottom, so grams dies."
- Step 3 (blank · choice): "Which factor converts moles to molecules?" — options: **"× (6.022 × 10²³ molecules / 1 mol)"** ✓ → "Mol on the bottom cancels the mol you're holding." / "× (1 mol / 6.022 × 10²³ molecules)" → "Flip it — this one *creates* mol² and strands you. The unit you're killing goes on the bottom."
- Step 4 (blank · numeric, answer 3.01e23 — accept "3.01 × 10²³" text-equivalent per widget numeric-sci handling): "Molecules?" — right feedback: "3.01 × 10²³ — the same count as the water problem, from a completely different mass. The count and the mass are different questions; the mole is the translator."

## s-predict
`[GATE]` — existing prompt to choice mode (pull wording from built page).

## s-explain / s-exam
Existing self-explain and exam stand; `[GATE]` free mode on both (unify self-explain under commit-reveal free mode per INTERACTION_SPEC §3.1).

---

# LESSON 2-7c · Stoichiometry & BCA Tables *(newly covered — was skipped in v1)*

## s-hero
`[PROSE]` — replacement (existing is formal):

> A balanced equation is a recipe written in moles. And like any recipe, the ingredients you actually have almost never match it — something runs out first, and when it does, the whole reaction stops, no matter how much of everything else is left. The BCA table (Before, Change, After) is the bookkeeping that tells you what runs out, what you'll make, and what's left sitting in the container.

## s-recipe
Existing sandwich prose is good — keep. `[VIS → V-27c-01]` recipe-ratio particle panel (T0): 5 cheese + 6 bread → 3 sandwiches + 2 cheese left over, drawn as countable particles beside the CH₄ + 2 O₂ mole ratio. Caption: `coefficients are a ratio, not an inventory`

## s-bca
Existing prose stays. `[SCAFFOLD → V-27c-02]` table mode, after the worked 2.0/4.0 example:

**"Your turn: 1.0 mol CH₄ meets 3.0 mol O₂"** — grid for CH₄ + 2 O₂ → CO₂ + 2 H₂O:
- Before row (given): 1.0 · 3.0 · 0 · 0
- Change row (blanks · numeric): **−1.0** (wrong feedback: "All 1.0 mol of methane can react — check whether the oxygen on hand covers it: 1.0 mol CH₄ needs 2.0, and 3.0 is available.") · **−2.0** (wrong feedback: "The Change row obeys the coefficients, not the starting amounts: 1 CH₄ : 2 O₂.") · **+1.0** · **+2.0**
- After row (blanks · numeric): **0** · **1.0** (wrong feedback: "3.0 before, 2.0 consumed. The leftover is the excess reactant, sitting there unreacted.") · **1.0** · **2.0**
- Right-on-completion feedback: "Notice what the Change row did: −1, −2, +1, +2 — the coefficients, scaled. Before is whatever you dumped in; Change is never negotiable."

## s-limiting
Existing prose stays (light voice pass permitted; content unchanged).

## s-predict
`[GATE]` drill mode, 2 items (existing prompts, now gated):

**Item 1** — Prompt: "You mix 3.0 mol CH₄ with 4.0 mol O₂ (CH₄ + 2 O₂ → CO₂ + 2 H₂O). Which runs out first?"
- "CH₄" → "Check the demand: 3.0 mol CH₄ would demand 6.0 mol O₂. Is 6.0 on hand?"
- **"O₂"** ✓ → "3.0 mol of methane demands 6.0 mol of oxygen; only 4.0 exists. Oxygen dies first and takes the reaction with it — 1.0 mol of CH₄ never gets to react."

**Item 2** — Prompt: "Same mixture. Maximum H₂O produced?"
- "3.0 mol" → "You scaled off the methane — but methane isn't in charge. The limiting reactant sets every Change value."
- **"4.0 mol"** ✓ → "O₂ : H₂O runs 2 : 2. Consuming all 4.0 mol of O₂ produces exactly 4.0 mol of H₂O, and the extra methane contributes nothing."
- "6.0 mol" → "That's the water you'd get if all the methane reacted — it can't. The oxygen runs out first."

## s-exam
Existing prompt and mark scheme stay. `[GATE]` free mode, minChars 60, plus an optional empty BCA scaffold (table mode, all Change/After cells blank, Before given: 1.50 · 2.00 · 0 · 0) the student may fill as their shown work. Answer key per existing mark scheme: O₂ limiting; 2.00 mol H₂O; 0.50 mol CH₄ remaining.

---

# LESSON C-RXN · Reaction Types & Balancing

## s-hero
`[VIS → V-crxn-01]` 2 Na + Cl₂ → 2 NaCl particle reaction (T1, steppable: before → rearrangement → after, atom-inventory ledger visible and constant across states).

## s-types · Six reaction types
`[VIS → V-crxn-02]` — **DECISION RESOLVED: tabbed card** (the v1 Option B). Six tabs; each tab's full content:

1. **Synthesis** · pattern `A + B → AB` · example `2 Mg + O₂ → 2 MgO` · signature: "two things walk in, one thing walks out."
2. **Decomposition** · pattern `AB → A + B` · example `2 H₂O₂ → 2 H₂O + O₂` · signature: "one reactant, multiple products — usually needs heat or a spark to kick it apart."
3. **Single replacement** · pattern `A + BC → AC + B` · example `Zn + CuSO₄ → ZnSO₄ + Cu` · signature: "a lone element on each side of the arrow — one element shoved another out of its compound."
4. **Double replacement** · pattern `AB + CD → AD + CB` · example `AgNO₃ + NaCl → AgCl + NaNO₃` · signature: "two compounds swap partners — watch for a precipitate dropping out of solution."
5. **Combustion** · pattern `fuel + O₂ → CO₂ + H₂O` · example `C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O` · signature: "O₂ on the left, CO₂ and H₂O on the right. If those three appear, it's combustion, full stop."
6. **Acid–base neutralization** · pattern `acid + base → salt + water` · example `HCl + NaOH → NaCl + H₂O` · signature: "an H-first compound meets an -OH compound; water always forms."

`[GATE]` drill mode after the tabs — "Classify these six" (one at a time, running tally). Items, correct type, and wrong-answer feedback template ("Name the signature you see before you pick: what's alone, what swapped, what's O₂ doing there?"):
1. `2 K + Br₂ → 2 KBr` → synthesis
2. `CaCO₃ → CaO + CO₂` → decomposition
3. `Fe + CuCl₂ → FeCl₂ + Cu` → single replacement
4. `BaCl₂ + Na₂SO₄ → BaSO₄ + 2 NaCl` → double replacement
5. `CH₄ + 2 O₂ → CO₂ + 2 H₂O` → combustion
6. `H₂SO₄ + 2 KOH → K₂SO₄ + 2 H₂O` → neutralization

## s-law · Locking subscripts → balancing walkthrough
`[STEPBUILD → V-crxn-03]` — **DECISION RESOLVED: step-through** for CH₄ + O₂ → CO₂ + H₂O:

- **Step 1** — state: unbalanced equation, ledger C 1=1 ✓ · H 4≠2 ✗ · O 2≠3 ✗. Q: "Two elements are broken. Which do you fix first?"
  - **"H — it appears in only one product"** ✓ → "Fix the elements with one home on each side first. Oxygen lives in *two* products, so every other change moves it — save it for last."
  - "O — it's the most broken" → "Oxygen appears in both products, so it shifts every time you touch anything else. Fixing it first means fixing it twice. Corner it last."
- **Step 2** — state: highlighting the H imbalance. Q: "Four H on the left, two on the right. The legal move?"
  - **"Put a coefficient 2 in front of H₂O"** ✓ → "Coefficients multiply whole molecules — now there are two waters carrying four H."
  - "Change H₂O to H₄O" → "That's a different substance — you just balanced an equation for a chemical that doesn't exist. Subscripts are locked; they *define* the molecule. Coefficients are the only dial you get."
  - "Put a coefficient 2 in front of CH₄" → "That balances H by breaking C (2 ≠ 1). Touch the side that's short, and prefer the molecule that doesn't disturb an element you've already fixed."
- **Step 3** — state: CH₄ + O₂ → CO₂ + 2 H₂O, ledger H 4=4 ✓ · O 2≠4 ✗. Q: "Oxygen: 2 on the left, 4 on the right. The move?"
  - **"Coefficient 2 in front of O₂"** ✓ → "Four O supplied, four demanded. And it touched nothing else — this is why oxygen went last."
  - "Coefficient 2 in front of CO₂" → "That fixes O by breaking C — and re-breaking things you already fixed is the treadmill this ordering exists to avoid."
- **Step 4** — state: 1 CH₄ + 2 O₂ → 1 CO₂ + 2 H₂O, full ledger green. Q: "Final audit?"
  - **"C 1=1 · H 4=4 · O 4=4 — balanced"** ✓
  - "Not yet — CH₄ has no coefficient" → "A blank coefficient is a 1. The ledger is the test, and every row reads equal."
- **Finale:** "The whole discipline in one line: coefficients balance the ledger, subscripts define the molecules, and you never, ever touch a subscript."

## s-predict / s-exam
`[GATE]` — existing coefficient-prediction and thermal-decomposition exam prompts convert to commit mode (numeric/choice for coefficients; free mode for the exam, minChars 40).

---

# LESSON C-SPA · Structure → Property → Argument

## s-hero
`[VIS → V-cspa-01]` five-step argument chain (T0). `[VIS → V-cspa-02]` **new zoom (T3)** ⚑: roti prata cross-section, flaky layers (macro) → one fat layer between two dough sheets (meso) → straight saturated chains packed tight, LDF dashes (particulate). ⚑ Blocked on David's verification of the lamination/steam mechanism against the Unit 2 phenomenon materials — do not build until signed off.

## s-argument · Scientific arguments
`[PROSE]` — replace the list-style description with the worked chain:

> The five-step argument isn't a checklist — it's a chain, and every link has to visibly hang from the one above it. Here it is run end-to-end on a real design question: why solid shortening beats liquid oil for roti prata.
>
> **Structural feature.** Shortening is mostly saturated fat: straight, single-bonded carbon chains. Canola oil is mostly unsaturated: every double bond locks a permanent kink into the chain.
>
> **IMF strength.** Straight chains lie against each other along their whole length — maximum contact, strong London dispersion forces between chains. Kinked chains can't line up; the gaps gut the LDF.
>
> **Macroscopic property.** Strong LDF takes more thermal energy to overcome, so shortening is solid at room temperature. Canola's weak LDF gives way at 20 °C — it's already liquid.
>
> **Material function.** ⚑ Folding dough over *solid* fat keeps the layers physically separated through folding and early cooking; as it cooks, the fat melts and steam forms between the layers — that separation is the flakiness. *(⚑ mechanism pending verification against Unit 2 materials.)*
>
> **Design trade-off.** Swap in liquid oil and it soaks straight into the dough. No separation, no layers: the prata comes off the tawa flat, dense, and oily. Healthier fat, ruined texture — the substitution trades one for the other, and a complete argument says so out loud.

## s-predict · Stearic vs. oleic
`[GATE]` choice.

- Prompt: "Stearic acid: saturated, straight 18-carbon chain. Oleic acid: same 18 carbons, one double-bond kink. Which has the stronger intermolecular forces?"
- Options:
  - **"Stearic"** ✓ → "Straight chains pack flush — contact along the full length, strong LDF. The kink in oleic props its molecules apart, and LDF dies with distance. Melting points: 69 °C vs. 13 °C. One kink, 56 degrees."
  - "Oleic — the double bond is stronger" → "The double bond is stronger — *inside* the molecule. But melting is about the forces *between* molecules, and the kink that double bond creates wrecks the packing that LDF depends on. Fifty-six degrees of difference, in stearic's favor."
- Reveal: the explicit four-line chain (structure → packing/IMF → property → verification with both melting points).

## s-explorer
Note for the build session: the existing argument-builder in this interactive is the prototype of the scaffold widget's `bank` mode. When this lesson is touched, refactor it to consume `data-widget="scaffold"` rather than bespoke code. No content change.

## s-exam · Write the complete argument
`[SCAFFOLD → V-cspa-03]` — **v1's "not a digital fillable form" is reversed.** Free mode, five slots with chain connectors, each with its own model answer (drawn from the existing mark scheme):

- Slot 1 · **Structural feature** · model: "Shortening/butter is built from saturated fatty acids with straight, single-bonded carbon chains; canola oil is built from unsaturated fatty acids whose double bonds put rigid, permanent kinks in the chains."
- Slot 2 · **Molecular packing** · model: "Straight chains pack tightly side by side along their full length; kinked chains can't align, leaving gaps between molecules."
- Slot 3 · **IMF strength (⚑ the linking mark)** · model: "Tight packing maximizes contact area and therefore the London dispersion forces between chains; the gaps between kinked chains sharply weaken those forces. (This link — packing to LDF strength — is the mark students most often drop.)"
- Slot 4 · **Macroscopic property** · model: "Stronger LDF takes more thermal energy to overcome, so the saturated fat is solid at room temperature; the weaker forces in canola leave it liquid."
- Slot 5 · **Function & trade-off** · model: "Solid fat separates the dough layers and supports the structure that makes the pastry flaky; liquid oil soaks in, the layers merge, and the result is flat, dense, and greasy — a healthier fat profile bought at the cost of the texture."

Self-score line (keep the existing one verbatim beneath the scaffold).

---

# CROSS-CUTTING · Tooltip / Glossary

No change from the standing plan: the term list and the 50+ definitions ship in the glossary infrastructure session already drafted. One addition to the term list from newly covered content — **2-7c:** stoichiometry, limiting reactant, excess reactant, BCA table, mole ratio, coefficient (shared with C-RXN).

---

*End of v2. Every string above is shippable as written; edit freely before loading into project knowledge.*
