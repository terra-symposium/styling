/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the combobox component example.
 * @param variant - Appearance variant selected in the workbench.
 * @return Renders the example and returns its React element.
 */
export default function Demo({ variant }: { variant?: string }): React.JSX.Element {
	return (
		<UI.Combobox
			variant={variant as React.ComponentProps<typeof UI.Combobox>['variant']}
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
