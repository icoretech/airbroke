import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const root = resolve(import.meta.dirname, "..");
const development = readFileSync(
  resolve(root, ".github/workflows/development.yml"),
  "utf8",
);
const build = readFileSync(
  resolve(root, ".github/workflows/build.yml"),
  "utf8",
);

test("development cancels ordinary pushes and isolates release commits by SHA", () => {
  assert.match(
    development,
    /group: "development-\$\{\{ github\.ref \}\}-\$\{\{ github\.ref == 'refs\/heads\/main' && startsWith\(github\.event\.head_commit\.message, 'chore\(main\): release '\) && github\.sha \|\| 'latest' \}\}"/,
  );
  assert.match(development, /cancel-in-progress: true/);
  assert.doesNotMatch(development, /workflow_run:/);
});

test("stable publisher serializes the complete workflow", () => {
  assert.equal(build.match(/^concurrency:$/gm)?.length, 1);
  assert.match(build, /group: stable-image-publisher/);
  assert.match(build, /queue: max/);
  assert.match(build, /cancel-in-progress: false/);
});
