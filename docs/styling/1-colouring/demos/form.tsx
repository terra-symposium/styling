import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';
import { useForm } from 'react-hook-form';

function FormDemo(): React.JSX.Element {
	const form = useForm<{ name: string }>({ defaultValues: { name: 'Kai' } });
	return (
		<UI.Form {...form}>
			<form className={'grid w-full max-w-sm gap-2'} onSubmit={form.handleSubmit(() => {})}>
				<UI.Label htmlFor='component-preview-name'>Name</UI.Label>
				<UI.Input id='component-preview-name' {...form.register('name')} />
				<UI.Button size='sm' type='submit'>
					Save
				</UI.Button>
			</form>
		</UI.Form>
	);
}
export default FormDemo;

export const exampleCode =
	"import { useForm } from 'react-hook-form';\nimport { Form, Label, Input, Button } from '@terra-symposium/styling/ui';\n\nfunction NameForm() {\n  const form = useForm({ defaultValues: { name: 'Kai' } });\n  return <Form {...form}><form onSubmit={form.handleSubmit(() => {})}><Label htmlFor='name'>Name</Label><Input id='name' {...form.register('name')} /><Button type='submit'>Save</Button></form></Form>;\n}";
