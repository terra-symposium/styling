import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import { applyHue, colors, flattenColors, getHue, invert, isDarkMode } from '../../src/lib/hue.ts';
import type { ColorScales } from '../../src/lib/types.ts';

/** CSS class-list stub used by the document and element test doubles. */
class MockClassList {
	/**
	 * Reports that no test element has a theme class.
	 *
	 * @param _className - Class name checked by the DOM API.
	 * @return `false` because these fixtures do not declare theme classes.
	 */
	contains(_className: string): boolean {
		return false;
	}
}

/** Minimal HTMLElement stand-in exposing the style and query APIs used by applyHue. */
class MockElement {
	style = { cssText: '' };
	classList = new MockClassList();

	/**
	 * Returns no ancestor because the fixture has no nested theme boundary.
	 *
	 * @param _selector - Ancestor selector requested by the DOM API.
	 * @return `null` because the fixture has no ancestor chain.
	 */
	closest(_selector: string): null {
		return null;
	}

	/**
	 * Returns no nested legacy elements in the isolated fixture.
	 *
	 * @param _selector - Element selector requested by the DOM API.
	 * @return An empty collection for the isolated fixture.
	 */
	querySelectorAll(_selector: string): MockElement[] {
		return [];
	}
}

/** Document stand-in that records the hue-change event emitted by applyHue. */
class MockDocument {
	dispatchedEvent: { type: string; detail: unknown } | null = null;

	/** Creates a fake document around its root and optional body elements.
	 *
	 * @param documentElement - Root element that receives the document palette.
	 * @param body - Optional body element that receives the document palette.
	 */
	constructor(
		readonly documentElement: MockElement,
		readonly body: MockElement | null,
	) {}

	/**
	 * Returns no legacy inline-style targets in the isolated fixture.
	 *
	 * @param _selector - Element selector requested by the DOM API.
	 * @return An empty collection because the fixture has no additional nodes.
	 */
	querySelectorAll(_selector: string): MockElement[] {
		return [];
	}

	/**
	 * Stores the event dispatched by the hue utility.
	 *
	 * @param event - Event details emitted by `applyHue`.
	 * @return `true` to indicate that the fake document accepted the event.
	 */
	dispatchEvent(event: { type: string; detail: unknown }): boolean {
		this.dispatchedEvent = event;
		return true;
	}
}

/** Custom-event substitute that retains the type and detail checked by the tests. */
class MockCustomEvent {
	/**
	 * Creates a hue-change event stand-in for the browser global.
	 *
	 * @param type - Event type passed to the browser constructor.
	 * @param options - Optional event initialization details.
	 */
	constructor(
		readonly type: string,
		readonly options: { detail?: unknown } = {},
	) {}

	/**
	 * Returns the detail data supplied when constructing the event.
	 *
	 * @return The event's custom detail value.
	 */
	get detail(): unknown {
		return this.options.detail;
	}
}

// terra-quality-ignore single-use -- Keep resetApplyHueGlobals as a named declaration so its authored TSDoc stays attached. TSDoc: Removes browser globals installed by an applyHue fixture.
/** Removes browser globals installed by an applyHue fixture. */
function resetApplyHueGlobals(): void {
	Reflect.deleteProperty(globalThis, 'document');
	Reflect.deleteProperty(globalThis, 'CustomEvent');
	Reflect.deleteProperty(globalThis, 'HTMLElement');
}

// terra-quality-ignore single-use -- Keep describeColorUtilities as a named declaration so its authored TSDoc stays attached. TSDoc: Registers focused tests for hue derivation, scale generation, and application.
/** Registers focused tests for hue derivation, scale generation, and application. */
function describeColorUtilities(): void {
	describe('getHue', describeGetHue);
	describe('invert', describeInvert);
	describe('flattenColors', describeFlattenColors);
	describe('isDarkMode', describeIsDarkMode);
	describe('colors', describeColors);
	describe('applyHue', describeApplyHue);
}

// terra-quality-ignore single-use -- Keep describeGetHue as a named declaration so its authored TSDoc stays attached. TSDoc: Registers hue derivation cases for explicit and normalized labels.
/** Registers hue derivation cases for explicit and normalized labels. */
function describeGetHue(): void {
	it('preserves explicit section hues', preservesExplicitSectionHues);
	it('derives a stable hue from normalized document labels', normDocumentLabelsBeforeDerivingHue);
}

