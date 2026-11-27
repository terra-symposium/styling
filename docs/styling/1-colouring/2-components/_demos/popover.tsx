/**
 * docs/styling/1-colouring/2-components/_demos/popover.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

/**
 * Renders the popover component example.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.Popover>
			<UI.PopoverTrigger asChild>
				<UI.Button size='sm'>Open popover</UI.Button>
			</UI.PopoverTrigger>
			<UI.PopoverContent>Popover content</UI.PopoverContent>
		</UI.Popover>
	);
}

export const exampleCode =
	"import { Popover, PopoverTrigger, Button, PopoverContent } from '@terra-symposium/styling/ui';\n\n<Popover><PopoverTrigger asChild><Button size='sm'>Open popover</Button></PopoverTrigger><PopoverContent>Popover content</PopoverContent></Popover>";
