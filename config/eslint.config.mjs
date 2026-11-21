/**
 * config/eslint.config.mjs
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	js.configs.recommended,
	...tseslint.configs.recommended,
	{ rules: { '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }] } },
	{ files: ['**/*.cjs'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
	{ files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
];
