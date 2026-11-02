import assert from "node:assert/strict";
import test from "node:test";

test("the public UI entry keeps the shared hue API available to existing hosts", async () => {
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
});
