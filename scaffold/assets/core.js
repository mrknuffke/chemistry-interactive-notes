/* ============================================================
   GEN CHEM INTERACTIVES — CORE BEHAVIORS
   Shared across every lesson. Lesson-specific interactives
   (Bohr builder, trend explorer, BCA table, etc.) live in their
   own per-lesson JS file, NOT here.

   These widgets are data-attribute driven so any number of them
   can appear in one page:
     [data-next]                 → scroll to next <section>
     [data-more] + .more-body     → expand/collapse dense block
     [data-predict] + [data-reveal="key"] → predict-then-reveal
     .recall (container) with .blank inputs and
        [data-recall-check] [data-recall-reveal] [data-recall-reset] [data-recall-feedback]
     [data-peek] + following .peek-box → reveal model answer
     [data-scheme] + following .scheme → reveal mark scheme
   ============================================================ */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- lessons manifest & progress helpers ---- */
  const LESSONS_MANIFEST = [
    { id: "1-1a", slug: "1-1a_atomic-structure-electron-config", title: "Atomic Structure & Electron Configuration" },
    { id: "1-1b", slug: "1-1b_periodic-trends-reactivity", title: "Periodic Trends & Reactivity" },
    { id: "1-2a", slug: "1-2a_bonding-electronegativity", title: "Bonding & Electronegativity" },
    { id: "1-3a", slug: "1-3a_lewis-structures", title: "Lewis Structures" },
    { id: "1-3b", slug: "1-3b_imfs-properties", title: "IMFs & Properties" },
    { id: "C-SPA", slug: "C-SPA_structure-property-argument", title: "Structure → Property → Argument" },
    { id: "2-2a", slug: "2-2a_physical-chemical-change", title: "Physical vs. Chemical Change & Particle Diagrams" },
    { id: "C-RXN", slug: "C-RXN_reaction-types-balancing", title: "Reaction Types & Balancing" },
    { id: "2-7a", slug: "2-7a_the-mole-molar-mass", title: "The Mole & Molar Mass" },
    { id: "2-7b", slug: "2-7b_mole-conversions", title: "Mole Conversions" },
    { id: "2-7c", slug: "2-7c_stoichiometry", title: "Stoichiometry" }
  ];

  const currentLesson = LESSONS_MANIFEST.find(l => window.location.pathname.includes(l.slug));

  /* ---- topbar home navigation button ---- */
  (function () {
    const topbarLeft = $('.topbar-left');
    if (!topbarLeft) return;
    const aHome = document.createElement('a');
    aHome.className = 'topbar-home-btn';
    aHome.href = '../index.html';
    aHome.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      Home
    `;
    topbarLeft.insertBefore(aHome, topbarLeft.firstChild);
  })();

  function markCheckpointCompleted(type, index) {
    if (!currentLesson) return;
    const lessonId = currentLesson.id;
    let progress = {};
    try { progress = JSON.parse(localStorage.getItem('gc-textbook-progress')) || {}; } catch (e) {}
    if (!progress[lessonId]) progress[lessonId] = {};
    progress[lessonId][`${type}-${index}`] = true;
    try { localStorage.setItem('gc-textbook-progress', JSON.stringify(progress)); } catch (e) {}
  }

  function updateLessonTotalCheckpoints() {
    if (!currentLesson) return;
    const lessonId = currentLesson.id;
    const total = $$('[data-predict]').length + $$('.recall').length + $$('[data-peek]').length + $$('[data-scheme]').length;
    let progress = {};
    try { progress = JSON.parse(localStorage.getItem('gc-textbook-progress')) || {}; } catch (e) {}
    if (!progress[lessonId]) progress[lessonId] = {};
    progress[lessonId]._total = total;
    try { localStorage.setItem('gc-textbook-progress', JSON.stringify(progress)); } catch (e) {}
  }

  /* ---- textbook navigation footer auto-injector ---- */
  (function () {
    if (!currentLesson) return;
    const idx = LESSONS_MANIFEST.indexOf(currentLesson);
    const prev = idx > 0 ? LESSONS_MANIFEST[idx - 1] : null;
    const next = idx < LESSONS_MANIFEST.length - 1 ? LESSONS_MANIFEST[idx + 1] : null;
    const footer = $('.footer');
    if (!footer) return;

    const nav = document.createElement('nav');
    nav.className = 'textbook-nav';

    if (prev) {
      const aPrev = document.createElement('a');
      aPrev.className = 'textbook-nav-link prev';
      aPrev.href = prev.slug + '.html';
      aPrev.innerHTML = `
        <span class="nav-meta">← Previous Lesson</span>
        <span class="nav-title">${prev.id} · ${prev.title}</span>
      `;
      nav.appendChild(aPrev);
    } else {
      nav.appendChild(document.createElement('div'));
    }

    const aIndex = document.createElement('a');
    aIndex.className = 'textbook-nav-link index';
    aIndex.href = '../index.html';
    aIndex.innerHTML = `
      <span class="nav-meta">Textbook</span>
      <span class="nav-title">☰ Home</span>
    `;
    nav.appendChild(aIndex);

    if (next) {
      const aNext = document.createElement('a');
      aNext.className = 'textbook-nav-link next';
      aNext.href = next.slug + '.html';
      aNext.innerHTML = `
        <span class="nav-meta">Next Lesson →</span>
        <span class="nav-title">${next.id} · ${next.title}</span>
      `;
      nav.appendChild(aNext);
    } else {
      nav.appendChild(document.createElement('div'));
    }

    footer.parentNode.insertBefore(nav, footer);
    updateLessonTotalCheckpoints();
  })();

  /* ---- theme ---- */
  (function () {
    const root = document.documentElement;
    let saved = null; try { saved = localStorage.getItem('gc-theme'); } catch (e) {}
    if (saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches)) root.classList.add('dark');
    const btn = $('#themeToggle');
    if (btn) btn.addEventListener('click', () => {
      root.classList.toggle('dark');
      try { localStorage.setItem('gc-theme', root.classList.contains('dark') ? 'dark' : 'light'); } catch (e) {}
    });
  })();

  /* ---- table of contents (built from section[data-toc]) ---- */
  (function () {
    const drop = $('#tocDrop'), btn = $('#tocBtn');
    if (!drop || !btn) return;
    const secs = $$('section[data-toc]');
    secs.forEach((s, i) => {
      const a = document.createElement('a');
      a.href = '#' + s.id;
      const n = (i === 0) ? '\u2022' : String(i).padStart(2, '0');
      a.innerHTML = '<span class="tnum">' + n + '</span>' + s.dataset.toc;
      a.addEventListener('click', () => drop.classList.remove('open'));
      drop.appendChild(a);
    });
    btn.addEventListener('click', e => { e.stopPropagation(); drop.classList.toggle('open'); });
    document.addEventListener('click', e => { if (!drop.contains(e.target) && e.target !== btn) drop.classList.remove('open'); });
  })();

  /* ---- next-section scroll ---- */
  $$('[data-next]').forEach(btn => btn.addEventListener('click', () => {
    const sec = btn.closest('section');
    let nxt = sec ? sec.nextElementSibling : null;
    while (nxt && nxt.tagName !== 'SECTION' && !nxt.classList.contains('footer')) nxt = nxt.nextElementSibling;
    if (nxt) nxt.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  /* ---- reveal on scroll ---- */
  (function () {
    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    }), { threshold: 0.12 });
    $$('.reveal').forEach(el => obs.observe(el));
  })();

  /* ---- expandable dense blocks ---- */
  $$('[data-more]').forEach(btn => btn.addEventListener('click', () => {
    const body = btn.nextElementSibling;
    if (!body) return;
    const open = body.classList.toggle('open');
    const label = btn.dataset.more || 'details';
    btn.textContent = open ? ('Hide ' + label + ' \u2191') : ('Show ' + label + ' \u2192');
  }));

  /* ---- predict-then-reveal ---- */
  $$('[data-predict]').forEach((group, idx) => {
    const box = $('[data-reveal="' + group.dataset.predict + '"]');
    let done = false;
    $$('.opt', group).forEach(opt => opt.addEventListener('click', () => {
      if (done) return; done = true;
      const ok = opt.dataset.correct === 'true';
      opt.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) { const c = $('[data-correct="true"]', group); if (c) c.classList.add('correct'); }
      if (box) box.classList.add('show');
      markCheckpointCompleted('predict', idx);
    }));
  });

  /* ---- fill-in-the-blank recall (scoped to each .recall container) ---- */
  const norm = s => s.trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/[.,]/g, '');
  $$('.recall').forEach((scope, idx) => {
    const blanks = $$('.blank', scope);
    const fb = $('[data-recall-feedback]', scope);
    const check = $('[data-recall-check]', scope);
    const reveal = $('[data-recall-reveal]', scope);
    const reset = $('[data-recall-reset]', scope);
    if (check) check.addEventListener('click', () => {
      let r = 0;
      blanks.forEach(b => {
        b.classList.remove('correct', 'wrong', 'shown');
        const ans = b.dataset.answer.split('|').map(norm), v = norm(b.value);
        if (!v) return;
        if (ans.includes(v)) { b.classList.add('correct'); r++; } else b.classList.add('wrong');
      });
      if (fb) { fb.textContent = r + ' / ' + blanks.length + ' correct'; fb.className = 'feedback ' + (r === blanks.length ? 'good' : 'accent'); }
      if (r === blanks.length) markCheckpointCompleted('recall', idx);
    });
    if (reveal) reveal.addEventListener('click', () => {
      blanks.forEach(b => { b.value = b.dataset.answer.split('|')[0].replace(/-/g, ' '); b.classList.remove('wrong', 'correct'); b.classList.add('shown'); });
      if (fb) { fb.textContent = 'Answers shown \u2014 try from memory next time.'; fb.className = 'feedback accent'; }
      markCheckpointCompleted('recall', idx);
    });
    if (reset) reset.addEventListener('click', () => {
      blanks.forEach(b => { b.value = ''; b.classList.remove('correct', 'wrong', 'shown'); });
      if (fb) { fb.textContent = ''; fb.className = 'feedback'; }
    });
  });

  /* ---- peek (model answer) ---- */
  $$('[data-peek]').forEach((btn, idx) => btn.addEventListener('click', () => {
    const box = btn.nextElementSibling;
    if (box && box.classList.contains('peek-box')) box.classList.toggle('show');
    markCheckpointCompleted('peek', idx);
  }));

  /* ---- mark-scheme reveal ---- */
  $$('[data-scheme]').forEach((btn, idx) => btn.addEventListener('click', () => {
    const box = btn.closest('.exam-frame') ? $('.scheme', btn.closest('.exam-frame')) : btn.nextElementSibling;
    if (!box) return;
    box.classList.toggle('show');
    btn.textContent = box.classList.contains('show') ? 'Hide mark scheme' : 'Reveal mark scheme';
    markCheckpointCompleted('scheme', idx);
  }));

  /* ---- diagram lightbox zoom ---- */
  (function () {
    let overlay = $('.lightbox-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Close image">&times;</button>
        <div class="lightbox-content"></div>
        <div class="lightbox-cap"></div>
      `;
      document.body.appendChild(overlay);
    }

    const content = $('.lightbox-content', overlay);
    const closeBtn = $('.lightbox-close', overlay);
    const cap = $('.lightbox-cap', overlay);

    function closeLightbox() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => {
        content.innerHTML = '';
        cap.innerHTML = '';
      }, 300);
    }

    $$('.diagram svg').forEach(svgEl => {
      svgEl.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Clone SVG and insert into content
        const clone = svgEl.cloneNode(true);
        clone.removeAttribute('style'); // Clear any local styling
        content.innerHTML = '';
        content.appendChild(clone);

        // Find caption if available
        const parent = svgEl.closest('.diagram');
        const capEl = parent ? $('.diagram-cap', parent) : null;
        if (capEl) {
          cap.innerHTML = capEl.innerHTML;
        } else {
          cap.innerHTML = '';
        }

        // Open
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close handlers
    overlay.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    content.addEventListener('click', e => e.stopPropagation()); // don't close when clicking image itself
    
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) {
        closeLightbox();
      }
    });
  })();

  /* ---- keyboard / clicker navigation ---- */
  (function () {
    const targets = () => $$('section,.footer').map(s => window.scrollY + s.getBoundingClientRect().top);
    function go(d) {
      const t = targets(), y = window.scrollY;
      let n = d > 0 ? t.find(p => p > y + 24) : [...t].reverse().find(p => p < y - 24);
      if (n == null) n = d > 0 ? t[t.length - 1] : 0;
      window.scrollTo({ top: n, behavior: 'smooth' });
    }
    document.addEventListener('keydown', e => {
      const tag = (e.target.tagName || '').toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) return;
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(1); }
      else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(-1); }
    });
  })();

  /* ---- glossary term tooltips ---- */
  function initGlossaryTooltips() {
    if (typeof window.GC_GLOSSARY === 'undefined') return;

    // Create the tooltip card dynamically and append to body
    let tooltip = $('#gc-glossary-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'gc-glossary-tooltip';
      tooltip.className = 'gc-tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.setAttribute('aria-hidden', 'true');
      tooltip.innerHTML = `
        <div class="gc-tooltip-term"></div>
        <div class="gc-tooltip-definition"></div>
        <div class="gc-tooltip-example"></div>
      `;
      document.body.appendChild(tooltip);
    }

    const termNameEl = $('.gc-tooltip-term', tooltip);
    const defEl = $('.gc-tooltip-definition', tooltip);
    const exEl = $('.gc-tooltip-example', tooltip);

    let activeTerm = null;
    let isTouch = false;

    // Detect touch usage
    window.addEventListener('touchstart', function onFirstTouch() {
      isTouch = true;
      window.removeEventListener('touchstart', onFirstTouch);
    }, { passive: true });

    // Normalize text helper to kebab-case
    const getSlug = el => {
      if (el.dataset.term) return el.dataset.term;
      return el.textContent
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    };

    // Position helper
    function positionTooltip(termEl) {
      const rect = termEl.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;
      const viewportWidth = document.documentElement.clientWidth;
      const padding = 12; // minimum boundary spacing

      let clientLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
      let shift = 0;

      if (clientLeft < padding) {
        shift = padding - clientLeft;
      } else if (clientLeft + tooltipWidth > viewportWidth - padding) {
        shift = (viewportWidth - padding) - (clientLeft + tooltipWidth);
      }

      tooltip.style.left = `${clientLeft + shift + scrollLeft}px`;
      tooltip.style.top = `${rect.top - tooltipHeight - 8 + scrollTop}px`; // 8px space for arrow/offset
      
      // Calculate arrow left position relative to tooltip width
      let arrowLeft = tooltipWidth / 2 - shift;
      // Clamp arrow to stay within the card bounds (avoid rounded corners)
      arrowLeft = Math.max(12, Math.min(tooltipWidth - 12, arrowLeft));
      tooltip.style.setProperty('--arrow-left', `${arrowLeft}px`);
    }

    function showTooltip(termEl, entry) {
      termNameEl.textContent = entry.term;
      defEl.textContent = entry.definition;
      if (entry.example) {
        exEl.textContent = entry.example;
        exEl.style.display = 'block';
      } else {
        exEl.style.display = 'none';
      }

      // Render hidden offscreen to measure dimensions first
      tooltip.style.left = '-9999px';
      tooltip.style.top = '-9999px';
      tooltip.classList.add('visible');
      tooltip.setAttribute('aria-hidden', 'false');

      positionTooltip(termEl);
      activeTerm = termEl;
    }

    function hideTooltip() {
      if (!activeTerm) return;
      tooltip.classList.remove('visible');
      tooltip.setAttribute('aria-hidden', 'true');
      activeTerm = null;
    }

    // Attach event listeners to term elements
    $$('strong.term').forEach(termEl => {
      const slug = getSlug(termEl);
      if (!window.GC_GLOSSARY[slug]) return;

      termEl.setAttribute('aria-describedby', 'gc-glossary-tooltip');
      termEl.style.cursor = 'help';

      // Hover triggers (ignored on touch devices)
      termEl.addEventListener('mouseenter', () => {
        if (isTouch) return;
        showTooltip(termEl, window.GC_GLOSSARY[slug]);
      });

      termEl.addEventListener('mouseleave', () => {
        if (isTouch) return;
        hideTooltip();
      });

      // Click / Tap triggers
      termEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (activeTerm === termEl) {
          hideTooltip();
        } else {
          showTooltip(termEl, window.GC_GLOSSARY[slug]);
        }
      });
    });

    // Dismiss handlers
    document.addEventListener('click', (e) => {
      if (activeTerm && !activeTerm.contains(e.target) && !tooltip.contains(e.target)) {
        hideTooltip();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideTooltip();
      }
    });

    // Update positions on resize
    window.addEventListener('resize', () => {
      if (activeTerm) {
        positionTooltip(activeTerm);
      }
    });
  }

  /* ============================================================
     WIDGET FRAMEWORK — DYNAMIC COMPONENT INITIALIZATION
     ============================================================ */

  function initWidgets() {
    $$('[data-widget]').forEach((el, idx) => {
      if (el.dataset.wInitialized) return;
      el.dataset.wInitialized = 'true';

      const configEl = $('.w-config', el);
      if (!configEl) return;
      let config = {};
      try {
        config = JSON.parse(configEl.textContent);
      } catch (e) {
        console.error('Invalid JSON config for widget:', el, e);
        return;
      }

      const type = el.dataset.widget;
      if (type === 'commit-reveal') {
        initCommitReveal(el, config, idx);
      } else if (type === 'faded-example') {
        initFadedExample(el, config, idx);
      } else if (type === 'scaffold') {
        initScaffold(el, config, idx);
      } else if (type === 'step-builder') {
        initStepBuilder(el, config, idx);
      }
    });
  }

  // --- Helpers for Controls & Reset ---
  function createWidgetControls(el, onCheck, onReset) {
    const controls = document.createElement('div');
    controls.className = 'w-controls';
    controls.innerHTML = `
      <div class="w-feedback" role="status" aria-live="polite"></div>
      <div class="w-buttons">
        <button class="w-btn w-btn-check" type="button">Check</button>
        <button class="w-btn w-btn-reset" type="button" style="display: none;">Reset</button>
      </div>
    `;
    el.appendChild(controls);

    const checkBtn = $('.w-btn-check', controls);
    const resetBtn = $('.w-btn-reset', controls);
    const feedback = $('.w-feedback', controls);

    checkBtn.addEventListener('click', () => onCheck(checkBtn, resetBtn, feedback));
    resetBtn.addEventListener('click', () => {
      onReset(checkBtn, resetBtn, feedback);
      resetBtn.style.display = 'none';
      checkBtn.style.display = '';
      feedback.textContent = '';
      feedback.className = 'w-feedback';
    });

    return { checkBtn, resetBtn, feedback };
  }

  // --- 1. Commit-Reveal Widget ---
  function initCommitReveal(el, config, widgetIdx) {
    const mode = config.mode || 'choice';
    
    // Create prompt
    const promptDiv = document.createElement('div');
    promptDiv.className = 'w-prompt';
    promptDiv.innerHTML = config.prompt || '';
    el.appendChild(promptDiv);

    // Create workspace
    const workspace = document.createElement('div');
    workspace.className = 'w-workspace';
    el.appendChild(workspace);

    // Create reveal area
    const revealArea = document.createElement('div');
    revealArea.className = 'w-reveal-area';
    revealArea.style.display = 'none';
    el.appendChild(revealArea);

    let state = {
      selectedOptIdx: null,
      drillIdx: 0,
      drillCorrectCount: 0,
      drillAnswers: [] // tracks first-try success per drill item
    };

    if (mode === 'choice') {
      const grid = document.createElement('div');
      grid.className = 'w-options-grid';
      config.options.forEach((opt, oIdx) => {
        const btn = document.createElement('button');
        btn.className = 'w-opt';
        btn.type = 'button';
        btn.innerHTML = opt.label;
        btn.addEventListener('click', () => {
          if (el.dataset.committed === 'true') return;
          $$('.w-opt', grid).forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          state.selectedOptIdx = oIdx;
          checkBtn.removeAttribute('disabled');
        });
        grid.appendChild(btn);
      });
      workspace.appendChild(grid);

      const { checkBtn, resetBtn, feedback } = createWidgetControls(el, 
        // onCheck
        (cBtn, rBtn, fb) => {
          if (state.selectedOptIdx === null) return;
          el.dataset.committed = 'true';
          cBtn.style.display = 'none';
          rBtn.style.display = '';

          const chosen = config.options[state.selectedOptIdx];
          const opts = $$('.w-opt', grid);
          opts.forEach(o => o.setAttribute('disabled', 'true'));

          opts[state.selectedOptIdx].classList.add(chosen.correct ? 'correct' : 'wrong');
          
          // Highlight correct one in green
          config.options.forEach((opt, oIdx) => {
            if (opt.correct) opts[oIdx].classList.add('correct');
          });

          fb.innerHTML = chosen.feedback;
          fb.className = 'w-feedback ' + (chosen.correct ? 'correct' : 'wrong');

          if (config.reveal) {
            revealArea.innerHTML = config.reveal;
            revealArea.style.display = 'block';
            revealArea.classList.add('show');
            initWidgets();
            initMotionPrimitives();
          }
          markCheckpointCompleted('commit-reveal', widgetIdx);
        },
        // onReset
        (cBtn, rBtn, fb) => {
          el.removeAttribute('data-committed');
          state.selectedOptIdx = null;
          const opts = $$('.w-opt', grid);
          opts.forEach(o => {
            o.removeAttribute('disabled');
            o.classList.remove('selected', 'correct', 'wrong');
          });
          cBtn.setAttribute('disabled', 'true');
          revealArea.style.display = 'none';
          revealArea.classList.remove('show');
          revealArea.innerHTML = '';
        }
      );
      checkBtn.setAttribute('disabled', 'true');

    } else if (mode === 'free') {
      const textarea = document.createElement('textarea');
      textarea.className = 'w-textarea';
      textarea.placeholder = 'Write your answer first — even a rough one...';
      workspace.appendChild(textarea);

      const minChars = config.minChars || 25;
      const counter = document.createElement('div');
      counter.className = 'w-char-count';
      counter.textContent = `0 / ${minChars} characters`;
      workspace.appendChild(counter);

      textarea.addEventListener('input', () => {
        const len = textarea.value.trim().length;
        counter.textContent = `${len} / ${minChars} characters`;
        if (len >= minChars) {
          checkBtn.removeAttribute('disabled');
        } else {
          checkBtn.setAttribute('disabled', 'true');
        }
      });

      const { checkBtn, resetBtn, feedback } = createWidgetControls(el,
        // onCheck
        (cBtn, rBtn, fb) => {
          textarea.setAttribute('disabled', 'true');
          cBtn.style.display = 'none';
          rBtn.style.display = '';
          fb.textContent = 'Excellent. Now compare your self-explanation with the model below.';
          fb.className = 'w-feedback correct';

          if (config.reveal) {
            revealArea.innerHTML = `<h4>Model Answer</h4><p>${config.reveal}</p>`;
            revealArea.style.display = 'block';
            revealArea.classList.add('show');
            initWidgets();
            initMotionPrimitives();
          }
          markCheckpointCompleted('commit-reveal', widgetIdx);
        },
        // onReset
        (cBtn, rBtn, fb) => {
          textarea.removeAttribute('disabled');
          textarea.value = '';
          counter.textContent = `0 / ${minChars} characters`;
          cBtn.setAttribute('disabled', 'true');
          revealArea.style.display = 'none';
          revealArea.classList.remove('show');
          revealArea.innerHTML = '';
        }
      );
      checkBtn.textContent = 'Compare with model';
      checkBtn.setAttribute('disabled', 'true');

    } else if (mode === 'drill') {
      // Classification drill sequence
      const status = document.createElement('div');
      status.className = 'w-drill-status';
      status.innerHTML = `
        <span class="w-drill-progress">Item 1 of ${config.items.length}</span>
        <span class="w-drill-score">Score: 0 / 0</span>
      `;
      workspace.insertBefore(status, workspace.firstChild);

      const qBox = document.createElement('div');
      qBox.className = 'w-drill-question';
      workspace.appendChild(qBox);

      const grid = document.createElement('div');
      grid.className = 'w-options-grid';
      workspace.appendChild(grid);

      const progressEl = $('.w-drill-progress', status);
      const scoreEl = $('.w-drill-score', status);

      const renderDrillItem = () => {
        const item = config.items[state.drillIdx];
        progressEl.textContent = `Item ${state.drillIdx + 1} of ${config.items.length}`;
        qBox.innerHTML = `<p>${item.prompt}</p>`;
        grid.innerHTML = '';
        state.selectedOptIdx = null;
        state.drillAnswers[state.drillIdx] = { attempts: 0, firstTryCorrect: false };

        item.options.forEach((opt, oIdx) => {
          const btn = document.createElement('button');
          btn.className = 'w-opt';
          btn.type = 'button';
          btn.innerHTML = opt.label;
          btn.addEventListener('click', () => {
            if (state.selectedOptIdx !== null) return; // already answered correct
            state.drillAnswers[state.drillIdx].attempts++;
            const ok = opt.correct;
            
            btn.classList.add(ok ? 'correct' : 'wrong');
            feedback.innerHTML = opt.feedback;
            feedback.className = 'w-feedback ' + (ok ? 'correct' : 'wrong');

            if (ok) {
              state.selectedOptIdx = oIdx;
              if (state.drillAnswers[state.drillIdx].attempts === 1) {
                state.drillAnswers[state.drillIdx].firstTryCorrect = true;
                state.drillCorrectCount++;
              }
              // disable other choices
              $$('.w-opt', grid).forEach(b => b.setAttribute('disabled', 'true'));
              // update score display
              scoreEl.textContent = `Score: ${state.drillCorrectCount} / ${state.drillIdx + 1}`;

              // check if last
              if (state.drillIdx < config.items.length - 1) {
                checkBtn.style.display = '';
                checkBtn.textContent = 'Next';
              } else {
                checkBtn.style.display = 'none';
                resetBtn.style.display = '';
                feedback.textContent = `Completed! Final score: ${state.drillCorrectCount} / ${config.items.length}`;
                if (config.reveal) {
                  revealArea.innerHTML = config.reveal;
                  revealArea.style.display = 'block';
                  revealArea.classList.add('show');
                  initWidgets();
                  initMotionPrimitives();
                }
                markCheckpointCompleted('commit-reveal', widgetIdx);
              }
            } else {
              // wrong
              btn.setAttribute('disabled', 'true');
              scoreEl.textContent = `Score: ${state.drillCorrectCount} / ${state.drillIdx + 1}`;
            }
          });
          grid.appendChild(btn);
        });
      };

      const { checkBtn, resetBtn, feedback } = createWidgetControls(el,
        // onCheck (acting as "Next" button here)
        (cBtn, rBtn, fb) => {
          state.drillIdx++;
          cBtn.style.display = 'none';
          fb.textContent = '';
          fb.className = 'w-feedback';
          renderDrillItem();
        },
        // onReset
        (cBtn, rBtn, fb) => {
          state.drillIdx = 0;
          state.drillCorrectCount = 0;
          state.drillAnswers = [];
          scoreEl.textContent = 'Score: 0 / 0';
          revealArea.style.display = 'none';
          revealArea.classList.remove('show');
          revealArea.innerHTML = '';
          renderDrillItem();
        }
      );
      checkBtn.style.display = 'none'; // hidden initially, shown when step completes
      renderDrillItem();
    }
  }

  // --- 2. Faded Worked Example Widget ---
  function initFadedExample(el, config, widgetIdx) {
    const layout = document.createElement('div');
    layout.className = 'faded-layout';
    
    // Model panel
    const modelPanel = document.createElement('div');
    modelPanel.className = 'faded-panel faded-model';
    modelPanel.innerHTML = `<h3>${config.model.title}</h3>`;
    const modelSteps = document.createElement('ol');
    modelSteps.className = 'faded-steps';
    config.model.steps.forEach(step => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="step-label">${step.label}</span>
        <div class="step-work">${step.work}</div>
        <div class="step-why">${step.why}</div>
      `;
      modelSteps.appendChild(li);
    });
    modelPanel.appendChild(modelSteps);

    // Mobile wrapper for model
    const mobileCollapsible = document.createElement('details');
    mobileCollapsible.className = 'faded-model-collapsible';
    mobileCollapsible.innerHTML = `<summary>Show Worked Example</summary>`;
    
    // Yours panel
    const yoursPanel = document.createElement('div');
    yoursPanel.className = 'faded-panel faded-yours';
    yoursPanel.innerHTML = `<h3>${config.yours.title}</h3>`;
    const yoursSteps = document.createElement('ol');
    yoursSteps.className = 'faded-steps';
    yoursPanel.appendChild(yoursSteps);

    mobileCollapsible.appendChild(modelPanel);
    layout.appendChild(mobileCollapsible);
    layout.appendChild(yoursPanel);
    el.appendChild(layout);

    let blanksData = [];

    config.yours.steps.forEach((step, sIdx) => {
      const li = document.createElement('li');
      const label = `<span class="step-label">${step.label}</span>`;
      
      if (step.given) {
        li.innerHTML = `${label}<div class="step-work">${step.given}</div>`;
      } else if (step.blank) {
        const blank = step.blank;
        const bIdx = blanksData.length;
        blanksData.push({
          config: blank,
          attempts: 0,
          resolved: false,
          stepIdx: sIdx
        });

        let inputHtml = '';
        if (blank.type === 'numeric' || blank.type === 'text') {
          inputHtml = `<input class="w-blank-input" type="text" placeholder="${blank.prompt || ''}" data-blank-idx="${bIdx}">`;
        } else if (blank.type === 'choice') {
          inputHtml = `<div class="w-blank-choices" data-blank-idx="${bIdx}">`;
          blank.options.forEach(opt => {
            inputHtml += `<button class="w-blank-opt" type="button">${opt}</button>`;
          });
          inputHtml += `</div>`;
        }

        const checkBtnHtml = config.yours.checkMode === 'all' ? '' : `<button class="w-step-check-btn" type="button" data-blank-idx="${bIdx}">Check</button>`;

        li.innerHTML = `
          ${label}
          <div class="step-work">
            ${inputHtml}
            ${checkBtnHtml}
            <div class="w-step-feedback" id="fb-${widgetIdx}-${bIdx}" role="status" aria-live="polite"></div>
          </div>
        `;

        if (blank.type === 'choice') {
          setTimeout(() => {
            const container = li.querySelector('.w-blank-choices');
            const opts = container.querySelectorAll('.w-blank-opt');
            opts.forEach(btn => btn.addEventListener('click', () => {
              if (blanksData[bIdx].resolved) return;
              opts.forEach(b => b.classList.remove('selected'));
              btn.classList.add('selected');
            }));
          }, 0);
        }
      }
      yoursSteps.appendChild(li);
    });

    const evalBlank = (bIdx, inputVal, elementToStyle, feedbackEl, afterResolve) => {
      const data = blanksData[bIdx];
      const blank = data.config;
      let correct = false;

      if (blank.type === 'numeric') {
        const val = parseFloat(inputVal);
        if (!isNaN(val)) {
          correct = Math.abs(val - blank.answer) <= (blank.tol || 0.001);
        }
      } else if (blank.type === 'text') {
        const normVal = inputVal.trim().toLowerCase();
        const answers = Array.isArray(blank.answer) ? blank.answer : [blank.answer];
        correct = answers.map(a => a.trim().toLowerCase()).includes(normVal);
      } else if (blank.type === 'choice') {
        correct = (inputVal === blank.answer);
      }

      data.attempts++;
      feedbackEl.className = 'w-step-feedback';

      if (correct) {
        data.resolved = true;
        elementToStyle.classList.add('correct');
        elementToStyle.classList.remove('wrong');
        elementToStyle.setAttribute('disabled', 'true');
        feedbackEl.innerHTML = blank.feedback_right || 'Correct!';
        feedbackEl.classList.add('correct');
        if (afterResolve) afterResolve(true);
      } else {
        elementToStyle.classList.add('wrong');
        feedbackEl.innerHTML = blank.feedback_wrong || 'Incorrect. Try again.';
        feedbackEl.classList.add('wrong');
        
        if (data.attempts >= 3) {
          data.resolved = true;
          elementToStyle.classList.remove('wrong');
          elementToStyle.classList.add('correct');
          elementToStyle.setAttribute('disabled', 'true');
          
          if (blank.type === 'numeric' || blank.type === 'text') {
            elementToStyle.value = Array.isArray(blank.answer) ? blank.answer[0] : blank.answer;
          } else if (blank.type === 'choice') {
            const opts = elementToStyle.querySelectorAll('.w-blank-opt');
            opts.forEach(o => {
              o.setAttribute('disabled', 'true');
              if (o.textContent === blank.answer) o.classList.add('correct');
            });
          }
          feedbackEl.innerHTML = `${blank.feedback_wrong} (Correct answer: ${Array.isArray(blank.answer) ? blank.answer[0] : blank.answer})`;
          feedbackEl.className = 'w-step-feedback correct';
          if (afterResolve) afterResolve(true);
        } else {
          if (afterResolve) afterResolve(false);
        }
      }
    };

    if (config.yours.checkMode !== 'all') {
      setTimeout(() => {
        el.querySelectorAll('.w-step-check-btn').forEach(btn => {
          const bIdx = parseInt(btn.dataset.blankIdx);
          const parent = btn.closest('.step-work');
          const feedbackEl = parent.querySelector('.w-step-feedback');
          
          btn.addEventListener('click', () => {
            const blank = blanksData[bIdx].config;
            let val = '';
            let styleTarget = null;
            
            if (blank.type === 'numeric' || blank.type === 'text') {
              styleTarget = parent.querySelector('.w-blank-input');
              val = styleTarget.value;
            } else if (blank.type === 'choice') {
              styleTarget = parent.querySelector('.w-blank-choices');
              const selected = styleTarget.querySelector('.w-blank-opt.selected');
              val = selected ? selected.textContent : '';
            }

            evalBlank(bIdx, val, styleTarget, feedbackEl, (resolved) => {
              if (resolved) {
                btn.style.display = 'none';
              }
              if (blanksData.every(b => b.resolved)) {
                markCheckpointCompleted('faded-example', widgetIdx);
                const resetBtn = el.querySelector('.w-btn-reset');
                if (resetBtn) resetBtn.style.display = '';
              }
            });
          });
        });
      }, 0);
    }

    const { checkBtn, resetBtn, feedback } = createWidgetControls(el,
      (cBtn, rBtn, fb) => {
        let allCorrect = true;
        blanksData.forEach((data, bIdx) => {
          if (data.resolved) return;
          const blank = data.config;
          const li = yoursSteps.children[data.stepIdx];
          const feedbackEl = li.querySelector('.w-step-feedback');
          let val = '';
          let styleTarget = null;

          if (blank.type === 'numeric' || blank.type === 'text') {
            styleTarget = li.querySelector('.w-blank-input');
            val = styleTarget.value;
          } else if (blank.type === 'choice') {
            styleTarget = li.querySelector('.w-blank-choices');
            const selected = styleTarget.querySelector('.w-blank-opt.selected');
            val = selected ? selected.textContent : '';
          }

          evalBlank(bIdx, val, styleTarget, feedbackEl, (resolved) => {
            if (!resolved) allCorrect = false;
          });
        });

        if (blanksData.every(b => b.resolved)) {
          cBtn.style.display = 'none';
          rBtn.style.display = '';
          fb.textContent = 'All steps resolved.';
          fb.className = 'w-feedback correct';
          markCheckpointCompleted('faded-example', widgetIdx);
        } else {
          fb.textContent = 'Some steps need correction. Keep trying!';
          fb.className = 'w-feedback wrong';
        }
      },
      (cBtn, rBtn, fb) => {
        blanksData.forEach(data => {
          data.attempts = 0;
          data.resolved = false;
          const li = yoursSteps.children[data.stepIdx];
          const feedbackEl = li.querySelector('.w-step-feedback');
          if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'w-step-feedback';
          }
          const checkBtn = li.querySelector('.w-step-check-btn');
          if (checkBtn) checkBtn.style.display = '';

          const input = li.querySelector('.w-blank-input');
          if (input) {
            input.value = '';
            input.removeAttribute('disabled');
            input.className = 'w-blank-input';
          }
          const choiceContainer = li.querySelector('.w-blank-choices');
          if (choiceContainer) {
            choiceContainer.removeAttribute('disabled');
            const opts = choiceContainer.querySelectorAll('.w-blank-opt');
            opts.forEach(o => {
              o.removeAttribute('disabled');
              o.classList.remove('selected', 'correct', 'wrong');
            });
          }
        });
        if (config.yours.checkMode === 'all') {
          cBtn.style.display = '';
        }
      }
    );

    if (config.yours.checkMode !== 'all') {
      checkBtn.style.display = 'none';
    }
  }

  // --- 3. Fillable Scaffold Widget ---
  function initScaffold(el, config, widgetIdx) {
    const mode = config.mode || 'free';

    const workspace = document.createElement('div');
    workspace.className = 'w-workspace';
    el.appendChild(workspace);

    if (mode === 'bank') {
      const bankDiv = document.createElement('div');
      bankDiv.className = 'w-bank';
      bankDiv.setAttribute('role', 'list');
      bankDiv.setAttribute('aria-label', 'Statement bank');
      workspace.appendChild(bankDiv);

      const slotsContainer = document.createElement('div');
      slotsContainer.className = 'w-slots';
      workspace.appendChild(slotsContainer);

      let activeCardIdx = null;
      let slotAssignments = {};

      const renderBank = () => {
        bankDiv.innerHTML = '';
        config.bank.forEach((item, cIdx) => {
          if (Object.values(slotAssignments).includes(cIdx)) return;

          const card = document.createElement('div');
          card.className = 'w-card';
          card.textContent = item.text;
          card.setAttribute('role', 'listitem');
          card.setAttribute('tabindex', '0');
          if (activeCardIdx === cIdx) card.classList.add('selected');

          card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeCardIdx === cIdx) {
              card.classList.remove('selected');
              activeCardIdx = null;
            } else {
              $$('.w-card', bankDiv).forEach(c => c.classList.remove('selected'));
              card.classList.add('selected');
              activeCardIdx = cIdx;
            }
          });
          bankDiv.appendChild(card);
        });
      };

      const renderSlots = () => {
        slotsContainer.innerHTML = '';
        config.slots.forEach((slot, sIdx) => {
          if (sIdx > 0 && config.chain) {
            const arrow = document.createElement('div');
            arrow.innerHTML = `<svg class="w-chain-arrow" viewBox="0 0 24 24"><path d="M12 4v16m0 0l-4-4m4 4l4-4" stroke="var(--accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
            slotsContainer.appendChild(arrow);
          }

          const row = document.createElement('div');
          row.className = 'w-slot-row';

          const label = document.createElement('span');
          label.className = 'w-slot-label';
          label.textContent = slot.label;
          row.appendChild(label);

          const slotBox = document.createElement('div');
          slotBox.className = 'w-slot';
          slotBox.setAttribute('role', 'region');
          slotBox.setAttribute('aria-label', `Target slot for ${slot.label}`);
          
          const assignedCardIdx = slotAssignments[slot.id];
          if (assignedCardIdx !== undefined && assignedCardIdx !== null) {
            slotBox.textContent = config.bank[assignedCardIdx].text;
            slotBox.style.cursor = 'pointer';
            slotBox.addEventListener('click', () => {
              if (el.dataset.committed === 'true') return;
              delete slotAssignments[slot.id];
              renderBank();
              renderSlots();
            });
          } else {
            slotBox.innerHTML = '<span style="color:var(--ink-mute); font-style:italic; font-size:0.9rem;">Tap a card, then tap here to place</span>';
            slotBox.addEventListener('click', () => {
              if (el.dataset.committed === 'true') return;
              if (activeCardIdx !== null) {
                Object.keys(slotAssignments).forEach(key => {
                  if (slotAssignments[key] === activeCardIdx) delete slotAssignments[key];
                });
                slotAssignments[slot.id] = activeCardIdx;
                activeCardIdx = null;
                renderBank();
                renderSlots();
              }
            });
          }

          row.appendChild(slotBox);
          slotsContainer.appendChild(row);
        });
      };

      const { checkBtn, resetBtn, feedback } = createWidgetControls(el,
        (cBtn, rBtn, fb) => {
          const filled = config.slots.every(slot => slotAssignments[slot.id] !== undefined);
          if (!filled) {
            fb.textContent = 'Place all statements before checking.';
            fb.className = 'w-feedback wrong';
            return;
          }

          el.dataset.committed = 'true';
          cBtn.style.display = 'none';
          rBtn.style.display = '';

          let correctCount = 0;
          config.slots.forEach((slot, sIdx) => {
            const cardIdx = slotAssignments[slot.id];
            const card = config.bank[cardIdx];
            const isCorrect = (card.slot === slot.id);
            const slotEl = slotsContainer.querySelectorAll('.w-slot')[sIdx];
            
            if (isCorrect) {
              slotEl.classList.add('correct');
              correctCount++;
            } else {
              slotEl.classList.add('wrong');
              fb.innerHTML = card.feedback || 'This statement belongs elsewhere.';
              fb.className = 'w-feedback wrong';
              setTimeout(() => {
                if (slotEl) {
                  delete slotAssignments[slot.id];
                  slotEl.classList.remove('wrong');
                  renderBank();
                  renderSlots();
                  rBtn.style.display = 'none';
                  cBtn.style.display = '';
                  el.removeAttribute('data-committed');
                }
              }, 2500);
            }
          });

          if (correctCount === config.slots.length) {
            fb.textContent = 'All statements placed correctly!';
            fb.className = 'w-feedback correct';
            markCheckpointCompleted('scaffold', widgetIdx);
          }
        },
        (cBtn, rBtn, fb) => {
          el.removeAttribute('data-committed');
          activeCardIdx = null;
          slotAssignments = {};
          renderBank();
          renderSlots();
        }
      );

      renderBank();
      renderSlots();

    } else if (mode === 'free') {
      const slotsContainer = document.createElement('div');
      slotsContainer.className = 'w-slots';
      workspace.appendChild(slotsContainer);

      config.slots.forEach((slot, sIdx) => {
        const item = document.createElement('div');
        item.className = 'w-scaffold-free-slot';
        item.innerHTML = `
          <label>${slot.label}</label>
          <textarea class="w-textarea" placeholder="Write your explanation segment..."></textarea>
          <div class="w-reveal-area" style="display: none;"></div>
        `;
        slotsContainer.appendChild(item);
      });

      const textareas = $$('.w-textarea', slotsContainer);

      const { checkBtn, resetBtn, feedback } = createWidgetControls(el,
        (cBtn, rBtn, fb) => {
          let filled = true;
          textareas.forEach(ta => {
            if (ta.value.trim().length < 10) filled = false;
          });
          if (!filled) {
            fb.textContent = 'Write a complete response in all boxes before comparing.';
            fb.className = 'w-feedback wrong';
            return;
          }

          cBtn.style.display = 'none';
          rBtn.style.display = '';
          fb.textContent = 'Excellent. Compare each of your points with the model answers shown below.';
          fb.className = 'w-feedback correct';

          config.slots.forEach((slot, sIdx) => {
            const ta = textareas[sIdx];
            ta.setAttribute('disabled', 'true');
            const reveal = ta.nextElementSibling;
            reveal.innerHTML = `<h4>Model Answer</h4><p>${slot.model}</p>`;
            reveal.style.display = 'block';
            reveal.classList.add('show');
          });
          markCheckpointCompleted('scaffold', widgetIdx);
        },
        (cBtn, rBtn, fb) => {
          textareas.forEach(ta => {
            ta.removeAttribute('disabled');
            ta.value = '';
            const reveal = ta.nextElementSibling;
            reveal.style.display = 'none';
            reveal.classList.remove('show');
            reveal.innerHTML = '';
          });
        }
      );
      checkBtn.textContent = 'Compare with model';

    } else if (mode === 'table') {
      const wrapper = document.createElement('div');
      wrapper.className = 'w-table-wrapper';
      
      const tbl = document.createElement('table');
      tbl.className = 'w-table';
      wrapper.appendChild(tbl);
      workspace.appendChild(wrapper);

      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      config.table.headers.forEach(h => {
        headerRow.innerHTML += `<th>${h}</th>`;
      });
      thead.appendChild(headerRow);
      tbl.appendChild(thead);

      const tbody = document.createElement('tbody');
      tbl.appendChild(tbody);

      let tableBlanks = [];

      config.table.rows.forEach((row, rIdx) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cIdx) => {
          const td = document.createElement('td');
          if (cell.given !== undefined) {
            td.innerHTML = cell.given;
          } else if (cell.blank) {
            const bIdx = tableBlanks.length;
            tableBlanks.push({
              config: cell.blank,
              attempts: 0,
              resolved: false,
              tdElement: td
            });
            td.innerHTML = `<input class="w-blank-input" type="text" style="width: 100%;" data-tbl-blank-idx="${bIdx}">`;
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      const { checkBtn, resetBtn, feedback } = createWidgetControls(el,
        (cBtn, rBtn, fb) => {
          let allCorrect = true;
          tableBlanks.forEach((data, bIdx) => {
            if (data.resolved) return;
            const blank = data.config;
            const input = data.tdElement.querySelector('.w-blank-input');
            const val = input.value;
            let correct = false;

            if (blank.type === 'numeric') {
              const fVal = parseFloat(val);
              if (!isNaN(fVal)) {
                correct = Math.abs(fVal - blank.answer) <= (blank.tol || 0.001);
              }
            } else if (blank.type === 'text') {
              const normVal = val.trim().toLowerCase();
              const answers = Array.isArray(blank.answer) ? blank.answer : [blank.answer];
              correct = answers.map(a => a.trim().toLowerCase()).includes(normVal);
            }

            data.attempts++;
            input.className = 'w-blank-input';

            if (correct) {
              data.resolved = true;
              input.classList.add('correct');
              input.setAttribute('disabled', 'true');
            } else {
              input.classList.add('wrong');
              allCorrect = false;

              if (data.attempts >= 3) {
                data.resolved = true;
                input.classList.remove('wrong');
                input.classList.add('correct');
                input.setAttribute('disabled', 'true');
                input.value = Array.isArray(blank.answer) ? blank.answer[0] : blank.answer;
              }
            }
          });

          if (tableBlanks.every(b => b.resolved)) {
            cBtn.style.display = 'none';
            rBtn.style.display = '';
            fb.textContent = 'Table complete!';
            fb.className = 'w-feedback correct';
            markCheckpointCompleted('scaffold', widgetIdx);
          } else {
            fb.textContent = 'Correct the highlighted cells and try again.';
            fb.className = 'w-feedback wrong';
          }
        },
        (cBtn, rBtn, fb) => {
          tableBlanks.forEach(data => {
            data.attempts = 0;
            data.resolved = false;
            const input = data.tdElement.querySelector('.w-blank-input');
            input.value = '';
            input.removeAttribute('disabled');
            input.className = 'w-blank-input';
          });
        }
      );
    }
  }

  // --- 4. Step-Through Builder Widget ---
  function initStepBuilder(el, config, widgetIdx) {
    const workspace = document.createElement('div');
    workspace.className = 'w-workspace';
    el.appendChild(workspace);

    const qBox = document.createElement('div');
    qBox.className = 'w-step-builder-prompt';
    workspace.appendChild(qBox);

    const grid = document.createElement('div');
    grid.className = 'w-options-grid';
    workspace.appendChild(grid);

    const revealArea = document.createElement('div');
    revealArea.className = 'w-reveal-area';
    revealArea.style.display = 'none';
    el.appendChild(revealArea);

    let currentStep = 0;
    let attempts = 0;

    const svgContainer = config.diagramId ? document.getElementById(config.diagramId) : el.closest('section').querySelector('.diagram');
    const updateSVGState = (stateId) => {
      if (!svgContainer) return;
      const layers = svgContainer.querySelectorAll('[data-step], .svg-step-layer');
      layers.forEach(l => {
        l.style.display = 'none';
        l.style.opacity = '0';
      });

      if (stateId) {
        const target = svgContainer.querySelector(`#${stateId}`) || svgContainer.querySelector(`.${stateId}`);
        if (target) {
          target.style.display = '';
          target.style.opacity = '1';
        }
      }
    };

    const renderStep = () => {
      const step = config.steps[currentStep];
      updateSVGState(step.state);
      attempts = 0;

      qBox.innerHTML = `
        <div class="w-drill-status">
          <span class="w-drill-progress">Step ${currentStep + 1} of ${config.steps.length}</span>
        </div>
        <p>${step.question}</p>
      `;

      grid.innerHTML = '';
      step.options.forEach((opt, oIdx) => {
        const btn = document.createElement('button');
        btn.className = 'w-opt';
        btn.type = 'button';
        btn.innerHTML = opt.label;
        btn.addEventListener('click', () => {
          const ok = opt.correct;
          btn.className = 'w-opt';
          
          if (ok) {
            btn.classList.add('correct');
            feedback.innerHTML = opt.feedback || 'Correct!';
            feedback.className = 'w-feedback correct';
            $$('.w-opt', grid).forEach(b => b.setAttribute('disabled', 'true'));
            
            if (currentStep < config.steps.length - 1) {
              checkBtn.style.display = '';
              checkBtn.textContent = 'Continue';
            } else {
              checkBtn.style.display = 'none';
              resetBtn.style.display = '';
              if (config.finale) {
                revealArea.innerHTML = config.finale;
                revealArea.style.display = 'block';
                revealArea.classList.add('show');
              }
              markCheckpointCompleted('step-builder', widgetIdx);
            }
          } else {
            btn.classList.add('wrong');
            feedback.innerHTML = opt.feedback;
            feedback.className = 'w-feedback wrong';
            attempts++;

            if (attempts >= 2) {
              step.options.forEach((o, idx) => {
                if (o.correct) {
                  grid.children[idx].classList.add('correct');
                  feedback.innerHTML = `${opt.feedback} Let's move forward.`;
                  feedback.className = 'w-feedback correct';
                }
              });
              $$('.w-opt', grid).forEach(b => b.setAttribute('disabled', 'true'));
              
              if (currentStep < config.steps.length - 1) {
                checkBtn.style.display = '';
                checkBtn.textContent = 'Continue';
              } else {
                checkBtn.style.display = 'none';
                resetBtn.style.display = '';
                if (config.finale) {
                  revealArea.innerHTML = config.finale;
                  revealArea.style.display = 'block';
                  revealArea.classList.add('show');
                }
                markCheckpointCompleted('step-builder', widgetIdx);
              }
            }
          }
        });
        grid.appendChild(btn);
      });
    };

    const { checkBtn, resetBtn, feedback } = createWidgetControls(el,
      (cBtn, rBtn, fb) => {
        currentStep++;
        cBtn.style.display = 'none';
        fb.textContent = '';
        fb.className = 'w-feedback';
        renderStep();
      },
      (cBtn, rBtn, fb) => {
        currentStep = 0;
        attempts = 0;
        revealArea.style.display = 'none';
        revealArea.classList.remove('show');
        revealArea.innerHTML = '';
        renderStep();
      }
    );
    checkBtn.style.display = 'none';
    renderStep();
  }

  /* ============================================================
     MOTION PRIMITIVES — STEP, SCRUB, ZOOM CONTROLLERS
     ============================================================ */

  // Global registries for scrub redraw functions
  window.GC_SCRUB_FN = window.GC_SCRUB_FN || {};

  function initMotionPrimitives() {
    // 1. Step Controller (data-motion="step")
    $$('[data-motion="step"]').forEach((el, idx) => {
      if (el.dataset.motionInitialized) return;
      el.dataset.motionInitialized = 'true';
      initStepPrimitive(el, idx);
    });

    // 2. Scrub Controller (data-motion="scrub")
    $$('[data-motion="scrub"]').forEach((el, idx) => {
      if (el.dataset.motionInitialized) return;
      el.dataset.motionInitialized = 'true';
      initScrubPrimitive(el, idx);
    });

    // 3. Zoom Stage (data-motion="zoom")
    $$('[data-motion="zoom"]').forEach((el, idx) => {
      if (el.dataset.motionInitialized) return;
      el.dataset.motionInitialized = 'true';
      initZoomPrimitive(el, idx);
    });
  }

  // --- 1. Step controller implementation ---
  function initStepPrimitive(el, idx) {
    const stepCount = parseInt(el.dataset.stepCount) || 1;
    const stepStart = parseInt(el.dataset.stepStart) || 1;
    const labelsStr = el.dataset.stepLabels || '';
    const labels = labelsStr ? labelsStr.split('|') : [];

    el.classList.add('step-container');
    let currentStep = stepStart;

    // Render controls panel at the bottom
    const controls = document.createElement('div');
    controls.className = 'step-controls';
    controls.setAttribute('role', 'toolbar');
    
    let dotsHtml = '';
    for (let i = 1; i <= stepCount; i++) {
      dotsHtml += `<span class="step-dot" role="tab" aria-selected="${i === currentStep}" data-step-dot-idx="${i}" tabindex="0"></span>`;
    }

    controls.innerHTML = `
      <button class="step-btn step-prev" type="button" aria-label="Previous step">&larr;</button>
      <div class="step-dots" role="tablist">
        ${dotsHtml}
      </div>
      <button class="step-btn step-next" type="button" aria-label="Next step">&rarr;</button>
      <span class="step-label-text"></span>
    `;
    el.appendChild(controls);

    const prevBtn = $('.step-prev', controls);
    const nextBtn = $('.step-next', controls);
    const labelText = $('.step-label-text', controls);
    const dots = $$('.step-dot', controls);

    const updateStepState = (newStep) => {
      currentStep = Math.max(1, Math.min(stepCount, newStep));

      // Toggle active classes on children
      const layers = el.querySelectorAll('[data-step]');
      layers.forEach(l => {
        const stepNum = parseInt(l.dataset.step);
        if (stepNum === currentStep) {
          l.classList.add('active');
        } else {
          l.classList.remove('active');
        }
      });

      // Update dots
      dots.forEach((dot, dIdx) => {
        if (dIdx + 1 === currentStep) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
        }
      });

      // Update button disabled state
      prevBtn.disabled = (currentStep === 1);
      nextBtn.disabled = (currentStep === stepCount);

      // Update label
      if (labels[currentStep - 1]) {
        labelText.textContent = labels[currentStep - 1];
      } else {
        labelText.textContent = `Step ${currentStep} of ${stepCount}`;
      }

      markCheckpointCompleted('step-motion', idx);
    };

    // Click handlers
    prevBtn.addEventListener('click', () => updateStepState(currentStep - 1));
    nextBtn.addEventListener('click', () => updateStepState(currentStep + 1));
    
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetStep = parseInt(dot.dataset.stepDotIdx);
        updateStepState(targetStep);
      });
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateStepState(parseInt(dot.dataset.stepDotIdx));
        }
      });
    });

    // Keyboard navigation on container
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        updateStepState(currentStep - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        updateStepState(currentStep + 1);
      }
    });

    // Initial state setup
    updateStepState(currentStep);
  }

  // --- 2. Scrub controller implementation ---
  function initScrubPrimitive(el, idx) {
    const fnName = el.dataset.scrubFn;
    const min = parseFloat(el.dataset.scrubMin) || 0;
    const max = parseFloat(el.dataset.scrubMax) || 100;
    const step = parseFloat(el.dataset.scrubStep) || 1;
    const valInitial = parseFloat(el.dataset.scrubValue) || min;
    const label = el.dataset.scrubLabel || '';
    const marksStr = el.dataset.scrubMarks || '';
    const targetVal = el.dataset.scrubTarget ? parseFloat(el.dataset.scrubTarget) : null;

    el.classList.add('scrub-container');

    // Label and Readout header
    const labelRow = document.createElement('div');
    labelRow.className = 'scrub-label-row';
    labelRow.innerHTML = `
      <span class="scrub-label">${label}</span>
      <span class="scrub-value-readout">${valInitial.toFixed(2)}</span>
    `;
    el.appendChild(labelRow);

    const valueReadout = $('.scrub-value-readout', labelRow);

    // Slider wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'scrub-slider-wrapper';
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'scrub-slider';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = valInitial;
    wrapper.appendChild(slider);
    el.appendChild(wrapper);

    // Labeled tick marks
    if (marksStr) {
      const marksDiv = document.createElement('div');
      marksDiv.className = 'scrub-marks';
      const marks = marksStr.split('|');
      marks.forEach(m => {
        const parts = m.split(':');
        const mVal = parseFloat(parts[0]);
        const mLabel = parts[1] || '';
        const pct = ((mVal - min) / (max - min)) * 100;

        const markSpan = document.createElement('span');
        markSpan.className = 'scrub-mark';
        markSpan.textContent = mLabel;
        markSpan.style.left = `${pct}%`;
        marksDiv.appendChild(markSpan);
      });
      el.appendChild(marksDiv);
    }

    // Target task prompt
    let targetMsg = null;
    if (targetVal !== null) {
      targetMsg = document.createElement('div');
      targetMsg.className = 'scrub-target-msg';
      targetMsg.innerHTML = `Target: Match the value <b>${targetVal.toFixed(2)}</b> by dragging the slider.`;
      el.appendChild(targetMsg);
    }

    const handleScrubUpdate = (val) => {
      valueReadout.textContent = val.toFixed(2);

      // Run registered draw function
      if (fnName && window.GC_SCRUB_FN[fnName]) {
        try {
          window.GC_SCRUB_FN[fnName](el, val);
        } catch (e) {
          console.error(`Error in scrub draw function '${fnName}':`, e);
        }
      }

      // Check target threshold (within 5% of range tolerance)
      if (targetVal !== null) {
        const tolerance = (max - min) * 0.05;
        const matched = Math.abs(val - targetVal) <= tolerance;

        if (matched) {
          slider.classList.add('at-target');
          if (targetMsg) {
            targetMsg.textContent = `Target matched! Value resolved: ${val.toFixed(2)}`;
            targetMsg.classList.add('completed');
          }
          markCheckpointCompleted('scrub-motion', idx);
        } else {
          slider.classList.remove('at-target');
          if (targetMsg) {
            targetMsg.innerHTML = `Target: Match the value <b>${targetVal.toFixed(2)}</b> by dragging the slider.`;
            targetMsg.classList.remove('completed');
          }
        }
      }
    };

    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      handleScrubUpdate(val);
    });

    slider.addEventListener('keydown', (e) => {
      if (e.key === 'Home') {
        slider.value = min;
        handleScrubUpdate(min);
      } else if (e.key === 'End') {
        slider.value = max;
        handleScrubUpdate(max);
      }
    });

    handleScrubUpdate(valInitial);
  }

  // --- 3. Zoom stage implementation ---
  function initZoomPrimitive(el, idx) {
    const levelsCount = parseInt(el.dataset.zoomLevels) || 2;
    const labelsStr = el.dataset.zoomLabels || '';
    const labels = labelsStr ? labelsStr.split('|') : [];
    const anchorStr = el.dataset.zoomAnchor || '50,50,15';
    const anchor = anchorStr.split(',').map(parseFloat);

    el.classList.add('zoom-stage');

    const layers = {
      macro: el.querySelector('[data-zoom-level="macro"]'),
      meso: el.querySelector('[data-zoom-level="meso"]'),
      particulate: el.querySelector('[data-zoom-level="particulate"]')
    };

    if (layers.macro) {
      const svg = layers.macro.querySelector('svg');
      if (svg) {
        const zoomRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        zoomRing.setAttribute('cx', anchor[0]);
        zoomRing.setAttribute('cy', anchor[1]);
        zoomRing.setAttribute('r', anchor[2] || 15);
        zoomRing.setAttribute('class', 'zoom-ring');
        zoomRing.style.transformOrigin = `${anchor[0]}px ${anchor[1]}px`;
        svg.appendChild(zoomRing);
      }
    }

    const rail = document.createElement('div');
    rail.className = 'zoom-rail';
    rail.setAttribute('role', 'tablist');
    rail.setAttribute('aria-label', 'Scale levels');

    const levelKeys = levelsCount === 3 ? ['macro', 'meso', 'particulate'] : ['macro', 'particulate'];
    const defaultLabels = { macro: '🔍 Out', meso: '🔎 Mid', particulate: '🔬 In' };

    levelKeys.forEach((key, lIdx) => {
      const btn = document.createElement('button');
      btn.className = 'zoom-rail-btn';
      btn.type = 'button';
      btn.textContent = labels[lIdx] || defaultLabels[key];
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', lIdx === 0 ? 'true' : 'false');
      btn.dataset.zoomKey = key;

      btn.addEventListener('click', () => {
        updateZoomLevel(key);
      });
      rail.appendChild(btn);
    });
    el.appendChild(rail);

    const updateZoomLevel = (activeKey) => {
      levelKeys.forEach(key => {
        const layer = layers[key];
        if (!layer) return;

        const btn = rail.querySelector(`[data-zoom-key="${key}"]`);

        if (key === activeKey) {
          layer.classList.add('active');
          if (btn) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
          }
        } else {
          layer.classList.remove('active');
          if (btn) {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          }
        }
      });

      if (activeKey === 'particulate' && layers.macro) {
        const svg = layers.macro.querySelector('svg');
        if (svg) {
          const factor = 4;
          svg.style.transformOrigin = `${anchor[0]}px ${anchor[1]}px`;
          svg.style.transform = `scale(${factor})`;
        }
      } else if (layers.macro) {
        const svg = layers.macro.querySelector('svg');
        if (svg) {
          svg.style.transform = 'none';
        }
      }

      markCheckpointCompleted('zoom-motion', idx);
    };

    updateZoomLevel('macro');
  }

  // Register dummy scrub drawing functions
  window.GC_SCRUB_FN['dummy-scale'] = function (container, value) {
    const svg = container.querySelector('svg');
    const shape = svg ? svg.querySelector('.scrub-shape') : null;
    if (shape) {
      shape.setAttribute('transform', `scale(${value})`);
      shape.style.transformOrigin = '50px 50px';
    }
  };

  window.GC_SCRUB_FN['den-cloud'] = function (container, value) {
    const svg = container.querySelector('svg');
    const atomL = svg ? svg.querySelector('.atom-l') : null;
    const atomR = svg ? svg.querySelector('.atom-r') : null;
    const cloud = svg ? svg.querySelector('.cloud-gradient') : null;
    
    if (cloud) {
      const shift = 50 + (value / 3.5) * 30;
      cloud.setAttribute('cx', `${shift}%`);
    }
    if (atomL && atomR) {
      const chargeL = svg.querySelector('.charge-l');
      const chargeR = svg.querySelector('.charge-r');
      if (chargeL && chargeR) {
        if (value < 0.5) {
          chargeL.textContent = '';
          chargeR.textContent = '';
        } else if (value < 1.7) {
          chargeL.textContent = 'δ+';
          chargeR.textContent = 'δ-';
        } else {
          chargeL.textContent = '+';
          chargeR.textContent = '-';
        }
      }
    }
  };

  // Initialize widgets, motion primitives, and tooltips
  initWidgets();
  initMotionPrimitives();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlossaryTooltips);
  } else {
    initGlossaryTooltips();
  }
>>>>>>> temp-interactives
})();
