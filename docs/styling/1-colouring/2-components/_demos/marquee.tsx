/**
 * docs/styling/1-colouring/2-components/_demos/marquee.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

/**
 * Renders the marquee component example.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return <UI.Marquee terms={['Featured projects', 'New releases', 'Team updates']} />;
}

export const exampleCode = "import { Marquee } from '@terra-symposium/styling/ui';\n\n<Marquee terms={['Featured projects', 'New releases', 'Team updates']} />";
