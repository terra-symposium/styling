/**
 * config/docs-env.d.ts
 * Vite module discovery used by the component documentation.
 */
/**
 * Supplies Vite's eager asset discovery and base URL to the documentation build.
 */
interface ImportMeta {
	readonly glob: <T>(pattern: string, options: { eager: true }) => Record<string, T>;
	readonly env: { readonly BASE_URL: string };
}