// terra-quality-ignore single-use -- Keep preservesExplicitSectionHues as a named declaration so its authored TSDoc stays attached. TSDoc: Preserves the hue supplied for a named section.
/** Preserves the hue supplied for a named section. */
function preservesExplicitSectionHues(): void {
	assert.strictEqual(getHue('Programming', 145), 145);
}

// terra-quality-ignore single-use -- Keep normDocumentLabelsBeforeDerivingHue as a named declaration so its authored TSDoc stays attached. TSDoc: Normalizes equivalent labels before deriving their deterministic hue.
/** Normalizes equivalent labels before deriving their deterministic hue. */
function normDocumentLabelsBeforeDerivingHue(): void {
	assert.strictEqual(getHue('Course_Notes.md'), getHue('Course Notes'));
	assert.strictEqual(getHue('__Advanced-Topics.mdx'), getHue('Advanced Topics'));
	assert.strictEqual(getHue('Programming 1'), getHue('programming_1'));
}

// terra-quality-ignore single-use -- Keep describeInvert as a named declaration so its authored TSDoc stays attached. TSDoc: Registers hue inversion cases for null values, rotation, and wraparound.
/** Registers hue inversion cases for null values, rotation, and wraparound. */
function describeInvert(): void {
	it('returns null when hue is null', preservesNullHueDuringInversion);
	it('rotates numeric hue by 150 degrees', rotatesHueByOneHalfTurn);
	it('wraps around 300 degrees scale', wrapsHueAtScaleBoundary);
}

// terra-quality-ignore single-use -- Keep preservesNullHueDuringInversion as a named declaration so its authored TSDoc stays attached. TSDoc: Keeps the grayscale marker unchanged when inversion receives null.
/** Keeps the grayscale marker unchanged when inversion receives null. */
function preservesNullHueDuringInversion(): void {
	assert.strictEqual(invert(null), null);
}

// terra-quality-ignore single-use -- Keep rotatesHueByOneHalfTurn as a named declaration so its authored TSDoc stays attached. TSDoc: Rotates ordinary numeric hue values by 150 degrees.
/** Rotates ordinary numeric hue values by 150 degrees. */
function rotatesHueByOneHalfTurn(): void {
	assert.strictEqual(invert(0), 150);
	assert.strictEqual(invert(100), 250);
}

// terra-quality-ignore single-use -- Keep wrapsHueAtScaleBoundary as a named declaration so its authored TSDoc stays attached. TSDoc: Wraps inverted hue values back into the three-hundred degree scale.
/** Wraps inverted hue values back into the three-hundred degree scale. */
function wrapsHueAtScaleBoundary(): void {
	assert.strictEqual(invert(200), 50);
}

// terra-quality-ignore single-use -- Keep describeFlattenColors as a named declaration so its authored TSDoc stays attached. TSDoc: Registers flattening behavior for prefixed and unprefixed variable maps.
/** Registers flattening behavior for prefixed and unprefixed variable maps. */
function describeFlattenColors(): void {
	it('flattens light and dark scales into variable dictionary', flattensColorScales);
}

// terra-quality-ignore single-use -- Keep flattensColorScales as a named declaration so its authored TSDoc stays attached. TSDoc: Flattens representative light and dark values using both naming modes.
/** Flattens representative light and dark values using both naming modes. */
function flattensColorScales(): void {
	const mockScales = {
		light: ['10 10 10', '20 20 20', '30 30 30', '40 40 40', '50 50 50', '60 60 60', '70 70 70', '80 80 80', '90 90 90', '100 100 100', '110 110 110', '120 120 120'] as ColorScales['light'],
		dark: [
			'210 210 210',
			'220 220 220',
			'230 230 230',
			'240 240 240',
			'250 250 250',
			'260 260 260',
			'270 270 270',
			'280 280 280',
			'290 290 290',
			'300 300 300',
			'310 310 310',
			'320 320 320',
		] as ColorScales['dark'],
	};

	const flatNoPrefix = flattenColors('primary', mockScales, false);
	assert.strictEqual(flatNoPrefix['primaryLight1'], '10 10 10');
	assert.strictEqual(flatNoPrefix['primaryDark12'], '320 320 320');

	const flatWithPrefix = flattenColors('primary', mockScales, true);
	assert.strictEqual(flatWithPrefix['--primaryLight1'], '10 10 10');
	assert.strictEqual(flatWithPrefix['--primaryDark12'], '320 320 320');
}

