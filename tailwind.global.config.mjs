import preset from './dist/lib/tailwind-preset.js';

export default {
  presets: [preset],
  content: ['./src/components/**/*.{ts,tsx}'],
  // Docs and component utilities share one generated stylesheet.
  safelist: ['prose'],
  corePlugins: { preflight: true },
};
