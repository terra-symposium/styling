/**
 * src/components/ui/context-menu.tsx
 * https://ui.shadcn.com/docs/components/context-menu
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';
import { createTerraPortal } from './portal-container.js';
import { menuItemVariants } from './variants.js';

// COMPONENTS
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import * as React from 'react';
import { Checkmark as CheckIcon, ChevronRight as SubmenuIcon, CircleSolid as RadioIcon } from '@carbon/icons-react';

// DATA
import { MENU_ITEM, MENU_ITEM_INDICATOR, OVERLAY_MOTION_VARIANTS, OVERLAY_SURFACE_VARIANTS, RADIX_SIDE_POSITION_VARIANTS } from './variants.js';

// TYPES
import type { VariantProps } from 'class-variance-authority';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
const ContextMenuGroup = Object.assign(ContextMenuPrimitive.Group, {
	displayName: ContextMenuPrimitive.Group.displayName,
});
const ContextMenuPortal = Object.assign(createTerraPortal(ContextMenuPrimitive.Portal), {
	displayName: ContextMenuPrimitive.Portal.displayName,
});
const ContextMenuSub = ContextMenuPrimitive.Sub;
const ContextMenuRadioGroup = Object.assign(ContextMenuPrimitive.RadioGroup, {
	displayName: ContextMenuPrimitive.RadioGroup.displayName,
});
const classes = {
	item: cn(
		'relative flex cursor-default select-none items-center rounded-sm px-2 py-1 text-sm outline-none focus:ring-0',
		MENU_ITEM,
		'data-[disabled]:pointer-events-none data-[disabled]:opacity-50', // Disabled
	),
	palette: cn('rounded-md border p-1 focus:ring-0', OVERLAY_SURFACE_VARIANTS(), OVERLAY_MOTION_VARIANTS(), RADIX_SIDE_POSITION_VARIANTS()),
};

// terra-quality-ignore single-use -- Keep ContextMenuSubTriggerRender as a named declaration so its authored TSDoc stays attached. TSDoc: Renders a context menu sub-trigger item with chevron indicator.
/** Renders a context menu sub-trigger item with chevron indicator.
 * className: - Additional classes for the submenu trigger.
 * inset: - Whether the label aligns with inset menu items.
 * children: - Label content rendered before the chevron.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the Radix trigger element.
 * @return A submenu trigger with its chevron indicator.
 */
function ContextMenuSubTriggerRender(
	attributes: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
		inset?: boolean;
	},
	ref: React.ForwardedRef<React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>>,
): React.JSX.Element {
	const { className, inset, children, ...otherProps } = attributes;
	return (
		<ContextMenuPrimitive.SubTrigger
			ref={ref}
			className={cn(classes.item, 'gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', 'data-[state=open]:[&:not([data-highlighted])]:bg-primary-4', inset && 'pl-8', className)}
			{...otherProps}
		>
			{children}
			<SubmenuIcon className='ml-auto' aria-hidden='true' />
		</ContextMenuPrimitive.SubTrigger>
	);
}

const ContextMenuSubTrigger = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
		inset?: boolean;
	}
>(ContextMenuSubTriggerRender);

// terra-quality-ignore single-use -- Keep ContextMenuSubContentRender as a named declaration so its authored TSDoc stays attached. TSDoc: Renders context menu sub-content panel.
/** Renders context menu sub-content panel.
 * className: - Additional classes for the submenu panel.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the sub-content panel.
 * @return A styled context menu submenu panel.
 */
function ContextMenuSubContentRender(
	attributes: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>,
	ref: React.ForwardedRef<React.ElementRef<typeof ContextMenuPrimitive.SubContent>>,
): React.JSX.Element {
	const { className, ...otherProps } = attributes;
	return (
		<ContextMenuPrimitive.SubContent
			ref={ref}
			className={cn(classes.palette, 'z-50 ml-1 min-w-32 origin-[--radix-context-menu-content-transform-origin] overflow-hidden', className)}
			{...otherProps}
		/>
	);
}

const ContextMenuSubContent = React.forwardRef<React.ElementRef<typeof ContextMenuPrimitive.SubContent>, React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>>(
	ContextMenuSubContentRender,
);

