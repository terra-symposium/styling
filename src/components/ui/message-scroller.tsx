/**
 * src/components/ui/message-scroller.tsx
 * https://ui.shadcn.com/docs/components/base/message-scroller
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';

// COMPONENTS
import * as React from 'react';
import { MessageScroller as MessageScrollerPrimitive } from '@shadcn/react/message-scroller';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Provides the context used by the message-scroller primitives.
 *
 * @param providerProps - Provider settings and children for the message-scroller context.
 *
 * @return The message-scroller context provider.
 */
function MessageScrollerProvider(providerProps: React.ComponentProps<typeof MessageScrollerPrimitive.Provider>): React.JSX.Element {
	return <MessageScrollerPrimitive.Provider {...providerProps} />;
}

/**
 * Root container that fills its parent and clips overflow.
 *
 * @param className - Additional classes applied to the root.
 * @param attributes - Remaining root attributes and message-scroller settings.
 *
 * @return A clipped root for the message-scroller viewport and content.
 */
function MessageScroller({ className, ...attributes }: React.ComponentProps<typeof MessageScrollerPrimitive.Root>): React.JSX.Element {
	return <MessageScrollerPrimitive.Root data-slot='message-scroller' className={cn('relative flex size-full min-h-0 flex-col overflow-hidden', className)} {...attributes} />;
}

/**
 * Vertically scrollable viewport for message content.
 *
 * @param className - Additional classes applied to the viewport.
 * @param attributes - Remaining viewport attributes and scroll settings.
 *
 * @return A vertically scrollable message viewport.
 */
function MessageScrollerViewport({ className, ...attributes }: React.ComponentProps<typeof MessageScrollerPrimitive.Viewport>): React.JSX.Element {
	return <MessageScrollerPrimitive.Viewport data-slot='message-scroller-viewport' className={cn('size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain', className)} {...attributes} />;
}

/**
 * Column container that grows to the viewport height and expands with its items.
 *
 * @param className - Additional classes applied to the content column.
 * @param attributes - Remaining content attributes and message items.
 *
 * @return A column that fills the viewport and grows with its items.
 */
function MessageScrollerContent({ className, ...attributes }: React.ComponentProps<typeof MessageScrollerPrimitive.Content>): React.JSX.Element {
	return <MessageScrollerPrimitive.Content data-slot='message-scroller-content' className={cn('flex h-max min-h-full flex-col', className)} {...attributes} />;
}

/**
 * Message item wrapper; `scrollAnchor` is false unless explicitly enabled.
 *
 * @param className - Additional classes applied to the item wrapper.
 * @param scrollAnchor - Whether this item participates in scroll anchoring.
 * @param attributes - Remaining item attributes and child content.
 *
 * @return A message item wrapper with the requested scroll-anchor setting.
 */
function MessageScrollerItem({ className, scrollAnchor = false, ...attributes }: React.ComponentProps<typeof MessageScrollerPrimitive.Item>): React.JSX.Element {
	return <MessageScrollerPrimitive.Item data-slot='message-scroller-item' scrollAnchor={scrollAnchor} className={cn('min-w-0 shrink-0', className)} {...attributes} />;
}
MessageScrollerProvider.displayName = 'MessageScrollerProvider';
MessageScroller.displayName = 'MessageScroller';
MessageScrollerViewport.displayName = 'MessageScrollerViewport';
MessageScrollerContent.displayName = 'MessageScrollerContent';
MessageScrollerItem.displayName = 'MessageScrollerItem';
export { MessageScrollerProvider, MessageScroller, MessageScrollerViewport, MessageScrollerContent, MessageScrollerItem };
