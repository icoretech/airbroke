[
  {
    kind: 'pipeline',
    type: 'kubernetes',
    name: 'next',
    clone: {
      depth: 1,
    },
    trigger: {
      branch: {
        exclude: ['release-please--branches--main--components--airbroke'],
      },
      event: {
        include: ['push'],
      },
    },
    services: [
      {
        name: 'pg',
        image: 'postgres:18',
        environment: {
          POSTGRES_DB: 'airbroke_test',
          POSTGRES_USER: 'test_user',
          POSTGRES_PASSWORD: 'test_user_password',
        },
        ports: [5432],
      },
    ],
    steps: [
      {
        name: 'quality',
        image: 'node:24.12-alpine',
        commands: [
          'apk add --no-cache git',
          'corepack enable',
          'yarn install --immutable',
          'yarn biome:ci',
          'yarn typecheck',
          'yarn prisma db push',
          'yarn test --run',
          'NODE_ENV=production yarn build',
        ],
        environment: {
          CI: 'true',
          DATABASE_URL:
            'postgresql://test_user:test_user_password@pg/airbroke_test?connection_limit=15',
          DIRECT_URL: 'postgresql://test_user:test_user_password@pg/airbroke_test',
          NEXT_TELEMETRY_DISABLED: '1',
          TESTING: 'true',
        },
      },
      {
        name: 'tag',
        image: 'alpine/git',
        depends_on: ['quality'],
        commands: [
          "export CUSTOM_BRANCH_NAME=$(basename \"${DRONE_SOURCE_BRANCH}\" | tr '[:upper:]' '[:lower:]' | sed 's/_/-/g')",
          'echo -n "$CUSTOM_BRANCH_NAME-$SHORT_SHA-$(date +%s)" > .tags',
        ],
        environment: {
          SHORT_SHA: '${DRONE_COMMIT_SHA:0:8}',
        },
      },
      {
        name: 'build-and-push',
        image: 'thegeeklab/drone-docker-buildx',
        privileged: true,
        depends_on: ['tag'],
        settings: {
          debug: true,
          purge: true,
          no_cache: true,
          platforms: ['linux/amd64'],
          repo: 'ghcr.io/icoretech/airbroke',
          registry: 'ghcr.io/icoretech',
          username: {
            from_secret: 'github_packages_username',
          },
          password: {
            from_secret: 'github_packages_pat',
          },
          build_args: [
            'DEBUG_TOOLS=true',
          ],
        },
        when: {
          branch: ['main'],
        },
      },
      {
        name: 'build-no-push',
        image: 'thegeeklab/drone-docker-buildx',
        privileged: true,
        depends_on: ['tag'],
        settings: {
          dry_run: true,
          debug: true,
          purge: true,
          no_cache: true,
          platforms: ['linux/amd64'],
          repo: 'ghcr.io/icoretech/airbroke',
          registry: 'ghcr.io/icoretech',
          username: {
            from_secret: 'github_packages_username',
          },
          password: {
            from_secret: 'github_packages_pat',
          },
        },
        when: {
          branch: {
            exclude: ['main'],
          },
        },

      },
    ],
  },
]
