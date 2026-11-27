/**
 * docs/styling/1-colouring/2-components/_demos/message-scroller.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the message scroller component example.
 *
 * @return Renders the example and returns its React element.
 */
function MsgScrollerDemo(): React.JSX.Element {
	return (
		<UI.MessageScrollerProvider>
			<UI.MessageScroller className='h-28 w-72 rounded border'>
				<UI.MessageScrollerViewport>
					<UI.MessageScrollerContent>
						<UI.MessageScrollerItem>
							<UI.Message align='start'>
								<UI.MessageContent>Design review is ready.</UI.MessageContent>
							</UI.Message>
						</UI.MessageScrollerItem>
						<UI.MessageScrollerItem>
							<UI.Message align='end'>
								<UI.MessageContent>Thanks, I’ll take a look.</UI.MessageContent>
							</UI.Message>
						</UI.MessageScrollerItem>
					</UI.MessageScrollerContent>
				</UI.MessageScrollerViewport>
			</UI.MessageScroller>
		</UI.MessageScrollerProvider>
	);
}
export default MsgScrollerDemo;

export const exampleCode =
	"import { MessageScrollerProvider, MessageScroller, MessageScrollerViewport, MessageScrollerContent, MessageScrollerItem, Message, MessageContent } from '@terra-symposium/styling/ui';\n\n<MessageScrollerProvider><MessageScroller className='h-28 w-72 rounded border'><MessageScrollerViewport><MessageScrollerContent><MessageScrollerItem><Message align='start'><MessageContent>Design review is ready.</MessageContent></Message></MessageScrollerItem><MessageScrollerItem><Message align='end'><MessageContent>Thanks, I’ll take a look.</MessageContent></Message></MessageScrollerItem></MessageScrollerContent></MessageScrollerViewport></MessageScroller></MessageScrollerProvider>";
