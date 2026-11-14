/**
 * scripts/compile-effects.cjs
 */

const { readFile, writeFile } = require('node:fs/promises');
const postcss = require('postcss');
const nesting = require('tailwindcss/nesting');
// terra-quality-ignore single-use -- Keep main as a named callback for useful error stacks. TSDoc: Compiles the shared effects stylesheet through Tailwind's CSS nesting plugin.
/** Compiles the shared effects stylesheet through Tailwind's CSS nesting plugin. */
async function main() {
	const source = 'src/styles/effects.css';
	// terra-quality-ignore single-use -- Finish reading CSS before constructing PostCSS plugins so filesystem and plugin effects keep their order.
	const input = await readFile(source, 'utf8');
	// terra-quality-ignore single-use -- Finish CSS processing before attempting the output write; moving await into writeFile changes error timing.
	const output = await postcss([nesting()]).process(input, { from: source });
	await writeFile('dist/effects.css', output.css);
}
// terra-quality-ignore single-use -- Keep handleFailure as a named callback for useful error stacks. TSDoc: Reports a CSS compilation failure and leaves a failing process status.
/** Reports a CSS compilation failure and leaves a failing process status.
 *
 * @param err Error thrown during CSS compilation.
 */
function handleFailure(err) {
	console.error(err);
	process.exitCode = 1;
}
main().catch(handleFailure);
