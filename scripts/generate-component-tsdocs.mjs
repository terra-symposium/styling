/**
 * scripts/generate-component-tsdocs.mjs
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import ts from 'typescript';
import { join, relative, resolve, sep } from 'node:path';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const root = resolve(import.meta.dirname, '..');
const srcDir = join(root, 'src/components/ui');
const srcAliases = {
	'data-table': join(root, 'src/components/data-table.tsx'),
	'docs-toolbar-frame': join(root, 'src/components/docs/toolbar-frame.tsx'),
	field: join(root, 'src/components/field.tsx'),
	'mapped-form-fields': join(root, 'src/components/forms.tsx'),
	toaster: join(srcDir, 'sonner.tsx'),
};
const nonComps = new Set(['index', 'sonner', 'types', 'variants']);
const preferredExports = {
	alert: 'AlertInfo',
	command: 'Command',
	'data-table': 'DataTable',
	field: 'Field',
	'mapped-form-fields': 'MappedFormFields',
	resizable: 'ResizableGrip',
	sidebar: 'SidebarProvider',
	tooltip: 'TooltipProvider',
};
const groupBySlug = new Map();
/** Adds every component slug to the group used by the generated reference site.
 *
 * @param group - Human-readable reference group label.
 * @param slugs - Component slugs assigned to that group.
 */
function addGroup(group, slugs) {
	for (const slug of slugs) groupBySlug.set(slug, group);
}
addGroup('Actions and forms', [
	'button',
	'button-group',
	'checkbox',
	'combobox',
	'form-select',
	'form',
	'input',
	'input-otp',
	'label',
	'password-input',
	'radio-group',
	'select',
	'slider',
	'switch',
	'textarea',
	'toggle',
	'toggle-group',
]);
addGroup('Content and feedback', ['alert', 'avatar', 'badge', 'bubble', 'card', 'empty', 'hint', 'marquee', 'message', 'message-scroller', 'progress', 'skeleton', 'spinner', 'table']);
addGroup('Menus and overlays', ['alert-dialog', 'command', 'context-menu', 'dialog', 'drawer', 'dropdown-menu', 'popover', 'sheet', 'toaster', 'tooltip']);
addGroup('Navigation and layout', ['accordion', 'calendar', 'carousel', 'collapsible', 'pagination', 'portal-container', 'resizable', 'scroll-area', 'separator', 'sidebar', 'tabs']);
addGroup('Data and composition', ['data-table', 'docs-toolbar-frame', 'field', 'mapped-form-fields']);
const srcFiles = [];
for (const srcFileName of await readdir(srcDir)) {
	if (!srcFileName.endsWith('.tsx') || nonComps.has(srcFileName.slice(0, -4))) continue;
	const fileSlug = srcFileName.slice(0, -4);
	const slug = fileSlug === 'sonner' ? 'toaster' : fileSlug;
	srcFiles.push({ slug, sourcePath: srcAliases[slug] ?? join(srcDir, srcFileName) });
}
const discoveredSlugs = new Set();
for (const entry of srcFiles) discoveredSlugs.add(entry.slug);
const extraFiles = [];
for (const [slug, sourcePath] of Object.entries(srcAliases)) {
	if (!discoveredSlugs.has(slug)) extraFiles.push({ slug, sourcePath });
}
const entries = [...srcFiles, ...extraFiles];
/** Orders generated reference entries alphabetically by their stable slug.
 *
 * @param f - First component entry to compare.
 * @param s - Second component entry to compare.
 *
 * @return Negative, zero, or positive according to alphabetical order.
 */
function compEntries(f, s) {
	return f.slug.localeCompare(s.slug);
}
entries.sort(compEntries);

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Joins TypeScript documentation parts into readable text.
 *
 * @param parts - Documentation parts returned by the TypeScript checker.
 *
 * @return The trimmed concatenated text, or an empty string when no parts exist.
 */
function displayParts(parts) {
	if (!parts) return '';
	let text = '';
	for (const part of parts) text += part.text;
	return text.trim();
}

/**
 * Converts a component slug into its display title.
 *
 * @param slug - Hyphen-separated component identifier.
 *
 * @return A title-cased component name.
 */
function titleFromSlug(slug) {
	/**
	 * Capitalizes the first character of one title word.
	 *
	 * @param h - Hyphen-separated slug segment to format.
	 * @return The segment with its first character uppercased.
	 */
	function capitalizeWord(h) {
		return h[0].toUpperCase() + h.slice(1);
	}
	return slug.split('-').map(capitalizeWord).join(' ');
}

