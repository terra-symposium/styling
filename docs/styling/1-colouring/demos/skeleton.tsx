import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

function SkeletonDemo(): React.JSX.Element {
	return (
		<div className='grid gap-2'>
			<UI.Skeleton className='h-3 w-32' />
			<UI.Skeleton className='h-3 w-20' />
		</div>
	);
}
export default SkeletonDemo;

export const exampleCode =
	"import { Skeleton } from '@terra-symposium/styling/ui';\n\n<div className='grid gap-2'>\n\t\t\t<Skeleton className='h-3 w-32' />\n\t\t\t<Skeleton className='h-3 w-20' />\n\t\t</div>";
