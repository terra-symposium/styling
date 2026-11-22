/**
 * docs/styling/1-colouring/demos/toggle-group.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the toggle group component example.
 *
 * @param variant - Appearance variant selected in the workbench.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo({ variant }: { variant?: string }): React.JSX.Element {
	return (
		<UI.ToggleGroup variant={variant as React.ComponentProps<typeof UI.ToggleGroup>['variant']} type='single' defaultValue='center'>
			<UI.ToggleGroupItem value='left'>Left</UI.ToggleGroupItem>
			<UI.ToggleGroupItem value='center'>Center</UI.ToggleGroupItem>
			<UI.ToggleGroupItem value='right'>Right</UI.ToggleGroupItem>
		</UI.ToggleGroup>
	);
}

export const exampleCode =
	"import { ToggleGroup, ToggleGroupItem } from '@terra-symposium/styling/ui';\n\n<ToggleGroup type='single' defaultValue='center'><ToggleGroupItem value='left'>Left</ToggleGroupItem><ToggleGroupItem value='center'>Center</ToggleGroupItem><ToggleGroupItem value='right'>Right</ToggleGroupItem></ToggleGroup>";
