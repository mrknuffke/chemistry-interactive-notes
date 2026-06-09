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
})();
