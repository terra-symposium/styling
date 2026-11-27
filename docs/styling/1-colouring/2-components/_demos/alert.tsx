/**
 * docs/styling/1-colouring/2-components/_demos/alert.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

/**
 * Renders the alert component example.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return <UI.AlertInfo title='Information'>Your changes are saved.</UI.AlertInfo>;
}

export const exampleCode = "import { AlertInfo } from '@terra-symposium/styling/ui';\n\n<AlertInfo title='Information'>Your changes are saved.</AlertInfo>";
