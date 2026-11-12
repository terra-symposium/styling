/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import assert from "node:assert/strict";

// TEST RUNNER
import test from "node:test";

/*//////////////////////////////////////////////////
TESTS
//////////////////////////////////////////////////*/

test.describe("public UI entry contract", publicUiEntryContract);

/** Registers the published UI entry checks for existing package hosts. */
function publicUiEntryContract(): void {
  test(
    "the public UI entry keeps the shared hue API available to existing hosts",
    publicUiEntryKeepsHueAndComponentExports,
  );
}

/** Checks the generated package entry exports its hue utilities and core UI. */
async function publicUiEntryKeepsHueAndComponentExports(): Promise<void> {
  const ui = await import("../../../dist/ui/index.js");
  for (const name of [
    "colors",
    "invert",
    "isDarkMode",
    "applyHue",
    "flattenColors",
    "getHue",
  ])
    assert.equal(
      typeof ui[name as keyof typeof ui],
      "function",
      `${name} must be exported from @terra-symposium/styling/ui`,
    );
  assert.equal(typeof ui.cn, "function");
  assert.ok(ui.Button);
}
