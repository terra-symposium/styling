#!/usr/bin/env node
/**
 * scripts/hygiene.mjs
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { fileURLToPath } from 'node:url';
import { runQualityFromCfg } from '@terra-symposium/hygiene/cli';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

await runQualityFromCfg(fileURLToPath(new URL('../config/quality.json', import.meta.url)), process.argv.slice(2));
