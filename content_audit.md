# Chemistry Interactive Text: Comprehensive Content Audit

This document contains a full audit of all text, diagrams, and interactives across all 11 lessons built in the Chemistry Interactive Text project. It flags sections that do not have any visual diagrams or interactive builders to identify opportunities for further content development.


---

## 📖 Lesson 1-1a: Atomic Structure & Electron Configuration

**Filename:** [lessons/1-1a_atomic-structure-electron-config.html](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/1-1a_atomic-structure-electron-config.html)

### Section 01: Opening
**Section ID:** `s-hero`

#### 📝 Prose & Questions:
- Prose: Fluorine (configuration 2, 7) will tear an electron off almost anything it touches. Add one electron and you get the configuration of neon (2, 8) — which does essentially nothing. The two are neighbors, one electron apart, and that single electron — and the shell it sits in — is the whole story. This page is about reading an atom from its structure: building its shells, writing its configuration, and counting the few electrons that actually do chemistry.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 02: The parts that matter - Most of an atom never does chemistry. A handful of electrons do all of it.
**Section ID:** `s-parts`

#### 📝 Prose & Questions:
- Prose: An atom is almost entirely empty space around a tiny, dense nucleus of protons (and neutrons). The proton count — the atomic number, Z — is the atom's fingerprint: change it and you have a different element. The electrons live in shells at set distances out from the nucleus, filling from the inside out.
- Prose: Here's the part worth holding onto: the inner electrons are locked away, doing nothing chemically. Only the electrons in the outermost shell — the valence electrons — get close enough to another atom to be lost, gained, or shared. When you predict how an element behaves, you are almost always reasoning about that outer shell alone.
- Prose: The one idea to hold onto
- Prose: An atom's chemistry is almost entirely about its outermost electrons. Everything on this page — building the shells, writing the configuration, counting valence — is in service of finding and reading that outer shell.
- Prose: Neutrons add mass but no charge, and they don't touch the electron arrangement — so they don't change how an element bonds or reacts. Atoms of one element that differ only in neutron count are isotopes. They matter for mass and nuclear behavior, not for the chemistry on this page, which is why we set them aside here and reason from protons and electrons.

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (Caption: *● inner electron · ● valence electron · fluorine, 2 + 7*)


### Section 03: Build any atom - Step through the elements. Watch the shells fill — and read the configuration straight off the diagram.
**Section ID:** `s-builder`

#### 📝 Prose & Questions:
- Prose: Electrons fill from the inside out: the first shell holds 2, the next 8. Step up one proton at a time and watch each new electron find its place. The valence electrons — the outer shell — stay in the accent color. The shell configuration is just the count in each shell, written out.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Bohr model · Z = 1 → 36 H C Na Cl Ca Br*)


### Section 04: The K → Ga wrinkle - After calcium, the next electrons don't go where you'd guess.
**Section ID:** `s-wrinkle`

#### 📝 Prose & Questions:
- Prose: The first three shells fill in the tidy way you'd expect: 2, then 8, then 8 — taking you from hydrogen to argon. But the third shell isn't actually full at 8; it can hold up to 18. So why does potassium start a fourth shell before the third is finished?
- Prose: Because at that point the fourth shell sits at slightly lower energy than the rest of the third, so the next electrons go there first. Potassium and calcium open shell four (…8, 1 and …8, 2). Only then does the third shell go back and fill from 8 up to 18 — that whole stretch is the transition metals — before the fourth shell picks up again at gallium.
- Prose: Fourth shell opens with one electron, even though the third shell is sitting at only 8 of its possible 18.
- Prose: Fourth shell takes its second electron. The third shell still hasn't grown.
- Prose: Now the third shell finally starts expanding past 8 — the transition metals (Sc–Zn) fill it up to 18 before gallium continues the fourth.
- Prose: Two transition metals break even this pattern: chromium (2, 8, 13, 1) and copper (2, 8, 18, 1) each pull one electron down from the fourth shell into the third, because a half-full or completely full third shell is a touch more stable. You don't need to predict these — just don't be thrown when the builder shows a lone electron in the outer shell where you expected two.
- Prose: Why this matters for you
- Prose: For the elements you'll reason about most — the main-group ones — valence is still a clean count of the outer shell. The wrinkle is exactly why the transition metals get set aside: their outer-shell count doesn't track their chemistry the simple way.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 05: Predict: gain or lose?
**Section ID:** `s-predict-val`

#### 📝 Prose & Questions:
- Prediction Prompt: Sulfur's configuration is 2, 8, 6. To reach a full outer shell, what is sulfur most likely to do?
- Prose: Sulfur gains 2. A full outer shell here is 8 electrons. Sulfur already has 6, so it is far closer to a full shell by gaining 2 than by losing all 6 — moving two electrons is cheaper than moving six. So sulfur tends to pull in two electrons, becoming the ion S²⁻ with the configuration 2, 8, 8. The rule of thumb: an atom takes the shortest path to a full outer shell.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 06: What the count predicts - The number of valence electrons tells you what the atom wants to do.
**Section ID:** `s-valence`

#### 📝 Prose & Questions:
- Prose: Atoms are most stable with a full outer shell — 8 valence electrons for most main-group elements (just 2 for the first row, hydrogen and helium). Everything an atom "wants" is the shortest route to that full shell, and the valence count tells you the route.
- Prose: 1–3 valence electrons → the atom loses them. Shedding a few is the short path to the full shell underneath. These are the metals; the fewer it has to lose, the more reactive (Group 1 are the eager ones).
- Prose: 5–7 valence electrons → the atom gains the rest. Pulling in one or two completes the octet. These are the reactive nonmetals; needing just one (Group 17) makes them the grabbiest.
- Prose: 8 valence electrons → the atom does nothing. The shell is already full, so there's no reason to lose or gain. These are the noble gases, and that's exactly why they're inert.
- Prose: This is the why under the next page
- Prose: Whether an atom loses or gains — and how easily — is the engine behind every reactivity trend in 1-1b. The trends there (radius, ionization energy, electronegativity) are just this idea, measured and mapped across the table.

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (Caption: *• inner · • valence · ο electron gained · the goal is always a full outer shell*)


### Section 07: Write it yourself - Given the element, produce the configuration from memory.
**Section ID:** `s-selftest`

#### 📝 Prose & Questions:
- Prose: No diagram this time — write the shell configuration and the valence count yourself, then check. Separate the shells however you like (2, 8, 7 or 2 8 7 both work). Reading a diagram is recognition; producing the configuration is the skill that actually gets tested.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Configuration self-test · main-group New element →*)


### Section 08: Recall: fill the blanks - Fill the blanks from memory.
**Section ID:** `s-recall`

#### 📝 Prose & Questions:
- Recall: Stuck on one? Tap Reveal. The point is to pull it from your head, not recognize it on a page.
- Recall: The number of protons in the nucleus is the , and it sets the element's identity. Electrons fill shells from the inside out: the first shell holds and the second holds . The electrons in the outermost shell are called the electrons, and they are the ones that react. An atom with 1–3 of them tends to them, while an atom with 5–7 tends to electrons — both routes toward a full outer shell of .

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 09: Self-explain
**Section ID:** `s-selfx`

#### 📝 Prose & Questions:
- Prose: All the elements in a single column (group) of the table behave remarkably alike — lithium, sodium, and potassium are all soft, reactive metals. In your own words, why does a column share chemistry?
- Prose: No one's grading this. Writing the reasoning out is what moves it from "I recognize it" to "I can produce it." Then peek and compare.
- Prose: What decides an element's chemistry is its number of valence electrons, not its total. Every element in a group has the same number of valence electrons — that's what defines the column. Lithium (2, 1), sodium (2, 8, 1), and potassium (2, 8, 8, 1) all have exactly one outer electron, so all three "want" the same thing: to lose that one electron and reach a full shell. Same valence count → same tendency → same chemistry. The shells underneath change going down the column, which shifts how easily it happens — but not what happens.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 10: Exam practice - Write your answer first. Then grade yourself.
**Section ID:** `s-exam`

#### 📝 Prose & Questions:
- Prose: Give yourself a point for each idea you actually wrote down. The flag (⚑) marks the move that separates a full-credit answer from a partial one.
- Exam: An atom of element X has the electron shell configuration 2, 8, 7. State its number of valence electrons, predict whether it will lose or gain electrons and the charge of the ion it forms, and explain — using the valence count — why it reacts that way. Then name one other element X will behave like, and say why.
- Exam: Mark scheme — 4 marks
- Exam: States 7 valence electrons (the outer shell holds 7).
- Exam: Predicts X will gain 1 electron and form a 1− ion (X⁻).
- Exam: Explains using the count: 7 is one short of a full shell of 8, so gaining one is the shortest path to a full outer shell — cheaper than losing seven. (This reasoning from the valence count is the difference between stating and explaining.)
- Exam: Names a same-group element (F, Cl, Br — any halogen) and notes it behaves alike because it has the same 7 valence electrons.
- Exam: Self-score: 4 = all four · 3 = missing the same-group link · 2 = valence + gain/lose, no reasoning · ≤1 = valence only. (X is chlorine.)

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*



---

## 📖 Lesson 1-1b: Periodic Trends & Reactivity

**Filename:** [lessons/1-1b_periodic-trends-reactivity.html](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/1-1b_periodic-trends-reactivity.html)

### Section 01: Opening
**Section ID:** `s-hero`

#### 📝 Prose & Questions:
- Prose: Drop a pea-sized lump of sodium into water and it skitters, hisses, and bursts into flame. Drop in a copper penny and… nothing. Same periodic table. Different addresses. By the end of this page you'll be able to predict that difference from an element's position alone — before you ever open a bottle.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 02: Why position predicts - An element's address on the table tells you how it behaves.
**Section ID:** `s-position`

#### 📝 Prose & Questions:
- Prose: Every periodic trend comes down to one tug-of-war over the outermost electrons. The positive nucleus pulls them in; distance and the layers of inner electrons push that pull away. Two things change the strength of that tug-of-war — and they line up exactly with the two directions you can move on the table.
- Prose: Each step right adds one proton, but the new electron joins the same shell. More pull at the same distance: the grip tightens and the atom shrinks.
- Prose: Each step down adds a whole new shell. The outer electrons sit farther out and shielded by inner electrons, so the grip loosens and the atom grows.
- Prose: The one idea to hold onto
- Prose: Tighter grip on the outer electrons → smaller atom, harder to remove an electron, stronger pull on shared electrons. Looser grip → all of that, reversed. Everything below is this idea from a different angle.

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (Atom shrinking as protons are added to the same shell) (No caption)
- **[DIAGRAM]** (Atom growing as new shells are added) (No caption)


### Section 03: Atomic level: watch the levers - The same two levers, drawn as atoms.
**Section ID:** `s-atom`

#### 📝 Prose & Questions:
- Prose: Step through the elements and watch what changes. Switch between the two directions to see why one shrinks the atom and the other grows it.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Bohr model · build & step Across a period → Down a group ↓*)


### Section 04: Trend explorer - Pick a property. Watch the table light up.
**Section ID:** `s-explorer`

