/**
 * src/components/ui/portal-container.tsx
 * https://ui.shadcn.com/docs/components/dialog
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// COMPONENTS
import * as React from 'react';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

// CONTEXT
const PortalContainerContext = React.createContext<HTMLElement | null>(null);

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Reads the portal target provided by the nearest `PortalContainerProvider`.
 *
 * @return The target element, or `undefined` when no target is available.
 */
export function usePortalContainer(): HTMLElement | undefined {
	return React.useContext(PortalContainerContext) ?? undefined;
}

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Makes a portal target available to descendant components.
 *
 * @param props - The children to render and target element, or `null` while no target is mounted.
 * @return The children rendered under the portal-target context.
 */
export function PortalContainerProvider({ children, container }: { children: React.ReactNode; container: HTMLElement | null }): React.JSX.Element {
	return <PortalContainerContext.Provider value={container}>{children}</PortalContainerContext.Provider>;
}
