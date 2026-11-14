/**
 * src/components/data-list.tsx
 * Shared data-driven semantic list and metric-grid compositions.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../lib/cn.js';
import React from 'react';

// TYPES
import type { JSX, Key, ReactNode } from 'react';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

// MAPPED LIST
/** Renders supplied data as an ordered or unordered semantic list.
 *
 * @param data - Values rendered as list items.
 * @param getKey - Optional stable key for each item.
 * @param renderItem - Optional renderer for an item's content.
 * @param className - Classes for the list.
 * @param itemClassName - Classes for each list item.
 * @param ordered - Whether to render an ordered list.
 * @return An ordered or unordered list containing one rendered item per value.
 */
export function MappedList<T>({
	data,
	getKey,
	renderItem,
	className,
	itemClassName,
	ordered = false,
}: {
	data: readonly T[];
	getKey?: (item: T, index: number) => Key;
	renderItem?: (item: T, index: number) => ReactNode;
	className?: string;
	itemClassName?: string;
	ordered?: boolean;
}): JSX.Element {
	const List = ordered ? 'ol' : 'ul';
	return (
		<List className={cn('list-disc', className)}>
			{data.map((value, i) => (
				<li key={getKey?.(value, i) ?? i} className={itemClassName}>
					{renderItem ? renderItem(value, i) : (value as ReactNode)}
				</li>
			))}
		</List>
	);
}

// METRIC GRID
/** One label and value in a shared semantic metric grid. */
export type MetricGridItem = {
	label: string;
	value: ReactNode;
	itemClassName?: string;
	labelClassName?: string;
	valueClassName?: string;
};

/** Renders metric data as a description list with shared item, label, and value styling.
 *
 * @param data - Metric labels and values to render.
 * @param className - Classes for the grid.
 * @param itemClassName - Classes for each metric container.
 * @param labelClassName - Classes for each metric label.
 * @param valueClassName - Classes for each metric value.
 * @return A description list containing one labelled metric per data item.
 */
export function MetricGrid({
	data,
	className = 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-3',
	itemClassName = 'rounded-lg border border-gray-6 bg-gray-1 p-2',
	labelClassName = 'text-gray-10 text-xs font-semibold',
	valueClassName = 'mt-1 font-extrabold text-gray-12',
}: {
	data: readonly MetricGridItem[];
	className?: string;
	itemClassName?: string;
	labelClassName?: string;
	valueClassName?: string;
}): JSX.Element {
	return (
		<dl className={className}>
			{data.map(item => (
				<div key={item.label} className={cn(itemClassName, item.itemClassName)}>
					<dt className={cn(labelClassName, item.labelClassName)}>{item.label}</dt>
					<dd className={cn(valueClassName, item.valueClassName)}>{item.value}</dd>
				</div>
			))}
		</dl>
	);
}
