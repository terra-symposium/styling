/**
 * docs/styling/1-colouring/demos/textarea.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the textarea component example.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return <UI.Textarea placeholder='Write a short note…' rows={2} />;
}

export const exampleCode = "import { Textarea } from '@terra-symposium/styling/ui';\n\n<Textarea placeholder='Write a short note…' rows={2} />";
