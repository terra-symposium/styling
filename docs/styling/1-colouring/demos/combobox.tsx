/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the combobox component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.Combobox
			opts={[
				{ value: 'one', label: 'First' },
				{ value: 'two', label: 'Second' },
			]}
			placeholder='Choose an option'
		/>
	);
}

export const exampleCode =
	"import { Combobox } from '@terra-symposium/styling/ui';\n\n<Combobox opts={[{ value: 'one', label: 'First' }, { value: 'two', label: 'Second' }]} placeholder='Choose an option' />";
