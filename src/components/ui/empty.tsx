/**
 * src/components/ui/empty.tsx
 * https://ui.shadcn.com/docs/components/base/empty
 * The shared empty state used by Terra's editors and document surfaces.
 * Supplying `onUpload` turns the placeholder into a file drop and browse target.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';

// COMPONENTS
import { useState } from 'react';
import { Spinner } from './spinner.js';

// TYPES
import type { AriaAttributes, ComponentType, JSX, ReactNode } from 'react';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Empty-state content that can also act as a file picker and drop target.
 * Without `onUpload`, `variant` selects a static layout. With `onUpload`, the
 * first selected or dropped file is passed to the callback.
 *
 * @param props - Content, layout, upload callback and file-type filter, disabled state, accessible input label, loading message, and class name.
 * @returns A static empty-state container or an upload label with a hidden file input.
 */
export function Empty({
	children,
	variant,
	icon: Icon,
	title,
	description,
	loading,
	onUpload,
	accept,
	uploadDisabled = false,
	uploadLabel = 'Choose a file to upload',
	className,
}: {
	children?: ReactNode;
	variant?: 'compact' | 'padded' | 'panel' | 'fill' | 'grow' | 'preview' | 'action' | 'expanded' | 'growPanel';
	icon?: ComponentType<{ className?: string; 'aria-hidden'?: AriaAttributes['aria-hidden'] }>;
	title?: ReactNode;
	description?: ReactNode;
	loading?: ReactNode;
	onUpload?: (file: File) => void;
	accept?: string;
	uploadDisabled?: boolean;
	uploadLabel?: string;
	className?: string;
}): JSX.Element {
	const [isDragging, setIsDragging] = useState(false);
	const classes = cn(
		'flex w-full min-w-0 flex-col items-start justify-center gap-1 text-left text-sm text-primary-11',
		!onUpload &&
			variant &&
			{
				compact: 'm-0 flex-row items-center justify-start gap-1 text-xs text-primary-11/70',
				padded: 'py-6',
				panel: 'rounded-md border border-primary-6 bg-primary-2/40 p-6 text-primary-10',
				fill: 'size-full items-center justify-center text-center text-primary-10',
				grow: 'min-h-0 flex-1 items-center justify-center text-center text-primary-10',
				preview: 'size-full min-h-44 justify-center rounded-lg border border-dashed border-primary-6 bg-primary-1 px-5 py-6 text-center text-primary-10',
				action: 'size-full items-stretch justify-stretch rounded border-2 border-dashed border-primary-6 p-0 text-center',
				expanded: 'min-h-0 flex-1 flex-row justify-start p-3 text-left',
				growPanel: 'min-h-0 flex-1 rounded-md border border-primary-6 bg-primary-2 text-primary-10',
			}[variant],
		onUpload &&
			'min-h-40 cursor-pointer flex-col items-center gap-5 rounded-xl border border-dashed border-primary-6 bg-primary-2/40 px-6 py-8 text-left transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-8 hover:border-primary-8 hover:bg-primary-3 sm:flex-row sm:items-start sm:px-8',
		uploadDisabled && 'cursor-wait opacity-75',
		isDragging && !uploadDisabled && 'border-primary-9 bg-primary-3',
		className,
	);
	const content = (
		<>
			{Icon && <Icon className='size-8 shrink-0 text-primary-9' aria-hidden />}
			{(title !== undefined || description !== undefined || (uploadDisabled && loading !== undefined)) && (
				<div className='space-y-1'>
					{title !== undefined && <p className='m-0 font-medium text-primary-12'>{title}</p>}
					{description !== undefined && <p className='m-0 text-sm'>{description}</p>}
					{uploadDisabled && loading !== undefined && (
						<span className='inline-flex items-center gap-2 text-sm'>
							<Spinner /> {loading}
						</span>
					)}
				</div>
			)}
			{children}
		</>
	);
	if (!onUpload) return <div className={classes}>{content}</div>;
	return (
		<label
			className={classes}
			aria-disabled={uploadDisabled || undefined}
			onDragOver={event => {
				event.preventDefault();
				if (!uploadDisabled) setIsDragging(true);
			}}
			onDragLeave={event => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false);
			}}
			onDrop={event => {
				event.preventDefault();
				setIsDragging(false);
				const file = event.dataTransfer.files[0];
				if (file && !uploadDisabled) onUpload(file);
			}}
		>
			<input
				aria-label={uploadLabel}
				className='sr-only'
				type='file'
				accept={accept}
				disabled={uploadDisabled}
				onChange={event => {
					const file = event.currentTarget.files?.[0];
					if (file) onUpload(file);
					event.currentTarget.value = '';
				}}
			/>
			{content}
		</label>
	);
}

/**
 * Panel-style empty state for tables, directories, and other data surfaces.
 *
 * @param props - Panel title, supporting text, optional action, and class name.
 * @returns A bordered empty-state panel with the supplied content.
 */
export function EmptyState({ title, description, action, className }: { title: ReactNode; description: ReactNode; action?: ReactNode; className?: string }): JSX.Element {
	return (
		<Empty variant='panel' title={title} description={description} className={cn('min-h-32 items-center border border-dashed border-gray-6 bg-gray-1 p-6 text-center text-gray-12', className)}>
			{action}
		</Empty>
	);
}
