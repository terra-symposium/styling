/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the portal container component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.PortalContainerProvider container={null}>
			<UI.Popover>
				<UI.PopoverTrigger asChild>
					<UI.Button size='sm'>Open scoped popover</UI.Button>
				</UI.PopoverTrigger>
				<UI.PopoverContent>Portalled content</UI.PopoverContent>
			</UI.Popover>
		</UI.PortalContainerProvider>
	);
}

export const exampleCode =
	"import { PortalContainerProvider, Popover, PopoverTrigger, PopoverContent, Button } from '@terra-symposium/styling/ui';\n\n<PortalContainerProvider container={null}><Popover><PopoverTrigger asChild><Button size='sm'>Open scoped popover</Button></PopoverTrigger><PopoverContent>Portalled content</PopoverContent></Popover></PortalContainerProvider>";
