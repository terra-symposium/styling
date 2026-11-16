import * as React from 'react';
import { DocsToolbarFrame } from '../../../../src/components/docs/toolbar-frame.js';

export default function Demo(): React.JSX.Element {
	return (
		<DocsToolbarFrame>
			<span>Document toolbar</span>
		</DocsToolbarFrame>
	);
}

export const exampleCode = "import { DocsToolbarFrame } from '@terra-symposium/styling/ui';\n\n<DocsToolbarFrame><span>Document toolbar</span></DocsToolbarFrame>";
