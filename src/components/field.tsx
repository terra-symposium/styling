/**
 * src/components/field.tsx
 * General form-field layout primitives shared by applications.
 * https://ui.shadcn.com/docs/components/base/field
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../lib/cn.js';
import { cva } from 'class-variance-authority';

// COMPONENTS
import * as React from 'react';
import { Label } from './ui/label.js';

// DATA
import { TEXT_VARIANTS } from './ui/variants.js';

// TYPES
import type { VariantProps } from 'class-variance-authority';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

// ORIENTATION RECIPE
const fieldVariants = cva('', {
	variants: {
		orientation: {
			vertical: 'flex-col *:w-full [&>.sr-only]:w-auto',
			horizontal: 'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
			responsive:
				'flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
		},
	},
	defaultVariants: { orientation: 'vertical' },
});

/*//////////////////////////////////////////////////
TYPES
//////////////////////////////////////////////////*/

// ORIENTATION CONTRACT
/** Supported field group layouts, including container-responsive orientation. */
export type FieldOrientation = NonNullable<VariantProps<typeof fieldVariants>['orientation']>;

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

// FIELD GROUP
/**
 * Groups a form control with its label and supporting content.
 *
 * @param className Optional classes applied to the field group.
 * @param orientation Layout orientation for the label and control.
 * @param fieldProps Remaining div properties forwarded to the group.
 *
 * @return A field group with the requested orientation.
 */
export function Field({ className, orientation = 'vertical', ...fieldProps }: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>): React.JSX.Element {
	return (
		<div
			role='group'
			data-slot='field'
			data-orientation={orientation}
			className={cn('group/field flex w-full gap-2 data-[invalid=true]:text-red-700', fieldVariants({ orientation }), className)}
			{...fieldProps}
		/>
	);
}

// LABEL AND DESCRIPTION
/**
 * Labels a field and exposes focus and checked state to the containing layout.
 *
 * @param className Optional classes applied to the label.
 * @param labelProps Label content, associated control id, and remaining label properties.
 *
 * @return A label styled for the shared field layout.
 */
export function FieldLabel({ className, ...labelProps }: React.ComponentProps<typeof Label>): React.JSX.Element {
	return (
		<Label
			data-slot='field-label'
			className={cn(
				'group/field-label peer/field-label has-data-checked:border-primary-9/30 has-data-checked:bg-primary-9/5 has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-primary-3/50 has-[>[data-slot=field]]:has-focus-visible:border-primary-9 has-[>[data-slot=field]]:has-focus-visible:ring-primary-9/50 dark:has-data-checked:border-primary-9/20 dark:has-data-checked:bg-primary-9/10 w-fit leading-snug group-data-[disabled=true]/field:opacity-50 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-[>[data-slot=field]]:has-focus-visible:ring-3 *:data-[slot=field]:p-2.5',
				'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
				className,
			)}
			{...labelProps}
		/>
	);
}

/**
 * Displays optional supporting instructions under a field.
 *
 * @param className Optional classes applied to the description.
 * @param descriptionProps Description content and remaining paragraph properties.
 *
 * @return A muted field-description paragraph.
 */
export function FieldDescription({ className, ...descriptionProps }: React.ComponentProps<'p'>): React.JSX.Element {
	return (
		<p
			data-slot='field-description'
			className={cn(
				'text-left leading-normal group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5',
				TEXT_VARIANTS({ tone: 'muted', size: 'sm', weight: 'normal' }),
				'last:mt-0 nth-last-2:-mt-1 [&>a:hover]:text-primary-9 [&>a]:underline [&>a]:underline-offset-4',
				className,
			)}
			{...descriptionProps}
		/>
	);
}

// VALIDATION FEEDBACK
/**
 * Displays explicit content or unique validation messages in an alert.
 *
 * @param className Optional classes applied to the error container.
 * @param children Explicit content shown instead of error messages.
 * @param errs Validation messages used when explicit content is absent.
 * @param errProps Remaining div properties forwarded to the alert.
 *
 * @return An alert containing explicit or error messages, or null when children and errors are absent.
 */
export function FieldError({
	className,
	children,
	errors: errs,
	...errProps
}: React.ComponentProps<'div'> & {
	errors?: Array<{ message?: string } | undefined>;
}): React.JSX.Element | null {
	let content = children;
	if (!content && errs?.length) {
		const errsByMessage = new Map<string | undefined, { message?: string } | undefined>();
		for (const error of errs) errsByMessage.set(error?.message, error);
		const uniqueErrs = [...errsByMessage.values()];
		const messages: React.ReactNode[] = [];
		for (const [index, error] of uniqueErrs.entries()) {
			if (error?.message) messages.push(<li key={index}>{error.message}</li>);
		}
		content = uniqueErrs.length === 1 ? uniqueErrs[0]?.message : <ul className='ml-4 flex list-disc flex-col gap-1'>{messages}</ul>;
	}
	if (!content) return null;
	return (
		<div role='alert' data-slot='field-error' className={cn('text-sm font-normal text-red-700', className)} {...errProps}>
			{content}
		</div>
	);
}
