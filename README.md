# Chemistry Interactive Text (Semester 1)

An interactive, web-based textbook designed for high-school General Chemistry students. These review pages are built for **retrieval practice, re-narration, and self-explanation** after initial in-class exposure to the material.

The project is structured as a zero-build, pure static HTML/CSS/JS application that loads directly in a web browser.

---

## 🌐 Live Access (GitHub Pages)

The live interactive text is deployed and accessible at:
**[https://mrknuffke.github.io/chemistry-interactive-notes/](https://mrknuffke.github.io/chemistry-interactive-notes/)**

---

## 🔮 Development Note: AI-Assisted Vibe-Coding

This project is built and maintained using **vibe-coding** workflows combining human pedagogical expertise with AI assistant agents. 

In this partnership:
*   **The Educator (Human Developer):** Directs the pedagogical design, establishes learning targets, authors the core chemistry text and explanations, acts as the primary curator of content and source-of-truth review sheets, and provides rigorous manual verification and final quality control.
*   **The AI Coding Assistant:** Acts as the primary implementation builder—interpreting the educator's high-level specifications to generate HTML structure, CSS layouts, interactive JavaScript simulations (e.g. Bohr model and particle diagrams), and automated retrieval validation logic.

By offloading direct code generation and layout assembly to the AI, this workflow enables rapid, design-forward iteration while ensuring that pedagogical integrity and chemical correctness remain firmly guided by the human educator.

To maintain high development quality and limit AI-introduced bugs, we follow strict [Behavioral Guidelines](CLAUDE.md#1-behavioral-guidelines-reduce-common-llm-coding-mistakes) covering simplicity, surgical edits, and verification loops.

---

## 🚀 Quick Start (Local Development)

To run the site locally, start a static web server from the project directory:

```bash
# Using Python 3 (runs from repo root)
python3 -m http.server 8000
```
Then open your browser to: **[http://localhost:8000/scaffold/](http://localhost:8000/scaffold/)**

*Note: If port 8000 is already in use on your system, you can use another port (e.g., `8080`):*
```bash
python3 -m http.server 8080
```
*And open: [http://localhost:8080/scaffold/](http://localhost:8080/scaffold/)*

---

## 📂 Project Structure

All developer documentation, logs, contracts, and expansion drafts live in the project root. The `scaffold/` directory contains only the functional codebase of the textbook that gets deployed to production.

```
├── .github/workflows/
│   └── deploy.yml       # GitHub Actions deploy configuration (deploys scaffold/ to GitHub Pages)
├── scaffold/            # Production web app codebase (served at site root)
│   ├── assets/          # Global styles, fonts, and shared behaviors (core.js, glossary.js)
│   ├── lessons/         # HTML pages and interactivity JS files per lesson
│   ├── References/      # Authoritative review sheets and convention posters
│   ├── index.html       # Student home dashboard & search index page
│   └── lessons.json     # Manifest metadata matching lessons to curriculum targets
├── CLAUDE.md            # Guidelines, coding conventions, and developer guidelines
├── TODO.md              # Single board of outstanding work — start here each session
├── BUILDING.md          # Step-by-step checklist for building a lesson
├── BUILD_PLAN.md        # Original build-session roadmap (historical; all 11 lessons now built)
├── REMEDIATION_PLAN.md  # Record of the latest repo-wide consistency/bug-fix pass
├── PDF_EXPORT_PLAN.md   # Plan for pretty PDF printouts of lessons (not yet implemented)
├── VOICE.md             # Tone and widget feedback writing contract
├── INTERACTION_SPEC.md  # Detailed specifications for widgets & interactive behaviors
├── Diagram_Inventory_v2.md Spec detail inventory for lesson diagrams
├── Content_Expansion_v2.md Text drafts database for updates
├── LICENSE              # CC BY-NC-SA 4.0 License Text
└── README.md            # This file
```

---

## 📝 Editing & Developing Lessons

Please consult **[BUILDING.md](BUILDING.md)** and **[CLAUDE.md](CLAUDE.md)** for detailed rules on styling, writing voice, and pedagogical rules before adding or modifying lessons.

*   **Pedagogy First:** Weave diagrams, active recall, self-explain prompts, and exam questions directly into sections.
*   **Chemistry Integrity:** Never trust memory; cross-reference calculations against the review sheets in `scaffold/References/`.
*   **No LaTeX:** Format equations and math using standard semantic HTML tags like `<sub>`, `<sup>`, and entities (`&Delta;`).
*   **Rendering Checks:** Verify both light and dark modes before submitting changes.

---

## 🌐 Automated Publishing

This repository is set up with GitHub Actions to automate publishing:
*   Every push to the `main` branch triggers the **Deploy to GitHub Pages** workflow.
*   The workflow deploys **only** the `scaffold/` directory (the site root containing `index.html`).
*   The live site is published at **[https://mrknuffke.github.io/chemistry-interactive-notes/](https://mrknuffke.github.io/chemistry-interactive-notes/)**.

---

## 🙏 Acknowledgments

The pedagogical structure and design (predict-reveal, active recall, self-explanation, and exam practice) of this interactive text is inspired by the work at [Biology by Bradford](https://www.biologybybradford.com).

---

## 📄 License

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](LICENSE) (CC BY-NC-SA 4.0).

You are free to:
*   **Share** — copy and redistribute the material in any medium or format.
*   **Adapt** — remix, transform, and build upon the material.

Under the following terms:
*   **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
*   **NonCommercial** — You may not use the material for commercial purposes.
*   **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
