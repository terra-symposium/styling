/**
 * src/components/ui/password-input.tsx
 * https://ui.shadcn.com/docs/components/input
 * Password input with an accessible visibility toggle.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import { Button } from "./button.js";
import { Input } from "./input.js";
import { View as ViewIcon, ViewOff as ViewOffIcon } from "@carbon/icons-react";

// TYPES
import type { InputProps } from "./types.js";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/** Renders a password input with a visible/redacted toggle. */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type">
>(({ className, ...props }, ref): React.JSX.Element => {
  const [visible, setVisible] = React.useState(false);
  const label = visible ? "Hide password" : "Show password";
  return (
    <div className="relative flex items-center">
      <Input
        {...props}
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn("pr-10", className)}
      />
      <Button
        aria-label={label}
        aria-pressed={visible}
        className="absolute right-1 size-8 text-primary-11 hover:text-primary-12"
        onClick={() => {
          setVisible((val) => !val);
        }}
        title={label}
        type="button"
        variant="ghost"
        size="icon-sm"
      >
        {visible ? (
          <ViewOffIcon aria-hidden="true" />
        ) : (
          <ViewIcon aria-hidden="true" />
        )}
        <span className="sr-only">{label}</span>
      </Button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";
