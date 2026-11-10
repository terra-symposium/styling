/**
 * src/components/ui/dropdown-menu.tsx
 * https://ui.shadcn.com/docs/components/dropdown-menu
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { menuItemVariants } from "./variants.js";

// COMPONENTS
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as React from "react";
import {
  Checkmark as CheckIcon,
  ChevronRight as SubmenuIcon,
  CircleSolid as RadioIcon,
} from "@carbon/icons-react";

// DATA
import {
  MENU_ITEM,
  MENU_ITEM_INDICATOR,
  OVERLAY_MOTION_VARIANTS,
  OVERLAY_SURFACE_VARIANTS,
  RADIX_SIDE_POSITION_VARIANTS,
} from "./variants.js";

// TYPES
import type { VariantProps } from "class-variance-authority";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = Object.assign(DropdownMenuPrimitive.Portal, {
  displayName: DropdownMenuPrimitive.Portal.displayName,
});
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = Object.assign(DropdownMenuPrimitive.RadioGroup, {
  displayName: DropdownMenuPrimitive.RadioGroup.displayName,
});
const classes = {
  item: cn(
    "relative flex w-full cursor-default select-none items-center gap-x-2 rounded-sm px-2 py-1 text-sm outline-none focus:ring-0",
    MENU_ITEM,
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", // Disabled
  ),
  palette: cn(
    "rounded-md border p-1 focus:ring-0",
    OVERLAY_SURFACE_VARIANTS(),
    OVERLAY_MOTION_VARIANTS(),
    RADIX_SIDE_POSITION_VARIANTS(),
  ),
};

/**
 * Trigger element for nested sub-dropdown menus.
 */
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref): React.JSX.Element => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      classes.item,
      "gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <SubmenuIcon className="ml-auto" aria-hidden="true" />
  </DropdownMenuPrimitive.SubTrigger>
));

/**
 * Container popover for nested sub-dropdown menu items.
 */
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref): React.JSX.Element => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      classes.palette,
      "z-50 ml-1 min-w-32 origin-[--radix-dropdown-menu-content-transform-origin] overflow-hidden",
      className,
    )}
    {...props}
  />
));

/**
 * Main dropdown menu content container popup.
 */
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(
  (
    { className, collisionPadding = 8, sideOffset = 4, ...props },
    ref,
  ): React.JSX.Element => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          classes.palette,
          "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-32 origin-[--radix-dropdown-menu-content-transform-origin] overflow-y-auto overflow-x-hidden text-sm",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  ),
);

/**
 * Individual action item within a dropdown menu.
 */
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> &
    VariantProps<typeof menuItemVariants> & {
      inset?: boolean;
      variant?: "destructive";
    }
>(({ className, inset, intent, variant, ...props }, ref): React.JSX.Element => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      classes.item,
      menuItemVariants({
        intent: variant === "destructive" ? "destructive" : intent,
      }),
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));

/**
 * Toggleable checkbox item within a dropdown menu.
 */
const DropdownMenuCheckboxItem = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
  >(({ className, children, checked, ...props }, ref): React.JSX.Element => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(classes.item, "pl-8 pr-2", className)}
      checked={checked}
      {...props}
    >
      <span className={MENU_ITEM_INDICATOR}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )),
  { displayName: DropdownMenuPrimitive.CheckboxItem.displayName },
);

/**
 * Single-select radio option within a dropdown menu radio group.
 */
const DropdownMenuRadioItem = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
  >(({ className, children, ...props }, ref): React.JSX.Element => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(classes.item, "pl-8 pr-2", className)}
      {...props}
    >
      <span className={MENU_ITEM_INDICATOR}>
        <DropdownMenuPrimitive.ItemIndicator>
          <RadioIcon className="size-1.5 fill-current" aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )),
  { displayName: DropdownMenuPrimitive.RadioItem.displayName },
);

/**
 * Category header or section label within a dropdown menu.
 */
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref): React.JSX.Element => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1 text-sm font-semibold",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));

/**
 * Horizontal separator line dividing sections in a dropdown menu.
 */
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref): React.JSX.Element => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    data-slot="dropdown-menu-separator"
    className={cn("mx-1.5 my-1 h-px bg-primary-6", className)}
    {...props}
  />
));

/**
 * Keyboard shortcut indicator label aligned to the trailing side of a menu item.
 *
 * @param className - Optional style overrides for the shortcut label.
 * @param props - Additional span attributes forwarded to the label.
 */
const DropdownMenuShortcut = Object.assign(
  ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLSpanElement>): React.JSX.Element => {
    return (
      <span
        className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
        {...props}
      />
    );
  },
  { displayName: "DropdownMenuShortcut" },
);
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName;
DropdownMenuSub.displayName = DropdownMenuPrimitive.Sub.displayName;
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
};
