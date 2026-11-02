# Terra Styling

A shared React UI and design system for Terra projects, with reusable components, design tokens, hue theming, and a Tailwind preset. Package exports also provide separate original Terra UI components and CSS entry points.

## Getting started

Requires Node.js and pnpm. From the repository root, install dependencies and build the package:

```sh
pnpm install
pnpm build
```

The build generates distributable files in `dist/`. See the component and installation guides before consuming the package.

### Commands

From the repository root, run `pnpm typecheck` and `pnpm test`.

## Security and Limitations

Bundled font files have third-party licenses; review the font notices before redistributing those assets. Package source and font assets can have different terms.

## Structure

`src/ui/` exports React components; `src/lib/` provides tokens, hue utilities, and the Tailwind preset. `docs/` contains component guides and `package.json` declares public exports.

## References

- [Component guide](docs/content/components.md)
- [Installation guide](docs/content/installation.md)
- [Package exports](package.json)
- [Apache-2.0 license](LICENSE)

## Contributing

Add a changeset for package-facing changes.

## Credits and license

Package source is licensed under [Apache-2.0](LICENSE). Bundled fonts retain their separate third-party license terms.
