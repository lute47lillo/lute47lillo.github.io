# lute47lillo.github.io

# Researcher Homepage (GitHub Pages)

This is a simple single-page researcher website.

## Edit your info
- `index.html`: name# Lute Lillo — Academic Website

A no-build, static academic website designed for GitHub Pages. The visual system uses warm limestone, terracotta, olive, and Aegean blue, with editorial serif typography and restrained Mediterranean geometry.

## Deploy on GitHub Pages

1. Copy the contents of this folder into the root of your `lute47lillo.github.io` repository.
2. Commit and push to the default branch (`main`).
3. In GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Select `main` and `/ (root)`.
5. Your site should appear at `https://lute47lillo.github.io/`.

No npm, Jekyll, or build step is required.

## Files you will edit most often

- `index.html` — homepage copy.
- `research.html` — research themes and research statement.
- `about.html` — biography.
- `cv.html` — compact web CV.
- `contact.html` — contact information.
- `assets/js/publications-data.js` — **single source of truth for publications**.
- `assets/css/style.css` — colors, type, spacing, and all visual styling.

## Add a publication

Open `assets/js/publications-data.js` and add another object to `window.PUBLICATIONS`.

If `selected: true`, it can appear on the homepage. The full list is automatically rendered on `publications.html`.

## Change the Mediterranean palette

At the top of `assets/css/style.css`, edit:

```css
--paper: #f5f0e8;
--aegean: #17364f;
--terracotta: #bc6345;
--olive: #6f795e;
--sand: #b98d62;
```

The terracotta-to-Aegean rule under the name is `.hero-rule`.

## Add a portrait

The current design intentionally uses an abstract Mediterranean illustration instead of requiring a portrait. If you want one, place the image in `assets/img/` and replace the `<img>` inside `.hero-art` in `index.html`. The monogram block on `about.html` can be replaced similarly.

## PDF CV

Put your PDF in `assets/files/`, then add a link to it. See `assets/files/README.md`.

## Custom domain

If you later use `lutelillo.com`, create a file named `CNAME` in the repository root containing only:

```text
lutelillo.com
```

Then configure the DNS records following GitHub Pages' custom-domain instructions.

## Notes

- The Google Fonts import uses Cormorant Garamond + Inter. The CSS includes system fallbacks.
- Mobile navigation and publication filtering are handled by small vanilla JavaScript files.
- The publication BibTeX buttons copy citations to the clipboard.
- The site respects `prefers-reduced-motion`.
, affiliation, links, about text, contact info
- `assets/data/publications.json`: add publications
- `assets/data/projects.json`: add projects
- `assets/img/headshot.jpg`: add your headshot
- `assets/docs/cv.pdf`: add your CV

## Publish
If your repo is named `YOURUSERNAME.github.io`, GitHub will publish automatically at:
https://YOURUSERNAME.github.io