#### 📝 Prose & Questions:
- Prose: Cool = a low value, hot = a high value. The readout names the direction each property increases. Tap any two elements to compare them head to head.
- Prose: Tap one element, then another.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Periodic table · trend heat-map Atomic radius Ionization energy Electronegativity Reactivity*)


### Section 05: Predict: which is bigger?
**Section ID:** `s-predict-size`

#### 📝 Prose & Questions:
- Prediction Prompt: Sodium (Na) and chlorine (Cl) sit in the same period. Which atom is bigger?
- Prose: Na is bigger. "More protons and electrons" feels like it should mean "bigger," but those extra electrons land in the same shell — and the extra protons pull that shell inward. So across a period the atom shrinks. Cl has seven more protons than Na tugging on that same outer shell, so Cl is the smaller atom even though it's heavier.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 06: The trend that flips - Reactivity isn't one arrow. It depends on whether the atom wants to lose or wants to gain electrons.
**Section ID:** `s-reactivity`

#### 📝 Prose & Questions:
- Prose: Atomic radius, ionization energy (IE), and electronegativity (EN) each run in one consistent direction. Reactivity doesn't — and that's what trips people up. Stop asking "is it reactive?" and start asking "reactive how?"
- Prose: Metals lose electrons. Most reactive where that's easiest — low ionization energy, so down a group and to the left. The alkali metals (Li → Na → K) are the wild ones.
- Prose: Nonmetals gain electrons. Most reactive where the pull is strongest — high electronegativity, so up a group and to the right. Fluorine is the champion.
- Prose: Noble gases barely react. A full outer shell means no reason to lose or gain. The far-right column stays calm.
- Prose: Flip the Reactivity tab above
- Prose: In the explorer, select Reactivity. The coloring splits — metals one way, nonmetals the other — instead of a single gradient.

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (Caption: *Reactivity points two ways — the split is the concept*)


### Section 07: Predict: which is more reactive?
**Section ID:** `s-predict-react`

#### 📝 Prose & Questions:
- Prediction Prompt: Lithium (Li) and potassium (K) are both alkali metals in Group 1. Which reacts more violently with water?
- Prose: K reacts more violently. Metallic reactivity is about how easily the atom lets go of its outer electron. K's valence electron sits in a higher shell — farther out and more shielded than Li's — so its ionization energy is lower and the electron is handed over almost for free. Lower in the group means a looser grip, which means a more violent reaction. (Rubidium and cesium are more dramatic still.)
- Prose: Size and density are real properties, but they aren't what drives this reaction — the ease of losing the electron is.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 08: From position to the label - This is why you can read a hazard off the table — before you ever see the bottle.
**Section ID:** `s-hazard`

#### 📝 Prose & Questions:
- Prose: Back to where we started — and now the address explains it. At the single-particle level: sodium's one outer electron is barely held (its ionization energy is the lowest in its period), so it leaves with almost no push. That eagerness to lose an electron is what makes sodium tear into water. Copper — a transition metal, outside our main-group scope — holds its electrons far more tightly, so it just sits there.
- Prose: Bottom-left metals → flagged reactive or water-reactive. Top-right nonmetals (fluorine, chlorine) → corrosive, aggressive oxidizers. Far-right noble gases → inert and safe. Position first, label second.
- Prose: The limit — say it out loud
- Prose: Position predicts intrinsic reactivity — what an element tends to do. It does not tell you concentration, quantity, or context. A trace behind glass can be safe; a drum of a "mild" element may not be. The table predicts the tendency, not the situation.

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (Caption: *● electron · ● valence electron (leaving) · sodium gives up one electron almost for free*)


### Section 09: Recall: fill the blanks - Fill the blanks from memory.
**Section ID:** `s-recall`

#### 📝 Prose & Questions:
- Recall: Stuck on one? Tap Reveal. The point is to pull it from your head, not recognize it on a page.
- Recall: Moving across a period, each atom gains a proton in the same shell, so atomic radius and ionization energy . Moving down a group, each atom adds a new shell, so the outer electrons are held more . Metals are most reactive at the of the table because they lose electrons most easily, while the single most reactive nonmetal is .

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 10: Self-explain
**Section ID:** `s-selfx`

#### 📝 Prose & Questions:
- Prose: Ionization energy increases across a period but decreases down a group. In your own words, why do those two directions go opposite ways?
- Prose: No one's grading this. Writing the reasoning out is what moves it from "I recognize it" to "I can produce it." Then peek and compare.
- Prose: Ionization energy is the energy needed to rip off an outer electron, so it tracks how tightly that electron is held. Across a period, protons pile up in the same shell — the pull tightens, the electron is harder to remove, so it rises. Down a group, the outer electron sits in a new, farther shell and is shielded by inner electrons — the pull loosens, the electron leaves more easily, so it drops. Same tug-of-war, two different things changing.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 11: Exam practice - Write your answer first. Then grade yourself.
**Section ID:** `s-exam`

#### 📝 Prose & Questions:
- Prose: Give yourself a point for each idea you actually wrote down. The flag (⚑) marks the move that separates a full-credit answer from a partial one.
- Exam: Rubidium (Rb) sits directly below potassium (K) in Group 1. Predict whether Rb or K reacts more vigorously with water, and explain your reasoning using periodic trends. Then state one thing this prediction does not tell you about handling the actual substance.
- Exam: Mark scheme — 4 marks
- Exam: States Rb reacts more vigorously than K.
- Exam: Rb is lower in the group → its valence electron is in a higher shell, farther from the nucleus and more shielded.
- Exam: Links this to a lower ionization energy → the electron is lost more easily → a more vigorous reaction. (This causal link is the difference between describing and explaining.)
- Exam: Names a real limit: the trend predicts intrinsic reactivity, not quantity, concentration, or storage conditions.
- Exam: Self-score: 4 = all four · 3 = missing the limit · 2 = prediction + position, no IE link · ≤1 = prediction only.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*



---

## 📖 Lesson 1-2a: Bonding & Electronegativity

**Filename:** [lessons/1-2a_bonding-electronegativity.html](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/1-2a_bonding-electronegativity.html)

### Section 01: Opening
**Section ID:** `s-hero`

#### 📝 Prose & Questions:
- Prose: In middle school, chemical bonds are often drawn as solid lines or sticks connecting balls. In reality, a bond is a balance of electrical charges. Opposites attract, likes repel, and electrons are caught in a tug-of-war. By the end of this page, you'll be able to use an element's position to predict exactly how it shares its valence electrons — and what type of bond it forms.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 02: Origin of the force - What actually holds two atoms together?
**Section ID:** `s-forces`

#### 📝 Prose & Questions:
- Prose: A chemical bond is not a physical joint or glue. It is a push or pull between charges — an electrostatic force. Every atom has a positive nucleus (protons) and a cloud of negative electrons. When two atoms get close, they experience both attraction and repulsion:
- Prose: Opposite charges pull together. Each positive nucleus attracts the negative electrons of the neighboring atom. This attraction pulls the atoms closer.
- Prose: Like charges push apart. As they get too close, the two positive nuclei repel each other, and the negative electron clouds repel each other.
- Prose: A stable balance. A bond forms at the exact distance where the attractive pulls are maximized and the repulson pushes are minimized. The atoms settle into this lowest-energy state.

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (Caption: *● nucleus (+) · ● electron (−) · Green = Attraction (opposite charges) · Red = Repulsion (like charges)*)


### Section 03: The electronegativity tug-of-war - How do different atoms share? It depends on their electronegativity.
**Section ID:** `s-tug`

#### 📝 Prose & Questions:
- Prose: Not all atoms pull on electrons with the same strength. An atom's power to attract shared electrons is called its electronegativity. Small, tight atoms with many protons (like fluorine) have very high electronegativity. Large atoms with shielded outer shells (like sodium) have very low electronegativity.
- Prose: When two atoms bond, the difference in their pulling power — the electronegativity difference (ΔEN) — decides exactly where the shared electrons spend their time, resulting in one of four bond types:
- Prose: Equal sharing. Two nonmetals with similar strength (ΔEN < 0.5). Electrons spend equal time between the two nuclei. A nonpolar covalent bond has no charge separation.
- Prose: Unequal sharing. Two nonmetals with mismatched strength (0.5 ≤ ΔEN < 1.7). The hungrier atom pulls electrons closer, creating a partial negative charge (δ−) on itself and leaving a partial positive charge (δ+) on the other. This is a polar covalent bond.
- Prose: Electron transfer. A metal (low EN) and a nonmetal (high EN) with a huge strength mismatch (ΔEN ≥ 1.7). The nonmetal rips the electron completely away, forming positive and negative ions held together by attraction. This is an ionic bond.
- Prose: Delocalized sea. Two metal atoms (both low EN). Neither atom holds its outer electrons tightly, so they let go. The valence electrons float free among a grid of positive metal cores. This shared attraction is a metallic bond, and the electrons form a delocalized sea of electrons.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 04: Interactive bond explorer - Select two elements. Watch their bond form.
**Section ID:** `s-interactive`

#### 📝 Prose & Questions:
- Prose: Pick Element A and Element B from the list. The explorer reads their electronegativities, calculates the difference (ΔEN), predicts the bond, and renders the electrostatic arrangement at the atomic level.
- Prose: Choose one element in each dropdown to build a bond. The tug-of-war will calculate in real time.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Bond explorer · Z = 1 → 36 Select two elements below...*)


### Section 05: Predict: test your intuition
**Section ID:** `s-predict`

#### 📝 Prose & Questions:
- Prediction Prompt: Carbon (C, EN = 2.55) and hydrogen (H, EN = 2.20) are both nonmetals. What type of bond holds a carbon-hydrogen (C–H) bond together in methane (CH4)?
- Prose: C-H is nonpolar covalent. The electronegativity difference is ΔEN = 2.55 − 2.20 = 0.35. Since 0.35 is less than the 0.5 threshold, the electrostatic pull from both nuclei is nearly equal. They share the electrons almost perfectly in the middle. This is why organic compounds like oils and fats (made of C-H bonds) are completely nonpolar and do not mix with water.
- Prediction Prompt: Hydrogen (H, EN = 2.20) and fluorine (F, EN = 3.98) react to form hydrogen fluoride (HF, ΔEN = 1.78). Both are nonmetals. What type of bond is this?
- Prose: H-F is polar covalent. This is a key boundary case. The 1.7 threshold is a guideline, not a strict law. Because hydrogen and fluorine are both nonmetals, they both have a strong pull on electrons (high ionization energies), meaning neither wants to let go completely to form separate ions. They still share the electrons (making it covalent), though fluorine pulls them so hard that the bond is extremely polar and holds a massive charge separation.
- Prediction Prompt: Copper (Cu, EN = 1.90) and zinc (Zn, EN = 1.65) are melted together to form brass. What type of bond holds the copper and zinc atoms together in the solid alloy?
- Prose: It is a metallic bond. Both copper and zinc are metal atoms with relatively low electronegativities. Because neither nucleus pulls strongly enough to keep its outer electrons locked in place, their valence shells merge and the electrons flow freely throughout the metal lattice. This shared attraction holds the alloy together, making brass malleable and highly conductive.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 06: Recall: fill the blanks - Fill the blanks from memory.
**Section ID:** `s-recall`

