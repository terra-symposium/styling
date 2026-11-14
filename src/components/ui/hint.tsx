/**
 * src/components/ui/hint.tsx
 * https://ui.shadcn.com/docs/components/tooltip
 * Accessible tooltip hint composed from the shared tooltip primitives.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// COMPONENTS
import * as React from 'react';
import { InformationSquare } from '@carbon/icons-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Adds an informational tooltip to a single child element.
 *
 * @param children - Trigger element that receives the tooltip.
 * @param content - Explanatory text or content shown in the tooltip.
 * @param disabledTrigger - Whether to wrap a disabled trigger in a focusable element.
 * @param showIcon - Whether to prepend the information icon to the trigger.
 *
 * @return The trigger element wrapped in the shared tooltip primitives.
 */
function Hint({
	children,
	content,
	disabledTrigger = false,
	showIcon = true,
}: {
	children: React.ReactElement;
	content: React.ReactNode;
	disabledTrigger?: boolean;
	showIcon?: boolean;
}): React.JSX.Element {
	const child = children as React.ReactElement<{ children?: React.ReactNode }>;
	const trigger = showIcon ? React.cloneElement(child, undefined, <InformationSquare aria-hidden='true' className='mr-1 inline-block size-[1em] align-[-0.125em]' />, child.props.children) : children;
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					{disabledTrigger ? (
						<div className='w-full' tabIndex={0}>
							{trigger}
						</div>
					) : (
						trigger
					)}
				</TooltipTrigger>
				<TooltipContent>{content}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
export { Hint };
