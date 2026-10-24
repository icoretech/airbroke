# continuous integration

## development builds

The [development workflow](../../.github/workflows/development.yml) replaces the
Drone pipeline for branch pushes. It runs on standard GitHub-hosted Linux amd64
runners, excluding the release-please branch. Pull-request and tag
events do not schedule this development workflow.

Quality runs Biome, React Doctor, typechecking, Prisma migrations, the complete
serial Vitest suite and a production Next.js build. Every run owns a fresh
workspace, Docker network and PostgreSQL test database. The development database
and workstation environment files are never copied into that workspace.

GitHub Actions restores Yarn package archives and the Next.js incremental cache
into runner-temporary directories mounted into the isolated Compose workspace.
Keys include the OS, architecture, main or validation trust bucket, toolchain and
lockfile inputs, and source commit; a compatible prefix restores the preceding
cache when source changes. Immutable installation, client generation and every
quality gate still run on a cache hit. Installed dependencies, generated clients,
test databases and complete build outputs are not restored from this cache.

The image job uses an owned `docker-container` Buildx builder and exports all
intermediate layers with `mode=max` to a local OCI cache directory. Actions cache
transfers that directory between fresh hosted VMs, without a registry cache or
registry credential for branch validation. Each successful export replaces the
previous directory rather than accumulating obsolete blobs. Cache saves happen
only after a successful job. Main and validation keys are distinct, and GitHub's
branch cache visibility also applies. Cleanup removes run-owned workspaces,
containers, networks, builders and image tags; cache directories survive until
the post-job save. CPU quotas are absent; memory and process limits remain.
Vitest stays serial because its tests share database state.

After quality succeeds, `main` builds one amd64 development image with debug
tools and a `main-<short-sha>-<unix-seconds>` tag. The publisher resolves the
canonical `main` revision before building and again immediately before login and
push. A superseded main run still builds and verifies its exact source, records
`published: false` in its image receipt and skips registry publication. A failed
or malformed canonical revision lookup fails the job. Other branches build the
image without a remote revision lookup, registry login or publication. Stable
version, minor and `latest` tags belong to the separate release workflow.

## public repository trust

The development workflow accepts pushes in the canonical repository. Ordinary
branch pushes share a cancellable branch group. A release-please commit on
`main` uses its exact SHA in a separate group so the development build required
by that release cannot be cancelled by a later ordinary push. The actual
release subject starts with `chore(main): release` followed by a space.

It does not run pull requests or fork workflows. Publishing
uses the job's GitHub token only in the main publication step; the quality job
has read-only repository permissions and no registry credential.

Every job receives a fresh GitHub-hosted VM. External fork contributors require
workflow approval under the repository's approval policy. Internal Renovate
branch pushes remain automatic; the release-please branch is excluded. The
dedicated self-hosted CI machine is reserved for private repositories.

## stable releases

The existing [stable publisher](../../.github/workflows/build.yml) continues to
run on GitHub-hosted runners. A workflow-wide `stable-image-publisher` lock with
`queue: max` serializes release selection, both native builds and promotion. It
validates a published stable release, builds
native amd64 and arm64 candidates, then promotes version, minor and `latest`
tags. The [release-please workflow](../../.github/workflows/generate-release.yml)
also remains separate.

## verification

Run the shell contracts and workflow syntax checks before changing the runner
or publication helpers:

```sh
bash bin/ci-quality.test.sh
bash bin/ci-image.test.sh
node --test __tests__/bin/ciWorkflow.test.mjs
actionlint .github/workflows/development.yml
```

Actual runtime acceptance requires a development workflow run: passing quality,
a native amd64 image build, an image receipt for the exact source revision and,
for a current `main`, successful publication with a matching registry digest.
Superseded main runs are accepted only when the receipt explicitly records
`published: false` and no registry login or push occurred. Syntax checks alone do
not establish cache reuse or publication success.

## historical self-hosted migration acceptance

The earlier self-hosted migration was verified on 2026-10-23 against [the migrated revision](https://github.com/icoretech/airbroke/commit/c5f0e5d1093fd5469e57a563b1937f980b87c274). These timings describe that previous runner and do not establish hosted-runner performance:

- [Quality](https://github.com/icoretech/airbroke/actions/runs/39929338657/job/120333433691)
  passed in four minutes: Biome, React Doctor with no findings, typechecking,
  migrations, 446 tests across 77 files, and the production build. The Yarn
  archive store was retained; immutable installation took 39 seconds after
  the initial empty-store run took 78 seconds. Fresh linking and Prisma client
  generation still execute.
- The first image job passed in 3m37s. A same-source
  [image-only warm rerun](https://github.com/icoretech/airbroke/actions/runs/39929338657/job/120337171193)
  passed in 19 seconds with local BuildKit stages marked `CACHED`. This is
  measured cache reuse for unchanged source, not a timing guarantee for changed
  dependencies or application code.
- Development tags `main-c5f0e5d1-1792746581` and
  `main-c5f0e5d1-1792746895` resolve to
  `sha256:79a0017910dc046ec7ae0f7bd311863383e2ab16acb8bbb940133175e462743a`.
  Registry metadata independently confirmed Linux amd64 and the exact source
  revision. The existing Flux policy selected the new development tag without
  changing its filter or deployment configuration.
- Drone was disabled for this repository and its previous build history
  remained accessible. Stable release workflows were unchanged.

The publisher's temporary Docker credential directory is removed on success,
failure and cleanup. Docker may report that credentials are unencrypted within
that job-owned temporary file; the workflow does not persist a registry login
in the runner's shared configuration.

## known upstream warnings

Verified on 2026-10-23: [dependency alert 179](https://github.com/icoretech/airbroke/security/dependabot/179)
affects the locked `braces` 3.0.3 selection through shadcn's tooling dependencies.
The [advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) lists no patched
release. A routine supported upgrade cannot currently resolve it. This does not
establish application exploitability or absence from the production image.

Prisma 7.10.1's [package metadata](https://registry.npmjs.org/prisma/7.10.1)
permits Node 26, while its [preinstall check](https://github.com/prisma/orm/blob/7.10.1/packages/cli/scripts/preinstall.ts)
warns for majors above 24 without rejecting installation. The same warning
appeared in the successful Drone baseline. Client generation and the migrated
quality gates require their own runtime checks; the warning is not suppressed.
No newer stable Prisma release was available during this check. The registry's
`latest` tag pointed to a Prisma 8 release candidate, which is not a stable
upgrade target.
