---
title: Document
description: Create and edit a Terra Word document.
---

`@terra-symposium/styling/documents` creates an editable `.docx` invoice with reusable Word styles. Open it in Word or Pages.

## Workflow

<Nodes direction={"TB"} height={440} nodes={[ {"id": "create","type": "origin","position": {"x": 0,"y": 0},"data": {"title": "Create Word file"}}, {"id": "prepare","type": "process","position": {"x": 0,"y": 110},"data": {"title": "Fill invoice fields"}}, {"id": "edit","type": "process","position": {"x": 0,"y": 220},"data": {"title": "Apply Word styles"}}, {"id": "review","type": "terminal","position": {"x": 0,"y": 330},"data": {"title": "Review in Word"}}, ]} edges={[ {"id": "create-prepare","source": "create","target": "prepare"}, {"id": "prepare-edit","source": "prepare","target": "edit"}, {"id": "edit-review","source": "edit","target": "review"}, ]} />

## Create

<CodeBlock language="ts" code={"import { writeWordTemplate } from '@terra-symposium/styling/documents';\n\nawait writeWordTemplate('invoice.docx', { title: 'Invoice' });\nawait writeWordTemplate('style-example.docx', {\n\ttitle: 'Invoice',\n\tshowcase: true,\n});"} />

## Preview

Open each editable Word type to inspect its template. Replace the invoice placeholders before sharing; use named styles when adding content.

===[Invoice]

![Word invoice with recipient, line items and payment placeholders](/styling-docs/_docs/assets/styling/2-documents/assets/document-invoice.png 'Invoice')

===

===[Word styles]

![Word style example with headings, lists and tables](/styling-docs/_docs/assets/styling/2-documents/assets/document-style-guide.png 'Word styles')

===

## Edit

Pass a fixed `hue`, `hue: null` for grayscale, or `brand.logo: false` when creating the file. Replace exact text runs without changing the remaining document structure:

<CodeBlock language="ts" code={"import { editWordTemplate } from '@terra-symposium/styling/documents';\n\nawait editWordTemplate('invoice.docx', 'invoice-final.docx', {\n\tInvoice: 'Project invoice',\n});"} />

See the [document guide](https://github.com/Terra-Symposium/styling/blob/development/src/documents/GUIDE.md) for all brand options and editing details.
