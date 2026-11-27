/**
 * docs/styling/1-colouring/demos/radio-group.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

/**
 * Renders the radio group component example.
 *
 * @param variant - Appearance variant selected in the workbench.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo({ variant }: { variant?: string }): React.JSX.Element {
	return (
		<UI.RadioGroup defaultValue='one'>
			<UI.Label htmlFor='radio-demo-one' className='flex gap-2'>
				<UI.RadioGroupItem variant={variant as React.ComponentProps<typeof UI.RadioGroupItem>['variant']} id='radio-demo-one' value='one' />
				First
			</UI.Label>
			<UI.Label htmlFor='radio-demo-two' className='flex gap-2'>
				<UI.RadioGroupItem variant={variant as React.ComponentProps<typeof UI.RadioGroupItem>['variant']} id='radio-demo-two' value='two' />
				Second
			</UI.Label>
		</UI.RadioGroup>
	);
}

export const exampleCode =
	"import { Label, RadioGroup, RadioGroupItem } from '@terra-symposium/styling/ui';\n\n<RadioGroup defaultValue='one'><Label htmlFor='one' className='flex gap-2'><RadioGroupItem id='one' value='one' />First</Label><Label htmlFor='two' className='flex gap-2'><RadioGroupItem id='two' value='two' />Second</Label></RadioGroup>";
