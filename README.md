# Baseline-website
Baseline website design

**Live site:** https://israshaf.github.io/Baseline-website/

The site is the static folder `baseline-website/`. Every push to `main` on
`israShaf/Baseline-website` redeploys it through GitHub Pages
(`.github/workflows/pages.yml`).

Run it locally:

```bash
node baseline-website/serve.js
```

then open http://localhost:5173.

When you change `assets/js/main.js` or `assets/css/styles.css`, bump the `?v=` number on
their links in every page. Hosts cache these files for hours, and the new number makes
browsers fetch the new version.
