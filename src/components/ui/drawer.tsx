/**
 * src/components/ui/drawer.tsx
 * https://ui.shadcn.com/docs/components/drawer
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

// DATA
import { SURFACE_VARIANTS } from "./variants.js";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

/** Renders the dimmed overlay behind an open drawer.
 * @param className - Additional classes for the overlay surface.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the overlay element.
 * @return The styled drawer overlay.
 */
function DrawerOverlayRender(
  attributes: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>,
  ref: React.ForwardedRef<React.ElementRef<typeof DrawerPrimitive.Overlay>>,
): React.JSX.Element {
  const { className, ...otherProps } = attributes;
  return (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn("fixed inset-0 z-50 bg-black/80", className)}
      {...otherProps}
    />
  );
}

/** Drawer backdrop overlay element. */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(DrawerOverlayRender);

/** Renders drawer content inside a portal with its overlay and handle.
 * @param className - Additional classes for the content panel.
 * @param children - Content rendered inside the drawer panel.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the Radix drawer content.
 * @return A portal-hosted drawer panel with overlay and handle.
 */
function DrawerContentRender(
  attributes: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>,
  ref: React.ForwardedRef<React.ElementRef<typeof DrawerPrimitive.Content>>,
): React.JSX.Element {
  const { className, children, ...otherProps } = attributes;
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border",
          SURFACE_VARIANTS({ variant: "primary-outline" }),
          className,
        )}
        {...otherProps}
      >
        <div
          className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-primary-1"
          aria-hidden="true"
        />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

/**
 * Drawer container content element rendered inside portal with overlay.
 *
 * @param children - Drawer content elements.
 */
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(DrawerContentRender);

/** Renders the accessible title using the shared drawer heading styles.
 * @param className - Additional classes for the title.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the title element.
 * @return The styled drawer title.
 */
function DrawerTitleRender(
  attributes: React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>,
  ref: React.ForwardedRef<React.ElementRef<typeof DrawerPrimitive.Title>>,
): React.JSX.Element {
  const { className, ...otherProps } = attributes;
  return (
    <DrawerPrimitive.Title
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className,
      )}
      {...otherProps}
    />
  );
}

/** Drawer accessible title heading primitive. */
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(DrawerTitleRender);

/** Renders the accessible description with drawer body text styling.
 * @param className - Additional classes for the description text.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the description element.
 * @return The styled drawer description.
 */
function DrawerDescriptionRender(
  attributes: React.ComponentPropsWithoutRef<
    typeof DrawerPrimitive.Description
  >,
  ref: React.ForwardedRef<React.ElementRef<typeof DrawerPrimitive.Description>>,
): React.JSX.Element {
  const { className, ...otherProps } = attributes;
  return (
    <DrawerPrimitive.Description
      ref={ref}
      className={cn("text-sm", className)}
      {...otherProps}
    />
  );
}

/** Drawer accessible description text primitive. */
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(DrawerDescriptionRender);

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Renders the drawer component root primitive.
 *
 * @param attributes - Open state, event callbacks, and remaining root attributes.
 * @param shouldScaleBackground - Whether background scales down when open.
 *
 * @return React element for the drawer root primitive.
 */
function Drawer({
  shouldScaleBackground = true,
  ...attributes
}: React.ComponentProps<typeof DrawerPrimitive.Root>): React.JSX.Element {
  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      {...attributes}
    />
  );
}

/**
 * Drawer header container.
 *
 * @param className - Additional layout classes for the header container.
 * @param attributes - Remaining HTML attributes forwarded to the header.
 *
 * @return React element for the drawer header.
 */
function DrawerHeader({
  className,
  ...attributes
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
      {...attributes}
    />
  );
}

/**
 * Drawer footer container.
 *
 * @param className - Additional layout classes for the footer container.
 * @param attributes - Remaining HTML attributes forwarded to the footer.
 *
 * @return React element for the drawer footer.
 */
function DrawerFooter({
  className,
  ...attributes
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...attributes}
    />
  );
}
Drawer.displayName = "Drawer";
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;
DrawerContent.displayName = "DrawerContent";
DrawerHeader.displayName = "DrawerHeader";
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

// EXPORTS
export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
