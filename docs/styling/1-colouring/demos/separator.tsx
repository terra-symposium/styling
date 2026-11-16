import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

function SeparatorDemo(): React.JSX.Element {
	return (
		<div className='grid w-full max-w-sm gap-2'>
			<span>Account</span>
			<UI.Separator />
			<span>Preferences</span>
		</div>
	);
}
export default SeparatorDemo;

export const exampleCode =
	"import { Separator } from '@terra-symposium/styling/ui';\n\n<div className='grid w-full max-w-sm gap-2'>\n\t\t\t<span>Account</span>\n\t\t\t<Separator />\n\t\t\t<span>Preferences</span>\n\t\t</div>";
