/**
 * src/components/ui/table.tsx
 * https://ui.shadcn.com/docs/components/table
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Table container primitive.
 *
 */
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref): React.JSX.Element => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom rounded border-primary-6 text-sm",
        className,
      )}
      {...props}
    />
  </div>
));

/**
 * Table header primitive (`<thead>`).
 *
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref): React.JSX.Element => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));

/**
 * Table body primitive (`<tbody>`).
 *
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref): React.JSX.Element => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));

/**
 * Table footer primitive (`<tfoot>`).
 *
 */
const TableFooter = Object.assign(
  React.forwardRef<
    HTMLTableSectionElement,
    React.HTMLAttributes<HTMLTableSectionElement>
  >(({ className, ...props }, ref): React.JSX.Element => (
    <tfoot
      ref={ref}
      className={cn(
        "border-t bg-gray-100/50 font-medium dark:bg-gray-800/50 [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  )),
  { displayName: "TableFooter" },
);

/**
 * Table row primitive (`<tr>`).
 *
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref): React.JSX.Element => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-primary-6",
      // interactivity
      "transition-colors hover:bg-primary-2 data-[state=selected]:bg-primary-2",
      className,
    )}
    {...props}
  />
));

/**
 * Table header cell primitive (`<th>`).
 *
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref): React.JSX.Element => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-primary-11 [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));

/**
 * Table cell primitive (`<td>`).
 *
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref): React.JSX.Element => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle print:p-2 [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));

/**
 * Table caption primitive (`<caption>`).
 *
 */
const TableCaption = Object.assign(
  React.forwardRef<
    HTMLTableCaptionElement,
    React.HTMLAttributes<HTMLTableCaptionElement>
  >(({ className, ...props }, ref): React.JSX.Element => (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-gray-500 dark:text-gray-400", className)}
      {...props}
    />
  )),
  { displayName: "TableCaption" },
);
Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableRow.displayName = "TableRow";
TableHead.displayName = "TableHead";
TableCell.displayName = "TableCell";
export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
  TableCaption,
};
