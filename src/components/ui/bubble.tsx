/**
 * src/components/ui/bubble.tsx
 * https://ui.shadcn.com/docs/components/base/bubble
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';
import { cva } from 'class-variance-authority';

// COMPONENTS
import * as React from 'react';

// TYPES
import type { VariantProps } from 'class-variance-authority';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const BUBBLE_VARIANTS = cva('group/bubble relative flex w-fit min-w-0 max-w-[80%] flex-col gap-1 overflow-hidden rounded-2xl data-[variant=ghost]:max-w-full group-data-[align=end]/message:self-end', {
	variants: {
		variant: {
			default: 'bg-primary-9 text-primary-1',
			secondary: 'bg-gray-3 text-primary-12',
			muted: 'bg-primary-3 text-primary-11',
			tinted: 'bg-primary-3 text-primary-12',
			outline: 'border border-primary-7 bg-transparent text-primary-12',
			ghost: 'max-w-full bg-transparent text-inherit',
			destructive: 'bg-red-300 text-red-900',
			'primary-saturated': 'bg-primary-9 text-primary-1 dark:text-primary-12',
			'primary-tonal': 'bg-primary-3 text-primary-12',
			bunker: 'border border-primary-7 bg-primary-5/40 text-primary-12 dark:bg-primary-5/60',
		},
	},
	defaultVariants: { variant: 'default' },
});

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Message bubble whose `variant` selects its surface and whose `align` is exposed as data.
 *
 * @param variant - Surface style for the message bubble.
 * @param align - Whether the bubble aligns with the start or end of the message.
 * @param className - Additional classes applied to the bubble surface.
 * @param attributes - Remaining div attributes forwarded to the bubble.
 * @return A message bubble with variant and alignment metadata.
 */
function Bubble({
	variant = 'default',
	align = 'start',
	className,
	...attributes
}: React.ComponentProps<'div'> &
	VariantProps<typeof BUBBLE_VARIANTS> & {
		align?: 'start' | 'end';
	}): React.JSX.Element {
	return <div data-slot='bubble' data-variant={variant} data-align={align} className={cn(BUBBLE_VARIANTS({ variant, className }))} {...attributes} />;
}

/**
 * Rounded, wrapping container for the bubble's body content.
 *
 * @param className - Additional classes applied to the bubble body.
 *
 * @param attributes - Remaining div attributes forwarded to the body container.
 * @return A rounded, wrapping div for message content.
 */
function BubbleContent({ className, ...attributes }: React.ComponentProps<'div'>): React.JSX.Element {
	return (
		<div
			data-slot='bubble-content'
			className={cn('w-fit min-w-0 max-w-full overflow-hidden break-words rounded-2xl border border-transparent px-3 py-1.5 text-sm leading-relaxed', className)}
			{...attributes}
		/>
	);
}
Bubble.displayName = 'Bubble';
BubbleContent.displayName = 'BubbleContent';
export { Bubble, BubbleContent };
