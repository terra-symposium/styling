import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return (
		<UI.Command className='max-w-xs rounded border'>
			<UI.CommandInput placeholder='Search commands' />
			<UI.CommandList>
				<UI.CommandEmpty>No results.</UI.CommandEmpty>
				<UI.CommandGroup heading='Actions'>
					<UI.CommandItem>Open project</UI.CommandItem>
				</UI.CommandGroup>
			</UI.CommandList>
		</UI.Command>
	);
}

export const exampleCode =
	"import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@terra-symposium/styling/ui';\n\n<Command className='max-w-xs rounded border'><CommandInput placeholder='Search commands' /><CommandList><CommandEmpty>No results.</CommandEmpty><CommandGroup heading='Actions'><CommandItem>Open project</CommandItem></CommandGroup></CommandList></Command>";
