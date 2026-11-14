import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
mkdirSync(dist, { recursive: true });
for (const entry of readdirSync(dist)) {
	if (entry !== 'cache') rmSync(join(dist, entry), { recursive: true, force: true });
}
