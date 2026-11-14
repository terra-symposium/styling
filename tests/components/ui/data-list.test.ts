import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import test from 'node:test';
import { MappedList, MetricGrid } from '../../../src/components/data-list.tsx';

test('mapped list renders data with ordered semantics, item keys, and a custom renderer', () => {
	assert.match(
		renderToStaticMarkup(
			React.createElement(MappedList, {
				data: [
					{ id: 'one', label: 'First' },
					{ id: 'two', label: 'Second' },
				],
				getKey: item => item.id,
				ordered: true,
				className: 'space-y-2',
				renderItem: item => item.label,
			}),
		),
		/^<ol class="list-disc space-y-2"><li>First<\/li><li>Second<\/li><\/ol>$/,
	);
});

test('mapped list renders React nodes directly when no item renderer is supplied', () => {
	assert.match(renderToStaticMarkup(React.createElement(MappedList, { data: [React.createElement('span', { key: 'a' }, 'Notice')] })), /^<ul class="list-disc"><li><span>Notice<\/span><\/li><\/ul>$/);
});

test('metric grid renders data as a description list and merges item classes', () => {
	assert.match(
		renderToStaticMarkup(React.createElement(MetricGrid, { data: [{ label: 'Open opportunities', value: 12, itemClassName: 'highlight', valueClassName: 'text-primary-12' }], className: 'metrics' })),
		/<dl class="metrics"><div class="rounded-lg border border-gray-6 bg-gray-1 p-2 highlight"><dt class="text-gray-10 text-xs font-semibold">Open opportunities<\/dt><dd class="mt-1 font-extrabold text-primary-12">12<\/dd><\/div><\/dl>/,
	);
});
