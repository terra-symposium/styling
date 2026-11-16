import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

const GRID_W_FULL_MAX_W_SM_GAP_2_CLASS = 'grid w-full max-w-sm gap-2';

function InputDemo({ kind }: { kind: 'email' | 'password' | 'label' }): React.JSX.Element {
	const id = `component-preview-${kind}`;
	return (
		<div className={GRID_W_FULL_MAX_W_SM_GAP_2_CLASS}>
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

function EmailInputDemo(): React.JSX.Element {
	return <InputDemo kind='email' />;
}
export default EmailInputDemo;

export const exampleCode = "import { Input } from '@terra-symposium/styling/ui';\n\n<Input type='email' placeholder='you@example.com' aria-label='Email' />";
