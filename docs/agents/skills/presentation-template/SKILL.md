---
name: presentation-template
description: Create and revise editable PowerPoint templates and a narrative demo deck.
metadata:
  related-files:
    - src/documents/presentation.ts
    - docs/styling/2-documents/presentation.md
skill: true
---

# Terra PowerPoint templates

A template is a reusable design system; a demo deck proves it works. Keep these outputs separate. Use the repository's `createPresentationTemplate` and document brand generator as the source of truth. Read the [Terra design language](../ui/references/terra-design-language.md) before changing layout geometry, type, or colour.

## Template design

- Keep a small set of layouts distinguished by structure: cover, one homepage motif combining large marquee terms, FAQ cards, and hero badges, plus one reusable card and badge variant layout, public or demo section, content, image with text, process, table, chart, list, and two image-led layouts for a theorist sketch or campaign poster. Reuse content for agendas and a section for closing. Add a layout only when its editable geometry differs. Microsoft describes layouts as reusable arrangements of placeholders, formatting, and background objects: [slide layouts](https://support.microsoft.com/en-us/powerpoint/what-is-a-slide-layout), [template creation](https://support.microsoft.com/en-gb/powerpoint/create-and-save-a-powerpoint-template).
- Put fixed framing on each slide layout: colour field, rules, process bars, numbers, and text brand mark. Position title, subtitle, body, and relevant image/table/chart placeholders in the remaining space. Use a footer and dynamic slide number on every layout. Supplied starter images must not have duplicate insertion boxes layered over them. Content-bearing cards and badges belong on editable starter slides as native, movable PowerPoint shapes; users can duplicate the slide or copy a shape into another layout. Keep card heading and body in one rounded text shape, and group an icon with its badge when they move together. A demo-only shape does not make a reusable layout. See Microsoft's [placeholder guidance](https://support.microsoft.com/en-gb/powerpoint/add-edit-or-remove-a-placeholder-on-a-slide-layout).
- Match the Website marquee with long, staggered term rows and a hard crop at the colour split. Keep the text on the slide bounds so PowerPoint's editing canvas does not show stray words outside the slide. Do not replace the marquee with a grid of isolated words.
- Use one consistent left inset for the brand mark, title, body, chart, and table. A wordmark image may contain invisible padding; prefer editable text for Terra's small slide mark. Keep custom-logo support when supplied.
- Derive all fill and text roles from one generated hue and its light/dark Radix-style scales. Light with dark text suits technical or business reading; saturated primary with contrast-tested text suits public emphasis; dark scale with light text suits live demos. Do not offer saturation as a user option.
- Chart layouts need a chart placeholder and an adjacent takeaway area. Size a native chart to the chart area instead of the full slide. Table and picture layouts need native placeholders. Keep native table row rules and avoid a separate outer border. Keep decorative objects behind the placeholders, not as sample-only shapes.
- Every offered layout needs usable title and content placeholders. Never expose a decorative-only master in the template's Layout menu. Put list decoration on the editable paragraph text, such as an underline, so adding or removing entries changes the number and length of lines. Avoid fixed rows or shapes that imply an entry exists when no content does.
- Image-led layouts need native picture placeholders in the `.potx` and editable picture shapes on demo slides, so a user can use **Change Picture** without rebuilding the deck. Compare a current Website screenshot with rendered slides before choosing colours and geometry. Query Terra's public Sanity production dataset for a real Website theorist sketch and match the slide copy to that person; do not substitute an unrelated portrait. Treat the archival campaign poster like the Website flyer: a slight rotation, softly rounded corners, and a restrained shadow. Picture treatment must survive in both the demo and editable starter; do not use PptxGenJS's `rounding` flag for rounded rectangles because it makes an ellipse. Check shadows in the generated OOXML and a presentation viewer.
- A `.potx` should open with a populated editable starter for each named layout, including nested-list formatting, all card and badge variants, a native DataTable and chart, replaceable workshop image, theorist sketch, and poster; use 50% picture transparency for the sketch so it colour-burns against the slide field without a white photo panel. Keep the wordmark in the layout footer alongside a dynamic page number. Keep the full design language in its layouts. A `.pptx` demo should have content on those layouts, so the user can duplicate an example to edit native charts or tables.

## Demo as a test

Write one plausible illustrative story with a beginning, middle, and end. Label invented data as illustrative. Make the numbers agree across tables, charts, metrics, and conclusions. Use distinct slides to exercise long text, short text, light/saturated/dark contrast, a four-column process, image cropping, image replacement, editable table, editable chart, and the closing decision. Avoid slides that merely describe how to use the template.

Build both files, render every slide, and inspect a montage plus individual slides where text may clip. Open the `.pptx` and `.potx` in PowerPoint. Create a new slide from at least one complex layout and confirm its decorative marks, placeholder positions, text alignment, and insertion affordances remain. Check theme colour entries and native chart/table parts in the package. Microsoft's guidance notes that edited layouts may need to be [reapplied](https://support.microsoft.com/en-gb/powerpoint/edit-and-re-apply-a-slide-layout) to existing slides.

Export review previews from PowerPoint when checking typography: LibreOffice may substitute Terra's native Office fonts. Ship the installable TTFs beside the deck and check font family names in the theme and slide text. The AUTHENTIC Sans files allow preview/print embedding, so do not promise editable font embedding.