// terra-quality-ignore single-use -- Keep ContextMenuContentRender as a named declaration so its authored TSDoc stays attached. TSDoc: Renders main context menu content panel.
/** Renders main context menu content panel.
 * collisionPadding: - Minimum distance from viewport edges.
 * className: - Additional classes for the menu panel.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the content panel.
 * @return A portal-hosted context menu content panel.
 */
function ContextMenuContentRender(
	attributes: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>,
	ref: React.ForwardedRef<React.ElementRef<typeof ContextMenuPrimitive.Content>>,
): React.JSX.Element {
	const { className, collisionPadding = 8, ...otherProps } = attributes;
	return (
		<ContextMenuPortal>
			<ContextMenuPrimitive.Content
				ref={ref}
				collisionPadding={collisionPadding}
				className={cn(
					classes.palette,
					'z-50 max-h-[var(--radix-context-menu-content-available-height)] min-w-32 origin-[--radix-context-menu-content-transform-origin] overflow-y-auto overflow-x-hidden',
					className,
				)}
				{...otherProps}
			/>
		</ContextMenuPortal>
	);
}

const ContextMenuContent = React.forwardRef<React.ElementRef<typeof ContextMenuPrimitive.Content>, React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>>(ContextMenuContentRender);

// terra-quality-ignore single-use -- Keep ContextMenuItemRender as a named declaration so its authored TSDoc stays attached. TSDoc: Renders an interactive context menu item.
/** Renders an interactive context menu item.
 * className: - Additional classes for the menu item.
 * inset: - Whether the item aligns with an inset menu group.
 * intent: - Visual intent passed to the shared menu item variants.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the menu item.
 * @return The styled, interactive context menu item.
 */
function ContextMenuItemRender(
	attributes: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & VariantProps<typeof menuItemVariants> & { inset?: boolean },
	ref: React.ForwardedRef<React.ElementRef<typeof ContextMenuPrimitive.Item>>,
): React.JSX.Element {
	const { className, inset, intent, ...otherProps } = attributes;
	return (
		<ContextMenuPrimitive.Item
			ref={ref}
			className={cn(classes.item, menuItemVariants({ intent }), 'gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', inset && 'pl-8', className)}
			{...otherProps}
		/>
	);
}

const ContextMenuItem = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & VariantProps<typeof menuItemVariants> & { inset?: boolean }
>(ContextMenuItemRender);

// terra-quality-ignore single-use -- Keep ContextMenuCheckboxItemRender as a named declaration so its authored TSDoc stays attached. TSDoc: Renders a checkbox item and its checked-state indicator.
/** Renders a checkbox item and its checked-state indicator.
 * className: - Additional classes for the checkbox item.
 * children: - Checkbox label content.
 * checked: - Checked state controlled by Radix.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the checkbox item.
 * @return A checkbox menu item with a checkmark indicator.
 */
function ContextMenuCheckboxItemRender(
	attributes: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>,
	ref: React.ForwardedRef<React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>>,
): React.JSX.Element {
	const { className, children, checked, ...otherProps } = attributes;
	return (
		<ContextMenuPrimitive.CheckboxItem ref={ref} className={cn(classes.item, 'pl-8 pr-2', className)} checked={checked} {...otherProps}>
			<span className={MENU_ITEM_INDICATOR}>
				<ContextMenuPrimitive.ItemIndicator>
					<CheckIcon className='size-4' aria-hidden='true' />
				</ContextMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.CheckboxItem>
	);
}

/**
 * Renders a context menu checkbox item with check indicator.
 */
const ContextMenuCheckboxItem = Object.assign(
	React.forwardRef<React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>, React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>>(ContextMenuCheckboxItemRender),
	{ displayName: ContextMenuPrimitive.CheckboxItem.displayName },
);

// terra-quality-ignore single-use -- Keep ContextMenuRadioItemRender as a named declaration so its authored TSDoc stays attached. TSDoc: Renders a radio item and its selected-state bullet.
/** Renders a radio item and its selected-state bullet.
 * className: - Additional classes for the radio item.
 * children: - Radio label content.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the radio item.
 * @return A radio menu item with its bullet indicator.
 */
