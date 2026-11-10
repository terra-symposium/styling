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
const groupBySlug = new Map([
  ...[
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
  ].map((s) => [s, "Actions and forms"]),
  ...[
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
  ].map((s) => [s, "Content and feedback"]),
  ...[
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
  ].map((s) => [s, "Menus and overlays"]),
  ...[
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
  ].map((s) => [s, "Navigation and layout"]),
  ...["data-table", "docs-toolbar-frame", "field", "mapped-form-fields"].map(
    (s) => [s, "Data and composition"],
  ),
]);
const sourceFiles = (await readdir(sourceDir))
  .filter((n) => n.endsWith(".tsx") && !nonComponents.has(n.slice(0, -4)))
  .map((n) => {
    const fileSlug = n.slice(0, -4);
    const slug = fileSlug === "sonner" ? "toaster" : fileSlug;
    return { slug, sourcePath: sourceAliases[slug] ?? join(sourceDir, n) };
  });
const extraFiles = Object.entries(sourceAliases)
  .filter(([s]) => !sourceFiles.some((e) => e.slug === s))
  .map(([s, v]) => ({ slug: s, sourcePath: v }));
const entries = [...sourceFiles, ...extraFiles].sort((a, b) =>
  a.slug.localeCompare(b.slug),
);

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
  return (
    parts
      ?.map((p) => p.text)
      .join("")
      .trim() ?? ""
  );
}

/**
 * Converts a component slug into its display title.
 *
 * @param slug - Hyphen-separated component identifier.
 *
 * @return A title-cased component name.
 */
function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join(" ");
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
  const signature = signatures.length
    ? signatures
        .map((i) =>
          checker.signatureToString(
            i,
            declaration,
            ts.TypeFormatFlags.NoTruncation,
          ),
        )
        .join("\n")
    : checker.typeToString(type, declaration, ts.TypeFormatFlags.NoTruncation);
  return {
    name: exported.getName(),
    signature,
    summary:
      displayParts(exported.getDocumentationComment(checker)) ||
      displayParts(symbol.getDocumentationComment(checker)),
    tags: exported
      .getJsDocTags(checker)
      .map((t) => ({ name: t.name, text: displayParts(t.text) })),
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
const program = ts.createProgram(
  entries.map((e) => e.sourcePath),
  compilerOptions,
);
const checker = program.getTypeChecker();
const cache = {};
for (const { slug, sourcePath } of entries) {
  const source = program.getSourceFile(sourcePath);
  if (!source) continue;
  const moduleSymbol = checker.getSymbolAtLocation(source);
  const exports = moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : [];
  const members = exports.map((e) => describeExport(e, checker, source));
  const componentExport = members.find((m) =>
    /(?:React\.)?(?:JSX\.Element|ReactElement)|React\.ReactNode/.test(
      m.signature,
    ),
  );
  const sourceText = await readFile(sourcePath, "utf8");
  const fileSummary =
    sourceText
      .match(/\/\*\*([\s\S]*?)\*\//)?.[1]
      ?.replace(/^\s*\* ?/gm, "")
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("src/")) ?? "";
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
