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
    { id: "1-2b", slug: "1-2b_molecular-polarity", title: "Molecular Polarity" },
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

  /* ---- storage engine (sandboxed-safe virtualization) ---- */
  const StorageEngine = (function () {
    let storageType = null;
    let fallbackDict = {};

    function checkStorage(type) {
      try {
        const storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
      } catch (e) {
        return false;
      }
    }

    if (checkStorage('localStorage')) {
      storageType = 'localStorage';
    } else if (checkStorage('sessionStorage')) {
      storageType = 'sessionStorage';
    } else {
      storageType = 'memory';
    }

    const getItem = (key) => {
      if (storageType === 'localStorage') {
        try { return localStorage.getItem(key); } catch (e) { return null; }
      } else if (storageType === 'sessionStorage') {
        try { return sessionStorage.getItem(key); } catch (e) { return null; }
      } else {
        return fallbackDict[key] || null;
      }
    };

    const setItem = (key, value) => {
      if (storageType === 'localStorage') {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          try {
            sessionStorage.setItem(key, value);
          } catch (err) {
            fallbackDict[key] = String(value);
          }
        }
      } else if (storageType === 'sessionStorage') {
        try {
          sessionStorage.setItem(key, value);
        } catch (e) {
          fallbackDict[key] = String(value);
        }
      } else {
        fallbackDict[key] = String(value);
      }
    };

    const removeItem = (key) => {
      if (storageType === 'localStorage') {
        try { localStorage.removeItem(key); } catch (e) {}
      } else if (storageType === 'sessionStorage') {
        try { sessionStorage.removeItem(key); } catch (e) {}
      }
      delete fallbackDict[key];
    };

    const clear = () => {
      if (storageType === 'localStorage') {
        try { localStorage.clear(); } catch (e) {}
      } else if (storageType === 'sessionStorage') {
        try { sessionStorage.clear(); } catch (e) {}
      }
      fallbackDict = {};
    };

    const getProgress = () => {
      try {
        return JSON.parse(getItem('gc-textbook-progress')) || {};
      } catch (e) {
        return {};
      }
    };

    const saveProgress = (progress) => {
      setItem('gc-textbook-progress', JSON.stringify(progress));
    };

    const isCheckpointCompleted = (type, index) => {
      if (!currentLesson) return false;
      const progress = getProgress();
      const lessonProgress = progress[currentLesson.id] || {};
      return lessonProgress[`${type}-${index}`] === true;
    };

    return {
      getItem,
      setItem,
      removeItem,
      clear,
      getProgress,
      saveProgress,
      isCheckpointCompleted
    };
  })();

  // Expose StorageEngine globally
  window.GC_STORAGE = StorageEngine;

  function markCheckpointCompleted(type, index) {
    if (!currentLesson) return;
    const lessonId = currentLesson.id;
    const progress = StorageEngine.getProgress();
    if (!progress[lessonId]) progress[lessonId] = {};
    progress[lessonId][`${type}-${index}`] = true;
    StorageEngine.saveProgress(progress);
  }

  function updateLessonTotalCheckpoints() {
    if (!currentLesson) return;
    const lessonId = currentLesson.id;
    const total = $$('[data-predict]').length +
                  $$('.recall').length +
                  $$('[data-peek]').length +
                  $$('[data-scheme]').length +
                  $$('[data-widget]').length +
                  $$('[data-motion="step"]').length +
                  $$('[data-motion="scrub"]').length +
                  $$('[data-motion="zoom"]').length;
    const progress = StorageEngine.getProgress();
    if (!progress[lessonId]) progress[lessonId] = {};
    progress[lessonId]._total = total;
    StorageEngine.saveProgress(progress);
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
    let saved = StorageEngine.getItem('gc-theme');
    if (saved === 'dark' || (!saved && matchMedia('(prefers-color-scheme: dark)').matches)) root.classList.add('dark');
    const btn = $('#themeToggle');
    if (btn) btn.addEventListener('click', () => {
      root.classList.toggle('dark');
      StorageEngine.setItem('gc-theme', root.classList.contains('dark') ? 'dark' : 'light');
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

    // Restore state
    if (StorageEngine.isCheckpointCompleted('predict', idx)) {
      done = true;
      group.dataset.completed = 'true';
      const c = $('[data-correct="true"]', group);
      if (c) c.classList.add('correct');
      if (box) box.classList.add('show');
    }

    $$('.opt', group).forEach(opt => opt.addEventListener('click', () => {
      if (done || group.dataset.completed === 'true') return;
      done = true;
      group.dataset.completed = 'true';
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

    // Restore state
    if (StorageEngine.isCheckpointCompleted('recall', idx)) {
      blanks.forEach(b => {
        b.value = b.dataset.answer.split('|')[0].replace(/-/g, ' ');
        b.classList.remove('wrong', 'correct', 'shown');
        b.classList.add('correct');
      });
      if (fb) {
        fb.textContent = blanks.length + ' / ' + blanks.length + ' correct';
        fb.className = 'feedback good';
      }
    }

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
  $$('[data-peek]').forEach((btn, idx) => {
    const box = btn.nextElementSibling;

    // Restore state
    if (StorageEngine.isCheckpointCompleted('peek', idx) && box && box.classList.contains('peek-box')) {
      box.classList.add('show');
    }

    btn.addEventListener('click', () => {
      if (box && box.classList.contains('peek-box')) box.classList.toggle('show');
      markCheckpointCompleted('peek', idx);
    });
  });

  /* ---- mark-scheme reveal ---- */
  $$('[data-scheme]').forEach((btn, idx) => {
    const box = btn.closest('.exam-frame') ? $('.scheme', btn.closest('.exam-frame')) : btn.nextElementSibling;

    // Restore state
    if (StorageEngine.isCheckpointCompleted('scheme', idx) && box) {
      box.classList.add('show');
      btn.textContent = 'Hide mark scheme';
    }

    btn.addEventListener('click', () => {
      if (!box) return;
      box.classList.toggle('show');
      btn.textContent = box.classList.contains('show') ? 'Hide mark scheme' : 'Reveal mark scheme';
      markCheckpointCompleted('scheme', idx);
    });
  });

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

    $$('.diagram svg, .diagram img').forEach(mediaEl => {
      mediaEl.addEventListener('click', (e) => {
        e.stopPropagation();

        // Clone the diagram (SVG or image) and insert into content
        const clone = mediaEl.cloneNode(true);
        clone.removeAttribute('style'); // Clear any local styling
        content.innerHTML = '';
        content.appendChild(clone);

        // Find caption if available
        const parent = mediaEl.closest('.diagram');
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
      } else if (type === 'sort-classify') {
        initSortClassify(el, config, idx);
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

      if (StorageEngine.isCheckpointCompleted('commit-reveal', widgetIdx)) {
        el.dataset.committed = 'true';
        checkBtn.style.display = 'none';
        resetBtn.style.display = '';

        const correctIdx = config.options.findIndex(opt => opt.correct);
        state.selectedOptIdx = correctIdx >= 0 ? correctIdx : 0;

        const opts = $$('.w-opt', grid);
        opts.forEach(o => o.setAttribute('disabled', 'true'));
        if (correctIdx >= 0 && opts[correctIdx]) {
          opts[correctIdx].classList.add('correct');
        }

        const chosen = config.options[state.selectedOptIdx];
        feedback.innerHTML = chosen.feedback;
        feedback.className = 'w-feedback correct';

        if (config.reveal) {
          revealArea.innerHTML = config.reveal;
          revealArea.style.display = 'block';
          revealArea.classList.add('show');
        }
      }

    } else if (mode === 'free') {
      const textarea = document.createElement('textarea');
      textarea.className = 'w-textarea';
      textarea.placeholder = 'Write your answer first — even a rough one...';
      workspace.appendChild(textarea);

      const minChars = config.minChars || 25;
      const hint = document.createElement('div');
      hint.className = 'w-progress-hint';
      workspace.appendChild(hint);

      textarea.addEventListener('input', () => {
        const len = textarea.value.trim().length;
        if (len === 0) {
          hint.textContent = '';
          hint.classList.remove('ready');
        } else if (len < minChars) {
          hint.textContent = 'Keep going…';
          hint.classList.remove('ready');
        } else {
          hint.textContent = 'Ready';
          hint.classList.add('ready');
        }
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
          hint.textContent = '';
          hint.classList.remove('ready');
          cBtn.setAttribute('disabled', 'true');
          revealArea.style.display = 'none';
          revealArea.classList.remove('show');
          revealArea.innerHTML = '';
        }
      );
      checkBtn.textContent = 'Compare with model';
      checkBtn.setAttribute('disabled', 'true');

      if (StorageEngine.isCheckpointCompleted('commit-reveal', widgetIdx)) {
        textarea.setAttribute('disabled', 'true');
        checkBtn.style.display = 'none';
        resetBtn.style.display = '';
        feedback.textContent = 'Excellent. Now compare your self-explanation with the model below.';
        feedback.className = 'w-feedback correct';

        if (config.reveal) {
          revealArea.innerHTML = `<h4>Model Answer</h4><p>${config.reveal}</p>`;
          revealArea.style.display = 'block';
          revealArea.classList.add('show');
        }
      }

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

      if (StorageEngine.isCheckpointCompleted('commit-reveal', widgetIdx)) {
        state.drillIdx = config.items.length - 1;
        state.drillCorrectCount = config.items.length;
        progressEl.textContent = `Item ${config.items.length} of ${config.items.length}`;
        scoreEl.textContent = `Score: ${config.items.length} / ${config.items.length}`;

        const item = config.items[state.drillIdx];
        qBox.innerHTML = `<p>${item.prompt}</p>`;
        grid.innerHTML = '';
        item.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'w-opt';
          btn.type = 'button';
          btn.innerHTML = opt.label;
          btn.setAttribute('disabled', 'true');
          if (opt.correct) btn.classList.add('correct');
          grid.appendChild(btn);
        });

        checkBtn.style.display = 'none';
        resetBtn.style.display = '';
        feedback.textContent = `Completed! Final score: ${config.items.length} / ${config.items.length}`;
        feedback.className = 'w-feedback correct';

        if (config.reveal) {
          revealArea.innerHTML = config.reveal;
          revealArea.style.display = 'block';
          revealArea.classList.add('show');
        }
      }
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
          const promptHtml = blank.prompt ? `<div class="w-blank-prompt">${blank.prompt}</div>` : '';
          inputHtml = `${promptHtml}<div class="w-blank-choices" data-blank-idx="${bIdx}">`;
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

    if (StorageEngine.isCheckpointCompleted('faded-example', widgetIdx)) {
      blanksData.forEach((data, bIdx) => {
        data.resolved = true;
        const blank = data.config;
        const li = yoursSteps.children[data.stepIdx];
        const feedbackEl = li.querySelector('.w-step-feedback');
        const checkBtnStep = li.querySelector('.w-step-check-btn');
        if (checkBtnStep) checkBtnStep.style.display = 'none';

        let styleTarget = null;
        if (blank.type === 'numeric' || blank.type === 'text') {
          styleTarget = li.querySelector('.w-blank-input');
          styleTarget.value = Array.isArray(blank.answer) ? blank.answer[0] : blank.answer;
          styleTarget.classList.add('correct');
          styleTarget.setAttribute('disabled', 'true');
        } else if (blank.type === 'choice') {
          styleTarget = li.querySelector('.w-blank-choices');
          const opts = styleTarget.querySelectorAll('.w-blank-opt');
          opts.forEach(o => {
            o.setAttribute('disabled', 'true');
            if (o.textContent === blank.answer) {
              o.classList.add('correct');
              o.classList.add('selected');
            }
          });
        }
        if (feedbackEl) {
          feedbackEl.innerHTML = blank.feedback_right || 'Correct!';
          feedbackEl.className = 'w-step-feedback correct';
        }
      });

      checkBtn.style.display = 'none';
      resetBtn.style.display = '';
      feedback.textContent = 'All steps resolved.';
      feedback.className = 'w-feedback correct';
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

      if (StorageEngine.isCheckpointCompleted('scaffold', widgetIdx)) {
        el.dataset.committed = 'true';
        checkBtn.style.display = 'none';
        resetBtn.style.display = '';

        config.slots.forEach(slot => {
          const correctCardIdx = config.bank.findIndex(card => card.slot === slot.id);
          if (correctCardIdx >= 0) {
            slotAssignments[slot.id] = correctCardIdx;
          }
        });

        renderBank();
        renderSlots();

        const slotEls = slotsContainer.querySelectorAll('.w-slot');
        slotEls.forEach(slotEl => {
          slotEl.classList.add('correct');
          slotEl.style.cursor = 'default';
        });

        feedback.textContent = 'All statements placed correctly!';
        feedback.className = 'w-feedback correct';
      }

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

      if (StorageEngine.isCheckpointCompleted('scaffold', widgetIdx)) {
        checkBtn.style.display = 'none';
        resetBtn.style.display = '';
        feedback.textContent = 'Excellent. Compare each of your points with the model answers shown below.';
        feedback.className = 'w-feedback correct';

        config.slots.forEach((slot, sIdx) => {
          const ta = textareas[sIdx];
          ta.setAttribute('disabled', 'true');
          const reveal = ta.nextElementSibling;
          reveal.innerHTML = `<h4>Model Answer</h4><p>${slot.model}</p>`;
          reveal.style.display = 'block';
          reveal.classList.add('show');
        });
      }

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

      if (StorageEngine.isCheckpointCompleted('scaffold', widgetIdx)) {
        tableBlanks.forEach((data, bIdx) => {
          data.resolved = true;
          const blank = data.config;
          const input = data.tdElement.querySelector('.w-blank-input');
          if (input) {
            input.value = Array.isArray(blank.answer) ? blank.answer[0] : blank.answer;
            input.classList.add('correct');
            input.setAttribute('disabled', 'true');
          }
        });

        checkBtn.style.display = 'none';
        resetBtn.style.display = '';
        feedback.textContent = 'Table complete!';
        feedback.className = 'w-feedback correct';
      }
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

    if (StorageEngine.isCheckpointCompleted('step-builder', widgetIdx)) {
      currentStep = config.steps.length - 1;
      renderStep();

      const opts = $$('.w-opt', grid);
      opts.forEach((btn, idx) => {
        btn.setAttribute('disabled', 'true');
        if (config.steps[currentStep].options[idx].correct) {
          btn.classList.add('correct');
          feedback.innerHTML = config.steps[currentStep].options[idx].feedback || 'Correct!';
        }
      });
      feedback.className = 'w-feedback correct';

      checkBtn.style.display = 'none';
      resetBtn.style.display = '';

      if (config.finale) {
        revealArea.innerHTML = config.finale;
        revealArea.style.display = 'block';
        revealArea.classList.add('show');
      }
    }
  }

  // --- 5. Sort & Classify Widget ---
  function initSortClassify(el, config, widgetIdx) {
    if (!config.items || !config.items.length || !config.categories) return;

    // State
    const state = {
      currentIndex: 0,
      correctCount: 0,
      attempts: 0,
      firstTryCorrect: Array(config.items.length).fill(true)
    };

    // Create DOM structure
    const container = document.createElement('div');
    container.className = 'w-sort-container';
    el.appendChild(container);

    const header = document.createElement('div');
    header.className = 'w-sort-header';
    container.appendChild(header);

    const progressEl = document.createElement('span');
    progressEl.className = 'w-sort-status';
    header.appendChild(progressEl);

    const scoreEl = document.createElement('span');
    scoreEl.className = 'w-sort-status';
    header.appendChild(scoreEl);

    const cardStage = document.createElement('div');
    cardStage.className = 'w-sort-card-stage';
    container.appendChild(cardStage);

    const binsGrid = document.createElement('div');
    binsGrid.className = 'w-sort-bins';
    container.appendChild(binsGrid);

    const revealArea = document.createElement('div');
    revealArea.className = 'w-reveal-area';
    revealArea.style.display = 'none';
    el.appendChild(revealArea);

    const updateStatus = () => {
      progressEl.textContent = `Item ${state.currentIndex + 1} of ${config.items.length}`;
      scoreEl.textContent = `Correct: ${state.correctCount} / ${config.items.length}`;
    };

    const renderCard = () => {
      cardStage.innerHTML = '';
      if (state.currentIndex >= config.items.length) return;

      const item = config.items[state.currentIndex];
      const card = document.createElement('div');
      card.className = 'w-sort-card';
      card.innerHTML = `<p>${item.text}</p>`;
      cardStage.appendChild(card);
    };

    const renderBins = () => {
      binsGrid.innerHTML = '';
      config.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'w-sort-bin';
        btn.type = 'button';
        btn.textContent = cat.label;
        btn.dataset.catId = cat.id;

        btn.addEventListener('click', () => {
          if (el.dataset.committed === 'true') return;
          classifyItem(cat.id, btn);
        });

        binsGrid.appendChild(btn);
      });
    };

    const classifyItem = (catId, clickedBtn) => {
      const item = config.items[state.currentIndex];
      const isCorrect = (item.category === catId);

      // Disable other buttons during animations or checking state
      const bins = $$('.w-sort-bin', binsGrid);

      if (isCorrect) {
        // Success flow
        el.dataset.committed = 'true';
        bins.forEach(b => b.setAttribute('disabled', 'true'));
        clickedBtn.removeAttribute('disabled');
        clickedBtn.classList.add('correct');

        feedback.innerHTML = item.feedback_right || 'Correct!';
        feedback.className = 'w-feedback correct';

        if (state.firstTryCorrect[state.currentIndex]) {
          state.correctCount++;
        }
        updateStatus();

        if (state.currentIndex < config.items.length - 1) {
          checkBtn.style.display = '';
          checkBtn.textContent = 'Next';
        } else {
          checkBtn.style.display = 'none';
          resetBtn.style.display = '';
          feedback.textContent = `Completed! Score: ${state.correctCount} / ${config.items.length}`;
          if (config.reveal) {
            revealArea.innerHTML = config.reveal;
            revealArea.style.display = 'block';
            revealArea.classList.add('show');
            initWidgets();
            initMotionPrimitives();
          }
          markCheckpointCompleted('sort-classify', widgetIdx);
        }
      } else {
        // Error flow
        state.firstTryCorrect[state.currentIndex] = false;
        clickedBtn.classList.add('wrong');
        clickedBtn.setAttribute('disabled', 'true');

        feedback.innerHTML = item.feedback_wrong || 'Try another category.';
        feedback.className = 'w-feedback wrong';

        // Clear wrong class after animation completes so it can shake again
        setTimeout(() => {
          clickedBtn.classList.remove('wrong');
        }, 400);
      }
    };

    const { checkBtn, resetBtn, feedback } = createWidgetControls(el,
      // onCheck (Next)
      (cBtn, rBtn, fb) => {
        el.removeAttribute('data-committed');
        state.currentIndex++;
        state.attempts = 0;
        cBtn.style.display = 'none';
        fb.textContent = '';
        fb.className = 'w-feedback';
        updateStatus();
        renderCard();
        renderBins();
      },
      // onReset
      (cBtn, rBtn, fb) => {
        el.removeAttribute('data-committed');
        state.currentIndex = 0;
        state.correctCount = 0;
        state.attempts = 0;
        state.firstTryCorrect = Array(config.items.length).fill(true);
        cBtn.style.display = 'none';
        fb.textContent = '';
        fb.className = 'w-feedback';
        revealArea.style.display = 'none';
        revealArea.classList.remove('show');
        revealArea.innerHTML = '';
        updateStatus();
        renderCard();
        renderBins();
      }
    );

    // Initial setup
    checkBtn.style.display = 'none';
    // createWidgetControls' own reset handler re-shows the Check button after
    // onReset runs; here Check doubles as "Next" and must stay hidden until an
    // item is answered, or clicking it skips items. This listener runs last.
    resetBtn.addEventListener('click', () => { checkBtn.style.display = 'none'; });
    updateStatus();
    renderCard();
    renderBins();

    // Restore state from persistence layer
    if (StorageEngine.isCheckpointCompleted('sort-classify', widgetIdx)) {
      state.currentIndex = config.items.length - 1;
      state.correctCount = config.items.length; // Assume perfect score on complete restore
      updateStatus();
      cardStage.innerHTML = '<div class="w-sort-card"><p>Sorting complete!</p></div>';
      renderBins();
      $$('.w-sort-bin', binsGrid).forEach(b => {
        b.setAttribute('disabled', 'true');
        const item = config.items[state.currentIndex];
        if (b.dataset.catId === item.category) {
          b.classList.add('correct');
        }
      });
      feedback.textContent = `Completed! Score: ${config.items.length} / ${config.items.length}`;
      feedback.className = 'w-feedback correct';
      checkBtn.style.display = 'none';
      resetBtn.style.display = '';
      if (config.reveal) {
        revealArea.innerHTML = config.reveal;
        revealArea.style.display = 'block';
        revealArea.classList.add('show');
      }
    }
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

    // Build a fixed-height stage so all frames crossfade in the same spot
    // instead of stacking in normal document flow. Measure each frame's
    // natural height BEFORE moving it (while still in flow, unstyled),
    // then move every frame into the stage and size the stage to the
    // tallest one so the frame never jumps or reserves extra dead space.
    const frames = Array.from(el.querySelectorAll('[data-step]'));
    const stage = document.createElement('div');
    stage.className = 'step-stage';
    el.insertBefore(stage, el.firstChild);

    let maxHeight = 0;
    const oldParents = new Set();
    frames.forEach(f => {
      maxHeight = Math.max(maxHeight, f.getBoundingClientRect().height);
      if (f.parentElement && f.parentElement !== el) oldParents.add(f.parentElement);
      stage.appendChild(f);
    });
    if (maxHeight > 0) stage.style.height = `${Math.ceil(maxHeight)}px`;

    // Clean up now-empty wrapper elements the frames used to live in.
    oldParents.forEach(p => {
      if (p !== stage && !p.contains(stage) && p.children.length === 0 && !p.textContent.trim()) {
        p.remove();
      }
    });

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

    // Each level must carry this class so the CSS absolute-position +
    // opacity/visibility crossfade rules actually apply — without it every
    // level renders in normal flow at full opacity (they just stack).
    Object.values(layers).forEach(layer => {
      if (layer) layer.classList.add('zoom-level-layer');
    });

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

  window.GC_SCRUB_FN['imf-cooling-curve'] = function (container, value) {
    const svg = container.querySelector('svg');
    const curve = svg ? svg.querySelector('.imf-curve') : null;
    const label = svg ? svg.querySelector('.imf-curve-label') : null;
    if (!curve) return;

    const t = Math.max(0, Math.min(100, value)) / 100;
    // Interpolates between hexane's steep drop (t=0) and water's shallow drop (t=1)
    const endY = 172 - t * (172 - 95);
    const midY = 130 - t * (130 - 90);
    curve.setAttribute('d', `M50 80 Q 150 ${midY.toFixed(1)}, 350 ${endY.toFixed(1)}`);

    let regime, color;
    if (value < 33) {
      regime = 'London dispersion only — weak, fast evaporation';
      color = 'var(--accent)';
    } else if (value < 67) {
      regime = 'Dipole-dipole — moderate';
      color = 'var(--ink-soft)';
    } else {
      regime = 'Hydrogen bonding — strong, slow evaporation';
      color = 'var(--cool)';
    }
    curve.setAttribute('stroke', color);
    if (label) {
      label.setAttribute('y', (endY - 8).toFixed(1));
      label.setAttribute('fill', color);
      label.textContent = regime;
    }
  };

  /* ============================================================
     PRINT / PDF EXPORT — see INTERACTION_SPEC.md §3.5
     ============================================================ */

  function firstAnswer(answer) {
    return Array.isArray(answer) ? answer[0] : answer;
  }

  function makePrintOnly(tag, className) {
    const node = document.createElement(tag);
    node.className = 'print-only' + (className ? ' ' + className : '');
    return node;
  }

  function renderPrintOption(opt) {
    const item = document.createElement('div');
    item.className = 'w-print-item';
    const optEl = document.createElement('div');
    optEl.className = 'w-opt correct';
    optEl.innerHTML = '✓ ' + opt.label;
    item.appendChild(optEl);
    if (opt.feedback) {
      const fb = document.createElement('div');
      fb.className = 'w-print-feedback';
      fb.innerHTML = opt.feedback;
      item.appendChild(fb);
    }
    return item;
  }

  // Resolve any [data-widget] found inside HTML this print pass injects
  // (a widget's `reveal`/`finale` config can itself contain a nested widget).
  function resolveNestedWidgetsForPrint(container) {
    $$('[data-widget]', container).forEach(nested => {
      const printBlock = renderWidgetPrint(nested);
      if (printBlock) nested.replaceWith(printBlock);
    });
  }

  // Pure renderer: reads a widget's .w-config JSON and returns a detached
  // .print-only block with its prompt/answer/model content unrolled.
  // Never touches the widget's live DOM and never marks a checkpoint.
  function renderWidgetPrint(el) {
    const configEl = $('.w-config', el);
    if (!configEl) return null;
    let config;
    try { config = JSON.parse(configEl.textContent); } catch (e) { return null; }

    const type = el.dataset.widget;
    const block = makePrintOnly('div', 'w-print-static');

    const appendRevealHtml = (html) => {
      if (!html) return;
      const wrap = document.createElement('div');
      wrap.innerHTML = html;
      resolveNestedWidgetsForPrint(wrap);
      block.appendChild(wrap);
    };

    if (type === 'commit-reveal') {
      const mode = config.mode || 'choice';
      const prompt = document.createElement('div');
      prompt.className = 'w-prompt';
      prompt.innerHTML = config.prompt || '';
      block.appendChild(prompt);

      if (mode === 'choice') {
        (config.options || []).filter(o => o.correct).forEach(opt => block.appendChild(renderPrintOption(opt)));
        appendRevealHtml(config.reveal);
      } else if (mode === 'free') {
        const label = document.createElement('div');
        label.className = 'w-print-label';
        label.textContent = 'Model answer';
        block.appendChild(label);
        appendRevealHtml(config.reveal);
      } else if (mode === 'drill') {
        (config.items || []).forEach(item => {
          const q = document.createElement('div');
          q.className = 'w-print-item';
          q.innerHTML = '<p>' + item.prompt + '</p>';
          block.appendChild(q);
          const correctOpt = (item.options || []).find(o => o.correct);
          if (correctOpt) block.appendChild(renderPrintOption(correctOpt));
        });
        appendRevealHtml(config.reveal);
      }
    } else if (type === 'faded-example') {
      const label = document.createElement('div');
      label.className = 'w-print-label';
      label.textContent = (config.yours && config.yours.title) || 'Your steps';
      block.appendChild(label);

      const ol = document.createElement('ol');
      ol.className = 'faded-steps';
      ((config.yours && config.yours.steps) || []).forEach(step => {
        const li = document.createElement('li');
        const labelHtml = '<span class="step-label">' + step.label + '</span>';
        if (step.given !== undefined) {
          li.innerHTML = labelHtml + '<div class="step-work">' + step.given + '</div>';
        } else if (step.blank) {
          const blank = step.blank;
          const answerText = blank.type === 'choice' ? blank.answer : firstAnswer(blank.answer);
          li.innerHTML = labelHtml;
          const work = document.createElement('div');
          work.className = 'step-work';
          const ansSpan = document.createElement('span');
          ansSpan.className = 'w-opt correct';
          ansSpan.textContent = answerText;
          work.appendChild(ansSpan);
          li.appendChild(work);
        }
        ol.appendChild(li);
      });
      block.appendChild(ol);
    } else if (type === 'scaffold') {
      const mode = config.mode || 'free';
      if (mode === 'bank') {
        (config.slots || []).forEach(slot => {
          const card = (config.bank || []).find(c => c.slot === slot.id);
          const item = document.createElement('div');
          item.className = 'w-print-item';
          const labelDiv = document.createElement('div');
          labelDiv.className = 'w-print-label';
          labelDiv.textContent = slot.label;
          const ansDiv = document.createElement('div');
          ansDiv.className = 'w-opt correct';
          ansDiv.textContent = card ? card.text : '';
          item.appendChild(labelDiv);
          item.appendChild(ansDiv);
          block.appendChild(item);
        });
      } else if (mode === 'table') {
        const wrapper = document.createElement('div');
        wrapper.className = 'w-table-wrapper';
        const tbl = document.createElement('table');
        tbl.className = 'w-table';
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        (config.table.headers || []).forEach(h => { headerRow.innerHTML += '<th>' + h + '</th>'; });
        thead.appendChild(headerRow);
        tbl.appendChild(thead);
        const tbody = document.createElement('tbody');
        (config.table.rows || []).forEach(row => {
          const tr = document.createElement('tr');
          row.forEach(cell => {
            const td = document.createElement('td');
            if (cell.given !== undefined) {
              td.innerHTML = cell.given;
            } else if (cell.blank) {
              const span = document.createElement('span');
              span.className = 'w-opt correct';
              span.textContent = firstAnswer(cell.blank.answer);
              td.appendChild(span);
            }
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        tbl.appendChild(tbody);
        wrapper.appendChild(tbl);
        block.appendChild(wrapper);
      } else {
        (config.slots || []).forEach(slot => {
          const item = document.createElement('div');
          item.className = 'w-print-item';
          const labelDiv = document.createElement('div');
          labelDiv.className = 'w-print-label';
          labelDiv.textContent = slot.label;
          const modelP = document.createElement('p');
          modelP.innerHTML = slot.model;
          item.appendChild(labelDiv);
          item.appendChild(modelP);
          block.appendChild(item);
        });
      }
    } else if (type === 'step-builder') {
      (config.steps || []).forEach(step => {
        const q = document.createElement('div');
        q.className = 'w-print-item';
        q.innerHTML = '<p>' + step.question + '</p>';
        block.appendChild(q);
        const correctOpt = (step.options || []).find(o => o.correct);
        if (correctOpt) block.appendChild(renderPrintOption(correctOpt));
      });
      appendRevealHtml(config.finale);
    } else if (type === 'sort-classify') {
      (config.items || []).forEach(item => {
        const q = document.createElement('div');
        q.className = 'w-print-item';
        q.innerHTML = '<p>' + item.text + '</p>';
        block.appendChild(q);
        const cat = (config.categories || []).find(c => c.id === item.category);
        if (cat) {
          const opt = document.createElement('div');
          opt.className = 'w-opt correct';
          opt.textContent = `Correct Classification: ${cat.label}`;
          block.appendChild(opt);
        }
      });
      appendRevealHtml(config.reveal);
    } else {
      return null;
    }

    return block;
  }

  function buildGlossaryAppendix() {
    if (typeof window.GC_GLOSSARY === 'undefined') return null;

    const getSlug = el => {
      if (el.dataset.term) return el.dataset.term;
      return el.textContent
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    };

    const seen = new Map();
    $$('strong.term').forEach(el => {
      const slug = getSlug(el);
      const entry = window.GC_GLOSSARY[slug];
      if (entry && !seen.has(slug)) seen.set(slug, entry);
    });
    if (seen.size === 0) return null;

    const entries = [...seen.values()].sort((a, b) => a.term.localeCompare(b.term));
    const section = makePrintOnly('section', 'print-glossary');
    const h2 = document.createElement('h2');
    h2.textContent = 'Key terms in this lesson';
    section.appendChild(h2);
    const dl = document.createElement('dl');
    entries.forEach(entry => {
      const dt = document.createElement('dt');
      dt.textContent = entry.term;
      const dd = document.createElement('dd');
      dd.textContent = entry.definition;
      if (entry.example) {
        const em = document.createElement('em');
        em.textContent = entry.example;
        dd.appendChild(em);
      }
      dl.appendChild(dt);
      dl.appendChild(dd);
    });
    section.appendChild(dl);
    return section;
  }

  let printPrepared = false;
  const printUndo = []; // stack of undo functions; restore runs them in reverse

  function preparePrint() {
    if (printPrepared) return; // beforeprint AND matchMedia can both fire
    printPrepared = true;

    // 1. activate the widget-hiding / print-only CSS gate
    document.body.classList.add('gc-printing');
    printUndo.push(() => document.body.classList.remove('gc-printing'));

    // 2. force light mode (never touch localStorage)
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      printUndo.push(() => document.documentElement.classList.add('dark'));
    }

    // 3. print header
    const header = makePrintOnly('div', 'print-header');
    header.textContent = currentLesson ? (currentLesson.id + ' · ' + currentLesson.title) : document.title;
    document.body.insertBefore(header, document.body.firstChild);
    printUndo.push(() => header.remove());

    // 4. fill empty recall blanks (leave student-entered values alone)
    $$('.recall .blank').forEach(b => {
      if (b.value) return;
      b.value = b.dataset.answer.split('|')[0].replace(/-/g, ' ');
      b.classList.add('shown');
      printUndo.push(() => {
        b.value = '';
        b.classList.remove('shown');
      });
    });

    // 5. open faded-example model panels (real <details>, CSS can't do this)
    $$('details.faded-model-collapsible').forEach(d => {
      if (d.open) return;
      d.open = true;
      printUndo.push(() => { d.open = false; });
    });

    // 6. one static print block per widget
    $$('[data-widget]').forEach(el => {
      const printBlock = renderWidgetPrint(el);
      if (!printBlock) return;
      el.appendChild(printBlock);
      printUndo.push(() => printBlock.remove());
    });

    // 7. caption step & zoom frames (after 6, so nested reveal content is covered)
    $$('[data-motion="step"]').forEach(container => {
      const labels = (container.dataset.stepLabels || '').split('|').filter(Boolean);
      $$('[data-step]', container).forEach(frame => {
        const stepNum = parseInt(frame.dataset.step, 10);
        const label = labels[stepNum - 1] || ('Step ' + stepNum);
        const cap = makePrintOnly('div', 'print-step-caption');
        cap.textContent = 'Step ' + stepNum + ' — ' + label;
        frame.insertBefore(cap, frame.firstChild);
        printUndo.push(() => cap.remove());
      });
    });

    $$('[data-motion="zoom"]').forEach(container => {
      const labels = (container.dataset.zoomLabels || '').split('|').filter(Boolean);
      const defaultLabels = { macro: 'Out', meso: 'Mid', particulate: 'In' };
      ['macro', 'meso', 'particulate'].forEach((key, i) => {
        const layer = container.querySelector('[data-zoom-level="' + key + '"]');
        if (!layer) return;
        const cap = makePrintOnly('div', 'print-zoom-caption');
        cap.textContent = labels[i] || defaultLabels[key];
        layer.insertBefore(cap, layer.firstChild);
        printUndo.push(() => cap.remove());
      });
    });

    // 8. glossary appendix
    const appendix = buildGlossaryAppendix();
    if (appendix) {
      const footer = $('.footer');
      if (footer) footer.parentNode.insertBefore(appendix, footer);
      else document.body.appendChild(appendix);
      printUndo.push(() => appendix.remove());
    }
  }

  function restoreAfterPrint() {
    if (!printPrepared) return;
    printPrepared = false;
    while (printUndo.length) printUndo.pop()();
  }

  window.addEventListener('beforeprint', preparePrint);
  window.addEventListener('afterprint', restoreAfterPrint);
  (function () {
    const pmq = window.matchMedia('print');
    const onChange = m => { if (m.matches) preparePrint(); else restoreAfterPrint(); };
    if (pmq.addEventListener) pmq.addEventListener('change', onChange);
    else if (pmq.addListener) pmq.addListener(onChange);
  })();

  /* ---- topbar print button ---- */
  (function () {
    const right = $('.topbar-right');
    if (!right) return;
    const btn = document.createElement('button');
    btn.className = 'toc-btn print-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Print this lesson');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      Print
    `;
    btn.addEventListener('click', () => window.print());
    right.insertBefore(btn, right.firstChild);
  })();

  /* ---- topbar periodic table button & drawer injector ---- */
  (function () {
    // Only run if we are inside a lesson page (where topbar is present and currentLesson is active)
    if (!currentLesson) return;

    const right = $('.topbar-right');
    if (!right) return;

    const btn = document.createElement('button');
    btn.id = 'ptableBtn';
    btn.className = 'toc-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open student reference center');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
      References
    `;

    // Insert before the print button
    const printBtn = right.querySelector('.print-btn');
    if (printBtn) {
      right.insertBefore(btn, printBtn);
    } else {
      right.appendChild(btn);
    }

    let elementsScript = null;
    if (!window.GC_ELEMENTS) {
      elementsScript = document.createElement('script');
      elementsScript.src = '../assets/elements.js';
      elementsScript.async = true;
      document.head.appendChild(elementsScript);
    }

    let drawerOverlay = null;
    let drawer = null;
    let initialized = false;

    btn.addEventListener('click', () => {
      if (!initialized) {
        initPeriodicTableDrawer();
        initialized = true;
      }
      openDrawer();
    });

    function openDrawer() {
      if (drawerOverlay && drawer) {
        drawerOverlay.classList.add('open');
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeDrawer() {
      if (drawerOverlay && drawer) {
        drawerOverlay.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    }

    function initPeriodicTableDrawer() {
      // 1. Create overlay & drawer elements in DOM
      drawerOverlay = document.createElement('div');
      drawerOverlay.className = 'ptable-drawer-overlay';
      document.body.appendChild(drawerOverlay);

      drawer = document.createElement('div');
      drawer.className = 'ptable-drawer';
      drawer.id = 'ptableDrawer';
      
      drawer.innerHTML = `
        <div class="ptable-drawer-header">
          <h3>Reference Center</h3>
          <button class="ptable-close-btn" aria-label="Close reference drawer">&times;</button>
        </div>
        <div class="ptable-drawer-tabs">
          <button class="ptable-drawer-tab active" data-panel="ptable">Periodic Table</button>
          <button class="ptable-drawer-tab" data-panel="formulas">Formulas &amp; Tables</button>
          <button class="ptable-drawer-tab" data-panel="calc">Calculator</button>
        </div>
        <div class="ptable-drawer-body">
          <!-- Panel 1: Periodic Table -->
          <div class="ptable-panel active" id="panelPtable">
            <div class="ptable-controls">
              <div class="ptable-control-row">
                <span class="label">Display Mode:</span>
                <label class="ptable-toggle-label">
                  <input type="checkbox" id="ptableTransitionToggle" checked>
                  Show Transition Metals
                </label>
              </div>
              <div class="ptable-tabs">
                <button class="ptable-tab active" data-mode="default">Default</button>
                <button class="ptable-tab" data-mode="radius">Radius</button>
                <button class="ptable-tab" data-mode="ie">IE</button>
                <button class="ptable-tab" data-mode="en">EN</button>
              </div>
            </div>
            <div class="ptable-grid-container">
              <div class="ptable-grid"></div>
            </div>
            <div class="ptable-legend" id="ptableLegend"></div>
            <div class="ptable-detail-panel" id="ptableDetailPanel">
              <div class="ptable-detail-placeholder">
                Select an element to view Bohr atomic model, configuration, and periodic properties.
              </div>
              <div class="ptable-detail-content" style="display: none;">
                <div class="ptable-detail-main">
                  <div class="ptable-detail-atom-header">
                    <span class="ptable-detail-sym">H</span>
                    <span class="ptable-detail-z">Z=1</span>
                  </div>
                  <div class="ptable-detail-name">Hydrogen</div>
                  <div class="ptable-detail-kind-tag">Nonmetal</div>
                  <div class="ptable-detail-stats">
                    <div class="ptable-detail-stat-row">
                      <span class="ptable-detail-stat-label">Group Name</span>
                      <span class="ptable-detail-stat-val val-group">Group 1</span>
                    </div>
                    <div class="ptable-detail-stat-row">
                      <span class="ptable-detail-stat-label">Shell Config</span>
                      <span class="ptable-detail-stat-val val-shells">1</span>
                    </div>
                    <div class="ptable-detail-stat-row">
                      <span class="ptable-detail-stat-label">Valence e⁻</span>
                      <span class="ptable-detail-stat-val val-valence">1</span>
                    </div>
                    <div class="ptable-detail-stat-row">
                      <span class="ptable-detail-stat-label">Typical Charge</span>
                      <span class="ptable-detail-stat-val val-charge">1+</span>
                    </div>
                    <div class="ptable-detail-stat-row">
                      <span class="ptable-detail-stat-label">Atomic Radius</span>
                      <span class="ptable-detail-stat-val val-radius">53 pm</span>
                    </div>
                    <div class="ptable-detail-stat-row">
                      <span class="ptable-detail-stat-label">Ionization Energy</span>
                      <span class="ptable-detail-stat-val val-ie">1312 kJ/mol</span>
                    </div>
                    <div class="ptable-detail-stat-row">
                      <span class="ptable-detail-stat-label">Electronegativity</span>
                      <span class="ptable-detail-stat-val val-en">2.20</span>
                    </div>
                    <div class="ptable-detail-stat-row">
                      <span class="ptable-detail-stat-label">Tendency</span>
                      <span class="ptable-detail-stat-val val-tendency">gains 1 e⁻ (1−)</span>
                    </div>
                  </div>
                </div>
                <div class="ptable-detail-visual"></div>
              </div>
            </div>
          </div>

          <!-- Panel 2: Formulas & Tables -->
          <div class="ptable-panel" id="panelFormulas">
            <div class="ptable-formulas-container">
              <div class="ptable-ref-section">
                <h4>Mole Conversions</h4>
                <p>Use Avogadro's number (6.022 &times; 10²³) to count particles, and molar mass (g/mol) from the periodic table to weigh them.</p>
                <div class="ptable-bridge-diagram">
                  <div class="ptable-bridge-node">Mass<br><span style="font-size:0.5rem; color:var(--ink-mute);">grams</span></div>
                  <div class="ptable-bridge-arrow">
                    <span>&divide; Molar Mass</span>
                    <span>&rarr;</span>
                    <span>&larr;</span>
                    <span>&times; Molar Mass</span>
                  </div>
                  <div class="ptable-bridge-node">Moles<br><span style="font-size:0.5rem; color:var(--ink-mute);">mol</span></div>
                  <div class="ptable-bridge-arrow">
                    <span>&times; Avogadro's #</span>
                    <span>&rarr;</span>
                    <span>&larr;</span>
                    <span>&divide; Avogadro's #</span>
                  </div>
                  <div class="ptable-bridge-node">Particles<br><span style="font-size:0.5rem; color:var(--ink-mute);">atoms/molecules</span></div>
                </div>
              </div>
              
              <div class="ptable-ref-section">
                <h4>Bonding &amp; Electronegativity Differences</h4>
                <p>The difference in electronegativity (&Delta;EN) between two bonded atoms predicts their bonding character:</p>
                <table class="ptable-ref-table">
                  <thead>
                    <tr>
                      <th>&Delta;EN Range</th>
                      <th>Bond Type</th>
                      <th>Electron Sharing</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>&lt; 0.5</td>
                      <td>Nonpolar Covalent</td>
                      <td>Equally shared</td>
                    </tr>
                    <tr>
                      <td>0.5 &ndash; 1.7</td>
                      <td>Polar Covalent</td>
                      <td>Unequally shared (partial charges &delta;+/&delta;&minus;)</td>
                    </tr>
                    <tr>
                      <td>&gt; 1.7</td>
                      <td>Ionic</td>
                      <td>Transferred completely (ions form)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="ptable-ref-section">
                <h4>Common Polyatomic Ions</h4>
                <p>Memorized group ions that stay together as a single charged unit in ionic formulas:</p>
                <table class="ptable-ref-table">
                  <thead>
                    <tr>
                      <th>Ion Name</th>
                      <th>Formula</th>
                      <th>Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ammonium</td>
                      <td>NH<sub>4</sub><sup>+</sup></td>
                      <td>1+</td>
                    </tr>
                    <tr>
                      <td>Hydroxide</td>
                      <td>OH<sup>&minus;</sup></td>
                      <td>1&minus;</td>
                    </tr>
                    <tr>
                      <td>Nitrate</td>
                      <td>NO<sub>3</sub><sup>&minus;</sup></td>
                      <td>1&minus;</td>
                    </tr>
                    <tr>
                      <td>Carbonate</td>
                      <td>CO<sub>3</sub><sup>2&minus;</sup></td>
                      <td>2&minus;</td>
                    </tr>
                    <tr>
                      <td>Sulfate</td>
                      <td>SO<sub>4</sub><sup>2&minus;</sup></td>
                      <td>2&minus;</td>
                    </tr>
                    <tr>
                      <td>Phosphate</td>
                      <td>PO<sub>4</sub><sup>3&minus;</sup></td>
                      <td>3&minus;</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="ptable-ref-section">
                <h4>Solubility Rules (Aqueous Salts)</h4>
                <p>Helps predict precipitate formation in double replacement reactions:</p>
                <table class="ptable-ref-table">
                  <thead>
                    <tr>
                      <th>Always Soluble (aq)</th>
                      <th>Generally Insoluble (s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Group 1 Cations (Li<sup>+</sup>, Na<sup>+</sup>, K<sup>+</sup>)</td>
                      <td>Carbonates (CO<sub>3</sub><sup>2&minus;</sup>)</td>
                    </tr>
                    <tr>
                      <td>Ammonium (NH<sub>4</sub><sup>+</sup>)</td>
                      <td>Phosphates (PO<sub>4</sub><sup>3&minus;</sup>)</td>
                    </tr>
                    <tr>
                      <td>Nitrate (NO<sub>3</sub><sup>&minus;</sup>)</td>
                      <td>Hydroxides (OH<sup>&minus;</sup>)</td>
                    </tr>
                    <tr>
                      <td style="color:var(--ink-mute); font-style:italic; font-size:0.56rem;" colspan="2">*Carbonates/Phosphates/Hydroxides become soluble when paired with Group 1 cations or ammonium.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Panel 3: Calculator -->
          <div class="ptable-panel" id="panelCalc">
            <div class="ptable-calc-container">
              <!-- Math calculator display -->
              <div class="ptable-calc-display-wrap">
                <div class="ptable-calc-expr" id="ptableCalcExpr"></div>
                <div class="ptable-calc-result" id="ptableCalcResult">0</div>
              </div>
              
              <!-- Calculator buttons grid -->
              <div class="ptable-calc-grid">
                <button class="ptable-calc-btn action" data-calc="clear">C</button>
                <button class="ptable-calc-btn action" data-calc="backspace">&larr;</button>
                <button class="ptable-calc-btn op" data-calc="e">EE</button>
                <button class="ptable-calc-btn op" data-calc="/">/</button>
                
                <button class="ptable-calc-btn" data-calc="7">7</button>
                <button class="ptable-calc-btn" data-calc="8">8</button>
                <button class="ptable-calc-btn" data-calc="9">9</button>
                <button class="ptable-calc-btn op" data-calc="*">&times;</button>
                
                <button class="ptable-calc-btn" data-calc="4">4</button>
                <button class="ptable-calc-btn" data-calc="5">5</button>
                <button class="ptable-calc-btn" data-calc="6">6</button>
                <button class="ptable-calc-btn op" data-calc="-">-</button>
                
                <button class="ptable-calc-btn" data-calc="1">1</button>
                <button class="ptable-calc-btn" data-calc="2">2</button>
                <button class="ptable-calc-btn" data-calc="3">3</button>
                <button class="ptable-calc-btn op" data-calc="+">+</button>
                
                <button class="ptable-calc-btn op" data-calc="(">(</button>
                <button class="ptable-calc-btn" data-calc="0">0</button>
                <button class="ptable-calc-btn op" data-calc=")">)</button>
                <button class="ptable-calc-btn op" data-calc="Ans">Ans</button>
                
                <button class="ptable-calc-btn equals" data-calc="equals" style="grid-column: span 4; height: 36px; margin-top: 2px;">=</button>
              </div>
              
              <!-- Molar Mass Converter Helper -->
              <div class="ptable-calc-helper">
                <div class="ptable-calc-helper-title">Mole-Mass Conversion Quick Tool</div>
                <div class="ptable-calc-helper-row">
                  <div class="ptable-calc-helper-field">
                    <span>Molar Mass (g/mol)</span>
                    <input type="number" id="ptableHelperMM" placeholder="e.g. 18.0" step="any">
                  </div>
                </div>
                <div class="ptable-calc-helper-row">
                  <div class="ptable-calc-helper-field">
                    <span>Grams (mass)</span>
                    <input type="number" id="ptableHelperGrams" placeholder="e.g. 36.0" step="any">
                  </div>
                  <div class="ptable-calc-helper-arrow">&harr;</div>
                  <div class="ptable-calc-helper-field">
                    <span>Moles (n)</span>
                    <input type="number" id="ptableHelperMoles" placeholder="e.g. 2.0" step="any">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(drawer);

      // Event listeners for close
      drawerOverlay.addEventListener('click', closeDrawer);
      drawer.querySelector('.ptable-close-btn').addEventListener('click', closeDrawer);

      // 1. Setup Drawer Navigation Tabs
      const drawerTabs = drawer.querySelectorAll('.ptable-drawer-tab');
      const panels = drawer.querySelectorAll('.ptable-panel');
      drawerTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          drawerTabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          
          tab.classList.add('active');
          const panelId = `panel${tab.dataset.panel.charAt(0).toUpperCase() + tab.dataset.panel.slice(1)}`;
          const activePanel = drawer.querySelector(`#${panelId}`);
          if (activePanel) activePanel.classList.add('active');
        });
      });

      // 2. Setup Chemistry Math Calculator
      const calcExprEl = drawer.querySelector('#ptableCalcExpr');
      const calcResultEl = drawer.querySelector('#ptableCalcResult');
      let currentExpr = '';
      let lastResult = 0;
      let justEvaluated = false;
      
      const calcButtons = drawer.querySelectorAll('.ptable-calc-btn');
      calcButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          handleCalcInput(btn.dataset.calc);
        });
      });
      
      // Bind keyboard events
      window.addEventListener('keydown', (e) => {
        // Ignore if user is typing in a text input field to prevent display pollution
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

        // Only trigger if calculator panel is visible/active
        const calcPanel = drawer.querySelector('#panelCalc');
        if (!calcPanel || !calcPanel.classList.contains('active')) return;
        
        const key = e.key;
        if (key >= '0' && key <= '9') handleCalcInput(key);
        else if (key === '.') handleCalcInput('.');
        else if (key === '+') handleCalcInput('+');
        else if (key === '-') handleCalcInput('-');
        else if (key === '*') handleCalcInput('*');
        else if (key === '/') handleCalcInput('/');
        else if (key === '(') handleCalcInput('(');
        else if (key === ')') handleCalcInput(')');
        else if (key === 'e' || key === 'E') handleCalcInput('e');
        else if (key === 'a' || key === 'A') handleCalcInput('Ans');
        else if (key === 'Enter' || key === '=') { e.preventDefault(); handleCalcInput('equals'); }
        else if (key === 'Backspace') handleCalcInput('backspace');
        else if (key === 'Escape' || key === 'c' || key === 'C') handleCalcInput('clear');
      });

      function handleCalcInput(input) {
        if (input === 'clear') {
          currentExpr = '';
          calcExprEl.innerHTML = '';
          calcResultEl.textContent = '0';
          justEvaluated = false;
        } else if (input === 'backspace') {
          if (currentExpr.endsWith('Ans')) {
            currentExpr = currentExpr.slice(0, -3);
          } else {
            currentExpr = currentExpr.slice(0, -1);
          }
          justEvaluated = false;
          updateCalcDisplay();
        } else if (input === 'equals') {
          if (!currentExpr) return;
          try {
            // Replace Ans token with the numeric value of the last result before evaluating
            let evalExpr = currentExpr.replace(/Ans/g, String(lastResult));
            // Sanitize string to allow only basic arithmetic + scientific notation "e"
            const sanitized = evalExpr.replace(/[^0-9e+\-*/().\s]/gi, '');
            // Evaluate safely
            const res = Function(`"use strict"; return (${sanitized})`)();
            if (res === undefined || isNaN(res) || !isFinite(res)) {
              calcResultEl.textContent = 'Error';
            } else {
              const rounded = Math.round(res * 1000000) / 1000000;
              calcResultEl.textContent = rounded;
              calcExprEl.innerHTML = getFormattedExpr(currentExpr) + ' =';
              currentExpr = String(rounded);
              lastResult = rounded;
              justEvaluated = true;
            }
          } catch (err) {
            calcResultEl.textContent = 'Error';
          }
        } else {
          if (justEvaluated) {
            // If starting with an operator, prefix with Ans
            if (['+', '-', '*', '/'].includes(input)) {
              currentExpr = 'Ans' + input;
            } else {
              currentExpr = input;
            }
            justEvaluated = false;
          } else {
            currentExpr += input;
          }
          updateCalcDisplay();
        }
      }

      function updateCalcDisplay() {
        calcExprEl.innerHTML = getFormattedExpr(currentExpr);
      }

      function getFormattedExpr(expr) {
        // 1. First run math operator replacements (before HTML tag slashes are introduced)
        let formatted = expr
          .replace(/\*/g, ' × ')
          .replace(/\//g, ' ÷ ')
          .replace(/\+/g, ' + ')
          .replace(/-/g, ' - ');

        // 2. Now run HTML tag insertions safely (no operators left to corrupt tag slashes)
        formatted = formatted
          .replace(/Ans/g, '<span style="color: var(--accent); font-weight: 600;">Ans</span>')
          .replace(/([0-9.]+)\s*e\s*\+?(-?[0-9]+)/gi, '$1 × 10<sup>$2</sup>')
          .replace(/e\s*\+?(-?[0-9]+)/gi, '10<sup>$1</sup>')
          .replace(/([0-9.]+)\s*e/gi, '$1 × 10^')
          .replace(/e/gi, '10^');

        return formatted;
      }

      // 3. Setup Mole-Mass Conversion Helper Tool
      const mmInput = drawer.querySelector('#ptableHelperMM');
      const gramsInput = drawer.querySelector('#ptableHelperGrams');
      const molesInput = drawer.querySelector('#ptableHelperMoles');
      
      mmInput.addEventListener('input', recalculateHelper);
      gramsInput.addEventListener('input', () => {
        recalculateHelper('grams');
      });
      molesInput.addEventListener('input', () => {
        recalculateHelper('moles');
      });

      function recalculateHelper(lastChanged) {
        const mm = parseFloat(mmInput.value);
        if (isNaN(mm) || mm <= 0) return;
        
        if (lastChanged === 'grams') {
          const grams = parseFloat(gramsInput.value);
          if (!isNaN(grams)) {
            molesInput.value = (Math.round((grams / mm) * 10000) / 10000).toString();
          } else {
            molesInput.value = '';
          }
        } else if (lastChanged === 'moles') {
          const moles = parseFloat(molesInput.value);
          if (!isNaN(moles)) {
            gramsInput.value = (Math.round((moles * mm) * 10000) / 10000).toString();
          } else {
            gramsInput.value = '';
          }
        } else {
          const grams = parseFloat(gramsInput.value);
          if (!isNaN(grams)) {
            molesInput.value = (Math.round((grams / mm) * 10000) / 10000).toString();
          }
        }
      }

      // 2. Load window.GC_ELEMENTS dynamically if not present, then build grid
      if (!window.GC_ELEMENTS) {
        if (elementsScript) {
          elementsScript.onload = () => {
            if (window.GC_ELEMENTS) {
              buildPeriodicTableGrid();
            } else {
              console.error('Periodic table reference tool failed: window.GC_ELEMENTS did not populate.');
            }
          };
          elementsScript.onerror = () => {
            console.error('Periodic table reference tool failed: elements.js script load error.');
          };
        } else {
          const script = document.createElement('script');
          script.src = '../assets/elements.js';
          script.onload = () => {
            if (window.GC_ELEMENTS) {
              buildPeriodicTableGrid();
            } else {
              console.error('Periodic table reference tool failed: window.GC_ELEMENTS did not populate.');
            }
          };
          script.onerror = () => {
            console.error('Periodic table reference tool failed: elements.js script load error.');
          };
          document.head.appendChild(script);
        }
      } else {
        buildPeriodicTableGrid();
      }

      function buildPeriodicTableGrid() {
        const gridEl = drawer.querySelector('.ptable-grid');
        const elementsList = window.GC_ELEMENTS.list;

        elementsList.forEach(el => {
          const cell = document.createElement('div');
          cell.className = `ptable-cell kind-${el.kind}`;
          cell.dataset.sym = el.sym;
          cell.style.gridRow = el.period;
          cell.style.gridColumn = el.group;

          cell.innerHTML = `
            <span class="cell-z">${el.z}</span>
            <span class="cell-sym">${el.sym}</span>
            <span class="cell-val"></span>
          `;

          cell.addEventListener('click', () => selectElement(el.sym));
          gridEl.appendChild(cell);
        });

        // 3. Setup tabs and mode changing
        let activeMode = 'default';
        const tabs = drawer.querySelectorAll('.ptable-tab');
        tabs.forEach(tab => {
          tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            activeMode = e.target.dataset.mode;
            applyColorShading(activeMode);
          });
        });

        // Show default colors on load
        applyColorShading('default');

        // Setup transition metal toggle listener
        const transToggle = drawer.querySelector('#ptableTransitionToggle');
        transToggle.addEventListener('change', (e) => {
          updateGridVisibility(e.target.checked);
        });
        updateGridVisibility(transToggle.checked);
      }

      function updateGridVisibility(showTransition) {
        const gridEl = drawer.querySelector('.ptable-grid');
        const cells = drawer.querySelectorAll('.ptable-cell');
        
        if (showTransition) {
          gridEl.style.gridTemplateColumns = 'repeat(18, 1fr)';
          gridEl.style.minWidth = '680px';
          cells.forEach(cell => {
            const sym = cell.dataset.sym;
            const el = window.GC_ELEMENTS.bySym[sym];
            cell.style.display = '';
            cell.style.gridColumn = el.group;
          });
        } else {
          gridEl.style.gridTemplateColumns = 'repeat(2, 1fr) 0.45fr repeat(6, 1fr)';
          gridEl.style.minWidth = '420px';
          cells.forEach(cell => {
            const sym = cell.dataset.sym;
            const el = window.GC_ELEMENTS.bySym[sym];
            if (!el.mainGroup) {
              cell.style.display = 'none';
            } else {
              cell.style.display = '';
              if (el.group >= 13) {
                cell.style.gridColumn = el.group - 9;
              } else {
                cell.style.gridColumn = el.group;
              }
            }
          });
        }
      }

      function getGroupName(el) {
        if (el.z === 1) return 'Group 1 (Hydrogen)';
        if (el.group === 1) return 'Alkali Metals (Group 1)';
        if (el.group === 2) return 'Alkaline Earth Metals (Group 2)';
        if (el.group >= 3 && el.group <= 12) return 'Transition Metals (Group ' + el.group + ')';
        if (el.group === 13) return 'Boron Group (Group 13)';
        if (el.group === 14) return 'Carbon Group (Group 14)';
        if (el.group === 15) return 'Nitrogen Group (Group 15)';
        if (el.group === 16) return 'Oxygen Group (Group 16)';
        if (el.group === 17) return 'Halogens (Group 17)';
        if (el.group === 18) return 'Noble Gases (Group 18)';
        return 'Group ' + el.group;
      }

      function getTypicalCharge(el) {
        const tend = window.GC_ELEMENTS.tendency(el);
        if (tend) {
          if (tend.dir === 'inert') return '0 (inert)';
          if (tend.charge) return tend.charge;
          if (el.group === 14) return '±4 (typically covalent)';
        }
        // Transition metals
        const transCharges = {
          Sc: '3+',
          Ti: '4+, 3+',
          V: '5+, 4+, 3+, 2+',
          Cr: '3+, 6+',
          Mn: '2+, 4+, 7+',
          Fe: '3+, 2+',
          Co: '2+, 3+',
          Ni: '2+',
          Cu: '2+, 1+',
          Zn: '2+'
        };
        if (transCharges[el.sym]) return transCharges[el.sym] + ' (variable)';
        return 'Variable';
      }

      // 4. Color Shading helper functions
      function applyColorShading(mode) {
        if (!window.GC_ELEMENTS) return;
        const cells = drawer.querySelectorAll('.ptable-cell');
        const legend = drawer.querySelector('#ptableLegend');
        const elementsList = window.GC_ELEMENTS.list;

        // Color values mix helpers (same as in 1-1b.js)
        const COOL = [62, 111, 165], PALE = [236, 233, 219], HOT = [206, 72, 46];
        const mix = (a, b, t) => [
          Math.round(a[0] + (b[0] - a[0]) * t),
          Math.round(a[1] + (b[1] - a[1]) * t),
          Math.round(a[2] + (b[2] - a[2]) * t)
        ];
        const lum = c => (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
        const rgb = c => `rgb(${c[0]},${c[1]},${c[2]})`;
        const seqColor = t => t < 0.5 ? mix(COOL, PALE, t * 2) : mix(PALE, HOT, (t - 0.5) * 2);

        if (mode === 'default') {
          // Default: Color by classification kind
          legend.innerHTML = `
            <div class="ptable-legend-swatches">
              <span class="ptable-legend-swatch"><span class="ptable-legend-chip" style="background-color: var(--paper-3)"></span>metal</span>
              <span class="ptable-legend-swatch"><span class="ptable-legend-chip" style="background-color: var(--paper-2); border-color: var(--ink-soft)"></span>metalloid</span>
              <span class="ptable-legend-swatch"><span class="ptable-legend-chip" style="background-color: var(--card); border-color: var(--ink-mute)"></span>nonmetal</span>
              <span class="ptable-legend-swatch"><span class="ptable-legend-chip" style="background-color: var(--card); opacity: 0.75; border-color: var(--hair)"></span>noble</span>
            </div>
          `;

          cells.forEach(cell => {
            cell.classList.remove('no-data');
            cell.style.backgroundColor = '';
            cell.style.color = '';
            cell.querySelector('.cell-val').textContent = '';
          });
        } else {
          // Heatmaps: Radius, IE, or EN
          const propMap = { radius: 'radius', ie: 'ie', en: 'en' };
          const propKey = propMap[mode];
          const unitMap = { radius: ' pm', ie: ' kJ', en: '' };

          // Extract values to find min and max for shading range
          const validVals = elementsList.map(el => el[propKey]).filter(val => val != null);
          const min = Math.min(...validVals);
          const max = Math.max(...validVals);

          legend.innerHTML = `
            <span>low (${min}${unitMap[mode]})</span>
            <div class="ptable-legend-gradient" style="background: linear-gradient(90deg, ${rgb(COOL)}, ${rgb(PALE)}, ${rgb(HOT)})"></div>
            <span>high (${max}${unitMap[mode]})</span>
          `;

          cells.forEach(cell => {
            const sym = cell.dataset.sym;
            const el = window.GC_ELEMENTS.bySym[sym];
            const val = el[propKey];
            const valSpan = cell.querySelector('.cell-val');

            if (val == null) {
              cell.classList.add('no-data');
              cell.style.backgroundColor = '';
              cell.style.color = '';
              valSpan.textContent = '—';
            } else {
              cell.classList.remove('no-data');
              const t = (val - min) / (max - min);
              const color = seqColor(t);
              cell.style.backgroundColor = rgb(color);
              cell.style.color = lum(color) > 0.55 ? '#15201C' : '#F4F6F4';
              valSpan.textContent = mode === 'en' ? val.toFixed(1) : val;
            }
          });
        }
      }

      // 5. Select element and populate detail panel
      function selectElement(sym) {
        // Toggle selected styling
        const cells = drawer.querySelectorAll('.ptable-cell');
        cells.forEach(c => c.classList.remove('selected'));
        const cell = drawer.querySelector(`.ptable-cell[data-sym="${sym}"]`);
        if (cell) cell.classList.add('selected');

        const el = window.GC_ELEMENTS.bySym[sym];
        const placeholder = drawer.querySelector('.ptable-detail-placeholder');
        const content = drawer.querySelector('.ptable-detail-content');

        placeholder.style.display = 'none';
        content.style.display = 'flex';

        // Fill detail values
        content.querySelector('.ptable-detail-sym').textContent = el.sym;
        content.querySelector('.ptable-detail-z').textContent = `Z = ${el.z}`;
        content.querySelector('.ptable-detail-name').textContent = el.name;
        
        // Kind formatting
        const kindEl = content.querySelector('.ptable-detail-kind-tag');
        kindEl.textContent = el.kind;

        // Stats text population
        content.querySelector('.val-group').textContent = getGroupName(el);
        content.querySelector('.val-shells').textContent = window.GC_ELEMENTS.config(el);
        content.querySelector('.val-valence').textContent = el.valence !== null ? el.valence : '— (N/A)';
        content.querySelector('.val-charge').textContent = getTypicalCharge(el);
        content.querySelector('.val-radius').textContent = el.radius !== null ? `${el.radius} pm` : '— (N/A)';
        content.querySelector('.val-ie').textContent = el.ie !== null ? `${el.ie} kJ/mol` : '— (N/A)';
        content.querySelector('.val-en').textContent = el.en !== null ? el.en.toFixed(2) : '— (N/A)';

        // Tendency
        const tendencyEl = content.querySelector('.val-tendency');
        const tend = window.GC_ELEMENTS.tendency(el);
        if (tend) {
          if (tend.dir === 'inert') {
            tendencyEl.textContent = 'inert (noble)';
          } else if (tend.dir === 'lose') {
            tendencyEl.textContent = `loses ${tend.need} e⁻ (${tend.charge})`;
          } else if (tend.dir === 'gain') {
            tendencyEl.textContent = `gains ${tend.need} e⁻ (${tend.charge})`;
          } else {
            tendencyEl.textContent = 'shares/covalent';
          }
        } else {
          tendencyEl.textContent = 'metallic sharing';
        }

        // Render Bohr Model SVG
        const visualContainer = content.querySelector('.ptable-detail-visual');
        visualContainer.innerHTML = ''; // Clear previous

        const bohrSVG = createBohrSVG(el.shells, el.z, el.name);
        visualContainer.appendChild(bohrSVG);
        
        const bohrCap = document.createElement('div');
        bohrCap.className = 'ptable-bohr-cap';
        bohrCap.textContent = `${el.shells.length} shell${el.shells.length > 1 ? 's' : ''}`;
        visualContainer.appendChild(bohrCap);
      }

      function createBohrSVG(shells, z, name) {
        const CX = 65, CY = 65;
        const SVGNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(SVGNS, 'svg');
        svg.setAttribute('viewBox', '0 0 130 130');
        svg.setAttribute('class', 'ptable-bohr-svg');
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', `Bohr model shell diagram for ${name}`);

        // Draw shells
        shells.forEach((cnt, i) => {
          const r = 20 + i * 14;
          const ring = document.createElementNS(SVGNS, 'circle');
          ring.setAttribute('cx', CX);
          ring.setAttribute('cy', CY);
          ring.setAttribute('r', r);
          ring.setAttribute('fill', 'none');
          ring.setAttribute('stroke', 'var(--shell)');
          ring.setAttribute('stroke-width', '0.8');
          svg.appendChild(ring);
          
          for (let e = 0; e < cnt; e++) {
            const angle = (2 * Math.PI / cnt) * e - Math.PI / 2;
            const dot = document.createElementNS(SVGNS, 'circle');
            dot.setAttribute('cx', CX + r * Math.cos(angle));
            dot.setAttribute('cy', CY + r * Math.sin(angle));
            dot.setAttribute('r', '2.2'); // size of electron
            dot.setAttribute('fill', 'var(--electron)');
            dot.setAttribute('stroke', 'var(--ink)');
            dot.setAttribute('stroke-width', '0.6');
            svg.appendChild(dot);
          }
        });
        
        // Draw nucleus
        const nuc = document.createElementNS(SVGNS, 'circle');
        nuc.setAttribute('cx', CX);
        nuc.setAttribute('cy', CY);
        nuc.setAttribute('r', '12');
        nuc.setAttribute('fill', 'var(--nucleus)');
        svg.appendChild(nuc);
        
        const label = document.createElementNS(SVGNS, 'text');
        label.setAttribute('x', CX);
        label.setAttribute('y', CY + 1);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'middle');
        label.setAttribute('fill', '#fff');
        label.setAttribute('style', 'font-family:var(--mono);font-weight:600;font-size:7.5px;');
        label.textContent = `${z}+`;
        svg.appendChild(label);
        
        return svg;
      }
    }
  })();

  function getElementForCheckpoint(type, index) {
    if (type === 'predict') return $$('[data-predict]')[index];
    if (type === 'recall') return $$('.recall')[index];
    if (type === 'peek') return $$('[data-peek]')[index];
    if (type === 'scheme') return $$('[data-scheme]')[index];
    if (type === 'step-motion') return $$('[data-motion="step"]')[index];
    if (type === 'scrub-motion') return $$('[data-motion="scrub"]')[index];
    if (type === 'zoom-motion') return $$('[data-motion="zoom"]')[index];
    
    // For widgets:
    const widgets = $$('[data-widget]');
    return widgets[index];
  }

  function scrollToLastCompletedSection() {
    if (!currentLesson) return;
    const lessonId = currentLesson.id;
    const progress = StorageEngine.getProgress();
    const lessonProgress = progress[lessonId] || {};
    
    // Find all completed checkpoints in lessonProgress
    const completedKeys = Object.keys(lessonProgress).filter(k => k !== '_total' && lessonProgress[k] === true);
    if (completedKeys.length === 0) return;
    
    // Find all sections
    const sections = $$('section');
    let lastSectionIdx = -1;
    let lastSectionEl = null;
    
    completedKeys.forEach(key => {
      const parts = key.split('-');
      if (parts.length < 2) return;
      const type = parts.slice(0, -1).join('-');
      const index = parseInt(parts[parts.length - 1]);
      
      const el = getElementForCheckpoint(type, index);
      if (el) {
        const sec = el.closest('section');
        if (sec) {
          const secIdx = sections.indexOf(sec);
          if (secIdx > lastSectionIdx) {
            lastSectionIdx = secIdx;
            lastSectionEl = sec;
          }
        }
      }
    });
    
    if (lastSectionEl) {
      setTimeout(() => {
        lastSectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  // Initialize widgets, motion primitives, and tooltips
  initWidgets();
  initMotionPrimitives();
  scrollToLastCompletedSection();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlossaryTooltips);
  } else {
    initGlossaryTooltips();
  }
})();