#### 📝 Prose & Questions:
- Recall: Can't remember the details? Tap Reveal. The physical act of retrieval is what makes it stick.
- Recall: A chemical bond is actually an force of attraction between the positive nuclei and negative electrons. An atom's power to pull shared electrons is its . When two nonmetals share electrons equally, they form a bond. If sharing is unequal, the bond is , which creates partial charges. When a metal and a nonmetal bond, electrons are fully to form ions in an bond. When metals bond together, their loose outer electrons form a delocalized in a bond.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 07: Self-explain
**Section ID:** `s-selfx`

#### 📝 Prose & Questions:
- Prose: In your own words, explain how the electronegativities of two metal atoms lead to the formation of a "sea of electrons" instead of an ionic or covalent bond.
- Prose: Writing it out forces your brain to organize the concept. Write your answer first, then peek and compare.
- Prose: Metals have low electronegativity, meaning their nuclei exert a very weak grip on their valence electrons. When metal atoms get close to each other, neither atom is strong enough to keep its outer electrons locked locally (ruling out covalent sharing) or strong enough to strip them from the neighbor (ruling out ionic transfer). As a result, the valence electrons escape their parent shells and flow freely as a delocalized sea of electrons, attracting all the positive metal cores together like a fluid electrostatic glue.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 08: Exam practice - Write your answer first. Then grade yourself.
**Section ID:** `s-exam`

#### 📝 Prose & Questions:
- Prose: Give yourself a point for each key concept you wrote down. The flag (⚑) marks the step that separates a complete description from a partial one.
- Exam: Explain the molecular-level difference in electrical force and electron behavior between a covalent bond in water (H2O) and a metallic bond in aluminum (Al). Contrast where the valence electrons live and how the electrostatic force holds each substance together, linking it to electronegativities. Then name one macroscopic physical property of aluminum that results from this difference.
- Exam: Mark scheme — 4 marks
- Exam: Describes covalent bonding in water: valence electrons are localized and shared between specific hydrogen and oxygen nuclei.
- Exam: Describes metallic bonding in aluminum: valence electrons are delocalized and shared freely as a "sea" flowing around a lattice of positive aluminum cations.
- Exam: Links this to electronegativity: oxygen and hydrogen are nonmetals with high EN that hold onto and pull electrons locally; aluminum consists of metal atoms with low EN that let their valence electrons drift free. (This chemical reasoning is the difference between describing and explaining.)
- Exam: Identifies a correct macroscopic property of aluminum: electrical conductivity (free-flowing electrons carry current), thermal conductivity, or malleability/ductility (atoms can slide past each other in the fluid sea without breaking the bond).
- Exam: Self-score: 4 = all four · 3 = missing the EN explanation · 2 = described both bonds but omitted EN and properties · ≤1 = simple definition of one bond type.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*



---

## 📖 Lesson 1-3a: Lewis Structures

**Filename:** [lessons/1-3a_lewis-structures.html](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/1-3a_lewis-structures.html)

### Section 01: Opening
**Section ID:** `s-hero`

#### 📝 Prose & Questions:
- Prose: Individual atoms of nonmetals are unstable and reactive because their outer electron shells are incomplete. To become stable, they share valence electrons, forming a network of attraction that holds them together. To model and predict this electron sharing, we use a simple, two-dimensional map of dots and lines. By the end of this page, you'll be able to draw these maps for any simple molecule — and check them for octet stability.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 02: Why atoms share - The drive toward stability.
**Section ID:** `s-sharing`

#### 📝 Prose & Questions:
- Prose: Think of two volatile gases: hydrogen (H2) and oxygen (O2). Spark them, and they react violently to form water (H2O) — a stable, calm liquid. The explanation lives in their outer shell configurations. Atoms are at their lowest energy and most stable when their outermost electron shell is completely filled.
- Prose: For most main-group elements, a full outer shell requires 8 valence electrons. This chemical tendency is the octet rule (hydrogen is the main exception, seeking only 2 valence electrons to fill its first and only shell, a tendency called the duet rule). Since nonmetal atoms are both highly electronegative, neither can strip electrons completely from the other. Instead, they share pairs of valence electrons to satisfy their octets.
- Prose: To model this sharing visually, we represent the outer-shell electrons as dots around the element's chemical symbol, drawing lines to show shared electron pairs. This two-dimensional diagram is a Lewis structure (or Lewis dot diagram).

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (Caption: *● valence electron dot · water (H2O) has two single bonds and two lone pairs*)


### Section 03: Lewis structure lab - The Lewis Structure Lab
**Section ID:** `s-lab`

#### 📝 Prose & Questions:
- Prose: Select a molecule from the list. Click on the bonds (dashes) to cycle through Single, Double, Triple, or No bonds. Click on the atoms (letters) to cycle through lone pairs (up to 3 pairs). Satisfy the target electron count and all octet/duet rules, then verify.
- Prose: Oxygen acts as the central atom, bonding to two hydrogen atoms. Oxygen needs 8 outer electrons to satisfy its octet, while hydrogen needs only 2 (duet).

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Molecule Canvas Select Molecule: Hydrogen (H₂) Hydrogen Fluoride (HF) Water (H₂O) Ammonia (NH₃) Methane (CH₄) Oxygen (O₂) Nitrogen (N₂) Carbon Dioxide (CO₂) Carbon Tetrafluoride (CF₄)*)


### Section 04: Predict: counting practice
**Section ID:** `s-predict`

#### 📝 Prose & Questions:
- Prediction Prompt: Formaldehyde (CH2O) is a toxic chemical used to preserve specimens. Carbon is the central atom. How many total valence electrons must be drawn in its Lewis structure?
- Prose: Total valence = 12 electrons. Carbon (Group 14) has 4. Oxygen (Group 16) has 6. Each hydrogen has 1. Math: 4 + 6 + (2 × 1) = 12. If your finished Lewis structure uses 10 or 14 electrons, it is chemically impossible for formaldehyde.
- Prediction Prompt: Methanol (CH3OH) has the skeleton shown below. The carbon has 4 single bonds, and oxygen is bonded to carbon and hydrogen. How many lone pairs must sit on the oxygen atom to satisfy the octet rule? H — C(H)₂ — O — H
- Prose: Oxygen needs 2 lone pairs. In the skeleton, oxygen shares two single bonds (one to carbon, one to hydrogen). This gives oxygen 4 shared electrons around it. To satisfy the octet rule (8 electrons total), oxygen needs 4 more electrons, which must sit as 2 unshared lone pairs. Carbon has 4 single bonds (8 electrons, full octet), and all hydrogens have 1 single bond (2 electrons, full duet).

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 05: Recall: fill the blanks - Fill the blanks from memory.
**Section ID:** `s-recall`

#### 📝 Prose & Questions:
- Recall: Stuck on one? Tap Reveal. Active recall is the best way to move concepts into long-term memory.
- Recall: The chemical tendency of atoms to seek a full outermost shell of 8 electrons is the . Hydrogen is the exception, seeking only 2 electrons to fill its shell, which is the . Valence electrons that are not shared in a bond sit as pairs of dots, called . A single line represents a , which shares 2 electrons. Carbon dioxide uses two pairs of lines to connect carbon to oxygen, forming a , sharing electrons total in each bond. Nitrogen gas uses three shared pairs, forming a .

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 06: Self-explain
**Section ID:** `s-selfx`

#### 📝 Prose & Questions:
- Prose: Why can hydrogen never act as the central atom in a Lewis structure, and why can it never form double or triple bonds?
- Prose: Explain it in plain English. Writing it out creates stronger memory hooks than just thinking about it.
- Prose: Hydrogen's valence shell is the very first energy level, which has a maximum capacity of only 2 electrons (the duet rule). A single covalent bond already shares 2 electrons, which completely fills hydrogen's outer shell. Forming double or triple bonds, or making hydrogen a central atom (which requires bonding to at least two other atoms, i.e., sharing 4 or more electrons), would force hydrogen to hold more than 2 electrons, violating its shell limit.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 07: Exam practice - Write your answer first. Then grade yourself.
**Section ID:** `s-exam`

#### 📝 Prose & Questions:
- Prose: Give yourself a point for each idea you actually wrote down. The flag (⚑) marks the step that separates a complete answer from a partial one.
- Exam: Nitrogen trichloride (NCl3) is a reactive, yellow oil. State its total number of valence electrons, predict its molecular arrangement (which atom sits in the center), and explain — using the octet rule — how many single bonds and lone pairs must sit on the central nitrogen atom in its correct Lewis structure.
- Exam: Mark scheme — 4 marks
- Exam: Calculates 26 total valence electrons: Nitrogen has 5; each Chlorine has 7. Math: 5 + (3 × 7) = 26.
- Exam: Identifies Nitrogen as the central atom (it is less electronegative than chlorine and forms the most bonds; chlorine atoms connect around it).
- Exam: Explains Nitrogen's octet: Nitrogen needs 8 electrons. It forms 3 single bonds (sharing 6 electrons with the three chlorines) and holds 1 lone pair (2 unshared electrons) to satisfy the octet rule. (This clear numerical mapping is the difference between guessing and demonstrating structural reasoning.)
- Exam: Details the Chlorines: Each of the three Chlorine atoms forms a single bond and holds 3 lone pairs (6 electrons) to satisfy its own octet.
- Exam: Self-score: 4 = all four · 3 = missing chlorine details · 2 = valence count + nitrogen bonds, no EN/octet explanation · ≤1 = valence count only.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*



---

## 📖 Lesson 1-3b: IMFs & Properties

**Filename:** [lessons/1-3b_imfs-properties.html](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/1-3b_imfs-properties.html)

### Section 01: Opening
**Section ID:** `s-hero`

#### 📝 Prose & Questions:
- Prose: Covalent bonds hold individual molecules together, but they do not decide if a substance is a solid, liquid, or gas at room temperature. That role belongs to the electrostatic forces of attraction between neighboring molecules. By the end of this page, you'll be able to identify the three types of intermolecular forces, rank substances by their strength, and predict bulk physical properties like boiling point, vapor pressure, and solubility.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 02: Bonds vs IMFs - Inside the molecule vs between them.
**Section ID:** `s-attraction`

#### 📝 Prose & Questions:
- Prose: To understand molecular behavior, we must distinguish between two very different electrical forces. The strong covalent bonds holding the hydrogen and oxygen atoms together inside a single water molecule are intramolecular bonds. These require massive chemical energy to break.
- Prose: In contrast, the relatively weak electrical attractions that pull separate, neighboring water molecules toward one another are intermolecular forces (commonly abbreviated as IMFs). These are the forces you overcome during physical phase changes.
- Prose: When you boil a kettle of water, the steam rising from the spout is still H2O. You have not broken the covalent bonds to separate hydrogen and oxygen gas. You have only added enough thermal energy to break the weak IMFs, letting individual water molecules escape from each other into the air.

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (Caption: *Solid lines = strong intramolecular covalent bonds · Dashed line = weak intermolecular attraction*)


### Section 03: The three IMF types - The electrostatic hierarchy.
**Section ID:** `s-types`

