/**
 * test/components/ui/variants.test.ts
 * Verifies shared variant contracts and their component consumers.
 */

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
const colors = ["primary", "secondary", "gray", "destructive"] as const;
const uiSizes = ["xs", "sm", "md", "lg", "xl"] as const;
const actionTypes = [
  "default",
  "outline",
  "ghost",
  "tonal",
  "link",
  "underline",
] as const;
const surfaceTypes = [
  "default",
  "outline",
  "ghost",
  "tonal",
  "saturated",
] as const;
const formTypes = ["default", "outline", "ghost", "tonal"] as const;
const toggleTypes = ["default", "outline", "ghost", "tonal"] as const;

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

const matrixKey = (color: string, treatment: string): string =>
  treatment === "default" ? color : `${color}-${treatment}`;
const source = (file: string): string => readFileSync(join(repo, file), "utf8");
const hasClasses = (value: string | undefined, name: string): void =>
  assert.ok(value?.trim(), `${name} should generate classes`);

/*//////////////////////////////////////////////////
TESTS
//////////////////////////////////////////////////*/

test.describe("shared UI variant contracts", () => {
  // VARIANT MATRICES
  test("action, surface, form-control, and toggle matrices generate every valid color/treatment/size combination", () => {
    for (const color of colors) {
      for (const treatment of actionTypes) {
        for (const size of uiSizes)
          hasClasses(
            ACTION_VARIANTS({
              variant: matrixKey(color, treatment) as never,
              size,
            }),
            `action ${color}/${treatment}/${size}`,
          );
      }
      for (const treatment of surfaceTypes) {
        for (const size of uiSizes)
          hasClasses(
            SURFACE_VARIANTS({
              variant: matrixKey(color, treatment) as never,
              size,
            }),
            `surface ${color}/${treatment}/${size}`,
          );
      }
      for (const treatment of formTypes) {
        for (const size of uiSizes)
          hasClasses(
            FORM_CONTROL_VARIANTS({
              variant: matrixKey(color, treatment) as never,
              size,
            }),
            `form ${color}/${treatment}/${size}`,
          );
      }
      for (const treatment of toggleTypes) {
        for (const size of uiSizes)
          hasClasses(
            TOGGLE_VARIANTS({
              variant: matrixKey(color, treatment) as never,
              size,
            }),
            `toggle ${color}/${treatment}/${size}`,
          );
      }
    }
  });

  // ALIASES AND SEMANTIC FEEDBACK
  test("legacy aliases, button icon sizes, and semantic feedback remain available", () => {
    for (const variant of [
      "default",
      "outline",
      "ghost",
      "tonal",
      "ghost-destructive",
      "inline",
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
  });

  // SHARED CLASS CONTRACTS
  test("text, label, interaction, overlay, and menu contracts generate shared classes", () => {
    hasClasses(
      TEXT_VARIANTS({ tone: "muted", size: "md", weight: "medium" }),
      "text",
    );
    hasClasses(FORM_LABEL_VARIANTS(), "form label");
    hasClasses(FOCUS_VISIBLE_VARIANTS(), "focus-visible");
    hasClasses(
      DISABLED_STATE_VARIANTS({ target: "native" }),
      "native disabled",
    );
    hasClasses(DISABLED_STATE_VARIANTS({ target: "data" }), "data disabled");
    hasClasses(DISABLED_STATE_VARIANTS({ target: "aria" }), "ARIA disabled");
    hasClasses(INTERACTIVE_CONTROL_VARIANTS(), "interactive control");
    hasClasses(OVERLAY_SURFACE_VARIANTS(), "overlay surface");
    hasClasses(OVERLAY_MOTION_VARIANTS(), "overlay motion");
    hasClasses(RADIX_SIDE_POSITION_VARIANTS(), "Radix side position");
    hasClasses(menuItemVariants({ intent: "destructive" }), "menu item intent");
    hasClasses(MENU_ITEM, "menu item highlight");
    hasClasses(MENU_ITEM_INDICATOR, "menu item indicator");
  });

  // MULTIPLE CONSUMERS AND LOCAL CONTRACTS
  test("shared exports retain multiple UI consumers and one-off contracts live with their components", () => {
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
  });
});
