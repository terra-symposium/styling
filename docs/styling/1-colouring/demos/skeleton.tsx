/**
 * docs/styling/1-colouring/demos/skeleton.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the skeleton component example.
 *
 * @return Renders the example and returns its React element.
 */
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
