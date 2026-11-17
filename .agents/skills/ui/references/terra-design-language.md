# Terra Symposium design language

Use this reference when designing a Website page, Docs view, UI component, or native document. It is derived from the current Styling font and palette sources, the public Website layout and Media Kit, and the Docs workspace. Follow the owning component contract where it is more specific. Do not infer a brand rule from a single one-off route.

## Identity and hierarchy

Terra pairs editorial, occasionally playful display moments with plain, readable interfaces. Start with a clear reading order: section label, expressive heading where appropriate, short supporting copy, then content or action. Give major ideas room; place denser controls and data on quiet surfaces. The Website homepage uses a strong hue field beside a light content column; the Media Kit uses numbered labels, a display heading, generous section spacing and a responsive image grid. Docs uses the same palette and type families in a denser workspace. Reuse those roles, not their exact page geometry.

Use the horizontal italic Terra wordmark asset for public Website and printed brand materials. On PowerPoint layout masters, use an editable `terra symposium` text mark in the actual Avara Bold Italic face, aligned to the content inset; do not use an image with internal padding. A supplied consumer logo may replace it, and `logo: false` removes it.

## Type

| Role | Family and weight | Where it belongs |
| --- | --- | --- |
| Editorial title or short display phrase | Avara Bold Italic (`font-serif italic`; Office `Avara Bold` with italic style) | Website section headings and Docs page titles; use sparingly on bespoke slides. Keep phrases short. |
| Functional heading | Authentic Sans 130 or 150 (`font-sans font-semibold` or `font-bold`; Office `AUTHENTIC Sans 130` or `AUTHENTIC Sans 150`) | Interface sections, tables, controls, reusable presentation layouts. |
| Body and labels | Authentic Sans 90 (`font-sans`; Office `AUTHENTIC Sans 90`) | Reading copy, instructions, metadata and slide body text. |
| Docs code | Monospace code block; Docs chrome may use Inter | Code only; Inter is not the public brand body face. |

The Styling and Website CSS register `Authentic Sans` weights 400, 700 and 800 from AUTHENTICSans-90/130/150. They register Avara Bold and Bold Italic at CSS weight 500. In native Office files, the italic face identifies as `Avara Bold` with italic style. The CSS family `Authentic Sans` is an alias: the actual Office font families embedded in the supplied files are `AUTHENTIC Sans 90`, `AUTHENTIC Sans 130`, and `AUTHENTIC Sans 150`. Use those exact names in native Office theme and text fields; `AUTHENTIC Sans` or `Authentic Sans` can silently fall back. In a presentation, set both the theme fonts and individual text objects. Avara may fall back on a machine without the font installed; check the small editable PowerPoint text mark in PowerPoint. Do not use Avara for paragraphs, tables, small instructions, or every heading. Do not use fake bold or fake italic on Avara when the proper face is available.

## Colour and contrast

The colour is generated, not selected from fixed brand hex swatches. For each page or artifact, choose one hue: Website defaults to a fresh value in `0..300`, while an explicit number fixes it and `null` selects grayscale. `colors(hue)` supplies primary and neutral scales; `colors(invert(hue))` supplies the complementary secondary accent and gray. The generator creates Radix-style twelve-step light and dark scales; `null` uses Radix grayscale. The Website's `Base.astro` maps these to CSS `--primary-*`, `--secondary-*`, and `--gray-*`. Use the same generator for native files. A dark slide must use `scale.dark` for both surface and foreground. Use light surfaces with dark text for business documents, tech reviews and developer standups; a saturated primary-9 field for public talks; and a dark primary-1 field with dark-scale light text for demos and theatrical moments. Saturated-field foreground must be selected by contrast for the generated hue. Do not expose saturation presets or alter `accentChroma` in document options.

The twelve scale steps are semantic: `primary-1` is a page surface; 2–3 are quiet raised surfaces; 5–7 are borders and rules; 8–9 are accented controls and strong fields; 10–11 are supporting or muted text; 12 is reading text. `secondary` gives contrast or a companion accent, not a second competing theme. `gray` is neutral structure. Confirm legibility against the actual light or dark surface at generated hues. For dark slides, use a dark scale surface with dark-scale light foreground and verify the rendered contrast; do not assume `primary-12` is dark enough or `primary-1` light enough in every context.

Prefer a pale page with restrained coloured accents for sustained reading. A saturated field works for a hero, a section divider, or a decisive call to action. Keep tables and data surfaces calm: left-aligned labels, subtle horizontal rules, and no decorative vertical grid. Avoid arbitrary hard-coded colours, rainbow accents, or coloured backgrounds behind every block. Print should remain legible without depending on background fills.

## Composition and spacing

Build structure with a consistent outer inset, a visible grid, and deliberate rhythm. Website content uses responsive horizontal padding (`px-8 sm:px-10 md:px-14`); it changes layout at breakpoints instead of squeezing a desktop arrangement. The homepage balances a dense hero field with an open pale column; the Media Kit uses numbered kickers, large intervals between sections and a responsive card grid. For Docs and data-heavy screens, keep controls compact and the reading column clear.

In presentations, keep a common safe margin and baseline across slides. Use size and surface contrast to distinguish the cover and section dividers; use smaller functional headings for content and tables. Leave intentional open space but not a slide-sized void caused by tiny text. Align captions, body, rules and table columns to the same grid. Keep example slides on clean masters and authoring layouts on separate masters with placeholders; PowerPoint displays empty master placeholders over sample content even when a PDF renderer hides them. A full-bleed field may carry one idea, while content slides should preserve a readable light surface. Keep body copy brief, avoid stretched text boxes, and inspect rendered line breaks. Use imagery only when it supports the subject; Website Media Kit photos show real workshop activity and have a clear focal point. Crop with intent, keep text away from busy image areas, and give every image alt text in Docs or UI.

## Controls and states

Use Styling components and their canonical `variant` props for actions, surfaces, form controls and feedback. Their variant matrix supplies color/treatment behavior; the owning component supplies dimensions. Reserve `className` for layout or one-off geometry. Keep hover, focus-visible, selected, disabled, dark and print states readable. For dialogs, menus, accordions and tabs, preserve semantic controls, keyboard order and visible focus. Do not add a Card merely to frame a table; choose framing only when the content genuinely needs a surface boundary.

## Cross-medium checks

1. Identify the surface's purpose: editorial, working UI, data, or native document. Select type and colour roles accordingly.
2. Compare a public Website reference and the nearest Styling or Docs component before setting geometry.
3. Check one typical hue, one contrasting hue and grayscale; inspect light/dark where applicable.
4. Render the actual route or Office file. Check font substitution, overflow, clipping, image crop, alignment, and contrast at a normal viewing size.
5. For a deck, inspect every slide and editable layout in a compatible viewer; screenshots alone do not prove editability.

Source anchors: `src/styles/global.css`, `src/lib/tailwind-preset.ts`, `src/lib/hue.ts`, `src/components/ui/variants.ts`, Website `astro/src/layouts/Base.astro`, `astro/src/pages/index.astro`, `astro/src/pages/assets/index.astro`, Docs `src/components/terra/pages/docs/_main.tsx`, and `src/styles/prose.css`. Recheck these sources when implementation changes.
