/**
 * docs/styling/1-colouring/demos/slider.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the slider component example.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return <UI.Slider defaultValue={[55]} max={100} aria-label='Volume' className='w-48' />;
}

export const exampleCode = "import { Slider } from '@terra-symposium/styling/ui';\n\n<Slider defaultValue={[55]} max={100} aria-label='Volume' className='w-48' />";
