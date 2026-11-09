/**
 * src/components/ui/pagination.tsx
 * https://ui.shadcn.com/docs/components/pagination
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';

// COMPONENTS
import * as React from 'react';
import { Button, ButtonLink } from './button.js';
import { ChevronLeft as PrevIcon, ChevronRight as NextIcon } from '@carbon/icons-react';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Renders the pagination component.
 *
 * @param props - Additional pagination props forwarded to the primitive.
 * @param className - Optional class name applied to the pagination element.
 *
 * @return A navigation landmark containing pagination controls.
 */
const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>): React.JSX.Element => (
	<nav role='navigation' aria-label='pagination' className={cn('mx-auto flex w-full justify-center', className)} {...props} />
);

/**
 * Container wrapper for pagination list controls.
 *
 * @param className - Optional class name applied to the pagination content element.
 * @param props - Additional HTML attributes forwarded to the element.
 */
const PaginationContent = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(({ className, ...props }, ref): React.JSX.Element => (
	<div ref={ref} className={cn('flex flex-row items-center gap-1 no-underline', className)} {...props} />
));

/**
 * Individual item button wrapper inside pagination navigation.
 *
 * @param className - Optional class name applied to the pagination item button.
 * @param props - Additional props forwarded to the Button component.
 */
const PaginationItem = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(({ className, ...props }, ref): React.JSX.Element => (
	<Button variant='ghost' ref={ref} className={cn('w-fit px-0 no-underline enabled:hover:bg-primary-3', className)} {...props} />
));

/**
 * Renders the pagination link component.
 *
 * @param props - Additional link props forwarded to the primitive.
 * @param className - Optional class name applied to the pagination link.
 * @param isActive - Whether the link represents the current page.
 * @param disabled - Whether the link should reject interaction.
 * @param size - Link size variant used by the pagination control.
 * @param onClick - Callback invoked when the link is selected.
 *
 * @return A link styled as the selected or inactive pagination item.
 */
const PaginationLink = ({
	className,
	isActive,
	disabled,
	size = 'icon',
	onClick,
	...props
}: { isActive?: boolean; disabled?: boolean; size?: React.ComponentProps<typeof Button>['size'] } & React.ComponentProps<'a'>): React.JSX.Element => (
	<ButtonLink
		aria-current={isActive ? 'page' : undefined}
		aria-disabled={disabled ? 'true' : undefined}
		tabIndex={disabled ? -1 : undefined}
		variant={isActive ? 'outline' : 'ghost'}
		size={size}
		className={cn('!no-underline', disabled && 'pointer-events-none opacity-50', className)}
		onClick={
			disabled
				? e => {
						e.preventDefault();
					}
				: onClick
		}
		{...props}
	/>
);

/**
 * Pagination previous.
 *
 * @param props - Additional pagination props forwarded to the primitive.
 * @param className - Optional class name applied to the pagination control.
 *
 * @return The previous-page link with its icon and accessible label.
 */
const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>): React.JSX.Element => (
	<PaginationLink aria-label='Go to previous page' size='default' className={cn('gap-1 pl-2.5 !no-underline', className)} {...props}>
		<PrevIcon className='size-4' aria-hidden='true' />
		<span>Previous</span>
	</PaginationLink>
);

/**
 * Pagination next.
 *
 * @param props - Additional pagination props forwarded to the primitive.
 * @param className - Optional class name applied to the pagination control.
 *
 * @return The next-page link with its icon and accessible label.
 */
const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>): React.JSX.Element => (
	<PaginationLink aria-label='Go to next page' size='default' className={cn('gap-1 pr-2.5 !no-underline', className)} {...props}>
		<span>Next</span>
		<NextIcon className='size-4' aria-hidden='true' />
	</PaginationLink>
);
PaginationContent.displayName = 'PaginationContent';
PaginationItem.displayName = 'PaginationItem';
export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious };
