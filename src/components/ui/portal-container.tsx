/**
 * src/components/ui/portal-container.tsx
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// COMPONENTS
import * as React from 'react';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const PortalContainerContext = React.createContext<HTMLElement | null>(null);

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Provides the DOM container used by child portal components.
 *
 * @param props - Child content and the optional portal container element.
 * @return A context provider for the portal container.
 */
export function PortalContainerProvider({ children, container }: { children: React.ReactNode; container: HTMLElement | null }): React.JSX.Element {
	return <PortalContainerContext.Provider value={container}>{children}</PortalContainerContext.Provider>;
}

/**
 * Reads the active portal container from context.
 *
 * @return The configured portal element, or `undefined` when no element is set.
 */
export function usePortalContainer(): HTMLElement | undefined {
	return React.useContext(PortalContainerContext) ?? undefined;
}
