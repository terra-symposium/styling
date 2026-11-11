import { existsSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const docsPnpmDir = resolve(projectRoot, "config/node_modules/.pnpm");
const docsFolder = readdirSync(docsPnpmDir).find((name) => name.startsWith("@terra-symposium+docs@"));
if (!docsFolder) throw new Error("@terra-symposium/docs was not found in config/node_modules/.pnpm.");
const docsRoot = resolve(docsPnpmDir, docsFolder, "node_modules/@terra-symposium/docs");
const localDocsCatalog = resolve(projectRoot, "../docs/site/src/lib/catalog.ts");
const docsCatalog = existsSync(localDocsCatalog)
  ? localDocsCatalog
  : resolve(docsRoot, "site/src/lib/catalog.ts");
const docsRequire = createRequire(resolve(docsRoot, "package.json"));
const astroRoot = resolve(docsRequire.resolve("astro/package.json"), "..");
const docsConfigUrl = pathToFileURL(resolve(docsRoot, "site/config/astro.config.mjs"));
const { default: docsConfig } = await import(/* @vite-ignore */ docsConfigUrl.href);
const configuredAliases = docsConfig.vite?.resolve?.alias ?? [];
const stylingAliases = [
  { find: "@terra-symposium/docs-site-catalog", replacement: docsCatalog },
  { find: "@terra-symposium/docs-site-catchall", replacement: resolve(docsRoot, "site/src/pages/[...slug].astro") },
  { find: "@terra-symposium/docs-site-not-found", replacement: resolve(docsRoot, "src/components/NotFound.astro") },
  { find: "@terra-symposium/docs-site-style", replacement: resolve(docsRoot, "dist/lib/style.css") },
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
        : { ...configuredAliases, ...Object.fromEntries(stylingAliases.map(({ find, replacement }) => [find, replacement])) },
    },
  },
  integrations: docsConfig.integrations ?? [],
};
