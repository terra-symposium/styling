import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

function BadgeDemo(): React.JSX.Element {
	return (
		<div className='flex flex-wrap items-center gap-2'>
			<UI.Badge variant='primary-tonal'>In progress</UI.Badge>
			<UI.Badge variant='success-tonal'>Complete</UI.Badge>
		</div>
	);
}
export default BadgeDemo;

export const exampleCode =
	"import { Badge } from '@terra-symposium/styling/ui';\n\n<div className='flex flex-wrap items-center gap-2'>\n\t\t\t<Badge variant='primary-tonal'>In progress</Badge>\n\t\t\t<Badge variant='success-tonal'>Complete</Badge>\n\t\t</div>";
