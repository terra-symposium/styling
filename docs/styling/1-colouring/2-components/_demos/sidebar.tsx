/**
 * docs/styling/1-colouring/2-components/_demos/sidebar.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the sidebar component example.
 *
 * @return Renders the example and returns its React element.
 */
function SidebarState(): React.JSX.Element {
	const { open, isMobile, openMobile } = UI.useSidebar();
	return <span>{(isMobile ? openMobile : open) ? 'Sidebar open' : 'Sidebar closed'}</span>;
}

/**
 * Renders the sidebar component example.
 *
 * @param variant - Appearance variant selected in the workbench.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo({ variant }: { variant?: string }): React.JSX.Element {
	return (
		<div className='rounded border' style={{ position: 'relative', height: '11rem', overflow: 'hidden' }}>
			<UI.SidebarProvider style={{ '--sidebar-width': '11rem', minHeight: 0 } as React.CSSProperties}>
				<UI.Sidebar variant={variant as React.ComponentProps<typeof UI.Sidebar>['variant']} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, height: '100%', width: '11rem' }}>
					<div className='p-4'>Navigation</div>
				</UI.Sidebar>
				<div className='flex items-center gap-2 p-4'>
					<UI.SidebarTrigger aria-label='Toggle sidebar' />
					<SidebarState />
				</div>
			</UI.SidebarProvider>
		</div>
	);
}

export const exampleCode =
	"import { SidebarProvider, Sidebar, SidebarTrigger, useSidebar } from '@terra-symposium/styling/ui';\n\nfunction SidebarState() { const { open } = useSidebar(); return <span>{open ? 'Sidebar open' : 'Sidebar closed'}</span>; }\n<SidebarProvider><Sidebar><div>Navigation</div></Sidebar><SidebarTrigger aria-label='Toggle sidebar' /><SidebarState /></SidebarProvider>";
