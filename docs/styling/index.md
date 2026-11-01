---
sidebar:
  label: Styling
  order: 1
---

# Terra Styling

Terra Styling is a React component and theming package extracted from the Terra Symposium website. It provides reusable UI components, shared color and treatment variants, hue-based palettes, and form and data-display helpers.

## Start here

- [Install the package](/styling/installation/installation/) and load its global stylesheet.
- Browse the [component guide](/styling/components/guide/), individual component pages in the Components group, or the [color and treatment matrix](/styling/matrices/color-treatment/).
- Read [Hue and themes](/styling/hue/hue/) for the color API.
- Use the [repository guide](/styling/repository-guide/repository-guide/) when developing the package itself.

## Package at a glance

The public entry points are `@terra-symposium/styling` for hue utilities, `@terra-symposium/styling/ui` for shared controls and compositions, and `@terra-symposium/styling/tailwind-preset` for host applications that compile additional Tailwind classes. Import `@terra-symposium/styling/global.css` once in the application to load the shared component utilities and global base styles.

The package requires React and React DOM 19 or later within the declared `^19.0.0` peer range. The examples in this guide use the public package entry points.

## Contributing

This repository contains the package source and the Styling guide. Follow the [repository guide](/styling/repository-guide/repository-guide/) for setup, checks, docs development, and release preparation.
