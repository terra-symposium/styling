/**
 * astro/src/components/ui/input.tsx
 * https://ui.shadcn.com/docs/components/input
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { useOptionalFormContext } from "./form.js";

// COMPONENTS
import * as React from "react";
import { Button } from "./button.js";

// DATA
import { FORM_CONTROL_VARIANTS, TEXT_VARIANTS } from "./variants.js";

// TYPES
import type { FieldValues } from "react-hook-form";
import type { InputProps } from "./types.js";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Text input control supporting variants, sizes, adornments, and optional React Hook Form registration.
 */

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      icon,
      prefix,
      suffix,
      onClear,
      setValueAs,
      className,
      type = "text",
      variant = "primary",
      size = "md",
      name,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ): React.JSX.Element => {
    const form = useOptionalFormContext<FieldValues>();
    const registration =
      form && name && type !== "file"
        ? form.register(name, {
            setValueAs: (raw) => {
              const normalized =
                type === "hidden" && typeof raw !== "string"
                  ? (JSON.stringify(raw) ?? "")
                  : String(raw);
              if (setValueAs) return setValueAs(normalized);
              if (type === "number")
                return normalized === "" ? null : Number(normalized);
              return raw;
            },
          })
        : null;
    const leading = prefix ?? icon;
    const input = (
      <input
        type={type}
        name={name}
        data-slot="input"
        className={cn(
          FORM_CONTROL_VARIANTS({
            variant: variant === "ghost" ? "primary-ghost" : variant,
            size,
          }),
          variant === "ghost" && "h-auto border-0 p-0",
          leading && "pl-10",
          suffix && "pr-10",
          onClear && "pr-16",
          (prefix || suffix || onClear) &&
            "h-full flex-1 rounded-none border-0 bg-transparent shadow-none outline-none focus-visible:border-transparent focus-visible:ring-0",
          // override
          className,
        )}
        ref={(element) => {
          registration?.ref(element);
          if (typeof ref === "function") ref(element);
          else if (ref) ref.current = element;
        }}
        value={value}
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
    if (!icon && !prefix && !suffix && !onClear) return input;
    if (icon && !prefix && !suffix && !onClear) {
      return (
        <div className="relative flex items-center">
          <div
            className={cn(
              "pointer-events-none absolute left-3 flex items-center justify-center",
              TEXT_VARIANTS({ tone: "muted" }),
            )}
          >
            {icon}
          </div>
          {input}
        </div>
      );
    }
    return (
      <div className="focus-within:border-primary-9 focus-within:ring-primary-2 border-primary-6 flex min-h-11 overflow-hidden rounded-lg border bg-white py-0 shadow-sm focus-within:ring-2">
        <div className="relative flex min-w-0 flex-1 items-center">
          {leading && (
            <span
              className={cn(
                "pointer-events-none absolute left-3 z-10 flex items-center justify-center",
                TEXT_VARIANTS({ tone: "muted" }),
              )}
            >
              {leading}
            </span>
          )}
          {input}
        </div>
        {suffix && (
          <span
            className={cn(
              "pointer-events-none flex shrink-0 items-center px-3",
              TEXT_VARIANTS({ tone: "muted" }),
            )}
          >
            {suffix}
          </span>
        )}
        {onClear && String(value ?? "").trim() && (
          <Button
            type="button"
            variant="gray-ghost"
            size="sm"
            onClick={() => {
              if (form && name)
                form.setValue(name, "" as never, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                });
              onClear();
            }}
          >
            Clear
          </Button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
