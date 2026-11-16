import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<div className='flex h-24 w-64 rounded border'>
			<div className='flex-1 p-2'>Left</div>
			<UI.ResizableGrip withHandle />
			<div className='flex-1 p-2'>Right</div>
		</div>
	);
}

export const exampleCode =
	"import { ResizableGrip } from '@terra-symposium/styling/ui';\n\n<div className='flex h-24 w-64 rounded border'><div className='flex-1 p-2'>Left</div><ResizableGrip withHandle /><div className='flex-1 p-2'>Right</div></div>";
