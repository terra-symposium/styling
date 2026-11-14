/**
 * src/components/ui/toggle.tsx
 * https://ui.shadcn.com/docs/components/toggle
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';

// COMPONENTS
import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';

// DATA
import { TOGGLE_VARIANTS } from './variants.js';

// TYPES
import type { VariantProps } from 'class-variance-authority';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

// terra-quality-ignore single-use -- Keep renderToggle as a named declaration so its authored TSDoc stays attached. TSDoc: Renders an accessible toggle with the shared action variants.
/** Renders an accessible toggle with the shared action variants.
 * @param toggleProps - Toggle state, native attributes, and visual variants.
 * @param ref - Ref forwarded to the Radix toggle element.
 * @return A styled Radix toggle control.
 */
function renderToggle(
	toggleProps: React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof TOGGLE_VARIANTS>,
	ref: React.ForwardedRef<React.ElementRef<typeof TogglePrimitive.Root>>,
): React.JSX.Element {
	const { className, variant, size, ...props } = toggleProps;
	return <TogglePrimitive.Root ref={ref} className={cn(TOGGLE_VARIANTS({ variant, size }), className)} {...props} />;
}

const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof TOGGLE_VARIANTS>>(renderToggle);
Toggle.displayName = 'Toggle';
export { Toggle };
