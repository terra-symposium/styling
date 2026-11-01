/**
 * astro/src/components/ui/input-otp.tsx
 * https://ui.shadcn.com/docs/components/input-otp
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import { CircleSolid as DotIcon } from "@carbon/icons-react";
import { OTPInput, OTPInputContext } from "input-otp";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Root OTP input component for entering one-time passwords.
 */
const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput> & {
    containerClassName?: string;
  }
>(({ className, containerClassName, ...props }, ref): React.JSX.Element => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex h-12 items-center gap-4 has-[:disabled]:opacity-50",
      containerClassName,
    )}
    className={cn(
      "font-bold outline-none disabled:cursor-not-allowed",
      className,
    )}
    {...props}
  />
));

/**
 * Container group for OTP input slots.
 */
const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref): React.JSX.Element => (
  <div
    ref={ref}
    className={cn("group flex size-full items-center", className)}
    {...props}
  />
));

/**
 * Individual character slot within an OTP input component.
 */
const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref): React.JSX.Element => {
  const { char, hasFakeCaret, isActive } =
    React.useContext(OTPInputContext).slots[index] ?? {};
  return (
    <div
      ref={ref}
      className={cn(
        // layout
        "relative flex h-full shrink-0 grow basis-0 items-center justify-center transition-all",
        // border
        "border-y border-r border-primary-6 first:rounded-l-md first:border-l last:rounded-r-md",
        // style
        "bg-white shadow-sm dark:bg-black",
        // state
        "group-[[disabled]&]:bg-primary-1 group-[[disabled]&]:opacity-50",
        isActive && "z-10 ring-2 ring-primary-6",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-blink bg-primary-12 duration-1000" />
        </div>
      )}
    </div>
  );
});

/**
 * Decorative separator between OTP slot groups.
 */
const InputOTPSeparator = Object.assign(
  React.forwardRef<
    React.ElementRef<"div">,
    React.ComponentPropsWithoutRef<"div">
  >((props, ref): React.JSX.Element => (
    <div ref={ref} role="separator" {...props}>
      <DotIcon className="size-1" aria-hidden="true" />
    </div>
  )),
  { displayName: "InputOTPSeparator" },
);
InputOTP.displayName = "InputOTP";
InputOTPGroup.displayName = "InputOTPGroup";
InputOTPSlot.displayName = "InputOTPSlot";
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
