/**
 * docs/styling/1-colouring/demos/data-table.tsx
 * Interactive DataTable example and its copyable source.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Shows a small two-column table in the component catalog.
 *
 * @return The DataTable preview.
 */
function DataTableDemo(): React.JSX.Element {
	return (
		<UI.DataTable
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
