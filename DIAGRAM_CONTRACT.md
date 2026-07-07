# DIAGRAM_CONTRACT.md — Invariants for in-SVG diagrams

Checkable rules only, no rationale. Load this verbatim every diagram session. See `DIAGRAM_STANDARDIZATION.md` for the plan this enforces and `TODO.md` §1a for status. Values below come from that plan's Phase 0 harvest (2026-07-06) — don't invent new ones; if a needed value has no token, stop and ask.

## Containment (target for new/retrofitted work — Phase 0 found 0 overlay violations codebase-wide already, so this is mostly already true)

1. Every diagram is exactly one root `<svg viewBox="…">`.
2. `preserveAspectRatio="xMidYMid meet"` is set explicitly. Width is CSS (`100%` up to a `.figure` max-width, see `REVISION_PLAN.md` §1); height follows the viewBox.
3. All diagram text is `<text>` inside the SVG. No absolutely-positioned HTML label divs over artwork.
4. Interactive controls (buttons, sliders) are HTML and sit outside the SVG frame — never overlapping its internals.
5. **Known exceptions (fixed 2026-07-06):** `2-7a` `#moleculeCanvas` and `2-7c` `#particleCanvas` were missing `viewBox` — both now `viewBox="0 0 400 250"` (matches their existing 16:10 CSS `aspect-ratio`).

## Geometry tokens (in `tokens.css` — SVG user units)

| Token | Value | Use |
|---|---|---|
| `--dia-r-particle` | 2 | electron / lone-pair / small particle dot radius |
| `--dia-r-atom` | 7.5 | nucleus / atom body radius |
| `--dia-stroke` | 1 | default thin outline / line stroke width |
| `--dia-stroke-bond` | 1.2 | particle/atom outline & bond stroke (matches `.d-particle`/`.d-metal`) |
| `--dia-label-size` | 10 | atom / element label text size |
| `--dia-caption-size` | 7 | small in-diagram annotation text size |

6. No raw hex or bare-px geometry in new/retrofitted diagram SVGs — every radius, stroke width, and label size references one of the tokens above. Mechanical check: `grep` the diagram SVG for `#[0-9a-fA-F]{3,8}` (raw hex) — must be empty except `#fff`/`#ffffff` used for label-on-dark-fill text.
7. **Color already complies, no new tokens needed.** Diagram color routes through the existing global palette (`--electron`, `--nucleus`, `--ink-mute`, `--accent`, `--water`) and the `.d-particle`/`.d-metal`/`.d-nuc`/`.d-frame`/`.d-wall`/`.d-water` classes in `components.css` (CLAUDE.md §8) — confirmed by the Phase 0 harvest (97%+ of fills already `var(--token)`, not raw hex). Don't invent `--dia-el-*` per-element color tokens; that would compete with, not extend, this existing role-based convention.
8. **One known violation:** `2-7a.js`'s `atomicMasses` table defines ~20 raw hex colors unrelated to the shared palette — flagged, not yet fixed (see `TODO.md` §1a).

## Geometry rules (not yet enforced by any retrofit — apply to new work now)

9. Bonds draw center-to-center, then clip to the atom edge. No stub poking through a circle, no gap.
10. Labels sit outside the atom's bounding radius. Lone pairs sit on a free arc, away from bonds.
11. Particle scenes conserve particles: the count of each type is equal across all panels of a framed sequence.

## Standing rules

12. One concern per session — never containment and restyle together; never two renderer families at once.
13. Each session names its 3–6 target files and stops there.
14. Acceptance is a screenshot (or, for headless sessions, a DOM measurement + rendered-crop check), not a claim.
