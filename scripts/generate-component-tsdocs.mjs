/**
 * scripts/generate-component-tsdocs.mjs
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import ts from "typescript";
import { join, relative, resolve, sep } from "node:path";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const root = resolve(import.meta.dirname, "..");
const sourceDir = join(root, "src/components/ui");
const sourceAliases = {
  "data-table": join(root, "src/components/data-table.tsx"),
  "docs-toolbar-frame": join(root, "src/components/docs/toolbar-frame.tsx"),
  field: join(root, "src/components/field.tsx"),
  "mapped-form-fields": join(root, "src/components/forms.tsx"),
  toaster: join(sourceDir, "sonner.tsx"),
};
const nonComponents = new Set(["index", "sonner", "types", "variants"]);
const preferredExports = {
  alert: "AlertInfo",
  command: "Command",
  "data-table": "DataTable",
  field: "Field",
  "mapped-form-fields": "MappedFormFields",
  resizable: "ResizableGrip",
  sidebar: "SidebarProvider",
  tooltip: "TooltipProvider",
};
const outputFile = join(root, "dist/cache/component-tsdocs.ts");
const groupBySlug = new Map();
/** Adds every component slug to the group used by the generated reference site.
 *
 * @param group - Human-readable reference group label.
 * @param slugs - Component slugs assigned to that group.
 */
function addGroup(group, slugs) {
  for (const slug of slugs) groupBySlug.set(slug, group);
}
addGroup("Actions and forms", [
  "button",
  "button-group",
  "checkbox",
  "combobox",
  "form-select",
  "form",
  "input",
  "input-otp",
  "label",
  "password-input",
  "radio-group",
  "select",
  "slider",
  "switch",
  "textarea",
  "toggle",
  "toggle-group",
]);
addGroup("Content and feedback", [
  "alert",
  "avatar",
  "badge",
  "bubble",
  "card",
  "empty",
  "hint",
  "message",
  "message-scroller",
  "progress",
  "skeleton",
  "spinner",
  "table",
]);
addGroup("Menus and overlays", [
  "alert-dialog",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "popover",
  "sheet",
  "toaster",
  "tooltip",
]);
addGroup("Navigation and layout", [
  "accordion",
  "calendar",
  "carousel",
  "collapsible",
  "pagination",
  "portal-container",
  "resizable",
  "scroll-area",
  "separator",
  "sidebar",
  "tabs",
]);
addGroup("Data and composition", [
  "data-table",
  "docs-toolbar-frame",
  "field",
  "mapped-form-fields",
]);
const sourceFiles = [];
for (const name of await readdir(sourceDir)) {
  if (!name.endsWith(".tsx") || nonComponents.has(name.slice(0, -4))) continue;
  const fileSlug = name.slice(0, -4);
  const slug = fileSlug === "sonner" ? "toaster" : fileSlug;
  sourceFiles.push({
    slug,
    sourcePath: sourceAliases[slug] ?? join(sourceDir, name),
  });
}
const discoveredSlugs = new Set();
for (const entry of sourceFiles) discoveredSlugs.add(entry.slug);
const extraFiles = [];
for (const [slug, sourcePath] of Object.entries(sourceAliases)) {
  if (!discoveredSlugs.has(slug)) extraFiles.push({ slug, sourcePath });
}
const entries = [...sourceFiles, ...extraFiles];
/** Orders generated reference entries alphabetically by their stable slug.
 *
 * @param left - First component entry to compare.
 * @param right - Second component entry to compare.
 *
 * @return Negative, zero, or positive according to alphabetical order.
 */
function compEntries(left, right) {
  return left.slug.localeCompare(right.slug);
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
  if (!parts) return "";
  let text = "";
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
  /** Capitalizes the first character of a hyphen-separated title word. */
  function capitalizeWord(word) {
    return word[0].toUpperCase() + word.slice(1);
  }
  return slug.split("-").map(capitalizeWord).join(" ");
}

/**
 * Reads a public export's type signature and JSDoc metadata.
 *
 * @param exported - Export symbol being documented.
 * @param checker - TypeScript type checker for the source program.
 * @param source - Source file that owns the export.
 *
 * @return A serializable TypeScript reference entry.
 */
