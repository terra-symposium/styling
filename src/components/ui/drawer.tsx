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

/**
 * Drawer backdrop overlay element.
 *
 */
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref): React.JSX.Element => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
));

/**
 * Drawer container content element rendered inside portal with overlay.
 *
 * @param children - Drawer content elements.
 */
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref): React.JSX.Element => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border",
        SURFACE_VARIANTS({ variant: "primary-outline" }),
        className,
      )}
      {...props}
    >
      <div
        className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-primary-1"
        aria-hidden="true"
      />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
));

/**
 * Drawer accessible title heading primitive.
 *
 */
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref): React.JSX.Element => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));

/**
 * Drawer accessible description text primitive.
 *
 */
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref): React.JSX.Element => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm", className)}
    {...props}
  />
));

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Renders the drawer component root primitive.
 *
 * @param props - Open state, event callbacks, and supported root attributes forwarded to the drawer primitive.
 * @param shouldScaleBackground - Whether background scales down when open.
 *
 * @return React element for the drawer root primitive.
 */
function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>): React.JSX.Element {
  return (
    <DrawerPrimitive.Root
      shouldScaleBackground={shouldScaleBackground}
      {...props}
    />
  );
}

/**
 * Drawer header container.
 *
 * @param props - HTML attributes for the header container.
 *
 * @return React element for the drawer header.
 */
function DrawerHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
      {...props}
    />
  );
}

/**
 * Drawer footer container.
 *
 * @param props - HTML attributes for the footer container.
 *
 * @return React element for the drawer footer.
 */
function DrawerFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
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
