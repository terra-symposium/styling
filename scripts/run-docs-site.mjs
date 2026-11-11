/**
 * scripts/run-docs-site.mjs
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, readdir } from "node:fs/promises";
import { spawn, spawnSync } from "node:child_process";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  await readFile(resolve(root, "package.json"), "utf8"),
);
const docs = manifest.docs ?? {};
const docsPnpmDir = resolve(root, "config/node_modules/.pnpm");
const docsFolder = (await readdir(docsPnpmDir)).find((n) =>
  n.startsWith("@terra-symposium+docs@"),
);
const docsRoot = resolve(
  docsPnpmDir,
  docsFolder,
  "node_modules/@terra-symposium/docs",
);
const docsBin = resolve(docsRoot, "bin/docs.mjs");
const docsRequire = createRequire(resolve(docsRoot, "package.json"));
const astroPackage = docsRequire.resolve("astro/package.json");
const astroCli = resolve(dirname(astroPackage), "bin/astro.mjs");
const config = "config/styling-docs-astro.mjs";
const mode = process.argv[2] ?? "dev";
const port = process.argv[3] ?? "2030";
const env = {
  ...process.env,
  DOCS_ROOT: root,
  DOCS_SITE: docs.site ?? "",
  DOCS_BASE: docs.base ?? "/",
  DOCS_OUT: docs.out ?? "dist/docs",
  PUBLIC_DOCS_TITLE: docs.title ?? "Documentation",
  PUBLIC_DOCS_DESCRIPTION: docs.description ?? "",
  PUBLIC_DOCS_INCLUDE_AGENTS: String(
    docs.includeAgents ?? docs.includeSkills ?? true,
  ),
};
const astroArgs = [astroCli, mode, "--root", root, "--config", config];

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 *
 * @param cmd
 * @param args
 * @param options
 */
function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    env,
    stdio: "inherit",
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
if (!docsFolder)
  throw new Error(
    "@terra-symposium/docs was not found in config/node_modules/.pnpm.",
  );

// Let Docs refresh the search index and copy content assets before Astro starts.
run(process.execPath, [docsBin, "build"]);
if (mode === "dev" || mode === "preview") astroArgs.push("--port", port);
const cmd =
  mode === "preview"
    ? [process.execPath, resolve(root, "scripts/serve-docs-preview.mjs"), port]
    : [process.execPath, ...astroArgs];
const child = spawn(cmd[0], cmd.slice(1), { cwd: root, env, stdio: "inherit" });
child.on("error", (e) => {
  console.error(
    `Could not start the Styling Docs ${mode} server: ${e.message}`,
  );
  process.exitCode = 1;
});
child.on("exit", (c, s) => {
  if (s) process.kill(process.pid, s);
  else process.exitCode = c ?? 1;
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
