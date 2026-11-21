/**
 * tests/components/ui/entry.test.ts
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import assert from 'node:assert/strict';

// TEST RUNNER
import test from 'node:test';

/*//////////////////////////////////////////////////
TESTS
//////////////////////////////////////////////////*/

test.describe('public UI entry contract', publicUiEntryContract);

// hygiene-ignore single-use -- Keep publicUiEntryContract as a named declaration so its authored TSDoc stays attached. TSDoc: Registers the published UI entry checks for existing package hosts.
/**
 * Registers the published UI entry checks for existing package hosts.
 */
function publicUiEntryContract(): void {
	test('the public UI entry keeps the shared hue API available to existing hosts', publicUiEntryKeepsHueAndCompExports);
}

// hygiene-ignore single-use -- Keep publicUiEntryKeepsHueAndComponentExports as a named declaration so its authored TSDoc stays attached. TSDoc: Checks the generated package entry exports its hue utilities and core UI.
/**
 * Checks the generated package entry exports its hue utilities and core UI.
 */
async function publicUiEntryKeepsHueAndCompExports(): Promise<void> {
	const ui = await import('../../../dist/ui/index.js');
	for (const name of ['colors', 'invert', 'isDarkMode', 'applyHue', 'flattenColors', 'getHue'])
		assert.equal(typeof ui[name as keyof typeof ui], 'function', `${name} must be exported from @terra-symposium/styling/ui`);
	assert.equal(typeof ui.cn, 'function');
	assert.ok(ui.Button);
}
