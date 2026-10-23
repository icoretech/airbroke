# continuous integration

## development builds

The [development workflow](../../.github/workflows/development.yml) replaces the
Drone pipeline for branch pushes. It runs on the selected Linux amd64
self-hosted runner, excluding the release-please branch. Pull-request and tag
events do not schedule this development workflow.

Quality runs Biome, React Doctor, typechecking, Prisma migrations, the complete
serial Vitest suite and a production Next.js build. Every run owns a fresh
workspace, Docker network and PostgreSQL test database. The development database
and workstation environment files are never copied into that workspace.

Yarn package archives persist in a local Docker volume scoped to the repository,
main or validation trust bucket, and toolchain. Immutable installation still runs
each time. The Docker daemon retains its local BuildKit cache between jobs;
development builds neither import nor export cache through a registry. Cleanup
removes run-owned workspaces, containers, networks and image tags while retaining
the dependency and builder caches. CPU quotas are absent; memory and process
limits remain. Vitest stays serial because its tests share database state.

After quality succeeds, `main` publishes one amd64 development image with debug
tools and a `main-<short-sha>-<unix-seconds>` tag. Other branches build the image
without publishing and without debug tools. Stable version, minor and `latest`
tags belong to the separate release workflow.

## public repository trust

The development workflow accepts pushes in the canonical repository. It does
not run pull requests or fork workflows on the self-hosted runner. Publishing
uses the job's GitHub token only in the main publication step; the quality job
has read-only repository permissions and no registry credential.

Docker socket access grants control of the runner host. Repository writers and
the workflows they approve are therefore trusted operators. Do not add public
pull-request execution to this runner. Use GitHub-hosted runners for untrusted
contributions. Runner-group access must remain restricted to selected
repositories; allowing this public repository does not authorize every public
repository in the organization.

## stable releases

The existing [stable publisher](../../.github/workflows/build.yml) continues to
run on GitHub-hosted runners. It validates a published stable release, builds
native amd64 and arm64 candidates, then promotes version, minor and `latest`
tags. The [release-please workflow](../../.github/workflows/generate-release.yml)
also remains separate.

## verification

Run the shell contracts and workflow syntax checks before changing the runner
or publication helpers:

```sh
bash bin/ci-quality.test.sh
bash bin/ci-image.test.sh
actionlint .github/workflows/development.yml
```

Actual runtime acceptance requires a development workflow run: passing quality,
a native amd64 image build, successful main publication and a registry digest
whose source revision matches the tested commit. Syntax checks alone do not
establish cache reuse or publication success.

## migration acceptance

Verified on 2026-10-23 against [the migrated revision](https://github.com/icoretech/airbroke/commit/c5f0e5d1093fd5469e57a563b1937f980b87c274):

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
