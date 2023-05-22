import { GitInfo, parseGitURL } from '@/lib/parseGitUrl';
import { describe, expect, test } from '@jest/globals';

describe('parseGitURL', () => {
  test('parses a GitHub URL correctly', () => {
    const url = 'https://github.com/icoretech/airbroke';
    const expected: GitInfo = {
      provider: 'github',
      organization: 'icoretech',
      repository: 'airbroke'
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test('parses a GitLab URL correctly', () => {
    const url = 'https://gitlab.com/icoretech/airbroke';
    const expected: GitInfo = {
      provider: 'gitlab',
      organization: 'icoretech',
      repository: 'airbroke'
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test('parses a Bitbucket URL correctly', () => {
    const url = 'https://bitbucket.org/icoretech/airbroke';
    const expected: GitInfo = {
      provider: 'bitbucket',
      organization: 'icoretech',
      repository: 'airbroke'
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test('returns null for an invalid URL', () => {
    const url = 'not a url';
    expect(parseGitURL(url)).toBeNull();
  });

  test('parses a URL with a .git extension correctly', () => {
    const url = 'https://github.com/icoretech/airbroke.git';
    const expected: GitInfo = {
      provider: 'github',
      organization: 'icoretech',
      repository: 'airbroke'
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test('parses a URL with a path inside the repo correctly', () => {
    const url = 'https://github.com/icoretech/airbroke/tree/main';
    const expected: GitInfo = {
      provider: 'github',
      organization: 'icoretech',
      repository: 'airbroke'
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test('parses a URL with different domain ending correctly', () => {
    const url = 'https://github.co.uk/icoretech/airbroke';
    const expected: GitInfo = {
      provider: 'github',
      organization: 'icoretech',
      repository: 'airbroke'
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test('parses a git:// GitHub URL correctly', () => {
    const url = 'git://github.com/icoretech/airbroke';
    const expected: GitInfo = {
      provider: 'github',
      organization: 'icoretech',
      repository: 'airbroke'
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test('parses a git:// GitLab URL correctly', () => {
    const url = 'git://gitlab.com/icoretech/airbroke';
    const expected: GitInfo = {
      provider: 'gitlab',
      organization: 'icoretech',
      repository: 'airbroke'
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test('parses a git:// Bitbucket URL correctly', () => {
    const url = 'git://bitbucket.org/icoretech/airbroke';
    const expected: GitInfo = {
      provider: 'bitbucket',
      organization: 'icoretech',
      repository: 'airbroke'
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test('parses a git:// URL with a .git extension correctly', () => {
    const url = 'git://github.com/icoretech/airbroke.git';
    const expected: GitInfo = {
      provider: 'github',
      organization: 'icoretech',
      repository: 'airbroke'
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test('parses a git:// URL with a path inside the repo correctly', () => {
    const url = 'git://github.com/icoretech/airbroke/tree/main';
    const expected: GitInfo = {
      provider: 'github',
      organization: 'icoretech',
      repository: 'airbroke'
    };
    expect(parseGitURL(url)).toEqual(expected);
  });
});
