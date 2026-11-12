/**
 * src/components/ui/button.tsx
 * https://ui.shadcn.com/docs/components/button
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { useFormStatus } from "react-dom";
import { useOptionalFormContext } from "./form.js";

// COMPONENTS
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Spinner } from "./spinner.js";

// DATA
import { ACTION_VARIANTS } from "./variants.js";

// TYPES
import type {
  ButtonSize,
  ButtonVariant,
  UiButtonButtonProps as ButtonProps,
} from "./types.js";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Primary interactive button component.
 */
/** Renders the primary button with form, loading, and menu-trigger states.
 * @param buttonProps - Button attributes and Styling variant options.
 * @param ref - Ref forwarded to the native button element.
 * @return A button or slotted child with accessible loading behavior.
 */
function ButtonRender(
  buttonProps: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.JSX.Element {
  const {
    className,
    variant = "primary-default",
    size = "md",
    asChild = false,
    disabled = false,
    loading = false,
    loadingText,
    menuTrigger,
    children,
    type = "button",
    ...props
  } = buttonProps;
  const Comp = asChild ? Slot : "button";
  const formStatus = useFormStatus();
  const form = useOptionalFormContext();
  const isLoading =
    loading || formStatus.pending || Boolean(form?.formState.isSubmitting);
  const iconOnly =
    size === "icon" ||
    size === "icon-xs" ||
    size === "icon-sm" ||
    size === "icon-lg";
  const slottedChild =
    asChild && React.isValidElement(children)
      ? React.Children.only(children)
      : null;
  const childLabel = slottedChild
    ? (slottedChild as React.ReactElement<{ "aria-label"?: unknown }>).props[
        "aria-label"
      ]
    : undefined;
  const ariaLabel =
    typeof props["aria-label"] === "string"
      ? props["aria-label"]
      : typeof childLabel === "string"
        ? childLabel
        : undefined;
  const menuTriggerClass = menuTrigger
    ? cn(
        "group flex h-9 w-9 items-center justify-center border transition",
        menuTrigger === "active"
          ? "border-primary-9 bg-primary-9/10 text-primary-5"
          : "border-gray-8 bg-gray-10 text-gray-11 hover:border-gray-7 hover:bg-gray-9 hover:text-white",
      )
    : undefined;
  const buttonContent = (
    <>
      {isLoading && <Spinner />}
      {!(isLoading && iconOnly) &&
        (isLoading && loadingText
          ? loadingText
          : slottedChild
            ? (slottedChild.props as { children?: React.ReactNode }).children
            : children)}
      {iconOnly && ariaLabel && <span className="sr-only">{ariaLabel}</span>}
    </>
  );
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        ACTION_VARIANTS({ variant, size, className }),
        menuTriggerClass,
      )}
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      // Automatically set aria-busy for screen readers based on the loading prop
      aria-busy={isLoading ? "true" : undefined}
      {...props}
    >
      {slottedChild
        ? React.cloneElement(slottedChild, undefined, buttonContent)
        : buttonContent}
    </Comp>
  );
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(ButtonRender);

/**
 * Anchor element styled to match button variants; defaults to the underline treatment.
 */
/** Attributes and variant choices for a button-styled anchor. */
type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  controlEnvironment?: "selected" | "available";
};

/** Renders an anchor using button variants and optional selected-state treatment.
 * @param linkProps - Anchor attributes and Styling variant options.
 * @param ref - Ref forwarded to the anchor element.
 * @return An anchor styled as a button.
 */
function ButtonLinkRender(
  linkProps: ButtonLinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>,
): React.JSX.Element {
  const {
    children,
    className,
    variant = "underline",
    size = "md",
    controlEnvironment,
    ...props
  } = linkProps;
  const ariaLabel =
    typeof props["aria-label"] === "string" ? props["aria-label"] : undefined;
  return (
    <a
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        ACTION_VARIANTS({ variant, size }),
        controlEnvironment === "selected" &&
          "rounded-lg border border-primary-12 bg-primary-12 px-4 py-2 text-sm font-bold text-white",
        controlEnvironment === "available" &&
          "rounded-lg border border-primary-4 px-4 py-2 text-sm font-semibold text-primary-11",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
      {(size === "icon" ||
        size === "icon-xs" ||
        size === "icon-sm" ||
        size === "icon-lg") &&
        ariaLabel && <span className="sr-only">{ariaLabel}</span>}
    </a>
  );
}
const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ButtonLinkRender,
);
Button.displayName = "Button";
ButtonLink.displayName = "ButtonLink";
export { Button, ButtonLink };
