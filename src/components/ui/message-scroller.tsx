/**
 * astro/src/components/ui/message-scroller.tsx
 * https://ui.shadcn.com/docs/components/base/message-scroller
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import { MessageScroller as MessageScrollerPrimitive } from "@shadcn/react/message-scroller";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Provides the context used by the message-scroller primitives.
 *
 * @param props - Provider settings and children for the message-scroller context.
 * @returns The message-scroller context provider.
 */
function MessageScrollerProvider(
  props: React.ComponentProps<typeof MessageScrollerPrimitive.Provider>,
): React.JSX.Element {
  return <MessageScrollerPrimitive.Provider {...props} />;
}

/**
 * Root container that fills its parent and clips overflow.
 *
 * @param props - Root attributes and message-scroller settings.
 * @returns A clipped root for the message-scroller viewport and content.
 */
function MessageScroller({
  className,
  ...props
}: React.ComponentProps<
  typeof MessageScrollerPrimitive.Root
>): React.JSX.Element {
  return (
    <MessageScrollerPrimitive.Root
      data-slot="message-scroller"
      className={cn(
        "relative flex size-full min-h-0 flex-col overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Vertically scrollable viewport for message content.
 *
 * @param props - Viewport attributes and scroll settings.
 * @returns A vertically scrollable message viewport.
 */
function MessageScrollerViewport({
  className,
  ...props
}: React.ComponentProps<
  typeof MessageScrollerPrimitive.Viewport
>): React.JSX.Element {
  return (
    <MessageScrollerPrimitive.Viewport
      data-slot="message-scroller-viewport"
      className={cn(
        "size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Column container that grows to the viewport height and expands with its items.
 *
 * @param props - Content attributes and message items.
 * @returns A column that fills the viewport and grows with its items.
 */
function MessageScrollerContent({
  className,
  ...props
}: React.ComponentProps<
  typeof MessageScrollerPrimitive.Content
>): React.JSX.Element {
  return (
    <MessageScrollerPrimitive.Content
      data-slot="message-scroller-content"
      className={cn("flex h-max min-h-full flex-col", className)}
      {...props}
    />
  );
}

/**
 * Message item wrapper; `scrollAnchor` is false unless explicitly enabled.
 *
 * @param props - Item attributes and optional scroll anchoring.
 * @returns A message item wrapper with the requested scroll-anchor setting.
 */
function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: React.ComponentProps<
  typeof MessageScrollerPrimitive.Item
>): React.JSX.Element {
  return (
    <MessageScrollerPrimitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      className={cn("min-w-0 shrink-0", className)}
      {...props}
    />
  );
}
MessageScrollerProvider.displayName = "MessageScrollerProvider";
MessageScroller.displayName = "MessageScroller";
MessageScrollerViewport.displayName = "MessageScrollerViewport";
MessageScrollerContent.displayName = "MessageScrollerContent";
MessageScrollerItem.displayName = "MessageScrollerItem";

export {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
};
