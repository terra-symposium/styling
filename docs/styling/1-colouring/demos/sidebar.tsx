import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

function SidebarState(): React.JSX.Element {
	const { open, isMobile, openMobile } = UI.useSidebar();
	return <span>{(isMobile ? openMobile : open) ? 'Sidebar open' : 'Sidebar closed'}</span>;
}

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
