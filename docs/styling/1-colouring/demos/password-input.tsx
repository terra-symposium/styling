import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

function PasswordInputDemo(): React.JSX.Element {
	return <UI.PasswordInput aria-label='Password' placeholder='Enter a password' />;
}
export default PasswordInputDemo;

export const exampleCode = "import { PasswordInput } from '@terra-symposium/styling/ui';\n\n<PasswordInput aria-label='Password' placeholder='Enter a password' />";
