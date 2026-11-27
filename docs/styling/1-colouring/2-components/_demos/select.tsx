/**
 * docs/styling/1-colouring/2-components/_demos/select.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the select component example.
 *
 * @param variant - Appearance variant selected in the workbench.
 *
 * @return Renders the example and returns its React element.
 */
function SelectDemo({ variant }: { variant?: string }): React.JSX.Element {
	return (
		<UI.Select value='design'>
			<UI.SelectTrigger variant={variant as React.ComponentProps<typeof UI.SelectTrigger>['variant']} aria-label='Team'>
				<UI.SelectValue placeholder='Choose a team' />
			</UI.SelectTrigger>
			<UI.SelectContent>
				<UI.SelectItem value='design'>Design team</UI.SelectItem>
			</UI.SelectContent>
		</UI.Select>
	);
}
export default SelectDemo;

export const exampleCode =
	"import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@terra-symposium/styling/ui';\n\n<Select value='design'>\n\t\t\t<SelectTrigger aria-label='Team'>\n\t\t\t\t<SelectValue placeholder='Choose a team' />\n\t\t\t</SelectTrigger>\n\t\t\t<SelectContent>\n\t\t\t\t<SelectItem value='design'>Design team</SelectItem>\n\t\t\t</SelectContent>\n\t\t</Select>";
