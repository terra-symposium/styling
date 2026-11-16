import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

function HintDemo(): React.JSX.Element {
	return (
		<UI.Hint content='Add a short explanation for this setting.'>
			<UI.Button variant='secondary-outline' size='sm'>
				What is this?
			</UI.Button>
		</UI.Hint>
	);
}
export default HintDemo;

export const exampleCode =
	"import { Hint, Button } from '@terra-symposium/styling/ui';\n\n<Hint content='Add a short explanation for this setting.'>\n\t\t\t<Button variant='secondary-outline' size='sm'>\n\t\t\t\tWhat is this?\n\t\t\t</Button>\n\t\t</Hint>";
