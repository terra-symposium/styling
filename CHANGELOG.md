# @terra-symposium/styling

## 0.1.28

### Patch Changes

- Add data-driven form and table renderers, consolidate Salesphere UI components, and support the shared primary and secondary hue palettes.

## 0.1.26

### Patch Changes

- Include the canonical Typography prose component styles in the shared Docs base stylesheet.
- Restore hue and theme exports from the shared `@terra-symposium/styling/ui` entry used by existing hosts.
- Compile the shared primitive and effect styles through the original PostCSS nesting pipeline so published CSS matches the source cascade.
- Restore the original antialiased text rendering in the shared Docs base styles.

## 0.1.20

### Patch Changes

- Expose the primitive base separately so Docs can compile shared responsive utilities in one cascade.

## 0.1.19

### Patch Changes

- 1b62625: Ship the restored global UI cascade and font assets through the versioned Styling package.
  ---
- Restore the original Docs base, component, and typography styles in the shared Styling package, including the original font assets and Docs-only preflight entrypoint.
