/**
 * src/components/ui/tooltip.tsx
 * https://ui.shadcn.com/docs/components/tooltip
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';
import { createTerraPortal } from './portal-container.js';
import { cva } from 'class-variance-authority';

// COMPONENTS
import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

// DATA
import { OVERLAY_MOTION_VARIANTS, OVERLAY_SURFACE_VARIANTS, RADIX_SIDE_POSITION_VARIANTS, TEXT_VARIANTS } from './variants.js';

// TYPES
import type { UiSize } from './types.js';
import type { VariantProps } from 'class-variance-authority';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = createTerraPortal(TooltipPrimitive.Portal);

TooltipProvider.displayName = TooltipPrimitive.Provider.displayName;
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;
const tooltipVariants = cva(
	cn(
		'relative z-50 origin-[--radix-tooltip-content-transform-origin] rounded-md border',
		TEXT_VARIANTS({ size: 'sm' }),
		OVERLAY_SURFACE_VARIANTS(),
		OVERLAY_MOTION_VARIANTS(),
		RADIX_SIDE_POSITION_VARIANTS(),
	),
	{
		variants: {
			size: {
				xs: 'rounded px-1.5 py-1 text-xs',
				sm: 'rounded px-1.5 py-1 text-xs',
				md: 'px-2 py-1',
				lg: 'px-3 py-1.5 text-base',
				xl: 'px-4 py-2 text-lg',
				default: 'px-2 py-1',
			} satisfies Record<UiSize | 'default', string>,
		},
		defaultVariants: { size: 'default' },
	},
);
/** Radix tooltip content props with the shared visual size variant. */
type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & VariantProps<typeof tooltipVariants>;

// terra-quality-ignore single-use -- Keep renderTooltipContent as a named declaration so its authored TSDoc stays attached. TSDoc: Renders tooltip content, its trigger-relative placement, and the arrow.
/** Renders tooltip content, its trigger-relative placement, and the arrow.
 * @param tooltipProps - Content props and visual size variant.
 * @param ref - Ref forwarded to the Radix tooltip content element.
 * @return A portal containing the styled tooltip content and arrow.
 */
function renderTooltipContent(tooltipProps: TooltipContentProps, ref: React.ForwardedRef<React.ElementRef<typeof TooltipPrimitive.Content>>): React.JSX.Element {
	const { size, className, sideOffset = -8, collisionPadding = 8, children, ...props } = tooltipProps;
	return (
		<TooltipPortal>
			<TooltipPrimitive.Content
				ref={ref}
				sideOffset={sideOffset} // Compensate for arrow offset
				collisionPadding={collisionPadding}
				className={cn(tooltipVariants({ size, className }))}
				{...props}
			>
				{children}
				<TooltipPrimitive.Arrow className='fill-white stroke-gray-6 dark:fill-black' asChild>
					<Arrow />
				</TooltipPrimitive.Arrow>
			</TooltipPrimitive.Content>
		</TooltipPortal>
	);
}

const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, TooltipContentProps>(renderTooltipContent);
TooltipContent.displayName = 'TooltipContent';

/**
 * Renders the text tooltip component.
 *
 * @param content - Explanatory content; when empty, the trigger is returned without a tooltip.
 * @param side - Edge of the trigger where the tooltip is placed.
 * @param align - Alignment along the selected edge.
 * @param size - Size variant controlling text tooltip's dimensions.
 * @param delayDuration - Delay before the tooltip opens, passed to the Radix root.
 * @param className - Additional classes merged onto the trigger.
 * @param children - Child content nested inside text tooltip's rendered output.
 * @param attrs - Remaining HTML attributes passed through to the trigger.
 *
 * @return The trigger content with its tooltip when explanatory text is provided.
 */
export default function TextTooltip({
	content,
	side = 'top',
	align = 'center',
	size,
	delayDuration,
	className,
	children,
	...attrs
}: Pick<React.ComponentPropsWithoutRef<typeof Tooltip>, 'delayDuration'> &
	Pick<React.ComponentPropsWithoutRef<typeof TooltipContent>, 'side' | 'align' | 'size'> &
	React.ComponentPropsWithoutRef<typeof TooltipTrigger> & {
		children?: React.ReactNode;
		className?: string;
		content: React.ReactNode;
	}): React.ReactNode {
	return content ? (
		<Tooltip {...(delayDuration !== undefined ? { delayDuration } : {})}>
			<TooltipTrigger asChild>
				{React.isValidElement<React.HTMLAttributes<HTMLElement>>(children) ? (
					React.cloneElement(children, {
						...attrs,
						className: cn('rounded', className, children.props.className),
					})
				) : (
					<span className={cn('rounded', className)} {...attrs}>
						{children}
					</span>
				)}
			</TooltipTrigger>
			<TooltipContent align={align} side={side} size={size}>
				{content}
			</TooltipContent>
		</Tooltip>
	) : (
		children
	);
}

/**
 * Renders the arrow component.
 *
 * @param arrowProps - SVG attributes forwarded to the arrow element.
 *
 * @return An SVG arrow with the tooltip's outline path.
 */
function Arrow(arrowProps: React.SVGProps<SVGSVGElement>): React.JSX.Element {
	return (
		<svg {...arrowProps} width='15' height='15' viewBox='0 0 15 15' aria-hidden='true'>
			<mask id='stroke-mask'>
				<rect x='0' y='0.5' width='15' height='15'></rect>
			</mask>
			<path
				d='M 0 0 L 0 0 C 1 0 2.739940073395944 0.6726727939963124 3.4798801467918876 1.3453455879926248 L 6.020119853208112 3.654654412007375 C 6.760059926604056 4.327327206003687 8.239940073395942 4.327327206003687 8.979880146791887 3.654654412007375 L 11.520119853208113 1.3453455879926248 C 12.260059926604058 0.6726727939963124 14 0 15 0 L 15 0'
				mask='url(#stroke-mask)'
				strokeWidth='1'
			></path>
			<path d='M 0 0 L 0 0 C 1 0 2.739940073395944 0.6726727939963124 3.4798801467918876 1.3453455879926248 L 6.020119853208112 3.654654412007375 C 6.760059926604056 4.327327206003687 8.239940073395942 4.327327206003687 8.979880146791887 3.654654412007375 L 11.520119853208113 1.3453455879926248 C 12.260059926604058 0.6726727939963124 14 0 15 0 L 15 0 M 15 -1 M 0 -1 Z'></path>
		</svg>
	);
}
Arrow.displayName = 'TooltipArrow';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
