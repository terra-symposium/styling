/** Vite module discovery used by the component documentation. */
interface ImportMeta {
	readonly glob: <T>(pattern: string, options: { eager: true }) => Record<string, T>;
	readonly env: { readonly BASE_URL: string };
}
