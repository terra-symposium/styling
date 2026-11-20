/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the bubble component example.
 * @param variant - Appearance variant selected in the workbench.
 * @return Renders the example and returns its React element.
 */
export default function Demo({ variant }: { variant?: string }): React.JSX.Element {
	return (
		<UI.Bubble variant={variant as React.ComponentProps<typeof UI.Bubble>['variant']}>
			<UI.BubbleContent>Message received</UI.BubbleContent>
		</UI.Bubble>
	);
}

export const exampleCode = "import { Bubble, BubbleContent } from '@terra-symposium/styling/ui';\n\n<Bubble><BubbleContent>Message received</BubbleContent></Bubble>";
