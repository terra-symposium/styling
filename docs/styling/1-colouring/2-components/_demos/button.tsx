/**
 * docs/styling/1-colouring/demos/button.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the button component example.
 *
 * @return Renders the example and returns its React element.
 */
function ButtonDemo(): React.JSX.Element {
	return (
		<div className='flex flex-wrap items-center gap-2'>
			<UI.Button variant='primary-saturated' size='sm'>
				Continue
			</UI.Button>
			<UI.Button variant='secondary-outline' size='sm'>
				Cancel
			</UI.Button>
		</div>
	);
}
export default ButtonDemo;

export const exampleCode =
	"import { Button } from '@terra-symposium/styling/ui';\n\n<div className='flex flex-wrap items-center gap-2'>\n\t\t\t<Button variant='primary-saturated' size='sm'>\n\t\t\t\tContinue\n\t\t\t</Button>\n\t\t\t<Button variant='secondary-outline' size='sm'>\n\t\t\t\tCancel\n\t\t\t</Button>\n\t\t</div>";
