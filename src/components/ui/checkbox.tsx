/**
 * astro/src/components/ui/checkbox.tsx
 * https://ui.shadcn.com/docs/components/checkbox
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { useOptionalFormContext } from "./form.js";
import { INTERACTIVE_CONTROL_VARIANTS } from "./variants.js";

// COMPONENTS
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import type { FieldValues } from "react-hook-form";
import {
  Checkmark as CheckIcon,
  Subtract as SubtractIcon,
} from "@carbon/icons-react";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Styled checkbox component built on top of Radix UI's checkbox primitive.
 *
 * @returns A themed checkbox with focus, disabled, and checked states.
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
    name?: string;
  }
>(
  (
    { className, name, checked, defaultChecked, onCheckedChange, ...props },
    ref,
  ): React.JSX.Element => {
    const form = useOptionalFormContext<FieldValues>();
    const formChecked = form && name ? form.watch(name) : undefined;
    React.useEffect(() => {
      const initialValue = checked ?? defaultChecked;
      if (
        !form ||
        !name ||
        typeof initialValue !== "boolean" ||
        form.getValues(name) !== undefined
      )
        return;
      form.setValue(name, initialValue as never, { shouldDirty: false });
    }, [form, name, checked, defaultChecked]);
    return (
      <CheckboxPrimitive.Root
        ref={ref}
        name={name}
        checked={
          typeof formChecked === "boolean"
            ? formChecked
            : (checked ?? defaultChecked)
        }
        defaultChecked={form && name ? undefined : defaultChecked}
        onCheckedChange={(next) => {
          if (form && name)
            form.setValue(name, (next === true) as never, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
          onCheckedChange?.(next);
        }}
        className={cn(
          // general
          "group peer size-4 shrink-0 rounded-sm border border-primary-11 ring-offset-white",
          // focus and disabled
          INTERACTIVE_CONTROL_VARIANTS(),
          // checked
          "data-[state=checked]:bg-primary-11 data-[state=indeterminate]:bg-primary-11 data-[state=checked]:text-primary-1 data-[state=indeterminate]:text-primary-1 dark:data-[state=checked]:text-primary-12 dark:data-[state=indeterminate]:text-primary-12",
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          <CheckIcon
            className="size-4 group-data-[state=indeterminate]:hidden"
            aria-hidden="true"
          />
          <SubtractIcon
            className="hidden size-4 group-data-[state=indeterminate]:block"
            aria-hidden="true"
          />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  },
);

/**
 * Checkbox indicator component for custom icon or mark rendering.
 *
 */
const CheckboxIndicator = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Indicator>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
  >(({ className, ...props }, ref): React.JSX.Element => (
    <CheckboxPrimitive.Indicator
      ref={ref}
      className={cn("flex items-center justify-center text-current", className)}
      {...props}
    />
  )),
  { displayName: CheckboxPrimitive.Indicator.displayName },
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, CheckboxIndicator };
