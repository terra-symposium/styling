import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return <UI.AlertInfo title='Information'>Your changes are saved.</UI.AlertInfo>;
}

export const exampleCode = "import { AlertInfo } from '@terra-symposium/styling/ui';\n\n<AlertInfo title='Information'>Your changes are saved.</AlertInfo>";
