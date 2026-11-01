# Installation

Install the published package from the npm registry:

```sh
pnpm add @terra-symposium/styling
```

The package declares React and React DOM as peer dependencies. Install React 19 or later in the application if they are not already present.

## Load the stylesheet

Import the shared UI stylesheet once from the application entry point:

```tsx
import '@terra-symposium/styling/global.css';
```

The stylesheet includes the shared utility classes, base styles, fonts, and Docs typography. It does not set a fixed palette: provide CSS variables from the host's hue system or call `applyHue(hue)` from the package API.

Visual effects are separate from the global stylesheet. Import them only when you use effect utilities such as `grain`, `animate-crt`, or `shake`:

```tsx
import '@terra-symposium/styling/effects.css';
```

## Import components and theme helpers

```tsx
import { useEffect } from 'react';
import { applyHue } from '@terra-symposium/styling';
import { Button, Card, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@terra-symposium/styling/ui';
import '@terra-symposium/styling/global.css';

export function Example() {
  useEffect(() => {
    applyHue(220);
  }, []);

  return (
    <Card variant='primary-tonal'>
      <Button variant='primary-glass'>Open workspace</Button>
      <Input aria-label='Workspace name' defaultValue='Terra Symposium' />
    </Card>
  );
}

```

The `ui` entry point exports the shared primitives, form compositions, data table, public variant contracts, and associated types. Import hue utilities from the package root.

## Optional Tailwind preset

Most applications can use the prebuilt `global.css` stylesheet directly. If the host compiles additional Styling classes with Tailwind, it can extend its configuration with the package preset:

```js
import terraStyling from '@terra-symposium/styling/tailwind-preset';

export default {
  presets: [terraStyling],
};
```

See the [component guide](/styling/components/guide/) for variants and component families, and the [Hue and themes guide](/styling/hue/hue/) for scoped palettes.
