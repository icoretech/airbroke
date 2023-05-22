export type GitInfo = {
  provider: string,
  organization: string,
  repository: string
};

export function parseGitURL(url: string): GitInfo | null {
  // Regex explanation:
  // (https?|git):\/\/ => Matches the protocol (http, https, or git)
  // ([^.]+)            => Matches the provider (everything up to the first dot)
  // \.[^\/]+           => Matches the domain ending (everything after the first dot and before the first slash)
  // \/([^\/]+)         => Matches the organization (everything after the first slash and before the second slash)
  // \/([^\/]+?)        => Matches the repo name (everything after the second slash and before the third slash or the end of the string, as few as possible)
  // (?:\.git)?         => Optionally matches the .git extension
  // (?:\/|$)           => Matches the end of the string or a slash (to ensure we don't accidentally match a path inside the repo)
  const regex = /(https?|git):\/\/([^.]+)\.[^\/]+\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/|$)/;
  const matches = url.match(regex);

  if (!matches) {
    return null;
  }

  return {
    provider: matches[2],
    organization: matches[3],
    repository: matches[4]
  };
}
