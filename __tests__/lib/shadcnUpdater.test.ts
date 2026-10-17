// @vitest-environment node

import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const updaterPath = resolve("bin/update-shadcn-components.mjs");
const workspaces: string[] = [];

function createWorkspace() {
  const directory = mkdtempSync(join(tmpdir(), "shadcn-updater-"));
  workspaces.push(directory);
  mkdirSync(join(directory, "components", "ui"), { recursive: true });
  writeFileSync(
    join(directory, "components", "ui", "button.tsx"),
    "export {};",
  );
  writeFileSync(
    join(directory, "components", "ui", "AGENTS.md"),
    "registry guide",
  );
  mkdirSync(join(directory, "bin"));
  const commandLog = join(directory, "commands.log");
  for (const command of ["yarn", "npx"]) {
    const executable = join(directory, "bin", command);
    writeFileSync(
      executable,
      `#!/bin/sh\nprintf '%s\\n' "$*" >> "$SHADCN_COMMAND_LOG"\ncase "$*" in\n  *dedupe*) exit 0 ;;\n  *) exit "\${SHADCN_EXIT_CODE:-0}" ;;\nesac\n`,
    );
    chmodSync(executable, 0o755);
  }
  return {
    directory,
    commandLog,
    env: {
      ...process.env,
      PATH: `${join(directory, "bin")}:${process.env.PATH}`,
      SHADCN_COMMAND_LOG: commandLog,
    },
  };
}

afterEach(() => {
  for (const workspace of workspaces.splice(0)) {
    rmSync(workspace, { recursive: true, force: true });
  }
});

describe("shadcn registry updater", () => {
  it("previews registry changes without installing when dry mode is requested", () => {
    const workspace = createWorkspace();

    const result = spawnSync(process.execPath, [updaterPath, "--dry"], {
      cwd: workspace.directory,
      env: workspace.env,
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    const commands = readFileSync(workspace.commandLog, "utf8")
      .trim()
      .split("\n");
    expect(commands).toEqual(["dlx shadcn@latest add button --yes --dry-run"]);
  });

  it("returns a failure without deduping when the registry CLI fails", () => {
    const workspace = createWorkspace();

    const result = spawnSync(process.execPath, [updaterPath], {
      cwd: workspace.directory,
      env: { ...workspace.env, SHADCN_EXIT_CODE: "7" },
      encoding: "utf8",
    });

    expect(result.status).toBe(1);
    expect(
      readFileSync(workspace.commandLog, "utf8").trim().split("\n"),
    ).toEqual(["dlx shadcn@latest add button --yes --overwrite"]);
  });

  it("updates the selected registry components before deduping when the CLI succeeds", () => {
    const workspace = createWorkspace();

    const result = spawnSync(process.execPath, [updaterPath, "card"], {
      cwd: workspace.directory,
      env: workspace.env,
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(
      readFileSync(workspace.commandLog, "utf8").trim().split("\n"),
    ).toEqual(["dlx shadcn@latest add card --yes --overwrite", "dedupe"]);
  });
});
