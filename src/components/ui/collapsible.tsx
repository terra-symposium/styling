/**
 * src/components/ui/collapsible.tsx
 * https://ui.shadcn.com/docs/components/collapsible
 * Accessible disclosure component built on Radix Collapsible.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// COMPONENTS
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

// TYPES
import type * as React from 'react';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Root for a disclosure that can expand or collapse its content.
 *
 * @param props - Radix collapsible root props, including open state handlers.
 * @return The collapsible root with the shared data slot.
 */
function Collapsible(props: React.ComponentProps<typeof CollapsiblePrimitive.Root>): React.JSX.Element {
	return <CollapsiblePrimitive.Root data-slot='collapsible' {...props} />;
}

/**
 * Control that toggles the collapsible content.
 *
 * @param props - Radix trigger props.
 * @return The collapsible trigger with the shared data slot.
 */
function CollapsibleTrigger(props: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>): React.JSX.Element {
	return <CollapsiblePrimitive.CollapsibleTrigger data-slot='collapsible-trigger' {...props} />;
}

/**
 * Content region shown according to the collapsible's open state.
 *
 * @param props - Radix collapsible content props.
 * @return The collapsible content with the shared data slot.
 */
function CollapsibleContent(props: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>): React.JSX.Element {
	return <CollapsiblePrimitive.CollapsibleContent data-slot='collapsible-content' {...props} />;
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
