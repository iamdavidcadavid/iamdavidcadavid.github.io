# iamdavidcadavid.github.io

The published files of https://iamdavidcadavid.github.io. **Built output only — don't edit here.**

- The source code lives in the private repository `iamdavidcadavid/iamdavidcadavid-site`.
- Every push to that repository's `main` builds the site and opens (or updates) a pull request
  here from the branch `deploy/update-site`.
- **Merging that pull request publishes the site.** GitHub Pages serves this repository's
  `main` branch (Settings → Pages → Deploy from a branch → `main` / root).
- `.nojekyll` must stay: without it, GitHub Pages hides the `_astro/` folder that holds the
  site's CSS and JavaScript.
