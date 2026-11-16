import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<UI.TooltipProvider>
			<UI.Tooltip>
				<UI.TooltipTrigger asChild>
					<UI.Button size='sm'>Hover or focus</UI.Button>
				</UI.TooltipTrigger>
				<UI.TooltipContent>More information</UI.TooltipContent>
			</UI.Tooltip>
		</UI.TooltipProvider>
	);
}

export const exampleCode =
	"import { TooltipProvider, Tooltip, TooltipTrigger, Button, TooltipContent } from '@terra-symposium/styling/ui';\n\n<TooltipProvider><Tooltip><TooltipTrigger asChild><Button size='sm'>Hover or focus</Button></TooltipTrigger><TooltipContent>More information</TooltipContent></Tooltip></TooltipProvider>";
