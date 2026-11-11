# Terra document creation

`@terra-symposium/styling/documents` creates native, editable PowerPoint, Excel and Word files. Every build generates a fresh hue through Styling's palette system. Authentic Sans handles titles and reading text; Avara appears only in the small decorative wordmark. Templates work in Office, PowerPoint, Keynote and Pages and can also be created or edited from JavaScript or TypeScript.

## What it does

Not applicable.

## Prerequisites

Not applicable.

## Get started

Not applicable.

## Usage

### Create a presentation
```ts
import { createPresentationTemplate } from "@terra-symposium/styling/documents";

const deck = createPresentationTemplate({
  title: "Product direction",
  subtitle: "A short description of the audience and purpose.",
  saturation: "medium", // low | medium | high
  // hue: 220, // optional fixed hue; omitted selects a new random hue per file
  // brand: { hue: null }, // grayscale palette
});

await deck.writeFile({ fileName: "product-direction.pptx" });
```

The starter deck includes editable cover, section, content, table and closing slide masters. Titles align left, and the native table uses the same left-aligned headings, generous cell spacing and bottom-only row rules as Styling's UI table. In PowerPoint, use **Home → Layout** or **View → Slide Master** to reuse or edit them. The package also ships matching `.potx` files for **File → New from Template**. Set `saturation` to `low`, `medium` or `high` for progressively stronger primary and complementary secondary palettes; each new build chooses a fresh hue shared across the matching document set.

### Create a workbook or Word file
```ts
import {
  createSpreadsheetTemplate,
  writeWordTemplate,
} from "@terra-symposium/styling/documents";

const workbook = createSpreadsheetTemplate({ title: "Project plan" });
await workbook.xlsx.writeFile("project-plan.xlsx");

await writeWordTemplate("project-brief.docx", {
  title: "Project brief",
  subtitle: "Purpose, scope and next steps",
});
```

The workbook includes a formula-driven Overview and editable, validated Inputs sheet. The Word starter follows the structure of Terra's invoice: a restrained supplier masthead, left-aligned invoice title and metadata, a pale recipient panel, grouped line items, a clear total, and payment details. Its heading styles are reusable Word styles, and the sample fields are placeholders rather than customer or banking data. `terra-document-demo.docx` adds a second page with Heading 1–3, bulleted and numbered lists, a comparison table, and a detail table so the complete style system can be reviewed in Pages or Word.

### Override the brand
```ts
const deck = createPresentationTemplate({
  saturation: "low",
  brand: {
    logo: false,
    fonts: { display: "Authentic Sans", body: "Arial" },
  },
});
```

Omit `hue` for a new random hue in the same range used by the Terra website; use `hue: null` for grayscale or a number for a stable palette. The package follows the website's scale mapping: primary comes from the selected hue, while secondary and gray come from the inverted hue. Presentation and spreadsheet fills use generated scale roles; Word pages keep a clean white page with hue-generated heading and text colors. Use `logo: false` to remove the Terra wordmark, or pass an image path to use a consumer's own logo. `logoOnDark` supplies an alternate image for a dark slide background. Color and font overrides apply only to that generated file; the package defaults stay Terra-branded.

### Edit a generated template
```ts
import {
  editPresentationTemplate,
  editSpreadsheetTemplate,
  editWordTemplate,
} from "@terra-symposium/styling/documents";

await editPresentationTemplate("starter.pptx", "edited.pptx", {
  "The Styling system": "Product direction",
});

await editSpreadsheetTemplate("starter.xlsx", "edited.xlsx", {
  Inputs: { A6: "Confirm the launch date", B6: "Product lead" },
});

await editWordTemplate("starter.docx", "edited.docx", {
  "Project brief": "Product brief",
});
```

Presentation and Word text editing targets exact text runs in the shipped templates and preserves the other OOXML parts. Spreadsheet edits target sheet and cell addresses, retaining the workbook's styles and formulas.

## Configuration and security

Not applicable.

## Development and structure

### Shipped Office files
The build generates nine editable files under `dist/documents/templates/`: three `.pptx` example decks, three `.potx` PowerPoint design templates, a spreadsheet, a Word invoice template, and a Word style demo. Their palette is generated during the build; no fixed-color Office files are kept in source. Use `resolveDocumentTemplate()` with a filename from `DOCUMENT_TEMPLATE_FILES` to find an installed file.

Authentic Sans is used for headings and body text. Avara is reserved for the wordmark; a machine without Terra fonts installed will show its local Office fallback.

## Validation

Not applicable.

## Deployment and operations

Not applicable.

## Data, privacy, and limitations

Not applicable.

## References

Not applicable.

## Contributing

Not applicable.

## Credits and license

Not applicable.
