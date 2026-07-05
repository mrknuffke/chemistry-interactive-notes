# PDF_EXPORT_PLAN.md — Pretty, Well-Formatted Lesson Printouts

**Status: SPEC ONLY — not implemented.** This is a build plan for a future model (Sonnet or otherwise) to execute. Read it end to end, surface the two author decisions in §9 before writing code, then implement in the order given in §10. Honor every invariant in `CLAUDE.md` §3 and the zero-build ethos (shared assets, no bundler, no framework).

**Goal:** Any lesson page can be turned into a clean, print-quality PDF — either by the student hitting ⌘P / "Save as PDF" in the browser, or by an author running a batch script that generates a PDF for every lesson at once. The PDF should read like a polished handout of the *whole* lesson: all the prose, every diagram, and — critically — all the answer/reveal content that is normally hidden behind interaction, unrolled into static form.

---

## 1. Constraints & principles (binding)

1. **Zero-build.** No bundler, no framework. A `print.css` in `scaffold/assets/` (linked `media="print"` or wrapped in `@media print`) plus a small print-mode hook in `core.js`. Optionally one standalone batch script under `scaffold/tools/` (already git-ignored for its `shots/` output).
2. **Don't degrade the on-screen experience.** Print mode is additive — the interactive page must behave exactly as before when not printing. Everything print-specific lives in `@media print` and in `beforeprint`/`afterprint` handlers that clean up after themselves.
3. **Match the visual language.** Same fonts (Hanken Grotesk / Spectral / IBM Plex Mono), same vermilion accent, same green-for-correct. A printout should be recognizably the same textbook, just on paper.
4. **Honest on paper.** A printed widget that shows an empty answer box teaches nothing. Every gated reveal must be expanded (see §4 — this is the hard part). If a thing genuinely can't render statically (a live slider), replace it with its resolved/annotated state, don't leave a dead control.
5. **Light mode only on paper.** Dark mode wastes ink and looks wrong printed. Force light.

---

## 2. Recommended architecture

Two deliverables, buildable independently:

**(A) `scaffold/assets/print.css` + a `core.js` print hook** — the core feature. Makes ⌘P / "Save as PDF" produce a good result from any lesson, for students and authors alike. **Build this first; it's 90% of the value.**

**(B) `scaffold/tools/make-pdfs.mjs` (or `.py`) — an optional batch generator** that loads every lesson in headless Chrome and calls `page.pdf()`, writing `dist/pdf/<id>.pdf`. Nice for producing a full set in one command; not required for the student-facing feature. Build only if the author wants batch output (see §9 decision 2).

