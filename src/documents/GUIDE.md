# Terra document creation

`@terra-symposium/styling/documents` creates native, editable PowerPoint, Excel and Word files. The API can generate a fresh hue; packaged examples use a fixed hue through Styling's palette system. Avara handles short editorial titles; Authentic Sans handles functional headings, body text and tables. The presentation uses an editable Avara text brand mark aligned to the content inset. Templates work in Office, PowerPoint, Keynote and Pages and can also be created or edited from JavaScript or TypeScript.

## Usage

### Create a presentation

```ts
import { createPresentationTemplate } from '@terra-symposium/styling/documents';

const deck = createPresentationTemplate({
	title: 'Product direction',
	subtitle: 'A short description of the audience and purpose.',
	// brand: { hue: 220 }, // fixed hue; omit for a fresh palette
	// brand: { hue: null }, // grayscale palette
});

await deck.writeFile({ fileName: 'product-direction.pptx' });

// For editable cover and graphic starter slides with the full layout library:
const starter = createPresentationTemplate({ showcase: false, brand: { hue: 220 } });
await starter.writeFile({ fileName: 'product-direction-starter.pptx' });
```

The `.pptx` demo follows an illustrative four-session workshop pilot across 12 slides. The `.potx` opens with 16 editable starters ordered like the current PowerPoint reference: four decorative slides, two section breaks, four generic examples, and six surface galleries. Eight structural designs have short names: Cover, Home, Chapter, Night, Text, Steps, Chart, and Graphic. The surface galleries use the Text design. Each design has six hue pairings, each with a primary and secondary role (12 choices per design); semantic destructive, success, and caution colours are additional. Each surface gallery places the light and dark versions together and includes all six Card and Badge treatments (default, outline, ghost, tonal, saturated, glass) as movable native shapes. Use Text for lists, tables, and ordinary body content. The table and chart starters contain editable native examples; the graphic starters include a replaceable sketch and poster. The footer has a larger reserved area; its divider appears only on light-background slides and uses the footer text colour. Section headings have no underline; the Text Hierarchy starter has a full-width rule beneath its h3. The built-in sample uses a fixed hue; the generator defaults to a fresh hue.

### Create a workbook or Word file

```ts
import { createSpreadsheetTemplate, writeWordTemplate } from '@terra-symposium/styling/documents';

const workbook = createSpreadsheetTemplate({ title: 'Project plan' });
await workbook.xlsx.writeFile('project-plan.xlsx');

await writeWordTemplate('project-brief.docx', { title: 'Project brief', subtitle: 'Purpose, scope and next steps' });
```

The workbook includes a formula-driven Overview and editable, validated Inputs sheet. The Word starter follows the structure of Terra's invoice: a restrained supplier masthead, left-aligned invoice title and metadata, a pale recipient panel, grouped line items, a clear total, and payment details. Its heading styles are reusable Word styles, and the sample fields are placeholders rather than customer or banking data. `terra-document-demo.docx` adds a second page with Heading 1–3, bulleted and numbered lists, a comparison table, and a detail table so the complete style system can be reviewed in Pages or Word.

### Override the brand

```ts
const deck = createPresentationTemplate({ brand: { logo: false, fonts: { display: 'Avara', body: 'AUTHENTIC Sans 90' } } });
```

Omit `hue` for a new random hue in the same range used by the Terra website; use `hue: null` for grayscale or a number for a stable palette. The package follows the website's scale mapping: primary comes from the selected hue, while secondary and gray come from the inverted hue. Presentation and spreadsheet fills use generated scale roles; Word pages keep a clean white page with hue-generated heading and text colors. Use `logo: false` to remove the Terra wordmark, or pass an image path to use a consumer's own logo. `logoOnDark` supplies an alternate image for a dark slide background. Color and font overrides apply only to that generated file; the package defaults stay Terra-branded.

### Edit a generated template

```ts
import { editPresentationTemplate, editSpreadsheetTemplate, editWordTemplate } from '@terra-symposium/styling/documents';

await editPresentationTemplate('starter.pptx', 'edited.pptx', { 'The Styling system': 'Product direction' });

await editSpreadsheetTemplate('starter.xlsx', 'edited.xlsx', { Inputs: { A6: 'Confirm the launch date', B6: 'Product lead' } });

await editWordTemplate('starter.docx', 'edited.docx', { 'Project brief': 'Product brief' });
```

Presentation and Word text editing targets exact text runs in the shipped templates and preserves the other OOXML parts. Spreadsheet edits target sheet and cell addresses, retaining the workbook's styles and formulas.

## Development

### Weekly standup decks

`scripts/generate-weekly-review.mjs` takes a weekly-review report JSON file and an output `.pptx` path. It imports the built `terra-presentation.potx`, clears its sample slides, and creates the report slides on its `Text P1` and `Cover P1` layouts. The palette and body font come from `createDocumentBrand({ hue: 200 })`; the imported layouts supply the footer, rule, and editable design variants. Build the document templates before running the generator. The generator uses the Codex workspace's `@oai/artifact-tool` runtime.

```sh
node scripts/generate-weekly-review.mjs artifacts/standup/report.json artifacts/standup/standup.pptx
```

### Shipped Office files

The build generates five editable files under `dist/documents/templates/`: one `.pptx` deck, one `.potx` PowerPoint design template, a spreadsheet, a Word invoice template, and a Word style demo. Their palette is generated from the fixed example hue during the build; no fixed-color Office files are kept in source. Use `resolveDocumentTemplate()` with a filename from `DOCUMENT_TEMPLATE_FILES` to find an installed file.

Avara is available for short editorial titles in other media; presentation headings use `AUTHENTIC Sans 130` for a calmer hierarchy. The default native body font is `AUTHENTIC Sans 90`. These are the Office family names in the supplied font files; the CSS alias is `Authentic Sans`. The five native `.ttf` files are shipped beside the templates under `dist/documents/templates/fonts/`. Install them for faithful editing and rendering on another computer. AUTHENTIC Sans's font metadata permits preview/print embedding but not editable embedding; the `.pptx` therefore does not embed a font that would make editing unreliable. The presentation's small text brand mark uses Avara Bold Italic. PowerPoint-exported previews preserve these fonts; LibreOffice previews may substitute them. A custom image logo remains supported.