#### 📝 Prose & Questions:
- Prose: Covalent substances experience three primary types of intermolecular forces. They are all electrostatic (opposite charges attracting), but they differ in how their charges are created and how long they last.
- Prose: Temporary, induced dipoles. Electrons are in constant motion. By chance, they occasionally bunch up on one side of a molecule, creating a brief, temporary partial negative charge (δ−) and leaving the other side positive (δ+). This temporary dipole repels electrons in a neighboring molecule, inducing a matching dipole. The resulting weak attraction is a London dispersion force (or LDF). LDF is present in all molecules. Larger electron clouds (heavier atoms or more atoms) shift more easily, leading to stronger LDF.
- Prose: Permanent polar attractions. If two nonmetals have mismatched electronegativities, they share electrons unequally. This permanent polar bond creates permanent partial charges (δ+ and δ−). When polar molecules get close, they align so their opposite poles attract. This permanent electrostatic pull is a dipole-dipole force.
- Prose: Super-charged polar attraction. When hydrogen is bonded directly to nitrogen, oxygen, or fluorine (the three most electronegative elements, which also carry highly concentrated lone pairs), the electronegativity difference is massive. The electronegative atom pulls the shared electron density almost entirely away, leaving hydrogen's single proton completely unshielded. This bare, highly positive hydrogen attracts a negative lone pair on a neighboring molecule's N, O, or F. Despite the name, hydrogen bonding is not a true chemical bond; it is a very strong intermolecular force.

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (London dispersion forces diagram: temporary dipole shifts in two adjacent neutral atoms.) (No caption)
- **[DIAGRAM]** (Dipole-dipole forces diagram: permanent polar alignment of two HCl molecules.) (No caption)
- **[DIAGRAM]** (Hydrogen bonding diagram: attraction between hydrogen of one water molecule and the lone pair of oxygen on another.) (No caption)


### Section 04: IMF & phase lab - Intermolecular forces & phase transitions.
**Section ID:** `s-interactive`

#### 📝 Prose & Questions:
- Prose: Select a substance. Slide the temperature slider from Cool (Solid) to Hot (Gas). Watch how the electrostatic attractions (dashed lines) respond to molecular movement while the chemical bonds (solid lines) remain unchanged.
- Prose: Carbon dioxide is nonpolar and only attracts neighbors via weak London dispersion forces. It sublimes directly to gas at standard pressure because its attractions are easily overcome by minimal thermal energy.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Phase & IMF Lab Carbon Dioxide (CO₂) Acetone (C₃H₆O) Water (H₂O)*)


### Section 05: Bulk scale evidence - How we measure the invisible.
**Section ID:** `s-bulk`

#### 📝 Prose & Questions:
- Prose: Because we cannot see individual molecules, we must infer their electrostatic attraction by running macroscopic investigations. Two classic laboratory tests gather this evidence: evaporation cooling curves and surface tension beads.
- Prose: When a liquid evaporates, it absorbs energy from its surroundings to break its IMFs. The faster it evaporates, the more rapidly it cools. A thermometer bulb wrapped in a soaked tissue will register a temperature drop. Liquids with weaker IMFs evaporate much faster, creating steeper temperature drops.
- Prose: Molecules on the surface of a liquid are pulled inward by attractions from neighboring molecules below them. This inward force is surface tension. When placed on a flat coin, water molecules pull on each other so strongly that they bead up into a high, rounded dome. Acetone, with weaker forces, spreads out flat and spills off the edge.

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (Caption: *Bulk scale cooling: Weaker IMFs ➔ steeper temperature drop from rapid evaporation*)
- **[DIAGRAM]** (Caption: *Water's strong hydrogen bonds pull the droplet inward to form a sphere*)


### Section 06: Predict: ranking properties
**Section ID:** `s-predict`

#### 📝 Prose & Questions:
- Prediction Prompt: Consider three molecules of similar size: methane (CH₄, nonpolar), hydrogen chloride (HCl, polar), and ammonia (NH₃, polar with N–H bonds). Rank them in order of increasing boiling point.
- Prose: CH₄ (LDF, weakest) < HCl (Dipole-Dipole, moderate) < NH₃ (Hydrogen bonding, strongest). Because methane is nonpolar, its molecules are attracted only by weak London dispersion forces. It boils at a very low −161°C. Polar HCl molecules align to pull dipole-to-dipole, boiling at −85°C. Ammonia's polar N–H bonds form strong hydrogen bonds, requiring the most thermal energy to break, leading to a boiling point of −33°C.
- Prediction Prompt: Hexane (C₆H₁₄) is a completely nonpolar solvent found in gasoline. If you drop a nonpolar oil stain into water (polar) and into hexane (nonpolar), where will the oil dissolve?
- Prose: Oil only dissolves in hexane. The chemical rule of solubility is "like dissolves like." Polar water molecules are attracted to each other by strong hydrogen bonds, which squeeze nonpolar oil molecules out of the way (they cannot form favorable attractions with oil). Nonpolar hexane molecules interact with nonpolar oil molecules via LDF, letting them mix freely. This is why water alone cannot wash grease off your hands.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 07: Recall: fill the blanks - Fill the blanks from memory.
**Section ID:** `s-recall`

#### 📝 Prose & Questions:
- Recall: Stuck on a term? Tap Reveal. Memory retention requires active recall practice.
- Recall: Covalent bonds inside a molecule are . The attractions between separate molecules are . Temporary attractions from shifting electron clouds are . Attractions between permanently polar molecules are . The exceptionally strong IMF that forms when hydrogen bonds directly to N, O, or F is . Stronger IMFs hold molecules tighter, leading to a higher but a lower . The inward pull on a liquid's surface that makes water form beads is .

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 08: Self-explain
**Section ID:** `s-selfx`

#### 📝 Prose & Questions:
- Prose: Explain why water (H₂O) has a much higher boiling point than carbon dioxide (CO₂), even though carbon dioxide is a much larger and heavier molecule.
- Prose: Explain it in plain English. Link the types of forces to the energy needed to boil the liquid.
- Prose: Water molecules can form hydrogen bonds (O–H bonds present), which are exceptionally strong intermolecular attractions. Carbon dioxide is a nonpolar molecule and can only form weak London dispersion forces (LDF). Even though CO₂ has a larger electron cloud, its weak LDF are much easier to overcome than water's strong hydrogen bonds, meaning water requires significantly more thermal energy (higher temperature) to boil.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 09: Exam practice - Write your answer first. Then grade yourself.
**Section ID:** `s-exam`

#### 📝 Prose & Questions:
- Prose: Give yourself a point for each idea you actually wrote down. The flag (⚑) marks the step that separates a complete answer from a partial one.
- Exam: Acetone (C₃H₆O) forms dipole-dipole attractions. Ethanol (C₂H₅OH) forms hydrogen bonds. Compare the relative strengths of their intermolecular forces, predict which substance will evaporate more rapidly at room temperature, and explain how this evaporation rate relates to their vapor pressures.
- Exam: Mark scheme — 4 marks
- Exam: Identifies Ethanol forms hydrogen bonds (strongest IMF type) and Acetone forms dipole-dipole forces (moderate IMF type).
- Exam: Predicts Acetone will evaporate more rapidly at room temperature because its weaker intermolecular forces are easier for thermal energy to break.
- Exam: Explains that weaker forces allow more molecules to escape from the liquid surface into the gas phase at a given temperature.
- Exam: Links this to vapor pressure: the greater concentration of gas molecules above the liquid results in a higher vapor pressure for acetone. (Linking the molecular escape rate directly to the pressure exerted by the gas is the key to demonstrating bulk-scale understanding.)
- Exam: Self-score: 4 = all four · 3 = missing the connection to gas pressure · 2 = relative strengths + evaporation prediction, no molecular escape explanation · ≤1 = simple definition of hydrogen bonds/dipole-dipole only.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*



---

## 📖 Lesson 2-2a: Physical vs. Chemical Change & Particle Diagrams

**Filename:** [lessons/2-2a_physical-chemical-change.html](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/2-2a_physical-chemical-change.html)

### Section 01: Opening
**Section ID:** `s-hero`

#### 📝 Prose & Questions:
- Prose: Drop a lump of solid ghee or butter onto a hot tawa. It liquefies, sliding across the metal, but chemically it remains exactly the same fat. Place a piece of raw flatbread dough in the same heat, and it bubbles, puffs, browns, and takes on a completely new aroma. One is a physical phase change; the other is a chemical dance of breaking and forming bonds. This page is about reading that distinction at the particle scale, balancing the equations, and proving that mass is always conserved.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 02: Physical vs. Chemical - The distinction lies entirely in the bonds.
**Section ID:** `s-concept`

#### 📝 Prose & Questions:
- Prose: Every sample of matter is a collection of particles. How we change that sample depends entirely on whether we affect the particles' arrangement, or their internal covalent structures.
- Prose: Before labeling a change, trace the covalent bonds. If the internal bonds holding each molecule together are untouched, the change is a physical change. The particles might speed up, spread out, slide past each other, or intermingle with other substances (like dissolving salt), but they remain the same chemical identity.
- Prose: If covalent bonds break and new ones form to build entirely new combinations of atoms, it is a chemical change. The starting substances (reactants) disappear, and brand-new substances (products) with different physical properties emerge.
- Prose: Concept-First Summary
- Prose: Physical changes rearrange the space and forces between particles (overcoming intermolecular forces). Chemical changes break and form the electronic bonds within the particles (rearranging covalent or ionic bonds).

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 03: Particle Diagrams - How the two changes read in particle panels.
**Section ID:** `s-contrasts`

#### 📝 Prose & Questions:
- Prose: Compare a phase change to a combustion reaction. In the physical change, every molecule remains intact. In the chemical change, the atoms are fully shuffled, but the total number of each atom remains exactly conserved.

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (Caption: *• Hydrogen · • Oxygen · physical rearrangement (molecules stay intact)*)
- **[DIAGRAM]** (Caption: *• Hydrogen · • Oxygen · chemical change (bonds broken and formed, atoms conserved)*)


### Section 04: The Change Lab - Watch the particles rearrange.
**Section ID:** `s-builder`

#### 📝 Prose & Questions:
- Prose: Select a transformation type, then drag the slider to progress the change. Watch the bonds and positions adapt, and verify that every atom is accounted for on the dashboard.
- Prose: Solid ice molecules are highly organized and vibrate in fixed positions. Drag the slider to add heat and watch them slide into liquid and then boil into gas.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Change Lab · Particle Simulation Water Phase Change Dissolving Salt Methane Combustion*)


### Section 05: Conservation & Systems - Where does the mass go in an open system?
**Section ID:** `s-mass`

#### 📝 Prose & Questions:
- Prose: The Law of Conservation of Mass dictates that atoms cannot be created or destroyed. In any closed container, the mass before a physical or chemical change must exactly equal the mass after.
- Prose: But cooking pans, baking ovens, and open beakers are open systems. When you bake bread dough, it loses weight as it bakes. This is not a violation of mass conservation. The heat decomposes leavening agents and boils water, releasing carbon dioxide and steam. In an open system, these gaseous molecules fly out into the room. The atoms are still conserved in the universe, but they are no longer resting on your scale.
- Prose: To prove conservation experimentally, we run the change inside a sealed flask (a closed system). If we mix vinegar and baking soda in a sealed flask, the gas is trapped. The scale shows no change in mass whatsoever, even though gas bubbles form and a new solution emerges. Every atom remains locked inside.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 06: Predict First - Commit to a prediction first.
**Section ID:** `s-predict`

