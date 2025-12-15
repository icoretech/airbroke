// __tests__/lib/gitProvider.test.ts

import { describe, expect, test } from "vitest";
import { composeFileUrl, parseGitURL } from "@/lib/gitProvider";
import { createProject } from "../factories/prismaFactories";
import type { GitInfo } from "@/lib/gitProvider";

describe("composeFileUrl", () => {
  const BASE_FILE_PATH = "path/to/file";
  const LINE_NUMBER = 5;

  // You can add or remove entries in this array to cover more providers or scenarios.
  const cases = [
    {
      name: "GitHub",
      repo_provider: "github",
      repo_url: "https://github.com/org/repo",
      repo_branch: "main",
      expectedUrlWithLine: `https://github.com/org/repo/blob/main/${BASE_FILE_PATH}#L${LINE_NUMBER}`,
      expectedUrlNoLine: `https://github.com/org/repo/blob/main/${BASE_FILE_PATH}`,
    },
    {
      name: "Bitbucket",
      repo_provider: "bitbucket",
      repo_url: "https://bitbucket.org/org/repo",
      repo_branch: "branch",
      expectedUrlWithLine: `https://bitbucket.org/org/repo/src/branch/${BASE_FILE_PATH}#lines-${LINE_NUMBER}`,
      expectedUrlNoLine: `https://bitbucket.org/org/repo/src/branch/${BASE_FILE_PATH}`,
    },
    {
      name: "GitLab",
      repo_provider: "gitlab",
      repo_url: "https://gitlab.com/org/repo",
      repo_branch: "branch",
      expectedUrlWithLine: `https://gitlab.com/org/repo/-/blob/branch/${BASE_FILE_PATH}#L${LINE_NUMBER}`,
      expectedUrlNoLine: `https://gitlab.com/org/repo/-/blob/branch/${BASE_FILE_PATH}`,
    },
    {
      name: "GitKraken",
      repo_provider: "gitkraken",
      repo_url: "https://app.gitkraken.com/glo/repo",
      repo_branch: "main",
      expectedUrlWithLine: `https://app.gitkraken.com/glo/repo/tree/main/${BASE_FILE_PATH}#L${LINE_NUMBER}`,
      expectedUrlNoLine: `https://app.gitkraken.com/glo/repo/tree/main/${BASE_FILE_PATH}`,
    },
    {
      name: "Gitea",
      repo_provider: "gitea",
      repo_url: "https://gitea.example.com/org/repo",
      repo_branch: "main",
      expectedUrlWithLine: `https://gitea.example.com/org/repo/src/branch/main/${BASE_FILE_PATH}#L${LINE_NUMBER}`,
      expectedUrlNoLine: `https://gitea.example.com/org/repo/src/branch/main/${BASE_FILE_PATH}`,
    },
    {
      name: "Gogs",
      repo_provider: "gogs",
      repo_url: "https://gogs.example.com/org/repo",
      repo_branch: "main",
      expectedUrlWithLine: `https://gogs.example.com/org/repo/blob/main/${BASE_FILE_PATH}#L${LINE_NUMBER}`,
      expectedUrlNoLine: `https://gogs.example.com/org/repo/blob/main/${BASE_FILE_PATH}`,
    },
    {
      name: "Gitter",
      repo_provider: "gitter",
      repo_url: "https://gitter.example.com/org/repo",
      repo_branch: "main",
      expectedUrlWithLine: `https://gitter.example.com/org/repo/blob/main/${BASE_FILE_PATH}#L${LINE_NUMBER}`,
      expectedUrlNoLine: `https://gitter.example.com/org/repo/blob/main/${BASE_FILE_PATH}`,
    },
  ];

  // Test each known provider for both “with line” and “no line” scenario.
  test.each(cases)("should return correct URL for $name (with line)", async ({
    repo_provider,
    repo_url,
    repo_branch,
    expectedUrlWithLine,
  }) => {
    const project = await createProject({
      repo_provider,
      repo_url,
      repo_branch,
    });
    const url = composeFileUrl(project, BASE_FILE_PATH, LINE_NUMBER);
    expect(url).toBe(expectedUrlWithLine);
  });

  test.each(cases)("should return correct URL for $name (no line)", async ({
    repo_provider,
    repo_url,
    repo_branch,
    expectedUrlNoLine,
  }) => {
    const project = await createProject({
      repo_provider,
      repo_url,
      repo_branch,
    });
    const url = composeFileUrl(project, BASE_FILE_PATH);
    expect(url).toBe(expectedUrlNoLine);
  });

  test("should return an empty string for unknown repository provider", async () => {
    const project = await createProject({
      repo_provider: "unknown",
      repo_url: "https://example.com/repo",
      repo_branch: "main",
    });
    const url = composeFileUrl(project, BASE_FILE_PATH, LINE_NUMBER);
    expect(url).toBe("");
  });

  test("should return an empty string if branch is missing", async () => {
    const project = await createProject({
      repo_provider: "github",
      repo_url: "https://github.com/org/repo",
      repo_branch: "",
    });
    const url = composeFileUrl(project, BASE_FILE_PATH, LINE_NUMBER);
    expect(url).toBe("");
  });

  test("should return an empty string if URL is missing", async () => {
    const project = await createProject({
      repo_provider: "github",
      repo_url: "",
      repo_branch: "main",
    });
    const url = composeFileUrl(project, BASE_FILE_PATH, LINE_NUMBER);
    expect(url).toBe("");
  });

  test("should return an empty string if filePath is missing", async () => {
    const project = await createProject({
      repo_provider: "github",
      repo_url: "https://github.com/org/repo",
      repo_branch: "main",
    });
    const url = composeFileUrl(project, "");
    expect(url).toBe("");
  });
});

