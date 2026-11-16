import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<UI.FormSelect
			name='team'
			options={[
				{ value: 'design', label: 'Design' },
				{ value: 'engineering', label: 'Engineering' },
			]}
			defaultValue='design'
		/>
	);
}

export const exampleCode =
	"import { FormSelect } from '@terra-symposium/styling/ui';\n\n<FormSelect name='team' options={[{ value: 'design', label: 'Design' }, { value: 'engineering', label: 'Engineering' }]} defaultValue='design' />";