#### 📝 Prose & Questions:
- Prose: 1. Dissolving sugar in water: You stir solid sucrose crystals into water until they disappear. What kind of change is this at the particle level?
- Prose: Sugar molecules separate from each other and intermingle with water molecules, but the covalent bonds holding the carbon, hydrogen, and oxygen atoms together within each sucrose molecule remain completely intact. If you evaporate the water, the solid sugar crystals return unchanged.
- Prose: 2. Mixing vinegar and baking soda: When you mix vinegar (acetic acid) and baking soda (sodium bicarbonate), bubbles of carbon dioxide gas form rapidly and the temperature drops. What kind of change is this?
- Prose: The intense bubbling is gas production (a brand-new substance, CO2, is formed from the atomic rearrangement of bicarbonate and hydrogen ions). Covalent bonds are broken and new ones are built, making this a chemical change.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 07: Recall - Say it back.
**Section ID:** `s-recall`

#### 📝 Prose & Questions:
- Prose: Fill in the blanks to lock in the core terms. Matches are case-insensitive.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Vocabulary Check Fill in the correct chemistry terms. 1. A change that alters the physical state or spacing of particles without breaking covalent bonds is a: 2. A change where bonds break and atoms rearrange to form new substances is a: 3. The starting substances that are consumed in a chemical reaction are: 4. The new substances produced in a chemical reaction are: 5. A reaction system where gases can escape into the atmosphere is called an: Check Answers Reset*)


### Section 08: Self-Explain - Why does flatbread lose mass as it bakes?
**Section ID:** `s-explain`

#### 📝 Prose & Questions:
- Prose: Explain how baking bread on a pan results in a mass loss on the scale, and how this relates to the Law of Conservation of Mass.
- Prose: Baking flatbread dough is a chemical change that releases carbon dioxide and steam from leavening agents and moisture. Because the pan is an open system, these gas molecules escape into the surrounding atmosphere. The mass of the bread remaining on the pan decreases, which is fully consistent with the Law of Conservation of Mass; the 'missing' mass has simply escaped into the air as gas particles, while the total number of atoms in the room remains perfectly unchanged.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Compare with model answer Model Answer Baking flatbread dough is a chemical change that releases carbon dioxide and steam from leavening agents and moisture. Because the pan is an open system, these gas molecules escape into the surrounding atmosphere. The mass of the bread remaining on the pan decreases, which is fully consistent with the Law of Conservation of Mass; the 'missing' mass has simply escaped into the air as gas particles, while the total number of atoms in the room remains perfectly unchanged.*)


### Section 09: Exam Practice - Contrast butter melting vs. dough browning.
**Section ID:** `s-exam`

#### 📝 Prose & Questions:
- Prose: Give yourself a point for each idea you actually wrote down. The flag (⚑) marks the key conceptual move.
- Exam: A chef heats solid butter/ghee on a pan, melting it. In another pan, they bake bread dough, browning the crust. Contrast these two processes: classify each change, describe what happens to the covalent bonds and intermolecular forces in each, and explain how the Law of Conservation of Mass applies to both.
- Exam: Mark Scheme — 4 marks
- Exam: Classifies the melting fat as a physical change, and the browning dough as a chemical change.
- Exam: Explains that melting fat only overcomes weak intermolecular forces (molecules stay intact), whereas chemical browning breaks and forms covalent bonds to create new substances.
- Exam: States that atoms are conserved in both processes (none created or destroyed) so the mass of all atoms involved remains constant.
- Exam: Links the apparent mass loss of the dough to an open system where escaping gas molecules (steam, CO2) leave the pan. (⚑ This connection is required for full credit.)
- Exam: Self-score: 4 = all four points · 3 = missing the open system connection · 2 = classification and conservation only · ≤1 = classification only.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*



---

## 📖 Lesson 2-7a: The Mole & Molar Mass

**Filename:** [lessons/2-7a_the-mole-molar-mass.html](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/2-7a_the-mole-molar-mass.html)

### Section 01: Opening
**Section ID:** `s-hero`

#### 📝 Prose & Questions:
- Prose: Pour a teaspoon of baking soda onto a scale. It weighs exactly 4.2 grams. But how many individual sodium hydrogen carbonate molecules are sitting on that metal pan? How do chemists count out reactant particles to ensure none are wasted? By the end of this page you will understand the giant counting unit known as the mole, calculate the molar mass of any formula, and bridge the sub-microscopic scale of atoms to the macroscopic scale of the lab.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 02: The Mole Concept - The mole is just a massive dozen.
**Section ID:** `s-dozen`

#### 📝 Prose & Questions:
- Prose: If you bake flatbread or make cookies, you don't count out individual grains of flour or sugar. You buy them by the kilogram, or count eggs by the dozen. We use macroscopic quantities because individual particles are too small to handle.
- Prose: Atoms are so tiny that a single drop of water contains more of them than there are grains of sand on Earth. To handle these quantities, chemists use a giant counting unit called the mole (abbreviated as mol). Just as a dozen represents exactly 12 items, a mole represents exactly Avogadro's number:
- Prose: 1 mol = 6.022 × 10²³ particles
- Prose: This is our bridge of Scale, Proportion & Quantity (CCC3). A mole is not a weight; it is a count. One mole of helium gas contains 6.022 × 10²³ atoms, and one mole of xenon gas contains 6.022 × 10²³ atoms. Because xenon atoms are much larger and contain more protons and neutrons, a mole of xenon will weigh much more than a mole of helium—but the count of gas particles in each container is identical.
- Prose: A simple dozen analogy
- Prose: A dozen chicken eggs and a dozen ostrich eggs both contain exactly 12 eggs. However, the dozen ostrich eggs will weigh significantly more. In chemistry, a mole of water molecules (H₂O) and a mole of baking soda molecules (NaHCO₃) both contain exactly 6.022 × 10²³ molecules, but their masses are very different.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 03: Molar Mass - Scaling up the periodic table.
**Section ID:** `s-molarmass`

#### 📝 Prose & Questions:
- Prose: Look at any element cell on the periodic table. The number at the bottom is the average atomic mass of a single atom, measured in atomic mass units (amu). By mathematical design, Avogadro's number is the exact factor needed to scale this microscopic mass into grams:
- Prose: 1 atom of Carbon-12 = 12.00 amu → 1 mole of Carbon-12 = 12.00 grams
- Prose: This means the atomic mass of any element in amu is numerically identical to the mass of one mole of that element in grams. We call this the molar mass, measured in grams per mole (g/mol).
- Prose: To find the molar mass of any compound, you sum the molar masses of its constituent atoms using the subscripts in the chemical formula:

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 04: Molar Mass Builder - Build a formula. Calculate the mass.
**Section ID:** `s-builder`

#### 📝 Prose & Questions:
- Prose: Select a preset molecule or type any chemical formula in the input box. The tool will parse the formula, calculate the step-by-step molar mass, and sketch the particle cluster.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Formula Parser · Calculator Water Carbon Dioxide Table Salt Baking Soda Methane Glucose*)


### Section 05: Recipe Scaling - Recipe ratios vs. chemical mole ratios.
**Section ID:** `s-scale`

#### 📝 Prose & Questions:
- Prose: Avogadro's number is a scaling factor, but the relative proportions never change as you scale. This is the heart of Scale, Proportion & Quantity (CCC3).
- Prose: A kitchen recipe lists proportions (e.g. 3 cups of flour to 1 cup of water, a 3:1 ratio). If you scale the recipe up to bake a single small loaf, or enough loaves to feed a whole school, you must keep the water-to-flour ratio exactly 3:1. If you shift the ratio, the texture collapses.
- Prose: Similarly, a chemical formula is an atomic recipe (e.g., H₂O requires 2 hydrogen atoms for every 1 oxygen atom, a 2:1 ratio). When you scale this recipe up to one mole, you have exactly 2 moles of hydrogen atoms (1.204 × 10²⁴) and 1 mole of oxygen atoms (6.022 × 10²³). The scale increases by 6.022 × 10²³, but the proportion of Hydrogen to Oxygen remains exactly 2:1.
- Prose: Why we use moles
- Prose: Because atoms are too small to count, we scale the chemical recipe up by one mole so we can weigh the proportions in grams. Molar mass is the conversion tool that lets us translate our chemical counting recipe into a scale reading.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 06: Predict First - Test your scale reasoning.
**Section ID:** `s-predict`

#### 📝 Prose & Questions:
- Prose: 1. Comparing Mole Counts: You weigh out 1.0 mole of Water (H₂O, molar mass 18.02 g/mol) and 1.0 mole of Glucose (C₆H₁₂O₆, molar mass 180.16 g/mol) in separate containers. Which container has more molecules?
- Prose: A mole is a count unit. Since both beakers contain exactly 1.0 mole of molecules, they both contain exactly 6.022 × 10²³ molecules. Because glucose molecules contain many more atoms and protons/neutrons, the glucose beaker weighs 10 times more—but the counting number of molecules is identical.
- Prose: 2. Molar Mass of Carbon Dioxide: Methane (CH₄) has a molar mass of 16.05 g/mol. Carbon dioxide (CO₂) has a molar mass of 44.01 g/mol. Which element causes CO₂ to be so much heavier than CH₄?
- Prose: Both compounds contain exactly one Carbon atom, which contributes 12.01 g/mol to both. The massive difference comes from the other atoms: Methane has 4 Hydrogen atoms (4 × 1.01 = 4.04 g/mol), while Carbon Dioxide has 2 Oxygen atoms (2 × 16.00 = 32.00 g/mol). Oxygen atoms are 16 times heavier than Hydrogen atoms.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 07: Recall - Say it back.
**Section ID:** `s-recall`

#### 📝 Prose & Questions:
- Prose: Fill in the blanks to lock in the core terms. Matches are case-insensitive.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Vocabulary Check Fill in the correct stoichiometric units. 1. The chemical counting unit that represents 6.022 × 10²³ particles is the: 2. The exact number 6.022 × 10²³ is known as: 3. The mass of one mole of a chemical substance is its: 4. The standard unit used to measure molar mass is: 5. The cross-cutting concept that connects microscopic count to macroscopic mass is: Check Answers Reset*)


### Section 08: Self-Explain - Dozen eggs vs. Dozen watermelons.
**Section ID:** `s-explain`

#### 📝 Prose & Questions:
- Prose: Using the analogy of a dozen chicken eggs vs. a dozen watermelons, explain why 1 mole of hydrogen gas (H2) has a completely different mass than 1 mole of carbon dioxide gas (CO2), even though both contain the exact same number of molecules.
- Prose: A mole is a counting unit representing exactly 6.022 × 10²³ particles, just as a dozen represents exactly 12 items. A dozen watermelons has a much larger mass than a dozen chicken eggs because an individual watermelon is much heavier than a chicken egg. Similarly, 1 mole of CO₂ has a much larger mass than 1 mole of H₂ because a single CO₂ molecule is much more massive (containing carbon and two oxygens) than a single H₂ molecule (containing only two hydrogens), despite the particle count being identical in both cases.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Compare with model answer Model Answer A mole is a counting unit representing exactly 6.022 × 10²³ particles, just as a dozen represents exactly 12 items. A dozen watermelons has a much larger mass than a dozen chicken eggs because an individual watermelon is much heavier than a chicken egg. Similarly, 1 mole of CO₂ has a much larger mass than 1 mole of H₂ because a single CO₂ molecule is much more massive (containing carbon and two oxygens) than a single H₂ molecule (containing only two hydrogens), despite the particle count being identical in both cases.*)


