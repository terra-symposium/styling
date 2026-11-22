/**
 * docs/styling/1-colouring/demos/avatar.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the avatar component example.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return <UI.UserAvatar user={{ id: 'kai', name: 'Kai' }} />;
}

export const exampleCode = "import { UserAvatar } from '@terra-symposium/styling/ui';\n\n<UserAvatar user={{ id: 'kai', name: 'Kai' }} />";
