/**
 * astro/src/components/ui/textarea.tsx
 * https://ui.shadcn.com/docs/components/textarea
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { useOptionalFormContext } from "./form.js";
import { FORM_CONTROL_VARIANTS } from "./variants.js";

// COMPONENTS
import * as React from "react";

// TYPES
import type { FieldValues } from "react-hook-form";
import type { FormControlVariant, UiSize } from "./types.js";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Textarea component designed to support multiline text inputs.
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & {
    variant?: FormControlVariant;
    size?: UiSize;
    setValueAs?: (value: string) => unknown;
  }
>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      name,
      onChange,
      onBlur,
      setValueAs,
      ...props
    },
    ref,
  ): React.JSX.Element => {
    const form = useOptionalFormContext<FieldValues>();
    const registration =
      form && name ? form.register(name, { setValueAs }) : null;
    return (
      <textarea
        name={name}
        data-slot="textarea"
        className={cn(
          "min-h-[80px]",
          FORM_CONTROL_VARIANTS({ variant, size }),
          className,
        )}
        ref={(element) => {
          registration?.ref(element);
          if (typeof ref === "function") ref(element);
          else if (ref) ref.current = element;
        }}
        onChange={(event) => {
          registration?.onChange(event);
          onChange?.(event);
        }}
        onBlur={(event) => {
          registration?.onBlur(event);
          onBlur?.(event);
        }}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
export { Textarea };
