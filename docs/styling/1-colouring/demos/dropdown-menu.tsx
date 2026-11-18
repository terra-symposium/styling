/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the dropdown menu component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.DropdownMenu>
			<UI.DropdownMenuTrigger asChild>
				<UI.Button size='sm'>Actions</UI.Button>
			</UI.DropdownMenuTrigger>
			<UI.DropdownMenuContent>
				<UI.DropdownMenuItem>Rename</UI.DropdownMenuItem>
				<UI.DropdownMenuItem>Duplicate</UI.DropdownMenuItem>
			</UI.DropdownMenuContent>
		</UI.DropdownMenu>
	);
}

export const exampleCode =
	"import { DropdownMenu, DropdownMenuTrigger, Button, DropdownMenuContent, DropdownMenuItem } from '@terra-symposium/styling/ui';\n\n<DropdownMenu><DropdownMenuTrigger asChild><Button size='sm'>Actions</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Rename</DropdownMenuItem><DropdownMenuItem>Duplicate</DropdownMenuItem></DropdownMenuContent></DropdownMenu>";