function describeExport(exported, checker, source) {
  const symbol =
    exported.flags & ts.SymbolFlags.Alias
      ? checker.getAliasedSymbol(exported)
      : exported;
  const declaration =
    symbol.valueDeclaration ?? symbol.declarations?.[0] ?? source;
  const type = checker.getTypeOfSymbolAtLocation(exported, declaration);
  const signatures = type.getCallSignatures();
  /** Formats a call signature without truncating its public type. */
  function fmtSignature(signature) {
    return checker.signatureToString(
      signature,
      declaration,
      ts.TypeFormatFlags.NoTruncation,
    );
  }
  /** Converts a compiler tag into plain text for the reference cache. */
  function serializeTag(tag) {
    return { name: tag.name, text: displayParts(tag.text) };
  }
  const signature = signatures.length
    ? signatures.map(fmtSignature).join("\n")
    : checker.typeToString(type, declaration, ts.TypeFormatFlags.NoTruncation);
  return {
    name: exported.getName(),
    signature,
    summary:
      displayParts(exported.getDocumentationComment(checker)) ||
      displayParts(symbol.getDocumentationComment(checker)),
    tags: exported.getJsDocTags(checker).map(serializeTag),
  };
}

/*//////////////////////////////////////////////////
COLLECT TYPE DOCUMENTATION
//////////////////////////////////////////////////*/

const compilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.NodeNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
  noEmit: true,
};
const entrySourceFiles = [];
for (const entry of entries) entrySourceFiles.push(entry.sourcePath);
const program = ts.createProgram(entrySourceFiles, compilerOptions);
const checker = program.getTypeChecker();
const cache = {};
/** Selects component entrypoints whose exported type can be rendered as React content.
 *
 * @param member - Serialized metadata for a module export.
 *
 * @return Whether the export signature describes a React component value.
 */
function isComponentExport(member) {
  return /(?:React\.)?(?:JSX\.Element|ReactElement)|React\.ReactNode/.test(
    member.signature,
  );
}
/** Removes surrounding whitespace from one extracted source-summary line.
 *
 * @param line - Source line from the component file header.
 *
 * @return The trimmed line.
 */
function trimLine(line) {
  return line.trim();
}
/** Keeps a nonempty source-summary line that is not a file path.
 *
 * @param line - Trimmed candidate source summary line.
 *
 * @return Whether the line can describe the component family.
 */
function isSummaryLine(line) {
  return Boolean(line) && !line.startsWith("src/");
}
for (const { slug, sourcePath } of entries) {
  const source = program.getSourceFile(sourcePath);
  if (!source) continue;
  const moduleSymbol = checker.getSymbolAtLocation(source);
  const exports = moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : [];
  const members = [];
  for (const exported of exports) {
    members.push(describeExport(exported, checker, source));
  }
  const componentExport = members.find(isComponentExport);
  const sourceText = await readFile(sourcePath, "utf8");
  const fileSummary =
    sourceText
      .match(/\/\*\*([\s\S]*?)\*\//)?.[1]
      ?.replace(/^\s*\* ?/gm, "")
      .split("\n")
      .map(trimLine)
      .find(isSummaryLine) ?? "";
  const description =
    componentExport?.summary ||
    fileSummary ||
    `${titleFromSlug(slug)} component family.`;
  const shadcnUrl =
    /https:\/\/ui\.shadcn\.com\/docs\/components(?:\/[^\s*]+)?/i.exec(
      sourceText,
    )?.[0];
  const group = groupBySlug.get(slug) ?? "Components";
  cache[slug] = {
    title: titleFromSlug(slug),
    description,
    group,
    source: relative(root, sourcePath).split(sep).join("/"),
    demoExport: preferredExports[slug] ?? componentExport?.name,
    ...(shadcnUrl ? { shadcnUrl } : {}),
    members,
  };
}
await mkdir(join(root, "dist/cache"), { recursive: true });
await writeFile(
  outputFile,
  `export const componentTsDocs = ${JSON.stringify(cache, null, 2)} as const;\n`,
);
console.log(
  `Generated TypeScript references for ${Object.keys(cache).length} components.`,
);
