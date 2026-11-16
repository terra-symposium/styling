import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

export default function Demo(): React.JSX.Element {
	return <UI.Marquee terms={['Featured projects', 'New releases', 'Team updates']} />;
}

export const exampleCode = "import { Marquee } from '@terra-symposium/styling/ui';\n\n<Marquee terms={['Featured projects', 'New releases', 'Team updates']} />";
