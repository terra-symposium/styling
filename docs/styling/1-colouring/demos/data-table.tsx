/**
 * docs/styling/1-colouring/demos/data-table.tsx
 * Interactive DataTable example and its copyable source.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Shows a small two-column table in the component catalog.
 *
 * @param variant - Appearance variant selected in the workbench.
 * @return The DataTable preview.
 */
function DataTableDemo({ variant }: { variant?: string }): React.JSX.Element {
	return (
		<UI.DataTable
			variant={variant as React.ComponentProps<typeof UI.DataTable>['variant']}
			rows={[{ name: 'Kai', role: 'Designer' }]}
			columns={[
				{ key: 'name', label: 'Name' },
				{ key: 'role', label: 'Role' },
			]}
		/>
	);
}
export default DataTableDemo;

export const exampleCode =
	"import { DataTable } from '@terra-symposium/styling/ui';\n\n<DataTable\n\trows={[{ name: 'Kai', role: 'Designer' }]}\n\tcolumns={[\n\t\t{ key: 'name', label: 'Name' },\n\t\t{ key: 'role', label: 'Role' },\n\t]}\n/>";
