import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';
import { Trigger as AlertDialogTrigger } from '@radix-ui/react-alert-dialog';

export default function Demo(): React.JSX.Element {
	return (
		<UI.AlertDialog>
			<AlertDialogTrigger asChild>
				<UI.Button size='sm'>Delete item</UI.Button>
			</AlertDialogTrigger>
			<UI.AlertDialogContent>
				<UI.AlertDialogHeader>
					<UI.AlertDialogTitle>Delete item?</UI.AlertDialogTitle>
					<UI.AlertDialogDescription>This action cannot be undone.</UI.AlertDialogDescription>
				</UI.AlertDialogHeader>
				<UI.AlertDialogFooter>
					<UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
					<UI.AlertDialogAction>Delete</UI.AlertDialogAction>
				</UI.AlertDialogFooter>
			</UI.AlertDialogContent>
		</UI.AlertDialog>
	);
}

export const exampleCode =
	"import { AlertDialog, Button, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@terra-symposium/styling/ui';\nimport { Trigger as AlertDialogTrigger } from '@radix-ui/react-alert-dialog';\n\n<AlertDialog><AlertDialogTrigger asChild><Button size='sm'>Delete item</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete item?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>";
