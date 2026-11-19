/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the pagination component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.Pagination>
			<UI.PaginationContent>
				<UI.PaginationPrevious href='#previous' />
				<UI.PaginationLink href='#page-1'>1</UI.PaginationLink>
				<UI.PaginationLink href='#page-2' isActive>
					2
				</UI.PaginationLink>
				<UI.PaginationNext href='#next' />
			</UI.PaginationContent>
		</UI.Pagination>
	);
}

export const exampleCode =
	"import { Pagination, PaginationContent, PaginationPrevious, PaginationLink, PaginationNext } from '@terra-symposium/styling/ui';\n\n<Pagination><PaginationContent><PaginationPrevious href='#previous' /><PaginationLink href='#page-1'>1</PaginationLink><PaginationLink href='#page-2' isActive>2</PaginationLink><PaginationNext href='#next' /></PaginationContent></Pagination>";
