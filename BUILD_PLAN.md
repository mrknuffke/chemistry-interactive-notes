# BUILD_PLAN.md — Session Sequencing & Prompts
## Chemistry Interactive Notes · v2 implementation

**Project knowledge to load before every session:** CLAUDE.md · BUILDING.md · VOICE.md · INTERACTION_SPEC.md · Content_Expansion_v2.md · Diagram_Inventory_v2.md. (The two v1 documents are superseded — remove them from project knowledge so Claude Code can't consume stale specs.)

---

## Session order

| # | Session | Depends on | Why this position |
|---|---|---|---|
| ~~0~~ | ~~Glossary / tooltip infrastructure~~ | ~~—~~ | ~~Already drafted (existing session prompt + 50+ definitions). Run first; lesson sessions assume tooltips exist. Add the six 2-7c terms noted at the end of Content_Expansion_v2.md.~~ |
| ~~1~~ | ~~Widget framework~~ | ~~0~~ | ~~The four widgets (commit-reveal, faded-example, scaffold, step-builder) in core.js/components.css + `_widget-test.html`. Every lesson session consumes these.~~ |
| ~~2~~ | ~~Motion primitives~~ | ~~1~~ | ~~Step, scrub, zoom in core.js + additions to the test page. Separated from Session 1 so each session has one definition of done.~~ |
| ~~3~~ | ~~Lesson 2-7a~~ | ~~1, 2~~ | ~~First lesson pass; exercises zoom (T3), faded example, scaffold ledger, and a gate — a full-spectrum shakedown of the infrastructure on the highest-priority lesson.~~ |
| 4 | Lesson 1-1a | 1, 2 | Steppable visuals + faded example + gates. |
| 5 | Lesson C-RXN | 1, 2 | Both resolved decisions land here: tabbed types card + gated balancing step-builder + classify drill. |
| 6 | Lesson 1-3a | 1, 2 | The other gated step-builder (CO₂) + the NCl₃ faded example. |
| 7 | Lesson 1-2a | 1, 2 | The ΔEN scrub (T2 signature) + faded exam. |
| 8 | Lesson 1-3b | 1, 2 | Water-bead zoom + gated predicts. |
| 9 | Lesson 2-2a | 1, 2 | Tawa zoom (two-target — the most complex T3) + T1 upgrade of closed/open. Deliberately after two simpler zooms have shaken out the zoom stage. |
| 10 | Lesson 2-7b | 1, 2 | Small session: faded chain + conditional hub visual. |
| 11 | Lesson 2-7c | 1, 2 | BCA scaffold + gated drill; simulator untouched. |
| ~~12~~ | ~~Lesson 1-1b~~ | ~~1, 2~~ | ~~GHS zoom (⚑ pictogram check first) + gated predicts.~~ |
| 13 | Lesson C-SPA | 1, 2 | Exam scaffold + explorer refactor to bank-mode scaffold. Prata zoom only if ⚑ mechanism is signed off by then; otherwise skip it and leave a TODO. |
| 14 | Lesson 1-2b | 1, 2, ⚑ | Last, because existence and section IDs are unverified. If the file doesn't exist, this becomes a creation session seeded by the 1-2b block of Content_Expansion_v2.md. |

Sessions 3–14 are independent of each other; reorder freely after Session 2 if a sign-off unblocks early.

---

## Paste-ready session prompts

### Session 1 — Widget framework

> Read CLAUDE.md, BUILDING.md, and INTERACTION_SPEC.md in full before writing any code. Build the four widgets defined in INTERACTION_SPEC §3 (commit-reveal with choice/free/drill modes, faded-example, scaffold with bank/free/table modes, step-builder) as generalized, data-attribute-driven components in core.js and components.css. Zero lesson-specific strings or logic in shared assets; all content arrives via the JSON config pattern in the spec. Honor the binding principles in §0 — especially: no reveal reachable without a commit, no persistence, green for verified-correct only. Build `lessons/_widget-test.html` instantiating every widget mode with dummy config. Then run the Playwright checks in §4 against the test page and show me the screenshots. Do not touch any lesson file in this session.

### Session 2 — Motion primitives

> Read CLAUDE.md, BUILDING.md, and INTERACTION_SPEC.md in full. Build the three motion primitives in §2 (step controller, scrub controller with target support and a registered-draw-function pattern, zoom stage) in core.js/components.css. No autoplay anywhere; `prefers-reduced-motion` behavior exactly per spec §0.3 and each primitive's section; full keyboard operability. Extend `lessons/_widget-test.html` with one instance of each primitive (dummy SVG layers are fine). Run the §4 Playwright checks including the reduced-motion render check and show me screenshots in both motion modes. Do not touch any lesson file.

### Session template — Lessons (3–14)

> Read CLAUDE.md, BUILDING.md, VOICE.md, INTERACTION_SPEC.md, and then the **[LESSON ID]** blocks of Content_Expansion_v2.md and Diagram_Inventory_v2.md. Apply every change tagged for this lesson: replacement prose verbatim (it is written to VOICE.md — do not "improve" it), widget instances with the exact strings from the content doc, and visuals per their inventory specs and tiers. Before building any visual, run its ⚑ verification items from the inventory checklist and report the results to me before proceeding. Preserve all implemented interactives marked IMPLEMENTED. After building: run the VOICE.md §6 QA pass on the page, run Playwright screenshots at desktop and mobile widths plus reduced-motion, and show me every new section. Flag anything where the built page's actual structure contradicts the section IDs assumed in the docs instead of guessing.

---

## Open questions (resolve before their dependent sessions)

1. **1-2b existence** — does `lessons/1-2b_*.html` exist? Harvest real section IDs. *(Blocks Session 14 only.)*
2. **Roti prata lamination mechanism** — David verifies against Unit 2 materials. *(Blocks V-cspa-02 and the ⚑ sentence in C-SPA s-argument; Session 13 can otherwise run.)*
3. **K→Ga 4s/3d simplification** — sign off V-11a-02 as specced, or fall back to the two-state version. *(Session 4.)*
4. **H–F boundary framing** — sign off the 1-2a Item 2 strings. *(Session 7.)*
5. **GHS pictograms for sodium** — which pictograms do the PLC/Unit 1 materials show? *(Session 12.)*
6. **2-7b s-map overlap** — check whether the implemented map already covers the three-node hub. *(Session 10, 2-minute check at session start.)*

## QA gates (every lesson session, non-negotiable)

1. Every ⚑ chemistry item for the lesson verified and reported before build.
2. Reveal unreachable without commit, on every gate on the page.
3. Reduced-motion pass renders every T1/T2/T3 state.
4. VOICE.md §6 pass: zero banned-list hits; every wrong-answer feedback explains the temptation.
5. Playwright screenshots reviewed at both widths before the session closes.
