import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<UI.Toggle aria-label='Bold' defaultPressed>
			Bold
		</UI.Toggle>
	);
}

export const exampleCode = "import { Toggle } from '@terra-symposium/styling/ui';\n\n<Toggle aria-label='Bold' defaultPressed>Bold</Toggle>";
