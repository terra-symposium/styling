/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the empty component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return <UI.Empty title='No items yet' description='Create an item to get started.' variant='panel' />;
}

export const exampleCode = "import { Empty } from '@terra-symposium/styling/ui';\n\n<Empty title='No items yet' description='Create an item to get started.' variant='panel' />";
