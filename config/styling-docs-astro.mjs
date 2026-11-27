/**
 * config/styling-docs-astro.mjs
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = process.cwd();

/**
 * Converts a Vite alias record to the key-value pair accepted by Object.fromEntries.
 *
 * @param s - Styling alias whose find pattern and replacement path become one Vite entry.
 *
 * @return {[string, string]} Alias key and replacement path.
 */
function toStylingAliasEntry(s) {
	return [s.find, s.replacement];
}

const docsRoot = resolve(dirname(fileURLToPath(import.meta.resolve('@terra-symposium/docs'))), '../../..');
const localDocsCatalog = resolve(projectRoot, '../docs/site/src/lib/catalog.ts');
const docsStyle = resolve(docsRoot, 'dist/lib/style.css');
const { default: docsConfig } = await import(/* @vite-ignore */ pathToFileURL(resolve(docsRoot, 'site/config/astro.config.mjs')).href);
const configuredAliases = docsConfig.vite?.resolve?.alias ?? [];
const stylingAliases = [
	{ find: '@terra-symposium/docs-site-catalog', replacement: existsSync(localDocsCatalog) ? localDocsCatalog : resolve(docsRoot, 'site/src/lib/catalog.ts') },
	{ find: '@terra-symposium/docs-site-catchall', replacement: resolve(docsRoot, 'site/src/pages/[...slug].astro') },
	{ find: /^\.\.\/\.\.\/dist\/lib\/style\.css$/, replacement: docsStyle },
	{ find: '@terra-symposium/docs-site-style', replacement: docsStyle },
];
export default {
	...docsConfig,
	srcDir: resolve(projectRoot, 'site/src'),
	vite: {
		...docsConfig.vite,
		ssr: {
			...docsConfig.vite?.ssr,
			noExternal: [...new Set([...(docsConfig.vite?.ssr?.noExternal ?? []), 'sonner'])],
		},
		resolve: {
			...docsConfig.vite?.resolve,
			dedupe: [...new Set([...(docsConfig.vite?.resolve?.dedupe ?? []), 'react', 'react-dom'])],
			alias: Array.isArray(configuredAliases) ? [...stylingAliases, ...configuredAliases] : { ...Object.fromEntries(stylingAliases.map(toStylingAliasEntry)), ...configuredAliases },
		},
	},
	integrations: docsConfig.integrations ?? [],
};
