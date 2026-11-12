/**
 * src/components/ui/combobox.tsx
 * https://ui.shadcn.com/docs/components/combobox
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn, transformChildrenToString } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import { Button } from "./button.js";
import {
  Checkmark as CheckIcon,
  ChevronSort as ToggleIcon,
} from "@carbon/icons-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

// TYPES
import type { UiButtonButtonProps, UiComboboxOption } from "./types.js";

/** Supplies a no-op default when the caller does not observe selection changes. */
function ignoreValueChange(): void {}

/** Finds the option matching a value, returning null when the value is stale.
 *
 * @param options Options available in the combobox.
 * @param value Value to resolve against the option list.
 *
 * @return The matching option, or null when no option has that value.
 */
function findOption(
  options: readonly UiComboboxOption[],
  value: string | null | undefined,
): UiComboboxOption | null {
  for (const option of options) {
    if (option.value === value) return option;
  }
  return null;
}

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Renders a searchable option picker with optional custom option rendering.
 *
 * @param opts Options to display in the searchable list.
 * @param noun Singular and plural labels used by placeholders and empty states.
 * @param className Optional classes applied to the trigger button.
 * @param defaultValue Initial option value when uncontrolled.
 * @param valueProp Controlled option value.
 * @param onValueChange Called when selection changes or is cleared.
 * @param search Controlled search query.
 * @param onSearchChange Called when the search query changes.
 * @param emptyMessage Content displayed when no options match.
 * @param renderOption Optional custom option content renderer.
 * @param placeholder Text displayed in the trigger when no option is selected.
 * @param attrs Remaining properties forwarded to the trigger button.
 *
 * @return The combobox control and its option list.
 */
export function Combobox({
  opts,
  label: noun = { value: "item", plural: "items" },
  className,
  defaultValue,
  value: valueProp,
  onValueChange = ignoreValueChange,
  // de-structure new props so they aren't passed to <Button>
  search,
  onSearchChange,
  emptyMessage,
  renderOption,
  placeholder,
  ...attrs // These remaining props are button attributes after combobox options are removed.
}: UiButtonButtonProps & {
  opts: UiComboboxOption[];
  label?: { value: string; plural: string };
  defaultValue?: string;
  onValueChange?: (val: string | null) => void;
  value?: string;
  search?: string;
  onSearchChange?: (search: string) => void;
  emptyMessage?: React.ReactNode;
  renderOption?: (option: UiComboboxOption) => React.ReactNode;
  placeholder?: string;
}): React.JSX.Element {
  // STATES
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<
    string | null | undefined
  >(defaultValue);

  /** Selected option from the controlled value or internal selection. */
  // A controlled value never falls back to the internal selection.
  const sel =
    valueProp !== undefined
      ? findOption(opts, valueProp)
      : findOption(opts, internalValue);
  // Report an empty selection only when the selection changes to empty.
  const prevSelection = React.useRef(sel);
  // effect necessary to avoid violating rules of hooks
  /** Reports a transition to no selection once and records the current choice. */
  function reportClearedSelection(): void {
    if (sel === null && sel !== prevSelection.current) onValueChange(null);
    prevSelection.current = sel;
  }
  React.useEffect(reportClearedSelection, [sel, onValueChange]);
  /** Clears the controlled search query when the command input is reset. */
  function handleSearchClear(): void {
    onSearchChange?.("");
  }
  /** Updates selection and closes the option list after activation. */
  function handleOptionSelect(nextValue: string): void {
    const nextSelection = nextValue === sel?.value ? null : nextValue;
    onValueChange(nextSelection);
    setInternalValue(nextSelection);
    setOpen(false);
  }
  /** Renders one selectable option and marks the current selection. */
  function renderOptionItem(option: UiComboboxOption): React.JSX.Element {
    return (
      <CommandItem
        className="gap-0"
        key={option.value}
        value={option.value}
        keywords={[transformChildrenToString(option.label)]}
        onSelect={handleOptionSelect}
      >
        <CheckIcon
          className={cn(
            "mr-2 size-4",
            sel?.value === option.value ? "opacity-100" : "opacity-0",
          )}
          aria-hidden="true"
        />
        {renderOption ? renderOption(option) : option.label}
      </CommandItem>
    );
  }

  // RENDER
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="dialog"
          className={cn(
            "w-[200px] justify-between bg-white font-normal dark:bg-black",
            className,
          )}
          {...attrs}
        >
          <span className="truncate">
            {/* Use placeholder if provided and no selection */}
            {sel?.label ?? placeholder ?? `Select ${noun.value}...`}
          </span>
          <ToggleIcon
            className="-mr-1 ml-2 size-4 shrink-0 opacity-50"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="pointer-events-auto w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${noun.plural}...`}
            className="focus:ring-0"
            value={search} // Use controlled search value
            onValueChange={onSearchChange} // Use controlled search callback
            onClear={handleSearchClear}
          />
          <CommandList>
            <CommandEmpty>
              {emptyMessage ?? `No ${noun.plural} found`}
            </CommandEmpty>
            <CommandGroup>{opts?.map(renderOptionItem)}</CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
Combobox.displayName = "Combobox";
