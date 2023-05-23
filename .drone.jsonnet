local shouldPushImage(branch) = if branch == 'main' then false else true;

local pipeline(branch, name) = {
  kind: 'pipeline',
  type: 'kubernetes',
  name: name,
  trigger: {
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
      name: 'build',
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
        dry_run: shouldPushImage(branch),
      },
    },
  ],
};
[
  pipeline('main', 'next'),
]
