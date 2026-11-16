import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<UI.ToggleGroup type='single' defaultValue='center'>
			<UI.ToggleGroupItem value='left'>Left</UI.ToggleGroupItem>
			<UI.ToggleGroupItem value='center'>Center</UI.ToggleGroupItem>
			<UI.ToggleGroupItem value='right'>Right</UI.ToggleGroupItem>
		</UI.ToggleGroup>
	);
}

export const exampleCode =
	"import { ToggleGroup, ToggleGroupItem } from '@terra-symposium/styling/ui';\n\n<ToggleGroup type='single' defaultValue='center'><ToggleGroupItem value='left'>Left</ToggleGroupItem><ToggleGroupItem value='center'>Center</ToggleGroupItem><ToggleGroupItem value='right'>Right</ToggleGroupItem></ToggleGroup>";
