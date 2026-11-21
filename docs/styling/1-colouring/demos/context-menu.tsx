/**
 * docs/styling/1-colouring/demos/context-menu.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the context menu component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.ContextMenu>
			<UI.ContextMenuTrigger className='rounded border p-3'>Right click here</UI.ContextMenuTrigger>
			<UI.ContextMenuContent>
				<UI.ContextMenuItem>Copy</UI.ContextMenuItem>
			</UI.ContextMenuContent>
		</UI.ContextMenu>
	);
}

export const exampleCode =
	"import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@terra-symposium/styling/ui';\n\n<ContextMenu><ContextMenuTrigger className='rounded border p-3'>Right click here</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>Copy</ContextMenuItem></ContextMenuContent></ContextMenu>";
