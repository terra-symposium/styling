import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<UI.Field>
			<UI.FieldLabel htmlFor='demo-field'>Project name</UI.FieldLabel>
			<UI.Input id='demo-field' placeholder='My project' />
			<UI.FieldDescription>Visible to your team.</UI.FieldDescription>
		</UI.Field>
	);
}

export const exampleCode =
	"import { Field, FieldLabel, Input, FieldDescription } from '@terra-symposium/styling/ui';\n\n<Field><FieldLabel htmlFor='demo-field'>Project name</FieldLabel><Input id='demo-field' placeholder='My project' /><FieldDescription>Visible to your team.</FieldDescription></Field>";
