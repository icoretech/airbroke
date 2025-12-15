#!/usr/bin/env node
import { spawn } from "node:child_process";
/*
 * Update local shadcn/ui components by re-adding them from the registry.
 * See: yarn shadcn:update
 */
import { readdir } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import process from "node:process";

const cwd = process.cwd();
const uiDir = join(cwd, "components", "ui");
const DRY = process.argv.includes("--dry");

function toComponentName(file) {
  return basename(file, extname(file));
}

async function detectComponents() {
  const entries = await readdir(uiDir, { withFileTypes: true });
  const files = entries
    .filter(
      (d) => d.isFile() && (d.name.endsWith(".tsx") || d.name.endsWith(".ts")),
    )
    .map((d) => d.name);
  return Array.from(new Set(files.map(toComponentName).sort()));
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      cwd,
      shell: false,
      ...opts,
    });
    child.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(
            new Error(`${cmd} ${args.join(" ")} exited with code ${code}`),
          ),
    );
    child.on("error", reject);
  });
}

async function main() {
  const positional = process.argv.filter((a) => !a.startsWith("-")).slice(2);
  const components =
    positional.length > 0 ? positional : await detectComponents();

  if (components.length === 0) {
    console.log("[shadcn:update] No components found.");
    return;
  }

  console.log("[shadcn:update] CWD:", cwd);
  console.log("[shadcn:update] Components:", components.join(", "));

  // Install/update all components in a single pass so the CLI computes
  // a unified dependency set and Yarn performs a single install.
  const args = ["shadcn@latest", "add", ...components, "--yes", "--overwrite"];
  const printable = `npx ${args.join(" ")}`;
  console.log(`[shadcn:update] ${printable}`);
  if (!DRY) {
    try {
      await run("npx", args, {
        env: {
          ...process.env,
          CI: "1",
          // Avoid paging diffs (can hang in containers)
          GIT_PAGER: "cat",
          PAGER: "cat",
          LESS: "-FRX",
        },
      });
      console.log("[shadcn:update] CLI finished.");
    } catch (err) {
      console.error(`[shadcn:update] Failed:`, err.message);
    }
  }

  // Best-effort dedupe to collapse any transient range bumps the CLI added.
  if (!DRY) {
    try {
      console.log("[shadcn:update] yarn dedupe (best-effort)");
      await run("yarn", ["dedupe"]);
    } catch (err) {
      console.warn("[shadcn:update] yarn dedupe skipped:", err.message);
    }
  }

  console.log("[shadcn:update] Done.");
}

main().catch((err) => {
  console.error("[shadcn:update] Unexpected error:", err);
  process.exitCode = 1;
});
