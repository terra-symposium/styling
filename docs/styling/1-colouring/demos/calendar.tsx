import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return <UI.Calendar mode='single' defaultMonth={new Date(2025, 0, 1)} />;
}

export const exampleCode = "import { Calendar } from '@terra-symposium/styling/ui';\n\n<Calendar mode='single' defaultMonth={new Date(2025, 0, 1)} />";
