import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

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
