/**
 * src/components/ui/alert-dialog.tsx
 * https://ui.shadcn.com/docs/components/alert-dialog
 * Accessible confirmation dialog built on Radix AlertDialog and shared UI primitives.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';
import { createTerraPortal } from './portal-container.js';

// COMPONENTS
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { Button } from './button.js';

// DATA
import { OVERLAY_MOTION_VARIANTS, OVERLAY_SURFACE_VARIANTS, TEXT_VARIANTS } from './variants.js';

// TYPES
import type * as React from 'react';
import type { UiSize } from './types.js';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Root of an alert dialog that requests a user decision.
 *
 * @param rootProps Radix alert-dialog root properties.
 *
 * @return The Radix alert-dialog root with the shared data slot.
 */
function AlertDialog(rootProps: React.ComponentProps<typeof AlertDialogPrimitive.Root>): React.JSX.Element {
	return <AlertDialogPrimitive.Root data-slot='alert-dialog' {...rootProps} />;
}

// terra-quality-ignore single-use -- Keep the portal component identity stable across renders; creating it inside AlertDialogPortal would remount the dialog.
const AlertDialogPortalPrimitive = createTerraPortal(AlertDialogPrimitive.Portal);

/**
 * Portal for rendering alert-dialog content outside its parent layout.
 *
 * @param portalProps Radix portal properties, including an optional container.
 *
 * @return The alert-dialog portal with the shared data slot.
 */
function AlertDialogPortal(portalProps: React.ComponentProps<typeof AlertDialogPrimitive.Portal>): React.JSX.Element {
	return <AlertDialogPortalPrimitive data-slot='alert-dialog-portal' {...portalProps} />;
}

/**
 * Backdrop displayed behind alert-dialog content.
 *
 * @param className Optional classes applied to the backdrop.
 * @param primitiveProps Remaining Radix overlay properties.
 *
 * @return A fixed, animated alert-dialog backdrop.
 */
function AlertDialogOverlay({ className, ...primitiveProps }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>): React.JSX.Element {
	return (
		<AlertDialogPrimitive.Overlay
			data-slot='alert-dialog-overlay'
			className={cn(
				'bg-primary-12/10 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-[120] duration-100 supports-backdrop-filter:backdrop-blur-xs',
				className,
			)}
			{...primitiveProps}
		/>
	);
}

/**
 * Portaled alert-dialog surface with a size-specific maximum width.
 *
 * @param className Optional classes applied to the dialog surface.
 * @param size Maximum-width preset for the content surface.
 * @param primitiveProps Remaining Radix content properties.
 *
 * @return The overlay and alert-dialog content in a portal.
 */
function AlertDialogContent({
	className,
	size = 'md',
	...primitiveProps
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
	size?: UiSize;
}): React.JSX.Element {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content
				data-slot='alert-dialog-content'
				data-size={size}
				className={cn(
					'group/alert-dialog-content fixed top-1/2 left-1/2 z-[120] grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl p-4 ring-1 duration-100 outline-none',
					OVERLAY_SURFACE_VARIANTS(),
					OVERLAY_MOTION_VARIANTS(),
					(
						{
							xs: 'max-w-xs',
							sm: 'max-w-sm',
							md: 'max-w-md',
							lg: 'max-w-lg',
							xl: 'max-w-xl',
						} satisfies Record<UiSize, string>
					)[size],
					className,
				)}
				{...primitiveProps}
			/>
		</AlertDialogPortal>
	);
}

/**
 * Responsive heading area for an alert dialog.
 *
 * @param className Optional classes applied to the header.
 * @param primitiveProps Remaining div attributes.
 *
 * @return A centered or size-aligned alert-dialog header.
 */
