import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<UI.ScrollArea className='h-24 w-60 rounded border p-2'>
			<div className='h-44'>Scroll this region to see more content.</div>
		</UI.ScrollArea>
	);
}

export const exampleCode =
	"import { ScrollArea } from '@terra-symposium/styling/ui';\n\n<ScrollArea className='h-24 w-60 rounded border p-2'><div className='h-44'>Scroll this region to see more content.</div></ScrollArea>";