/**
 * Reads a public export's type signature and JSDoc metadata.
 *
 * @param exported - Export symbol being documented.
 * @param checker - TypeScript type checker for the source program.
 * @param src - Source file that owns the export.
 *
 * @return A serializable TypeScript reference entry.
 */
function describeExport(exported, checker, src) {
	const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
	const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0] ?? src;
	const type = checker.getTypeOfSymbolAtLocation(exported, declaration);
	const signatures = type.getCallSignatures();
	const firstParam = signatures[0]?.getParameters()[0];
	const propsType = firstParam ? checker.getTypeOfSymbolAtLocation(firstParam, declaration) : undefined;
	const props = [];
	let defaultOwner = declaration;
	if (ts.isVariableDeclaration(declaration) && declaration.initializer && ts.isCallExpression(declaration.initializer)) {
		const renderer = declaration.initializer.arguments[0];
		if (renderer && ts.isIdentifier(renderer)) {
			const fnDeclaration = src.statements.find(statement => ts.isFunctionDeclaration(statement) && statement.name?.text === renderer.text);
			if (fnDeclaration) defaultOwner = fnDeclaration;
		}
	}
	const ownerDefaults = literalDefaults(defaultOwner);
	if (propsType) {
		const usefulInherited = new Set(['disabled', 'type', 'name', 'placeholder', 'required', 'readOnly', 'value', 'defaultValue', 'min', 'max', 'step', 'aria-label']);
		for (const prop of checker.getPropertiesOfType(propsType)) {
			const propDeclaration = prop.valueDeclaration ?? prop.declarations?.[0] ?? declaration;
			if (!propDeclaration.getSourceFile().fileName.startsWith(join(root, 'src') + sep) && !usefulInherited.has(prop.getName())) continue;
			const propType = checker.getTypeOfSymbolAtLocation(prop, propDeclaration);
			// hygiene-ignore single-use -- Keep the typeText serialization stage materialized once before assembling the generated component reference cache.
			const typeText = checker.typeToString(propType, propDeclaration, ts.TypeFormatFlags.NoTruncation);
			const choiceTypes = propType.isUnion() ? propType.types.filter(item => !(item.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null))) : [propType];
			// hygiene-ignore single-use -- Keep the choices serialization stage materialized once before assembling the generated component reference cache.
			const choices = choiceTypes.length <= 40 && choiceTypes.every(item => item.isStringLiteral()) ? choiceTypes.map(item => item.value) : [];
			const defaultValue = ownerDefaults.get(prop.getName());
			props.push({
				name: prop.getName(),
				type: typeText,
				description: displayParts(prop.getDocumentationComment(checker)),
				optional: Boolean(prop.flags & ts.SymbolFlags.Optional),
				...(defaultValue ? { defaultValue } : {}),
				choices,
			});
		}
	}
	/**
	 * Formats a TypeScript call signature without truncating its public type.
	 *
	 * @param d - Call signature returned by the TypeScript checker.
	 * @return The complete signature text using TypeScript's display format.
	 */
	function fmtSignature(d) {
		return checker.signatureToString(d, declaration, ts.TypeFormatFlags.NoTruncation);
	}
	/**
	 * Converts a compiler documentation tag into plain text for the reference cache.
	 *
	 * @param c - JSDoc tag returned by the TypeScript checker.
	 * @return A cache record containing the tag name and flattened text.
	 */
	function serializeTag(c) {
		return { name: c.name, text: displayParts(c.text) };
	}
	return {
		name: exported.getName(),
		signature: signatures.length ? signatures.map(fmtSignature).join('\n') : checker.typeToString(type, declaration, ts.TypeFormatFlags.NoTruncation),
		summary: displayParts(exported.getDocumentationComment(checker)) || displayParts(symbol.getDocumentationComment(checker)),
		tags: exported.getJsDocTags(checker).map(serializeTag),
		props,
	};
}

// hygiene-ignore single-use -- Keep this named recursive AST visitor so TypeScript can recurse through child nodes without changing traversal boundaries.
/**
 * Conservatively records literal defaults shared by every destructure of a name in one source file.
 *
 * @param src TypeScript source file to inspect.
 * @returns A map of names to defaults shared by every destructure.
 */
