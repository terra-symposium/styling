/**
 * docs/styling/1-colouring/demos/badge.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the badge component example.
 * @return Renders the example and returns its React element.
 */
function BadgeDemo(): React.JSX.Element {
	return (
		<div className='flex flex-wrap items-center gap-2'>
			<UI.Badge variant='primary-tonal'>In progress</UI.Badge>
			<UI.Badge variant='success-tonal'>Complete</UI.Badge>
		</div>
	);
}
export default BadgeDemo;

export const exampleCode =
	"import { Badge } from '@terra-symposium/styling/ui';\n\n<div className='flex flex-wrap items-center gap-2'>\n\t\t\t<Badge variant='primary-tonal'>In progress</Badge>\n\t\t\t<Badge variant='success-tonal'>Complete</Badge>\n\t\t</div>";
