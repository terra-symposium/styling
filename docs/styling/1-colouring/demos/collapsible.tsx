/**
 * docs/styling/1-colouring/demos/collapsible.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the collapsible component example.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.Collapsible>
			<UI.CollapsibleTrigger asChild>
				<UI.Button size='sm'>Show details</UI.Button>
			</UI.CollapsibleTrigger>
			<UI.CollapsibleContent>Additional information</UI.CollapsibleContent>
		</UI.Collapsible>
	);
}

export const exampleCode =
	"import { Collapsible, CollapsibleTrigger, Button, CollapsibleContent } from '@terra-symposium/styling/ui';\n\n<Collapsible><CollapsibleTrigger asChild><Button size='sm'>Show details</Button></CollapsibleTrigger><CollapsibleContent>Additional information</CollapsibleContent></Collapsible>";