### Section 09: Exam Practice - Calculate compound molar mass.
**Section ID:** `s-exam`

#### 📝 Prose & Questions:
- Prose: Give yourself a point for each idea you actually wrote down. The flag (⚑) marks the key conceptual definition.
- Exam: Calculate the molar mass of sucrose (C12H22O11). Show all step-by-step arithmetic, listing the element counts and atomic masses used. Then, in one sentence, explain what this value physically represents.
- Exam: Mark Scheme — 3 marks
- Exam: Shows the correct multiplication of element counts and atomic masses: C (12 × 12.01), H (22 × 1.01), and O (11 × 16.00).
- Exam: Calculates the correct final sum: 342.34 g/mol (accept 342 to 343 depending on decimal precision).
- Exam: Explains that the value represents the mass in grams of exactly 1 mole (6.022 × 10²³ molecules) of sucrose. (⚑ This connection between mass and the molecular count is required for full credit.)
- Exam: Self-score: 3 = all three points · 2 = arithmetic only, missing or vague physical definition · 1 = setup only with calculation error.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*



---

## 📖 Lesson 2-7b: Mole Conversions

**Filename:** [lessons/2-7b_mole-conversions.html](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/2-7b_mole-conversions.html)

### Section 01: Opening
**Section ID:** `s-hero`

#### 📝 Prose & Questions:
- Prose: In the lab, scales read in grams, but chemical equations "speak" in moles. How do we convert back and forth between what we can weigh and what the atoms require? We use a simple conversion map, and the foolproof method of dimensional analysis. If you set up the fractions so that the units cancel, the math will balance itself.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 02: The Mole Map - Mole is always the central hub.
**Section ID:** `s-map`

#### 📝 Prose & Questions:
- Prose: To convert chemical quantities in the laboratory, you must follow one golden rule: always convert through the mole. The mole is the common counting language of chemistry, connecting the microscopic count to the macroscopic weight.
- Prose: This relationship forms our Mole Map. If you start with a mass in grams and want to find moles, or if you start with moles and want to find mass, the molar mass is the conversion factor bridge.

#### 🎨 Diagrams & Interactives:
- **[DIAGRAM]** (Mole map diagram showing grams converting to moles by dividing by molar mass, and moles converting to grams by multiplying.) (No caption)


### Section 03: Dimensional Analysis - Let the units do the work.
**Section ID:** `s-da`

#### 📝 Prose & Questions:
- Prose: Rather than memorizing when to multiply or divide, we use dimensional analysis (the factor-label method). You treat units like algebraic variables: any unit in a numerator divided by the same unit in a denominator cancels out, leaving only the desired unit behind.
- Prose: A conversion factor is written as a fraction. Because one mole of Water (H₂O) is exactly equal to 18.02 grams, we can write two conversion factor fractions that both equal 1:
- Prose: 1 mol H₂O18.02 g H₂O or 18.02 g H₂O1 mol H₂O
- Prose: To convert 36.04 grams of water to moles, you choose the fraction that puts the unwanted unit (grams) in the denominator to cancel the starting grams:
- Prose: 36.04 g H₂O × 1 mol H₂O18.02 g H₂O = 2.00 mol H₂O
- Prose: Because the starting unit (g H₂O) and the denominator unit cancel, you are left with `mol H₂O`. The units prove that the setup is correct before you ever punch the numbers into a calculator.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 04: Conversion Builder - Set up the math. Watch the units cancel.
**Section ID:** `s-builder`

#### 📝 Prose & Questions:
- Prose: Select the conversion factor card that correctly cancels the starting unit. Drag or click the card to slot it in, and check if the math balances.
- Prose: Loading problem...
- Prose: Click one of the cards below to choose a conversion factor. Look for the card that puts the starting unit in the denominator so they cancel out.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Dimensional Analysis · Unit Solver Problem 1 of 5*)


### Section 05: Predict First - Predict the scale outcome.
**Section ID:** `s-predict`

#### 📝 Prose & Questions:
- Prose: 1. Mass of 2.50 moles of water: One mole of water has a mass of 18.02 grams. If you measure out exactly 2.50 moles of water, what will the scale read?
- Prose: To convert moles to grams, you multiply by the molar mass: 2.50 mol H₂O × (18.02 g H₂O / 1 mol H₂O) = 45.05 g H₂O The moles units cancel out, leaving grams.
- Prose: 2. Moles in a carbon sample: A sample of pure charcoal contains 36.03 grams of Carbon (molar mass 12.01 g/mol). How many moles of Carbon atoms are in this sample?
- Prose: To convert grams to moles, you divide by the molar mass: 36.03 g Carbon × (1 mol Carbon / 12.01 g Carbon) = 3.00 mol Carbon The grams units cancel, leaving moles.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 06: Recall - Say it back.
**Section ID:** `s-recall`

#### 📝 Prose & Questions:
- Prose: Fill in the blanks to lock in the core terms. Matches are case-insensitive.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Vocabulary Check Fill in the conversion terms. 1. The mathematical method of using fractions to cancel units is: 2. The central hub of all stoichiometric calculations is the: 3. A fraction where the numerator and denominator represent equal amounts in different units is a: 4. To cancel a unit on a starting value, the conversion factor must place that unit in the: Check Answers Reset*)


### Section 07: Self-Explain - Why do we cancel units?
**Section ID:** `s-explain`

#### 📝 Prose & Questions:
- Prose: Explain how treating units as algebraic variables guarantees that you don't accidentally multiply when you should divide during mole conversions.
- Prose: Treating units as algebraic variables ensures that you place the conversion units in the correct positions (numerator or denominator) so that unwanted units cancel out. If you set up a conversion incorrectly—for example, multiplying grams by grams/mole instead of mole/grams—the units will not cancel and will instead result in a nonsense unit (like g²/mol). Tracking unit cancelation mathematically guarantees that the final remaining unit is the one you are solving for, preventing calculation direction errors.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Compare with model answer Model Answer Treating units as algebraic variables ensures that you place the conversion units in the correct positions (numerator or denominator) so that unwanted units cancel out. If you set up a conversion incorrectly—for example, multiplying grams by grams/mole instead of mole/grams—the units will not cancel and will instead result in a nonsense unit (like g²/mol). Tracking unit cancelation mathematically guarantees that the final remaining unit is the one you are solving for, preventing calculation direction errors.*)


### Section 08: Exam Practice - Solve with dimensional analysis.
**Section ID:** `s-exam`

#### 📝 Prose & Questions:
- Prose: Give yourself a point for each idea you actually wrote down. The flag (⚑) marks the critical unit tracking step.
- Exam: A recipe requires exactly 126.02 grams of sodium bicarbonate (NaHCO3, molar mass 84.01 g/mol). Calculate the moles of NaHCO3 required, showing your complete dimensional analysis setup with all conversion units and unit cancelations clearly written out.
- Exam: Mark Scheme — 3 marks
- Exam: Writes the starting value with units (126.02 g NaHCO₃).
- Exam: Shows the conversion factor set up with grams in the denominator (× 1 mol NaHCO₃ / 84.01 g NaHCO₃), showing the cancelation of the grams units. (⚑ This dimensional analysis unit layout is required for full credit.)
- Exam: Calculates the correct final value with proper units: 1.500 moles of NaHCO₃ (accept 1.500 mol or 1.50 mol NaHCO₃).
- Exam: Self-score: 3 = all three points · 2 = calculated 1.5 mol but missing unit cancelation marks in setup · 1 = calculated 1.5 mol with no setup shown.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*



---

## 📖 Lesson 2-7c: Stoichiometry & BCA Tables

**Filename:** [lessons/2-7c_stoichiometry.html](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/2-7c_stoichiometry.html)

### Section 01: Opening
**Section ID:** `s-hero`

#### 📝 Prose & Questions:
- Prose: A balanced chemical equation is a microscopic recipe. In the laboratory, however, we rarely mix reactants in the exact ratio they require. One reactant will inevitably run out first, bringing the entire reaction to a halt. To keep track of reactant consumption and product generation, we use a simple framework called a BCA (Before-Change-After) table. By focusing on moles and stoichiometric coefficients, you can predict exactly how much product will form and what will be left over.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 02: The Recipe Ratio - Coefficients are scaling factors.
**Section ID:** `s-recipe`

#### 📝 Prose & Questions:
- Prose: Think of a recipe for a sandwich: 1 slice of cheese + 2 slices of bread → 1 sandwich. The ratio of cheese to bread is strictly 1:2. If you have 5 slices of cheese and 6 slices of bread, you cannot make 5 sandwiches—you will run out of bread after making 3 sandwiches, leaving 2 slices of cheese unused.
- Prose: In chemistry, the coefficients of a balanced equation represent this exact same proportion, but measured in moles. Consider the combustion of methane gas:
- Prose: This equation tells us that 1 mole of methane requires 2 moles of oxygen gas to react completely, producing 1 mole of carbon dioxide and 2 moles of water. This is our mole ratio. It is a scaling multiplier. If you react 3 moles of CH4, you will need exactly 6 moles of O2, and you will produce 3 moles of CO2 and 6 moles of H2O.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 03: BCA Tables - The accounting table of chemistry.
**Section ID:** `s-bca`

#### 📝 Prose & Questions:
- Prose: To calculate reaction yields systematically, we set up a BCA table (Before, Change, After). Unlike math equations, a BCA table tracks the quantities of all substances at the same time:
- Prose: Before (B): The starting mole quantities of reactants placed into the container before the reaction begins (products start at 0).
- Prose: Change (C): The moles consumed (negative for reactants) or produced (positive for products). Crucially, the values in this row must scale in the exact ratio of the chemical equation coefficients.
- Prose: After (A): The final mole quantities remaining when the reaction finishes (Before + Change).
- Prose: Let's look at a balanced BCA table where 2.0 moles of CH4 and 4.0 moles of O2 are mixed. Because they are mixed in the exact 1:2 ratio, both reactants are fully consumed:
- Prose: Notice that the Change row values (-2.0, -4.0, +2.0, +4.0) match the 1:2:1:2 coefficient ratio of the chemical equation. In chemistry, reactants are consumed, and products are built, in locked step.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 04: Limiting Reactants - The limiting reactant sets the limit.
**Section ID:** `s-limiting`

#### 📝 Prose & Questions:
- Prose: What happens if you mix 2.0 moles of CH4 with 5.0 moles of O2? You do not have enough methane to react with all of the oxygen. Methane will run out first.
- Prose: The reactant that is completely consumed first is the limiting reactant. It limits how much product can form. The reactant that remains after the reaction halts is the excess reactant.
- Prose: To find the limiting reactant using a BCA table, you test which reactant would hit 0 first if fully consumed. The one that yields the smaller Change row multiplier is your limiting reactant. Once it hits 0 in the After row, the reaction stops, and the remaining excess reactant sits in the container unchanged.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 05: BCA Simulator - Slide progress. Watch the atoms rearrange.
**Section ID:** `s-simulator`

