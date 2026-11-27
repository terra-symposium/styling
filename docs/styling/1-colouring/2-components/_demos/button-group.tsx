/**
 * docs/styling/1-colouring/2-components/_demos/button-group.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

/**
 * Renders the button group component example.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.ButtonGroup>
			<UI.Button size='sm'>Previous</UI.Button>
			<UI.Button size='sm'>Next</UI.Button>
		</UI.ButtonGroup>
	);
}

export const exampleCode = "import { ButtonGroup, Button } from '@terra-symposium/styling/ui';\n\n<ButtonGroup><Button size='sm'>Previous</Button><Button size='sm'>Next</Button></ButtonGroup>";
