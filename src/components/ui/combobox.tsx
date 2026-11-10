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

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Renders a searchable option picker with optional custom option rendering.
 *
 * @param props - Combobox configuration, options, and selection callbacks.
 *
 * @return The combobox control and its option list.
 */
export function Combobox({
  opts,
  label: noun = { value: "item", plural: "items" },
  className,
  defaultValue,
  value: valueProp,
  onValueChange = () => {},
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
      ? (opts?.find((o) => o.value === valueProp) ?? null)
      : /* Ignore internal values that no longer have a matching option. */ (opts?.find(
          (o) => o.value === internalValue,
        ) ?? null);
  // Report an empty selection only when the selection changes to empty.
  const prevSelection = React.useRef(sel);
  // effect necessary to avoid violating rules of hooks
  React.useEffect(() => {
    if (sel === null && sel !== prevSelection.current) onValueChange(null);
    prevSelection.current = sel;
  }, [sel, onValueChange]);

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
            onClear={() => {
              onSearchChange?.("");
            }}
          />
          <CommandList>
            <CommandEmpty>
              {emptyMessage ?? `No ${noun.plural} found`}
            </CommandEmpty>
            <CommandGroup>
              {opts?.map((opt) => (
                <CommandItem
                  className="gap-0"
                  key={opt.value}
                  value={opt.value}
                  keywords={[transformChildrenToString(opt.label)]}
                  onSelect={(v) => {
                    // Selecting the current option again clears the selection.
                    onValueChange(v === sel?.value ? null : v);
                    setInternalValue(v === sel?.value ? null : v);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 size-4",
                      sel?.value === opt.value ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden="true"
                  />
                  {/* Use custom renderer if provided, otherwise default to label */}
                  {renderOption ? renderOption(opt) : opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
Combobox.displayName = "Combobox";
