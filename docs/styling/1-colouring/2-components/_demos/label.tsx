/**
 * docs/styling/1-colouring/2-components/_demos/label.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the label component example.
 *
 * @param kind Label variant shown in the example.
 *
 * @return Renders the example and returns its React element.
 */
function InputDemo({ kind }: { kind: 'email' | 'password' | 'label' }): React.JSX.Element {
	const id = `component-preview-${kind}`;
	return (
		<div className={'grid w-full max-w-sm gap-2'}>
			<UI.Label htmlFor={id}>{({ email: 'Email', password: 'Password', label: 'Project name' } as const)[kind]}</UI.Label>
			<UI.Input
				autoComplete={kind === 'email' ? 'email' : undefined}
				id={id}
				name={kind}
				placeholder={kind === 'email' ? 'you@example.com' : undefined}
				type={kind === 'email' ? 'email' : kind === 'password' ? 'password' : 'text'}
				defaultValue={kind === 'label' ? 'Styling docs' : undefined}
			/>
		</div>
	);
}

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the label component example.
 *
 * @return Renders the example and returns its React element.
 */
function LabelInputDemo(): React.JSX.Element {
	return <InputDemo kind='label' />;
}
export default LabelInputDemo;

export const exampleCode = "import { Label, Input } from '@terra-symposium/styling/ui';\n\n<><Label htmlFor='name'>Project name</Label><Input id='name' /></>";
