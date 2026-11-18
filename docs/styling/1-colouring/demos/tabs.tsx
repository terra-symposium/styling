/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the tabs component example.
 * @return Renders the example and returns its React element.
 */
function TabsDemo(): React.JSX.Element {
	return (
		<UI.Tabs defaultValue='overview' className='w-full'>
			<UI.TabsList aria-label='Project details'>
				<UI.TabsTrigger value='overview'>Overview</UI.TabsTrigger>
				<UI.TabsTrigger value='activity'>Activity</UI.TabsTrigger>
			</UI.TabsList>
			<UI.TabsContent value='overview'>
				<p>Review the project status, owner, and next milestone.</p>
			</UI.TabsContent>
			<UI.TabsContent value='activity'>
				<p>The team updated the project plan this morning.</p>
			</UI.TabsContent>
		</UI.Tabs>
	);
}
export default TabsDemo;

export const exampleCode =
	"import { Tabs, TabsList, TabsTrigger, TabsContent } from '@terra-symposium/styling/ui';\n\n<Tabs defaultValue='overview' className='w-full'>\n\t\t\t<TabsList aria-label='Project details'>\n\t\t\t\t<TabsTrigger value='overview'>Overview</TabsTrigger>\n\t\t\t\t<TabsTrigger value='activity'>Activity</TabsTrigger>\n\t\t\t</TabsList>\n\t\t\t<TabsContent value='overview'>\n\t\t\t\t<p>Review the project status, owner, and next milestone.</p>\n\t\t\t</TabsContent>\n\t\t\t<TabsContent value='activity'>\n\t\t\t\t<p>The team updated the project plan this morning.</p>\n\t\t\t</TabsContent>\n\t\t</Tabs>";
