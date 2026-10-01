# iamdavidcadavid.github.io

The published files of https://www.davidcadavid.com. **Built output only — don't edit here.**

- The source code lives in the private repository `iamdavidcadavid/iamdavidcadavid-site`.
- Every push to that repository's `main` builds the site and opens (or updates) a pull request
  here from the branch `deploy/update-site`.
- **Merging that pull request publishes the site.** GitHub Pages serves this repository's
  `main` branch (Settings → Pages → Deploy from a branch → `main` / root).
- `CNAME` (the custom domain `www.davidcadavid.com`) comes from the source repo's `public/CNAME`,
  so every update keeps it. Change the domain there, not in Settings → Pages alone.
- `.nojekyll` must stay: without it, GitHub Pages hides the `_astro/` folder that holds the
  site's CSS and JavaScript.
