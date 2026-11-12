/**
 * scripts/compile-effects.cjs
 */

const { readFile, writeFile } = require("node:fs/promises");
const postcss = require("postcss");
const nesting = require("tailwindcss/nesting");
/** Compiles the shared effects stylesheet through Tailwind's CSS nesting plugin. */
async function main() {
  const source = "src/styles/effects.css";
  const input = await readFile(source, "utf8");
  const output = await postcss([nesting()]).process(input, { from: source });
  await writeFile("dist/effects.css", output.css);
}
/** Reports a CSS compilation failure and leaves a failing process status.
 *
 * @param err Error thrown during CSS compilation.
 */
function handleFailure(err) {
  console.error(err);
  process.exitCode = 1;
}
main().catch(handleFailure);
