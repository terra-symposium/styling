/**
 * docs/styling/1-colouring/demos/card.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the card component example.
 * @return Renders the example and returns its React element.
 */
function CardDemo(): React.JSX.Element {
	return (
		<UI.Card variant='primary-tonal' className='w-full max-w-sm'>
			<UI.CardHeader>
				<UI.CardTitle>Project update</UI.CardTitle>
				<UI.CardDescription>Everything is ready to review.</UI.CardDescription>
			</UI.CardHeader>
			<UI.CardContent>
				<UI.Button size='sm'>Open project</UI.Button>
			</UI.CardContent>
		</UI.Card>
	);
}
export default CardDemo;

export const exampleCode =
	"import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@terra-symposium/styling/ui';\n\n<Card variant='primary-tonal' className='w-full max-w-sm'>\n\t\t\t<CardHeader>\n\t\t\t\t<CardTitle>Project update</CardTitle>\n\t\t\t\t<CardDescription>Everything is ready to review.</CardDescription>\n\t\t\t</CardHeader>\n\t\t\t<CardContent>\n\t\t\t\t<Button size='sm'>Open project</Button>\n\t\t\t</CardContent>\n\t\t</Card>";
