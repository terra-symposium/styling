/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// TEST RUNNER
import test from "node:test";

// SOURCE UNDER TEST
import {
  ACTION_VARIANTS,
  DISABLED_STATE_VARIANTS,
  FOCUS_VISIBLE_VARIANTS,
  FORM_CONTROL_VARIANTS,
  FORM_LABEL_VARIANTS,
  INTERACTIVE_CONTROL_VARIANTS,
  MENU_ITEM,
  MENU_ITEM_INDICATOR,
  OVERLAY_MOTION_VARIANTS,
  OVERLAY_SURFACE_VARIANTS,
  RADIX_SIDE_POSITION_VARIANTS,
  SURFACE_VARIANTS,
  TEXT_VARIANTS,
  TOGGLE_VARIANTS,
  menuItemVariants,
} from "../../../src/components/ui/variants.ts";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const repo = process.cwd();
const colors = [
  "primary",
  "secondary",
  "gray",
  "destructive",
  "success",
  "caution",
] as const;
const uiSizes = ["xs", "sm", "md", "lg", "xl"] as const;
const actionTypes = [
  "default",
  "outline",
  "ghost",
  "tonal",
  "glass",
  "underline",
] as const;
const surfaceTypes = [
  "outline",
  "ghost",
  "tonal",
  "saturated",
  "glass",
] as const;
const formTypes = ["default", "outline", "ghost", "tonal"] as const;
const toggleTypes = ["default", "outline", "ghost", "tonal"] as const;

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/** Builds the CVA key for a color and treatment pair.
 *
 * @param color Palette family used by the variant.
 * @param treatment Named visual treatment for that palette.
 *
 * @returns The default palette key or combined palette-treatment key.
 */
function matrixKey(color: string, treatment: string): string {
  return treatment === "default" ? color : `${color}-${treatment}`;
}

/** Reads a source file for component-consumer contract assertions.
 *
 * @param file Repository-relative source path.
 *
 * @returns The file contents as UTF-8 text.
 */
function source(file: string): string {
  return readFileSync(join(repo, file), "utf8");
}

/** Fails with the contract name when a shared variant does not produce classes.
 *
 * @param value Generated classes returned by a shared variant.
 * @param name Variant contract label included in assertion failures.
 */
function hasClasses(value: string | undefined, name: string): void {
  assert.ok(value?.trim(), `${name} should generate classes`);
}

/** Ensures a selected matrix entry does not fall back to its canonical default.
 *
 * @param value Classes returned by the selected variant.
 * @param baseline Classes returned by the canonical default variant.
 * @param name Variant contract label included in assertion failures.
 */
function hasDistinctClasses(
  value: string | undefined,
  baseline: string | undefined,
  name: string,
): void {
  hasClasses(value, name);
  assert.notEqual(value, baseline, `${name} should select its own classes`);
}

/*//////////////////////////////////////////////////
TESTS
//////////////////////////////////////////////////*/

test.describe("shared UI variant contracts", sharedUiVariantContracts);

/** Registers the independent matrix, primitive, and consumer contracts. */
function sharedUiVariantContracts(): void {
  // VARIANT MATRICES
  test(
    "action, surface, form-control, and toggle matrices generate every valid color/treatment/size combination",
    validVariantMatricesGenClasses,
  );

  // ALIASES AND SEMANTIC FEEDBACK
  test(
    "legacy aliases, button icon sizes, and semantic feedback remain available",
    legacyAliasesAndSemanticFeedbackRemainAvailable,
  );

  // SHARED CLASS CONTRACTS
  test(
    "text, label, interaction, overlay, and menu contracts generate shared classes",
    sharedClassContractsGenClasses,
  );

  // MULTIPLE CONSUMERS AND LOCAL CONTRACTS
  test(
    "shared exports retain multiple UI consumers and one-off contracts live with their components",
    sharedExportsRetainConsumersAndLocalContracts,
  );
}

/**
 * Every non-default matrix coordinate must differ from CVA's canonical fallback
 * so a missing key cannot pass on the shared base classes alone.
 */
function validVariantMatricesGenClasses(): void {
  for (const color of colors) {
    for (const treatment of actionTypes) {
      for (const size of uiSizes) {
        const name = `action ${color}/${treatment}/${size}`;
        const value = ACTION_VARIANTS({
          variant: matrixKey(color, treatment) as never,
          size,
        });
        if (color === "primary" && treatment === "default")
          hasClasses(value, name);
        else {
          hasDistinctClasses(
            value,
            ACTION_VARIANTS({ variant: "primary-default", size }),
            name,
          );
        }
      }
    }
    for (const treatment of surfaceTypes) {
      for (const size of uiSizes) {
        const name = `surface ${color}/${treatment}/${size}`;
        hasDistinctClasses(
          SURFACE_VARIANTS({
            variant: matrixKey(color, treatment) as never,
            size,
          }),
          SURFACE_VARIANTS({ variant: "primary-default", size }),
          name,
        );
      }
    }
    for (const treatment of formTypes) {
      for (const size of uiSizes) {
        const name = `form ${color}/${treatment}/${size}`;
        const value = FORM_CONTROL_VARIANTS({
          variant: matrixKey(color, treatment) as never,
          size,
        });
        if (color === "primary" && treatment === "default")
          hasClasses(value, name);
        else {
          hasDistinctClasses(
            value,
            FORM_CONTROL_VARIANTS({ variant: "primary", size }),
            name,
          );
        }
      }
    }
    for (const treatment of toggleTypes) {
      for (const size of uiSizes) {
        const name = `toggle ${color}/${treatment}/${size}`;
        const value = TOGGLE_VARIANTS({
          variant: matrixKey(color, treatment) as never,
          size,
        });
        if (color === "primary" && treatment === "default")
          hasClasses(value, name);
        else {
          hasDistinctClasses(
            value,
            TOGGLE_VARIANTS({ variant: "primary", size }),
            name,
          );
        }
      }
    }
  }

  for (const size of uiSizes) {
    if (size === "md") continue;
    assert.notEqual(
      ACTION_VARIANTS({ variant: "primary", size }),
      ACTION_VARIANTS({ variant: "primary", size: "md" }),
      `action size ${size} should select its own classes`,
    );
    assert.notEqual(
      SURFACE_VARIANTS({ variant: "primary", size }),
      SURFACE_VARIANTS({ variant: "primary", size: "md" }),
      `surface size ${size} should select its own classes`,
    );
    assert.notEqual(
      FORM_CONTROL_VARIANTS({ variant: "primary", size }),
      FORM_CONTROL_VARIANTS({ variant: "primary", size: "md" }),
      `form size ${size} should select its own classes`,
    );
    assert.notEqual(
      TOGGLE_VARIANTS({ variant: "primary", size }),
      TOGGLE_VARIANTS({ variant: "primary", size: "md" }),
      `toggle size ${size} should select its own classes`,
    );
  }
}

/**
 * Semantic statuses retain their palette family while legacy action and toggle
 * aliases remain resolvable.
 */
function legacyAliasesAndSemanticFeedbackRemainAvailable(): void {
  for (const variant of [
    "default",
    "outline",
    "ghost",
    "tonal",
    "ghost-destructive",
    "underline",
  ] as const) {
    hasClasses(ACTION_VARIANTS({ variant }), `action alias ${variant}`);
  }
  for (const size of ["icon", "icon-sm", "default"] as const)
    hasClasses(ACTION_VARIANTS({ size }), `button size ${size}`);
  for (const variant of [
    "default",
    "outline",
    "ghost",
    "tonal",
    "ghost-destructive",
  ] as const)
    hasClasses(TOGGLE_VARIANTS({ variant }), `toggle alias ${variant}`);
  for (const variant of [
    "correct",
    "error",
    "info",
    "success",
    "warning",
    "transparent",
    "dark",
  ] as const)
    hasClasses(SURFACE_VARIANTS({ variant }), `surface status ${variant}`);
  assert.match(SURFACE_VARIANTS({ variant: "correct" }), /emerald/);
  assert.match(SURFACE_VARIANTS({ variant: "success" }), /emerald/);
  assert.match(SURFACE_VARIANTS({ variant: "warning" }), /amber/);
  assert.match(SURFACE_VARIANTS({ variant: "info" }), /sky/);
}

/**
 * The common interaction, typography, overlay, and menu recipes must remain
 * nonempty for components that compose them.
 */
function sharedClassContractsGenClasses(): void {
  hasClasses(
    TEXT_VARIANTS({ tone: "muted", size: "md", weight: "medium" }),
    "text",
  );
  hasClasses(FORM_LABEL_VARIANTS(), "form label");
  hasClasses(FOCUS_VISIBLE_VARIANTS(), "focus-visible");
  hasClasses(DISABLED_STATE_VARIANTS({ target: "native" }), "native disabled");
  hasClasses(DISABLED_STATE_VARIANTS({ target: "data" }), "data disabled");
  hasClasses(DISABLED_STATE_VARIANTS({ target: "aria" }), "ARIA disabled");
  hasClasses(INTERACTIVE_CONTROL_VARIANTS(), "interactive control");
  hasClasses(OVERLAY_SURFACE_VARIANTS(), "overlay surface");
  hasClasses(OVERLAY_MOTION_VARIANTS(), "overlay motion");
  hasClasses(RADIX_SIDE_POSITION_VARIANTS(), "Radix side position");
  hasClasses(menuItemVariants({ intent: "destructive" }), "menu item intent");
  hasClasses(MENU_ITEM, "menu item highlight");
  hasClasses(MENU_ITEM_INDICATOR, "menu item indicator");
}

/**
 * Multi-consumer recipes stay centralized while styles with one consumer remain
 * in their owning component modules.
 */
function sharedExportsRetainConsumersAndLocalContracts(): void {
  const consumers: Record<string, string[]> = {
    // Button and ButtonLink both call this contract from the same module.
    ACTION_VARIANTS: [
      "src/components/ui/button.tsx",
      "src/components/ui/button.tsx",
    ],
    FOCUS_VISIBLE_VARIANTS: [
      "src/components/ui/dialog.tsx",
      "src/components/ui/tabs.tsx",
    ],
    DISABLED_STATE_VARIANTS: [
      "src/components/ui/variants.ts",
      "src/components/ui/dialog.tsx",
    ],
    TOGGLE_VARIANTS: [
      "src/components/ui/toggle.tsx",
      "src/components/ui/toggle-group.tsx",
    ],
    SURFACE_VARIANTS: [
      "src/components/ui/alert.tsx",
      "src/components/ui/badge.tsx",
      "src/components/ui/card.tsx",
      "src/components/ui/dialog.tsx",
      "src/components/ui/drawer.tsx",
      "src/components/ui/radio-group.tsx",
      "src/components/ui/sheet.tsx",
    ],
    FORM_CONTROL_VARIANTS: [
      "src/components/ui/input.tsx",
      "src/components/ui/select.tsx",
      "src/components/ui/textarea.tsx",
    ],
    INTERACTIVE_CONTROL_VARIANTS: [
      "src/components/ui/checkbox.tsx",
      "src/components/ui/radio-group.tsx",
      "src/components/ui/slider.tsx",
      "src/components/ui/switch.tsx",
    ],
    FORM_LABEL_VARIANTS: [
      "src/components/ui/form.tsx",
      "src/components/ui/label.tsx",
    ],
    TEXT_VARIANTS: [
      "src/components/ui/input.tsx",
      "src/components/ui/tooltip.tsx",
    ],
    OVERLAY_SURFACE_VARIANTS: [
      "src/components/ui/context-menu.tsx",
      "src/components/ui/dropdown-menu.tsx",
      "src/components/ui/popover.tsx",
      "src/components/ui/select.tsx",
      "src/components/ui/tooltip.tsx",
    ],
    OVERLAY_MOTION_VARIANTS: [
      "src/components/ui/context-menu.tsx",
      "src/components/ui/dropdown-menu.tsx",
      "src/components/ui/popover.tsx",
      "src/components/ui/select.tsx",
      "src/components/ui/tooltip.tsx",
    ],
    RADIX_SIDE_POSITION_VARIANTS: [
      "src/components/ui/context-menu.tsx",
      "src/components/ui/dropdown-menu.tsx",
      "src/components/ui/popover.tsx",
      "src/components/ui/select.tsx",
      "src/components/ui/tooltip.tsx",
    ],
    menuItemVariants: [
      "src/components/ui/context-menu.tsx",
      "src/components/ui/dropdown-menu.tsx",
    ],
    MENU_ITEM: [
      "src/components/ui/context-menu.tsx",
      "src/components/ui/dropdown-menu.tsx",
    ],
    MENU_ITEM_INDICATOR: [
      "src/components/ui/context-menu.tsx",
      "src/components/ui/dropdown-menu.tsx",
    ],
  };
  for (const [contract, files] of Object.entries(consumers)) {
    assert.ok(
      files.length > 1,
      `${contract} should have at least two component consumers`,
    );
    let usages = 0;
    for (const file of files) {
      const matches =
        source(file).match(new RegExp(`\\b${contract}\\b`, "g")) ?? [];
      assert.ok(matches.length > 0, `${file} should consume ${contract}`);
      usages += matches.length;
    }
    assert.ok(
      usages > 1,
      `${contract} should be used by multiple UI components`,
    );
  }

  const shared = source("src/components/ui/variants.ts");
  for (const local of [
    "BADGE_VARIANTS",
    "buttonGroupVariants",
    "InputOTPPattern",
    "INPUT_VARIANT_SIZE_CLASSES",
  ]) {
    assert.doesNotMatch(
      shared,
      new RegExp(`export const ${local}\\b`),
      `${local} should not be exported as a shared contract`,
    );
  }
  assert.match(
    source("src/components/ui/badge.tsx"),
    /cva\(\s*["']inline-flex[\s\S]*?defaultVariants:\s*\{/,
  );
  assert.match(
    source("src/components/ui/button-group.tsx"),
    /const BUTTON_GROUP_VARIANTS\s*=/,
  );
}
