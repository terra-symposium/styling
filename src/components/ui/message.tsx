/**
 * src/components/ui/message.tsx
 * https://ui.shadcn.com/docs/components/base/message
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Vertical container for a related sequence of messages.
 *
 * @param className - Additional layout classes for the group.
 * @param attributes - Remaining div attributes and children.
 *
 * @return A vertical container for related messages.
 */
function MessageGroup({
  className,
  ...attributes
}: React.ComponentProps<"div">): React.JSX.Element {
  return (
    <div
      data-slot="message-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...attributes}
    />
  );
}

/**
 * Message row; `align="end"` reverses its flex direction.
 *
 * @param className - Additional classes applied to the message row.
 * @param align - Row direction that places the message at the start or end.
 * @param attributes - Remaining div attributes and children.
 *
 * @return A message row with the requested alignment metadata.
 */
function Message({
  className,
  align = "start",
  ...attributes
}: React.ComponentProps<"div"> & {
  align?: "start" | "end";
}): React.JSX.Element {
  return (
    <div
      data-slot="message"
      data-align={align}
      className={cn(
        "group/message relative flex w-full min-w-0 gap-2 data-[align=end]:flex-row-reverse",
        className,
      )}
      {...attributes}
    />
  );
}

/**
 * Flexible body container for message text and other content.
 *
 * @param className - Additional classes applied to the message body.
 * @param attributes - Remaining div attributes and children.
 *
 * @return A flexible body container for message content.
 */
function MessageContent({
  className,
  ...attributes
}: React.ComponentProps<"div">): React.JSX.Element {
  return (
    <div
      data-slot="message-content"
      className={cn(
        "flex w-full min-w-0 flex-col gap-1.5 break-words",
        className,
      )}
      {...attributes}
    />
  );
}

/**
 * Compact, muted header line for message metadata.
 *
 * @param className - Additional classes applied to the metadata line.
 * @param attributes - Remaining div attributes and children.
 *
 * @return A compact, muted metadata line.
 */
function MessageHeader({
  className,
  ...attributes
}: React.ComponentProps<"div">): React.JSX.Element {
  return (
    <div
      data-slot="message-header"
      className={cn(
        "flex min-w-0 max-w-full items-center px-3 text-xs text-primary-11",
        className,
      )}
      {...attributes}
    />
  );
}
MessageGroup.displayName = "MessageGroup";
Message.displayName = "Message";
MessageContent.displayName = "MessageContent";
MessageHeader.displayName = "MessageHeader";
export { MessageGroup, Message, MessageContent, MessageHeader };
