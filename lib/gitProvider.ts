// lib/gitProvider.ts

import type { Project } from '@prisma/client';

/**
 * Information about a repository provider and path.
 */
export type GitInfo = {
  provider: string; // e.g. "github", "gitlab", "bitbucket", or "unknown"
  organization: string; // e.g. "icoretech"
  repository: string; // e.g. "airbroke"
};

/**
 * Attempts to parse a Git URL (HTTPS/GIT/SSH) to extract provider, org, and repo.
 * Returns `null` if it doesn't match a recognized format.
 *
 * Examples of supported URLs:
 *   https://github.com/icoretech/airbroke
 *   http://gitlab.com/org/repo.git
 *   git://bitbucket.org/icoretech/airbroke
 *   ssh://git@github.com:1234/org/repo
 *   git@github.com:org/repo.git
 */
export function parseGitURL(url: string): GitInfo | null {
  // 1) Check short SSH form, e.g. "git@github.com:org/repo.git"
  // Explanation:
  //   ^git@        => starts with "git@"
  //   ([^:]+)      => capture domain up to the next colon (e.g. "github.com")
  //   :            => literal colon
  //   ([^/]+)      => capture the organization (anything up to the next '/')
  //   \/           => a slash
  //   ([^/]+?)     => capture the repo name (minimal match before optional .git)
  //   (?:\.git)?   => optionally match ".git"
  //   (?:\/|$)     => end with a slash or end of string
  const shortSshRegex = /^git@([^:]+):([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/i;

  // 2) Check for a more general URL form:
  //    https://  or  http://  or  git:// or ssh://
  //    then optional user@ (like "git@" or "ubuntu@") plus optional port
  //    domain => ([^/:]+)  up to next slash or colon
  //    slash or colon => "/org/repo" or possible "org/repo"
  //
  // Explanation of capturing groups in the second part:
  //   ([^/]+) => organization
  //   ([^/]+?) => repository name (non-greedy)
  //   (?:\.git)? => optional ".git"
  //   (?:\/|$) => end with slash or string end
  //
  // This tries to handle "ssh://git@github.com/org/repo.git"
  // plus "https://github.com/org/repo" or "git://bitbucket.org/org/repo"
  const generalUrlRegex = /^(?:https?|git|ssh):\/\/(?:[^@]+@)?([^/:]+)(?::\d+)?\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/i;

  // First, try short SSH form: "git@domain:org/repo"
  let matches = url.match(shortSshRegex);
  if (matches) {
    const [, domain, org, repo] = matches;
    return {
      provider: guessProvider(domain.toLowerCase()),
      organization: org,
      repository: repo,
    };
  }

  // Next, try the more general URL pattern
  matches = url.match(generalUrlRegex);
  if (matches) {
    const [, domain, org, repo] = matches;
    return {
      provider: guessProvider(domain.toLowerCase()),
      organization: org,
      repository: repo,
    };
  }

  // If neither regex matched, return null
  return null;
}

export function composeFileUrl(project: Project, filePath: string, lineNumber?: number): string {
  // Convert provider/branch/URL/file path to lowercase (or handle them safely).
  const repoProvider = project.repo_provider?.toLowerCase();
  const repoUrl = project.repo_url?.toLowerCase() || '';
  const repoBranch = project.repo_branch?.toLowerCase() || '';
  const filePathLower = filePath.toLowerCase();

  // Bail out if we don’t have the minimum info needed.
  if (!repoUrl || !repoBranch || !filePathLower || !repoProvider) {
    return '';
  }

  // Each provider has a unique path for referencing files.
  const providerPaths: Record<string, string> = {
    github: '/blob',
    bitbucket: '/src',
    gitlab: '/-/blob',
    gitkraken: '/tree',
    gitea: '/src/branch',
    gogs: '/blob',
    gitter: '/blob',
  };

  // Some providers have unique ways to reference a particular line.
  const lineNumberFormats: Record<string, (line: number) => string> = {
    bitbucket: (line) => `#lines-${line}`,
    default: (line) => `#L${line}`,
  };

  // If we don’t recognize the provider, return empty.
  const basePath = providerPaths[repoProvider];
  if (!basePath) {
    return '';
  }

  // Construct the base URL with provider-specific path.
  let url = `${repoUrl}${basePath}/${repoBranch}/${filePathLower}`;

  // Append line-number reference if provided.
  if (lineNumber) {
    const formatter = lineNumberFormats[repoProvider] ?? lineNumberFormats.default;
    url += formatter(lineNumber);
  }

  return url;
}

/**
 * Attempts to guess the provider name from a domain.
 * E.g. "github.com" => "github", "gitlab.com" => "gitlab"
 * Falls back to "unknown" if it can't identify a known provider.
 */
function guessProvider(domain: string): string {
  if (domain.includes('github')) return 'github';
  if (domain.includes('gitlab')) return 'gitlab';
  if (domain.includes('bitbucket')) return 'bitbucket';
  if (domain.includes('gitea')) return 'gitea';
  // Add more partial matches if needed...
  return 'unknown';
}
