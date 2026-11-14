/**
 * src/components/ui/label.tsx
 * https://ui.shadcn.com/docs/components/label
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';

// COMPONENTS
import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

// DATA
import { FORM_LABEL_VARIANTS } from './variants.js';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/*
 * Accessible form label component built on top of Radix UI Label primitive.
 *
 * @returns React element for the form label.
 */
// terra-quality-ignore single-use -- Keep renderLabel as a named declaration so its authored TSDoc stays attached. TSDoc: Renders an accessible form label with shared typography and spacing.
/** Renders an accessible form label with shared typography and spacing.
 * @param labelProps - Label content, attributes, and optional classes.
 * @param ref - Ref forwarded to the Radix label element.
 * @return The styled Radix label primitive.
 */
function renderLabel(labelProps: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, ref: React.ForwardedRef<React.ElementRef<typeof LabelPrimitive.Root>>): React.JSX.Element {
	const { className, ...props } = labelProps;
	return <LabelPrimitive.Root ref={ref} className={cn(FORM_LABEL_VARIANTS(), className)} {...props} />;
}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(renderLabel);
Label.displayName = 'Label';
export { Label };
