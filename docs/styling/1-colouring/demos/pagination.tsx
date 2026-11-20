/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the pagination component example.
 * @param variant - Appearance variant selected in the workbench.
 * @return Renders the example and returns its React element.
 */
export default function Demo({ variant }: { variant?: string }): React.JSX.Element {
	return (
		<UI.Pagination>
			<UI.PaginationContent>
				<UI.PaginationPrevious href='#previous' />
				<UI.PaginationLink href='#page-1'>1</UI.PaginationLink>
				<UI.PaginationLink href='#page-2' isActive>
					2
				</UI.PaginationLink>
				<UI.PaginationItem variant={variant as React.ComponentProps<typeof UI.PaginationItem>['variant']} size='sm'>
					More
				</UI.PaginationItem>
				<UI.PaginationNext href='#next' />
			</UI.PaginationContent>
		</UI.Pagination>
	);
}

export const exampleCode =
	"import { Pagination, PaginationContent, PaginationPrevious, PaginationLink, PaginationItem, PaginationNext } from '@terra-symposium/styling/ui';\n\n<Pagination><PaginationContent><PaginationPrevious href='#previous' /><PaginationLink href='#page-1'>1</PaginationLink><PaginationLink href='#page-2' isActive>2</PaginationLink><PaginationItem size='sm'>More</PaginationItem><PaginationNext href='#next' /></PaginationContent></Pagination>";
