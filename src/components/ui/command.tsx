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
/** Renders the command primitive with the shared base surface classes.
 *
 * @param commandProps Properties forwarded to the command primitive.
 * @param ref Forwarded command element ref.
 *
 * @return The command primitive with shared classes applied.
 */
function renderCommandRoot(
  commandProps: React.ComponentPropsWithoutRef<typeof CommandPrimitive>,
  ref: React.ForwardedRef<React.ElementRef<typeof CommandPrimitive>>,
): React.JSX.Element {
  const { className, ...rest } = commandProps;
  return (
    <CommandPrimitive
      ref={ref}
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-md bg-white text-primary-12 dark:bg-black",
        className,
      )}
      {...rest}
    />
  );
}
const Command = React.forwardRef(renderCommandRoot);

/**
 * Command dialog.
 *
 * @param className Optional classes applied to the dialog content.
 * @param children - Command content rendered inside the control.
 * @param size - Command size variant used by the control.
 * @param dialogProps Remaining Radix dialog properties forwarded to the root.
 *
 * @return A command palette displayed inside the shared dialog primitive.
 */
function CommandDialog({
  className,
  children,
  size,
  ...dialogProps
}: CommandDialogProps): React.JSX.Element {
  return (
    <Dialog {...dialogProps}>
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
}

/**
 * Command input control with optional clear button.
 */
/** Renders a command search input and its optional clear control.
 *
 * @param inputProps Command input attributes and optional clear handler.
 * @param ref Forwarded input element ref.
 *
 * @return A search input with its leading icon and conditional clear button.
 */
function renderCommandInput(
  inputProps: CommandInputProps,
  ref: React.ForwardedRef<React.ElementRef<typeof CommandPrimitive.Input>>,
): React.JSX.Element {
  const { className, onClear, ...primitiveProps } = inputProps;
  const canClear = Boolean(primitiveProps.value && onClear);
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
        {...primitiveProps}
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
}
const CommandInput = React.forwardRef(renderCommandInput);

/**
 * Scrollable list container for command items.
 */
/** Renders the scrollable list area inside a command palette.
 *
 * @param listProps Properties forwarded to the command list primitive.
 * @param ref Forwarded list element ref.
 *
 * @return The command list primitive with constrained scrolling.
 */
function renderCommandList(
  listProps: React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>,
  ref: React.ForwardedRef<React.ElementRef<typeof CommandPrimitive.List>>,
): React.JSX.Element {
  const { className, ...rest } = listProps;
  return (
    <CommandPrimitive.List
      ref={ref}
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden",
        className,
      )}
      {...rest}
    />
  );
}
const CommandList = React.forwardRef(renderCommandList);

/**
 * Empty state indicator for command list when no results match.
 */
/** Renders the empty-results indicator inside a command list.
 *
 * @param emptyProps Properties forwarded to the empty-results primitive.
 * @param ref Forwarded empty-state element ref.
 *
 * @return The empty-results primitive with shared spacing.
 */
function renderCommandEmpty(
  emptyProps: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>,
  ref: React.ForwardedRef<React.ElementRef<typeof CommandPrimitive.Empty>>,
): React.JSX.Element {
  return (
    <CommandPrimitive.Empty
      ref={ref}
      className="w-full py-6 text-center text-sm"
      {...emptyProps}
    />
  );
}
const CommandEmpty = React.forwardRef(renderCommandEmpty);

/**
 * Group container for related command items with an optional header.
 */
/** Renders a grouped set of command options with shared heading styles.
 *
 * @param groupProps Properties forwarded to the command group primitive.
 * @param ref Forwarded group element ref.
 *
 * @return The command group primitive with shared heading styles.
 */
function renderCommandGroup(
  groupProps: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>,
  ref: React.ForwardedRef<React.ElementRef<typeof CommandPrimitive.Group>>,
): React.JSX.Element {
  const { className, ...rest } = groupProps;
  return (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        "overflow-hidden p-1 text-primary-12",
        "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-primary-11",
        className,
      )}
      {...rest}
    />
  );
}
const CommandGroup = React.forwardRef(renderCommandGroup);

/**
 * Visual separator line between command groups or items.
 */
/** Renders a styled separator between command groups or items.
 *
 * @param separatorProps Properties forwarded to the separator primitive.
 * @param ref Forwarded separator element ref.
 *
 * @return The separator primitive with shared divider styling.
 */
function renderCommandSeparator(
  separatorProps: React.ComponentPropsWithoutRef<
    typeof CommandPrimitive.Separator
  >,
  ref: React.ForwardedRef<React.ElementRef<typeof CommandPrimitive.Separator>>,
): React.JSX.Element {
  const { className, ...rest } = separatorProps;
  return (
    <CommandPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 h-px bg-primary-6", className)}
      {...rest}
    />
  );
}
const CommandSeparator = Object.assign(
  React.forwardRef(renderCommandSeparator),
  { displayName: CommandPrimitive.Separator.displayName },
);

/**
 * Individual selectable item within a command list.
 */
/** Renders one selectable command option with shared selection styling.
 *
 * @param itemProps Properties forwarded to the item primitive.
 * @param ref Forwarded item element ref.
 *
 * @return The command item primitive with shared selection styling.
 */
function renderCommandItem(
  itemProps: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>,
  ref: React.ForwardedRef<React.ElementRef<typeof CommandPrimitive.Item>>,
): React.JSX.Element {
  const { className, ...rest } = itemProps;
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "data-[selected='true']:bg-primary-3",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...rest}
    />
  );
}
const CommandItem = React.forwardRef(renderCommandItem);

/**
 * Command shortcut indicator text.
 *
 */
/** Renders secondary shortcut text at the end of a command item.
 *
 * @param className Optional classes applied to the shortcut text.
 * @param spanProps Remaining span attributes.
 *
 * @return The styled shortcut text span.
 */
function CommandShortcut({
  className,
  ...spanProps
}: React.HTMLAttributes<HTMLSpanElement>): React.JSX.Element {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-primary-10",
        className,
      )}
      {...spanProps}
    />
  );
}
CommandShortcut.displayName = "CommandShortcut";

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Renders the generic empty state for search surfaces.
 *
 * @param query Search term shown in the no-results message.
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
 * @param header Optional content above the command input.
 * @param input Search-input properties and controlled value.
 * @param toolbar Optional content between the input and result list.
 * @param listClassName Optional classes applied to the results list.
 * @param fallback Custom empty-state content, defaulting to SearchEmpty.
 * @param loading Hides the empty-state message while results are loading.
 * @param children Result groups and command options.
 * @param dialogProps Remaining dialog properties forwarded to CommandDialog.
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
  ...dialogProps
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
    <CommandDialog {...dialogProps}>
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
