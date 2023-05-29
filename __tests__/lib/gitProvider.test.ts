import { composeFileUrl } from '@/lib/gitProvider';
import { describe, expect, test } from '@jest/globals';
import { createProject } from '../factories/prismaFactories';

describe('composeFileUrl', () => {
  test('should return the correct URL for GitHub', async () => {
    const project = await createProject({
      repo_provider: 'github',
      repo_url: 'https://github.com/org/repo',
      repo_branch: 'main',
    });
    const filePath = 'path/to/file';
    const lineNumber = 5;

    const expectedUrl = 'https://github.com/org/repo/blob/main/path/to/file#L5';
    const url = composeFileUrl(project, filePath, lineNumber);

    expect(url).toBe(expectedUrl);
  });

  test('should return the correct URL for Bitbucket', async () => {
    const project = await createProject({
      repo_provider: 'bitbucket',
      repo_url: 'https://bitbucket.org/org/repo',
      repo_branch: 'branch',
    });
    const filePath = 'path/to/file';
    const lineNumber = 5;

    const expectedUrl = 'https://bitbucket.org/org/repo/src/branch/path/to/file#lines-5';
    const url = composeFileUrl(project, filePath, lineNumber);

    expect(url).toBe(expectedUrl);
  });

  test('should return the correct URL for GitLab', async () => {
    const project = await createProject({
      repo_provider: 'gitlab',
      repo_url: 'https://gitlab.com/org/repo',
      repo_branch: 'branch',
    });
    const filePath = 'path/to/file';
    const lineNumber = 5;

    const expectedUrl = 'https://gitlab.com/org/repo/-/blob/branch/path/to/file#L5';
    const url = composeFileUrl(project, filePath, lineNumber);

    expect(url).toBe(expectedUrl);
  });

  test('should return the correct URL without line number', async () => {
    const project = await createProject({
      repo_provider: 'github',
      repo_url: 'https://github.com/org/repo',
      repo_branch: 'main',
    });
    const filePath = 'path/to/file';

    const expectedUrl = 'https://github.com/org/repo/blob/main/path/to/file';
    const url = composeFileUrl(project, filePath);

    expect(url).toBe(expectedUrl);
  });

  test('should return an empty string for unknown repository provider', async () => {
    const project = await createProject({
      repo_provider: 'unknown',
      repo_url: 'https://example.com/repo',
      repo_branch: 'main',
    });
    const filePath = 'path/to/file';
    const lineNumber = 5;

    const expectedUrl = '';
    const url = composeFileUrl(project, filePath, lineNumber);

    expect(url).toBe(expectedUrl);
  });
});
