const { readFile, writeFile } = require("node:fs/promises");
const postcss = require("postcss");
const nesting = require("tailwindcss/nesting");

async function main() {
  const source = "src/styles/effects.css";
  const input = await readFile(source, "utf8");
  const output = await postcss([nesting()]).process(input, { from: source });
  await writeFile("dist/effects.css", output.css);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
