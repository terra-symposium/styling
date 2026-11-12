/**
 * src/components/data-table.tsx
 * Shared card and table composition for searchable, editable entity directories.
 * https://ui.shadcn.com/docs/components/table
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../lib/cn.js";

// COMPONENTS
import { Button } from "./ui/button.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card.js";
import { Empty } from "./ui/empty.js";
import { Fragment } from "react";
import { MappedFormControl, MappedFormFieldError } from "./forms.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table.js";

// TYPES
import type { ComponentProps, JSX, Key, ReactNode } from "react";
import type { MappedFormField } from "./forms.js";

/*//////////////////////////////////////////////////
TYPES
//////////////////////////////////////////////////*/

// TABLE CONTRACTS
/** Defines a data-driven table column backed by a row property or custom content. */
export type DataTableColumn<Row extends object> = {
  key: string;
  label: ReactNode;
  align?: "left" | "center" | "right";
  width?:
    "compact" | "icon" | "actions" | "wide" | "wide-wrapped" | "wider-wrapped";
  rowHeader?: boolean;
  verticalAlign?: "top" | "middle";
  height?: "auto";
  textSize?: "sm";
  fontWeight?: "semibold";
  render?: (row: Row, index: number) => ReactNode;
  field?: (row: Row, index: number) => MappedFormField | undefined;
};

/** Models a table cell's static content or mapped control and its presentation. */
export type DataTableCell = {
  key: string;
  content?: ReactNode;
  field?: MappedFormField;
  align?: "left" | "center" | "right";
  width?:
    "compact" | "icon" | "actions" | "wide" | "wide-wrapped" | "wider-wrapped";
  rowHeader?: boolean;
  verticalAlign?: "top" | "middle";
  height?: "auto";
  textSize?: "sm";
  fontWeight?: "semibold";
};

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

// ALIGNMENT AND WIDTH
const ALIGN_CLASS = { left: "", center: "text-center", right: "text-right" };
const WIDTH_CLASS = {
  compact: "w-px whitespace-nowrap",
  icon: "w-12 whitespace-nowrap",
  actions: "w-32 whitespace-nowrap",
  wide: "min-w-56",
  "wide-wrapped": "min-w-56 whitespace-normal",
  "wider-wrapped": "min-w-72 whitespace-normal",
};

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

// CELL PRESENTATION CLASSES
/**
 * Builds the presentation classes shared by data-table cells.
 *
 * @param cell Cell-level alignment, height, text-size, and weight settings.
 * @param emphasize Whether this cell should be emphasized.
 *
 * @return The combined class string, or an empty string when no setting adds a class.
 */
function cellContentClass(
  cell: Pick<
    DataTableCell,
    "verticalAlign" | "height" | "textSize" | "fontWeight"
  >,
  emphasize: boolean,
): string | undefined {
  return cn(
    cell.verticalAlign === "top" && "align-top",
    cell.height === "auto" && "h-auto",
    cell.textSize === "sm" && "text-sm",
    (cell.fontWeight === "semibold" || emphasize) && "font-semibold",
  );
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
  rowProps?: Omit<
    ComponentProps<typeof TableRow>,
    "children" | "className" | "key"
  >;
  emphasizeFirstColumn?: boolean;
}): JSX.Element {
  /** Renders one cell using its alignment, width, mapped field, and emphasis settings. */
  function renderCell(cell: DataTableCell, i: number): JSX.Element {
    const className = cn(
      ALIGN_CLASS[cell.align ?? "left"],
      cell.width && WIDTH_CLASS[cell.width],
      cellContentClass(cell, emphasizeFirstCol && i === 0),
    );
    const content = cell.field ? (
      <>
        <MappedFormControl field={cell.field} />
        <MappedFormFieldError field={cell.field} />
      </>
    ) : (
      cell.content
    );
    return cell.rowHeader ? (
      <TableHead key={cell.key} scope="row" className={className}>
        {content}
      </TableHead>
    ) : (
      <TableCell key={cell.key} className={className}>
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
  variant = "default",
  tableLayout = "auto",
  tableWidth,
  emptyState,
  emphasizeFirstColumn: emphasizeFirstCol = false,
  pendingRowKey,
}: {
  rows: readonly Row[];
  columns: readonly DataTableColumn<Row>[];
  rowKey?: string | ((row: Row, index: number) => Key);
  rowClassName?: (row: Row, index: number) => string | undefined;
  rowProps?: (
    row: Row,
    index: number,
  ) => Omit<ComponentProps<typeof TableRow>, "children" | "className" | "key">;
  renderRow?: (row: Row, index: number) => ReactNode;
  detail?: (row: Row, index: number) => ReactNode;
  variant?: "default" | "editor";
  tableLayout?: "auto" | "fixed";
  tableWidth?: "medium" | "wide" | "wider";
  emptyState?: { title: string; description?: string };
  emphasizeFirstColumn?: boolean;
  pendingRowKey?: Key | null;
}): JSX.Element {
  /** Renders one heading cell using its label, alignment, and width configuration. */
  function renderColHeader(col: DataTableColumn<Row>, i: number): JSX.Element {
    return (
      <TableHead
        key={col.key || i}
        className={cn(
          ALIGN_CLASS[col.align ?? "left"],
          col.width && WIDTH_CLASS[col.width],
        )}
      >
        {col.label}
      </TableHead>
    );
  }

  /** Builds the row, optional detail row, and default mapped cells for one record. */
  function renderTableRow(row: Row, i: number): JSX.Element {
    const id =
      typeof rowKey === "function"
        ? rowKey(row, i)
        : rowKey
          ? row[rowKey as keyof Row]
          : i;
    const key = typeof id === "string" || typeof id === "number" ? id : i;
    const rowDetail = detail?.(row, i);
    const rowCells: DataTableCell[] = [];
    for (const col of cols) {
      const value = row[col.key as keyof Row];
      const field = col.field?.(row, i);
      const content = field
        ? undefined
        : col.render
          ? col.render(row, i)
          : value === null || value === undefined
            ? "—"
            : String(value);
      rowCells.push({ ...col, field, content });
    }
    const rowContent = renderRow ? (
      renderRow(row, i)
    ) : (
      <DataTableRow
        rowProps={rowProps?.(row, i)}
        rowClassName={cn(
          pendingRowKey !== undefined && pendingRowKey === key && "opacity-60",
          rowClassName?.(row, i),
        )}
        emphasizeFirstColumn={emphasizeFirstCol}
        cells={rowCells}
      />
    );
    return (
      <Fragment key={key}>
        {rowContent}
        {rowDetail != null && (
          <TableRow>
            <TableCell colSpan={cols.length}>{rowDetail}</TableCell>
          </TableRow>
        )}
      </Fragment>
    );
  }

  const tableContent =
    variant === "editor" && rows.length === 0 && emptyState ? (
      <Empty
        title={emptyState.title}
        description={emptyState.description}
        variant="padded"
      />
    ) : (
      <Table
        className={cn(
          tableLayout === "fixed" && "table-fixed",
          tableWidth === "medium" && "min-w-[680px]",
          tableWidth === "wide" && "min-w-[52rem]",
          tableWidth === "wider" && "min-w-[78rem]",
        )}
      >
        <TableHeader>
          <TableRow>{cols.map(renderColHeader)}</TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(renderTableRow)}
          {variant !== "editor" && rows.length === 0 && emptyState && (
            <TableRow>
              <TableCell colSpan={cols.length} className="p-0">
                <Empty
                  title={emptyState.title}
                  description={emptyState.description}
                  variant="padded"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  return variant === "editor" ? (
    <div className="border-gray-6 overflow-x-auto border-t">{tableContent}</div>
  ) : (
    tableContent
  );
}

// DIRECTORY CARD
/**
 * Renders an entity directory from row and column data or wraps a custom interactive table.
 *
 * @param title - Title displayed in the directory card heading.
 * @param description - Supporting description displayed beneath the title.
 * @param header - Optional consumer-owned content above the table.
 * @param action - Optional action aligned with the card heading.
 * @param toolbar - Optional controls placed above the table content.
 * @param pagination - Optional pagination controls shown in the card footer.
 * @param add - Optional add action shown with pagination and save controls.
 * @param save - Optional save action; its presence enables the save button.
 * @param saving - Whether the save button should show its loading state.
 * @param footer - Optional consumer content placed in the card footer.
 * @param rows - Optional records used by the data-driven table renderer.
 * @param cols - Optional column definitions paired with `rows`.
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
 * @param children - Optional custom interactive table content used when row data is absent.
 *
 * @return A card containing the directory header and table content.
 */
export function DataTable<Row extends object = Record<string, unknown>>({
  title,
  description,
  header,
  action,
  toolbar,
  pagination,
  add,
  save,
  saving = false,
  footer,
  rows,
  columns: cols,
  rowKey,
  rowClassName,
  rowProps,
  renderRow,
  detail,
  variant,
  tableLayout,
  tableWidth,
  emptyState,
  emphasizeFirstColumn: emphasizeFirstCol,
  pendingRowKey,
  children,
}: {
  title: ReactNode;
  description: ReactNode;
  header?: ReactNode;
  action?: ReactNode;
  toolbar?: ReactNode;
  pagination?: ReactNode;
  add?: ReactNode;
  save?: () => void | Promise<void>;
  saving?: boolean;
  footer?: ReactNode;
  rows?: readonly Row[];
  columns?: readonly DataTableColumn<Row>[];
  rowKey?: string | ((row: Row, index: number) => Key);
  rowClassName?: (row: Row, index: number) => string | undefined;
  rowProps?: (
    row: Row,
    index: number,
  ) => Omit<ComponentProps<typeof TableRow>, "children" | "className" | "key">;
  renderRow?: (row: Row, index: number) => ReactNode;
  detail?: (row: Row, index: number) => ReactNode;
  variant?: "default" | "editor";
  tableLayout?: "auto" | "fixed";
  tableWidth?: "medium" | "wide" | "wider";
  emptyState?: { title: string; description?: string };
  emphasizeFirstColumn?: boolean;
  pendingRowKey?: Key | null;
  children?: ReactNode;
}): JSX.Element {
  const tableContent =
    rows && cols ? (
      <DataTableContent
        rows={rows}
        columns={cols}
        rowKey={rowKey}
        rowClassName={rowClassName}
        rowProps={rowProps}
        renderRow={renderRow}
        detail={detail}
        variant={variant}
        tableLayout={tableLayout}
        tableWidth={tableWidth}
        emptyState={emptyState}
        emphasizeFirstColumn={emphasizeFirstCol}
        pendingRowKey={pendingRowKey}
      />
    ) : (
      children
    );
  return (
    <Card variant="gray-outline" size="sm">
      <CardHeader topRight={action}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {header && <div className="px-3 pb-3">{header}</div>}
      {toolbar && <div className="px-3 pb-3">{toolbar}</div>}
      <CardContent className="pt-0">
        <div data-slot="data-table" className="border-gray-6 border-t">
          {tableContent}
        </div>
      </CardContent>
      {Boolean(pagination || add || save || footer) && (
        <CardFooter className="flex-wrap justify-between gap-3">
          <div className="flex items-center gap-2">{pagination}</div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {add}
            {footer}
            {save && (
              <Button
                variant="primary"
                size="sm"
                loading={saving}
                onClick={save}
              >
                Save
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
