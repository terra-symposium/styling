/**
 * docs/styling/1-colouring/2-components/_demos/form.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';
import { useForm } from 'react-hook-form';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the form component example.
 *
 * @return Renders the example and returns its React element.
 */
function FormDemo(): React.JSX.Element {
	const form = useForm<{ name: string }>({ defaultValues: { name: 'Kai' } });
	return (
		<UI.Form {...form}>
			<form className={'grid w-full max-w-sm gap-2'} onSubmit={form.handleSubmit(() => {})}>
				<UI.MappedFormFields fields={[{ type: 'input', name: 'name', id: 'component-preview-name', label: 'Name', defaultValue: 'Kai' }]} layout='compact' />
				<UI.Button size='sm' type='submit'>
					Save
				</UI.Button>
			</form>
		</UI.Form>
	);
}
export default FormDemo;

export const exampleCode =
	"import { useForm } from 'react-hook-form';\nimport { Form, MappedFormFields, Button } from '@terra-symposium/styling/ui';\n\nfunction NameForm() {\n  const form = useForm({ defaultValues: { name: 'Kai' } });\n  return <Form {...form}><form onSubmit={form.handleSubmit(() => {})}><MappedFormFields fields={[{ type: 'input', name: 'name', label: 'Name' }]} /><Button type='submit'>Save</Button></form></Form>;\n}";
