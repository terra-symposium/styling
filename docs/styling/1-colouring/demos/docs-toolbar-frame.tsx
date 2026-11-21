/**
 * docs/styling/1-colouring/demos/docs-toolbar-frame.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import { DocsToolbarFrame } from '../../../../src/components/docs/toolbar-frame.js';

/**
 * Renders the docs toolbar frame component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<DocsToolbarFrame>
			<span>Document toolbar</span>
		</DocsToolbarFrame>
	);
}

export const exampleCode = "import { DocsToolbarFrame } from '@terra-symposium/styling/ui';\n\n<DocsToolbarFrame><span>Document toolbar</span></DocsToolbarFrame>";
