import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Only stable SemVer tags are eligible for the stable image channel.
const stableTag = /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const [releasesFile, commitFile, sourceDirectory] = process.argv.slice(2);
const tag = process.env.RELEASE_TAG;
if (!stableTag.test(tag ?? ""))
  throw new Error("Expected a stable SemVer release tag");
const releases = JSON.parse(readFileSync(releasesFile, "utf8")).flat();
const stable = releases.filter(
  (release) =>
    release.draft === false &&
    release.prerelease === false &&
    typeof release.published_at === "string" &&
    Number.isFinite(Date.parse(release.published_at)) &&
    stableTag.test(release.tag_name),
);
stable.sort((left, right) => {
  const a = left.tag_name.match(stableTag).slice(1).map(BigInt);
  const b = right.tag_name.match(stableTag).slice(1).map(BigInt);
  for (let index = 0; index < 3; index++) {
    if (a[index] !== b[index]) return a[index] > b[index] ? -1 : 1;
  }
  return 0;
});
if (stable[0]?.tag_name !== tag)
  throw new Error("Release is not the newest published stable version");
const { sha } = JSON.parse(readFileSync(commitFile, "utf8"));
if (typeof sha !== "string" || !/^[a-f0-9]{40}$/.test(sha))
  throw new Error("Expected a resolved commit SHA");
if (process.env.EXPECTED_SHA && process.env.EXPECTED_SHA !== sha)
  throw new Error("Release tag moved during the build");
const version = tag.replace(/^v/, "");
if (sourceDirectory) {
  const head = execFileSync(
    "git",
    ["-C", sourceDirectory, "rev-parse", "HEAD"],
    { encoding: "utf8" },
  ).trim();
  if (head !== sha)
    throw new Error("Source checkout does not match the release commit");
  const manifest = JSON.parse(
    readFileSync(resolve(sourceDirectory, "package.json"), "utf8"),
  );
  if (manifest.version !== version)
    throw new Error("Package version does not match the release tag");
}
const output = `tag=${tag}\nversion=${version}\nminor=${version.split(".").slice(0, 2).join(".")}\nsha=${sha}\n`;
if (process.env.GITHUB_OUTPUT)
  appendFileSync(process.env.GITHUB_OUTPUT, output);
process.stdout.write(output);
