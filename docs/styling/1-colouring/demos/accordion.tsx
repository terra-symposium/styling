/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

// hygiene-ignore single-use -- Keep this named React component boundary in the eager demo registry; stable component identity preserves hook ownership and reconciliation state.
/**
 * Renders the accordion component example.
 * @return Renders the example and returns its React element.
 */
function AccordionDemo(): React.JSX.Element {
	return (
		<UI.Accordion type='single' collapsible defaultValue='overview' className='w-full'>
			<UI.AccordionItem value='overview'>
				<UI.AccordionTrigger>Project overview</UI.AccordionTrigger>
				<UI.AccordionContent>Review the project status, owner, and next milestone.</UI.AccordionContent>
			</UI.AccordionItem>
			<UI.AccordionItem value='activity'>
				<UI.AccordionTrigger>Recent activity</UI.AccordionTrigger>
				<UI.AccordionContent>The team updated the project plan this morning.</UI.AccordionContent>
			</UI.AccordionItem>
		</UI.Accordion>
	);
}
export default AccordionDemo;

export const exampleCode =
	"import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@terra-symposium/styling/ui';\n\n<Accordion type='single' collapsible defaultValue='overview' className='w-full'>\n\t\t\t<AccordionItem value='overview'>\n\t\t\t\t<AccordionTrigger>Project overview</AccordionTrigger>\n\t\t\t\t<AccordionContent>Review the project status, owner, and next milestone.</AccordionContent>\n\t\t\t</AccordionItem>\n\t\t\t<AccordionItem value='activity'>\n\t\t\t\t<AccordionTrigger>Recent activity</AccordionTrigger>\n\t\t\t\t<AccordionContent>The team updated the project plan this morning.</AccordionContent>\n\t\t\t</AccordionItem>\n\t\t</Accordion>";
