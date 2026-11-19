/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the toaster component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<div className='flex gap-2'>
			<UI.Toaster />
			<UI.Button size='sm' onClick={() => import('sonner').then(({ toast }) => toast.success('Saved'))}>
				Show toast
			</UI.Button>
		</div>
	);
}

export const exampleCode =
	"import { Toaster, Button } from '@terra-symposium/styling/ui';\n\n<div className='flex gap-2'><Toaster /><Button size='sm' onClick={() => import('sonner').then(({ toast }) => toast.success('Saved'))}>Show toast</Button></div>";
