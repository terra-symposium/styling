/**
 * docs/styling/1-colouring/2-components/_demos/separator.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the separator component example.
 *
 * @return Renders the example and returns its React element.
 */
function SeparatorDemo(): React.JSX.Element {
	return (
		<div className='grid w-full max-w-sm gap-2'>
			<span>Account</span>
			<UI.Separator />
			<span>Preferences</span>
		</div>
	);
}
export default SeparatorDemo;

export const exampleCode =
	"import { Separator } from '@terra-symposium/styling/ui';\n\n<div className='grid w-full max-w-sm gap-2'>\n\t\t\t<span>Account</span>\n\t\t\t<Separator />\n\t\t\t<span>Preferences</span>\n\t\t</div>";
