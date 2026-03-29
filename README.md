# THE LEAK — Interactive Metadata Investigation

`THE LEAK` is a static, learner-first educational experience for GitHub Pages. It teaches metadata analysis through a short investigation: documents, communication graphs, location inference, and an ethics debate.

**Repository:** [github.com/ines-araujo/ines-araujo.github.io](https://github.com/ines-araujo/ines-araujo.github.io)

## Features

- Mayer-style signaling: definitions and instructions before interactions, reduced clutter.
- Progressive hints (“Need a hint?”) on each mission page.
- Gated progression: “Next” links stay disabled until the task is solved; locked nav shows a toast.
- Persistent **Investigation navigation** (all pages): chapter links, Begin/Continue, Reset.
- Disclaimer access gate on first visit (`localStorage` key `disclaimerAccepted`).
- Case files: forensic-style document viewer, D3 social graph, Leaflet map (grayscale tiles), branching debate.

## Project structure

```text
  assets/evidence/
  css/style.css
  js/
    state.js, typing.js, disclaimer-gate.js, investigation-nav.js, hints.js,
    landing.js, document-metadata.js, social-graph.js, location.js, debate.js, easter-eggs.js
  data/
  index.html, docs-metadata.html, social-graph.html, location-analysis.html,
  debate.html, conclusion.html, references.html
```

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` (not `file://`, so JSON loads correctly).

## Deploy (GitHub Pages)

1. Push this repo to GitHub.
2. **Settings → Pages**: deploy from branch `main` and `/ (root)` (or `/docs` if you move files).
3. Wait for the Pages URL to go live.

## Notes

- Characters and datasets are fictional; the conclusion links real reporting and explainers for classroom use.
