/**
 * src/components/ui/scroll-area.tsx
 * https://ui.shadcn.com/docs/components/scroll-area
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';

// COMPONENTS
import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/*
 * ScrollArea primitive component that partitions root and viewport layout classes.
 *
 * @param children - ScrollArea content elements.
 * @param viewportClassName - Additional class name applied specifically to the viewport.
 */
/** Scroll area props with a separate class hook for its viewport. */
type ScrollAreaProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & { viewportClassName?: string };

// terra-quality-ignore single-use -- Keep renderScrollArea as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the scroll root, viewport, scrollbar, and corner together.
/** Renders the scroll root, viewport, scrollbar, and corner together.
 * @param areaProps - Scroll root attributes and viewport class override.
 * @param ref - Ref forwarded to the Radix scroll root.
 * @return A scroll area with layout classes routed to the correct element.
 */
function renderScrollArea(areaProps: ScrollAreaProps, ref: React.ForwardedRef<React.ElementRef<typeof ScrollAreaPrimitive.Root>>): React.JSX.Element {
	const { className, children, viewportClassName, ...props } = areaProps;
	const rootClasses: string[] = [];
	const viewportClasses: string[] = [];
	const seenViewport = new Set<string>();
	for (const token of className?.split(/\s+/).filter(Boolean) ?? []) {
		if (
			/^(?:flex|inline-flex|grid|inline-grid|contents|grow|shrink|flex-|grid-|gap-|space-[xy]-|items-|justify-|content-|self-|place-|basis-|grow-|shrink-|order-|auto-cols-|auto-rows-|col-|row-)/.test(
				token.split(':').pop() ?? token,
			)
		) {
			if (!seenViewport.has(token)) {
				seenViewport.add(token);
				viewportClasses.push(token);
			}
		} else {
			rootClasses.push(token);
		}
	}
	return (
		<ScrollAreaPrimitive.Root ref={ref} className={cn('relative w-full min-w-0 overflow-hidden', rootClasses.length ? rootClasses.join(' ') : undefined)} {...props}>
			<ScrollAreaPrimitive.Viewport
				className={cn(
					'size-full min-w-0 overflow-x-hidden rounded-[inherit] [&>div]:!block [&>div]:w-full [&>div]:min-w-0',
					viewportClasses.length ? viewportClasses.join(' ') : undefined,
					viewportClassName,
				)}
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	);
}

const ScrollArea = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitive.Root>, ScrollAreaProps>(renderScrollArea);

/*
 * ScrollBar primitive thumb/track component for the ScrollArea.
 *
 * @param orientation - Scrollbar orientation ('vertical' or 'horizontal').
 */
// terra-quality-ignore single-use -- Keep renderScrollBar as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the scrollbar track with an orientation-aware layout.
/** Renders the scrollbar track with an orientation-aware layout.
 * @param barProps - Radix scrollbar attributes and optional orientation.
 * @param ref - Ref forwarded to the Radix scrollbar element.
 * @return A styled scrollbar track containing its thumb.
 */
function renderScrollBar(
	barProps: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	ref: React.ForwardedRef<React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>>,
): React.JSX.Element {
	const { className, orientation = 'vertical', ...props } = barProps;
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			ref={ref}
			orientation={orientation}
			className={cn(
				'flex touch-none select-none transition-colors',
				orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-px',
				orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-px',
				className,
			)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb className='relative flex-1 rounded-full bg-gray-200 dark:bg-gray-800' />
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	);
}

const ScrollBar = React.forwardRef<React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>, React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>>(renderScrollBar);
ScrollArea.displayName = 'ScrollArea';
ScrollBar.displayName = 'ScrollBar';
export { ScrollArea, ScrollBar };
