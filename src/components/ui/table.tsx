/**
 * src/components/ui/table.tsx
 * https://ui.shadcn.com/docs/components/table
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';

// COMPONENTS
import * as React from 'react';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

// terra-quality-ignore single-use -- Keep renderTable as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the scrollable table wrapper and its native table element.
/** Renders the scrollable table wrapper and its native table element.
 * @param tableProps - Native table attributes and child content.
 * @param ref - Ref forwarded to the table element.
 * @return A horizontally scrollable wrapper around the styled table.
 */
function renderTable(tableProps: React.HTMLAttributes<HTMLTableElement>, ref: React.ForwardedRef<HTMLTableElement>): React.JSX.Element {
	const { className, ...props } = tableProps;
	return (
		<div className='relative w-full overflow-auto'>
			<table ref={ref} className={cn('w-full caption-bottom rounded border-primary-6 text-sm', className)} {...props} />
		</div>
	);
}

// terra-quality-ignore single-use -- Keep renderTableHeader as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the table header section and its row separators.
/** Renders the table header section and its row separators.
 * @param headerProps - Native table-section attributes and children.
 * @param ref - Ref forwarded to the table header element.
 * @return A styled table header section.
 */
function renderTableHeader(headerProps: React.HTMLAttributes<HTMLTableSectionElement>, ref: React.ForwardedRef<HTMLTableSectionElement>): React.JSX.Element {
	const { className, ...props } = headerProps;
	return <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />;
}

// terra-quality-ignore single-use -- Keep renderTableBody as a named declaration so its authored TSDoc stays attached. TSDoc: Renders table body rows and removes the final row border.
/** Renders table body rows and removes the final row border.
 * @param bodyProps - Native table-section attributes and children.
 * @param ref - Ref forwarded to the table body element.
 * @return A styled table body section.
 */
function renderTableBody(bodyProps: React.HTMLAttributes<HTMLTableSectionElement>, ref: React.ForwardedRef<HTMLTableSectionElement>): React.JSX.Element {
	const { className, ...props } = bodyProps;
	return <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

// terra-quality-ignore single-use -- Keep renderTableFooter as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the table footer with shared border and background styles.
/** Renders the table footer with shared border and background styles.
 * @param footerProps - Native table-section attributes and children.
 * @param ref - Ref forwarded to the table footer element.
 * @return A styled table footer section.
 */
function renderTableFooter(footerProps: React.HTMLAttributes<HTMLTableSectionElement>, ref: React.ForwardedRef<HTMLTableSectionElement>): React.JSX.Element {
	const { className, ...props } = footerProps;
	return <tfoot ref={ref} className={cn('border-t bg-gray-100/50 font-medium dark:bg-gray-800/50 [&>tr]:last:border-b-0', className)} {...props} />;
}

// terra-quality-ignore single-use -- Keep renderTableRow as a named declaration so its authored TSDoc stays attached. TSDoc: Renders a table row with shared border and hover treatment.
/** Renders a table row with shared border and hover treatment.
 * @param rowProps - Native table-row attributes and children.
 * @param ref - Ref forwarded to the table row element.
 * @return A styled table row.
 */
function renderTableRow(rowProps: React.HTMLAttributes<HTMLTableRowElement>, ref: React.ForwardedRef<HTMLTableRowElement>): React.JSX.Element {
	const { className, ...props } = rowProps;
	return <tr ref={ref} className={cn('border-b border-primary-6 transition-colors hover:bg-primary-2 data-[state=selected]:bg-primary-2', className)} {...props} />;
}

// terra-quality-ignore single-use -- Keep renderTableHead as a named declaration so its authored TSDoc stays attached. TSDoc: Renders a table header cell with shared alignment and spacing.
/** Renders a table header cell with shared alignment and spacing.
 * @param headProps - Native table-cell header attributes and children.
 * @param ref - Ref forwarded to the header cell element.
 * @return A styled table header cell.
 */
function renderTableHead(headProps: React.ThHTMLAttributes<HTMLTableCellElement>, ref: React.ForwardedRef<HTMLTableCellElement>): React.JSX.Element {
	const { className, ...props } = headProps;
	return <th ref={ref} className={cn('h-12 px-4 text-left align-middle font-medium text-primary-11 [&:has([role=checkbox])]:pr-0', className)} {...props} />;
}

// terra-quality-ignore single-use -- Keep renderTableCell as a named declaration so its authored TSDoc stays attached. TSDoc: Renders a table data cell with shared spacing and print styles.
/** Renders a table data cell with shared spacing and print styles.
 * @param cellProps - Native table-cell attributes and children.
 * @param ref - Ref forwarded to the data cell element.
 * @return A styled table data cell.
 */
function renderTableCell(cellProps: React.TdHTMLAttributes<HTMLTableCellElement>, ref: React.ForwardedRef<HTMLTableCellElement>): React.JSX.Element {
	const { className, ...props } = cellProps;
	return <td ref={ref} className={cn('p-4 align-middle print:p-2 [&:has([role=checkbox])]:pr-0', className)} {...props} />;
}

// terra-quality-ignore single-use -- Keep renderTableCaption as a named declaration so its authored TSDoc stays attached. TSDoc: Renders a table caption with shared muted typography.
/** Renders a table caption with shared muted typography.
 * @param captionProps - Native caption attributes and text.
 * @param ref - Ref forwarded to the caption element.
 * @return A styled table caption.
 */
function renderTableCaption(captionProps: React.HTMLAttributes<HTMLTableCaptionElement>, ref: React.ForwardedRef<HTMLTableCaptionElement>): React.JSX.Element {
	const { className, ...props } = captionProps;
	return <caption ref={ref} className={cn('mt-4 text-sm text-gray-500 dark:text-gray-400', className)} {...props} />;
}

/**
 * Table container primitive.
 *
 */
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(renderTable);

/**
 * Table header primitive (`<thead>`).
 *
 */
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(renderTableHeader);

/**
 * Table body primitive (`<tbody>`).
 *
 */
const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(renderTableBody);

/**
 * Table footer primitive (`<tfoot>`).
 *
 */
const TableFooter = Object.assign(React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(renderTableFooter), { displayName: 'TableFooter' });

/**
 * Table row primitive (`<tr>`).
 *
 */
const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(renderTableRow);

/**
 * Table header cell primitive (`<th>`).
 *
 */
const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(renderTableHead);

/**
 * Table cell primitive (`<td>`).
 *
 */
const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(renderTableCell);

/**
 * Table caption primitive (`<caption>`).
 *
 */
const TableCaption = Object.assign(React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(renderTableCaption), { displayName: 'TableCaption' });
Table.displayName = 'Table';
TableHeader.displayName = 'TableHeader';
TableBody.displayName = 'TableBody';
TableRow.displayName = 'TableRow';
TableHead.displayName = 'TableHead';
TableCell.displayName = 'TableCell';
export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableFooter, TableCaption };
