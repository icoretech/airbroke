# Airbroke Site

This is the presentation site for the
[Airbroke](https://github.com/icoretech/airbroke) project, an open-source error
catcher.

For detailed information about the Airbroke project, its features, system
requirements, and deployment options, please visit the
[Airbroke GitHub repository](https://github.com/icoretech/airbroke).

If you have any questions or feedback, feel free to
[open an issue](https://github.com/icoretech/airbroke/issues/new) on the Airbroke
repository.

## development

The site lives in `site/` of the Airbroke repository as its own npm project,
separate from the app's Yarn workspace. Use Node.js 26.13.1 and its bundled npm
11.20.0. From `site/`, install dependencies with `npm ci`, then run
`npm run dev` for local development and `npm run lint` for Biome.
`npm run build` runs TypeScript 7's native compiler through Next.js before
producing the static export; type errors fail the build. `next.config.ts` pins
the Turbopack root to `site/`, because otherwise Next.js finds the app's
`yarn.lock` above and builds from the repository root.

The app's TypeScript, Biome, Vitest, Tailwind, React Doctor and Docker build
context ignore `site/`, and release-please leaves commits that only touch
`site/` out of the app's version and changelog.

For VS Code, install Microsoft's
[TypeScript 7 extension](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview)
and open `site/` as its own folder: its workspace settings select the installed
`typescript` package's native language server rather than the removed
JavaScript SDK.

## landing page

The site is one static page, `app/page.tsx`, built from the sections in
`components/`. It is a roll of paper tickets: coral, white, ink and lilac card
stocks printed in two inks, with the violet of the Airbroke mark as stamp ink
and perforations punched through to the dark counter underneath. `DESIGN.md`
records the tokens and components, `PRODUCT.md` the product facts the copy may
use.

- Every claim must be checkable in this repository. Each section names the
  files its claims come from; update the copy in the same change when the app
  changes. No invented customers, metrics, benchmarks, testimonials or
  roadmap promises. The README's "active development" note stays in the FAQ.
- Shared facts, links, the title, the description and the FAQ live in
  `lib/site.ts`; `app/layout.tsx` turns them into metadata and the single
  JSON-LD graph (iCoreTech `Organization` by `@id`, `SoftwareApplication`, and
  `FAQPage` for the questions on the page). Keep FAQPage in step with the
  visible FAQ.
- No CSS framework and no client libraries: styles are in `app/globals.css`,
  snippets are highlighted at build time by `lib/highlight.tsx`, icons are
  inline SVG. Client components are limited to the tabs, the copy button, the
  phone menu and the hero's punch demo.
- The punch demo is the one moving part. It runs only while on screen and with
  the tab visible, and not at all with reduced motion; other motion is gated
  on `prefers-reduced-motion: no-preference`.
- `app/og.png/route.tsx` renders the 1200x630 social card into `out/og.png`
  at build time with Archivo from `@fontsource/archivo`. `public/llms.txt`,
  `robots.txt` and `sitemap.xml` are static; update the sitemap's `lastmod`
  when the page changes materially.
- `public/screens/` holds WebP captures of the real app (dark theme, 1280x800
  at 2x) taken from a local stack seeded with synthetic projects, with errors
  sent through its own Airbrake and Sentry collectors. Never capture from a
  real installation, and keep hosts on example domains.
- Check changes in a browser at 1440, 834 and 390 wide, with and without
  reduced motion: no horizontal scroll, and text contrast of at least 4.5:1
  (3:1 for large text) on every stock, decorative text included.

## deployment

The [Pages workflow](../.github/workflows/pages.yml) builds the current source
with Node.js 26.13.1 and `NODE_ENV=production`, then publishes the Next.js static
export from `site/out/` to GitHub Pages. Pushes to `main` that touch `site/`
trigger publication, and the workflow can also be started manually on `main`.
Pushes to other branches that touch `site/` run the lint and build without
publishing, so Renovate's website updates are checked before they merge.

In the Airbroke repository's **Settings → Pages**, the publishing source is
**GitHub Actions** and the custom domain is `airbroke.icorete.ch`. Workflow
deployments take the domain from that setting and ignore a `CNAME` file. The
public site remains at [airbroke.icorete.ch](https://airbroke.icorete.ch).

The build job has read-only repository access. The deployment job uses the
`github-pages` environment with `pages: write` and `id-token: write`. It deploys
the artifact produced by its own build attempt, after checking that the index
and error pages exist. A newer run supersedes an unfinished older publication.

Publishing uses GitHub's workflow token and OIDC; no S3 credentials, storage
bucket or cluster gateway is required. Keep the site compatible with static
export: server-only Next.js features require a separate hosting decision.
