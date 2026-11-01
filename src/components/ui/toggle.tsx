/**
 * astro/src/components/ui/toggle.tsx
 * https://ui.shadcn.com/docs/components/toggle
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

// TYPES
import type { VariantProps } from "class-variance-authority";

// DATA
import { TOGGLE_VARIANTS } from "./variants.js";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof TOGGLE_VARIANTS>
>(({ className, variant, size, ...props }, ref): React.JSX.Element => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(TOGGLE_VARIANTS({ variant, size }), className)}
    {...props}
  />
));
Toggle.displayName = TogglePrimitive.Root.displayName;
export { Toggle };
