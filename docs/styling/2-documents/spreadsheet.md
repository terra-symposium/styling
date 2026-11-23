---
title: Spreadsheet
description: Create and edit a Terra spreadsheet.
---

`@terra-symposium/styling/documents` creates an editable `.xlsx` workbook with an Inputs sheet and a formula-driven Overview. Open it in Excel or LibreOffice.

## Workflow

<Nodes
	direction={'TB'}
	height={440}
	nodes={[
		{ id: 'create', type: 'origin', position: { x: 0, y: 0 }, data: { title: 'Create a workbook' } },
		{ id: 'prepare', type: 'process', position: { x: 0, y: 110 }, data: { title: 'Edit Inputs' } },
		{ id: 'edit', type: 'process', position: { x: 0, y: 220 }, data: { title: 'Check Overview' } },
		{ id: 'review', type: 'terminal', position: { x: 0, y: 330 }, data: { title: 'Review formulas' } },
	]}
	edges={[
		{ id: 'create-prepare', source: 'create', target: 'prepare' },
		{ id: 'prepare-edit', source: 'prepare', target: 'edit' },
		{ id: 'edit-review', source: 'edit', target: 'review' },
	]}
/>

## Create

```ts
import { createSpreadsheetTemplate } from '@terra-symposium/styling/documents';

const workbook = createSpreadsheetTemplate({ title: 'Project plan' });
await workbook.xlsx.writeFile('project-plan.xlsx');
```

## Preview

Enter work items on Inputs; Overview calculates project totals from those entries.

===[Inputs]

![Spreadsheet Inputs sheet with sample work items](/_docs/assets/styling/2-documents/assets/spreadsheet-inputs.png 'Inputs')

===

===[Overview]

![Spreadsheet Overview with calculated project counts](/_docs/assets/styling/2-documents/assets/spreadsheet-overview.png 'Overview')

===

## Edit

Pass a fixed `hue` or `hue: null` when creating the workbook. Edit cells by sheet name and address to retain the workbook styles and formulas:

```ts
import { editSpreadsheetTemplate } from '@terra-symposium/styling/documents';

await editSpreadsheetTemplate('project-plan.xlsx', 'project-plan-final.xlsx', { Inputs: { A6: 'Confirm the launch date', B6: 'Project lead' } });
```

See the [document guide](https://github.com/Terra-Symposium/styling/blob/development/src/documents/GUIDE.md) for all brand options and editing details.
