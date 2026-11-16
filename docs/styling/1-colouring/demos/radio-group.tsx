import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<UI.RadioGroup defaultValue='one'>
			<UI.Label htmlFor='radio-demo-one' className='flex gap-2'>
				<UI.RadioGroupItem id='radio-demo-one' value='one' />
				First
			</UI.Label>
			<UI.Label htmlFor='radio-demo-two' className='flex gap-2'>
				<UI.RadioGroupItem id='radio-demo-two' value='two' />
				Second
			</UI.Label>
		</UI.RadioGroup>
	);
}

export const exampleCode =
	"import { Label, RadioGroup, RadioGroupItem } from '@terra-symposium/styling/ui';\n\n<RadioGroup defaultValue='one'><Label htmlFor='one' className='flex gap-2'><RadioGroupItem id='one' value='one' />First</Label><Label htmlFor='two' className='flex gap-2'><RadioGroupItem id='two' value='two' />Second</Label></RadioGroup>";
