# THE LEAK - Interactive Metadata Investigation

`THE LEAK` is a static, narrative-driven educational blog experience built for GitHub Pages.
Users play an intelligence analyst and learn how metadata can expose identity, behavior, and social links.

## Features

- Story-based multi-page flow with gamified progression.
- Metadata mission with evidence files, parsed fields, and timeline builder.
- Interactive communication graph (D3.js) with node metrics.
- Location inference mission (Leaflet.js) with GPS-style points.
- Dialogue-tree debate with converging ending and ethical twist.
- Persistent progression and decisions using `localStorage`.
- Dark classified aesthetic, glitch hints, and hidden surveillance cues.

## Project Structure

```text
metadata/
  assets/
    evidence/
  css/
    style.css
  js/
    state.js
    typing.js
    landing.js
    document-metadata.js
    social-graph.js
    location.js
    debate.js
  data/
    document-metadata.json
    communications.json
    location-points.json
  index.html
  docs-metadata.html
  social-graph.html
  location-analysis.html
  debate.html
  conclusion.html
  references.html
```

## Run Locally

Because modules fetch local JSON files, use a static server (not `file://`):

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/`

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. In repository settings, open **Pages**.
3. Set source to your main branch and the `/(root)` folder (or `/docs` if you move files there).
4. Save and wait for deployment.
5. Access your published site via the GitHub Pages URL.

## Notes

- All people, agencies, and datasets are fictional.
- Replace placeholder repository links and references with your own.
