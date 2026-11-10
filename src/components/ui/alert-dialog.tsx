/**
 * src/components/ui/alert-dialog.tsx
 * https://ui.shadcn.com/docs/components/alert-dialog
 * Accessible confirmation dialog built on Radix AlertDialog and shared UI primitives.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Button } from "./button.js";

// DATA
import {
  OVERLAY_MOTION_VARIANTS,
  OVERLAY_SURFACE_VARIANTS,
  TEXT_VARIANTS,
} from "./variants.js";

// TYPES
import type * as React from "react";
import type { UiSize } from "./types.js";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Root of an alert dialog that requests a user decision.
 *
 * @param props - Radix alert-dialog root props.
 *
 * @return The Radix alert-dialog root with the shared data slot.
 */
function AlertDialog(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Root>,
): React.JSX.Element {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

/**
 * Portal for rendering alert-dialog content outside its parent layout.
 *
 * @param props - Radix portal props, including an optional container.
 *
 * @return The alert-dialog portal with the shared data slot.
 */
function AlertDialogPortal(
  props: React.ComponentProps<typeof AlertDialogPrimitive.Portal>,
): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

/**
 * Backdrop displayed behind alert-dialog content.
 *
 * @param props - Radix overlay props and optional class name.
 *
 * @return A fixed, animated alert-dialog backdrop.
 */
function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<
  typeof AlertDialogPrimitive.Overlay
>): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "bg-primary-12/10 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-[120] duration-100 supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Portaled alert-dialog surface with a size-specific maximum width.
 *
 * @param props - Radix content props, size, and optional class name.
 *
 * @return The overlay and alert-dialog content in a portal.
 */
function AlertDialogContent({
  className,
  size = "md",
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: UiSize;
}): React.JSX.Element {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-[120] grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 ring-1 duration-100 outline-none",
          OVERLAY_SURFACE_VARIANTS(),
          OVERLAY_MOTION_VARIANTS(),
          (
            {
              xs: "max-w-xs",
              sm: "max-w-sm",
              md: "max-w-md",
              lg: "max-w-lg",
              xl: "max-w-xl",
            } satisfies Record<UiSize, string>
          )[size],
          className,
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

/**
 * Responsive heading area for an alert dialog.
 *
 * @param props - Div attributes and optional class name.
 *
 * @return A centered or size-aligned alert-dialog header.
 */
function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=md]/alert-dialog-content:place-items-start sm:group-data-[size=md]/alert-dialog-content:text-left sm:group-data-[size=md]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Responsive action area for an alert dialog.
 *
 * @param props - Div attributes and optional class name.
 *
 * @return A footer that stacks actions on narrow screens and aligns them on wider screens.
 */
function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">): React.JSX.Element {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "bg-primary-3/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Accessible heading for the alert dialog.
 *
 * @param props - Radix title props and optional class name.
 *
 * @return A styled alert-dialog title.
 */
function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        "font-heading text-base font-medium sm:group-data-[size=md]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Supporting description associated with the alert-dialog title.
 *
 * @param props - Radix description props and optional class name.
 *
 * @return A styled alert-dialog description.
 */
function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<
  typeof AlertDialogPrimitive.Description
>): React.JSX.Element {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        "*:[a]:hover:text-primary-12 text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3",
        TEXT_VARIANTS({ tone: "muted", size: "sm" }),
        className,
      )}
      {...props}
    />
  );
}

/**
 * Confirms the action requested by an alert dialog.
 *
 * @param props - Radix action props, button styling, and optional loading text.
 *
 * @return A styled action button that can display its loading label.
 */
function AlertDialogAction({
  className,
  variant = "primary-default",
  size = "md",
  loading = false,
  loadingText,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  (Pick<React.ComponentProps<typeof Button>, "variant" | "size" | "loading"> & {
    loadingText?: React.ReactNode;
  })): React.JSX.Element {
  return (
    <Button variant={variant} size={size} loading={loading} asChild>
      <AlertDialogPrimitive.Action
        data-slot="alert-dialog-action"
        className={className}
        {...props}
      >
        {loading && loadingText ? loadingText : children}
      </AlertDialogPrimitive.Action>
    </Button>
  );
}

/**
 * Cancels or dismisses an alert dialog.
 *
 * @param props - Radix cancel props and button styling.
 *
 * @return A styled cancel button.
 */
function AlertDialogCancel({
  className,
  variant = "gray-outline",
  size = "md",
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<
    React.ComponentProps<typeof Button>,
    "variant" | "size"
  >): React.JSX.Element {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        data-slot="alert-dialog-cancel"
        className={className}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Cancel>
    </Button>
  );
}
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
};
