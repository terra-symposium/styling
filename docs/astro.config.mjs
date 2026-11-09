import { terraErrorBoundaryIntegration as __terraErrorBoundaryIntegration } from '@terra-symposium/standards-error-boundaries/astro-integration';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));

export default defineConfig({
  site: 'https://kaimacann.netlify.app',
  base: process.env.ASTRO_BASE_PATH ?? '/styling-docs',
  outDir: '../site-dist',
  integrations: [__terraErrorBoundaryIntegration(), react()],
  vite: {
    optimizeDeps: {
      // The Docs tarball lives outside the app source scan. Prebundle its entry
      // and CJS subpath dependencies so island hydration gets ESM interop.
      include: [
        '@terra-symposium/docs/local-workspace',
        '@terra-symposium/docs > @dagrejs/dagre',
        '@terra-symposium/docs > sanitize-html',
        'debug',
        'react/compiler-runtime',
        'react-dom/server',
        'use-sync-external-store/shim',
        'use-sync-external-store/shim/with-selector',
        'use-sync-external-store/shim/with-selector.js',
      ],
    },
    resolve: {
      alias: [
        { find: '@terra-symposium/styling/ui/terra-original', replacement: `${dist}components/ui/index.js` },
        { find: '@terra-symposium/styling/ui.css', replacement: `${dist}ui.css` },
        { find: '@terra-symposium/styling/ui', replacement: `${dist}ui/index.js` },
        { find: '@terra-symposium/styling', replacement: `${dist}lib/index.js` },
      ],
    },
  },
});
