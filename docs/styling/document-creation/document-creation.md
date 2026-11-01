---
title: Document creation
description: Create and edit Terra-branded PowerPoint, spreadsheet and Word files.
---

The `@terra-symposium/styling/documents` entry point creates editable Office files with the same generated hue roles and type hierarchy used by Styling's UI. It includes low, medium and high saturation PowerPoint decks and matching `.potx` design templates, an Excel workbook with editable inputs and formulas, and a Word document with reusable styles. The PowerPoint layouts are native masters available in Home → Layout and View → Slide Master. Functional titles and body text use Authentic Sans; Avara is reserved for the decorative wordmark.

```ts
import { createPresentationTemplate } from '@terra-symposium/styling/documents';

const deck = createPresentationTemplate({ title: 'Product direction', saturation: 'low' });
await deck.writeFile({ fileName: 'product-direction.pptx' });
```

Omit `hue` to use the Terra website's random hue behavior, pass a number for a stable hue, or pass `null` for grayscale. Presentation and spreadsheet colors are generated when files are created. Word pages use white paper with hue-generated type. Consumers can remove the Terra wordmark, supply their own image, provide generated palette-role overrides or choose local Office fonts. These overrides only affect the generated file. See the package's [`src/documents/README.md`](https://github.com/Terra-Symposium/styling/blob/development/src/documents/README.md) for spreadsheet, Word and editing examples.