#### 📝 Prose & Questions:
- Prose: Adjust the starting moles of Methane (CH4) and Oxygen (O2) below. Slide the Reaction Progress slider to watch the molecules combust, and track the mole counts in the BCA table in real-time.
- Prose: Slide the Reaction Progress bar to begin the reaction. Watch how reactant molecules in the chamber collide, tear apart, and assemble into CO2 and H2O.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Methane Combustion: CH 4 + 2 O 2 → CO 2 + 2 H 2 O*)


### Section 06: Predict First - Predict the reaction yield.
**Section ID:** `s-predict`

#### 📝 Prose & Questions:
- Prose: 1. Limiting Reactant Setup: You mix 3.0 moles of CH4 with 4.0 moles of O2. According to the reaction recipe (CH4 + 2 O2 → CO2 + 2 H2O), which reactant is limiting and will run out first?
- Prose: Each mole of methane requires 2 moles of oxygen. To react all 3.0 moles of CH4, you would need 6.0 moles of O2. Because you only have 4.0 moles of O2, the oxygen will run out first. Methane is in excess (1.0 mole of CH4 will remain unreacted).
- Prose: 2. Product Yield: In the same mixture (3.0 moles of CH4 and 4.0 moles of O2), what is the maximum amount of water (H2O) that can be produced?
- Prose: Because O2 is limiting, the reaction stops when all 4.0 moles of O2 are consumed. The coefficient ratio between O2 and H2O is 2:2 (or 1:1). Therefore, consuming 4.0 moles of O2 produces exactly 4.0 moles of H2O. (The excess methane does not contribute to further yield).

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 07: Recall - Say it back.
**Section ID:** `s-recall`

#### 📝 Prose & Questions:
- Prose: Fill in the blanks to lock in the core terms. Matches are case-insensitive.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Stoichiometry Vocabulary Fill in the terms. 1. The study of quantitative relationships in chemical reactions is: 2. The reactant that is completely consumed and limits the yield of product is the: 3. The reactant that is left over after a chemical reaction halts is the: 4. In a BCA table, the letter B stands for: 5. The values in the Change row of a BCA table must match the ratio of the equation's: Check Answers Reset*)


### Section 08: Self-Explain - Why scale the Change row?
**Section ID:** `s-explain`

#### 📝 Prose & Questions:
- Prose: Why must the Change (C) row values in a BCA table scale in the exact ratio of the chemical equation coefficients, even if the starting Before (B) row does not?
- Prose: The Before (B) row represents whatever random amounts of reactants are experimentally mixed together. However, molecules can only react on an individual, microscopic level according to the stoichiometry of the balanced chemical equation. Atoms rearrange in locked molecular proportions: for example, every 1 molecule of CH4 that reacts requires exactly 2 molecules of O2 to form 1 CO2 and 2 H2O. Because the reaction progress occurs strictly according to these recipe proportions, the Change (C) row—which represents the amounts actually reacting and forming—must scale in the exact ratio of the coefficients.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Compare with model answer Model Answer The Before (B) row represents whatever random amounts of reactants are experimentally mixed together. However, molecules can only react on an individual, microscopic level according to the stoichiometry of the balanced chemical equation. Atoms rearrange in locked molecular proportions: for example, every 1 molecule of CH 4 that reacts requires exactly 2 molecules of O 2 to form 1 CO 2 and 2 H 2 O. Because the reaction progress occurs strictly according to these recipe proportions, the Change (C) row—which represents the amounts actually reacting and forming—must scale in the exact ratio of the coefficients.*)


### Section 09: Exam Practice - Solve a limiting reactant problem.
**Section ID:** `s-exam`

#### 📝 Prose & Questions:
- Prose: Give yourself a point for each idea you actually wrote down. The flag (⚑) marks the limiting reactant check.
- Exam: A mixture contains 1.50 moles of methane (CH4) and 2.00 moles of oxygen (O2) gas. They react according to the equation: CH4 + 2 O2 → CO2 + 2 H2O. Identify the limiting reactant, calculate the maximum moles of H2O produced, and state the moles of excess reactant that will remain unreacted at the end of the reaction. Show all work (e.g., a sketch of a BCA table).
- Exam: Mark Scheme — 4 marks
- Exam: Sets up a BCA table or equivalent mathematical comparison showing starting values: Before: CH4 = 1.50 mol, O2 = 2.00 mol, H2O = 0 mol.
- Exam: Identifies O2 as the limiting reactant because 1.50 mol CH4 requires 3.00 mol O2, but only 2.00 mol are available (or shows that O2 runs out first under a Change multiplier of 1.00x). (⚑ Identifying the limiting reactant by comparing requirement to availability is required for this mark.)
- Exam: Calculates the correct water yield: 2.00 moles of H2O (derived from consuming 2.00 moles of O2 in a 2:2 ratio).
- Exam: Calculates the correct remaining excess reactant: 0.50 moles of CH4 (Before 1.50 mol - Change 1.00 mol = After 0.50 mol).
- Exam: Self-score: 4 = all four points · 3 = correct values but setup/limiting comparison is missing/unclear · 2 = identified limiting reactant but calculated incorrect products.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*



---

## 📖 Lesson C-RXN: Reaction Types & Balancing

**Filename:** [lessons/C-RXN_reaction-types-balancing.html](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/C-RXN_reaction-types-balancing.html)

### Section 01: Opening
**Section ID:** `s-hero`

#### 📝 Prose & Questions:
- Prose: A chemical reaction is not a magical creation; it is an atomic remodeling project. Bonds break, elements separate, and new structures assemble—but the starting building blocks never vanish. The Law of Conservation of Mass dictates that every single atom present before a reaction must remain afterward. To model this, we balance chemical equations with molecular coefficients. In this lesson, you will learn to categorize chemical changes into six distinct patterns and balance molecular equations visually.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 02: Six Reaction Types - Six blueprints of rearrangement.
**Section ID:** `s-types`

#### 📝 Prose & Questions:
- Prose: Rather than memorizing millions of unique chemical reactions, chemists categorize reactions into a few core blueprints. By looking at how the reactants are combined, you can predict what kind of products will form.
- Prose: Two or more simple starting materials combine to build a single, more complex compound. In the kitchen, combining flour, water, and yeast to form bread dough is an analogy.
- Prose: A single complex starting material breaks down into two or more simpler products. An example is heating sodium bicarbonate (baking soda) in cake batter, which decomposes to release carbon dioxide gas, bubbles, and sodium carbonate.
- Prose: An active free element swaps places with an element inside a compound, kicking the original element out to stand alone.
- Prose: Two ionic compounds switch partner ions, forming two brand-new ionic compounds. Typically, this reaction forms a solid precipitate that falls out of solution.
- Prose: A hydrocarbon fuel reacts rapidly with oxygen gas (O2) from the air. This highly exothermic reaction always produces carbon dioxide (CO2) and water vapor (H2O).
- Prose: An acid (releasing H+ ions) reacts with a base (releasing OH- ions). They neutralize each other, forming water (H2O) and an ionic salt.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 03: Locking Subscripts - Adjust coefficients, lock the subscripts.
**Section ID:** `s-law`

#### 📝 Prose & Questions:
- Prose: To conserve atoms, we might be tempted to change the subscripts inside formulas. Never do this. Subscripts define the chemical identity of a substance. If you change the subscript of water (H2O) to H2O2 to get more oxygen, you are no longer modeling water—you are modeling hydrogen peroxide, a corrosive bleach. You cannot change the recipe ingredients to balance the scale.
- Prose: Instead, we adjust the coefficients (the numbers placed in front of formulas). A coefficient scales the entire molecule. Placing a "2" in front of H2O (2 H2O) means you have two distinct water molecules, doubling the counts of both hydrogen and oxygen atoms without changing what the substance is.
- Prose: Drawing boundaries
- Prose: Think of each compound as being inside a sealed plastic box. You can buy more boxes (coefficients), but you cannot open the box to alter the atoms inside (subscripts).

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 04: Visual Balancer - Balance the beam. Conserve the atoms.
**Section ID:** `s-balancer`

#### 📝 Prose & Questions:
- Prose: Select a chemical equation. Use the plus and minus buttons to change the coefficients. Watch the molecule drawings populate the balance beam. When the atom counts match on both sides, the beam will level out.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Choose Reaction to Balance: Water Synthesis Ammonia Synthesis*)


### Section 05: Predict First - Predict the coefficients.
**Section ID:** `s-predict`

#### 📝 Prose & Questions:
- Prose: 1. Balancing Combustion: Consider the combustion of methane: CH4 + O2 → CO2 + H2O. Looking at the hydrogens, the reactant side has 4 hydrogens while the product side only has 2. What coefficient should you place in front of H2O to balance hydrogen?
- Prose: Placing a coefficient of 2 in front of H2O (2 H2O) gives a total of 4 hydrogen atoms on the product side, matching the 4 hydrogen atoms in the single CH4 reactant molecule. (This also increases oxygen, which you would then balance by placing a 2 in front of O2 reactants).
- Prose: 2. Categorizing Reaction: A beaker containing aqueous sodium chloride (NaCl) is mixed with silver nitrate (AgNO3). A solid white cloud of silver chloride (AgCl) immediately forms and settles at the bottom of the beaker. What type of reaction is this?
- Prose: This is a double replacement precipitation reaction. The sodium (Na+) and silver (Ag+) ions swap partner anions (Cl- and NO3-) to produce a solid salt (AgCl) and aqueous sodium nitrate (NaNO3).

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 06: Recall - Say it back.
**Section ID:** `s-recall`

#### 📝 Prose & Questions:
- Prose: Fill in the blanks to lock in the core terms. Matches are case-insensitive.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Balancing & Types Vocabulary Fill in the terms. 1. The chemical reaction type where a fuel reacts with oxygen to form CO 2 and H 2 O is: 2. The chemical reaction type where a single reactant breaks down into multiple products is: 3. The fundamental law that requires equations to be balanced is the Law of: 4. The numbers placed in front of chemical formulas to balance an equation are: 5. The subscript numbers inside a chemical formula represent the compound's: Check Answers Reset*)


### Section 07: Self-Explain - Why lock the subscripts?
**Section ID:** `s-explain`

#### 📝 Prose & Questions:
- Prose: Explain, in terms of chemical identity and atomic structure, why you are permitted to change coefficients to balance an equation, but strictly forbidden from modifying subscripts.
- Prose: Subscripts represent the fixed ratio of atoms bonded together within an individual molecule, establishing its unique chemical identity and properties. Changing a subscript alters the actual substance being modeled (for example, turning oxygen gas O2 into toxic ozone O3). Coefficients, however, simply indicate the number of independent molecules participating in the reaction. Modifying coefficients scales the total amount of the substance present without changing its atomic bonding, allowing us to balance the equation while keeping the chemical species correct.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Compare with model answer Model Answer Subscripts represent the fixed ratio of atoms bonded together within an individual molecule, establishing its unique chemical identity and properties. Changing a subscript alters the actual substance being modeled (for example, turning oxygen gas O 2 into toxic ozone O 3 ). Coefficients, however, simply indicate the number of independent molecules participating in the reaction. Modifying coefficients scales the total amount of the substance present without changing its atomic bonding, allowing us to balance the equation while keeping the chemical species correct.*)