// terra-quality-ignore single-use -- Keep describeIsDarkMode as a named declaration so its authored TSDoc stays attached. TSDoc: Registers the server-side fallback for system dark-mode detection.
/** Registers the server-side fallback for system dark-mode detection. */
function describeIsDarkMode(): void {
	it('returns false in server / non-DOM environment', returnsLightModeWithoutDocument);
}

// terra-quality-ignore single-use -- Keep returnsLightModeWithoutDocument as a named declaration so its authored TSDoc stays attached. TSDoc: Reports light mode when no browser document is available.
/** Reports light mode when no browser document is available. */
function returnsLightModeWithoutDocument(): void {
	assert.strictEqual(isDarkMode(), false);
}

// terra-quality-ignore single-use -- Keep describeColors as a named declaration so its authored TSDoc stays attached. TSDoc: Registers invalid, grayscale, and numeric palette generation cases.
/** Registers invalid, grayscale, and numeric palette generation cases. */
function describeColors(): void {
	it('throws on invalid hue type', rejectsInvalidHueType);
	it('returns grayscale scale pair when hue is null', returnsGrayscaleScalesForNullHue);
	it('generates 12-step RGB scale pairs for valid numeric hue', gensTwelveStepColorScales);
	it('handles hue avoidance shift for hues between 70 and 130', appliesHueAvoidanceShift);
}

// terra-quality-ignore single-use -- Keep useInvalidHue as a named declaration so its authored TSDoc stays attached. TSDoc: Supplies an invalid runtime value to verify the public hue validator.
/** Supplies an invalid runtime value to verify the public hue validator. */
function useInvalidHue(): void {
	colors('invalid' as never);
}

// terra-quality-ignore single-use -- Keep rejectsInvalidHueType as a named declaration so its authored TSDoc stays attached. TSDoc: Rejects a runtime hue value that falls outside the documented input type.
/** Rejects a runtime hue value that falls outside the documented input type. */
function rejectsInvalidHueType(): void {
	assert.throws(useInvalidHue, /Invalid hue/);
}

// terra-quality-ignore single-use -- Keep returnsGrayscaleScalesForNullHue as a named declaration so its authored TSDoc stays attached. TSDoc: Returns identical light and dark grayscale scales when hue is null.
/** Returns identical light and dark grayscale scales when hue is null. */
function returnsGrayscaleScalesForNullHue(): void {
	const [accent, gray] = colors(null);
	assert.strictEqual(accent.light.length, 12);
	assert.strictEqual(accent.dark.length, 12);
	assert.deepStrictEqual(accent, gray);
}

// terra-quality-ignore single-use -- Keep gensTwelveStepColorScales as a named declaration so its authored TSDoc stays attached. TSDoc: Produces twelve entries in each light, dark, and grayscale scale.
/** Produces twelve entries in each light, dark, and grayscale scale. */
function gensTwelveStepColorScales(): void {
	const [primary, gray] = colors(180);
	assert.strictEqual(primary.light.length, 12);
	assert.strictEqual(primary.dark.length, 12);
	assert.strictEqual(gray.light.length, 12);
	assert.strictEqual(gray.dark.length, 12);
	assert.match(primary.light[0]!, /^\d+\s+\d+\s+\d+$/);
}

// terra-quality-ignore single-use -- Keep appliesHueAvoidanceShift as a named declaration so its authored TSDoc stays attached. TSDoc: Confirms the configured hue-avoidance shift changes the default palette.
/** Confirms the configured hue-avoidance shift changes the default palette. */
function appliesHueAvoidanceShift(): void {
	const [primary70] = colors(70);
	const [unshifted70] = colors(70, { hueAvoidanceShift: 0 });
	assert.notDeepStrictEqual(primary70, unshifted70);
}

// terra-quality-ignore single-use -- Keep describeApplyHue as a named declaration so its authored TSDoc stays attached. TSDoc: Registers browser-global setup and cleanup cases for hue application.
/** Registers browser-global setup and cleanup cases for hue application. */
function describeApplyHue(): void {
	afterEach(resetApplyHueGlobals);
	it('does nothing when document is undefined', leavesServerCallsUntouched);
	it('applies numeric hue palette to document element and dispatches docs:hue-change event', appliesNumericHueToDocument);
	it('applies a hue to a scoped workspace without changing the document theme', appliesHueOnlyToScopedWorkspace);
	it('applies null hue palette with --hue: 0', appliesGrayscaleHueToDocument);
}

