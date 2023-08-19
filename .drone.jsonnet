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
    steps: [
      {
        name: 'tag',
        image: 'alpine/git',
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
          build_args: {
            DEBUG_TOOLS: 'true',
          },
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
