/**
 * docs/styling/1-colouring/demos/tabs.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the tabs component example.
 *
 * @param variant - Appearance variant selected in the workbench.
 * @param triggerVariant - Appearance variant for each tab trigger.
 * @param selection - Style used to show the selected tab.
 *
 * @return Renders the example and returns its React element.
 */
function TabsDemo({ variant, triggerVariant, selection }: { variant?: string; triggerVariant?: string; selection?: 'none' | 'surface' | 'line' }): React.JSX.Element {
	return (
		<UI.Tabs defaultValue='overview' className='w-full'>
			<UI.TabsList
				variant={variant as React.ComponentProps<typeof UI.TabsList>['variant']}
				aria-label='Project details'
				className={variant === 'dashboard-nav' ? 'rounded bg-primary-12 px-3' : undefined}
			>
				<UI.TabsTrigger variant={triggerVariant as React.ComponentProps<typeof UI.TabsTrigger>['variant']} selection={selection} value='overview'>
					Overview
				</UI.TabsTrigger>
				<UI.TabsTrigger variant={triggerVariant as React.ComponentProps<typeof UI.TabsTrigger>['variant']} selection={selection} value='activity'>
					Activity
				</UI.TabsTrigger>
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
