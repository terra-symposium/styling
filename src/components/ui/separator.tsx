/**
 * src/components/ui/separator.tsx
 * https://ui.shadcn.com/docs/components/separator
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Separator primitive component.
 *
 * @param separatorProps - Native separator attributes and orientation settings.
 * @param ref - Ref forwarded to the Radix separator element.
 * @return A horizontal or vertical divider with shared surface styling.
 */
function renderSeparator(
  separatorProps: React.ComponentPropsWithoutRef<
    typeof SeparatorPrimitive.Root
  >,
  ref: React.ForwardedRef<React.ElementRef<typeof SeparatorPrimitive.Root>>,
): React.JSX.Element {
  const {
    className,
    orientation = "horizontal",
    decorative = true,
    ...props
  } = separatorProps;
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-primary-6",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(renderSeparator);
Separator.displayName = SeparatorPrimitive.Root.displayName;
export { Separator };
