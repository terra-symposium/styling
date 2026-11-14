/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Tabs, TabsContent, TabsList, TabsTrigger } from '../../../src/components/ui/index.js';

// TEST RUNNER
import test from 'node:test';

/*//////////////////////////////////////////////////
TESTS
//////////////////////////////////////////////////*/

test.describe('shared interactive component contracts', () => {
	test('Tabs render the selected panel and forward the accessible list name', () => {
		const markup = renderToStaticMarkup(
			React.createElement(
				Tabs,
				{ defaultValue: 'overview' },
				React.createElement(TabsList, { 'aria-label': 'Course sections' }, React.createElement(TabsTrigger, { value: 'overview' }, 'Overview')),
				React.createElement(TabsContent, { value: 'overview' }, 'Course overview'),
			),
		);

		assert.match(markup, /role="tablist"/u);
		assert.match(markup, /aria-label="Course sections"/u);
		assert.match(markup, /role="tab"[^>]*aria-selected="true"/u);
		assert.match(markup, /role="tabpanel"[^>]*>Course overview/u);
	});

	test('Accordion renders the open panel with its trigger association', () => {
		const markup = renderToStaticMarkup(
			React.createElement(
				Accordion,
				{ type: 'single', defaultValue: 'details' },
				React.createElement(AccordionItem, { value: 'details' }, React.createElement(AccordionTrigger, null, 'Details'), React.createElement(AccordionContent, null, 'Course details')),
			),
		);
		const trigger = markup.match(/<button[^>]*aria-expanded="true"[^>]*>/u)?.[0];
		const panel = markup.match(/<div[^>]*role="region"[^>]*>/u)?.[0];

		assert.ok(trigger, 'the open accordion trigger exposes its expanded state');
		assert.ok(panel, 'the accordion content exposes its region role');
		assert.match(trigger, /aria-controls=/u);
		assert.match(panel, /aria-labelledby=/u);
		assert.match(markup, /Course details/u);
	});
});