function literalDefaults(src) {
	const values = new Map();
	function visit(node) {
		if (ts.isBindingElement(node) && ts.isIdentifier(node.name) && node.initializer) {
			const init = node.initializer;
			if (ts.isStringLiteral(init) || ts.isNumericLiteral(init) || init.kind === ts.SyntaxKind.TrueKeyword || init.kind === ts.SyntaxKind.FalseKeyword || init.kind === ts.SyntaxKind.NullKeyword) {
				const name = node.name.text;
				const found = values.get(name) ?? new Set();
				found.add(init.getText());
				values.set(name, found);
			}
		}
		ts.forEachChild(node, visit);
	}
	visit(src);
	return new Map([...values].filter(([, found]) => found.size === 1).map(([name, found]) => [name, [...found][0]]));
}

/*//////////////////////////////////////////////////
COLLECT TYPE DOCUMENTATION
//////////////////////////////////////////////////*/

const entrySrcFiles = [];
for (const entry of entries) entrySrcFiles.push(entry.sourcePath);
const program = ts.createProgram(entrySrcFiles, {
	target: ts.ScriptTarget.ES2022,
	module: ts.ModuleKind.NodeNext,
	moduleResolution: ts.ModuleResolutionKind.NodeNext,
	jsx: ts.JsxEmit.ReactJSX,
	strict: true,
	skipLibCheck: true,
	noEmit: true,
});
const checker = program.getTypeChecker();
const cache = {};
/** Selects component entrypoints whose exported type can be rendered as React content.
 *
 * @param c - Serialized metadata for a module export.
 *
 * @return Whether the export signature describes a React component value.
 */
function isCompExport(c) {
	return /(?:React\.)?(?:JSX\.Element|ReactElement)|React\.ReactNode/.test(c.signature);
}
/** Removes surrounding whitespace from one extracted source-summary line.
 *
 * @param c - Source line from the component file header.
 *
 * @return The trimmed line.
 */
function trimLine(c) {
	return c.trim();
}
/** Keeps a nonempty source-summary line that is not a file path.
 *
 * @param c - Trimmed candidate source summary line.
 *
 * @return Whether the line can describe the component family.
 */
function isSummaryLine(c) {
	return Boolean(c) && !c.startsWith('src/') && !c.startsWith('@') && !/^https?:\/\//.test(c);
}
for (const { slug, sourcePath } of entries) {
	const src = program.getSourceFile(sourcePath);
	if (!src) continue;
	const moduleSymbol = checker.getSymbolAtLocation(src);
	const exports = moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : [];
	const members = [];
	for (const exported of exports) {
		members.push(describeExport(exported, checker, src));
	}
	const compExport = members.find(isCompExport);
	const srcText = await readFile(sourcePath, 'utf8');
	const shadcnUrl = /https:\/\/ui\.shadcn\.com\/docs\/components(?:\/[^\s*]+)?/i.exec(srcText)?.[0];
	// hygiene-ignore single-use -- Keep the srcSummary serialization stage materialized once before assembling the generated component reference cache.
	const srcSummary = [...srcText.matchAll(/\/\*\*([\s\S]*?)\*\//g)]
		.flatMap(comment => comment[1].replace(/^\s*\* ?/gm, '').split('\n'))
		.map(trimLine)
		.find(isSummaryLine);
	cache[slug] = {
		title: titleFromSlug(slug),
		description: compExport?.summary || srcSummary || `${titleFromSlug(slug)} component family.`,
		group: groupBySlug.get(slug) ?? 'Components',
		source: relative(root, sourcePath).split(sep).join('/'),
		demoExport: preferredExports[slug] ?? compExport?.name,
		...(shadcnUrl ? { shadcnUrl } : {}),
		members,
	};
}
await mkdir(join(root, 'dist/cache'), { recursive: true });
// hygiene-ignore single-use -- Keep the slugType serialization stage materialized once before assembling the generated component reference cache.
const slugType = Object.keys(cache)
	.map(slug => JSON.stringify(slug))
	.join(' | ');
// hygiene-ignore single-use -- Keep the cacheType serialization stage materialized once before assembling the generated component reference cache.
const cacheType = `type ComponentDocs = Record<${slugType}, { title: string; description: string; group: string; source: string; demoExport: string; shadcnUrl?: string; members: { name: string; signature: string; summary: string; tags: { name: string; text: string }[]; props: { name: string; type: string; description: string; optional: boolean; defaultValue?: string; choices: string[] }[] }[] }>;`;
await writeFile(join(root, 'dist/cache/component-tsdocs.ts'), `${cacheType}\nexport const componentTsDocs = ${JSON.stringify(cache, null, 2)} as unknown as ComponentDocs;\n`);
console.log(`Generated TypeScript references for ${Object.keys(cache).length} components.`);
