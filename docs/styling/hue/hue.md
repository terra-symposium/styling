# Hue and themes

The package root exports `colors`, `invert`, `flattenColors`, `applyHue`, `isDarkMode`, and `getHue`. These helpers generate and apply the primary, secondary, and neutral color scales used by the UI components.

## Generate palettes

`colors(hue)` returns a tuple containing accent and gray scales. Each scale has twelve light values and twelve dark values. Passing `null` generates grayscale scales. Hue values are degrees.

```ts
import { colors } from '@terra-symposium/styling';

const [accent, gray] = colors(220);
const lightAccent = accent.light;
const darkAccent = accent.dark;
```

`invert(hue)` returns a complementary hue for generating the secondary palette. `flattenColors(name, scale, prefix?)` converts a scale to a flat map of color variables. Set `prefix` to `true` when the keys should include the CSS custom property prefix.

## Apply a theme

`applyHue(hue)` applies the generated palette to the document. Pass an element to scope the variables to that part of the page.

```tsx
import { useEffect, useRef } from 'react';
import { applyHue } from '@terra-symposium/styling';

function ThemePreview() {
  const preview = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preview.current) applyHue(220, preview.current);
  }, []);

  return <div ref={preview}>The scoped primary, secondary, and gray palette</div>;
}
```

The active light or dark scale follows the nearest explicit `.dark` or `.light` class, then the document theme class, then the operating-system preference. Applying a hue dispatches a `docs:hue-change` event on the document for consumers that need to refresh derived values.

## Theme helpers

- `isDarkMode(scope?)` reports the active theme using the same scoped and system preference rules.
- `getHue(title, hue?)` returns the provided hue or a stable hue derived from a title.
- `flattenColors(name, scale, prefix?)` creates a flat map from a light/dark color scale.

The generated UI stylesheet provides the package defaults. Use `applyHue` when an application needs a different accent palette at runtime.
