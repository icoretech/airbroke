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
