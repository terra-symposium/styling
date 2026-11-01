/**
 * astro/src/components/ui/popover.tsx
 * https://ui.shadcn.com/docs/components/popover
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import {
  OVERLAY_MOTION_VARIANTS,
  OVERLAY_SURFACE_VARIANTS,
  RADIX_SIDE_POSITION_VARIANTS,
} from "./variants.js";

// COMPONENTS
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

/**
 * Floating popover content panel.
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      collisionPadding = 8,
      ...props
    },
    ref,
  ): React.JSX.Element => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        onWheel={(e) => {
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
        }}
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
  ),
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
export { Popover, PopoverContent, PopoverTrigger };