### Section 08: Exam Practice - Balance a thermal decomposition.
**Section ID:** `s-exam`

#### 📝 Prose & Questions:
- Prose: Give yourself a point for each idea you actually wrote down. The flag (⚑) marks the coefficient comparison step.
- Exam: When baking soda (NaHCO3) is heated in an oven, it undergoes thermal decomposition to form solid sodium carbonate (Na2CO3), water vapor (H2O), and carbon dioxide gas (CO2). Write out the unbalanced chemical equation, balance it using coefficients, and show how the atom count ledger is equal on both reactant and product sides.
- Exam: Mark Scheme — 3 marks
- Exam: Writes the correct unbalanced chemical equation: NaHCO3 → Na2CO3 + H2O + CO2.
- Exam: Balances the equation by placing a coefficient of 2 in front of NaHCO3: 2 NaHCO3 → Na2CO3 + H2O + CO2. (⚑ Placing the single coefficient 2 to balance all element counts is required for this mark.)
- Exam: Shows the atom count ledger matches on both sides: Reactants: 2 Na, 2 H, 2 C, 6 O; Products: 2 Na, 2 H, 2 C (1+1), 6 O (3+1+2).
- Exam: Self-score: 3 = all three points · 2 = balanced equation but missing/incorrect atom count ledger · 1 = wrote unbalanced equation only.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*



---

## 📖 Lesson C-SPA: Structure → Property → Argument

**Filename:** [lessons/C-SPA_structure-property-argument.html](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/lessons/C-SPA_structure-property-argument.html)

### Section 01: Opening
**Section ID:** `s-hero`

#### 📝 Prose & Questions:
- Prose: In chemistry, we design materials and analyze properties by building a logical chain of reasoning. A molecule's sub-microscopic structural shape determines how closely it can pack against its neighbors. This packing limits or maximizes the strength of its intermolecular forces (IMFs). Finally, these force strengths dictate macroscopic properties like melting points and food texture. To communicate this to other scientists, we use a structured five-part argument. In this lesson, we explore saturated and unsaturated fats to master this scientific reasoning chain.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 02: Fat Structures - Straight lines vs. double-bond kinks.
**Section ID:** `s-structure`

#### 📝 Prose & Questions:
- Prose: Fats and oils are made of long hydrocarbon chains called fatty acids. The key difference between a solid fat (like butter or ghee) and a liquid oil (like canola or olive oil) lies entirely in the geometry of these carbon skeletons.
- Prose: A saturated fat contains carbon chains with only single bonds. Every carbon atom is bonded to as many hydrogen atoms as possible (it is "saturated" with hydrogens). Because single bonds allow free rotation and form a uniform zig-zag shape, these chains are overall straight and linear.
- Prose: An unsaturated fat contains one or more double bonds between carbon atoms. Because a double bond is rigid and locked, it forces the carbon skeleton into a bent geometry, creating a permanent kink or bend in the middle of the chain.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 03: Packing & IMFs - Tighter packing makes stronger forces.
**Section ID:** `s-imfs`

#### 📝 Prose & Questions:
- Prose: How does this geometry translate to melting points? It is a direct result of molecular packing density and the strength of London dispersion forces (LDFs), the weak intermolecular forces that temporarily attract nonpolar molecules to one another.
- Prose: The velcro analogy
- Prose: Think of London dispersion forces like Velcro. Two flat, straight strips of Velcro can press tightly together, making a strong grip. Two crumpled, bent pieces of Velcro will barely touch, gripping each other very weakly.
- Prose: Because saturated fat chains are straight, they can pack tightly side-by-side, maximizing the contact surface area between molecules. This close contact allows LDFs to operate at their highest strength, holding the molecules firmly in a solid grid at room temperature.
- Prose: Because unsaturated fat chains have rigid kinks, they cannot pack tightly. The kinks push neighboring molecules apart, creating large gaps of empty space. This increased distance significantly weakens LDFs. Because the forces holding the molecules together are weak, unsaturated fats melt at much lower temperatures and are liquids at room temperature.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 04: Scientific Arguments - Feature → IMF → Property → Function → Trade-off.
**Section ID:** `s-argument`

#### 📝 Prose & Questions:
- Prose: In chemistry, we do not simply list facts; we construct logical claims. When designing materials (such as substituting a cooking ingredient), we follow a structured 5-part argument:
- Prose: Structural Feature: Identify the microscopic shape of the molecules (e.g. straight saturated chains vs. kinked unsaturated chains).
- Prose: IMF Strength: Relate the shape to packing tightness and the resulting strength of intermolecular forces (e.g., tight packing leads to stronger London dispersion forces).
- Prose: Macroscopic Property: Explain how the IMF strength affects the physical state or melting point (e.g. stronger forces require more thermal energy to overcome, resulting in a solid at room temperature).
- Prose: Material Function: Connect the physical property to its practical use (e.g. solid fats trap air and support dough structures, creating flaky pastries).
- Prose: Design Trade-off: Evaluate what happens if you substitute ingredients, balancing healthier molecular structures against degraded physical performance.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 05: Interactive Explorer - Heat the chains. Construct the claim.
**Section ID:** `s-explorer`

#### 📝 Prose & Questions:
- Prose: Toggle between saturated and unsaturated fat structures. Slide the temperature to watch how LDF attractions break. On the right, select the correct logical segments to build a complete scientific argument.
- Prose: At 20°C, straight saturated fat chains are packed tightly together. London dispersion forces (LDFs, shown in orange) hold them in a rigid solid grid.
- Prose: Select a statement for each step above to construct your material design argument...

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Saturated (Straight) Unsaturated (Kinked)*)


### Section 06: Predict First - Predict the property trend.
**Section ID:** `s-predict`

#### 📝 Prose & Questions:
- Prose: 1. Comparing IMF Strengths: Stearic acid is a saturated fatty acid with a straight 18-carbon chain. Oleic acid is an unsaturated fatty acid, also with 18 carbons, but with a double-bond kink in the middle. Which compound has stronger intermolecular forces holding its molecules together?
- Prose: Because stearic acid molecules are straight, they can pack tightly side-by-side, maximizing contact surface area. This maximizes the strength of the London dispersion forces between them. The kink in oleic acid pushes molecules apart, weakening the LDFs.
- Prose: 2. Predicting States: Based on the IMF strength described, which acid will have a higher melting point and remain a solid at room temperature (20°C)?
- Prose: Stearic acid, with its stronger London dispersion forces, requires more thermal energy (higher temperature) to overcome the attractions and melt. Its melting point is 69°C, so it is a solid at room temperature. Oleic acid, with weaker forces, melts at 13°C, making it a liquid oil at room temperature.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*


### Section 07: Recall - Say it back.
**Section ID:** `s-recall`

#### 📝 Prose & Questions:
- Prose: Fill in the blanks to lock in the core terms. Matches are case-insensitive.

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Argument & IMF Vocabulary Fill in the terms. 1. Saturated fatty acids contain only single bonds, resulting in a molecular shape that is: 2. Unsaturated fatty acids contain double bonds, which introduce a permanent: 3. The specific type of weak intermolecular forces that attract nonpolar hydrocarbon chains together are: 4. Straight molecules pack closely, which increases their packing density and: 5. In a material design argument, the final step where we evaluate functional drawbacks is the: Check Answers Reset*)


### Section 08: Self-Explain - Why do kinks lower melting point?
**Section ID:** `s-explain`

#### 📝 Prose & Questions:
- Prose: Explain, using the concepts of molecular shape, packing density, and intermolecular force strength, why unsaturated fat has a lower melting point than saturated fat.
- Prose: Saturated fats have straight carbon chains that allow molecules to pack tightly side-by-side, maximizing contact surface area and producing strong London dispersion forces between the chains. Overcoming these strong attractions requires a significant amount of thermal energy, resulting in a high melting point. Unsaturated fats have rigid double-bond kinks that prevent tight packing, pushing molecules apart and leaving empty spaces. This increased distance significantly reduces contact and weakens the London dispersion forces. Because the attractions holding the molecules together are weak, very little thermal energy is needed to separate them, resulting in a low melting point (making them liquid oils at room temperature).

#### 🎨 Diagrams & Interactives:
- **[INTERACTIVE]** (UI Elements: *Compare with model answer Model Answer Saturated fats have straight carbon chains that allow molecules to pack tightly side-by-side, maximizing contact surface area and producing strong London dispersion forces between the chains. Overcoming these strong attractions requires a significant amount of thermal energy, resulting in a high melting point. Unsaturated fats have rigid double-bond kinks that prevent tight packing, pushing molecules apart and leaving empty spaces. This increased distance significantly reduces contact and weakens the London dispersion forces. Because the attractions holding the molecules together are weak, very little thermal energy is needed to separate them, resulting in a low melting point (making them liquid oils at room temperature).*)


### Section 09: Exam Practice - Write the complete material design argument.
**Section ID:** `s-exam`

#### 📝 Prose & Questions:
- Prose: Give yourself a point for each idea you actually wrote down. The flag (⚑) marks the critical linking step.
- Exam: A bakery wants to make a recipe healthier by substituting liquid canola oil (unsaturated fat) for solid shortening/butter (saturated fat). Write a complete five-part material design argument explaining the structural differences, why these properties arise, the functional role of the fat in baking, and the physical trade-off that occurs when you perform this substitution.
- Exam: Mark Scheme — 5 marks
- Exam: Structural Feature: States that shortening/butter contains straight saturated carbon chains, while canola oil contains rigid kinks from double-bonded unsaturated chains.
- Exam: Molecular Packing: Explains that straight chains pack tightly side-by-side, whereas kinked chains cannot pack tightly, leaving large gaps between molecules.
- Exam: IMF Attraction: Connects packing density to intermolecular force strength: the close contact in saturated chains maximizes London dispersion forces, while the gaps in unsaturated chains significantly weaken London dispersion forces. (⚑ Linking molecular packing directly to LDF force strength is required for this mark.)
- Exam: Macroscopic Property: Relates force strength to state: stronger LDFs require more thermal energy to break, keeping shortening solid at room temperature, while weaker LDFs in canola oil result in a liquid oil at room temperature.
- Exam: Function & Trade-off: Identifies that solid fat is required to trap air and separate flour layers to create a flaky pastry; substituting liquid oil will cause the pastry to collapse, becoming flat, dense, and greasy, trading physical texture for a healthier nutritional profile.
- Exam: Self-score: 5 = all five points · 4 = wrote a strong argument but missed either the LDF strength link or the specific baking function · 3 = general comparison with no LDF or function detail.

#### 🎨 Diagrams & Interactives:
- ❌ **No visuals or interactives present in this section.**

⚠️ *DEVELOPMENT NOTE: This section consists entirely of text and retrieval questions. Consider developing a particle model, animation, or structural diagram for this content.*

