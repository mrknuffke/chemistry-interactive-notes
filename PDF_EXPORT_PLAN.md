# PDF_EXPORT_PLAN.md — Pretty, Well-Formatted Lesson Printouts

**Status: BUILT AND VERIFIED (2026-07-06, by Sonnet).** All of §5's build order is implemented in `scaffold/assets/components.css` (the `@media print` block) and `scaffold/assets/core.js` (the print hook + topbar Print button). Verified via headless Chrome (print-media emulation + `Page.printToPDF`) against `1-1b` (reference build, no widgets) and `C-RXN` (6 widgets across every type, 1 step-motion primitive): every commit-reveal/faded-example/scaffold/step-builder widget unrolls its correct answer and feedback; recall blanks, predict checkmarks, mark schemes, and peek boxes all expand; step/zoom frames print stacked with captions; the glossary appendix lists exactly the page's terms, alphabetized; restore-symmetry and the never-touch-`localStorage` constraint were confirmed programmatically (dark mode, student-typed answers, and progress data are byte-for-byte restored after printing). One fix was needed beyond the original spec: `.zoom-stage` has a fixed `aspect-ratio` + `overflow:hidden` that clipped stacked zoom layers once they went static — added `height:auto; aspect-ratio:auto; overflow:visible` to the print override for it.

