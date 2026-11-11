/**
 * src/components/ui/switch.tsx
 * https://ui.shadcn.com/docs/components/switch
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

// DATA
import { INTERACTIVE_CONTROL_VARIANTS } from "./variants.js";
const SWITCH_THUMB_CLASSES =
  "pointer-events-none block size-4 rounded-full bg-primary-1 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Interactive toggle switch component with support for checked, unchecked, and indeterminate states.
 *
 * @param checked - Checked state (boolean, or null/undefined for indeterminate).
 *
 * @returns React element for the toggle switch.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  Omit<
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    "checked"
  > & { checked?: boolean | null }
>(({ className, checked, ...props }, ref): React.JSX.Element => {
  const indeterminate = checked === null || checked === undefined;
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        INTERACTIVE_CONTROL_VARIANTS(),
        "data-[state=checked]:bg-primary-9 data-[state=unchecked]:bg-primary-3",
        indeterminate && "!bg-primary-6",
        className,
      )}
      data-indeterminate={indeterminate ? "true" : undefined}
      aria-checked={indeterminate ? "mixed" : checked}
      checked={checked ?? false}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(SWITCH_THUMB_CLASSES, indeterminate && "!translate-x-2")}
      />
    </SwitchPrimitives.Root>
  );
});

/**
 * Switch thumb component for the sliding handle indicator.
 *
 */
const SwitchThumb = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Thumb>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Thumb>
  >(({ className, ...props }, ref): React.JSX.Element => (
    <SwitchPrimitives.Thumb
      ref={ref}
      className={cn(SWITCH_THUMB_CLASSES, className)}
      {...props}
    />
  )),
  { displayName: SwitchPrimitives.Thumb.displayName },
);
Switch.displayName = SwitchPrimitives.Root.displayName;
export { Switch, SwitchThumb };
