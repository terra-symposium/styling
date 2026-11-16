import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return <UI.UserAvatar user={{ id: 'kai', name: 'Kai' }} />;
}

export const exampleCode = "import { UserAvatar } from '@terra-symposium/styling/ui';\n\n<UserAvatar user={{ id: 'kai', name: 'Kai' }} />";
