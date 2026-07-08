# DIAGRAM_CONTRACT.md — Invariants for in-SVG diagrams

Checkable rules only, no rationale. Load this verbatim every diagram session. See `DIAGRAM_STANDARDIZATION.md` for the plan this enforces and `TODO.md` §1a for status. Values below come from that plan's Phase 0 harvest (2026-07-06) — don't invent new ones; if a needed value has no token, stop and ask.

## Containment (target for new/retrofitted work — Phase 0 found 0 overlay violations codebase-wide already, so this is mostly already true)

1. Every diagram is exactly one root `<svg viewBox="…">`.
2. `preserveAspectRatio="xMidYMid meet"` is set explicitly. Width is CSS (`100%` up to a `.figure` max-width, see `TODO.md` §1.1); height follows the viewBox.
3. All diagram text is `<text>` inside the SVG. No absolutely-positioned HTML label divs over artwork.
4. Interactive controls (buttons, sliders) are HTML and sit outside the SVG frame — never overlapping its internals.
5. **Known exceptions (fixed 2026-07-06):** `2-7a` `#moleculeCanvas` and `2-7c` `#particleCanvas` were missing `viewBox` — both now `viewBox="0 0 400 250"` (matches their existing 16:10 CSS `aspect-ratio`).

## Geometry tokens (in `tokens.css` — SVG user units)

| Token | Value | Use |
|---|---|---|
| `--dia-r-particle` | 2 | electron / lone-pair / small particle dot radius |
| `--dia-r-atom-sm` | 5 | added 2026-07-07: smaller atom in a molecule ball-diagram (hydrogen, next to a larger central atom) — see below |
| `--dia-r-atom` | 7.5 | nucleus / atom body radius, or the larger atom in a ball-diagram |
| `--dia-stroke` | 1 | default thin outline / line stroke width |
| `--dia-stroke-bond` | 1.2 | particle/atom outline & bond stroke (matches `.d-particle`/`.d-metal`) |
| `--dia-label-size` | 10 | atom / element label text size |
| `--dia-caption-size` | 7 | small in-diagram annotation text size |

15a. **`--dia-r-atom-sm` added during Phase 3, 1-2b retrofit.** The original 2-token radius scale (particle/atom) can't represent molecule ball-diagrams that deliberately draw hydrogen smaller than the atom it's bonded to — a real, recurring pattern (also present unretrofitted in `2-7a.js`'s and `2-7c.js`'s own atom/H radius ratios, ~0.5–0.75×). Value chosen as a round number near that ratio against `--dia-r-atom`. This is a token-set extension, not a one-off exception — use it anywhere a diagram needs a legitimately-smaller-but-still-atom-scale circle next to a `--dia-r-atom` one.

6. No raw hex or bare-px geometry in new/retrofitted diagram SVGs — every radius, stroke width, and label size references one of the tokens above. Mechanical check: `grep` the diagram SVG for `#[0-9a-fA-F]{3,8}` (raw hex) — must be empty except `#fff`/`#ffffff` used for label-on-dark-fill text. **Watch for false positives:** this pattern also matches HTML numeric character entities like `&#8322;` (₂) or `&#9873;` (⚑) — those aren't colors, ignore them.
7. **Color already complies, no new tokens needed.** Diagram color routes through the existing global palette (`--electron`, `--nucleus`, `--ink-mute`, `--accent`, `--water`) and the `.d-particle`/`.d-metal`/`.d-nuc`/`.d-frame`/`.d-wall`/`.d-water` classes in `components.css` (CLAUDE.md §8) — confirmed by the Phase 0 harvest (97%+ of fills already `var(--token)`, not raw hex). Don't invent `--dia-el-*` per-element color tokens; that would compete with, not extend, this existing role-based convention.
8. **Fixed 2026-07-07:** `2-7a.js`'s `atomicMasses` table defined ~20 raw hex colors unrelated to the shared palette (and one active golden-rule-5 violation — Chlorine used `var(--good)`, green, reserved for correct/positive). Fixed by following the exact precedent already set in `2-7c.js`'s molecule drawer: oxygen `var(--accent)`, hydrogen `#fff`, every other element `var(--ink-mute)` — atoms are identified by their text label, not fill color, so no information is lost. `radius` values in that same table were deliberately left un-retrofitted this pass (separate concern: those feed a JS arithmetic step, `radius * 1.3`, not a plain attribute string — swapping them needs the code path restructured, not just a string replace).
9. **Attribute-vs-style pitfall (found 2026-07-07, cost a broken screenshot to catch):** `var(--token)` resolves correctly as a bare SVG presentation attribute for geometry/paint properties — confirmed for `r`, `stroke-width`, `fill` — but **not** for `font-size`: Chrome parses `font-size="var(--x)"` as invalid and silently falls back to the inherited font-size (in this codebase, the page body's 22px), producing wildly oversized diagram text with no console error. Always set diagram text size as `style="font-size:var(--dia-label-size)"` (a real CSS declaration), never as a bare `font-size="var(...)"` attribute. Re-verify in a rendered screenshot, not just a DOM/computed-style check on other properties — this exact bug would pass a naive "does the token resolve on :root" check while still rendering broken. When a shared JS `setAttribute`-style helper exists (e.g. `1-2b.js`'s `svgEl()`), fix `font-size` handling once inside the helper (route it to `element.style.fontSize`) rather than patching every call site.
10. **Radius-feeds-arithmetic exclusion (recurring pattern, not a one-off):** in `2-7a.js`'s `moleculeCanvas` and `1-2b.js`'s `atom()`/`bond()` helpers, an atom's radius is also used to compute *other* geometry (bond-line endpoints offset by the atom's edge, e.g. `xL + 18`). A `var(--dia-r-atom)` string can't participate in that arithmetic. Left un-retrofitted in both files — the radius values there stay plain numbers, not tokens, until someone restructures the call sites to pass an already-resolved number. Don't force it; check for this pattern (`radius` or `r` used in a subsequent `+`/`-`/`*` expression) before swapping any JS-driven atom radius to a token string.
11. **Fixed 2026-07-07:** `1-3b`'s surface-tension diagram had a 3-stop copper/bronze gradient (`#D48B5C`/`#C57545`/`#833C1A`) for a penny illustration — a second, independent instance of raw hex outside the palette (distinct from `2-7a.js`'s per-element table). This is also a golden-rule-5 violation (CLAUDE.md: "one accent... don't introduce new hues") — realistic prop colors aren't exempt just because they're representational. Fixed by swapping to a neutral `--paper-3`→`--card`→`--ink-mute` gradient, matching how other diagrams render props (2-7a's balance/teaspoon) in the existing palette rather than naturalistic color. **When retrofitting a diagram, grep it for raw hex beyond the accepted `#fff` case even if it isn't a molecule/atom diagram** — decorative gradients are an easy place for a new hue to sneak in unnoticed.

## Geometry rules (not yet enforced by any retrofit — apply to new work now)

9. Bonds draw center-to-center, then clip to the atom edge. No stub poking through a circle, no gap.
10. Labels sit outside the atom's bounding radius. Lone pairs sit on a free arc, away from bonds.
11. Particle scenes conserve particles: the count of each type is equal across all panels of a framed sequence.

## Standing rules

12. One concern per session — never containment and restyle together; never two renderer families at once.
13. Each session names its 3–6 target files and stops there.
14. Acceptance is a screenshot (or, for headless sessions, a DOM measurement + rendered-crop check), not a claim.
