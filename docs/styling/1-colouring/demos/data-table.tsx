import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

function DataTableDemo(): React.JSX.Element {
	return (
		<UI.DataTable
			title='Team members'
			description='Two people in the design team'
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
	"import { DataTable } from '@terra-symposium/styling/ui';\n\n<DataTable\n\t\t\ttitle='Team members'\n\t\t\tdescription='Two people in the design team'\n\t\t\trows={[{ name: 'Kai', role: 'Designer' }]}\n\t\t\tcolumns={[\n\t\t\t\t{ key: 'name', label: 'Name' },\n\t\t\t\t{ key: 'role', label: 'Role' },\n\t\t\t]}\n\t\t/>";
