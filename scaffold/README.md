# Gen Chem Interactive Notes

Interactive HTML review pages for first-semester General Chemistry. Studied
**after** in-class first exposure: retrieval practice woven with a second,
diagram-led re-narration. Phenomenon-anchored hooks, but the chemistry stands on
its own (built to the **review sheets**, not tied to unit storylines).

## Quick start
```bash
# from the repo root
python3 -m http.server 8000          # then open http://localhost:8000/lessons/...
# OR just open a lesson file directly — but a server is needed for ../assets/ paths

# screenshots (to actually see your output)
npm init -y && npm i -D playwright && npx playwright install chromium
node tools/screenshot.js lessons/1-1b_periodic-trends-reactivity.html
```

## Structure
- `assets/tokens.css` — fonts, colors, base type, grid background, dark mode
- `assets/components.css` — shared component library + particle-diagram conventions
- `assets/core.js` — theme, TOC, nav, scroll-reveal, retrieval widgets
- `lessons/` — one HTML per lesson + a matching `<id>.js` for its interactives
- `References/` — **review sheets + convention posters** (authoritative content + conventions)
- `Exemplars/` — IB-Biology HTML files (pedagogical reference only — do NOT copy the look)
- `tools/screenshot.js` — render + screenshot helper

## Read first
**`CLAUDE.md`** — the design system, pedagogical spine, file manifest, the
particle-diagram conventions, and the fixed decisions (e.g. hew to review sheets,
no VSEPR headline, geometry/polarity live in C-SPA). It's the build contract.

`lessons/1-1b_periodic-trends-reactivity.html` is the reference implementation —
match it.

## `References/` and `Exemplars/`
You already have these. `References/` should hold the Unit 1 & Unit 2 review
sheets (the **content source of truth**) plus the five convention posters
(Four Types of Models, Energy Bar Diagrams, Modeling Chemical Reactions,
Particle Diagram Poster, Showing Phase Motion). `Exemplars/` holds the
HTML files — useful for pedagogical patterns (inspired by [Biology by Bradford](https://www.biologybybradford.com)) only; the visual identity is ours,
defined in `assets/` + the `1-1b` reference build.
