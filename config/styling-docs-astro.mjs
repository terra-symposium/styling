import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const docsPnpmDir = resolve(projectRoot, "config/node_modules/.pnpm");

/**
 * Identifies the installed pnpm directory for the shared Docs package.
 *
 * @param {string} name - Directory entry from the pnpm virtual store.
 * @return {boolean} Whether the entry contains a Terra Docs package version.
 */
function isDocsPackageFolder(name) {
  return name.startsWith("@terra-symposium+docs@");
}

/**
 * Converts a Vite alias record to the key-value pair accepted by Object.fromEntries.
 *
 * @param alias - Styling alias whose find pattern and replacement path become one Vite entry.
 * @return {[string, string]} Alias key and replacement path.
 */
function toStylingAliasEntry(alias) {
  return [alias.find, alias.replacement];
}

const docsFolder = readdirSync(docsPnpmDir).find(isDocsPackageFolder);
if (!docsFolder)
  throw new Error(
    "@terra-symposium/docs was not found in config/node_modules/.pnpm.",
  );
const docsRoot = resolve(
  docsPnpmDir,
  docsFolder,
  "node_modules/@terra-symposium/docs",
);
const localDocsCatalog = resolve(
  projectRoot,
  "../docs/site/src/lib/catalog.ts",
);
const docsCatalog = existsSync(localDocsCatalog)
  ? localDocsCatalog
  : resolve(docsRoot, "site/src/lib/catalog.ts");
const docsConfigUrl = pathToFileURL(
  resolve(docsRoot, "site/config/astro.config.mjs"),
);
const { default: docsConfig } = await import(
  /* @vite-ignore */ docsConfigUrl.href
);
const configuredAliases = docsConfig.vite?.resolve?.alias ?? [];
const stylingAliases = [
  { find: "@terra-symposium/docs-site-catalog", replacement: docsCatalog },
  {
    find: "@terra-symposium/docs-site-catchall",
    replacement: resolve(docsRoot, "site/src/pages/[...slug].astro"),
  },
  {
    find: "@terra-symposium/docs-site-not-found",
    replacement: resolve(docsRoot, "src/components/NotFound.astro"),
  },
  {
    find: "@terra-symposium/docs-site-style",
    replacement: resolve(docsRoot, "dist/lib/style.css"),
  },
];
export default {
  ...docsConfig,
  srcDir: resolve(projectRoot, "site/src"),
  vite: {
    ...docsConfig.vite,
    resolve: {
      ...docsConfig.vite?.resolve,
      alias: Array.isArray(configuredAliases)
        ? [...configuredAliases, ...stylingAliases]
        : {
            ...configuredAliases,
            ...Object.fromEntries(stylingAliases.map(toStylingAliasEntry)),
          },
    },
  },
  integrations: docsConfig.integrations ?? [],
};
