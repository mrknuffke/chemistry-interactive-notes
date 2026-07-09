/* ============================================================
   GEN CHEM INTERACTIVES — GLOSSARY DATA
   Loaded by lesson pages after core.js and before lesson JS.
   Keys are kebab-case slugs matching normalized <strong class="term">
   text content. Definitions are final; do not rephrase.

   A plural/variant form (e.g. 'shells', 'coefficients') is stored as
   a STRING naming its canonical key; the expansion loop at the bottom
   replaces each string with a reference to the canonical entry object,
   so consumers can always index GC_GLOSSARY[slug] directly and edits
   to a definition propagate to every alias automatically.
   ============================================================ */

window.GC_GLOSSARY = {

  // --- Atomic Structure (1-1a) ---

  'atomic-number': {
    term: 'Atomic Number (Z)',
    definition: 'The number of protons in an atom\'s nucleus. It is the atom\'s fingerprint: change the proton count and you have a different element. Every element on the periodic table is defined by its unique atomic number.',
  },

  'valence-electrons': {
    term: 'Valence Electrons',
    definition: 'The electrons in an atom\'s outermost shell. These are the only electrons that get close enough to neighboring atoms to be lost, gained, or shared — they are the electrons that do chemistry. Everything about reactivity, bonding, and trends comes back to counting and reading this outer shell.',
  },

  'electron-configuration': {
    term: 'Electron Configuration',
    definition: 'The notation describing how many electrons occupy each shell of an atom, written as a sequence of counts (e.g., 2, 8, 7 for chlorine). The last number in the sequence is the valence count. It is read directly off a Bohr model by counting electrons in each ring from the inside out.',
  },

  'isotope': {
    term: 'Isotope',
    definition: 'An atom of an element with a different number of neutrons than the most common form. Isotopes of the same element have identical chemical behavior because they have the same electron configuration — neutrons add mass but don\'t change the outer shell. Carbon-12 and carbon-14 are both carbon; they just weigh differently.',
  },

  'electron-shell': {
    term: 'Electron Shell',
    definition: 'One of the fixed energy levels at set distances from the nucleus where electrons reside. Shells fill from the inside out, with the first holding 2 electrons and the second and third holding up to 8 each for main-group chemistry. The outermost occupied shell determines an element\'s chemical behavior.',
  },

  // --- Periodic Trends (1-1b) ---

  'ionization-energy': {
    term: 'Ionization Energy (IE)',
    definition: 'The energy required to remove one electron from a neutral atom in the gas phase. High ionization energy means the atom holds its electrons tightly — hard to make it lose one. IE increases across a period (more protons, same shell) and decreases down a group (outer electrons farther away and more shielded).',
    example: 'Na: 496 kJ/mol · F: 1681 kJ/mol'
  },

  'electronegativity': {
    term: 'Electronegativity (EN)',
    definition: 'An atom\'s power to attract shared electrons toward itself when bonded to another atom. Fluorine has the highest electronegativity of any element (3.98 on the Pauling scale). EN increases across a period and decreases down a group — following the same nuclear-charge logic as ionization energy.',
    example: 'Na: 0.93 · Cl: 3.16 · F: 3.98'
  },

  'atomic-radius': {
    term: 'Atomic Radius',
    definition: 'A measure of an atom\'s size, approximately half the distance between two identical bonded atoms. Atomic radius decreases across a period (more protons pull the same outer shell inward) and increases down a group (each new shell sits farther from the nucleus). Radius and ionization energy trend in opposite directions.',
    example: 'Na ≈ 186 pm · Cl ≈ 99 pm (same period)'
  },

  'shielding': {
    term: 'Shielding (Electron Shielding)',
    definition: 'The reduction in nuclear pull on outer electrons because inner electron shells partially block the positive charge of the nucleus. The more inner shells there are, the weaker the pull on valence electrons. Shielding is why atoms grow as you move down a group even though the nuclear charge increases.',
  },

  'nuclear-charge': {
    term: 'Nuclear Charge',
    definition: 'The total positive charge of an atom\'s nucleus, equal to the number of protons. Increasing nuclear charge pulls all electrons inward more strongly. Moving across a period adds protons without adding a new shell, so nuclear charge increases and atomic radius decreases.',
  },

  // --- Bonding & Electronegativity (1-2a) ---

  'electronegativity-difference': {
    term: 'Electronegativity Difference (ΔEN)',
    definition: 'The absolute difference between the electronegativity values of two bonded atoms, determining how the shared electrons are distributed. ΔEN < 0.5 gives nonpolar covalent; 0.5–1.7 gives polar covalent; ≥ 1.7 gives ionic. The 1.7 threshold is a guideline, not a strict wall.',
    example: 'C–H: ΔEN = 0.35 (nonpolar) · H–Cl: ΔEN = 0.96 (polar) · Na–Cl: ΔEN = 2.23 (ionic)'
  },

  'nonpolar-covalent-bond': {
    term: 'Nonpolar Covalent Bond',
    definition: 'A covalent bond in which electrons are shared approximately equally between two atoms (ΔEN < 0.5). Neither atom develops a significant partial charge. C–H bonds in hydrocarbons are the most common example — this is why oils and fats are nonpolar and do not mix with water.',
  },

  'polar-covalent-bond': {
    term: 'Polar Covalent Bond',
    definition: 'A covalent bond in which electrons are shared unequally because the two bonded atoms have different electronegativities (ΔEN 0.5–1.7). The more electronegative atom develops a partial negative charge (δ−); the other develops a partial positive charge (δ+). O–H and N–H bonds are polar covalent.',
  },

  'ionic-bond': {
    term: 'Ionic Bond',
    definition: 'The electrostatic attraction between a positive ion (cation) and a negative ion (anion), formed when one atom transfers an electron completely to another (ΔEN ≥ 1.7). Ionic bonds typically form between a metal and a nonmetal. NaCl is the classic example.',
  },

  'metallic-bond': {
    term: 'Metallic Bond',
    definition: 'The attraction between positive metal cores and the delocalized sea of electrons flowing freely among them. Metal atoms release their valence electrons into a communal pool rather than sharing them with specific neighbors. This is why metals conduct electricity: the electrons are already mobile.',
  },

  'partial-charge': {
    term: 'Partial Charge (δ+ / δ−)',
    definition: 'A fractional charge that develops on atoms within a polar covalent bond when electrons are shared unevenly. It is not a full ionic charge — the atom hasn\'t lost or gained an electron, just pulled the shared electrons closer or farther. Partial charges are the source of dipole-dipole forces between molecules.',
  },

  // --- Molecular Polarity (1-2b) ---

  'bond-dipole': {
    term: 'Bond Dipole',
    definition: 'The charge separation within a single polar covalent bond, represented as a vector pointing from δ+ toward δ−. Each polar bond in a molecule has a bond dipole with a direction and magnitude. Whether those bond dipoles cancel each other or reinforce each other determines the molecule\'s overall polarity.',
  },

  'molecular-polarity': {
    term: 'Molecular Polarity',
    definition: 'The net charge distribution across an entire molecule, determined by both bond polarity and molecular geometry. A molecule is polar if its bond dipoles do not cancel — meaning there is a positive end and a negative end. CO₂ has polar bonds but is nonpolar overall because its linear geometry makes the dipoles cancel exactly.',
  },

  'dipole-cancellation': {
    term: 'Dipole Cancellation',
    definition: 'When bond dipoles in a molecule point in equal and opposite directions due to molecular geometry, producing zero net dipole. This requires both polar bonds AND a symmetric arrangement. CO₂ (linear) is nonpolar because of cancellation; H₂O (bent) is polar because its geometry prevents cancellation.',
  },

  'net-dipole': {
    term: 'Net Dipole',
    definition: 'The overall charge separation of a molecule, equal to the vector sum of all its bond dipoles. A nonzero net dipole means the molecule is polar and will experience dipole-dipole forces with neighboring molecules. The magnitude of the net dipole affects IMF strength.',
  },

  // --- Lewis Structures (1-3a) ---

  'octet-rule': {
    term: 'Octet Rule',
    definition: 'The tendency of main-group atoms to gain, lose, or share electrons until they have 8 valence electrons — matching the stable configuration of the nearest noble gas. Most nonmetals satisfy the octet rule through covalent bonding. Hydrogen is the main exception: it follows the duet rule (2 electrons).',
  },

  'duet-rule': {
    term: 'Duet Rule',
    definition: 'The equivalent of the octet rule for hydrogen: hydrogen is stable with exactly 2 valence electrons, filling its first and only shell. This is why hydrogen always forms exactly one bond and is never a central atom in a Lewis structure. Helium also follows the duet rule.',
  },

  'lone-pair': {
    term: 'Lone Pair',
    definition: 'A pair of valence electrons on an atom that is not involved in a covalent bond. Lone pairs occupy space and contribute to molecular geometry, even though they don\'t appear as bonds in a structural formula. Oxygen in water has two lone pairs; nitrogen in ammonia has one.',
  },

  'bonding-pair': {
    term: 'Bonding Pair',
    definition: 'A pair of electrons shared between two atoms to form a covalent bond. A single bond contains one bonding pair (2 electrons); a double bond contains two (4 electrons); a triple bond contains three (6 electrons). Bonding pairs count toward each bonded atom\'s octet.',
  },

  'central-atom': {
    term: 'Central Atom',
    definition: 'The atom in a Lewis structure that is bonded to multiple other atoms and sits at the center of the molecule. The central atom is usually the one that appears once in the formula and has the lowest electronegativity of the non-hydrogen atoms. It must be able to form multiple bonds to satisfy surrounding atoms\' octets.',
  },

  'double-bond': {
    term: 'Double Bond',
    definition: 'A covalent bond formed by the sharing of two pairs of electrons (4 electrons total) between two atoms, represented by two parallel lines (=). Double bonds are shorter and stronger than single bonds and are rigid — they cannot rotate freely. The C=C double bond in unsaturated fats creates the permanent kink that makes them liquid at room temperature.',
  },

  'triple-bond': {
    term: 'Triple Bond',
    definition: 'A covalent bond formed by the sharing of three pairs of electrons (6 electrons total) between two atoms, represented by three parallel lines (≡). Triple bonds are the shortest and strongest covalent bonds. Nitrogen gas (N≡N) is the most common example.',
  },

  // --- IMFs & Properties (1-3b) ---

  'london-dispersion-force': {
    term: 'London Dispersion Force (LDF)',
    definition: 'A weak, temporary intermolecular attraction that exists between all molecules, polar or nonpolar. It arises from momentary imbalances in electron distribution that create brief partial charges, which induce matching partial charges in neighboring molecules. Larger electron clouds produce stronger LDFs — this is why heavier molecules generally have higher boiling points.',
  },

  'dipole-dipole-force': {
    term: 'Dipole-Dipole Force',
    definition: 'An intermolecular attraction between the permanent partial charges (δ+ and δ−) of neighboring polar molecules. Polar molecules align so their positive ends face the negative ends of their neighbors. Stronger than LDF for molecules of similar size, but weaker than hydrogen bonding.',
  },

  'hydrogen-bond': {
    term: 'Hydrogen Bond',
    definition: 'An unusually strong intermolecular force that forms when a hydrogen atom bonded directly to N, O, or F is attracted to a lone pair on an N, O, or F atom of a neighboring molecule. Despite the name, it is not a covalent bond — it is a very strong dipole interaction. Hydrogen bonding explains water\'s anomalously high boiling point and surface tension.',
  },

  'vapor-pressure': {
    term: 'Vapor Pressure',
    definition: 'The pressure exerted by the gas-phase molecules of a substance above its liquid surface at equilibrium. Substances with weaker IMFs evaporate more easily, producing more gas above the liquid and therefore higher vapor pressure. High vapor pressure at room temperature means the substance is volatile and evaporates quickly.',
  },

  'surface-tension': {
    term: 'Surface Tension',
    definition: 'The inward pull on surface molecules of a liquid caused by unbalanced IMF attractions from molecules below. Interior molecules are pulled equally in all directions; surface molecules are only pulled inward and sideways. Liquids with stronger IMFs have higher surface tension — this is why water beads up rather than spreading flat.',
  },

  'intramolecular-force': {
    term: 'Intramolecular Force',
    definition: 'A force that acts within a molecule, between the atoms that make it up — specifically covalent bonds. Intramolecular forces are much stronger than intermolecular forces and require a chemical reaction to break. Boiling water does not break intramolecular bonds — steam is still H₂O.',
  },

  'intermolecular-force': {
    term: 'Intermolecular Force (IMF)',
    definition: 'A force that acts between separate molecules, holding them near each other. These are electrostatic attractions — LDF, dipole-dipole, and hydrogen bonding — and are much weaker than covalent bonds. Phase changes (melting, boiling) involve overcoming intermolecular forces, not breaking covalent bonds.',
  },

  // --- Physical vs. Chemical Change (2-2a) ---

  'physical-change': {
    term: 'Physical Change',
    definition: 'A change that alters the arrangement or state of particles without breaking covalent bonds. The substance retains the same chemical identity before and after. Melting, boiling, dissolving, and cutting are physical changes — the molecules are rearranged or separated, but not chemically converted.',
  },

  'chemical-change': {
    term: 'Chemical Change',
    definition: 'A change in which covalent bonds break and form, producing new substances with different properties from the starting materials. The reactants are consumed and products with new chemical identities are created. Indicators include gas production, temperature change, color change, or precipitate formation.',
  },

  'reactants': {
    term: 'Reactants',
    definition: 'The starting substances consumed in a chemical reaction, written on the left side of a chemical equation. Reactant atoms are rearranged — not created or destroyed — to form the products. The number of atoms of each element in the reactants must equal the number in the products.',
  },

  'products': {
    term: 'Products',
    definition: 'The new substances formed in a chemical reaction, written on the right side of a chemical equation. Products have different chemical identities and properties than the reactants they were made from. The same atoms are present in both sides — just bonded in new combinations.',
  },

  'closed-system': {
    term: 'Closed System',
    definition: 'A system where no matter can enter or leave. In a closed system, the total mass of all substances is conserved — the scale reading before a reaction equals the scale reading after, even if gases form inside. A sealed flask is a closed system.',
  },

  'open-system': {
    term: 'Open System',
    definition: 'A system where matter can enter or leave, typically by gases escaping into the atmosphere. Mass appears to decrease in an open system when gas products escape, but this does not violate conservation of mass — the atoms are still in the universe, just no longer on the scale.',
  },

  'conservation-of-mass': {
    term: 'Law of Conservation of Mass',
    definition: 'The principle that matter cannot be created or destroyed in a chemical reaction. Every atom present in the reactants must appear in the products. Chemical equations must be balanced to reflect this: the same number of each type of atom must appear on both sides of the arrow.',
  },

  // --- The Mole & Molar Mass (2-7a) ---

  'mole': {
    term: 'Mole (mol)',
    definition: 'A counting unit used in chemistry equal to 6.022 × 10²³ particles (atoms, molecules, ions, or formula units). One mole of any element has a mass in grams equal to its atomic mass in atomic mass units. The mole bridges the scale of atoms (too small to weigh) to the scale of the lab (grams you can put on a scale).',
    example: '1 mol H₂O = 18.02 g = 6.022 × 10²³ molecules'
  },

  'avogadros-number': {
    term: 'Avogadro\'s Number',
    definition: 'The number of particles in one mole: 6.022 × 10²³. It was chosen so that the atomic mass of an element in amu numerically equals the molar mass in g/mol — making the scale bridge exact. One mole of carbon-12 atoms weighs exactly 12 grams.',
    example: '6.022 × 10²³ mol⁻¹'
  },

  'molar-mass': {
    term: 'Molar Mass',
    definition: 'The mass of exactly one mole of a substance, in grams per mole (g/mol). For an element it equals the atomic mass on the periodic table. For a compound it is the sum of atomic masses of all atoms in one formula unit. It is the conversion factor between grams and moles.',
    example: 'H₂O: 18.02 g/mol · NaCl: 58.44 g/mol'
  },

  'atomic-mass-unit': {
    term: 'Atomic Mass Unit (amu)',
    definition: 'The unit used to express the mass of atoms and molecules at the atomic scale. One amu is defined as exactly 1/12 the mass of a carbon-12 atom. The atomic mass of an element on the periodic table is in amu; one mole of those atoms weighs that same number in grams.',
    example: '1 C atom = 12.01 amu · 1 mol C = 12.01 g'
  },

  // --- Mole Conversions (2-7b) ---

  'dimensional-analysis': {
    term: 'Dimensional Analysis',
    definition: 'A method for converting between units by multiplying by conversion factors written as fractions, so that unwanted units cancel. If the setup is correct, the units you want to eliminate appear in the denominator of a fraction and cancel; the unit you want survives. Also called the factor-label method.',
  },

  'conversion-factor': {
    term: 'Conversion Factor',
    definition: 'A fraction equal to 1, where the numerator and denominator express the same quantity in different units. For example, (1 mol NaCl / 58.44 g NaCl) equals 1 because they describe the same amount. Multiplying by a conversion factor changes the unit without changing the quantity.',
  },

  'unit-cancellation': {
    term: 'Unit Cancellation',
    definition: 'The process of eliminating unwanted units in a dimensional analysis calculation by placing them in the denominator of a conversion factor. If a unit appears in both the numerator of one factor and the denominator of the next, it cancels out. If your units don\'t cancel to give the desired unit, the setup is wrong — fix the setup before doing arithmetic.',
  },

  // --- Reaction Types & Balancing (C-RXN) ---

  'synthesis-reaction': {
    term: 'Synthesis Reaction',
    definition: 'A reaction in which two or more reactants combine to form a single, more complex product. General pattern: A + B → AB. The identifying signature is one product formed from multiple reactants.',
    example: '2 Na(s) + Cl₂(g) → 2 NaCl(s)'
  },

  'decomposition-reaction': {
    term: 'Decomposition Reaction',
    definition: 'A reaction in which a single compound breaks down into two or more simpler products. General pattern: AB → A + B. The identifying signature is one reactant producing multiple products.',
    example: '2 NaHCO₃(s) → Na₂CO₃(s) + H₂O(g) + CO₂(g)'
  },

  'single-replacement-reaction': {
    term: 'Single Replacement Reaction',
    definition: 'A reaction in which a free element displaces one element from a compound, with the displaced element coming out alone. General pattern: A + BC → AC + B. The identifying signature is a free element as a reactant and a different free element as a product.',
    example: 'Zn(s) + 2 HCl(aq) → ZnCl₂(aq) + H₂(g)'
  },

  'double-replacement-reaction': {
    term: 'Double Replacement Reaction',
    definition: 'A reaction in which two ionic compounds exchange partner ions to form two new ionic compounds. General pattern: AB + CD → AD + CB. Often produces a precipitate, a gas, or water. The identifying signature is two ionic compound reactants.',
    example: 'Pb(NO₃)₂(aq) + 2 KI(aq) → PbI₂(s) + 2 KNO₃(aq)'
  },

  'combustion-reaction': {
    term: 'Combustion Reaction',
    definition: 'A reaction in which a hydrocarbon fuel reacts with oxygen gas (O₂) to produce carbon dioxide (CO₂) and water (H₂O), always releasing heat. The identifying signature is a hydrocarbon plus O₂ as reactants; CO₂ and H₂O as the only products.',
    example: 'CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(g)'
  },

  'acid-base-reaction': {
    term: 'Acid-Base Reaction (Neutralization)',
    definition: 'A reaction between an acid (releasing H⁺ ions) and a base (releasing OH⁻ ions), producing water and an ionic salt. Also called neutralization because the dangerous properties of both reactants cancel out in the products.',
    example: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)'
  },

  'coefficient': {
    term: 'Coefficient',
    definition: 'A number placed in front of a chemical formula in a balanced equation to indicate how many formula units of that substance are involved. Coefficients can be changed when balancing an equation. Changing a coefficient changes the number of molecules; subscripts inside formulas describe the molecule itself and must never be changed.',
  },

  'subscript': {
    term: 'Subscript',
    definition: 'A number written below and to the right of an element symbol in a chemical formula, indicating how many atoms of that element are in one formula unit. Subscripts are fixed — they define the molecule and cannot be changed when balancing. Only coefficients are adjusted during balancing.',
  },

  'precipitate': {
    term: 'Precipitate',
    definition: 'A solid that forms and falls out of solution when two aqueous ionic compounds react. The precipitate forms because the new ionic compound is insoluble in water. Formation of a precipitate is a characteristic sign of a double replacement reaction.',
    example: 'PbI₂(s) in the reaction of Pb(NO₃)₂ and KI'
  },

  // --- Structure → Property → Argument (C-SPA) ---

  'saturated-fat': {
    term: 'Saturated Fat',
    definition: 'A fat composed of fatty acid chains with only single bonds between carbon atoms. Single bonds allow free rotation, so saturated chains adopt a straight, linear shape. Straight chains pack tightly together, maximizing contact area and producing strong London dispersion forces — which is why saturated fats are solid at room temperature.',
    example: 'Butter, ghee, shortening'
  },

  'unsaturated-fat': {
    term: 'Unsaturated Fat',
    definition: 'A fat containing at least one double bond between carbon atoms in its fatty acid chains. The rigid double bond forces a permanent kink in the chain. Kinked chains cannot pack tightly, leaving gaps that weaken London dispersion forces — which is why unsaturated fats are liquid oils at room temperature.',
    example: 'Canola oil, olive oil'
  },

  'packing-density': {
    term: 'Packing Density',
    definition: 'How tightly molecules fit together in a given space, which directly determines the strength of London dispersion forces between them. Straight chains have high packing density (maximum surface contact); kinked chains have low packing density (gaps between molecules). Higher packing density → stronger LDF → higher melting point.',
  },

  'laminar-layers': {
    term: 'Laminar Layers',
    definition: 'Distinct, flat layers of material separated by a barrier substance. In laminated pastry (like roti prata), layers of dough separated by solid fat create distinct structural layers during cooking. Solid fat maintains the layer separation; liquid oil soaks into the dough and destroys the layered structure.',
  },

  'design-trade-off': {
    term: 'Design Trade-off',
    definition: 'In a material design argument, the final step where the functional or health consequences of a structural substitution are evaluated. A design trade-off acknowledges that changing the molecular structure to improve one property (e.g., nutritional profile) may degrade another (e.g., physical texture). No substitution is cost-free.',
  },

  // --- New entries: terms used in lessons that lacked a matching slug ---

  // Atomic Structure (1-1a) — new entries
  'nucleus': {
    term: 'Nucleus',
    definition: 'The dense, positively charged core at the center of every atom, containing all its protons and neutrons. The nucleus accounts for nearly all the atom\'s mass while occupying a vanishingly small fraction of its volume. The number of protons in the nucleus is the atomic number and defines which element the atom is.',
  },

  // Atomic Structure (1-1a) — plural/variant aliases
  'shells': 'electron-shell',

  'isotopes': 'isotope',

  // Bonding & Electronegativity (1-2a) — new entries
  'electrostatic-force': {
    term: 'Electrostatic Force',
    definition: 'The fundamental push or pull between electrically charged particles: opposite charges attract, like charges repel. All chemical bonds are ultimately electrostatic in origin — ionic bonds are the attraction between full charges, covalent bonds form where shared electron density lowers the overall electrostatic energy, and even the weakest intermolecular forces arise from temporary or permanent charge imbalances.',
  },

  'sea-of-electrons': {
    term: 'Sea of Electrons',
    definition: 'The delocalized pool of valence electrons that flows freely throughout a metal lattice rather than belonging to any individual atom. Metal atoms release their outer electrons into this communal cloud; the attraction between the positive metal cores and the mobile electrons holds the metal together. The freely moving electrons are why metals conduct electricity and heat.',
  },

  // Lewis Structures (1-3a) — new entries
  'lewis-structure': {
    term: 'Lewis Structure',
    definition: 'A two-dimensional diagram showing how valence electrons are arranged in a molecule — bonding pairs drawn as lines between atoms, lone pairs as pairs of dots. The goal is for every atom to satisfy its octet (or duet for hydrogen). Lewis structures reveal connectivity, bond order, and lone pair positions, which together determine molecular geometry and polarity.',
  },

  'single-bond': {
    term: 'Single Bond',
    definition: 'A covalent bond formed by sharing one pair of electrons (2 electrons total), drawn as a single line (–). Single bonds allow free rotation around the bond axis and are the longest and weakest of the three covalent bond types. Because saturated carbon chains contain only single bonds, every carbon can spin freely relative to its neighbors, allowing the chain to adopt a straight, tightly-packing shape.',
  },

  // Lewis Structures (1-3a) — plural alias
  'lone-pairs': 'lone-pair',

  // IMFs & Properties (1-3b) — plural/variant aliases
  'intermolecular-forces': 'intermolecular-force',

  'intramolecular-bonds': 'intramolecular-force',

  'hydrogen-bonding': 'hydrogen-bond',

  'london-dispersion-forces': 'london-dispersion-force',

  // Reaction Types & Balancing (C-RXN) — plural alias
  'coefficients': 'coefficient',

  // The Mole & Molar Mass (2-7a) — new entry
  'grams-per-mole': {
    term: 'Grams per Mole (g/mol)',
    definition: 'The unit of molar mass. One g/mol means one gram of a substance contains exactly one mole of its particles. The numerical value equals the atomic or formula mass in amu — so water (18.02 amu per molecule) has a molar mass of 18.02 g/mol. It is the conversion factor that bridges laboratory-scale grams and chemistry-scale particle counts.',
    example: 'H₂O: 18.02 g/mol · NaCl: 58.44 g/mol'
  },

  // Stoichiometry (2-7c) — new entries
  'mole-ratio': {
    term: 'Mole Ratio',
    definition: 'The ratio of moles of one substance to moles of another in a chemical reaction, read directly from the coefficients of the balanced equation. Mole ratios are the conversion factors that let you move from moles of one substance to moles of any other substance in the same reaction. If the balanced equation shows CH₄ + 2 O₂, the mole ratio of O₂ to CH₄ is 2:1.',
  },

  'bca-table': {
    term: 'BCA Table',
    definition: 'A structured bookkeeping tool for stoichiometry that tracks every substance at three moments: Before the reaction, the Change in moles as the reaction proceeds, and After it completes. The Change row uses the balanced equation\'s mole ratios — reactants decrease (negative), products increase (positive). When the limiting reactant hits zero in the After row, the reaction stops.',
  },

  'limiting-reactant': {
    term: 'Limiting Reactant',
    definition: 'The reactant that is completely consumed first and therefore determines the maximum amount of product that can form. Once it runs out, the reaction stops regardless of how much of the other reactants remain. To identify the limiting reactant, divide available moles of each reactant by its coefficient and compare — the smallest value wins.',
  },

  'excess-reactant': {
    term: 'Excess Reactant',
    definition: 'A reactant present in greater quantity than the reaction requires, so some remains unconsumed after the limiting reactant is used up. The amount of product formed is set entirely by the limiting reactant — having extra excess reactant cannot increase yield. Stoichiometry always determines how much excess is left over.',
  },

};

/* Expand string aliases into shared references to their canonical entry.
   An alias naming a missing key resolves to undefined, which every
   consumer already treats as "no entry" — same as an unknown slug. */
(function (g) {
  Object.keys(g).forEach(function (k) {
    if (typeof g[k] === 'string') g[k] = g[g[k]];
  });
})(window.GC_GLOSSARY);
