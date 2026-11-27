/**
 * docs/styling/1-colouring/2-components/_demos/message.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

/**
 * Renders the message component example.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.MessageGroup>
			<UI.Message align='start'>
				<UI.MessageContent>Hello from the team.</UI.MessageContent>
			</UI.Message>
		</UI.MessageGroup>
	);
}

export const exampleCode =
	"import { MessageGroup, Message, MessageContent } from '@terra-symposium/styling/ui';\n\n<MessageGroup><Message align='start'><MessageContent>Hello from the team.</MessageContent></Message></MessageGroup>";
