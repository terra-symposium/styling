import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import postcss from "postcss";

const repo = process.cwd();
const source = (path: string): string => readFileSync(join(repo, path), "utf8");

test("one global stylesheet provides the shared base, components, utilities, and dynamic hue tokens", () => {
  const stylesheet = source("src/styles/global.css");
  const base = stylesheet.indexOf("@tailwind base;");
  const components = stylesheet.indexOf("@tailwind components;");
  const utilities = stylesheet.indexOf("@tailwind utilities;");

  assert.ok(base >= 0 && base < components && components < utilities);
  assert.match(stylesheet, /font-family:\s*["']Authentic Sans["']/);
  assert.match(stylesheet, /font-family:\s*["']Avara["']/);
  assert.match(stylesheet, /svg\[style\*=["']--icon-baseline["']\]/);
  assert.match(stylesheet, /\[contenteditable\][\s\S]*?:focus-visible/);
  assert.match(stylesheet, /@keyframes docs-toolbar-sweep/);
  assert.match(
    stylesheet,
    /body\s*\{\s*-webkit-font-smoothing:\s*antialiased;/,
  );
  assert.match(stylesheet, /:where\(\.terra-docs-workspace\)/);
  assert.doesNotMatch(stylesheet, /terra-styling|--primary-\d+\s*:/);
  assert.doesNotMatch(stylesheet, /\.grain|\.animate-crt|@keyframes shake/);
  assert.match(source("src/styles/effects.css"), /\.grain/);
  assert.match(source("config/tailwind.global.config.mjs"), /preflight:\s*true/);
  assert.match(
    source("package.json"),
    /"\.\/global\.css":\s*"\.\/dist\/global\.css"/,
  );
  assert.match(
    source("package.json"),
    /"\.\/ui\.css":\s*"\.\/dist\/global\.css"/,
  );
  assert.match(
    source("package.json"),
    /"\.\/effects\.css":\s*"\.\/dist\/effects\.css"/,
  );
});

test("published stylesheets are browser-ready and contain no nested selectors", () => {
  for (const file of ["dist/global.css", "dist/effects.css"]) {
    const css = source(file);
    assert.doesNotMatch(
      css,
      /@import\s|@tailwind\s/,
      `${file} must be browser-ready`,
    );
    const nestedSelectors: string[] = [];
    postcss.parse(css, { from: file }).walkRules((rule) => {
      if (/(^|[^\\])&/.test(rule.selector)) nestedSelectors.push(rule.selector);
    });
    assert.deepEqual(
      nestedSelectors,
      [],
      `${file} must not leak CSS nesting syntax`,
    );
  }
  assert.match(
    source("dist/global.css"),
    /-webkit-font-smoothing:\s*antialiased/,
  );
  assert.match(source("dist/effects.css"), /\.grain/);
});