Link `print.css` from every lesson `<head>` (add the one `<link rel="stylesheet" href="../assets/print.css" media="print">` line to each lesson, or — cleaner — fold it into `components.css` as an `@media print { … }` block so there's nothing to wire per-lesson). **Prefer folding into `components.css`** to avoid touching 11 files and to keep the "shared CSS is already linked everywhere" guarantee.

---

## 3. What to HIDE in print (`display: none`)

All of these are screen-only chrome or dead-on-paper controls:

- `.topbar` and everything in it: `.toc-btn`, `.toc-drop`, `.theme-toggle`, `.topbar-home-btn`.
- `.next-cue` / `[data-next]` buttons (the "scroll to next section" affordances).
- The `.lightbox-overlay` (never relevant in print).
- Widget/interaction controls that can't function on paper: `.w-buttons` (Check/Reset), `.step-controls` (prev/next/dots), `.scrub-container` slider UI, `.zoom-rail`, recall `.actions` (Check/Reveal/Reset), `[data-scheme]` toggle buttons, `[data-more]`/`[data-peek]` toggle buttons.
- Any `.gc-tooltip` element (it's body-appended and hidden anyway).

Keep the **content** those controls used to gate — just remove the control itself (§4).

---

## 4. What to REVEAL / EXPAND in print — the hard part

The whole point of these pages is commit-before-reveal. For a printout that content must be **unrolled**. There are two categories, handled differently:

### 4a. Static collapsibles — pure CSS, easy
These already exist in the DOM; they're just collapsed via `max-height:0; overflow:hidden`. Force them open in `@media print`:
- `.reveal { opacity: 1 !important; transform: none !important; }` (the scroll-fade-in — otherwise everything below the fold prints invisible; this is the single most important print rule).
- `.more-body { max-height: none !important; opacity: 1 !important; overflow: visible !important; }` — and same for `.peek-box`, `.reveal-box`, `.scheme`.
- Recall `.blank` inputs: show the answer. The answer lives in `data-answer` (pipe-separated alternates — use the first). Render it into the blank, e.g. via a `::after` on a print class, or have the JS hook (§4b) write the first `data-answer` value into each empty blank and style it as the "shown" state (green, matching the existing `.blank.shown`). CSS alone can't read `data-answer` into visible text reliably across print engines, so **do this in the JS hook.**

### 4b. Dynamically-injected widget content — needs a JS hook
This is the real complication. The commit-reveal / faded-example / scaffold / step-builder widgets store their answer, model-answer, and mark-scheme HTML in a `<script type="application/json" class="w-config">` block, and `core.js` injects it into `.w-reveal-area` (and fills scaffold cells, etc.) **only after the student commits.** At page load and at print time, that content is **not in the DOM** — so CSS can't reveal what isn't there.

**Fix:** add a `preparePrint()` / `restoreAfterPrint()` pair to `core.js`, wired to `window.matchMedia('print')` change events (and `beforeprint`/`afterprint` as a fallback — Safari fires the events, Chrome fires the matchMedia change). On `beforeprint`:
1. For every `[data-widget]`, read its `.w-config` JSON and render a **print-only static block** appended after the widget (class `.print-only`, `display:none` on screen, `display:block` in print) containing:
   - the prompt,
   - for `choice` mode: the options with the correct one marked (green ✓) and each option's feedback shown beneath,
   - for `free` mode: the model answer,
   - the full `reveal` HTML (which may itself contain a nested scaffold table with answers — resolve those `blank.answer` values into the cells),
   - for `faded-example` / `step-builder`: the model steps and each blank's correct answer.
2. Fill any empty recall `.blank` with its first `data-answer` value, add the `.shown` class.
3. Set light mode: remember the current `:root.dark` state, remove `dark`.

On `afterprint`: remove every `.print-only` block, clear the injected blanks, and restore the remembered dark state. **Leave the live interactive DOM exactly as it was** — a student who prints then keeps studying must not find their widgets pre-answered.

Reuse the widgets' existing config-reading and answer-rendering functions where possible rather than re-implementing them; factor the "render reveal content from config" logic out of the commit handlers so both commit and print can call it.

> **Simpler fallback if the JS hook proves too involved:** ship an author-facing **"Printer-friendly version"** button (top of each lesson, itself `display:none` in print) that switches the whole page into a persistent fully-revealed static mode by programmatically committing/revealing every widget, then the author prints. Less elegant (mutates on-screen state) but far less code, and fine for an author generating handouts. Note this as the escape hatch; attempt the clean `beforeprint` hook first.

---

## 5. Page layout, breaks, and headers

- `@page { size: Letter; margin: 18mm 16mm; }` — Letter for a US high-school context; make it easy to swap to A4.
- Running header/footer via `@page` margin boxes where supported, else a fixed-position `.print-header`/`.print-footer` element injected by the hook: lesson title + unit top-left, page number bottom-right. Chrome's `page.pdf()` (batch path) also supports `headerTemplate`/`footerTemplate` — use those for the batch route and CSS margin boxes for the browser route.
- **Page-break discipline** (avoid ugly splits):
  - `section, .diagram, .exam-frame, [data-widget], .callout, .compass-wrap, .single-atom-wrap, .octet-wrap { break-inside: avoid; }`
  - `h2, h3, h4 { break-after: avoid; }` (don't orphan a heading at a page bottom).
  - `.section-tag { break-before: page; }` *only if* the author wants each numbered section to start on a fresh page (see §9 decision 1 — this is the "one section per page" vs "continuous flow" choice).
- Let large SVGs shrink to fit page width: they're already `width:100%`, so they will; just confirm none overflow the printable width and none are clipped by an `overflow:hidden` ancestor (the `.step-stage` is `overflow:hidden` — in print, since all step frames are shown stacked (§4/§6), switch `.step-stage` to `overflow:visible; height:auto; position:static` and its `[data-step]` children to `position:static; opacity:1` so every frame prints in flow with its label).

---

## 6. Motion primitives in print

- **Step (`data-motion="step"`):** show **all** frames, stacked vertically, each labelled with its step label (`data-step-labels`), because a reader can't click through on paper. In print CSS: `.step-stage{position:static;height:auto!important;overflow:visible;}` and `.step-stage [data-step]{position:static!important;opacity:1!important;visibility:visible!important;}`; the JS hook prepends each frame's step label as a small caption.
- **Scrub (`data-motion="scrub"`):** a slider is meaningless on paper. Print the diagram at a representative value (its `data-scrub-value` initial, or its `data-scrub-target` if set) and print the target prompt text as a caption. Hide the slider track/thumb.
- **Zoom (`data-motion="zoom"`):** show all levels stacked with their level names as captions (macro → meso → particulate), hide the rail. Same static-flow treatment as step.

---

## 7. Theme & background

- Force light: the JS hook removes `:root.dark` before printing and restores it after. Belt-and-suspenders: in `@media print`, hard-set the light `--paper*`/`--ink*` values (or just `background:#fff; color:#000` on `body` and let component borders carry structure).
- **Drop the graph-paper grid** in print (`body{background-image:none!important;}`) — it either doesn't print or muddies the page. Clean white ground.
- Ensure the Google Fonts `@import` still resolves — it does when printing from a browser with network access; for the batch script, wait for `document.fonts.ready` before calling `page.pdf()`.

---

## 8. Glossary handling (nice-to-have)

Tooltips can't work on paper. Two options, both optional:
- **Minimal:** keep the dashed-underline styling on `<strong class="term">` (it reads fine as "this is a key term") and do nothing else.
- **Enhanced (recommended if time allows):** the print hook collects every `<strong class="term">` slug used on the page, looks each up in `window.GC_GLOSSARY`, and appends a **"Key terms" glossary appendix** section at the end of the printout (term + definition, alphabetized). This turns the lost tooltips into a genuine study asset. Mark it `.print-only`.

---

## 9. Decisions to surface to the author BEFORE building

1. **Page-break style:** each numbered section starts on a fresh page (cleaner, more pages) **vs.** continuous flow with smart break-avoidance (fewer pages, more textbook-like). *Recommend: continuous flow* — it's less wasteful and matches how the page reads on screen.
2. **Batch generator wanted?** Just the ⌘P/browser path (deliverable A), or also the headless-Chrome batch script that spits out `dist/pdf/*.pdf` for all 11 lessons (deliverable B)? *Recommend: build A first, ship it, then add B only if the author wants a one-command full set.*
3. *(Minor)* **Glossary appendix:** include it (§8 enhanced) or skip (§8 minimal)? *Recommend: include — cheap and pedagogically nice.*

---

## 10. Build order

1. `@media print` block in `components.css` (or new `print.css` folded in): §3 hides, §4a CSS reveals, §5 page layout + break rules, §6 motion static-flow, §7 theme/background. Get a browser ⌘P of `1-1b` looking clean with just CSS — most content is static and will already come out mostly right.
2. `preparePrint()`/`restoreAfterPrint()` in `core.js` wired to `matchMedia('print')` + `beforeprint`/`afterprint`: §4b widget unrolling, recall-blank filling, light-mode force, (optional) §8 glossary appendix. Refactor the widgets' reveal-rendering into a reusable function first.
3. Verify against the checklist (§11) on the reference build `1-1b` and one widget-heavy lesson (`C-RXN` or `2-7c`).
4. *(If decision 2 = yes)* `scaffold/tools/make-pdfs.mjs` batch generator; output to `dist/pdf/` (add `dist/` to `.gitignore`).

---

## 11. Verification checklist (before declaring done)

Generate a real PDF (browser ⌘P → Save as PDF) for **`1-1b`** (reference) and **`C-RXN`** (widget/stepper/diagram heavy) and confirm:
- [ ] Nothing below the first screen is invisible (the `.reveal` opacity fix is working).
- [ ] Every commit-reveal widget shows its prompt, the correct answer marked green, and its reveal/model text — no empty answer boxes.
- [ ] Every recall blank shows its answer; every exam mark-scheme (`.scheme`) is expanded.
- [ ] All step-motion frames print stacked with labels; no frame missing; the `.step-stage` isn't clipping.
- [ ] Zoom/scrub visuals print as static annotated diagrams, no dead sliders/rails.
- [ ] No topbar, TOC, theme toggle, next-cue buttons, or lightbox on the page.
- [ ] Light mode, white ground, no graph-paper, fonts embedded and correct.
- [ ] No diagram clipped at a page edge; headings not orphaned; widgets/exam frames not split mid-box.
- [ ] After printing, the **on-screen** page is untouched — widgets still un-committed, dark mode restored if it was on.
- [ ] (If built) glossary appendix lists exactly the terms used on that page with correct definitions.

---

## 12. Files this feature adds/touches

- **Touches:** `scaffold/assets/components.css` (the `@media print` block) and `scaffold/assets/core.js` (the print hook). Possibly each lesson `<head>` *only if* you go the separate-`print.css`-`<link>` route instead of folding into `components.css` — the fold-in route is preferred precisely to avoid this.
- **Adds (optional):** `scaffold/tools/make-pdfs.mjs` and a `dist/` output dir (git-ignored).
- **Does not touch:** lesson prose/content, `glossary.js`, `elements.js`, `lessons.json`, the deploy workflow.