**Known accepted gap:** bespoke per-lesson interactives built outside the shared widget/motion framework (e.g. `C-RXN`'s hand-built "visual equation balancer," Bohr-model builders, trend explorers) print their live control chrome (+/− buttons, etc.) at whatever state they're in on load, since unrolling them would mean touching per-lesson JS — explicitly out of scope (this plan touches only the two shared asset files). Not a regression: these controls were never gated content, just live UI, and the diagram/state they show is still legible on paper.

<details><summary>Original planning history (resolved 2026-07-06, before implementation)</summary>

**Status before build: READY TO IMPLEMENT.** This spec was rewritten (by Fable, 2026-07-06) to be directly executable: it is grounded in the actual code of `scaffold/assets/core.js` and `scaffold/assets/components.css` as of commit `dacc4f2`, with exact selectors, config schemas, and line anchors. Honor every invariant in `CLAUDE.md` §3 and the zero-build ethos (shared assets, no bundler, no framework).

</details>

**Goal:** Any lesson page turns into a clean, print-quality PDF via the browser's ⌘P / "Save as PDF" (plus a Print button in the topbar). The PDF reads like a polished handout of the whole lesson: all prose, every diagram, and — critically — all answer/reveal content that is normally gated behind interaction, unrolled into static form.

**Resolved author decisions:**
1. **Page breaks:** continuous flow with strict break-avoidance around boxes/diagrams/headings. NOT one-section-per-page.
2. **No batch generator.** Instead, a **Print button** in the topbar of every lesson (injected by `core.js`, like the existing Home button) that calls `window.print()`. Headless-Chrome batch output is deferred indefinitely.
3. **Glossary appendix: yes** — append an alphabetized "Key terms" section to the printout.

---

## 1. Binding constraints

1. **Zero-build.** All print CSS goes in an `@media print` block appended to `scaffold/assets/components.css` (already linked from every lesson — touch no lesson HTML). All print JS goes in `scaffold/assets/core.js`, **inside the existing IIFE** (so it can use the `$`/`$$` helpers and `currentLesson`), placed after the motion-primitive functions and before the final init calls at core.js:1955.
2. **Don't degrade the on-screen experience.** Print mode is additive. Every DOM mutation made for printing must be undone after printing — a student who prints mid-study must find their page exactly as they left it (widgets un-committed, dark mode restored, blanks as they typed them).
3. **Never touch progress tracking.** The print path must never call `markCheckpointCompleted()` or write to `localStorage`. (This is why the print hook must NOT programmatically drive sliders, click options, or call `updateZoomLevel` — those paths mark checkpoints. Build static print blocks instead.)
4. **Don't refactor the live widget code.** The earlier draft of this plan suggested factoring reveal-rendering out of the commit handlers. **Don't** — that risks regressions across all 12 lessons. Instead write standalone, pure "render print block from config" functions (§4c). The widget `.w-config` JSON stays in the DOM after init (core.js:481 only reads `textContent`), so config is always re-readable at print time.
5. **Match the visual language.** Same fonts, vermilion accent, green = correct. Light mode only on paper; no graph-paper grid (white ground).
6. **Honest on paper.** No empty answer boxes, no dead controls. Every gate is unrolled.

---

## 2. Ground truth: how the code actually works (verified against source)

An implementer should skim these anchors before writing anything:

- **core.js is one IIFE** (`(function () { ... })()`, lines 17–1963). Helpers `$`/`$$` at top; `currentLesson` at line 38 (`{id, slug, title}` or `undefined` on non-lesson pages); final init calls at lines 1955–1962.
- **Theme:** dark mode = `dark` class on `document.documentElement` (core.js:130).
- **Scroll-fade:** `.reveal` starts `opacity:0; transform:translateY(18px)` (components.css:42) and gets `.in` from an IntersectionObserver. **Without a print override, everything below the fold prints invisible.**
- **Static collapsibles** (already in DOM, just collapsed via `max-height:0; overflow:hidden`): `.more-body` (+`.open`), `.reveal-box` (+`.show`, used by predict), `.peek-box` (+`.show`), `.scheme` (+`.show`). See components.css:85, 161, 185, 194.
- **Predict:** `[data-predict]` group of `.opt` buttons; the correct one carries `data-correct="true"` in the markup, so pure CSS can mark it. The paired `[data-reveal="key"]` box is a `.reveal-box`.
- **Recall blanks:** `.blank` inputs with `data-answer="a|alt"` (pipe-separated). The live Reveal handler (core.js:214) sets `b.value = b.dataset.answer.split('|')[0].replace(/-/g, ' ')` and adds class `shown` (dashed green style, components.css:172). The print hook must reproduce exactly this transform, **including the `-`→space replace**.
- **Widgets:** `[data-widget]` elements each contain `<script type="application/json" class="w-config">`. `initWidgets()` (core.js:476) dispatches on `el.dataset.widget`: `commit-reveal` | `faded-example` | `scaffold` | `step-builder`. Reveal/model/answer content lives **only in the config JSON** until the student commits — it is not in the DOM at print time. Config schemas in §4c.
- **Widget chrome classes:** controls are `.w-controls` > `.w-feedback` + `.w-buttons` (Check/Reset); per-step check buttons are `.w-step-check-btn`; reveal container is `.w-reveal-area`.
- **Reveal HTML can nest widgets and motion primitives** — after injecting `config.reveal`, the live code calls `initWidgets()` + `initMotionPrimitives()` again (e.g. core.js:606). The print renderer must handle nested `[data-widget]` found inside reveal HTML it injects (§4c, last bullet).
- **Faded-example** renders its worked model inside `<details class="faded-model-collapsible">` (core.js:821) — a real `<details>`, so CSS alone can't open it; the hook must set `.open = true` and restore.
- **Step motion:** `[data-motion="step"]` gets a `.step-stage` whose **height is set as an inline style in px** (core.js:1587) — print CSS needs `height:auto !important` (important beats inline). Frames are `[data-step]` children, absolutely positioned/crossfaded (components.css:1506–1521); labels come from the container's `data-step-labels="A|B|C"`.
- **Scrub motion:** slider + `.scrub-label-row` readout + `.scrub-marks` + `.scrub-target-msg`. Moving the slider fires `handleScrubUpdate` which can call `markCheckpointCompleted` — **do not drive it from the print hook** (constraint §1.3). Print the diagram at its current state; hide the slider chrome. (Deliberate deviation from the earlier draft.)
- **Zoom motion:** layers carry `.zoom-level-layer` (+`.active`), buttons in `.zoom-rail`; the macro SVG may carry an inline `transform: scale(4)` if the student left it zoomed (core.js:1902) — print CSS must force `transform:none !important`.
- **Step-builder's linked SVG** (`updateSVGState`, core.js:1416) sets inline `display:none` on state layers. Accepted limitation: the diagram prints at its current state; the print block carries all steps' Q&A instead. Don't try to unroll the SVG layers (they overlap by design).
- **Glossary:** `window.GC_GLOSSARY[slug] = {term, definition, example?}`. Slug logic (core.js:355–362): `el.dataset.term` if set, else textContent lowercased, strip `[^a-z0-9\s-]`, trim, spaces→hyphens. It's private to `initGlossaryTooltips` — duplicate those 4 lines in the print hook; don't refactor.
- **Topbar:** `.topbar` > `.topbar-left` (Home btn injected at core.js:41, `#tocBtn`) + `.topbar-right` (`#themeToggle`). The lightbox overlay and `.gc-tooltip` are body-appended. A `.textbook-nav` prev/next footer is injected before `.footer`.

---

## 3. Deliverable 1 — the `@media print` CSS block

Append to the **end of `scaffold/assets/components.css`**. This exact block is the starting point (tune values only if verification shows a need):

```css
/* ============================================================
   PRINT / PDF EXPORT — see PDF_EXPORT_PLAN.md
   ============================================================ */
.print-only{display:none;}
@page{size:letter;margin:18mm 16mm;}

@media print{
  /* 1 — hide screen chrome & dead-on-paper controls */
  .topbar,.next-cue,.lightbox-overlay,.gc-tooltip,.textbook-nav,
  .w-buttons,.w-step-check-btn,.step-controls,
  .scrub-slider-wrapper,.scrub-marks,.scrub-target-msg,.zoom-rail,
  [data-recall-check],[data-recall-reveal],[data-recall-reset],
  [data-more],[data-peek],[data-scheme],
  .print-btn,.faded-model-collapsible>summary{display:none!important;}

  body{padding-top:0!important;background-image:none!important;}

  /* 2 — force-reveal everything that is merely collapsed */
  .reveal{opacity:1!important;transform:none!important;}
  .more-body,.peek-box,.scheme,.reveal-box{
    max-height:none!important;opacity:1!important;overflow:visible!important;margin-top:1rem;
  }
  [data-predict] .opt[data-correct="true"]{border:2px solid var(--good)!important;}
  [data-predict] .opt[data-correct="true"]::after{content:" \2713";color:var(--good);font-weight:700;}

  /* 3 — motion primitives go static (print all frames in flow) */
  .step-stage{position:static!important;height:auto!important;overflow:visible!important;}
  .step-stage [data-step]{position:static!important;opacity:1!important;visibility:visible!important;transform:none!important;}
  .zoom-stage .zoom-level-layer{position:static!important;opacity:1!important;visibility:visible!important;}
  .zoom-stage svg{transform:none!important;}

  /* 4 — page-break discipline (continuous flow, clean breaks) */
  .diagram,.exam-frame,[data-widget],.callout,.recall{break-inside:avoid;}
  h2,h3,h4{break-after:avoid;}

  /* 5 — print-only blocks injected by the core.js hook */
  .print-only{display:block!important;}
  body.gc-printing [data-widget]>*:not(.print-only){display:none!important;}
}
```

Notes for the implementer:

- **The `body.gc-printing` gate** (rule 5) is what swaps each widget's interactive DOM for its static print block. The hook adds/removes that class (§4). If the hook ever fails, printing degrades gracefully: widgets print in whatever visible state they're in, instead of printing blank.
- **Don't put `break-inside:avoid` on `section`** — sections are routinely taller than one page and the rule would do nothing (browsers ignore un-satisfiable avoids) or produce odd gaps. Box-level elements only.
- Light mode is forced by the JS hook removing the `dark` class (§4). As belt-and-suspenders you may add `:root{color-scheme:light;}` inside the media block, but do not duplicate token values.
- Diagrams are already `width:100%`-fluid; after the stage/layer overrides above, verify none is clipped by a remaining `overflow:hidden` ancestor.

**Verify gate for this step:** serve the site (`python3 -m http.server` from `scaffold/`), open `1-1b` in Chrome, ⌘P preview. Everything below the fold visible; no topbar/nav; static collapsibles all open; step frames stacked; white background. Widget answers will still be missing — that's step 2.

---

## 4. Deliverable 2 — the print hook in `core.js`

### 4a. Wiring

Inside the IIFE, before the final init calls:

```js
let printPrepared = false;
const printUndo = [];   // stack of undo functions; restore runs them in reverse

function preparePrint() {
  if (printPrepared) return;   // beforeprint AND matchMedia can both fire
  printPrepared = true;
  /* ... §4b–4e ... */
}
function restoreAfterPrint() {
  if (!printPrepared) return;
  printPrepared = false;
  while (printUndo.length) printUndo.pop()();
}
window.addEventListener('beforeprint', preparePrint);
window.addEventListener('afterprint', restoreAfterPrint);
const pmq = window.matchMedia('print');   // Safari fallback
pmq.addEventListener('change', m => m.matches ? preparePrint() : restoreAfterPrint());
```

Every mutation in `preparePrint` pushes its inverse onto `printUndo` — injected nodes push a `node.remove()`, class/attribute changes push their restoration. This single mechanism guarantees the restore-symmetry constraint. `afterprint` also fires when the user cancels the dialog — the symmetry handles that for free.

### 4b. What `preparePrint` does, in order

1. Add class `gc-printing` to `document.body` (activates CSS rule 5). Undo: remove it.
2. **Force light mode:** if `document.documentElement.classList.contains('dark')`, remove `dark`. Undo: re-add. Do **not** touch `localStorage`.
3. **Inject a print header** as the first child of `document.body`: a `.print-only` div with `currentLesson.id + ' · ' + currentLesson.title` (fall back to `document.title` when `currentLesson` is undefined), mono font, hairline bottom border. Undo: remove.
4. **Fill empty recall blanks:** for every `.recall .blank` with no value, set `b.value = b.dataset.answer.split('|')[0].replace(/-/g, ' ')` and add class `shown`. Undo: clear value, remove class. **Skip blanks the student has filled** (leave their answers, right or wrong — honest printout of their state).
5. **Open faded-example models:** every `details.faded-model-collapsible` not already open gets `.open = true`. Undo: set back to false.
6. **Render one static print block per `[data-widget]`** (§4c), appended as the widget's last child with class `print-only`. Undo: remove.
7. **Caption step frames:** for each `[data-motion="step"]`, read `data-step-labels` (split on `|`) and prepend a small `.print-only` caption ("Step n — label") inside each `[data-step]` frame. Same idea for `[data-motion="zoom"]` layers using `data-zoom-labels` (defaults: Out/Mid/In). Run this **after** step 6 so frames inside freshly injected reveal HTML get captions too.
8. **Glossary appendix** (§4d), injected before `.footer`.

### 4c. The static widget renderer — config schemas

Write one pure function `renderWidgetPrint(el)`: parse `JSON.parse($('.w-config', el).textContent)` (guard: no config → return null), dispatch on `el.dataset.widget` (+ `config.mode`), return a detached `.print-only` element. It must **never** call `markCheckpointCompleted` or touch the widget's live children. Content per type (schemas verified against `initCommitReveal`/`initFadedExample`/`initScaffold`/`initStepBuilder`):

| Widget / mode | Config shape | Print block contents |
|---|---|---|
| `commit-reveal` / `choice` (default) | `prompt`, `options[] {label, correct, feedback}`, `reveal` (HTML) | Prompt; each option with the correct one marked green ✓; each option's `feedback` in smaller italic beneath it; then the `reveal` HTML. |
| `commit-reveal` / `free` | `prompt`, `minChars?`, `reveal` | Prompt; "Model answer" heading + `reveal`. |
| `commit-reveal` / `drill` | `items[] {prompt, options[]{label, correct, feedback}}`, `reveal?` | Each item: its prompt, the correct option ✓ green, that option's feedback; then `reveal` if present. |
| `faded-example` | `model {title, steps[]{label, work, why}}`, `yours {title, checkMode?, steps[]{label, given} or {label, blank}}`; `blank = {type: numeric|text|choice, prompt?, options?, answer, tol?, feedback_right?, feedback_wrong?}` | The model panel is already in the DOM (opened in §4b.5) — don't duplicate it; but note CSS rule 5 hides widget children, so **exempt it**: also add `.print-only` class to the existing `.faded-model-collapsible` (undo: remove class). The block renders the `yours` steps: label + `given` text, or label + the blank's answer in green (`answer[0]` if array; for `choice` type the answer is the correct option's text). |
| `scaffold` / `bank` | `bank[] {text, slot, feedback?}`, `slots[] {id, label}`, `chain?` | Each slot label followed by the bank item whose `.slot === slot.id`, in order, marked green. |
| `scaffold` / `free` (default) | `slots[] {label, model}` | Each slot label + "Model answer" + `slot.model`. |
| `scaffold` / `table` | `table {headers[], rows[][]}`; cell = `{given}` or `{blank {type, answer, tol?}}` | A static `<table class="w-table">`: headers, `given` cells as-is, blank cells showing `answer` (first element if array) styled green. |
| `step-builder` | `steps[] {question, state?, options[]{label, correct, feedback}}`, `finale?` (HTML), `diagramId?` | Each step: question, correct option ✓ green, its feedback; then the `finale` HTML. |

**Nested widgets:** after setting a print block's `innerHTML` from `reveal`/`finale`, query it for `[data-widget]` and replace each with `renderWidgetPrint(nested)` output (the nested `.w-config` script is part of the reveal HTML string). One level of recursion is enough in practice, but the recursive call costs nothing.

Escaping: `prompt`/`reveal`/`feedback`/`label` values are trusted authored HTML — inject with `innerHTML`, matching how the live code treats them. Plain answers (recall/table/faded blanks) should go in via `textContent`.

Styling: give the block a class like `w-print-static` and add minimal rules for it **inside** the `@media print` block (green `var(--good)` for correct marks, `.w-feedback`-like smaller italic for feedback lines). Reuse existing classes (`.w-table`, `.scheme-card`-style boxes) where they fit; don't invent a parallel design system.

### 4d. Glossary appendix

Collect every `strong.term` on the page, compute each slug (duplicate the 4-line normalizer from core.js:355–362, honoring `data-term`), look up `window.GC_GLOSSARY` (guard for undefined — `glossary.js` loads after `core.js`, which is fine since this runs at print time), dedupe, drop misses silently, sort by `entry.term.localeCompare`. Inject before `.footer`:

```html
<section class="print-only print-glossary">
  <h2>Key terms in this lesson</h2>
  <dl> <dt>term</dt><dd>definition <em>example</em></dd> … </dl>
</section>
```

### 4e. Print button

A small IIFE next to the Home-button injector (core.js:41–52), same pattern: guard `const right = $('.topbar-right'); if (!right) return;`, create `<button class="toc-btn print-btn" type="button">` with a printer SVG (stroke `currentColor`, matching the Home icon's style) + text "Print", `addEventListener('click', () => window.print())`, insert as first child of `.topbar-right`. It's hidden in print by CSS rule 1. `window.print()` fires `beforeprint`, so the button needs no other logic.

---

## 5. Build order (with verify gates)

1. **CSS block** (§3) → verify: ⌘P preview of `1-1b` per the gate in §3.
2. **Print hook** (§4a, 4b, 4c) → verify: ⌘P of `1-1b` and `C-RXN` shows every widget's answers/model text; then close the dialog and confirm the live page is untouched (widgets un-committed, dark mode back if it was on, recall blanks as before).
3. **Glossary appendix + print header** (§4b.3, §4d) → verify: appendix lists exactly the page's terms, alphabetized, correct definitions.
4. **Print button** (§4e) → verify: appears on every lesson topbar in light and dark mode, triggers the dialog, absent from the printout.
5. Run the full checklist (§6). Then update `TODO.md` (mark item 1 done) and note completion at the top of this file.

Self-check tip: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --print-to-pdf=/tmp/out.pdf "http://localhost:8000/lessons/1-1b_periodic-trends-reactivity.html"` produces a real PDF you can open and inspect without a human at the dialog. Headless print-to-pdf applies `@media print` and fires `beforeprint` in current Chrome; if the hook content is missing from the PDF, test `beforeprint` manually in a headed browser before assuming the hook is broken. **Final sign-off still requires a real ⌘P check in a headed browser, light and dark mode.**

## 6. Verification checklist (before declaring done)

Generate real PDFs for **`1-1b`** (reference build) and **`C-RXN`** (widget/stepper/diagram heavy) and confirm:
- [ ] Nothing below the first screen is invisible (the `.reveal` fix works).
- [ ] Every commit-reveal widget prints prompt + correct answer marked green + feedback + reveal/model text — no empty answer boxes, no Check/Reset buttons.
- [ ] Every recall blank shows an answer (spaces, not hyphens); every mark scheme (`.scheme`) and peek/more box is expanded; predict options show the ✓.
- [ ] All step-motion frames print stacked with their labels; `.step-stage` isn't clipping (inline height overridden).
- [ ] Zoom layers print stacked and untransformed; scrub prints its diagram + readout with no slider chrome.
- [ ] No topbar, TOC, theme toggle, next-cue, textbook-nav, Print button, or lightbox in the output.
- [ ] Light mode, white ground, no graph-paper grid; correct fonts.
- [ ] No diagram clipped at a page edge; headings not orphaned; widgets/exam frames/diagrams not split mid-box.
- [ ] Glossary appendix: exactly the page's terms, alphabetized, correct definitions.
- [ ] **After printing (and after cancelling the dialog): the on-screen page is exactly as before** — widgets un-committed, student-typed blank values intact, dark mode restored, no stray `.print-only` nodes or `gc-printing` class in the DOM.
- [ ] `localStorage.getItem('gc-textbook-progress')` unchanged by the whole print cycle.

## 7. Files touched

- `scaffold/assets/components.css` — the `@media print` block (§3) appended at the end.
- `scaffold/assets/core.js` — print hook + Print button, inside the existing IIFE.
- **Nothing else.** No lesson HTML, no `glossary.js`/`elements.js`/`lessons.json`, no new files, no dependencies.

## 8. Known pitfalls (each of these caused a rejected approach — don't rediscover them)

1. **Don't drive live widgets to "reveal" them** (clicking options, moving sliders, calling `updateZoomLevel`): those paths call `markCheckpointCompleted` and pollute student progress, and mutating live state is what the restore constraint exists to prevent. Static print blocks only.
2. **Don't refactor the commit handlers** to share rendering code — standalone renderers reading `.w-config` are lower-risk and sufficient.
3. `beforeprint` and the `matchMedia('print')` listener **can both fire** for one print — the `printPrepared` guard is mandatory.
4. The `.step-stage` height is an **inline style** — only `!important` in the print CSS overrides it.
5. Recall answers use the `-`→space transform (core.js:214) — printing raw `data-answer` values prints hyphenated slugs.
6. `<details>` can't be opened by CSS — the faded-example model panel needs the JS hook.
7. The `body.gc-printing` gate hides **all** non-`.print-only` widget children — remember the faded-example model-panel exemption (§4c) or the worked example vanishes from print.
