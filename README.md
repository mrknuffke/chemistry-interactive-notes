# General Chemistry Interactive Notes (Semester 1)

An interactive, web-based textbook designed for high-school General Chemistry students. These review pages are built for **retrieval practice, re-narration, and self-explanation** after initial in-class exposure to the material.

The project is structured as a zero-build, pure static HTML/CSS/JS application that loads directly in a web browser.

---

## 🚀 Quick Start (Local Development)

To run the site locally, start a static web server from the project directory:

```bash
# Using Python 3
python3 -m http.server 8000
```
Then open your browser to: **[http://localhost:8000/scaffold/](http://localhost:8000/scaffold/)**

Alternatively, you can navigate into the `scaffold/` directory and run a server there:
```bash
cd scaffold
python3 -m http.server 8000
# Then open: http://localhost:8000/
```

---

## 📂 Project Structure

```
├── .github/workflows/
│   └── deploy.yml       # GitHub Actions deploy configuration (deploys scaffold/ to GitHub Pages)
├── scaffold/            # The textbook source files
│   ├── assets/          # Global styles & shared behaviors
│   │   ├── tokens.css     # Theme colors, dark mode, layout units, fonts
│   │   ├── components.css # Shared interactive widget and particle diagram layout CSS
│   │   ├── core.js        # Navigation, TOC, light/dark toggles, retrieval validation
│   │   └── elements.js    # Verified elements Z=1 to 36 chemistry data
│   ├── lessons/         # HTML pages & JS for individual lessons
│   ├── References/      # Curated review sheets (source of truth) and diagram conventions
│   ├── index.html       # Homepage & TOC of the interactive notes
│   ├── lessons.json     # Metadata catalog of lessons
│   └── tools/           # Headless screenshot rendering scripts for quality testing
├── LICENSE              # CC BY-NC-SA 4.0 License Text
├── CLAUDE.md            # Guidelines, coding conventions, and developer guidelines
└── README.md            # This file
```

---

## 📝 Editing & Developing Lessons

Please consult **[scaffold/BUILDING.md](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/scaffold/BUILDING.md)** and **[CLAUDE.md](file:///Users/davidknuffke/Library/CloudStorage/Dropbox/Projects/Chemistry%20Interactive%20Notes/CLAUDE.md)** for detailed rules on styling, writing voice, and pedagogical rules before adding or modifying lessons.

*   **Pedagogy First:** Weave diagrams, active recall, self-explain prompts, and exam questions directly into sections.
*   **Chemistry Integrity:** Never trust memory; cross-reference calculations against the review sheets in `scaffold/References/`.
*   **No LaTeX:** Format equations and math using standard semantic tags like `<sub>`, `<sup>`, and entities (`&Delta;`).
*   **Rendering Checks:** Verify both light and dark modes before submitting changes.

---

## 🌐 Automated Publishing

This repository is set up with GitHub Actions to automate publishing:
*   Every push to the `main` branch triggers the **Deploy to GitHub Pages** workflow.
*   The workflow deploys **only** the `scaffold/` directory (the site root containing `index.html`).
*   Once configured in GitHub (under **Settings -> Pages**), the live site will be reachable at `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`.

---

## 🙏 Acknowledgments

The pedagogical structure and design (predict-reveal, active recall, self-explanation, and exam practice) of these interactive notes is inspired by the work at [Biology by Bradford](https://www.biologybybradford.com).

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

