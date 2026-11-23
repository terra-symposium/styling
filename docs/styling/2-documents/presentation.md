---
title: Presentation
description: Create and edit a Terra PowerPoint presentation.
---

## Workflow

`@terra-symposium/styling/documents` creates a 12-slide illustrative `.pptx` demo and a `.potx` design template with eight structural designs with 12 colour choices each. Open them in PowerPoint; the deck also opens in Keynote.

<Nodes
	direction={'TB'}
	height={440}
	nodes={[
		{ id: 'create', type: 'origin', position: { x: 0, y: 0 }, data: { title: 'Create a deck' } },
		{ id: 'prepare', type: 'process', position: { x: 0, y: 110 }, data: { title: 'Choose a layout' } },
		{ id: 'edit', type: 'process', position: { x: 0, y: 220 }, data: { title: 'Replace sample content' } },
		{ id: 'review', type: 'terminal', position: { x: 0, y: 330 }, data: { title: 'Review in PowerPoint' } },
	]}
	edges={[
		{ id: 'create-prepare', source: 'create', target: 'prepare' },
		{ id: 'prepare-edit', source: 'prepare', target: 'edit' },
		{ id: 'edit-review', source: 'edit', target: 'review' },
	]}
/>

## Create

```ts
import { createPresentationTemplate } from '@terra-symposium/styling/documents';

const deck = createPresentationTemplate({ title: 'Product direction' });
await deck.writeFile({ fileName: 'product-direction.pptx' });

// Start with editable cover and graphic slides plus the same styled layouts.
const template = createPresentationTemplate({ showcase: false, brand: { hue: 170 } });
await template.writeFile({ fileName: 'presentation-starter.pptx' });
```

## Preview

The demo follows a four-session workshop pilot from need to decision. The `.potx` contains 16 editable starter slides in the order of the current PowerPoint reference, with eight short design names: Cover, Home, Chapter, Night, Text, Steps, Chart, and Graphic. Surface galleries use Text. Each design has six hue pairings with primary and secondary versions, giving 12 colour choices. Destructive, success, and caution surfaces are additional semantic colours. All six Card and Badge treatments appear as editable native shapes in both light and dark on each surface gallery page. Reuse Text for lists, native tables, and regular body content. The graphic slides have replaceable pictures, and the chart and table starters contain editable native examples. The footer divider appears only on light-background slides, matches its text colour, and leaves a larger footer area. The Text Hierarchy h3 has a full-width rule. These examples use a fixed hue; omit `hue` for a new palette. Install the supplied fonts from `dist/documents/templates/fonts/` on another computer before editing for faithful typography.

===[Cover]

![Terra illustrative pilot cover slide](/_docs/assets/styling/2-documents/assets/presentation-cover.png 'Cover')

===

===[Homepage]

![Terra illustrative pilot homepage marquee and cards slide](/_docs/assets/styling/2-documents/assets/presentation-homepage.png 'Homepage')

===

===[Cards and badges]

![Four reusable homepage card treatments and two badge treatments](/_docs/assets/styling/2-documents/assets/presentation-cards-and-badges.png 'Cards and badges')

===

===[Section Public]

![Terra illustrative pilot section public slide](/_docs/assets/styling/2-documents/assets/presentation-section-public.png 'Section Public')

===

===[Theorist]

![Terra illustrative pilot theorist slide](/_docs/assets/styling/2-documents/assets/presentation-theorist.png 'Theorist')

===

===[Content]

![Terra illustrative pilot content slide](/_docs/assets/styling/2-documents/assets/presentation-content.png 'Content')

===

===[Section Demo]

![Terra illustrative pilot section demo slide](/_docs/assets/styling/2-documents/assets/presentation-section-demo.png 'Section Demo')

===

===[Process]

![Terra illustrative pilot process slide](/_docs/assets/styling/2-documents/assets/presentation-process.png 'Process')

===

===[Table]

![Terra illustrative pilot table slide](/_docs/assets/styling/2-documents/assets/presentation-table.png 'Table')

===

===[Chart]

![Terra illustrative pilot chart slide](/_docs/assets/styling/2-documents/assets/presentation-chart.png 'Chart')

===

===[List]

![Terra illustrative pilot list slide](/_docs/assets/styling/2-documents/assets/presentation-list.png 'List')

===

===[Poster]

![Terra illustrative pilot poster slide](/_docs/assets/styling/2-documents/assets/presentation-poster.png 'Poster')

===

## Edit

Use **Home → Layout** for a styled editable layout, including chart, table, picture and four-column process placeholders. Duplicate the demo table or chart slide to edit its native data. Use **View → Slide Master** to change the design. Omit `hue` for a new palette, pass a number for a fixed hue, or pass `null` for grayscale. Replace exact text runs in a generated deck:

```ts
import { editPresentationTemplate } from '@terra-symposium/styling/documents';

await editPresentationTemplate('product-direction.pptx', 'final.pptx', { 'Product direction': 'Launch plan' });
```

See [Design language](/styling/1-colouring/3-design-language/) for the visual rules and the [document guide](https://github.com/Terra-Symposium/styling/blob/development/src/documents/GUIDE.md) for all brand options and editing details.
