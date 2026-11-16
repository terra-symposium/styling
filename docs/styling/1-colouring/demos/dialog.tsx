import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<UI.Dialog>
			<UI.DialogTrigger asChild>
				<UI.Button size='sm'>Open dialog</UI.Button>
			</UI.DialogTrigger>
			<UI.DialogContent>
				<UI.DialogHeader>
					<UI.DialogTitle>Project details</UI.DialogTitle>
					<UI.DialogDescription>Edit your project settings.</UI.DialogDescription>
				</UI.DialogHeader>
			</UI.DialogContent>
		</UI.Dialog>
	);
}

export const exampleCode =
	"import { Dialog, DialogTrigger, Button, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@terra-symposium/styling/ui';\n\n<Dialog><DialogTrigger asChild><Button size='sm'>Open dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Project details</DialogTitle><DialogDescription>Edit your project settings.</DialogDescription></DialogHeader></DialogContent></Dialog>";
