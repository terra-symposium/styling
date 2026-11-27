/**
 * docs/styling/1-colouring/2-components/_demos/switch.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the switch component example.
 *
 * @param kind Control variant shown in the example.
 *
 * @return Renders the example and returns its React element.
 */
function CheckControlDemo({ kind }: { kind: 'checkbox' | 'switch' }): React.JSX.Element {
	return (
		<UI.Label htmlFor='switch-demo' className='flex items-center gap-2'>
			{kind === 'checkbox' ? <UI.Checkbox id='switch-demo' checked aria-label='Enable notifications' /> : <UI.Switch id='switch-demo' checked aria-label='Enable notifications' />}
			<span>Enable notifications</span>
		</UI.Label>
	);
}

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the switch component example.
 *
 * @return Renders the example and returns its React element.
 */
function SwitchDemo(): React.JSX.Element {
	return <CheckControlDemo kind='switch' />;
}
export default SwitchDemo;

export const exampleCode = "import { Switch } from '@terra-symposium/styling/ui';\n\n<Switch defaultChecked aria-label='Enable notifications' />";
