import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

function CheckControlDemo({ kind }: { kind: 'checkbox' | 'switch' }): React.JSX.Element {
	return (
		<UI.Label htmlFor='switch-demo' className='flex items-center gap-2'>
			{kind === 'checkbox' ? <UI.Checkbox id='switch-demo' checked aria-label='Enable notifications' /> : <UI.Switch id='switch-demo' checked aria-label='Enable notifications' />}
			<span>Enable notifications</span>
		</UI.Label>
	);
}

function SwitchDemo(): React.JSX.Element {
	return <CheckControlDemo kind='switch' />;
}
export default SwitchDemo;

export const exampleCode = "import { Switch } from '@terra-symposium/styling/ui';\n\n<Switch defaultChecked aria-label='Enable notifications' />";
