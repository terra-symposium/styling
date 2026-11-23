---
title: Historical styling guidance
description: Earlier styling guidance retained as context for current design standards.
sidebar:
  hidden: true
---

## Historical styling guidance

This guide records earlier styling rationale alongside the current design standards. Treat the principles as design context and follow the current component, typography, composition, and brand guidance where details have changed.

## Styling

_Source: earlier styling guidance._

> ## Overview
>
> These standards describe how Terra Symposium interfaces should feel and behave. Styling decisions should strengthen hierarchy, make actions obvious, and preserve the project's established visual language.
>
> ### Styling priorities
>
> Use these priorities when styling work spans layout, content hierarchy, and interaction design.
>
> | 🎯 Area       | Standard                                                       | Outcome                                               |
> | ------------- | -------------------------------------------------------------- | ----------------------------------------------------- |
> | Workflow      | Design in low fidelity, build simply, then refine.             | Faster iteration and fewer premature styling choices. |
> | Hierarchy     | Use size, weight, colour, and spacing together.                | Clearer visual emphasis.                              |
> | Layout        | Prefer systems over arbitrary values.                          | More consistent, maintainable screens.                |
> | Typography    | Use a restrained type scale with deliberate line length.       | More readable content and cleaner interfaces.         |
> | Components    | Reuse Shadcn components with minimal alteration.               | Faster implementation and lower visual drift.         |
> | Iconography   | Use the approved icon sources in their intended contexts.      | Consistent visual semantics across app and CMS.       |
> | Accessibility | Preserve clarity across desktop, mobile, keyboard, and motion. | Interfaces remain usable, not only attractive.        |
>
> ### Section map
>
> Use this page from broadest decision to narrowest. Start with workflow and hierarchy, then move into layout, typography, components, and icon rules.
>
> | 📂 Section       | Purpose                                                       |
> | ---------------- | ------------------------------------------------------------- |
> | Workflow         | Defines how styling work should be designed and refined.      |
> | Visual Hierarchy | Defines how emphasis is created and reduced.                  |
> | Layout           | Defines spacing, width, grouping, and responsive structure.   |
> | Typography       | Defines readable type scale, font choice, and text rhythm.    |
> | Components       | Defines how UI primitives, states, and motion should behave.  |
> | Iconography      | Defines the approved icon sources and context-specific usage. |
>
> ---
>
> ## Workflow
>
> Styling work should move from broad structure to detail. Start with hierarchy and layout, then add colour, typography, and polish once the interface already works.
>
> ### Design loop
>
> The most effective workflow is cyclical rather than exhaustive. Build a simple version first, then refine only the problems revealed by the real interface.
>
> :::tip[Work in low fidelity]
>
> To focus on layout and structure without distraction, sketch with a thick marker on paper or work in greyscale first. This forces hierarchy to come from spacing, contrast, and size before colour does the work.

