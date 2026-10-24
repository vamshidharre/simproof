# SimProof website

Static landing page for SimProof. It is self-contained in this folder and does not touch the
Python package (`src/`, `tests/`).

## Files

- `index.html`: the page. Sections: hero, the problem, how it works, the traced-report demo,
  MCP and command line, the checks that work today, the free check for early users, founder,
  contact.
- `styles.css`: design tokens on `:root`. Light only and flat: hairline borders, no shadows.
  Type is IBM Plex Sans with IBM Plex Mono for code, loaded from Google Fonts.
- `app.js`: the hero animation, the clickable `[E#]` evidence demo, the terminal tabs, and the
  contact form.
- `favicon.svg`: the logo, an evidence bracket around a check mark.

## Every number on the page has a source

The hero chart, the demo and the terminal output are real SimProof 0.1.0 output for the
synthetic test model `tests/fixtures/pulsed_static` (no client data). If checks, wording or
evidence formatting change, regenerate and update `EVIDENCE`, `FINDINGS`, `DECK_LINES` and
`TERMINAL` in `app.js`:

```bash
PYTHONPATH=src python -m simproof.cli check tests/fixtures/pulsed_static
PYTHONPATH=src python -m simproof.cli report tests/fixtures/pulsed_static -o report.md
```

Do not add statistics, savings figures or capability claims that SimProof cannot back up.
Readers and checks listed on the page must match `src/simproof/readers` and `src/simproof/checks`.

## Contact form

The site has no backend. Submitting the form opens the visitor's email app with the request
filled in (a `mailto:` link to the address in `CONTACT_EMAIL` in `app.js`). Nothing is stored.
To collect submissions instead, point the form at a form service (for example Netlify Forms)
and remove the `mailto:` handler.

## Preview locally

```bash
python -m http.server 8080 --directory website
```

Then open http://localhost:8080.

## Deploy

The site is fully static. Publish the `website` folder on Netlify, Vercel or GitHub Pages.