// terra-quality-ignore single-use -- Keep leavesServerCallsUntouched as a named declaration so its authored TSDoc stays attached. TSDoc: Leaves server-side calls untouched when no browser document exists.
/** Leaves server-side calls untouched when no browser document exists. */
function leavesServerCallsUntouched(): void {
	assert.doesNotThrow(applyHueWithoutDocument);
}

// terra-quality-ignore single-use -- Keep appliesNumericHueToDocument as a named declaration so its authored TSDoc stays attached. TSDoc: Applies a numeric palette to the document and emits the hue-change event.
/** Applies a numeric palette to the document and emits the hue-change event. */
function appliesNumericHueToDocument(): void {
	const docElement = new MockElement();
	const mockDocument = new MockDocument(docElement, new MockElement());
	Reflect.set(globalThis, 'HTMLElement', MockElement);
	Reflect.set(globalThis, 'CustomEvent', MockCustomEvent);
	Reflect.set(globalThis, 'document', mockDocument);

	applyHue(180);

	assert.ok(docElement.style.cssText.includes('--hue: 180'));
	assert.ok(docElement.style.cssText.includes('--primary-1:'));
	assert.ok(docElement.style.cssText.includes('--gray-1:'));
	assert.ok(docElement.style.cssText.includes('--secondary-1:'));
	assert.ok(mockDocument.dispatchedEvent);
	assert.strictEqual(mockDocument.dispatchedEvent.type, 'docs:hue-change');
	assert.deepStrictEqual(mockDocument.dispatchedEvent.detail, { hue: 180 });
}

// terra-quality-ignore single-use -- Keep appliesHueOnlyToScopedWorkspace as a named declaration so its authored TSDoc stays attached. TSDoc: Applies a scoped palette without modifying the document element or body.
/** Applies a scoped palette without modifying the document element or body. */
function appliesHueOnlyToScopedWorkspace(): void {
	const docElement = new MockElement();
	const bodyElement = new MockElement();
	const workspace = new MockElement();
	// terra-quality-ignore single-use -- Construct the scoped mock document before installing browser globals for this test.
	const mockDocument = new MockDocument(docElement, bodyElement);
	Reflect.set(globalThis, 'HTMLElement', MockElement);
	Reflect.set(globalThis, 'CustomEvent', MockCustomEvent);
	Reflect.set(globalThis, 'document', mockDocument);

	applyHue(145, workspace as unknown as HTMLElement);

	assert.ok(workspace.style.cssText.includes('--hue: 145'));
	assert.ok(workspace.style.cssText.includes('--secondary-3: 241 240 248'));
	assert.strictEqual(docElement.style.cssText, '');
	assert.strictEqual(bodyElement.style.cssText, '');
}

// terra-quality-ignore single-use -- Keep appliesGrayscaleHueToDocument as a named declaration so its authored TSDoc stays attached. TSDoc: Applies the grayscale palette and emits a null hue-change event.
/** Applies the grayscale palette and emits a null hue-change event. */
function appliesGrayscaleHueToDocument(): void {
	const docElement = new MockElement();
	const mockDocument = new MockDocument(docElement, null);
	Reflect.set(globalThis, 'HTMLElement', MockElement);
	Reflect.set(globalThis, 'CustomEvent', MockCustomEvent);
	Reflect.set(globalThis, 'document', mockDocument);

	applyHue(null);

	assert.ok(docElement.style.cssText.includes('--hue: 0'));
	assert.ok(mockDocument.dispatchedEvent);
	assert.strictEqual(mockDocument.dispatchedEvent.type, 'docs:hue-change');
	assert.deepStrictEqual(mockDocument.dispatchedEvent.detail, { hue: null });
}

// terra-quality-ignore single-use -- Keep applyHueWithoutDocument as a named declaration so its authored TSDoc stays attached. TSDoc: Calls the public hue applier in a browser-less environment.
/** Calls the public hue applier in a browser-less environment. */
function applyHueWithoutDocument(): void {
	applyHue(180);
}

describe('color utilities', describeColorUtilities);