describe("parseGitURL", () => {
  test("parses a GitHub URL correctly", () => {
    const url = "https://github.com/icoretech/airbroke";
    const expected: GitInfo = {
      provider: "github",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test("parses a GitLab URL correctly", () => {
    const url = "https://gitlab.com/icoretech/airbroke";
    const expected: GitInfo = {
      provider: "gitlab",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test("parses a Bitbucket URL correctly", () => {
    const url = "https://bitbucket.org/icoretech/airbroke";
    const expected: GitInfo = {
      provider: "bitbucket",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test("returns null for an invalid URL", () => {
    const url = "not a url";
    expect(parseGitURL(url)).toBeNull();
  });

  test("parses a URL with a .git extension correctly", () => {
    const url = "https://github.com/icoretech/airbroke.git";
    const expected: GitInfo = {
      provider: "github",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test("parses a URL with a path inside the repo correctly", () => {
    const url = "https://github.com/icoretech/airbroke/tree/main";
    const expected: GitInfo = {
      provider: "github",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test("parses a URL with different domain ending correctly", () => {
    const url = "https://github.co.uk/icoretech/airbroke";
    const expected: GitInfo = {
      provider: "github",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test("parses a git:// GitHub URL correctly", () => {
    const url = "git://github.com/icoretech/airbroke";
    const expected: GitInfo = {
      provider: "github",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test("parses a git:// GitLab URL correctly", () => {
    const url = "git://gitlab.com/icoretech/airbroke";
    const expected: GitInfo = {
      provider: "gitlab",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test("parses a git:// Bitbucket URL correctly", () => {
    const url = "git://bitbucket.org/icoretech/airbroke";
    const expected: GitInfo = {
      provider: "bitbucket",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test("parses a git:// URL with a .git extension correctly", () => {
    const url = "git://github.com/icoretech/airbroke.git";
    const expected: GitInfo = {
      provider: "github",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test("parses a git:// URL with a path inside the repo correctly", () => {
    const url = "git://github.com/icoretech/airbroke/tree/main";
    const expected: GitInfo = {
      provider: "github",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  test("handles SSH short syntax for GitHub", () => {
    const url = "git@github.com:icoretech/airbroke.git";
    const expected: GitInfo = {
      provider: "github",
      organization: "icoretech",
      repository: "airbroke",
    };
    expect(parseGitURL(url)).toEqual(expected);
  });

  describe("parseGitURL - Extended", () => {
    test("parses short SSH syntax for GitHub", () => {
      const url = "git@github.com:icoretech/airbroke.git";
      const expected: GitInfo = {
        provider: "github",
        organization: "icoretech",
        repository: "airbroke",
      };
      expect(parseGitURL(url)).toEqual(expected);
    });

    test("parses ssh:// URL for GitHub with port", () => {
      const url = "ssh://git@github.com:22/icoretech/airbroke.git";
      const expected: GitInfo = {
        provider: "github",
        organization: "icoretech",
        repository: "airbroke",
      };
      expect(parseGitURL(url)).toEqual(expected);
    });

    test("parses https:// URL with port number", () => {
      const url = "https://github.com:8080/icoretech/airbroke.git";
      const expected: GitInfo = {
        provider: "github",
        organization: "icoretech",
        repository: "airbroke",
      };
      expect(parseGitURL(url)).toEqual(expected);
    });

    test("returns null for unknown format", () => {
      const url = "git@example.com org/repo"; // no colon or slash
      expect(parseGitURL(url)).toBeNull();
    });

    // You can also test subdomains or other scenarios
    test("parses subdomain - e.g. git.company.com", () => {
      const url = "https://git.company.com/devops/airbroke";
      const result = parseGitURL(url);
      expect(result).not.toBeNull();
      if (result) {
        expect(result.provider).toBe("unknown");
        expect(result.organization).toBe("devops");
        expect(result.repository).toBe("airbroke");
      }
    });
  });
});