> :::
>
> The decision branches from the review: successful designs ship and repeat; designs that fail move into problem-solving and another simple build.
>
> | 🧩 Step              | Goal                                                                     |
> | -------------------- | ------------------------------------------------------------------------ |
> | Start with a feature | Design around the core user task, not every edge case at once.           |
> | Low-fidelity design  | Validate hierarchy and flow before visual polish.                        |
> | Simple build         | Ship the smallest working version into the real interface.               |
> | Review               | Ask whether the design actually works rather than whether it looks busy. |
> | Refine               | Solve the problems the first version exposed, then repeat.               |
>
> ### Workflow rule
>
> Do not spend high-fidelity effort on a screen that has not yet proven its hierarchy and task flow.
>
> ### Personality
>
> Every design communicates a personality, whether it is secure, playful, elegant, or utilitarian. Typography, colour, borders, and language all influence that impression.
>
> | 🎨 Element                                                 | Personality effect                                                     | Example                                          |
> | ---------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ |
> | > [Font](/docs/marketing/0-misc/3-persona#font) >          | A serif font feels elegant, while a rounded sans-serif feels playful.  | > `freight-text` vs `proxima-soft` >             |
> | > [Colour](/docs/marketing/0-misc/3-persona#colours) >     | Blue feels safe and familiar, while gold feels expensive.              | Corporate blue vs luxury gold                    |
> | > [Persona](/docs/marketing/0-misc/3-persona) >            | Border shape changes tone, from formal sharp corners to playful radii. | Government form vs startup dashboard             |
> | > [Language](/docs/marketing/1-prospect/0-target-market) > | Copy can feel official and distant or warm and conversational.         | "Verify your identity" vs "Sweet, thanks Steve!" |
>
> ### Systems
>
> Limitless choices slow the design process and create visual drift. Define systems for colour, type, spacing, and shadow before refining the final look.
>
> | 🧩 System | Standard                                                                   |
> | --------- | -------------------------------------------------------------------------- |
> | Type      | Reuse a small, deliberate type scale.                                      |
> | Colour    | Establish a consistent palette with primary and support roles.             |
> | Spacing   | Use Tailwind's spacing scale instead of arbitrary values.                  |
> | Shadow    | Reuse a small set of elevations instead of inventing one-off depth values. |
>
> ---
>
> ## Visual Hierarchy
>
> Visual hierarchy determines what the reader notices first, second, and last. A well-designed screen guides attention without needing labels everywhere.
>
> ### Hierarchy tools
>
> Do not rely on font size alone to create hierarchy. Most interfaces need a restrained combination of size, weight, and colour.
>
> | 🧩 Tool | Standard                                                                    | Typical use                          |
> | ------- | --------------------------------------------------------------------------- | ------------------------------------ |
> | Size    | Make important content larger, but avoid too many distinct font sizes.      | Headings, totals, primary actions    |
> | Weight  | Use heavier font weights for emphasis instead of increasing size alone.     | Active states, headings, key labels  |
> | Colour  | Reduce contrast for secondary content rather than shrinking it excessively. | Metadata, hints, inactive navigation |
>
> :::tip[Hierarchy trio]
>
> Create a strong and subtle hierarchy by combining size, weight, and colour rather than overusing any one of them.

> :::
>
> ### Supporting emphasis
>
> Hierarchy also depends on what you de-emphasise. Use background-aware text colours, softer inactive states, and context-first phrasing to reduce clutter.
>
> | 🧩 Technique         | Standard                                                                                                     |
> | -------------------- | ------------------------------------------------------------------------------------------------------------ |
> | Coloured backgrounds | On coloured surfaces, use a related hue with adjusted saturation and lightness instead of generic grey text. |
> | Relative emphasis    | Make important elements stand out by softening the competing ones around them.                               |
> | Avoid labels         | > Prefer context-rich phrasing over `label: value` formatting when the layout already provides meaning. >    |
>
> ### Phrasing example
>
> | Don't              | Do                     |
> | ------------------ | ---------------------- |
> | > `In stock: 12` > | > `12 left in stock` > |
> | > `Bedrooms: 3` >  | > `3 Bedrooms` >       |
>
> When a label is necessary, treat it as secondary content by reducing its weight, contrast, or size.
>
> ### Action priority
>
> Buttons and links should look as important as their consequence, not merely as important as their semantic tag.
>
> | 🥇 Priority | Goal                         | Tailwind example                                 |
> | ----------- | ---------------------------- | ------------------------------------------------ |
> | Primary     | Most obvious, high-contrast. | > `bg-primary-600 text-white` >                  |
> | Secondary   | Clear, but less prominent.   | > `border border-primary-600 text-primary-600` > |
> | Tertiary    | Discoverable, link-like.     | > `text-primary-600 hover:underline` >           |
>
> ---
>
> ## Layout
>
> Layouts define the structural experience of the application. They should make content grouping, navigation, and reading width feel intentional across screen sizes.
>
> ### Layout roles
>
> Layouts are foundational components. They provide a shared frame so pages stay consistent even when their content and controls differ.
>
> Base.astro is the shared foundation; Dashboard.astro, Static.astro, and Modal.astro extend it for authenticated, public, and dialog layouts.
>
> | 📄 Layout             | Purpose                                                                                                          |
> | --------------------- | ---------------------------------------------------------------------------------------------------------------- |
> | > `Base.astro` >      | > Cornerstone layout that sets HTML structure, SEO metadata, theming, and global components such as `Toaster`. > |
> | > `Dashboard.astro` > | > Moderator layout that extends `Base` with authenticated navigation and user-specific controls. >               |
> | > `Static.astro` >    | > Public-content layout that extends `Base` with a persistent nav bar, search, and footer. >                     |
> | > `Modal.astro` >     | > Focused dialog layout that centres a modal over an animated background and exposes a `footer` slot. >          |
>
> ### Spacing system
>
> A systematic approach to spacing makes layouts easier to reason about. Use Tailwind's built-in scale rather than arbitrary pixel values.
>
> | 🧭 Principle     | Tailwind practice                                                                                                      |
> | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
> | Use a system     | > Use built-in spacing utilities such as `p-4`, `m-6`, and `space-y-8`. >                                              |
> | Constrain width  | > Use `max-w-*` or `@apply container` to control line length and readability. >                                        |
> | Flexible grids   | > Use `flex` and `grid`, with fixed widths such as `w-64` where sidebars need stability. >                             |
> | Group with space | > Use larger margins between sections than within them, such as `space-y-4` inside a card and `mb-12` between cards. > |
>
> :::caution[Grouping rule]
>
> To visually group related items, make the space between groups at least twice as large as the space within a group. This creates clearer, more scannable sections.

> :::
>
> ### Responsive structure
>
> Layouts must degrade cleanly on smaller screens. Preserve hierarchy and grouping when columns stack or sidebars collapse.
>
> | 📱 Concern      | Standard                                                                                        |
> | --------------- | ----------------------------------------------------------------------------------------------- |
> | Reading width   | > Constrain long-form content with `max-w-*` or `max-w-prose`. >                                |
> | Sidebars        | Use stable widths on large screens, then collapse or stack them on mobile.                      |
> | Grid density    | Prefer fewer columns on smaller screens rather than shrinking content until it becomes cramped. |
> | Grouping rhythm | Preserve the same between-group and within-group spacing ratio on mobile.                       |
>
> ### Responsive priority
>
> When space is tight, preserve hierarchy first, then preserve decoration. Content should stack before it becomes visually cramped.
>
> ---
>
> ## Typography
>
> Typography is one of the strongest tools for clarity. A restrained scale and readable rhythm will usually outperform a larger catalogue of decorative decisions.
>
> ### Type scale
>
> Use Tailwind's default type scale and avoid inventing excessive intermediate sizes. Most interfaces only need a small set of reliable steps.
>
> | 🎯 Use                    | Class           |
> | ------------------------- | --------------- |
> | Small text, tertiary info | > `text-xs` >   |
> | Secondary text, labels    | > `text-sm` >   |
> | Body copy                 | > `text-base` > |
> | Large body, subheadings   | > `text-lg` >   |
> | Subheadings               | > `text-xl` >   |
> | Small headings            | > `text-2xl` >  |
> | Headings                  | > `text-3xl` >  |
> | Large headings            | > `text-4xl` >  |
> | Marketing headlines       | > `text-5xl` >  |
>
> ### Font selection
>
> Typeface quality matters. A few simple heuristics help you choose fonts that stay legible under real UI conditions.
>
> | 🔎 Heuristic | Description                                                                |
> | ------------ | -------------------------------------------------------------------------- |
> | Play it safe | A neutral sans-serif or the native system stack is a reliable default.     |
> | Weights      | Typefaces with five or more weights tend to be more flexible and polished. |
> | Legibility   | For body text, choose fonts with a large x-height.                         |
>
> ### Readability rules
>
> Readable typography depends on more than type size. Line length, alignment, and line height should all reinforce the content's density and role.
>
> | 🧩 Concern  | Standard                                                                              | Example                                |
> | ----------- | ------------------------------------------------------------------------------------- | -------------------------------------- |
> | Line length | Keep lines between 45 and 75 characters for long-form readability.                    | > `max-w-prose`, `prose` >             |
> | Alignment   | Align mixed-size text on the baseline rather than the visual centre.                  | Metric + unit on one line              |
> | Line height | Use taller leading for small text and long lines, shorter leading for large headings. | > `leading-relaxed`, `leading-tight` > |
>
> ### Example
>
> :::example[Proportional line height in Tailwind]
>
> ```html
> <p class="text-sm leading-relaxed">This is a paragraph of small text. The `leading-relaxed` class adds space between lines to make it easier to read.</p>
>
> <h1 class="text-4xl font-bold leading-tight">This heading is large</h1>
> ```

> :::
>
> ---
>
> ## Components
>
> Component styling should stay consistent with the existing system. Prefer composing reliable building blocks over hand-rolling one-off UI primitives.
>
> ### Shadcn usage
>
> Components are sourced from [Shadcn](https://ui.shadcn.com/docs/components), with minimal alteration to fit Terra Symposium's visual language.
>
> | 🧩 Rule     | Standard                                                           |
> | ----------- | ------------------------------------------------------------------ |
> | Source      | Prefer Shadcn components for common UI primitives.                 |
> | Alteration  | Make minimal styling changes instead of forking component logic.   |
> | Consistency | Keep variants and sizes aligned with the project's existing usage. |
>
> :::example[Using a Shadcn component]
>
> ```tsx
> import { Button } from '@components/ui/button';
>
> export default function MyComponent() {
> 	return (
> 		<Button variant='outline' size='lg'>
> 			Click Me
> 		</Button>
> 	);
> }
> ```

> :::
>
> ### Interaction states
>
> Components must communicate state clearly. A beautiful interface that hides focus, disabled, or loading states is still a poor interface.
>
> | 🎯 State    | Standard                                                                      |
> | ----------- | ----------------------------------------------------------------------------- |
> | Focus       | Provide a visible keyboard focus style that is at least as clear as hover.    |
> | Disabled    | Make disabled controls visibly inactive without making labels unreadable.     |
> | Loading     | Preserve layout stability so buttons and cards do not jump during async work. |
> | Status cues | Do not rely on colour alone to communicate success, warning, or error.        |
>
> ### Motion
>
> Motion should support comprehension, not decorate empty space. Keep it purposeful, restrained, and compatible with accessibility preferences.
>
> | 🎞️ Rule       | Standard                                                            |
> | ------------- | ------------------------------------------------------------------- |
> | Purpose       | Use animation to explain entry, hierarchy, or state change.         |
> | Restraint     | Prefer a few meaningful motions over constant micro-animations.     |
> | Accessibility | Respect reduced-motion preferences where movement is non-essential. |
>
> ### State priority
>
> If motion and clarity conflict, clarity wins. A state change must remain obvious even when reduced motion is enabled.
>
> ---
>
> ## Iconography
>
> Icons should come from the approved source for the environment they appear in. Keep the visual vocabulary consistent across the web app and the CMS.
>
> ### Icon sources
>
> Choose the icon library based on runtime context, not personal preference. The import path should make that choice obvious.
>
> | 🧩 Context      | Preferred source | Fallback     | Typical import style                              |
> | --------------- | ---------------- | ------------ | ------------------------------------------------- |
> | Web application | Carbon Icons     | None         | > `~icons/carbon/hyphenated-name-of-icon` >       |
> | Sanity studio   | Carbon Icons     | Sanity Icons | Package import inside the CMS schema or component |
>
> ### Source priority
>
> Choose the icon set by environment first, then by metaphor. Do not mix libraries arbitrarily within the same context.
>
> ### Astro icons
>
> Icons for the web application should come from [Carbon Icons](https://carbondesignsystem.com/guidelines/icons/library/). Keep class names consistent with the surrounding typography and spacing.
>
> ### Sanity icons
>
> Icons in the CMS should use Carbon Icons where possible, and [Sanity Icons](https://icons.sanity.build/all) only when the Carbon set does not provide the needed metaphor.
>
> ### Reserved icons
>
> Some icons are reserved for fixed meanings. They must remain exclusive to those contexts so the visual language stays stable for users.
>
> :::caution[Reserved icons]
>
> These icons must always be used in their reserved contexts and never repurposed for other meanings.

> :::
