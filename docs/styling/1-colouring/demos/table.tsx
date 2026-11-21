/**
 * docs/styling/1-colouring/demos/table.tsx
 */
/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

import * as React from 'react';
import * as UI from '../../../../src/components/ui/index.js';

/**
 * Renders the table component example.
 * @return Renders the example and returns its React element.
 */
export default function Demo(): React.JSX.Element {
	return (
		<UI.Table>
			<UI.TableHeader>
				<UI.TableRow>
					<UI.TableHead>Name</UI.TableHead>
					<UI.TableHead>Role</UI.TableHead>
				</UI.TableRow>
			</UI.TableHeader>
			<UI.TableBody>
				<UI.TableRow>
					<UI.TableCell>Kai</UI.TableCell>
					<UI.TableCell>Designer</UI.TableCell>
				</UI.TableRow>
			</UI.TableBody>
		</UI.Table>
	);
}

export const exampleCode =
	"import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@terra-symposium/styling/ui';\n\n<Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>Kai</TableCell><TableCell>Designer</TableCell></TableRow></TableBody></Table>";
