/**
 * docs/styling/1-colouring/demos/hint.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the hint component example.
 *
 * @return Renders the example and returns its React element.
 */
function HintDemo(): React.JSX.Element {
	return (
		<UI.Hint content='Add a short explanation for this setting.'>
			<UI.Button variant='secondary-outline' size='sm'>
				What is this?
			</UI.Button>
		</UI.Hint>
	);
}
export default HintDemo;

export const exampleCode =
	"import { Hint, Button } from '@terra-symposium/styling/ui';\n\n<Hint content='Add a short explanation for this setting.'>\n\t\t\t<Button variant='secondary-outline' size='sm'>\n\t\t\t\tWhat is this?\n\t\t\t</Button>\n\t\t</Hint>";
