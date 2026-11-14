/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';

// TEST RUNNER
import test from 'node:test';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

// terra-quality-ignore single-use -- Capture the test repository root once at module load so later cwd changes cannot redirect stylesheet reads.
const repo = process.cwd();

/*//////////////////////////////////////////////////
TESTS
//////////////////////////////////////////////////*/

test.describe('published styling stylesheet contracts', stylesheetContracts);

// terra-quality-ignore single-use -- Keep stylesheetContracts as a named declaration so its authored TSDoc stays attached. TSDoc: Registers source stylesheet and generated CSS distribution checks.
/** Registers source stylesheet and generated CSS distribution checks. */
function stylesheetContracts(): void {
	// SOURCE STYLESHEET CONTRACT
	test('one global stylesheet provides the shared base, components, utilities, and dynamic hue tokens', sourceStylesheetProvidesSharedTokensAndExports);

	// GENERATED STYLESHEET CONTRACT
	test('published stylesheets are browser-ready and contain no nested selectors', publishedStylesheetsAreBrowserReady);
}

/** Reads a repository file relative to the test process root.
 *
 * @param path Repository-relative file path.
 *
 * @returns The file contents as UTF-8 text.
 */
function source(path: string): string {
	return readFileSync(join(repo, path), 'utf8');
}

// terra-quality-ignore single-use -- Keep sourceStylesheetProvidesSharedTokensAndExports as a named declaration so its authored TSDoc stays attached. TSDoc: Checks source ordering, shared tokens, and package stylesheet exports.
/** Checks source ordering, shared tokens, and package stylesheet exports. */
function sourceStylesheetProvidesSharedTokensAndExports(): void {
	const stylesheet = source('src/styles/global.css');
	const base = stylesheet.indexOf('@tailwind base;');
	const components = stylesheet.indexOf('@tailwind components;');

	assert.ok(base >= 0 && base < components && components < stylesheet.indexOf('@tailwind utilities;'));
	assert.match(stylesheet, /font-family:\s*["']Authentic Sans["']/);
	assert.match(stylesheet, /font-family:\s*["']Avara["']/);
	assert.match(stylesheet, /svg\[style\*=["']--icon-baseline["']\]/);
	assert.match(stylesheet, /\[contenteditable\][\s\S]*?:focus-visible/);
	assert.match(stylesheet, /@keyframes docs-toolbar-sweep/);
	assert.match(stylesheet, /body\s*\{\s*-webkit-font-smoothing:\s*antialiased;/);
	assert.match(stylesheet, /:where\(\.docs-workspace\)/);
	assert.doesNotMatch(stylesheet, /terra-styling|--primary-\d+\s*:/);
	assert.doesNotMatch(stylesheet, /\.grain|\.animate-crt|@keyframes shake/);
	assert.match(source('src/styles/effects.css'), /\.grain/);
	assert.match(source('config/tailwind.global.config.mjs'), /preflight:\s*true/);
	assert.match(source('package.json'), /"\.\/global\.css":\s*"\.\/dist\/global\.css"/);
	assert.match(source('package.json'), /"\.\/ui\.css":\s*"\.\/dist\/global\.css"/);
	assert.match(source('package.json'), /"\.\/effects\.css":\s*"\.\/dist\/effects\.css"/);
}

/** Finds nested CSS selectors at every rule and at-rule depth.
 *
 * @param container Parsed CSS container whose child rules are inspected.
 *
 * @returns Selectors that still contain nesting syntax.
 */
function findNestedSelectors(container: postcss.Container): string[] {
	const nestedSelectors: string[] = [];
	for (const node of container.nodes) {
		if (node.type === 'rule') {
			if (/(^|[^\\])&/.test(node.selector)) nestedSelectors.push(node.selector);
			nestedSelectors.push(...findNestedSelectors(node));
		}
		if (node.type === 'atrule' && node.nodes) nestedSelectors.push(...findNestedSelectors(node));
	}
	return nestedSelectors;
}

// terra-quality-ignore single-use -- Keep publishedStylesheetsAreBrowserReady as a named declaration so its authored TSDoc stays attached. TSDoc: Checks generated entries contain neither Tailwind directives nor residual nested rules before.
/**
 * Checks generated entries contain neither Tailwind directives nor residual
 * nested rules before browsers consume them.
 */
function publishedStylesheetsAreBrowserReady(): void {
	for (const file of ['dist/global.css', 'dist/effects.css']) {
		const css = source(file);
		assert.doesNotMatch(css, /@import\s|@tailwind\s/, `${file} must be browser-ready`);
		assert.deepEqual(findNestedSelectors(postcss.parse(css, { from: file })), [], `${file} must not leak CSS nesting syntax`);
	}
	assert.match(source('dist/global.css'), /-webkit-font-smoothing:\s*antialiased/);
	assert.match(source('dist/effects.css'), /\.grain/);
}
