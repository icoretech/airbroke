# Product

<!-- impeccable:product-schema 1 -->

Inferred from the redesign brief and the Airbroke repository; no interview took
place (the work ran as a delegated agent with no question channel). Every line
below is sourced from the brief or from files in this repository.

## Platform

web

## Users

Developers and small platform teams who run their own infrastructure and already
report errors with an Airbrake notifier or a Sentry SDK. They come to the site
deciding whether to self-host an error catcher instead of paying for a hosted
one, and they leave for GitHub or the setup instructions.

## Product Purpose

Airbroke is a self-hosted, MIT-licensed error catcher backed by PostgreSQL. It
accepts errors on Airbrake- and Sentry-compatible collector endpoints, groups
them, and gives a fast UI to triage them: backtraces, request context, charts,
resolve, bookmarks and remarks. It can replay a recorded HTTP request, copy it as
cURL, and expose its data read-only to agents over MCP.

## Positioning

Keep the SDKs you already ship; point them at a server you run. Errors land in
your own Postgres, grouped so repeats bump a counter instead of piling up rows.
The failing request can be replayed from the error page, and coding agents can
read the same errors through MCP.

## Operating Context

- Collectors: `POST /api/v3/notices` (Airbrake v3, with the legacy notifier
  paths rewritten to it) and `POST /api/sentry/<project_id>/envelope` (Sentry
  envelopes through `tunnel`).
- Deploys as a multi-arch Docker image on ghcr.io (amd64 and arm64), a Helm
  chart in icoretech/helm, Docker Compose, or one-click templates (Vercel,
  Render, Railway, Netlify, Heroku).
- Sign-in through OAuth providers configured by environment.

## Capabilities and Constraints

- The README marks Airbroke as in active development; production use is at the
  operator's discretion. The site must not imply otherwise.
- Requirements from the README: Node.js 26.13.1+, 300MB RAM, one CPU core,
  PostgreSQL 15+, 8+ free connection slots per instance.
- MCP is read-only (`readOnlyHint`), authenticated by one static key.
- Ask AI needs the operator's own OpenAI key and is optional.
- Replay re-sends the recorded method, URL and headers from the Airbroke server
  and reports the status; it does not resend a body.

## Brand Commitments

- Name: Airbroke. Mark: the violet robot head with one round eye and one X eye
  (`public/logo.svg`, `#7563EB`), no antenna.
- Airbroke's product colour on icorete.ch is coral (`#FF9A6B` to `#F0465E`).
- Publisher: iCoreTech, Inc. (https://icorete.ch), X `@icoretech_inc`.
- License: MIT. "Open source" is accurate for Airbroke.

## Evidence on Hand

- The real UI, captured from a local stack with synthetic data.
- No customers, testimonials, benchmarks, usage numbers or roadmap exist for the
  site. Do not invent them.

## Product Principles

- Every claim on the site is checkable in the repository.
- Show the product working rather than describing it.
- Respect the reader's existing tooling: Airbrake and Sentry SDKs are the on-ramp.
