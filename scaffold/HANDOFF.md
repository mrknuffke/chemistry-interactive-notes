# HANDOFF — continuing the Gen Chem Interactive Notes build

You're picking up a project that's ~20% built, with a settled contract and a
working pipeline. This brief gets you oriented fast. **Read `CLAUDE.md` and
`BUILDING.md` in full before touching anything** — they are the actual contract;
this file is just "where things stand and what to do next."

## What this is
Eleven interactive HTML review pages for a high-school General Chemistry course
(Semester 1, NGSS-aligned). Students use them **outside class, after first
exposure** — the job is retrieval practice woven with a second, diagram-led
re-narration. Not first teaching, not a quiz bank. Pure static HTML/CSS/JS, no
build step, no framework — open `lessons/*.html` through a local server (paths
to `../assets/` need one) and it just runs.

## Where things stand
**Done (4 of 11):**
- `1-1a_atomic-structure-electron-config.html` — built and verified; retrofitted with searchable `<strong class="term">` vocabulary tagging.
- `1-1b_periodic-trends-reactivity.html` — reference build, fully verified.
- `1-2a_bonding-electronegativity.html` — built with interactive bond character explorer and atomic-level bonding animation (including metallic electron sea).
- `1-3a_lewis-structures.html` — built with interactive Lewis Structure Lab checking duets (H), octets (C, N, O, F), and total valence electron pools.

**Shared infrastructure (all in `assets/`, all stable):**
- `tokens.css` / `components.css` / `core.js` — design tokens, component library, shared behaviors (theme toggle, TOC, reveal-on-scroll, predict-reveal, recall, peek, mark-scheme).
  - **NEW this session:** Global SVG Diagram Lightbox Viewer. Clicking any SVG inside `.diagram` automatically opens a centered, high-resolution blurred-backdrop overlay overlay with zoom capability.
  - **NEW this session:** Base font size scaled to `22px` for improved typography layout with larger max-widths.
- `elements.js` — Canonical, hand-verified periodic data for Z = 1–36. Exposed as `window.GC_ELEMENTS` with helpers `.config(el)` and `.tendency(el)`.
- `BUILDING.md` — The condensed per-lesson build checklist (review-sheet-first, non-negotiables, before/while/after-writing gates). Enforces a strict ban on LaTeX formatting in HTML (always use `<sub>`, `&Delta;`, etc.).

**Repo layout note:** `References/` and `Exemplars/` were moved INSIDE
`scaffold/` this session (they used to sit one level up at the project root,
which broke the paths `CLAUDE.md` and `tools/screenshot.js` assume). `scaffold/`
is now self-contained and matches the docs as written. Run everything —
including `node tools/screenshot.js lessons/<file>.html` — from inside `scaffold/`.

**Tooling:** Playwright + Chromium are now installed (`npm i -D playwright &&
npx playwright install chromium` was run this session). The screenshot tool
works; use it.

## The contract, compressed
- **Content source = the Review Sheets** in `References/` (`Unit 1/2 Review Sheet.docx`). The Consensus Notes are stale — don't build from them.
- **Fixed decisions** (don't relitigate): no VSEPR headline (connective sentence in `C-SPA` at most), no empirical formula (absent from the Unit-2 sheet), geometry/polarity live in `C-SPA` not `1-3a`.
- **One accent** (vermilion), green = correct only, cool→hot heat-maps for *sequential* data only (categorical data gets the vermilion/green split).
- **Keep storylines/contexts light and tangential:** Use cooking (melting fat, browning dough) as a relatable framework, but ensure all chemistry explanations and questions are general enough to work for any student, regardless of their familiarity with local contexts (like Roti Prata). Do not let contexts overwhelm the chemistry.
- **Particle-diagram conventions are mandatory** where the chemistry is phase/reaction-shaped (`2-2a`, `C-RXN`, `1-3b`) — brackets/lumps/tails for solid/liquid/gas motion, atom-count conservation, always a legend. **Note:** Energy-bar diagrams are deferred to Unit 3 (next unit) and MUST NOT be used in Unit 2.
- **Verify chemistry, then render and LOOK** (light + dark) before calling anything done. Most bugs are visual or chemical, not code bugs.

## A gotcha that will bite you immediately
The full-page screenshot from `tools/screenshot.js` looks broken — text faded,
diagrams/captions seemingly missing. **This is not a bug in the page.** It's the
scroll-reveal animation: `.reveal` blocks sit at `opacity:0` until an
IntersectionObserver fires on scroll, and a single full-page capture never
triggers it for off-screen content. To actually evaluate a rendered lesson,
either use the tool's section-selector mode (`node tools/screenshot.js
lessons/<file>.html "#section-id"` — it scrolls first) or force reveal before
shooting (`document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'))`
via `page.evaluate`). Don't waste time "fixing" a page that isn't actually broken.

## What's next — build order
Follow the manifest in `CLAUDE.md` (11 files, 3-PE cap, shared chemistry
deduped into `C-RXN` / `C-SPA`). Suggested order — keep building the Unit-1
spine before jumping to Unit-2 or the canonical files, since later lessons lean
on earlier ones (1-1a → 1-1b is already such a chain: 1-1a is the "why," 1-1b is
the "how much"):

1. `1-3b` IMFs & Properties (PS1-3.5) — first lesson that should bring in the
   phase-motion (brackets/lumps/tails) conventions honestly.
2. `2-2a` Physical vs Chemical Change & Particle Diagrams (PS1-2.1/.4) — heavy
   particle-diagram lesson; lean hard on the poster conventions here.
3. `C-RXN` Reaction Types & Balancing (PS1-2.2/.3) — canonical/shared; the
   signature interactive should be a drag-to-balance equation per `CLAUDE.md`.
4. `2-7a/b/c` (Mole, Conversions, Stoichiometry) and `C-SPA` (Structure→
   Property→Argument) round out the set — `C-SPA` is the most structurally
   complex (owns geometry→polarity→IMF→GHS reasoning across two applications).

**Workflow per lesson** (from `CLAUDE.md`/`BUILDING.md`): read the review sheet
→ list sub-targets → draft + get the section outline signed off → build →
verify chemistry → screenshot light+dark and actually look → fix → repeat. One
lesson at a time. Don't skip the sign-off step — outlines are cheap to redirect,
finished lessons aren't.

## Open questions the teacher flagged for 1-1a (worth asking about future lessons too)
These are the kind of judgment calls that are cheap to get input on up front:
- Whether to show the true Cr/Cu anomalous configurations (`2,8,13,1` /
  `2,8,18,1`) or the naive fill — 1-1a shows the true ones with an honest aside.
- How much room isotopes/mass number deserve (kept to a one-line tap-aside here,
  per the "hew to the review sheet" rule — they're not a headline sub-target).
- How to frame transition metals when a lesson's reasoning (e.g. valence count)
  doesn't cleanly extend to them — 1-1a names the limit rather than fudging it.

## Eventually: this becomes an interactive "textbook"
The teacher's long-term goal is to publish all 11 as a cohesive online textbook
(static hosting — GitHub/Cloudflare Pages or an LMS). The current architecture
supports that well, but two things are missing and worth building once ~half
the lessons exist: (1) a `lessons.json` manifest (id/title/unit/PEs/order) that
drives a generated index page and cross-lesson prev/next nav — right now each
lesson is an island with only its own in-page TOC; (2) localStorage-based
progress persistence. Both are additive — they don't require touching finished
lessons. Don't build them prematurely; the manifest is much easier to write
correctly once you can see the real shape of all 11 lessons.
