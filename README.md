# Terra Styling

Public Apache 2.0 package for Terra hue palettes and reusable UI. The hue implementation and UI primitives are extracted from the Terra Symposium website.

The package exports reusable controls and surfaces, data-driven `MappedFormFields`, `FormSelect`, and `DataTable` components, and UI primitives including `Button`, `Select`, `ContextMenu`, `DropdownMenu`, `Tooltip`, `ToggleGroup`, `Input`, `Label`, `Separator`, `Spinner`, and the original Docs toolbar frame from `@terra-symposium/styling/ui`. Import `@terra-symposium/styling/global.css` once to include the shared utility classes, fonts, and global base styles. Visual effects are available separately from `@terra-symposium/styling/effects.css`. The host supplies the palette using the hue API, as the Terra Website does during server rendering. The original Tailwind preset is available as `@terra-symposium/styling/tailwind-preset` for hosts that compile additional components.

## Build

```sh
pnpm install
pnpm build
pnpm docs:build
```

The guide is the Markdown and MDX files in [`docs/`](docs/). `@terra-symposium/docs` supplies its Astro site, navigation, search, styling, and 404 page. Run `pnpm docs:dev` to preview it locally; `pnpm docs:build` writes the static site to `dist/docs/`. Component pages include build-cached API docs extracted from their TypeScript source and a related shadcn/ui reference. Agent guidance and skills live in [`docs/agents/`](docs/agents/), with each `SKILL.md` available as the index page for its folder in the Agents section. Relative Markdown links and assets work from the content tree. The published guide is served under `/styling-docs/`.

## Agent skills

UI design, styling, responsive review, and variant workflows live in [`docs/agents/skills/ui/`](docs/agents/skills/ui/SKILL.md).
