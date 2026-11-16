import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<UI.Drawer>
			<UI.DrawerTrigger asChild>
				<UI.Button size='sm'>Open drawer</UI.Button>
			</UI.DrawerTrigger>
			<UI.DrawerContent>
				<UI.DrawerHeader>
					<UI.DrawerTitle>Quick settings</UI.DrawerTitle>
				</UI.DrawerHeader>
			</UI.DrawerContent>
		</UI.Drawer>
	);
}

export const exampleCode =
	"import { Drawer, DrawerTrigger, Button, DrawerContent, DrawerHeader, DrawerTitle } from '@terra-symposium/styling/ui';\n\n<Drawer><DrawerTrigger asChild><Button size='sm'>Open drawer</Button></DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>Quick settings</DrawerTitle></DrawerHeader></DrawerContent></Drawer>";
