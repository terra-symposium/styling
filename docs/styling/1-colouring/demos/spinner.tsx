import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

function SpinnerDemo(): React.JSX.Element {
	return <UI.Spinner aria-label='Loading' />;
}
export default SpinnerDemo;

export const exampleCode = "import { Spinner } from '@terra-symposium/styling/ui';\n\n<Spinner aria-label='Loading' />";
