/**
 * src/components/ui/checkbox.tsx
 * https://ui.shadcn.com/docs/components/checkbox
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { useOptionalFormContext } from "./form.js";

// COMPONENTS
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import {
  Checkmark as CheckIcon,
  Subtract as SubtractIcon,
} from "@carbon/icons-react";

// DATA
import { INTERACTIVE_CONTROL_VARIANTS } from "./variants.js";

// TYPES
import type { FieldValues } from "react-hook-form";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Styled checkbox component built on top of Radix UI's checkbox primitive.
 *
 * @returns A themed checkbox with focus, disabled, and checked states.
 */
/** Radix checkbox attributes with an optional react-hook-form field name. */
type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  name?: string;
};

/** Writes a checkbox change to the form before notifying the caller.
 * @param next - Checked or indeterminate state reported by Radix.
 * @param name - Registered field name, when the checkbox belongs to a form.
 * @param form - Optional form context to update.
 * @param onCheckedChange - Optional caller callback invoked after form update.
 * @return Nothing; form state and the caller callback receive the change.
 */
function updateCheckboxValue(
  next: Parameters<
    NonNullable<
      React.ComponentProps<typeof CheckboxPrimitive.Root>["onCheckedChange"]
    >
  >[0],
  name: string | undefined,
  form: ReturnType<typeof useOptionalFormContext<FieldValues>>,
  onCheckedChange: React.ComponentProps<
    typeof CheckboxPrimitive.Root
  >["onCheckedChange"],
): void {
  if (form && name)
    form.setValue(name, (next === true) as never, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  onCheckedChange?.(next);
}

/** Renders a controlled or form-registered Radix checkbox.
 * @param checkboxProps - Radix state, field name, and native checkbox attributes.
 * @param ref - Ref forwarded to the Radix checkbox root.
 * @return A themed checkbox with form synchronization when available.
 */
function renderCheckbox(
  checkboxProps: CheckboxProps,
  ref: React.ForwardedRef<React.ElementRef<typeof CheckboxPrimitive.Root>>,
): React.JSX.Element {
  const {
    className,
    name,
    checked,
    defaultChecked,
    onCheckedChange,
    ...props
  } = checkboxProps;
  const form = useOptionalFormContext<FieldValues>();
  const formChecked = form && name ? form.watch(name) : undefined;
  /** Seeds a registered checkbox from its initial value without marking it dirty. */
  function initializeFormValue(): void {
    const initialValue = checked ?? defaultChecked;
    if (
      !form ||
      !name ||
      typeof initialValue !== "boolean" ||
      form.getValues(name) !== undefined
    )
      return;
    form.setValue(name, initialValue as never, { shouldDirty: false });
  }
  React.useEffect(initializeFormValue, [form, name, checked, defaultChecked]);
  /** Persists the Radix state and notifies the optional caller callback.
   * @param next - Checked or indeterminate state reported by Radix.
   * @return Nothing; the form and caller receive the value in order.
   */
  function handleCheckedChange(
    next: Parameters<
      NonNullable<
        React.ComponentProps<typeof CheckboxPrimitive.Root>["onCheckedChange"]
      >
    >[0],
  ): void {
    updateCheckboxValue(next, name, form, onCheckedChange);
  }
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
      onCheckedChange={handleCheckedChange}
      className={cn(
        "group peer size-4 shrink-0 rounded-sm border border-primary-11 ring-offset-white",
        INTERACTIVE_CONTROL_VARIANTS(),
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
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(renderCheckbox);

/**
 * Checkbox indicator component for custom icon or mark rendering.
 *
 */
/** Renders the optional checkbox icon or mark inside Radix's indicator slot.
 * @param indicatorProps - Native indicator attributes and optional classes.
 * @param ref - Ref forwarded to the Radix indicator element.
 * @return The centered checkbox indicator.
 */
function renderCheckboxIndicator(
  indicatorProps: React.ComponentPropsWithoutRef<
    typeof CheckboxPrimitive.Indicator
  >,
  ref: React.ForwardedRef<React.ElementRef<typeof CheckboxPrimitive.Indicator>>,
): React.JSX.Element {
  const { className, ...props } = indicatorProps;
  return (
    <CheckboxPrimitive.Indicator
      ref={ref}
      className={cn("flex items-center justify-center text-current", className)}
      {...props}
    />
  );
}

const CheckboxIndicator = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Indicator>,
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
  >(renderCheckboxIndicator),
  { displayName: CheckboxPrimitive.Indicator.displayName },
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
export { Checkbox, CheckboxIndicator };
