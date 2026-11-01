/**
 * astro/src/components/ui/toggle-group.tsx
 * https://ui.shadcn.com/docs/components/toggle-group
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

// DATA
import { TOGGLE_VARIANTS } from "./variants.js";

// TYPES
import type { VariantProps } from "class-variance-authority";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Propagates variant and size props from ToggleGroup down to its children, using the locally
 * defined TOGGLE_VARIANTS.
 */
const ToggleGroupCtx = React.createContext<
  Required<VariantProps<typeof TOGGLE_VARIANTS>>
>({ size: "md", variant: "default" });

/**
 * The container for a set of toggle buttons. It accepts variants to style all its child items
 * consistently.
 *
 * @param variant - Optional style variant for all child toggle items.
 * @param size - Optional size variant for all child toggle items.
 * @param children - ToggleGroup items.
 */
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof TOGGLE_VARIANTS>
>(
  (
    { className, variant, size, children, ...props },
    ref,
  ): React.JSX.Element => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      <ToggleGroupCtx.Provider
        value={{ variant: variant ?? "default", size: size ?? "md" }}
      >
        {children}
      </ToggleGroupCtx.Provider>
    </ToggleGroupPrimitive.Root>
  ),
);

/**
 * An individual toggle item that derives its styling from the local TOGGLE_VARIANTS, making it a
 * self-contained component.
 *
 * @param children - Item content.
 * @param variant - Style variant override.
 * @param size - Size variant override.
 */
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof TOGGLE_VARIANTS>
>(
  (
    { className, children, variant, size, ...props },
    ref,
  ): React.JSX.Element => {
    const ctx = React.useContext(ToggleGroupCtx);
    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          TOGGLE_VARIANTS({
            variant: variant ?? ctx.variant,
            size: size ?? ctx.size,
            className,
          }),
        )}
        {...props}
      >
        {children}
      </ToggleGroupPrimitive.Item>
    );
  },
);

ToggleGroupCtx.displayName = "ToggleGroupContext";
ToggleGroup.displayName = "ToggleGroup";
ToggleGroupItem.displayName = "ToggleGroupItem";

// EXPORTS
export { ToggleGroup, ToggleGroupItem };
