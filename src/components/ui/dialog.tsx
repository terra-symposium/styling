/**
 * src/components/ui/dialog.tsx
 * https://ui.shadcn.com/docs/components/dialog
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';
import { createTerraPortal } from './portal-container.js';

// COMPONENTS
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';
import { Button } from './button.js';
import { CloseLarge as CloseIcon } from '@carbon/icons-react';
import { Hint } from './hint.js';

// DATA
import { DISABLED_STATE_VARIANTS, FOCUS_VISIBLE_VARIANTS, OVERLAY_MOTION_VARIANTS, SURFACE_VARIANTS } from './variants.js';

// TYPES
import type { Size, SurfaceVariant } from './types.js';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

// ROOT
const Dialog = DialogPrimitive.Root;

// TRIGGER
/*
 * Trigger element that opens the dialog modal.
 */
// terra-quality-ignore single-use -- Keep renderDialogTrigger as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the trigger primitive while forwarding its element ref.
/** Renders the trigger primitive while forwarding its element ref.
 *
 * @param triggerProps Trigger attributes and optional class name.
 * @param ref Ref forwarded to the trigger element.
 *
 * @return The Radix dialog trigger.
 */
function renderDialogTrigger(
	triggerProps: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>,
	ref: React.ForwardedRef<React.ElementRef<typeof DialogPrimitive.Trigger>>,
): React.JSX.Element {
	const { className, ...primitiveProps } = triggerProps;
	return <DialogPrimitive.Trigger ref={ref} className={className} {...primitiveProps} />;
}
const DialogTrigger = React.forwardRef(renderDialogTrigger);
DialogTrigger.displayName = 'DialogTrigger';

// PORTAL
const DialogPortal = createTerraPortal(DialogPrimitive.Portal);
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

// CLOSE
const DialogClose = DialogPrimitive.Close;
DialogClose.displayName = DialogPrimitive.Close.displayName;

// OVERLAY
/*
 * Dark translucent backdrop rendered behind dialog content.
 */
// terra-quality-ignore single-use -- Keep renderDialogOverlay as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the backdrop primitive with shared overlay animation styles.
/** Renders the backdrop primitive with shared overlay animation styles.
 *
 * @param overlayProps Overlay attributes and optional class name.
 * @param ref Ref forwarded to the backdrop element.
 *
 * @return The styled dialog backdrop.
 */
function renderDialogOverlay(
	overlayProps: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>,
	ref: React.ForwardedRef<React.ElementRef<typeof DialogPrimitive.Overlay>>,
): React.JSX.Element {
	const { className, ...primitiveProps } = overlayProps;
	return (
		<DialogPrimitive.Overlay
			ref={ref}
			className={cn(
				'fixed inset-0 z-[100] bg-black/25 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-black/50',
				className,
			)}
			{...primitiveProps}
		/>
	);
}
const DialogOverlay = React.forwardRef(renderDialogOverlay);
DialogOverlay.displayName = 'DialogOverlay';

// CONTENT

// terra-quality-ignore single-use -- Keep renderDialogContent as a named declaration so its authored TSDoc stays attached. TSDoc: Renders modal content with a backdrop, responsive bounds, and optional close action.
/** Renders modal content with a backdrop, responsive bounds, and optional close action.
 *
 * @param dialogProps Content, size, surface, scrolling, close-control, and Radix props.
 * @param ref Ref forwarded to the dialog content element.
 *
 * @return The portaled dialog overlay and content surface.
 */
