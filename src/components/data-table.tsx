/**
 * src/components/data-table.tsx
 * Data-driven table rendering for searchable and editable entity directories.
 * https://ui.shadcn.com/docs/components/table
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../lib/cn.js';

// COMPONENTS
import { Empty } from './ui/empty.js';
import { Fragment } from 'react';
import { MappedFormControl, MappedFormFieldError } from './forms.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table.js';

// TYPES
import type { ComponentProps, JSX, Key, ReactNode } from 'react';
import type { MappedFormField } from './forms.js';

/*//////////////////////////////////////////////////
TYPES
//////////////////////////////////////////////////*/

// TABLE CONTRACTS
/** Defines a data-driven table column backed by a row property or custom content. */
export type DataTableColumn<Row extends object> = {
	key: string;
	label: ReactNode;
	align?: 'left' | 'center' | 'right';
	width?: 'compact' | 'icon' | 'actions' | 'wide' | 'wide-wrapped' | 'wider-wrapped';
	rowHeader?: boolean;
	verticalAlign?: 'top' | 'middle';
	height?: 'auto';
	textSize?: 'sm';
	fontWeight?: 'semibold';
	render?: (row: Row, index: number) => ReactNode;
	field?: (row: Row, index: number) => MappedFormField | undefined;
};

/** Models a table cell's static content or mapped control and its presentation. */
export type DataTableCell = {
	key: string;
	content?: ReactNode;
	field?: MappedFormField;
	align?: 'left' | 'center' | 'right';
	width?: 'compact' | 'icon' | 'actions' | 'wide' | 'wide-wrapped' | 'wider-wrapped';
	rowHeader?: boolean;
	verticalAlign?: 'top' | 'middle';
	height?: 'auto';
	textSize?: 'sm';
	fontWeight?: 'semibold';
};

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

// ALIGNMENT AND WIDTH
const ALIGN_CLASS = { left: '', center: 'text-center', right: 'text-right' };
const WIDTH_CLASS = {
	compact: 'w-px whitespace-nowrap',
	icon: 'w-12 whitespace-nowrap',
	actions: 'w-32 whitespace-nowrap',
	wide: 'min-w-56',
	'wide-wrapped': 'min-w-56 whitespace-normal',
	'wider-wrapped': 'min-w-72 whitespace-normal',
};

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

// CELL PRESENTATION CLASSES
// hygiene-ignore single-use -- Keep cellContentClass as a named declaration so its authored TSDoc stays attached. TSDoc: Builds the presentation classes shared by data-table cells.
/**
 * Builds the presentation classes shared by data-table cells.
 *
 * @param cell Cell-level alignment, height, text-size, and weight settings.
 * @param emphasize Whether this cell should be emphasized.
 *
 * @return The combined class string, or an empty string when no setting adds a class.
 */
function cellContentClass(cell: Pick<DataTableCell, 'verticalAlign' | 'height' | 'textSize' | 'fontWeight'>, emphasize: boolean): string | undefined {
	return cn(cell.verticalAlign === 'top' && 'align-top', cell.height === 'auto' && 'h-auto', cell.textSize === 'sm' && 'text-sm', (cell.fontWeight === 'semibold' || emphasize) && 'font-semibold');
}

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

// TABLE ROWS
/**
 * Renders one row from cell definitions using the shared table primitives.
 *
 * @param cells - Cell definitions rendered from left to right.
 * @param rowClassName - Optional classes applied to the table row.
 * @param rowProps - Optional native table-row properties excluding content and styling.
 * @param emphasizeFirstCol - Whether the first cell receives the stronger text weight.
 *
 * @return A shared table row containing the defined cells.
 */
export function DataTableRow({
	cells,
	rowClassName,
	rowProps,
	emphasizeFirstColumn: emphasizeFirstCol = false,
}: {
	cells: readonly DataTableCell[];
	rowClassName?: string;
	rowProps?: Omit<ComponentProps<typeof TableRow>, 'children' | 'className' | 'key'>;
	emphasizeFirstColumn?: boolean;
}): JSX.Element {
	/**
	 * Renders one cell using its alignment, width, mapped field, and emphasis settings.
	 *
	 * @param t - Cell content and presentation settings for this row.
	 * @param i - Zero-based cell position, used to emphasize the first column.
	 * @return A row header or data cell containing the mapped control or content.
	 */
	function renderCell(t: DataTableCell, i: number): JSX.Element {
		const className = cn(ALIGN_CLASS[t.align ?? 'left'], t.width && WIDTH_CLASS[t.width], cellContentClass(t, emphasizeFirstCol && i === 0));
		const content = t.field ? (
			<>
				<MappedFormControl field={t.field} />
				<MappedFormFieldError field={t.field} />
			</>
		) : (
			t.content
		);
		return t.rowHeader ? (
			<TableHead key={t.key} scope='row' className={className}>
				{content}
			</TableHead>
		) : (
			<TableCell key={t.key} className={className}>
				{content}
			</TableCell>
		);
	}
	return (
		<TableRow {...rowProps} className={rowClassName}>
			{cells.map(renderCell)}
		</TableRow>
	);
}

