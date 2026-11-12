/**
 * src/components/ui/popover.tsx
 * https://ui.shadcn.com/docs/components/popover
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

// DATA
import {
  OVERLAY_MOTION_VARIANTS,
  OVERLAY_SURFACE_VARIANTS,
  RADIX_SIDE_POSITION_VARIANTS,
} from "./variants.js";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
/**
 * Floating popover content panel.
 */
/** Props accepted by the styled Radix popover content panel. */
type PopoverContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
>;

/** Prevents content scrolling from reaching a parent scroll container.
 * @param event - Wheel or touch-move event from the popover content.
 * @return Nothing; the event remains local to the popover.
 */
function stopContentScrollPropagation(
  event: React.SyntheticEvent<HTMLDivElement>,
): void {
  event.stopPropagation();
}

/** Renders popover content inside a portal with shared overlay styling.
 * @param contentProps - Radix positioning, event, and child props.
 * @param ref - Ref forwarded to the Radix content element.
 * @return A portal containing the styled popover panel.
 */
function renderPopoverContent(
  contentProps: PopoverContentProps,
  ref: React.ForwardedRef<React.ElementRef<typeof PopoverPrimitive.Content>>,
): React.JSX.Element {
  const {
    className,
    align = "center",
    sideOffset = 4,
    collisionPadding = 8,
    ...props
  } = contentProps;
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        onWheel={stopContentScrollPropagation}
        onTouchMove={stopContentScrollPropagation}
        className={cn(
          "z-[110] w-fit max-w-80 origin-[--radix-popover-content-transform-origin] text-pretty rounded-md border p-2 text-sm",
          OVERLAY_SURFACE_VARIANTS(),
          OVERLAY_MOTION_VARIANTS(),
          RADIX_SIDE_POSITION_VARIANTS(),
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(renderPopoverContent);
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
export { Popover, PopoverContent, PopoverTrigger };
