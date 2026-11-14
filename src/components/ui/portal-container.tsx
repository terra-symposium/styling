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
 * @param children - Descendant components that may open portals.
 * @param container - Portal target element, or `null` until it is mounted.
 *
 * @return The children rendered under the portal-target context.
 */
export function PortalContainerProvider({ children, container }: { children: React.ReactNode; container: HTMLElement | null }): React.JSX.Element {
	return <PortalContainerContext.Provider value={container}>{children}</PortalContainerContext.Provider>;
}

/** Compatibility name for hosts using the original Terra portal provider. */
export { PortalContainerProvider as PortalProvider };

/** Wraps a portal primitive with the nearest shared UI container by default.
 * @param PrimitivePortal - Portal component to wrap.
 * @return Portal component that inherits the shared container.
 */
export function createTerraPortal<P extends { container?: Element | DocumentFragment | null; children?: React.ReactNode }>(PrimitivePortal: React.ComponentType<P>): React.ComponentType<P> {
	function ThemedPortal(props: P): React.JSX.Element {
		// terra-quality-ignore single-use -- Keep the context hook unconditional and in the same call order on every render.
		const scopedContainer = usePortalContainer();
		return <PrimitivePortal {...props} container={props.container ?? scopedContainer} />;
	}
	ThemedPortal.displayName = PrimitivePortal.displayName ?? 'ThemedPortal';
	return ThemedPortal;
}
