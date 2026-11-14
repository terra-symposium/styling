/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// TEST RUNNER
import test from 'node:test';

// SOURCE UNDER TEST
import { MappedFormFields } from '../../../src/components/forms.tsx';

/*//////////////////////////////////////////////////
TESTS
//////////////////////////////////////////////////*/

test.describe('mapped checkbox field accessibility', mappedCheckboxAccessibility);

// terra-quality-ignore single-use -- Keep mappedCheckboxAccessibility as a named declaration so its authored TSDoc stays attached. TSDoc: Registers checkbox orientation and generated-label association contracts.
/** Registers checkbox orientation and generated-label association contracts. */
function mappedCheckboxAccessibility(): void {
	// ORIENTATION AND FEEDBACK
	test('mapped checkbox fields remain stacked by default', defaultCheckboxKeepsLabelBeforeControl);
	test('horizontal mapped checkbox fields lead with the control and retain feedback associations', horizontalCheckboxKeepsFeedbackAssociations);

	// GENERATED AND CUSTOM CONTROL IDS
	test('mapped checkbox fields generate an associated id when id and name are omitted', genCheckboxIdConnectsLabelAndFeedback);
	test('custom mapped controls without id or name do not get a dangling label association', customControlWithoutIdentityHasNoDanglingLabel);
}

/** Renders a checkbox with both supporting text states for association checks.
 *
 * @param orientation Optional control and label arrangement.
 *
 * @returns Rendered markup for association assertions.
 */
function renderCheckbox(orientation?: 'vertical' | 'horizontal'): string {
	return renderToStaticMarkup(
		React.createElement(MappedFormFields, {
			data: [{ type: 'checkbox', id: 'terms', name: 'terms', label: 'Accept the terms', orientation, description: 'Review the terms before continuing.', error: 'Acceptance is required.' }],
		}),
	);
}

// terra-quality-ignore single-use -- Keep defaultCheckboxKeepsLabelBeforeControl as a named declaration so its authored TSDoc stays attached. TSDoc: An omitted orientation uses the vertical layout; its label and Radix control still share.
/**
 * An omitted orientation uses the vertical layout; its label and Radix control
 * still share description and error ids.
 */
function defaultCheckboxKeepsLabelBeforeControl(): void {
	const markup = renderCheckbox();
	const labelIndex = markup.indexOf('<label');
	const checkboxIndex = markup.indexOf('role="checkbox"');

	assert.ok(labelIndex >= 0);
	assert.ok(checkboxIndex >= 0);
	assert.ok(labelIndex < checkboxIndex, 'the label precedes the checkbox by default');
	assert.match(markup, /aria-describedby="terms-description terms-error"/);
	assert.match(markup, /id="terms-description"/);
	assert.match(markup, /id="terms-error" role="alert"/);
}

// terra-quality-ignore single-use -- Keep horizontalCheckboxKeepsFeedbackAssociations as a named declaration so its authored TSDoc stays attached. TSDoc: Horizontal placement moves the control before its label without changing the control's feedback.
/**
 * Horizontal placement moves the control before its label without changing the
 * control's feedback associations.
 */
function horizontalCheckboxKeepsFeedbackAssociations(): void {
	const markup = renderCheckbox('horizontal');
	const labelIndex = markup.indexOf('<label');
	const checkboxIndex = markup.indexOf('role="checkbox"');

	assert.ok(labelIndex >= 0);
	assert.ok(checkboxIndex >= 0);
	assert.ok(checkboxIndex < labelIndex, 'the checkbox precedes its label when horizontal');
	assert.match(markup, /aria-describedby="terms-description terms-error"/);
	assert.match(markup, /id="terms-description"/);
	assert.match(markup, /id="terms-error" role="alert"/);
}

// terra-quality-ignore single-use -- Keep genCheckboxIdConnectsLabelAndFeedback as a named declaration so its authored TSDoc stays attached. TSDoc: When id and name are absent, one generated id connects the label, checkbox, description, and error.
/**
 * When id and name are absent, one generated id connects the label, checkbox,
 * description, and error.
 */
function genCheckboxIdConnectsLabelAndFeedback(): void {
	const markup = renderToStaticMarkup(
		React.createElement(MappedFormFields, {
			data: [{ type: 'checkbox', label: 'Accept the terms', orientation: 'horizontal', description: 'Review the terms before continuing.', error: 'Acceptance is required.' }],
		}),
	);
	const checkbox = markup.match(/<button[^>]*role="checkbox"[^>]*>/)?.[0];
	const labelFor = markup.match(/<label[^>]*>/)?.[0]?.match(/\sfor="([^"]+)"/)?.[1];
	const checkboxId = checkbox?.match(/\sid="([^"]+)"/)?.[1];

	assert.ok(labelFor, 'the generated label has a for attribute');
	assert.ok(checkboxId, 'the generated checkbox has an id');
	assert.equal(labelFor, checkboxId);
	assert.ok(checkbox?.includes(`aria-describedby="${checkboxId}-description ${checkboxId}-error"`), 'the generated checkbox id scopes its description and error associations');
	assert.ok(markup.includes(`id="${checkboxId}-description"`));
	assert.ok(markup.includes(`id="${checkboxId}-error" role="alert"`));
}

// terra-quality-ignore single-use -- Keep customControlWithoutIdentityHasNoDanglingLabel as a named declaration so its authored TSDoc stays attached. TSDoc: A custom ReactNode control has no discoverable id, so its label must not point to an element that.
/**
 * A custom ReactNode control has no discoverable id, so its label must not point
 * to an element that does not exist.
 */
function customControlWithoutIdentityHasNoDanglingLabel(): void {
	const markup = renderToStaticMarkup(React.createElement(MappedFormFields, { data: [{ label: 'Download the template', control: React.createElement('button', { type: 'button' }, 'Download') }] }));
	const label = markup.match(/<label[^>]*>/)?.[0];
	const button = markup.match(/<button[^>]*>/)?.[0];

	assert.ok(label);
	assert.ok(button);
	assert.doesNotMatch(label, /\sfor="[^"]+"/);
	assert.doesNotMatch(button, /\sid="[^"]+"/);
}
