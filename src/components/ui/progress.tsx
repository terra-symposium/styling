/**
 * src/components/ui/progress.tsx
 * https://ui.shadcn.com/docs/components/progress
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';

// COMPONENTS
import * as ProgressPrimitive from '@radix-ui/react-progress';
import * as React from 'react';

// TYPES
import type { ComponentProps } from 'react';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Radix progress bar that maps non-finite values to zero and supplies a default
 * accessible label when neither `aria-label` nor `aria-labelledby` is provided.
 *
 * @param className - Additional classes applied to the progress root.
 * @param value - Current progress value; non-finite numbers are normalized to zero.
 * @param rootAttributes - Remaining Radix root and accessible naming attributes.
 *
 * @return A progressbar root and its visual indicator.
 */
export function Progress({
	className,
	value,
	...rootAttributes
}: ComponentProps<typeof ProgressPrimitive.Root> & {
	value?: number | null;
}): React.JSX.Element {
	const progressValue = value == null ? value : Number.isFinite(value) ? value : 0;
	return (
		<ProgressPrimitive.Root
			data-slot='progress'
			value={progressValue}
			aria-label={rootAttributes['aria-label'] ?? (rootAttributes['aria-labelledby'] ? undefined : 'Progress')}
			className={cn('relative h-4 w-full overflow-hidden rounded border border-primary-7 bg-primary-4', className)}
			{...rootAttributes}
		>
			<ProgressPrimitive.Indicator
				data-slot='progress-indicator'
				className='size-full flex-1 bg-primary-9 transition-all'
				style={{
					transform: `translateX(-${100 - (typeof progressValue === 'number' ? progressValue : 0)}%)`,
				}}
			/>
		</ProgressPrimitive.Root>
	);
}
