import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

function CheckControlDemo({ kind }: { kind: 'checkbox' | 'switch' }): React.JSX.Element {
	return (
		<UI.Label htmlFor='checkbox-demo' className='flex items-center gap-2'>
			{kind === 'checkbox' ? <UI.Checkbox id='checkbox-demo' checked aria-label='Enable notifications' /> : <UI.Switch id='checkbox-demo' checked aria-label='Enable notifications' />}
			<span>Enable notifications</span>
		</UI.Label>
	);
}

function CheckboxDemo(): React.JSX.Element {
	return <CheckControlDemo kind='checkbox' />;
}
export default CheckboxDemo;

export const exampleCode = "import { Checkbox } from '@terra-symposium/styling/ui';\n\n<Checkbox defaultChecked aria-label='Enable notifications' />";
