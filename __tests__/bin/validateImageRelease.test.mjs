// @vitest-environment node
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const script = resolve("bin/validate-image-release.mjs");
let directory;
let sha;
const release = (tag, properties = {}) => ({
  tag_name: tag,
  draft: false,
  prerelease: false,
  published_at: "2026-01-01T00:00:00Z",
  ...properties,
});
function run(releases, options = {}) {
  writeFileSync(join(directory, "releases.json"), JSON.stringify(releases));
  writeFileSync(
    join(directory, "commit.json"),
    JSON.stringify({ sha: options.sha ?? sha }),
  );
  return spawnSync(
    process.execPath,
    [
      script,
      join(directory, "releases.json"),
      join(directory, "commit.json"),
      ...(options.source === false ? [] : [directory]),
    ],
    {
      encoding: "utf8",
      env: {
        ...process.env,
        GITHUB_OUTPUT: "",
        RELEASE_TAG: options.tag ?? "v1.4.0",
        EXPECTED_SHA: options.expectedSha ?? "",
      },
    },
  );
}
beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "stable-image-"));
  execFileSync("git", ["init", "--quiet", directory]);
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify({ version: "1.4.0" }),
  );
  execFileSync("git", ["-C", directory, "add", "package.json"]);
  execFileSync("git", [
    "-C",
    directory,
    "-c",
    "user.name=Test",
    "-c",
    "user.email=test@example.com",
    "commit",
    "--quiet",
    "-m",
    "fixture",
  ]);
  sha = execFileSync("git", ["-C", directory, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
});
afterEach(() => rmSync(directory, { recursive: true, force: true }));
describe("stable release publisher CLI", () => {
  it("accepts the highest stable version across pages and reports the real checkout SHA", () => {
    const result = run([
      [release("v1.3.99")],
      [release("v1.4.0"), release("v2.0.0-rc.1", { prerelease: true })],
    ]);
    expect(result.status).toBe(0);
    expect(result.stdout).toBe(
      `tag=v1.4.0\nversion=1.4.0\nminor=1.4\nsha=${sha}\n`,
    );
  });
  it.each([
    ["old tag", [release("v1.4.0"), release("v1.10.0")], {}],
    ["prerelease", [release("v1.4.0", { prerelease: true })], {}],
    ["draft", [release("v1.4.0", { draft: true })], {}],
    ["unpublished", [release("v1.4.0", { published_at: null })], {}],
    ["main", [release("v1.4.0")], { tag: "main" }],
    ["prerelease tag", [release("v1.4.0-rc.1")], { tag: "v1.4.0-rc.1" }],
    ["malformed tag", [release("v01.4.0")], { tag: "v01.4.0" }],
    ["invalid SHA", [release("v1.4.0")], { sha: "main" }],
    ["wrong checkout", [release("v1.4.0")], { sha: "a".repeat(40) }],
    ["moved tag", [release("v1.4.0")], { expectedSha: "a".repeat(40) }],
  ])("rejects %s", (_name, releases, options) => {
    const result = run(releases, options);
    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
  });
  it("rejects a version mismatch in the actual checked-out manifest", () => {
    writeFileSync(
      join(directory, "package.json"),
      JSON.stringify({ version: "1.3.0" }),
    );
    const result = run([release("v1.4.0")]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Package version does not match");
  });
  it("rejects promotion after a newer release appears during a build", () => {
    expect(run([release("v1.4.0")]).status).toBe(0);
    expect(
      run([release("v1.4.0"), release("v1.4.1")], { expectedSha: sha }).status,
    ).toBe(1);
  });
});
