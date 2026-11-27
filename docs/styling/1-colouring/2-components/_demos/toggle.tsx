/**
 * docs/styling/1-colouring/demos/toggle.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

/**
 * Renders the toggle component example.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.Toggle aria-label='Bold' defaultPressed>
			Bold
		</UI.Toggle>
	);
}

export const exampleCode = "import { Toggle } from '@terra-symposium/styling/ui';\n\n<Toggle aria-label='Bold' defaultPressed>Bold</Toggle>";
