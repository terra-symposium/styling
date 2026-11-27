/**
 * docs/styling/1-colouring/demos/spinner.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the spinner component example.
 *
 * @return Renders the example and returns its React element.
 */
function SpinnerDemo(): React.JSX.Element {
	return <UI.Spinner aria-label='Loading' />;
}
export default SpinnerDemo;

export const exampleCode = "import { Spinner } from '@terra-symposium/styling/ui';\n\n<Spinner aria-label='Loading' />";
