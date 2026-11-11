#!/usr/bin/env node

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { fileURLToPath } from "node:url";
import { runQualityFromCfg } from "@terra-symposium/standards-quality/cli";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const configPath = fileURLToPath(
  new URL("../config/quality.json", import.meta.url),
);
await runQualityFromCfg(configPath, process.argv.slice(2));
