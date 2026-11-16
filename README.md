# Terra Styling

Terra Styling gives Terra projects a consistent set of reusable interface building blocks.

## Get started

### Build

```sh
pnpm install
pnpm run build
pnpm run docs:build
```

The guide content lives in [`docs/`](docs/). `@terra-symposium/docs` supplies its Astro site, navigation, search, styling, and 404 page. Run `pnpm run docs` to preview it locally or `pnpm run docs:build` to write the static site to `dist/docs/`. The Components catalog shows live previews for every exported component family. One generated detail route serves every component slug, with API references extracted from TypeScript exports and JSDoc. Agent workflows live in [`.agents/skills/`](.agents/skills/); the guide links to them where relevant. Relative Markdown links and assets work from the content tree. The published guide is served under `/styling-docs/`.

## Usage

The package exports reusable controls and surfaces, data-driven `MappedFormFields`, `FormSelect`, and `DataTable` components, and UI primitives including `Button`, `Select`, `ContextMenu`, `DropdownMenu`, `Tooltip`, `ToggleGroup`, `Input`, `Label`, `Separator`, `Spinner`, and the original Docs toolbar frame from `@terra-symposium/styling/ui`. Import `@terra-symposium/styling/global.css` once to include the shared utility classes, fonts, and global base styles. Visual effects are available separately from `@terra-symposium/styling/effects.css`. The host supplies the palette using the hue API, as the Terra Website does during server rendering. The original Tailwind preset is available as `@terra-symposium/styling/tailwind-preset` for hosts that compile additional components.

### Agent skills

UI design, styling, responsive review, and variant workflows live in [`.agents/skills/ui/`](.agents/skills/ui/SKILL.md).

## Validation

| Command                | Checks                        |
| ---------------------- | ----------------------------- |
| `pnpm run quality`     | Changed and untracked files   |
| `pnpm run quality:all` | Full configured Quality scope |
| `pnpm run test`        | Project test suite            |
| `pnpm run build`       | Build output                  |

Quality can apply safe fixes; review the diff before committing. No separate browser or Playwright test command is defined here.

## Contributing

Open a pull request against `development` and review the results of [`check.yml`](.github/workflows/check.yml) before merging. Keep unrelated changes out of the pull request.
