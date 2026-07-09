/* ============================================================
   GEN CHEM — CANONICAL ELEMENT DATA (Z = 1..36)
   The SINGLE source of periodic data for every lesson. Verify a
   value HERE, once; lessons read from it and never re-type numbers.

   Exposed as window.GC_ELEMENTS (plain <script>, no modules).

   Field notes:
   - shells  : Bohr "electron shell configuration", e.g. [2,8,18,7].
               Uses 4s-before-3d filling. Cr (24) and Cu (29) carry
               their REAL anomalous configs ([2,8,13,1], [2,8,18,1]);
               `anomaly:true` flags them so a lesson can note it.
   - valence : outer-shell electron count for MAIN-GROUP elements.
               null for transition metals (3d series) — their valence
               is not a simple outer-shell count (a later topic).
   - kind    : metal | metalloid | nonmetal | noble (chemical character)
   - mainGroup: true for groups 1,2,13–18 (incl. H, He); false for the
               transition series (groups 3–12).
   - radius_pm / ie_kjmol / en : trend values (match the 1-1b build).
               null for the transition series (not fabricated here) and
               en is null for noble gases (they barely bond).
   ============================================================ */
(function () {
  // [Z, sym, name, group, period, shells, valence, kind, mainGroup, radius_pm, ie_kjmol, en, anomaly?]
  const RAW = [
    [1,  'H',  'Hydrogen',   1,  1, [1],          1,    'nonmetal',  true,  53,   1312, 2.20],
    [2,  'He', 'Helium',     18, 1, [2],          2,    'noble',     true,  31,   2372, null],
    [3,  'Li', 'Lithium',    1,  2, [2,1],        1,    'metal',     true,  167,  520,  0.98],
    [4,  'Be', 'Beryllium',  2,  2, [2,2],        2,    'metal',     true,  112,  899,  1.57],
    [5,  'B',  'Boron',      13, 2, [2,3],        3,    'metalloid', true,  87,   801,  2.04],
    [6,  'C',  'Carbon',     14, 2, [2,4],        4,    'nonmetal',  true,  67,   1086, 2.55],
    [7,  'N',  'Nitrogen',   15, 2, [2,5],        5,    'nonmetal',  true,  56,   1402, 3.04],
    [8,  'O',  'Oxygen',     16, 2, [2,6],        6,    'nonmetal',  true,  48,   1314, 3.44],
    [9,  'F',  'Fluorine',   17, 2, [2,7],        7,    'nonmetal',  true,  42,   1681, 3.98],
    [10, 'Ne', 'Neon',       18, 2, [2,8],        8,    'noble',     true,  38,   2081, null],
    [11, 'Na', 'Sodium',     1,  3, [2,8,1],      1,    'metal',     true,  190,  496,  0.93],
    [12, 'Mg', 'Magnesium',  2,  3, [2,8,2],      2,    'metal',     true,  145,  738,  1.31],
    [13, 'Al', 'Aluminum',   13, 3, [2,8,3],      3,    'metal',     true,  118,  578,  1.61],
    [14, 'Si', 'Silicon',    14, 3, [2,8,4],      4,    'metalloid', true,  111,  786,  1.90],
    [15, 'P',  'Phosphorus', 15, 3, [2,8,5],      5,    'nonmetal',  true,  98,   1012, 2.19],
    [16, 'S',  'Sulfur',     16, 3, [2,8,6],      6,    'nonmetal',  true,  88,   1000, 2.58],
    [17, 'Cl', 'Chlorine',   17, 3, [2,8,7],      7,    'nonmetal',  true,  79,   1251, 3.16],
    [18, 'Ar', 'Argon',      18, 3, [2,8,8],      8,    'noble',     true,  71,   1521, null],
    [19, 'K',  'Potassium',  1,  4, [2,8,8,1],    1,    'metal',     true,  243,  419,  0.82],
    [20, 'Ca', 'Calcium',    2,  4, [2,8,8,2],    2,    'metal',     true,  194,  590,  1.00],
    [21, 'Sc', 'Scandium',   3,  4, [2,8,9,2],    null, 'metal',     false, null, null, null],
    [22, 'Ti', 'Titanium',   4,  4, [2,8,10,2],   null, 'metal',     false, null, null, null],
    [23, 'V',  'Vanadium',   5,  4, [2,8,11,2],   null, 'metal',     false, null, null, null],
    [24, 'Cr', 'Chromium',   6,  4, [2,8,13,1],   null, 'metal',     false, null, null, null, true],
    [25, 'Mn', 'Manganese',  7,  4, [2,8,13,2],   null, 'metal',     false, null, null, null],
    [26, 'Fe', 'Iron',       8,  4, [2,8,14,2],   null, 'metal',     false, null, null, null],
    [27, 'Co', 'Cobalt',     9,  4, [2,8,15,2],   null, 'metal',     false, null, null, null],
    [28, 'Ni', 'Nickel',     10, 4, [2,8,16,2],   null, 'metal',     false, null, null, null],
    [29, 'Cu', 'Copper',     11, 4, [2,8,18,1],   null, 'metal',     false, null, null, null, true],
    [30, 'Zn', 'Zinc',       12, 4, [2,8,18,2],   null, 'metal',     false, null, null, null],
    [31, 'Ga', 'Gallium',    13, 4, [2,8,18,3],   3,    'metal',     true,  136,  579,  1.81],
    [32, 'Ge', 'Germanium',  14, 4, [2,8,18,4],   4,    'metalloid', true,  125,  762,  2.01],
    [33, 'As', 'Arsenic',    15, 4, [2,8,18,5],   5,    'metalloid', true,  114,  947,  2.18],
    [34, 'Se', 'Selenium',   16, 4, [2,8,18,6],   6,    'nonmetal',  true,  103,  941,  2.55],
    [35, 'Br', 'Bromine',    17, 4, [2,8,18,7],   7,    'nonmetal',  true,  94,   1140, 2.96],
    [36, 'Kr', 'Krypton',    18, 4, [2,8,18,8],   8,    'noble',     true,  88,   1351, 3.00]
  ];

  const list = RAW.map(r => ({
    z: r[0], sym: r[1], name: r[2], group: r[3], period: r[4],
    shells: r[5], valence: r[6], kind: r[7], mainGroup: r[8],
    radius: r[9], ie: r[10], en: r[11], anomaly: r[12] === true
  }));

  const bySym = {}, byZ = {};
  list.forEach(e => { bySym[e.sym] = e; byZ[e.z] = e; });

  // shells -> "2, 8, 18, 7"
  const config = e => e.shells.join(', ');

  // What a MAIN-GROUP atom "wants" to do, from its valence count.
  // Returns {dir:'lose'|'gain'|'inert', charge:'1+'..., need:int} or null for transition metals.
  function tendency(e) {
    if (!e.mainGroup || e.valence == null) return null;
    const v = e.valence;
    if (e.kind === 'noble') return { dir: 'inert', charge: null, need: 0 };
    if (v <= 3) return { dir: 'lose', charge: v + '+', need: v };               // metals shed valence shell
    if (v >= 5) return { dir: 'gain', charge: (8 - v) + '−', need: 8 - v }; // nonmetals fill octet
    return { dir: 'either', charge: null, need: 4 };                            // group 14 (C, Si, Ge)
  }

  window.GC_ELEMENTS = { list, bySym, byZ, config, tendency };
})();
