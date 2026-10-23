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
