/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import ts from "typescript";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/
const root = resolve(import.meta.dirname, "..");
const docsDir = join(root, "docs/styling/components");
const sourceDir = join(root, "src/components/ui");
const sourceAliases = {
  "data-table": join(root, "src/components/data-table.tsx"),
  "docs-toolbar-frame": join(root, "src/components/docs/toolbar-frame.tsx"),
  field: join(root, "src/components/field.tsx"),
  "mapped-form-fields": join(root, "src/components/forms.tsx"),
  toaster: join(sourceDir, "sonner.tsx"),
};
const outputFile = join(root, ".terra-docs/cache/component-tsdocs.ts");
const pages = (await readdir(docsDir)).filter((name) => name.endsWith(".mdx"));
const entries = [];

/*//////////////////////////////////////////////////
DISCOVER COMPONENTS
//////////////////////////////////////////////////*/
for (const page of pages) {
  const component = page.slice(0, -".mdx".length);
  const sourcePath =
    sourceAliases[component] ?? join(sourceDir, `${component}.tsx`);
  try {
    await readFile(sourcePath);
    entries.push({ component, sourcePath });
  } catch {
    // A few Styling docs describe composed examples rather than UI source files.
  }
}

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
  entries.map((entry) => entry.sourcePath),
  compilerOptions,
);
const checker = program.getTypeChecker();
const cache = {};

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/
/**
 * Joins TypeScript documentation parts into readable text.
 *
 * @param parts - Documentation parts returned by the TypeScript compiler.
 * @returns The trimmed concatenated text, or an empty string when no parts exist.
 */
function displayParts(parts) {
  return (
    parts
      ?.map((part) => part.text)
      .join("")
      .trim() ?? ""
  );
}

/**
 * Reads the textual content of a TypeScript documentation tag.
 *
 * @param tag - A JSDoc tag returned by the TypeScript checker.
 * @returns The tag description as trimmed text.
 */
function tagText(tag) {
  return displayParts(tag.text);
}

/*//////////////////////////////////////////////////
COLLECT AND WRITE DOCUMENTATION
//////////////////////////////////////////////////*/
for (const { component, sourcePath } of entries) {
  const source = program.getSourceFile(sourcePath);
  if (!source) continue;
  const moduleSymbol = checker.getSymbolAtLocation(source);
  const exports = moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : [];
  const members = exports.map((exported) => {
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
      : checker.typeToString(
          type,
          declaration,
          ts.TypeFormatFlags.NoTruncation,
        );
    return {
      name: exported.getName(),
      signature,
      summary:
        displayParts(exported.getDocumentationComment(checker)) ||
        displayParts(symbol.getDocumentationComment(checker)),
      tags: exported
        .getJsDocTags(checker)
        .map((tag) => ({ name: tag.name, text: tagText(tag) })),
    };
  });
  const sourceText = await readFile(sourcePath, "utf8");
  const shadcnUrl =
    /https:\/\/ui\.shadcn\.com\/docs\/components(?:\/[^\s*]+)?/i.exec(
      sourceText,
    )?.[0];
  cache[component] = {
    source: relative(root, sourcePath).split(sep).join("/"),
    ...(shadcnUrl ? { shadcnUrl } : {}),
    members,
  };
}

await mkdir(dirname(outputFile), { recursive: true });
await writeFile(
  outputFile,
  `export const componentTsDocs = ${JSON.stringify(cache, null, 2)} as const;\n`,
);
console.log(
  `Cached TypeScript docs for ${Object.keys(cache).length} Styling components.`,
);
