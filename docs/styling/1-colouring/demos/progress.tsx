/**
 * docs/styling/1-colouring/demos/progress.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the progress component example.
 *
 * @return Renders the example and returns its React element.
 */
function ProgressDemo(): React.JSX.Element {
	return (
		<div className='grid w-full max-w-sm gap-2'>
			<span>Upload progress</span>
			<UI.Progress value={64} />
		</div>
	);
}
export default ProgressDemo;

export const exampleCode =
	"import { Progress } from '@terra-symposium/styling/ui';\n\n<div className='grid w-full max-w-sm gap-2'>\n\t\t\t<span>Upload progress</span>\n\t\t\t<Progress value={64} />\n\t\t</div>";
