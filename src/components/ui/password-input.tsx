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

/** Native input props accepted by the password field, excluding its fixed type. */
type PasswordInputProps = Omit<InputProps, "type">;

/** Renders a password input and its accessible visibility toggle.
 * @param inputProps - Native input attributes and optional Styling classes.
 * @param ref - Ref forwarded to the underlying input element.
 * @return A password input with a show or hide control.
 */
function renderPasswordInput(
  inputProps: PasswordInputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
): React.JSX.Element {
  const { className, ...props } = inputProps;
  const [visible, setVisible] = React.useState(false);
  const label = visible ? "Hide password" : "Show password";
  /** Returns the opposite visibility state for React's state updater. */
  function invertVisibility(current: boolean): boolean {
    return !current;
  }
  /** Toggles whether password characters are visible.
   * @return Nothing; the input visibility state is inverted.
   */
  function toggleVisibility(): void {
    setVisible(invertVisibility);
  }
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
        onClick={toggleVisibility}
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
}

/** Renders a password input with a visible/redacted toggle.
 * @param inputProps - Native input attributes and optional Styling classes.
 * @param ref - Ref forwarded to the underlying input element.
 * @return A password input with a show or hide control.
 */
export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(renderPasswordInput);
PasswordInput.displayName = "PasswordInput";