// TABLE CONTENT
/**
 * Renders rows and column definitions through the shared table primitives.
 *
 * @param rows - Ordered row records rendered beneath the column headers.
 * @param cols - Column labels, optional field accessors, and cell presentation settings.
 * @param rowKey - Stable row-key property or callback; defaults to the row index.
 * @param rowClassName - Optional callback that adds styling to each data row.
 * @param rowProps - Optional callback that supplies native table-row properties.
 * @param renderRow - Optional renderer that replaces the default cell-based row.
 * @param detail - Optional content rendered in a second row beneath each record.
 * @param variant - Selects standard table behavior or the editor empty-state layout.
 * @param tableLayout - Chooses automatic or fixed table column sizing.
 * @param tableWidth - Optional minimum width preset for horizontally scrollable tables.
 * @param emptyState - Empty-state title and optional description shown when there are no rows.
 * @param emphasizeFirstCol - Gives the first table cell stronger text weight.
 * @param pendingRowKey - Row key whose presentation should indicate pending work.
 *
 * @return Table content or the configured editor empty state, with overflow framing in editor mode.
 */
export function DataTableContent<Row extends object>({
	rows,
	columns: cols,
	rowKey,
	rowClassName,
	rowProps,
	renderRow,
	detail,
	variant = 'default',
	tableLayout = 'auto',
	tableWidth,
	emptyState,
	emphasizeFirstColumn: emphasizeFirstCol = false,
	pendingRowKey,
}: {
	rows: readonly Row[];
	columns: readonly DataTableColumn<Row>[];
	rowKey?: string | ((row: Row, index: number) => Key);
	rowClassName?: (row: Row, index: number) => string | undefined;
	rowProps?: (row: Row, index: number) => Omit<ComponentProps<typeof TableRow>, 'children' | 'className' | 'key'>;
	renderRow?: (row: Row, index: number) => ReactNode;
	detail?: (row: Row, index: number) => ReactNode;
	variant?: 'default' | 'editor';
	tableLayout?: 'auto' | 'fixed';
	tableWidth?: 'medium' | 'wide' | 'wider';
	emptyState?: { title: string; description?: string };
	emphasizeFirstColumn?: boolean;
	pendingRowKey?: Key | null;
}): JSX.Element {
	/**
	 * Renders one heading cell using its label, alignment, and width configuration.
	 *
	 * @param d - Column definition whose label and layout are displayed.
	 * @param i - Zero-based heading position, used when the column key is empty.
	 * @return A table heading cell for the column.
	 */
	function renderColHeader(d: DataTableColumn<Row>, i: number): JSX.Element {
		return (
			<TableHead key={d.key || i} className={cn(ALIGN_CLASS[d.align ?? 'left'], d.width && WIDTH_CLASS[d.width])}>
				{d.label}
			</TableHead>
		);
	}

	/**
	 * Builds the cells, optional detail row, and row presentation for one record.
	 *
	 * @param t - Data record rendered by this table row.
	 * @param i - Zero-based record position passed to row callbacks and fallback keys.
	 * @return A keyed fragment containing the record row and any detail row.
	 */
	function renderTableRow(t: Row, i: number): JSX.Element {
		const id = typeof rowKey === 'function' ? rowKey(t, i) : rowKey ? t[rowKey as keyof Row] : i;
		const key = typeof id === 'string' || typeof id === 'number' ? id : i;
		const rowDetail = detail?.(t, i);
		const rowCells: DataTableCell[] = [];
		for (const dataTableColDefinition of cols) {
			const rowValue = t[dataTableColDefinition.key as keyof Row];
			const field = dataTableColDefinition.field?.(t, i);
			rowCells.push({
				...dataTableColDefinition,
				field,
				content: field ? undefined : dataTableColDefinition.render ? dataTableColDefinition.render(t, i) : rowValue === null || rowValue === undefined ? '—' : String(rowValue),
			});
		}
		return (
			<Fragment key={key}>
				{renderRow ? (
					renderRow(t, i)
				) : (
					<DataTableRow
						rowProps={rowProps?.(t, i)}
						rowClassName={cn(pendingRowKey !== undefined && pendingRowKey === key && 'opacity-60', rowClassName?.(t, i))}
						emphasizeFirstColumn={emphasizeFirstCol}
						cells={rowCells}
					/>
				)}
				{rowDetail != null && (
					<TableRow>
						<TableCell colSpan={cols.length}>{rowDetail}</TableCell>
					</TableRow>
				)}
			</Fragment>
		);
	}

	const tableContent =
		variant === 'editor' && rows.length === 0 && emptyState ? (
			<Empty title={emptyState.title} description={emptyState.description} variant='padded' />
		) : (
			<Table className={cn(tableLayout === 'fixed' && 'table-fixed', tableWidth === 'medium' && 'min-w-[680px]', tableWidth === 'wide' && 'min-w-[52rem]', tableWidth === 'wider' && 'min-w-[78rem]')}>
				<TableHeader>
					<TableRow>{cols.map(renderColHeader)}</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map(renderTableRow)}
					{variant !== 'editor' && rows.length === 0 && emptyState && (
						<TableRow>
							<TableCell colSpan={cols.length} className='p-0'>
								<Empty title={emptyState.title} description={emptyState.description} variant='padded' />
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		);
	return variant === 'editor' ? <div className='border-gray-6 overflow-x-auto border-t'>{tableContent}</div> : tableContent;
}

/** The public data table uses the same unwrapped table renderer. */
export { DataTableContent as DataTable };
