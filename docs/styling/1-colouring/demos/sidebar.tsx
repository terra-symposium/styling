/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the sidebar component example.
 * @return Renders the example and returns its React element.
 */
function SidebarState(): React.JSX.Element {
	const { open, isMobile, openMobile } = UI.useSidebar();
	return <span>{(isMobile ? openMobile : open) ? 'Sidebar open' : 'Sidebar closed'}</span>;
}

/**
 * Renders the sidebar component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.SidebarProvider>
			<div className='flex items-center gap-2'>
				<UI.SidebarTrigger aria-label='Toggle sidebar' />
				<SidebarState />
			</div>
		</UI.SidebarProvider>
	);
}

export const exampleCode =
	"import { SidebarProvider, SidebarTrigger, useSidebar } from '@terra-symposium/styling/ui';\n\nfunction SidebarState() { const { open } = useSidebar(); return <span>{open ? 'Sidebar open' : 'Sidebar closed'}</span>; }\n<SidebarProvider><SidebarTrigger aria-label='Toggle sidebar' /><SidebarState /></SidebarProvider>";