function AlertDialogHeader({ className, ...primitiveProps }: React.ComponentProps<'div'>): React.JSX.Element {
	return (
		<div
			data-slot='alert-dialog-header'
			className={cn(
				'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=md]/alert-dialog-content:place-items-start sm:group-data-[size=md]/alert-dialog-content:text-left sm:group-data-[size=md]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
				className,
			)}
			{...primitiveProps}
		/>
	);
}

/**
 * Responsive action area for an alert dialog.
 *
 * @param className Optional classes applied to the footer.
 * @param primitiveProps Remaining div attributes.
 *
 * @return A footer that stacks actions on narrow screens and aligns them on wider screens.
 */
function AlertDialogFooter({ className, ...primitiveProps }: React.ComponentProps<'div'>): React.JSX.Element {
	return (
		<div
			data-slot='alert-dialog-footer'
			className={cn(
				'bg-primary-3/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end',
				className,
			)}
			{...primitiveProps}
		/>
	);
}

/**
 * Accessible heading for the alert dialog.
 *
 * @param className Optional classes applied to the title.
 * @param primitiveProps Remaining Radix title properties.
 *
 * @return A styled alert-dialog title.
 */
function AlertDialogTitle({ className, ...primitiveProps }: React.ComponentProps<typeof AlertDialogPrimitive.Title>): React.JSX.Element {
	return (
		<AlertDialogPrimitive.Title
			data-slot='alert-dialog-title'
			className={cn('font-heading text-base font-medium sm:group-data-[size=md]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2', className)}
			{...primitiveProps}
		/>
	);
}

/**
 * Supporting description associated with the alert-dialog title.
 *
 * @param className Optional classes applied to the description.
 * @param primitiveProps Remaining Radix description properties.
 *
 * @return A styled alert-dialog description.
 */
function AlertDialogDescription({ className, ...primitiveProps }: React.ComponentProps<typeof AlertDialogPrimitive.Description>): React.JSX.Element {
	return (
		<AlertDialogPrimitive.Description
			data-slot='alert-dialog-description'
			className={cn('*:[a]:hover:text-primary-12 text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3', TEXT_VARIANTS({ tone: 'muted', size: 'sm' }), className)}
			{...primitiveProps}
		/>
	);
}

/**
 * Confirms the action requested by an alert dialog.
 *
 * @param className Optional classes applied to the action element.
 * @param variant Button visual variant.
 * @param size Button size preset.
 * @param loading Shows a busy state on the action button.
 * @param loadingText Content shown while the action is loading.
 * @param children Content shown while the action is idle.
 * @param primitiveProps Remaining Radix action properties.
 *
 * @return A styled action button that can display its loading label.
 */
function AlertDialogAction({
	className,
	variant = 'primary-default',
	size = 'md',
	loading = false,
	loadingText,
	children,
	...primitiveProps
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
	(Pick<React.ComponentProps<typeof Button>, 'variant' | 'size' | 'loading'> & {
		loadingText?: React.ReactNode;
	})): React.JSX.Element {
	return (
		<Button variant={variant} size={size} loading={loading} asChild>
			<AlertDialogPrimitive.Action data-slot='alert-dialog-action' className={className} {...primitiveProps}>
				{loading && loadingText ? loadingText : children}
			</AlertDialogPrimitive.Action>
		</Button>
	);
}

/**
 * Cancels or dismisses an alert dialog.
 *
 * @param className Optional classes applied to the cancel element.
 * @param variant Button visual variant.
 * @param size Button size preset.
 * @param children Cancel button content.
 * @param primitiveProps Remaining Radix cancel properties.
 *
 * @return A styled cancel button.
 */
function AlertDialogCancel({
	className,
	variant = 'gray-outline',
	size = 'md',
	children,
	...primitiveProps
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> & Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>): React.JSX.Element {
	return (
		<Button variant={variant} size={size} asChild>
			<AlertDialogPrimitive.Cancel data-slot='alert-dialog-cancel' className={className} {...primitiveProps}>
				{children}
			</AlertDialogPrimitive.Cancel>
		</Button>
	);
}
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle };
