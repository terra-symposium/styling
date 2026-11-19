/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the mapped form fields component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return <UI.MappedFormFields fields={[{ type: 'input', name: 'project', label: 'Project name', defaultValue: 'Styling' }]} />;
}

export const exampleCode =
	"import { MappedFormFields } from '@terra-symposium/styling/ui';\n\n<MappedFormFields fields={[{ type: 'input', name: 'project', label: 'Project name', defaultValue: 'Styling' }]} />";
