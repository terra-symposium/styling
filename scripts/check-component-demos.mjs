import ts from 'typescript';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const G_REGEX = () => /^['"]|['"]$/g;

const root = resolve(import.meta.dirname, '..');
const gen = await readFile(resolve(root, 'dist/cache/component-tsdocs.ts'), 'utf8');
const match = /export const componentTsDocs = ([\s\S]*) as unknown as ComponentDocs;\s*$/.exec(gen);
if (!match) throw new Error('Missing generated component documentation');
const docs = JSON.parse(match[1]);
const publicIndex = resolve(root, 'src/components/ui/index.ts');
const program = ts.createProgram([publicIndex], {
	target: ts.ScriptTarget.ES2022,
	module: ts.ModuleKind.NodeNext,
	moduleResolution: ts.ModuleResolutionKind.NodeNext,
	jsx: ts.JsxEmit.ReactJSX,
	skipLibCheck: true,
});
const checker = program.getTypeChecker();
const indexSymbol = checker.getSymbolAtLocation(program.getSourceFile(publicIndex));
const publicExports = new Set(indexSymbol ? checker.getExportsOfModule(indexSymbol).map(symbol => symbol.getName()) : []);
const unavailable = Object.entries(docs)
	.filter(([, entry]) => !publicExports.has(entry.demoExport))
	.map(([slug]) => slug);
if (unavailable.length) throw new Error(`Component demo entrypoints missing from the public UI package: ${unavailable.join(', ')}`);
const groups = new Set(['Actions and forms', 'Content and feedback', 'Menus and overlays', 'Navigation and layout', 'Data and composition']);
const ungrouped = Object.entries(docs)
	.filter(([, entry]) => !groups.has(entry.group))
	.map(([slug]) => slug);
if (ungrouped.length) throw new Error(`Components missing from the catalog: ${ungrouped.join(', ')}`);
const src = await readFile(resolve(root, 'docs/styling/1-colouring/_component-demos.tsx'), 'utf8');
const file = ts.createSourceFile('component-demos.tsx', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const names = new Set();
function visit(node) {
	if (
		ts.isVariableDeclaration(node) &&
		node.name.getText(file) === 'DEMO_REGISTRY' &&
		node.initializer &&
		ts.isSatisfiesExpression(node.initializer) &&
		ts.isObjectLiteralExpression(node.initializer.expression)
	) {
		for (const prop of node.initializer.expression.properties) if (ts.isPropertyAssignment(prop)) names.add(prop.name.getText(file).replace(G_REGEX(), ''));
	}
	ts.forEachChild(node, visit);
}
visit(file);
const missing = Object.keys(docs).filter(slug => !names.has(slug));
const stale = [...names].filter(slug => !docs[slug]);
const demoDir = resolve(root, 'docs/styling/1-colouring/demos');
const orphan = (await readdir(demoDir)).filter(name => name.endsWith('.tsx') && !names.has(name.slice(0, -4)));
if (missing.length || stale.length || orphan.length)
	throw new Error(`Demo coverage mismatch: missing ${missing.join(', ') || 'none'}; stale ${stale.join(', ') || 'none'}; orphan ${orphan.join(', ') || 'none'}`);
for (const slug of names) {
	const demo = await readFile(resolve(demoDir, `${slug}.tsx`), 'utf8');
	if (!demo.includes('export default')) throw new Error(`Incomplete ${slug} demo module`);
	const demoFile = ts.createSourceFile(`${slug}.tsx`, demo, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
	let code;
	function findCode(node) {
		if (ts.isVariableDeclaration(node) && node.name.getText(demoFile) === 'exampleCode' && node.initializer && ts.isStringLiteral(node.initializer)) code = node.initializer.text;
		ts.forEachChild(node, findCode);
	}
	findCode(demoFile);
	if (!code) throw new Error(`Missing copyable code for ${slug}`);
	const example = ts.createSourceFile(`${slug}-example.tsx`, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
	if (example.parseDiagnostics.length) throw new Error(`Invalid code example for ${slug}: ${example.parseDiagnostics[0].messageText}`);
	for (const statement of example.statements) {
		if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier) || statement.moduleSpecifier.text !== '@terra-symposium/styling/ui') continue;
		const bindings = statement.importClause?.namedBindings;
		if (!bindings || !ts.isNamedImports(bindings)) continue;
		const unavailableImports = bindings.elements.map(binding => binding.propertyName?.text ?? binding.name.text).filter(name => !publicExports.has(name));
		if (unavailableImports.length) throw new Error(`${slug} example imports unavailable UI exports: ${unavailableImports.join(', ')}`);
	}
}
const notes = await readFile(resolve(demoDir, 'notes.ts'), 'utf8');
const notesFile = ts.createSourceFile('notes.ts', notes, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const noteNames = new Set();
function visitNotes(node) {
	if (
		ts.isVariableDeclaration(node) &&
		node.name.getText(notesFile) === 'componentNotes' &&
		node.initializer &&
		ts.isAsExpression(node.initializer) &&
		ts.isObjectLiteralExpression(node.initializer.expression)
	) {
		for (const prop of node.initializer.expression.properties) if (ts.isPropertyAssignment(prop)) noteNames.add(prop.name.getText(notesFile).replace(G_REGEX(), ''));
	}
	ts.forEachChild(node, visitNotes);
}
visitNotes(notesFile);
const missingNotes = [...names].filter(slug => !noteNames.has(slug));
if (missingNotes.length) throw new Error(`Missing usage notes: ${missingNotes.join(', ')}`);
console.log(`Verified authored demos and code examples for ${names.size} generated components.`);
