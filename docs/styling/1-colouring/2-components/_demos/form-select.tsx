/**
 * docs/styling/1-colouring/2-components/_demos/form-select.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../../src/components/ui/index.js';

/**
 * Renders the form select component example.
 *
 * @param variant - Appearance variant selected in the workbench.
 *
 * @return Renders the example and returns its React element.
 */
export default function Demo({ variant }: { variant?: string }): React.JSX.Element {
	return (
		<UI.FormSelect
			variant={variant as React.ComponentProps<typeof UI.FormSelect>['variant']}
			name='team'
			options={[
				{ value: 'design', label: 'Design' },
				{ value: 'engineering', label: 'Engineering' },
			]}
			defaultValue='design'
		/>
	);
}

export const exampleCode =
	"import { FormSelect } from '@terra-symposium/styling/ui';\n\n<FormSelect name='team' options={[{ value: 'design', label: 'Design' }, { value: 'engineering', label: 'Engineering' }]} defaultValue='design' />";
