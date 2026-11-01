/**
 * astro/src/components/ui/button-group.tsx
 * https://ui.shadcn.com/docs/components/button-group
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { cva } from "class-variance-authority";

// COMPONENTS
import * as React from "react";

// TYPES
import type { VariantProps } from "class-variance-authority";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

// ORIENTATION-AWARE LAYOUT VARIANTS
const BUTTON_GROUP_VARIANTS = cva(
  "flex w-fit items-stretch has-[>[data-slot=button-group]]:gap-2 [&>*]:focus-visible:relative [&>*]:focus-visible:z-10 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: { orientation: "horizontal" },
  },
);

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Group wrapper for a set of related buttons.
 *
 * This component:
 * - Applies shared layout and border-radius styles to adjacent buttons.
 * - Sets appropriate ARIA roles for grouped controls.
 * - Accepts an `orientation` variant to switch between horizontal and vertical layouts.
 *
 * @param props - Child buttons and div attributes; `orientation` controls their layout and `className` extends the group styles.
 *
 * @return A grouped button container with orientation-aware styling and ARIA metadata.
 */
function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof BUTTON_GROUP_VARIANTS>): React.JSX.Element {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(BUTTON_GROUP_VARIANTS({ orientation, className }))}
      {...props}
    />
  );
}

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
