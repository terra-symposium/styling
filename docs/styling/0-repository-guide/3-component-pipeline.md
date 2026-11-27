---
title: Component pipeline
description: How Styling source, guidance, demos, and generated TypeScript references become.
---

## Goal and design language

Styling gives Terra applications one reusable control system and a common visual grammar. A component should be usable in an application, understandable from its reference page, and operable with keyboard and assistive technology. Its colors come from a hue-generated palette; its `variant` names express color and treatment, while layout and content stay with the host.

The [Design language](/styling/1-colouring/3-design-language/) explains the visual roles: expressive editorial moments, restrained working surfaces, functional type, and readable contrast. [Hue and colour](/styling/1-colouring/0-hue/) defines the palette; [Variants](/styling/1-colouring/1-variants/) shows supported treatments. The component reference turns those principles into concrete controls and examples.

## Sources of a component page

Each reference page has four sources. Keep them in agreement when behavior changes.

| Source                     | What it contributes                                          | Where to edit                                                          |
| -------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| Public component and types | Runtime behavior, props, signatures, JSDoc, literal defaults | `src/components/ui/` or the owning composition under `src/components/` |
| Usage note                 | When to use it and accessibility guidance                    | `docs/styling/1-colouring/demos/notes.ts`                              |
| Demo module                | Interactive preview and copyable `exampleCode`               | `docs/styling/1-colouring/demos/<slug>.tsx`                            |
| Reference page             | Grouped catalog, workbench controls, API and props display   | `docs/styling/1-colouring/components.tsx`                              |

:::caution[Do not rely on generated prose alone]

The generator uses a component export's JSDoc summary, then a source comment, then a generic family label. Write a useful source summary and a separate usage note. The former describes the API; the latter explains the reader's decision and relevant accessibility behavior.

:::

## Build the reference

`pnpm run build` follows the component reference pipeline:

1. `scripts/generate-component-tsdocs.mjs` discovers component files and named compositions, groups their slugs, and reads public TypeScript exports with the compiler API. It writes signatures, prop types, finite choices, JSDoc, and literal defaults to `dist/cache/component-tsdocs.ts`.
2. `scripts/check-component-demos.mjs` checks that generated entries have public demo exports, a catalog group, a demo module, copyable parseable JSX, and a usage note. It also checks that imports in example code exist in the public UI entry point.
3. The build emits JavaScript, declarations, fonts, and `global.css`. `pnpm run docs:build` then checks Docs TypeScript and demos and builds the static site.
4. The Markdown [Components index](/styling/1-colouring/2-components/) loads `ComponentCatalog`. One Astro route, `/styling/1-colouring/2-components/[component]/`, creates a page for every generated slug.

The route loads the generated metadata. `ComponentReference` renders the source link, usage note, interactive demo, and TypeScript API table. Each API row includes its own prop details; exports used in the authored composition can focus the shared workbench on that export while keeping the complete example rendered. Appearance controls update both the preview and copyable code.

The site currently builds at `docs.base: "/"`. Its reference screenshots use `/_docs/assets/...` URLs for files copied from `docs/styling/`. If the site moves beneath a URL prefix, update those image paths and verify them at the published address.

## Add or change a component

1. Implement and export the component from the public UI entry point. Use typed `variant` props for supported treatments and document meaningful props in JSDoc.
2. Add a demo module for its slug with a default preview export and an `exampleCode` string that a consumer can copy. Add a usage and accessibility note in `notes.ts`.
3. If the component is a named composition outside `src/components/ui/`, register its source alias in `scripts/generate-component-tsdocs.mjs`. Assign its catalog group and preferred demo export there when discovery cannot infer them.
4. Run `pnpm run build`, `pnpm run docs:check`, and the relevant component tests. Open the catalog and detail route; exercise keyboard interaction, responsive layout, color variants, dark mode, and the copyable example.

:::example[What a reader should find]

A Checkbox page should show a working checkbox and copyable import, state when an independent choice is appropriate, link to its source, and list its public props. Its demo and note should still make sense without knowing Terra's application code.

:::

The package's [Development guide](/styling/0-repository-guide/2-development/) covers setup and release checks. The [Usage guide](/styling/0-repository-guide/1-usage/) shows how an application imports the built controls and theme helpers.
