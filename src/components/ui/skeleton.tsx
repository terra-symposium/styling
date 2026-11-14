/**
 * src/components/ui/skeleton.tsx
 * https://ui.shadcn.com/docs/components/skeleton
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Pulsing placeholder hidden from assistive technology by default. Set
 * `aria-label` to expose a custom status, or `aria-hidden={false}` to expose `Loading...`.
 *
 * @param className - Additional classes applied to the placeholder.
 * @param ariaLabel - Optional status name announced by assistive technology.
 * @param ariaHidden - Optional visibility override for assistive technology.
 * @param attributes - Remaining div attributes forwarded to the placeholder.
 *
 * @return A pulsing status placeholder.
 */
function Skeleton({ className, 'aria-label': ariaLabel, 'aria-hidden': ariaHidden, ...attributes }: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
	return (
		<div
			role='status'
			aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
			aria-label={ariaLabel ?? 'Loading...'}
			className={cn('animate-pulse rounded-md bg-gray-100 dark:bg-gray-800', className)}
			{...attributes}
		/>
	);
}
export { Skeleton };
