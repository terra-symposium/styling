/**
 * src/components/ui/label.tsx
 * https://ui.shadcn.com/docs/components/label
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

// DATA
import { FORM_LABEL_VARIANTS } from "./variants.js";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Accessible form label component built on top of Radix UI Label primitive.
 *
 * @returns React element for the form label.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref): React.JSX.Element => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(FORM_LABEL_VARIANTS(), className)}
    {...props}
  />
));
Label.displayName = "Label";
export { Label };
