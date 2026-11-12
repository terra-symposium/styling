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

/** Renders the trigger for a nested dropdown menu.
 * @param className - Additional classes for the submenu trigger.
 * @param inset - Whether the trigger aligns with inset menu items.
 * @param children - Trigger label shown before the chevron.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the Radix trigger element.
 * @return A submenu trigger with a trailing chevron.
 */
function DropdownMenuSubTriggerRender(
  attributes: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubTrigger
  > & {
    inset?: boolean;
  },
  ref: React.ForwardedRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>
  >,
): React.JSX.Element {
  const { className, inset, children, ...otherProps } = attributes;
  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        classes.item,
        "gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        inset && "pl-8",
        className,
      )}
      {...otherProps}
    >
      {children}
      <SubmenuIcon className="ml-auto" aria-hidden="true" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(DropdownMenuSubTriggerRender);

/** Renders the floating panel for a nested dropdown menu.
 * @param className - Additional classes for the submenu panel.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the Radix panel.
 * @return The styled nested dropdown panel.
 */
function DropdownMenuSubContentRender(
  attributes: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.SubContent
  >,
  ref: React.ForwardedRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>
  >,
): React.JSX.Element {
  const { className, ...otherProps } = attributes;
  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        classes.palette,
        "z-50 ml-1 min-w-32 origin-[--radix-dropdown-menu-content-transform-origin] overflow-hidden",
        className,
      )}
      {...otherProps}
    />
  );
}

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(DropdownMenuSubContentRender);

/** Renders the portaled main dropdown panel.
 * @param className - Additional classes for the panel surface.
 * @param collisionPadding - Minimum distance from viewport edges.
 * @param sideOffset - Distance between the trigger and menu panel.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the Radix content panel.
 * @return A portaled dropdown panel.
 */
function DropdownMenuContentRender(
  attributes: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Content
  >,
  ref: React.ForwardedRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>
  >,
): React.JSX.Element {
  const {
    className,
    collisionPadding = 8,
    sideOffset = 4,
    ...otherProps
  } = attributes;
  return (
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
        {...otherProps}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(DropdownMenuContentRender);

/** Renders an actionable menu item with shared intent variants.
 * @param className - Additional classes for the menu item.
 * @param inset - Whether the item aligns with an inset menu group.
 * @param intent - Shared visual intent for the item.
 * @param variant - Optional destructive appearance shortcut.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the Radix menu item.
 * @return The styled dropdown menu item.
 */
function DropdownMenuItemRender(
  attributes: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Item
  > &
    VariantProps<typeof menuItemVariants> & {
      inset?: boolean;
      variant?: "destructive";
    },
  ref: React.ForwardedRef<React.ElementRef<typeof DropdownMenuPrimitive.Item>>,
): React.JSX.Element {
  const { className, inset, intent, variant, ...otherProps } = attributes;
  return (
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
      {...otherProps}
    />
  );
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> &
    VariantProps<typeof menuItemVariants> & {
      inset?: boolean;
      variant?: "destructive";
    }
>(DropdownMenuItemRender);

/** Renders a toggleable checkbox and its selected indicator.
 * @param className - Additional classes for the checkbox item.
 * @param children - Checkbox label content.
 * @param checked - Checkbox state controlled by Radix.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the menu item.
 * @return The checkbox menu item with a checkmark indicator.
 */
function DropdownMenuCheckboxItemRender(
  attributes: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.CheckboxItem
  >,
  ref: React.ForwardedRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>
  >,
): React.JSX.Element {
  const { className, children, checked, ...otherProps } = attributes;
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(classes.item, "pl-8 pr-2", className)}
      checked={checked}
      {...otherProps}
    >
      <span className={MENU_ITEM_INDICATOR}>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

const DropdownMenuCheckboxItem = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
  >(DropdownMenuCheckboxItemRender),
  { displayName: DropdownMenuPrimitive.CheckboxItem.displayName },
);

/** Renders a radio option with its selected-state bullet.
 * @param className - Additional classes for the radio item.
 * @param children - Radio option label content.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the menu item.
 * @return The radio menu item with its selection indicator.
 */
function DropdownMenuRadioItemRender(
  attributes: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.RadioItem
  >,
  ref: React.ForwardedRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>
  >,
): React.JSX.Element {
  const { className, children, ...otherProps } = attributes;
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(classes.item, "pl-8 pr-2", className)}
      {...otherProps}
    >
      <span className={MENU_ITEM_INDICATOR}>
        <DropdownMenuPrimitive.ItemIndicator>
          <RadioIcon className="size-1.5 fill-current" aria-hidden="true" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

const DropdownMenuRadioItem = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
  >(DropdownMenuRadioItemRender),
  { displayName: DropdownMenuPrimitive.RadioItem.displayName },
);

/** Renders a category heading, optionally aligned with inset entries.
 * @param className - Additional classes for the label.
 * @param inset - Whether the label aligns with inset menu items.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the Radix label.
 * @return The dropdown menu section label.
 */
function DropdownMenuLabelRender(
  attributes: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Label
  > & {
    inset?: boolean;
  },
  ref: React.ForwardedRef<React.ElementRef<typeof DropdownMenuPrimitive.Label>>,
): React.JSX.Element {
  const { className, inset, ...otherProps } = attributes;
  return (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1 text-sm font-semibold",
        inset && "pl-8",
        className,
      )}
      {...otherProps}
    />
  );
}

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(DropdownMenuLabelRender);

/** Renders the horizontal divider between dropdown sections.
 * @param className - Additional classes for the separator.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the Radix separator.
 * @return The dropdown menu separator line.
 */
function DropdownMenuSeparatorRender(
  attributes: React.ComponentPropsWithoutRef<
    typeof DropdownMenuPrimitive.Separator
  >,
  ref: React.ForwardedRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>
  >,
): React.JSX.Element {
  const { className, ...otherProps } = attributes;
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      data-slot="dropdown-menu-separator"
      className={cn("mx-1.5 my-1 h-px bg-primary-6", className)}
      {...otherProps}
    />
  );
}

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(DropdownMenuSeparatorRender);

/** Renders keyboard shortcut text after a dropdown menu label.
 * @param className - Optional style overrides for the shortcut label.
 * @param attributes - Remaining span attributes forwarded to the label.
 * @return The styled dropdown keyboard shortcut.
 */
function DropdownMenuShortcutRender(
  attributes: React.HTMLAttributes<HTMLSpanElement>,
): React.JSX.Element {
  const { className, ...otherProps } = attributes;
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...otherProps}
    />
  );
}

const DropdownMenuShortcut = Object.assign(DropdownMenuShortcutRender, {
  displayName: "DropdownMenuShortcut",
});
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
