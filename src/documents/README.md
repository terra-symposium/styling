# Documents

These tools help teams create editable presentation, spreadsheet, and document files.

For validation and pull-request guidance, see the [repository README](../../README.md).

## Usage

```ts
import { createPresentationTemplate } from '@terra-symposium/styling/documents';

const deck = createPresentationTemplate({ title: 'Product direction' });
await deck.writeFile({ fileName: 'product-direction.pptx' });
```

The package also exports `createSpreadsheetTemplate`, `writeWordTemplate`, and edit helpers for shipped templates. See the [document guide](GUIDE.md) for examples, brand options, editable slide masters, spreadsheet sheets, Word styles, and exact-run editing behavior.

## Contributing

The build writes example `.pptx`, `.potx`, `.xlsx`, and `.docx` files under `dist/documents/templates/`. Use `resolveDocumentTemplate()` and `DOCUMENT_TEMPLATE_FILES` to locate installed files. Review generated files in a native Office editor when changing templates.