function ContextMenuRadioItemRender(
	attributes: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>,
	ref: React.ForwardedRef<React.ElementRef<typeof ContextMenuPrimitive.RadioItem>>,
): React.JSX.Element {
	const { className, children, ...otherProps } = attributes;
	return (
		<ContextMenuPrimitive.RadioItem ref={ref} className={cn(classes.item, 'pl-8 pr-2', className)} {...otherProps}>
			<span className={MENU_ITEM_INDICATOR}>
				<ContextMenuPrimitive.ItemIndicator>
					<RadioIcon className='size-1.5 fill-current' aria-hidden='true' />
				</ContextMenuPrimitive.ItemIndicator>
			</span>
			{children}
		</ContextMenuPrimitive.RadioItem>
	);
}

const ContextMenuRadioItem = Object.assign(
	React.forwardRef<React.ElementRef<typeof ContextMenuPrimitive.RadioItem>, React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>>(ContextMenuRadioItemRender),
	{ displayName: ContextMenuPrimitive.RadioItem.displayName },
);

// terra-quality-ignore single-use -- Keep ContextMenuLabelRender as a named declaration so its authored TSDoc stays attached. TSDoc: Renders an optional inset heading inside the context menu.
/** Renders an optional inset heading inside the context menu.
 * className: - Additional classes for the label.
 * inset: - Whether the label aligns with inset menu items.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the label element.
 * @return The styled context menu label.
 */
function ContextMenuLabelRender(
	attributes: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
		inset?: boolean;
	},
	ref: React.ForwardedRef<React.ElementRef<typeof ContextMenuPrimitive.Label>>,
): React.JSX.Element {
	const { className, inset, ...otherProps } = attributes;
	return <ContextMenuPrimitive.Label ref={ref} className={cn('px-2 py-1 text-sm font-semibold', inset && 'pl-8', className)} {...otherProps} />;
}

const ContextMenuLabel = Object.assign(
	React.forwardRef<
		React.ElementRef<typeof ContextMenuPrimitive.Label>,
		React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
			inset?: boolean;
		}
	>(ContextMenuLabelRender),
	{ displayName: ContextMenuPrimitive.Label.displayName },
);

// terra-quality-ignore single-use -- Keep ContextMenuSeparatorRender as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the divider between context menu items.
/** Renders the divider between context menu items.
 * className: - Additional classes for the separator line.
 * @param attributes - Remaining Radix attributes forwarded to the primitive.
 * @param ref - Forwarded reference to the separator element.
 * @return A context menu separator line.
 */
function ContextMenuSeparatorRender(
	attributes: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>,
	ref: React.ForwardedRef<React.ElementRef<typeof ContextMenuPrimitive.Separator>>,
): React.JSX.Element {
	const { className, ...otherProps } = attributes;
	return <ContextMenuPrimitive.Separator ref={ref} className={cn('mx-1.5 my-1 h-px bg-primary-6/50', className)} {...otherProps} />;
}

const ContextMenuSeparator = React.forwardRef<React.ElementRef<typeof ContextMenuPrimitive.Separator>, React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>>(
	ContextMenuSeparatorRender,
);

// terra-quality-ignore single-use -- Keep ContextMenuShortcutRender as a named React component to preserve its identity. TSDoc: Renders keyboard shortcut text aligned after a context menu label.
/** Renders keyboard shortcut text aligned after a context menu label.
 * className: - Additional classes for the shortcut indicator.
 * @param attributes - Remaining span attributes forwarded to the indicator.
 * @return The styled keyboard shortcut indicator.
 */
function ContextMenuShortcutRender(attributes: React.HTMLAttributes<HTMLSpanElement>): React.JSX.Element {
	const { className, ...otherProps } = attributes;
	return <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...otherProps} />;
}

const ContextMenuShortcut = Object.assign(ContextMenuShortcutRender, {
	displayName: 'ContextMenuShortcut',
});
ContextMenuTrigger.displayName = ContextMenuPrimitive.Trigger.displayName;
ContextMenuSub.displayName = ContextMenuPrimitive.Sub.displayName;
ContextMenuSubTrigger.displayName = 'ContextMenuSubTrigger';
ContextMenuSubContent.displayName = 'ContextMenuSubContent';
ContextMenuContent.displayName = 'ContextMenuContent';
ContextMenuItem.displayName = 'ContextMenuItem';
ContextMenuSeparator.displayName = 'ContextMenuSeparator';
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
