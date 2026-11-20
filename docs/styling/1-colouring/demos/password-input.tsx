/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the password input component example.
 * @param variant - Appearance variant selected in the workbench.
 * @return Renders the example and returns its React element.
 */
function PasswordInputDemo({ variant }: { variant?: string }): React.JSX.Element {
	return <UI.PasswordInput variant={variant as React.ComponentProps<typeof UI.PasswordInput>['variant']} aria-label='Password' placeholder='Enter a password' />;
}
export default PasswordInputDemo;

export const exampleCode = "import { PasswordInput } from '@terra-symposium/styling/ui';\n\n<PasswordInput aria-label='Password' placeholder='Enter a password' />";
