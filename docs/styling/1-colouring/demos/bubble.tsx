import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<UI.Bubble>
			<UI.BubbleContent>Message received</UI.BubbleContent>
		</UI.Bubble>
	);
}

export const exampleCode = "import { Bubble, BubbleContent } from '@terra-symposium/styling/ui';\n\n<Bubble><BubbleContent>Message received</BubbleContent></Bubble>";
