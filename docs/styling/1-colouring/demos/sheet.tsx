/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the sheet component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.Sheet>
			<UI.SheetTrigger asChild>
				<UI.Button size='sm'>Open sheet</UI.Button>
			</UI.SheetTrigger>
			<UI.SheetContent>
				<UI.SheetHeader>
					<UI.SheetTitle>Settings</UI.SheetTitle>
				</UI.SheetHeader>
			</UI.SheetContent>
		</UI.Sheet>
	);
}

export const exampleCode =
	"import { Sheet, SheetTrigger, Button, SheetContent, SheetHeader, SheetTitle } from '@terra-symposium/styling/ui';\n\n<Sheet><SheetTrigger asChild><Button size='sm'>Open sheet</Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle>Settings</SheetTitle></SheetHeader></SheetContent></Sheet>";
