/**
 * src/components/ui/sheet.tsx
 * https://ui.shadcn.com/docs/components/sheet
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { cva } from "class-variance-authority";

// COMPONENTS
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { CloseLarge as CloseIcon } from "@carbon/icons-react";
import { Hint } from "./hint.js";

// DATA
import { SURFACE_VARIANTS } from "./variants.js";

// TYPES
import type { SurfaceVariant } from "./types.js";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
/** Renders the dimmed backdrop behind a sheet dialog.
 * @param attributes - Overlay attributes and optional class name.
 * @param ref - Forwarded reference to the overlay element.
 * @return A full-screen semi-transparent backdrop element.
 */
function SheetOverlayRender(
  attributes: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>,
  ref: React.ForwardedRef<React.ElementRef<typeof SheetPrimitive.Overlay>>,
): React.JSX.Element {
  const { className, ...otherAttributes } = attributes;
  return (
    <SheetPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...otherAttributes}
      ref={ref}
    />
  );
}

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(SheetOverlayRender);
/** Renders the positioned panel and its built-in close affordance.
 * @param attributes - Dialog attributes, edge placement, variant, and children.
 * @param ref - Forwarded reference to the dialog panel.
 * @return A portal dialog panel with overlay and close control.
 */
function SheetContentRender(
  attributes: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "top" | "bottom" | "left" | "right";
    variant?: SurfaceVariant;
  },
  ref: React.ForwardedRef<React.ElementRef<typeof SheetPrimitive.Content>>,
): React.JSX.Element {
  const {
    side = "right",
    variant = "primary-outline",
    className,
    children,
    ...otherAttributes
  } = attributes;
  return (
    <SheetPrimitive.Portal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(
          cva(
            "fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
            {
              variants: {
                // prettier-ignore
                side: { top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top', bottom: 'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom', left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm', right: 'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm', },
              },
              defaultVariants: { side: "right" },
            },
          )({ side }),
          SURFACE_VARIANTS({ variant }),
          className,
        )}
        {...otherAttributes}
      >
        {children}
        <SheetPrimitive.Close
          aria-label="Close sheet"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-12 focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-white dark:data-[state=open]:bg-black"
        >
          <CloseIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "top" | "bottom" | "left" | "right";
    variant?: SurfaceVariant;
  }
>(SheetContentRender);
/**
 * Header region for sheet content, typically containing title and description.
 *
 * @param attributes - Remaining div attributes forwarded to the header.
 * @param className - Optional style overrides for the header container.
 *
 * @return A flex column for the sheet title and description.
 */
function SheetHeader({
  className,
  ...attributes
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className,
      )}
      {...attributes}
    />
  );
}
/**
 * Footer container for primary and secondary sheet actions.
 *
 * @param attributes - Remaining div attributes forwarded to the footer.
 * @param className - Optional style overrides for the footer container.
 *
 * @return A responsive div that reverses actions on small screens and aligns them in a row at larger sizes.
 */
function SheetFooter({
  className,
  ...attributes
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className,
      )}
      {...attributes}
    />
  );
}
/**
 * Title text for the sheet dialog.
 *
 * @param className - Optional style overrides for the title.
 *
 * @returns A styled heading that names the sheet dialog.
 */
/** Renders the accessible title for the sheet dialog.
 * @param attributes - Title attributes and optional class name.
 * @param ref - Forwarded reference to the title element.
 * @return The styled sheet title heading.
 */
function SheetTitleRender(
  attributes: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>,
  ref: React.ForwardedRef<React.ElementRef<typeof SheetPrimitive.Title>>,
): React.JSX.Element {
  const { className, ...otherAttributes } = attributes;
  return (
    <SheetPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold text-primary-12", className)}
      {...otherAttributes}
    />
  );
}

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(SheetTitleRender);
/**
 * Supporting description text for the sheet dialog.
 *
 * @param className - Optional style overrides for the description.
 *
 * @returns A styled paragraph describing the sheet dialog.
 */
/** Renders supporting description text and its optional tooltip.
 * @param attributes - Description props, children, and optional tooltip content.
 * @param ref - Forwarded reference to the description element.
 * @return The description paragraph, optionally wrapped in a hint.
 */
function SheetDescriptionRender(
  attributes: React.ComponentPropsWithoutRef<
    typeof SheetPrimitive.Description
  > & {
    tooltip?: React.ReactNode;
  },
  ref: React.ForwardedRef<React.ElementRef<typeof SheetPrimitive.Description>>,
): React.JSX.Element {
  const { className, tooltip, children, ...otherAttributes } = attributes;
  const description = (
    <SheetPrimitive.Description
      ref={ref}
      className={cn("text-sm text-primary-11", className)}
      {...otherAttributes}
    >
      {children}
    </SheetPrimitive.Description>
  );
  return tooltip ? (
    <Hint content={tooltip} disabledTrigger>
      {description}
    </Hint>
  ) : (
    description
  );
}

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> & {
    tooltip?: React.ReactNode;
  }
>(SheetDescriptionRender);
SheetTrigger.displayName = SheetPrimitive.Trigger.displayName;
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
SheetContent.displayName = SheetPrimitive.Content.displayName;
SheetHeader.displayName = "SheetHeader";
SheetFooter.displayName = "SheetFooter";
SheetTitle.displayName = SheetPrimitive.Title.displayName;
SheetDescription.displayName = SheetPrimitive.Description.displayName;

// prettier-ignore
export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
