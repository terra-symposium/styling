# Repository guide

This guide is for contributors working on the `@terra-symposium/styling` package. The repository builds the publishable library from `src/` and the Styling reference site from `docs/`.

## Repository map

```text
src/
  assets/fonts/       Font files and their licenses
  components/
    ui/               Shared React primitives and variant contracts
    data-table.tsx    Data-driven table composition
    field.tsx         Field and validation helpers
    forms.tsx         Data-driven form compositions
  lib/                Hue utilities, types, and Tailwind preset
  styles/             Tokens and source stylesheets
docs/
  content/             Markdown guide pages
  src/components/      Interactive docs components
  src/pages/           Astro routes
  src/styles/          Docs-specific styles
test/
  components/ui/       UI component checks
  lib/                 Hue and utility checks
```

The package root exports hue utilities. The `./ui` entry point exports shared components, variants, and types. Build output and package declarations are generated in `dist/`.

## Requirements

- Node.js compatible with the Astro toolchain in the lockfile.
- pnpm, using the version declared by the project or CI.
- Network access to install dependencies from the npm registry.

## Install and build

```sh
pnpm install
pnpm build
pnpm typecheck
```

`pnpm build` rebuilds `dist/`, emits type declarations and CSS, and compiles the package styles. `pnpm typecheck` runs the TypeScript compiler without emitting output.

## Run and build the docs

```sh
pnpm docs:dev
pnpm docs:build
```

`pnpm docs:dev` builds the package first, then starts the Astro docs app at the local root. `pnpm docs:build` builds the package and writes the static docs site to `dist/docs/`. The Astro config aliases Styling imports to this checkout's `dist/`, so local source changes appear in the guide and component gallery.

Add guide pages as Markdown files in `docs/content/` and register them in `docs/pages.mjs`. That catalog supplies route metadata and the navigation tree used by the Docs workspace. The interactive gallery is implemented in `docs/src/components/ComponentShowcase.tsx`.

## Checks

```sh
pnpm test
git diff --check
```

`pnpm test` builds the package and runs the Node test files under `test/lib/` and `test/components/ui/`. Run it after changing shared component or hue behavior. Use `git diff --check` before sending a change to catch whitespace errors.

## Component and style contributions

- Read the owning component, its public prop types, the shared variant contracts, and the relevant checks before changing behavior.
- Keep color and treatment choices in the typed component `variant` prop. Keep layout-specific geometry in the component or docs stylesheet.
- Use static class strings so Tailwind can discover them during CSS generation.
- Preserve accessible names, keyboard behavior, visible focus, disabled and invalid states, and responsive layouts.
- Add or update Markdown when a public export, supported variant, default, or setup step changes.
- Run the package build and the narrowest relevant checks; visually inspect the docs route when the change affects presentation.

The repository UI workflow is documented in `.agents/styling/skills/skills/ui/SKILL.md`.

## Versioning and release preparation

This package uses Changesets. Create a changeset for a releasable package change, then update package versions and changelogs:

```sh
pnpm changeset
pnpm version-packages
```

Review the generated changeset and version updates before publishing. The package is configured for public registry access. Publishing is a separate release action.
