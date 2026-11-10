/**
 * src/components/ui/context-menu.tsx
 * https://ui.shadcn.com/docs/components/context-menu
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { menuItemVariants } from "./variants.js";

// COMPONENTS
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
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

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = Object.assign(ContextMenuPrimitive.Group, {
  displayName: ContextMenuPrimitive.Group.displayName,
});
const ContextMenuPortal = Object.assign(ContextMenuPrimitive.Portal, {
  displayName: ContextMenuPrimitive.Portal.displayName,
});
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = Object.assign(ContextMenuPrimitive.RadioGroup, {
  displayName: ContextMenuPrimitive.RadioGroup.displayName,
});
const classes = {
  item: cn(
    "relative flex cursor-default select-none items-center rounded-sm px-2 py-1 text-sm outline-none focus:ring-0",
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
 * Renders a context menu sub-trigger item with chevron indicator.
 */
const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref): React.JSX.Element => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      classes.item,
      "gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      "data-[state=open]:[&:not([data-highlighted])]:bg-primary-4",
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    {children}
    <SubmenuIcon className="ml-auto" aria-hidden="true" />
  </ContextMenuPrimitive.SubTrigger>
));

/**
 * Renders context menu sub-content panel.
 */
const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref): React.JSX.Element => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      classes.palette,
      "z-50 ml-1 min-w-32 origin-[--radix-context-menu-content-transform-origin] overflow-hidden",
      className,
    )}
    {...props}
  />
));

/**
 * Renders main context menu content panel.
 */
const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, collisionPadding = 8, ...props }, ref): React.JSX.Element => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      collisionPadding={collisionPadding}
      className={cn(
        classes.palette,
        "z-50 max-h-[var(--radix-context-menu-content-available-height)] min-w-32 origin-[--radix-context-menu-content-transform-origin] overflow-y-auto overflow-x-hidden",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));

/**
 * Renders an interactive context menu item.
 */
const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> &
    VariantProps<typeof menuItemVariants> & { inset?: boolean }
>(({ className, inset, intent, ...props }, ref): React.JSX.Element => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      classes.item,
      menuItemVariants({ intent }),
      "gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
));

/**
 * Renders a context menu checkbox item with check indicator.
 */
const ContextMenuCheckboxItem = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
  >(({ className, children, checked, ...props }, ref): React.JSX.Element => (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(classes.item, "pl-8 pr-2", className)}
      checked={checked}
      {...props}
    >
      <span className={MENU_ITEM_INDICATOR}>
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" aria-hidden="true" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )),
  { displayName: ContextMenuPrimitive.CheckboxItem.displayName },
);

/**
 * Renders a context menu radio item with bullet indicator.
 */
const ContextMenuRadioItem = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
  >(({ className, children, ...props }, ref): React.JSX.Element => (
    <ContextMenuPrimitive.RadioItem
      ref={ref}
      className={cn(classes.item, "pl-8 pr-2", className)}
      {...props}
    >
      <span className={MENU_ITEM_INDICATOR}>
        <ContextMenuPrimitive.ItemIndicator>
          <RadioIcon className="size-1.5 fill-current" aria-hidden="true" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )),
  { displayName: ContextMenuPrimitive.RadioItem.displayName },
);

/**
 * Renders a non-interactive header label inside context menu.
 */
const ContextMenuLabel = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
      inset?: boolean;
    }
  >(({ className, inset, ...props }, ref): React.JSX.Element => (
    <ContextMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1 text-sm font-semibold",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  )),
  { displayName: ContextMenuPrimitive.Label.displayName },
);

/**
 * Renders a separator rule between context menu items.
 */
const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref): React.JSX.Element => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("mx-1.5 my-1 h-px bg-primary-6/50", className)}
    {...props}
  />
));

/**
 * Context menu shortcut indicator.
 *
 * @returns Context menu keyboard shortcut indicator text.
 */
const ContextMenuShortcut = Object.assign(
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
  { displayName: "ContextMenuShortcut" },
);
ContextMenuTrigger.displayName = ContextMenuPrimitive.Trigger.displayName;
ContextMenuSub.displayName = ContextMenuPrimitive.Sub.displayName;
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuRadioGroup,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
};
