/**
 * src/components/ui/command.tsx
 * https://ui.shadcn.com/docs/components/command
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import {
  CloseLarge as CloseIcon,
  Search as SearchIcon,
} from "@carbon/icons-react";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog, DialogContent } from "./dialog.js";

// TYPES
import type { CommandDialogProps, CommandInputProps } from "./types.js";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Root command palette container.
 */
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref): React.JSX.Element => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex size-full flex-col overflow-hidden rounded-md bg-white text-primary-12 dark:bg-black",
      className,
    )}
    {...props}
  />
));

/**
 * Command dialog.
 *
 * @param children - Command content rendered inside the control.
 * @param size - Command size variant used by the control.
 * @param props - Additional command props forwarded to the primitive.
 * @return A command palette displayed inside the shared dialog primitive.
 */
const CommandDialog = ({
  className,
  children,
  size,
  ...props
}: CommandDialogProps): React.JSX.Element => {
  return (
    <Dialog {...props}>
      <DialogContent
        closeClassName="top-4"
        className={cn(
          "overflow-hidden p-0 shadow-lg [&_[cmdk-list-sizer]]:w-full",
          className,
        )}
        size={size}
      >
        <Command
          className={cn(
            // group heading
            "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-primary-12",
            // group
            "[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2",
            // input wrapper
            "[&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12",
            // item
            "[&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5",
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Command input control with optional clear button.
 */
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, onClear, ...props }, ref): React.JSX.Element => {
  const canClear = Boolean(props.value && onClear);
  return (
    <div
      className={cn("relative flex items-center px-3", className)}
      cmdk-input-wrapper=""
    >
      <SearchIcon
        className="mr-2 size-4 shrink-0 opacity-50"
        aria-hidden="true"
      />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "flex w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-primary-11 disabled:cursor-not-allowed disabled:opacity-50",
          "ring-0 focus:ring-0 focus-visible:ring-0",
          canClear && "pr-8",
        )}
        {...props}
      />
      {canClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 rounded-full p-1 text-primary-11 hover:bg-primary-5 hover:text-primary-12 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-9"
          aria-label="Clear search query"
        >
          <CloseIcon className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
});

/**
 * Scrollable list container for command items.
 */
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref): React.JSX.Element => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      "max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden",
      className,
    )}
    {...props}
  />
));

/**
 * Empty state indicator for command list when no results match.
 */
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref): React.JSX.Element => (
  <CommandPrimitive.Empty
    ref={ref}
    className="w-full py-6 text-center text-sm"
    {...props}
  />
));

/**
 * Group container for related command items with an optional header.
 */
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref): React.JSX.Element => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-primary-12",
      "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-primary-11",
      className,
    )}
    {...props}
  />
));

/**
 * Visual separator line between command groups or items.
 */
const CommandSeparator = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof CommandPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
  >(({ className, ...props }, ref): React.JSX.Element => (
    <CommandPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 h-px bg-primary-6", className)}
      {...props}
    />
  )),
  { displayName: CommandPrimitive.Separator.displayName },
);

/**
 * Individual selectable item within a command list.
 */
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref): React.JSX.Element => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      "data-[selected='true']:bg-primary-3",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className,
    )}
    {...props}
  />
));

/**
 * Command shortcut indicator text.
 *
 */
const CommandShortcut = Object.assign(
  ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLSpanElement>): React.JSX.Element => {
    return (
      <span
        className={cn(
          "ml-auto text-xs tracking-widest text-primary-10",
          className,
        )}
        {...props}
      />
    );
  },
  { displayName: "CommandShortcut" },
);

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Renders the generic empty state for search surfaces.
 *
 * @param props - Search term shown in the no-results message.
 *
 * @return Accessible empty-results message with guidance for the user.
 */
export function SearchEmpty({ query }: { query: string }): React.JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary-3/30 text-primary-11">
        <SearchIcon className="size-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-primary-12">No results found</h3>
      <p className="mt-2 text-sm text-primary-10">
        {query ? (
          <>
            We couldn&apos;t find anything matching{" "}
            <span className="font-semibold text-primary-11">
              &ldquo;{query}&rdquo;
            </span>
            .
          </>
        ) : (
          "Try another search term."
        )}
      </p>
      <p className="mt-4 text-xs text-primary-10">
        Check the spelling or try a broader term.
      </p>
    </div>
  );
}

/**
 * Searchable command dialog with a shared empty-results fallback.
 *
 * @return Command dialog with its header, input, toolbar, and result list.
 */
function SearchDialog({
  header,
  input,
  toolbar,
  listClassName,
  fallback,
  loading,
  children,
  ...props
}: /* Props accepted by a search dialog props. */
Omit<CommandDialogProps, "children"> & {
  header?: React.ReactNode;
  input: CommandInputProps;
  toolbar?: React.ReactNode;
  listClassName?: string;
  fallback?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <CommandDialog {...props}>
      {header}
      <CommandInput {...input} />
      {toolbar}
      <CommandList className={listClassName}>
        {!loading && (
          <CommandEmpty>
            {fallback ?? <SearchEmpty query={input.value ?? ""} />}
          </CommandEmpty>
        )}
        {children}
      </CommandList>
    </CommandDialog>
  );
}
Command.displayName = CommandPrimitive.displayName;
CommandDialog.displayName = "CommandDialog";
SearchDialog.displayName = "SearchDialog";
CommandInput.displayName = CommandPrimitive.Input.displayName;
CommandList.displayName = CommandPrimitive.List.displayName;
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;
CommandGroup.displayName = CommandPrimitive.Group.displayName;
CommandItem.displayName = CommandPrimitive.Item.displayName;
export {
  Command,
  CommandDialog,
  SearchDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandItem,
  CommandShortcut,
};
