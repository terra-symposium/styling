import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return <UI.Textarea placeholder='Write a short note…' rows={2} />;
}

export const exampleCode = "import { Textarea } from '@terra-symposium/styling/ui';\n\n<Textarea placeholder='Write a short note…' rows={2} />";
