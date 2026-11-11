import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  applyHue,
  colors,
  flattenColors,
  getHue,
  invert,
  isDarkMode,
} from "../../src/lib/hue.ts";

describe("color utilities", () => {
  describe("getHue", () => {
    it("preserves explicit section hues", () => {
      assert.strictEqual(getHue("Programming", 145), 145);
    });

    it("derives a stable hue from normalized document labels", () => {
      assert.strictEqual(getHue("Course_Notes.md"), getHue("Course Notes"));
      assert.strictEqual(
        getHue("__Advanced-Topics.mdx"),
        getHue("Advanced Topics"),
      );
      assert.strictEqual(getHue("Programming 1"), getHue("programming_1"));
    });
  });

  describe("invert", () => {
    it("returns null when hue is null", () => {
      assert.strictEqual(invert(null), null);
    });

    it("rotates numeric hue by 150 degrees", () => {
      assert.strictEqual(invert(0), 150);
      assert.strictEqual(invert(100), 250);
    });

    it("wraps around 300 degrees scale", () => {
      assert.strictEqual(invert(200), 50);
    });
  });

  describe("flattenColors", () => {
    it("flattens light and dark scales into variable dictionary", () => {
      const mockScales = {
        light: [
          "10 10 10",
          "20 20 20",
          "30 30 30",
          "40 40 40",
          "50 50 50",
          "60 60 60",
          "70 70 70",
          "80 80 80",
          "90 90 90",
          "100 100 100",
          "110 110 110",
          "120 120 120",
        ] as any,
        dark: [
          "210 210 210",
          "220 220 220",
          "230 230 230",
          "240 240 240",
          "250 250 250",
          "260 260 260",
          "270 270 270",
          "280 280 280",
          "290 290 290",
          "300 300 300",
          "310 310 310",
          "320 320 320",
        ] as any,
      };

      const flatNoPrefix = flattenColors("primary", mockScales, false);
      assert.strictEqual(flatNoPrefix["primaryLight1"], "10 10 10");
      assert.strictEqual(flatNoPrefix["primaryDark12"], "320 320 320");

      const flatWithPrefix = flattenColors("primary", mockScales, true);
      assert.strictEqual(flatWithPrefix["--primaryLight1"], "10 10 10");
      assert.strictEqual(flatWithPrefix["--primaryDark12"], "320 320 320");
    });
  });

  describe("isDarkMode", () => {
    it("returns false in server / non-DOM environment", () => {
      assert.strictEqual(isDarkMode(), false);
    });
  });

  describe("colors", () => {
    it("throws on invalid hue type", () => {
      assert.throws(() => colors("invalid" as any), /Invalid hue/);
    });

    it("returns grayscale scale pair when hue is null", () => {
      const [accent, gray] = colors(null);
      assert.strictEqual(accent.light.length, 12);
      assert.strictEqual(accent.dark.length, 12);
      assert.deepStrictEqual(accent, gray);
    });

    it("generates 12-step RGB scale pairs for valid numeric hue", () => {
      const [primary, gray] = colors(180);
      assert.strictEqual(primary.light.length, 12);
      assert.strictEqual(primary.dark.length, 12);
      assert.strictEqual(gray.light.length, 12);
      assert.strictEqual(gray.dark.length, 12);

      // Each step should be a space-delimited string of 3 integers
      assert.match(primary.light[0]!, /^\d+\s+\d+\s+\d+$/);
    });

    it("handles hue avoidance shift for hues between 70 and 130", () => {
      const [primary70] = colors(70);
      const [unshifted70] = colors(70, { hueAvoidanceShift: 0 });
      assert.notDeepStrictEqual(primary70, unshifted70);
    });
  });

  describe("applyHue", () => {
    afterEach(() => {
      delete (globalThis as any).document;
      delete (globalThis as any).CustomEvent;
      delete (globalThis as any).HTMLElement;
    });

    it("does nothing when document is undefined", () => {
      assert.doesNotThrow(() => applyHue(180));
    });

    it("applies numeric hue palette to document element and dispatches docs:hue-change event", () => {
      class MockElement {
        style = { cssText: "" };
        classList = { contains: () => false };
      }

      const docElement = new MockElement();
      const bodyElement = new MockElement();
      let dispatchedEvent: any = null;

      (globalThis as any).HTMLElement = MockElement;
      (globalThis as any).CustomEvent = class MockCustomEvent {
        type: string;
        detail: any;
        constructor(type: string, opts: any) {
          this.type = type;
          this.detail = opts?.detail;
        }
      };

      (globalThis as any).document = {
        documentElement: docElement,
        body: bodyElement,
        querySelectorAll: () => [],
        dispatchEvent: (event: any) => {
          dispatchedEvent = event;
          return true;
        },
      };

      applyHue(180);

      assert.ok(docElement.style.cssText.includes("--hue: 180"));
      assert.ok(docElement.style.cssText.includes("--primary-1:"));
      assert.ok(docElement.style.cssText.includes("--gray-1:"));
      assert.ok(docElement.style.cssText.includes("--secondary-1:"));

      assert.ok(dispatchedEvent);
      assert.strictEqual(dispatchedEvent.type, "docs:hue-change");
      assert.deepStrictEqual(dispatchedEvent.detail, { hue: 180 });
    });

    it("applies a hue to a scoped workspace without changing the document theme", () => {
      class MockElement {
        style = { cssText: "" };
        classList = { contains: () => false };
        closest = () => null;
        querySelectorAll = () => [];
      }

      const docElement = new MockElement();
      const bodyElement = new MockElement();
      const workspace = new MockElement();
      (globalThis as any).HTMLElement = MockElement;
      (globalThis as any).CustomEvent = class MockCustomEvent {
        constructor(_type: string, _opts: any) {}
      };
      (globalThis as any).document = {
        documentElement: docElement,
        body: bodyElement,
        querySelectorAll: () => [],
        dispatchEvent: () => true,
      };

      applyHue(145, workspace as any);

      assert.ok(workspace.style.cssText.includes("--hue: 145"));
      assert.ok(workspace.style.cssText.includes("--secondary-3: 241 240 248"));
      assert.strictEqual(docElement.style.cssText, "");
      assert.strictEqual(bodyElement.style.cssText, "");
    });

    it("applies null hue palette with --hue: 0", () => {
      class MockElement {
        style = { cssText: "" };
        classList = { contains: () => false };
      }

      const docElement = new MockElement();
      let dispatchedEvent: any = null;

      (globalThis as any).HTMLElement = MockElement;
      (globalThis as any).CustomEvent = class MockCustomEvent {
        type: string;
        detail: any;
        constructor(type: string, opts: any) {
          this.type = type;
          this.detail = opts?.detail;
        }
      };

      (globalThis as any).document = {
        documentElement: docElement,
        body: null,
        querySelectorAll: () => [],
        dispatchEvent: (event: any) => {
          dispatchedEvent = event;
          return true;
        },
      };

      applyHue(null);

      assert.ok(docElement.style.cssText.includes("--hue: 0"));
      assert.ok(dispatchedEvent);
      assert.strictEqual(dispatchedEvent.type, "docs:hue-change");
      assert.deepStrictEqual(dispatchedEvent.detail, { hue: null });
    });
  });
});
