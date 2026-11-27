/**
 * docs/styling/1-colouring/2-components/_demos/dialog.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

/**
 * Renders the dialog component example.
 *
 * @param variant - Appearance variant selected in the workbench.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo({ variant }: { variant?: string }): React.JSX.Element {
	return (
		<UI.Dialog>
			<UI.DialogTrigger asChild>
				<UI.Button size='sm'>Open dialog</UI.Button>
			</UI.DialogTrigger>
			<UI.DialogContent variant={variant as React.ComponentProps<typeof UI.DialogContent>['variant']}>
				<UI.DialogHeader>
					<UI.DialogTitle>Project details</UI.DialogTitle>
					<UI.DialogDescription>Edit your project settings.</UI.DialogDescription>
				</UI.DialogHeader>
				<UI.DialogFooter>
					<UI.DialogClose asChild>
						<UI.Button variant='gray-outline'>Cancel</UI.Button>
					</UI.DialogClose>
					<UI.Button>Save changes</UI.Button>
				</UI.DialogFooter>
			</UI.DialogContent>
		</UI.Dialog>
	);
}

export const exampleCode =
	"import { Dialog, DialogTrigger, Button, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@terra-symposium/styling/ui';\n\n<Dialog><DialogTrigger asChild><Button size='sm'>Open dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Project details</DialogTitle><DialogDescription>Edit your project settings.</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button variant='gray-outline'>Cancel</Button></DialogClose><Button>Save changes</Button></DialogFooter></DialogContent></Dialog>";
