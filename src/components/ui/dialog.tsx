/**
 * src/components/ui/dialog.tsx
 * https://ui.shadcn.com/docs/components/dialog
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { CloseLarge as CloseIcon } from "@carbon/icons-react";
import { Button } from "./button.js";
import { Hint } from "./hint.js";

// DATA
import {
  DISABLED_STATE_VARIANTS,
  FOCUS_VISIBLE_VARIANTS,
  OVERLAY_MOTION_VARIANTS,
  SURFACE_VARIANTS,
} from "./variants.js";

// TYPES
import type { Size, SurfaceVariant } from "./types.js";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

// ROOT
const Dialog = DialogPrimitive.Root;

// TRIGGER
/**
 * Trigger element that opens the dialog modal.
 */
const DialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ className, ...props }, ref): React.JSX.Element => (
  <DialogPrimitive.Trigger ref={ref} className={className} {...props} />
));
DialogTrigger.displayName = DialogPrimitive.Trigger.displayName;

// PORTAL
const DialogPortal = DialogPrimitive.Portal;
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

// CLOSE
const DialogClose = DialogPrimitive.Close;
DialogClose.displayName = DialogPrimitive.Close.displayName;

// OVERLAY
/**
 * Dark translucent backdrop rendered behind dialog content.
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref): React.JSX.Element => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[100] bg-black/25 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-black/50",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// CONTENT
/**
 * Main modal content overlay container.
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    size?: Size;
    variant?: SurfaceVariant;
    closeClassName?: string;
    overlayClassName?: string;
    bodyClassName?: string;
    scrollable?: boolean;
    showClose?: boolean;
    showCloseButton?: boolean;
  }
>(
  (
    {
      className,
      children,
      size = "lg",
      variant = "gray-default",
      closeClassName,
      overlayClassName,
      bodyClassName,
      scrollable = true,
      showClose = true,
      showCloseButton,
      ...props
    },
    ref,
  ): React.JSX.Element => (
    <DialogPortal>
      <DialogOverlay className={cn("print:hidden", overlayClassName)} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        ref={ref}
        className={cn(
          // positioning
          "fixed left-1/2 top-1/2 z-[100] flex max-h-[calc(100%-1rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 gap-y-2 space-y-2 !overflow-visible rounded-lg border p-6 shadow-lg print:hidden",
          OVERLAY_MOTION_VARIANTS(),
          "duration-150 data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98] data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2",
          SURFACE_VARIANTS({ variant }),
          // sizing
          "w-full",
          // colouring
          /*
           * A mapping of size keys to their corresponding max-width and max-height utility classes. Each
           * class uses min() to ensure a responsive gap on smaller screens.
           */ {
            xs: [
              "max-w-[min(20rem,calc(100%-1rem))]",
              "max-h-[min(25rem,calc(100%-1rem))]",
            ],
            sm: [
              "max-w-[min(30rem,calc(100%-1rem))]",
              "max-h-[min(35rem,calc(100%-1rem))]",
            ],
            md: [
              "max-w-[min(40rem,calc(100%-1rem))]",
              "max-h-[min(45rem,calc(100%-1rem))]",
            ],
            lg: [
              "max-w-[min(50rem,calc(100%-1rem))]",
              "max-h-[min(55rem,calc(100%-1rem))]",
            ],
            xl: [
              "max-w-[min(60rem,calc(100%-1rem))]",
              "max-h-[min(65rem,calc(100%-1rem))]",
            ],
          }[size],
          className,
        )}
        {...props}
      >
        <div className="relative flex size-full min-h-0 flex-col">
          {(showCloseButton ?? showClose) && (
            <DialogPrimitive.Close
              aria-label="Close dialog"
              className={cn(
                "absolute right-0 z-10 flex size-6 items-center justify-center rounded-sm text-primary-12 ring-offset-transparent transition-colors hover:text-primary-12 focus:outline-none focus-visible:ring-inset focus-visible:ring-offset-0",
                FOCUS_VISIBLE_VARIANTS(),
                DISABLED_STATE_VARIANTS({ target: "native" }),
                closeClassName,
              )}
            >
              <CloseIcon className="size-4" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
          <div
            className={cn(
              "relative flex min-h-0 flex-1 flex-col [&_*:focus-visible]:ring-inset [&_*:focus-visible]:ring-offset-0",
              scrollable && "overflow-y-auto overscroll-y-contain",
              !scrollable && "overflow-hidden",
              bodyClassName,
            )}
          >
            {children}
          </div>
        </div>
      </DialogPrimitive.Content>
    </DialogPortal>
  ),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

// HEADER
/**
 * Dialog header.
 *
 * @return A dialog header container, optionally hidden from visual layout.
 */
const DialogHeader = ({
  className,
  visuallyHidden = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  visuallyHidden?: boolean;
}): React.JSX.Element => (
  <div
    data-slot="dialog-header"
    className={cn(
      "mb-4 flex flex-col text-center sm:text-left",
      visuallyHidden && "sr-only",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

// FOOTER
/**
 * Dialog footer.
 *
 * @return A dialog footer with optional close action and grid layout.
 */
const DialogFooter = ({
  className,
  layout = "default",
  showCloseButton = false,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  layout?: "default" | "grid";
  showCloseButton?: boolean;
}): React.JSX.Element => (
  <div
    data-slot="dialog-footer"
    className={cn(
      "mt-2 flex flex-col-reverse gap-2 rounded-lg border bg-primary-3/50 p-4 sm:flex-row sm:justify-end",
      layout === "grid" && "grid sm:grid-cols-4",
      className,
    )}
    {...props}
  >
    {children}
    {showCloseButton && (
      <DialogPrimitive.Close asChild>
        <Button variant="gray-outline">Close</Button>
      </DialogPrimitive.Close>
    )}
  </div>
);
DialogFooter.displayName = "DialogFooter";

// TITLE
/**
 * Accessible dialog title heading.
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref): React.JSX.Element => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// DESCRIPTION
/**
 * Accessible dialog description body text.
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
    tooltip?: React.ReactNode;
  }
>(
  (
    {
      className,
      tooltip,
      children,
      ...props
    }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
      tooltip?: React.ReactNode;
    },
    ref,
  ): React.JSX.Element => {
    const description = (
      <DialogPrimitive.Description
        data-slot="dialog-description"
        ref={ref}
        className={cn("text-sm text-primary-10", className)}
        {...props}
      >
        {children}
      </DialogPrimitive.Description>
    );
    return tooltip ? (
      <Hint content={tooltip} disabledTrigger>
        {description}
      </Hint>
    ) : (
      description
    );
  },
);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// EXPORTS
export {
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
