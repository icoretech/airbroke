// @vitest-environment node
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, expect, it } from "vitest";

const script = resolve("bin/validate-image-platforms.mjs");
const sha = "a".repeat(40);
let directory;
function candidate(architecture, digest) {
  return {
    manifest: { digest: `sha256:${digest.repeat(64)}` },
    image: {
      architecture,
      os: "linux",
      config: {
        Labels: {
          "org.opencontainers.image.revision": sha,
          "org.opencontainers.image.version": "1.4.3",
        },
      },
    },
  };
}
function run(candidates) {
  const paths = candidates.map((value, index) => {
    const file = join(directory, `${index}.json`);
    writeFileSync(file, JSON.stringify(value));
    return file;
  });
  return spawnSync(process.execPath, [script, ...paths], {
    encoding: "utf8",
    env: { ...process.env, EXPECTED_SHA: sha, VERSION: "1.4.3" },
  });
}
beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "image-platforms-"));
});
afterEach(() => rmSync(directory, { recursive: true, force: true }));
it("emits both immutable manifest digests for the exact release platforms", () => {
  const result = run([candidate("amd64", "b"), candidate("arm64", "c")]);
  expect(result.status).toBe(0);
  expect(result.stdout).toBe(
    `sha256:${"b".repeat(64)}\nsha256:${"c".repeat(64)}\n`,
  );
});
it.each([[null], [[]], [42], ["sample"], [true]])(
  "rejects a non-object candidate %j with a clear input error",
  (value) => {
    const result = run([candidate("amd64", "b"), value]);
    expect(result.status).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Candidate must be a JSON object");
    expect(result.stderr).not.toContain("TypeError");
  },
);
it.each([
  "missing",
  "extra",
  "duplicate",
  "wrong architecture",
  "wrong OS",
  "wrong revision",
  "wrong version",
  "missing labels",
  "invalid digest",
])("rejects %s without emitting partial digests", (scenario) => {
  const candidates = [candidate("amd64", "b"), candidate("arm64", "c")];
  if (scenario === "missing") candidates.pop();
  if (scenario === "extra") candidates.push(candidate("s390x", "d"));
  if (scenario === "duplicate")
    candidates[1].manifest.digest = candidates[0].manifest.digest;
  if (scenario === "wrong architecture")
    candidates[1].image.architecture = "amd64";
  if (scenario === "wrong OS") candidates[1].image.os = "windows";
  if (scenario === "wrong revision")
    candidates[1].image.config.Labels["org.opencontainers.image.revision"] =
      "d".repeat(40);
  if (scenario === "wrong version")
    candidates[1].image.config.Labels["org.opencontainers.image.version"] =
      "1.4.2";
  if (scenario === "missing labels") candidates[1].image.config.Labels = {};
  if (scenario === "invalid digest") candidates[1].manifest.digest = "latest";
  const result = run(candidates);
  expect(result.status).toBe(1);
  expect(result.stdout).toBe("");
});
