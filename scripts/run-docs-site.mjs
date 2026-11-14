/**
 * scripts/run-docs-site.mjs
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
await mkdir(resolve(root, 'dist/cache/astro-types'), { recursive: true });
await mkdir(resolve(root, 'dist/cache/docs/astro-types'), { recursive: true });
const docs = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')).docs ?? {};
const docsRoot = resolve(dirname(fileURLToPath(import.meta.resolve('@terra-symposium/docs'))), '../../..');
const mode = process.argv[2] ?? 'dev';
const port = process.argv[3] ?? '2030';
const env = {
	...process.env,
	DOCS_ROOT: root,
	DOCS_SITE: docs.site ?? '',
	DOCS_BASE: docs.base ?? '/',
	DOCS_OUT: docs.out ?? 'dist/docs',
	PUBLIC_DOCS_TITLE: docs.title ?? 'Documentation',
	PUBLIC_DOCS_DESCRIPTION: docs.description ?? '',
	PUBLIC_DOCS_INCLUDE_AGENTS: String(docs.includeAgents ?? docs.includeSkills ?? true),
};
const astroArgs = [
	resolve(dirname(createRequire(resolve(docsRoot, 'package.json')).resolve('astro/package.json')), 'bin/astro.mjs'),
	mode,
	'--root',
	root,
	'--config',
	'config/styling-docs-astro.mjs',
];

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

// terra-quality-ignore single-use -- Keep run as a named callback for useful error stacks. TSDoc: Runs a child process in the repository with the docs site's environment.
/** Runs a child process in the repository with the docs site's environment.
 *
 * @param cmd Executable path or command name.
 * @param args Arguments passed to the executable.
 * @param options Optional spawn settings that override the defaults.
 */
function run(cmd, args, options = {}) {
	const result = spawnSync(cmd, args, { cwd: root, env, stdio: 'inherit', ...options });
	if (result.error) throw result.error;
	if (result.status !== 0) process.exit(result.status ?? 1);
}
// Let Docs refresh the search index and copy content assets before Astro starts.
run(process.execPath, [resolve(docsRoot, 'bin/docs.mjs'), 'build']);
if (mode === 'dev' || mode === 'preview') astroArgs.push('--port', port);
const cmd = mode === 'preview' ? [process.execPath, resolve(root, 'scripts/serve-docs-preview.mjs'), port] : [process.execPath, ...astroArgs];
const child = spawn(cmd[0], cmd.slice(1), { cwd: root, env, stdio: 'inherit' });
// terra-quality-ignore single-use -- Keep handleSpawnErr as a named callback for useful error stacks. TSDoc: Reports a failure to start the selected docs server process.
/** Reports a failure to start the selected docs server process.
 *
 * @param err Process launch error.
 */
function handleSpawnErr(err) {
	console.error(`Could not start the Styling Docs ${mode} server: ${err.message}`);
	process.exitCode = 1;
}
// terra-quality-ignore single-use -- Keep handleChildExit as a named callback for useful error stacks. TSDoc: Propagates the docs server process result to this runner.
/** Propagates the docs server process result to this runner.
 *
 * @param code Child process exit code, when it exited normally.
 * @param signal Signal that terminated the child process, when applicable.
 */
function handleChildExit(code, signal) {
	if (signal) process.kill(process.pid, signal);
	else process.exitCode = code ?? 1;
}
/** Registers a listener that forwards the selected signal to the docs server.
 *
 * @param signal Termination signal handled by this listener.
 */
function registerSignalForwarder(signal) {
	// terra-quality-ignore single-use -- Keep forwardSignal as a named callback for useful error stacks. TSDoc: Stops the docs server when its parent receives the captured signal.
	/** Stops the docs server when its parent receives the captured signal. */
	function forwardSignal() {
		child.kill(signal);
	}
	process.on(signal, forwardSignal);
}
child.on('error', handleSpawnErr);
child.on('exit', handleChildExit);
for (const signal of ['SIGINT', 'SIGTERM']) {
	registerSignalForwarder(signal);
}
