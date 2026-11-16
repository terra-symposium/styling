import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return <UI.Slider defaultValue={[55]} max={100} aria-label='Volume' className='w-48' />;
}

export const exampleCode = "import { Slider } from '@terra-symposium/styling/ui';\n\n<Slider defaultValue={[55]} max={100} aria-label='Volume' className='w-48' />";
