# iamdavidcadavid.github.io Constitution

## Core Principles

### I. Authentic Professional Representation
The site's primary purpose is to present David Cadavid's professional profile, background,
and experience truthfully and currently. All profile, bio, and background content MUST be
factually accurate and kept up to date as the owner's experience changes. Content MUST be
written to help visitors (recruiters, collaborators, clients) understand who the owner is,
what they do, and why they are worth contacting — vague or purely decorative "About" content
without substantive background is not acceptable.

**Rationale**: This is a personal/professional site, not a generic template. Its value comes
entirely from accurately representing one real person's profile; stale or vague content
directly undermines the site's purpose.

### II. Bilingual Parity (NON-NEGOTIABLE)
The site MUST be fully available in both English and Spanish. English MUST be the default
language shown to first-time visitors. Every page MUST expose a visible, working control that
lets the visitor switch between English and Spanish at any time, and the chosen language MUST
persist across navigation within the same visit. No page or blog post may be published in only
one language without an explicit, visible "translation pending" indicator — silent gaps (a
language switch that leads to missing or untranslated content with no notice) are not
acceptable.

**Rationale**: Explicit, hard requirement from the project owner. Bilingual support is core to
the site's audience and purpose, not an enhancement to add later.

### III. Static-Site Simplicity
The site is deployed as static content via GitHub Pages (see `.github/workflows/static.yml`,
which builds the site and uploads the build output in `dist/`). Implementation choices MUST
preserve this deployment model: no server-side runtime, database, or backend service may be
introduced unless the owner explicitly decides to change the hosting model. If a build step or
static site generator is introduced, it MUST output plain static files compatible with GitHub
Pages deployment. Prefer the simplest solution (plain HTML/CSS/JS, or a lightweight static site
generator) that satisfies the other principles — do not add frameworks, build tooling, or
abstractions the site does not need.

**Rationale**: The existing deployment pipeline already works for static content on GitHub
Pages. Keeping the site static keeps hosting free, fast, and low-maintenance, matching the
scope of a personal site.

### IV. Accessible & Responsive by Default
Every page MUST be usable on mobile, tablet, and desktop viewports. Pages MUST use semantic
HTML, provide meaningful alt text for images, maintain sufficient color contrast, and remain
navigable by keyboard. Accessibility and responsiveness are verified before a page or feature
is considered done, not retrofitted afterward.

**Rationale**: The site's audience includes recruiters and potential clients browsing from any
device; a professional site that is broken on mobile or unusable with assistive technology
undermines the impression it is meant to create.

### V. Reliable Contact & Hiring Pathways
The site MUST provide at least one clear, working way for visitors to contact the owner or
inquire about hiring (e.g., an email link, contact form, or linked professional profile such as
LinkedIn). Every contact mechanism MUST be tested and functional in both supported languages.
Broken links, non-functional forms, or contact information that is hard to find are treated as
defects, not polish items.

**Rationale**: Enabling contact and hiring inquiries is an explicit stated goal of the site;
failing here defeats the site's core purpose regardless of how polished the rest looks.

### VI. Blog Content Integrity
Blog articles MUST be original work authored by the site owner (or explicitly and visibly
attributed when quoting or referencing others, per the copyright rules already governing this
assistant's own output). Each article MUST carry a visible publish date and MUST be available
in both English and Spanish per Principle II before being considered published (a
translation-pending draft may exist temporarily but must be marked as such per Principle II).

**Rationale**: The blog is part of the owner's professional presence; unattributed or
undated content weakens credibility and creates ambiguity about currency and authorship.

## Technical Constraints

- Hosting/deployment: GitHub Pages, deployed from the `main` branch per
  `.github/workflows/static.yml`. Any change to the
  deployment model MUST be an explicit, deliberate decision, not an incidental side effect of
  adding a feature.
- Internationalization: language content MUST be structured so English and Spanish versions of
  a page can be maintained side by side without duplicating unrelated logic or layout (e.g.,
  shared templates/partials with per-language content, or per-language content files), so that
  Principle II remains enforceable as the site grows.
- No tracking or third-party embeds that compromise visitor privacy may be added without the
  owner's explicit approval, since this is a professional site representing the owner's
  judgment.
- Design tokens: the site's visual design MUST draw every color from a single set of design
  tokens, defined as CSS custom properties in `src/styles/global.css` (the working source of
  truth) and documented in the design reference (currently `design/README.md`). Components
  MUST NOT use ad-hoc color values outside that token set. Any token used for text or
  interactive elements MUST satisfy Principle IV's contrast requirements in every supported
  theme; a token that fails contrast in a given context MUST be paired with another token or
  adjusted, not used as-is. Feature specs and plans reference tokens by name rather than
  restating color values. Changing the brand palette (adding, removing, or re-valuing tokens)
  is an explicit owner decision, not an incidental side effect of a feature.

## Content & Development Workflow

- Any change that adds or edits visitor-facing content (pages, profile/background copy, blog
  posts) MUST include both the English and Spanish versions, or explicitly flag the missing
  translation per Principle II, before merging to `main`.
- Before a page or feature is considered complete, verify it in both languages, at mobile and
  desktop widths, and confirm all contact/hiring pathways on that page still work.
- Prefer small, reviewable changes over large batched rewrites, consistent with the static-site
  simplicity principle.

## Governance

This constitution supersedes other informal practices for this repository. All feature specs,
plans, and implementation work produced by Spec Kit commands (`/speckit-specify`,
`/speckit-plan`, `/speckit-tasks`, `/speckit-implement`, etc.) MUST be consistent with the
principles above; any deviation MUST be explicitly justified in the relevant spec or plan
before implementation proceeds.

Amendments to this constitution are made by editing this file directly (typically via
`/speckit-constitution`), and MUST update the version number according to semantic versioning:

- MAJOR: backward-incompatible governance changes, or removal/redefinition of a principle.
- MINOR: a new principle or materially expanded section is added.
- PATCH: wording clarifications or non-semantic fixes.

Each amendment MUST update `LAST_AMENDED_DATE` below and record its rationale in a Sync Impact
Report comment at the top of this file at the time of the amendment.

**Version**: 1.2.1 | **Ratified**: 2026-09-22 | **Last Amended**: 2026-09-24
