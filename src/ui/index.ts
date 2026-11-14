/**
 * src/ui/index.ts
 * Public entry point for shared Styling utilities, components, and theme types.
 */

/*//////////////////////////////////////////////////
EXPORTS
//////////////////////////////////////////////////*/

// UTILITIES
export { cn, transformChildrenToString } from '../lib/cn.js';

// DOCUMENTATION COMPONENTS
export { DocsToolbarFrame } from '../components/docs/toolbar-frame.js';

// UI COMPONENTS
export * from '../components/ui/index.js';

// THEME UTILITIES
export { colors, invert, isDarkMode, applyHue, flattenColors, getHue } from '../lib/hue.js';

// THEME TYPES
export type { ArrayOf12, ColorGenOpts, ColorScales } from '../lib/types.js';
