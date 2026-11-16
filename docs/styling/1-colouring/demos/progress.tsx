import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

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