function renderDialogContent(
	dialogProps: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
		size?: Size;
		variant?: SurfaceVariant;
		closeClassName?: string;
		overlayClassName?: string;
		bodyClassName?: string;
		scrollable?: boolean;
		showClose?: boolean;
		showCloseButton?: boolean;
	},
	ref: React.ForwardedRef<React.ElementRef<typeof DialogPrimitive.Content>>,
): React.JSX.Element {
	const {
		className,
		children,
		size = 'lg',
		variant = 'gray-default',
		closeClassName,
		overlayClassName,
		bodyClassName,
		scrollable = true,
		showClose = true,
		showCloseButton,
		...primitiveProps
	} = dialogProps;
	return (
		<DialogPortal>
			<DialogOverlay className={cn('print:hidden', overlayClassName)} />
			<DialogPrimitive.Content
				data-slot='dialog-content'
				ref={ref}
				className={cn(
					// positioning
					'fixed left-1/2 top-1/2 z-[100] flex max-h-[calc(100%-1rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 gap-y-2 space-y-2 !overflow-visible rounded-lg border p-6 shadow-lg print:hidden',
					OVERLAY_MOTION_VARIANTS(),
					'duration-150 data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98] data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2',
					SURFACE_VARIANTS({ variant }),
					// sizing
					'w-full',
					// colouring
					/*
					 * A mapping of size keys to their corresponding max-width and max-height utility classes. Each
					 * class uses min() to ensure a responsive gap on smaller screens.
					 */ {
						xs: ['max-w-[min(20rem,calc(100%-1rem))]', 'max-h-[min(25rem,calc(100%-1rem))]'],
						sm: ['max-w-[min(30rem,calc(100%-1rem))]', 'max-h-[min(35rem,calc(100%-1rem))]'],
						md: ['max-w-[min(40rem,calc(100%-1rem))]', 'max-h-[min(45rem,calc(100%-1rem))]'],
						lg: ['max-w-[min(50rem,calc(100%-1rem))]', 'max-h-[min(55rem,calc(100%-1rem))]'],
						xl: ['max-w-[min(60rem,calc(100%-1rem))]', 'max-h-[min(65rem,calc(100%-1rem))]'],
					}[size],
					className,
				)}
				{...primitiveProps}
			>
				<div className='relative flex size-full min-h-0 flex-col'>
					{(showCloseButton ?? showClose) && (
						<DialogPrimitive.Close
							aria-label='Close dialog'
							className={cn(
								'absolute right-0 z-10 flex size-6 items-center justify-center rounded-sm text-primary-12 ring-offset-transparent transition-colors hover:text-primary-12 focus:outline-none focus-visible:ring-inset focus-visible:ring-offset-0',
								FOCUS_VISIBLE_VARIANTS(),
								DISABLED_STATE_VARIANTS({ target: 'native' }),
								closeClassName,
							)}
						>
							<CloseIcon className='size-4' aria-hidden='true' />
							<span className='sr-only'>Close</span>
						</DialogPrimitive.Close>
					)}
					<div
						className={cn(
							'relative flex min-h-0 flex-1 flex-col [&_*:focus-visible]:ring-inset [&_*:focus-visible]:ring-offset-0',
							scrollable && 'overflow-y-auto overscroll-y-contain',
							!scrollable && 'overflow-hidden',
							bodyClassName,
						)}
					>
						{children}
					</div>
				</div>
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}
const DialogContent = React.forwardRef(renderDialogContent);
DialogContent.displayName = 'DialogContent';

// HEADER
/**
 * Dialog header.
 *
 * @param className Optional classes applied to the header.
 * @param visuallyHidden Hides the header visually while preserving it for assistive technology.
 * @param headerProps Remaining div attributes.
 *
 * @return A dialog header container, optionally hidden from visual layout.
 */
function DialogHeader({
	className,
	visuallyHidden = false,
	...headerProps
}: React.HTMLAttributes<HTMLDivElement> & {
	visuallyHidden?: boolean;
}): React.JSX.Element {
	return <div data-slot='dialog-header' className={cn('mb-4 flex flex-col text-center sm:text-left', visuallyHidden && 'sr-only', className)} {...headerProps} />;
}
DialogHeader.displayName = 'DialogHeader';

// FOOTER
/**
 * Dialog footer.
 *
 * @param className Optional classes applied to the footer.
 * @param layout Selects the standard flex layout or a four-column grid.
 * @param showCloseButton Adds the standard close action when true.
 * @param children Footer actions and supporting content.
 * @param footerProps Remaining div attributes.
 *
 * @return A dialog footer with optional close action and grid layout.
 */
function DialogFooter({
	className,
	layout = 'default',
	showCloseButton = false,
	children,
	...footerProps
}: React.HTMLAttributes<HTMLDivElement> & {
	layout?: 'default' | 'grid';
	showCloseButton?: boolean;
}): React.JSX.Element {
	return (
		<div
			data-slot='dialog-footer'
			className={cn('mt-2 flex flex-col-reverse gap-2 rounded-lg border bg-primary-3/50 p-4 sm:flex-row sm:justify-end', layout === 'grid' && 'grid sm:grid-cols-4', className)}
			{...footerProps}
		>
			{children}
			{showCloseButton && (
				<DialogPrimitive.Close asChild>
					<Button variant='gray-outline'>Close</Button>
				</DialogPrimitive.Close>
			)}
		</div>
	);
}
DialogFooter.displayName = 'DialogFooter';

// TITLE
/*
 * Accessible dialog title heading.
 */
// terra-quality-ignore single-use -- Keep renderDialogTitle as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the dialog title with shared heading typography.
/** Renders the dialog title with shared heading typography.
 *
 * @param titleProps Title attributes and optional class name.
 * @param ref Ref forwarded to the title element.
 *
 * @return The styled Radix dialog title.
 */
function renderDialogTitle(titleProps: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>, ref: React.ForwardedRef<React.ElementRef<typeof DialogPrimitive.Title>>): React.JSX.Element {
	const { className, ...primitiveProps } = titleProps;
	return <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...primitiveProps} />;
}
const DialogTitle = React.forwardRef(renderDialogTitle);
DialogTitle.displayName = 'DialogTitle';

// DESCRIPTION

// terra-quality-ignore single-use -- Keep renderDialogDescription as a named declaration so its authored TSDoc stays attached. TSDoc: Renders dialog description text and optionally wraps it in a hint.
/** Renders dialog description text and optionally wraps it in a hint.
 *
 * @param descriptionProps Description content, tooltip, and primitive attributes.
 * @param ref Ref forwarded to the description element.
 *
 * @return Description text, optionally wrapped in the shared Hint component.
 */
function renderDialogDescription(
	descriptionProps: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & {
		tooltip?: React.ReactNode;
	},
	ref: React.ForwardedRef<React.ElementRef<typeof DialogPrimitive.Description>>,
): React.JSX.Element {
	const { className, tooltip, children, ...primitiveProps } = descriptionProps;
	const description = (
		<DialogPrimitive.Description data-slot='dialog-description' ref={ref} className={cn('text-sm text-primary-10', className)} {...primitiveProps}>
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
}
const DialogDescription = React.forwardRef(renderDialogDescription);
DialogDescription.displayName = 'DialogDescription';

// EXPORTS
export { Dialog, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
