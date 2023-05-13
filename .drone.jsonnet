[
  {
    kind: 'pipeline',
    type: 'kubernetes',
    name: 'next',
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
        name: 'build',
        image: 'thegeeklab/drone-docker-buildx',
        privileged: true,
        depends_on: ['tag'],
        settings: {
          debug: true,
          purge: true,
          no_cache: true,
          // platforms: ['linux/amd64', 'linux/arm64'],
          platforms: ['linux/amd64'],
          repo: 'rg.fr-par.scw.cloud/icoretech/airbroke',
          registry: 'rg.fr-par.scw.cloud/icoretech',
          username: 'nologin',
          password: {
            from_secret: 'scaleway_registry_secret_key',
          },
        },
        when: {
          branch: {
            exclude: ['renovate/*'],
          },
        },
      },
    ],
  },
]
