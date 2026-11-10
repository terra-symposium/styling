/**
 * src/components/ui/calendar.tsx
 * https://ui.shadcn.com/docs/components/calendar
 * @test dashboard.management.schedule.source-contracts
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { getDefaultClassNames } from "react-day-picker";

// COMPONENTS
import * as React from "react";
import { Button } from "./button.js";
import {
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@carbon/icons-react";
import { DayPicker } from "react-day-picker";

// TYPES
import type { ButtonVariantProps, CompactSize } from "./types.js";
import type { DayButton } from "react-day-picker";

/*//////////////////////////////////////////////////
INTERNAL HELPERS
//////////////////////////////////////////////////*/

/**
 * Computes the navigation button class name for the calendar.
 *
 * @param variant - Button variant used by the calendar navigation controls.
 *
 * @return The combined classes for the selected navigation button variant.
 *
 * @remarks
 * Centralising this keeps the nav controls visually consistent across size presets.
 */
function getNavButtonClassName(
  variant: ButtonVariantProps | undefined,
): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold",
    "ring-offset-primary-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "no-underline",
    variant === "default" &&
      "not-disabled:hover:bg-primary-10 bg-primary-9 text-white",
    variant === "tonal" &&
      "not-disabled:hover:bg-primary-4 border border-primary-6 bg-primary-3 text-primary-11",
    variant === "secondary" &&
      "not-disabled:hover:bg-secondary-4 border border-secondary-6 bg-secondary-3 text-secondary-11",
    variant === "destructive" &&
      "not-disabled:hover:bg-rose-600/90 border border-rose-700 bg-rose-600 text-white dark:border-rose-800 dark:bg-rose-900 dark:hover:bg-rose-900/90",
    variant === "outline" &&
      "not-disabled:hover:bg-primary-1 border border-primary-5 text-primary-12",
    variant === "ghost" && "enabled:hover:bg-primary-3",
    variant === "underline" && "p-0 enabled:hover:underline",
  );
}

/*//////////////////////////////////////////////////
COMPONENT
//////////////////////////////////////////////////*/

/**
 * React DayPicker wrapper with compact, fixed-width, and responsive layouts.
 * `size` scales calendar cells and text; `buttonVariant` styles month navigation.
 *
 * @param props - DayPicker settings, size, navigation variant, and class overrides.
 *
 * @return A styled calendar with a custom day button.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  // set 'sm' as the new default size
  size = "sm",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: ButtonVariantProps;
  size?: CompactSize | "responsive";
}): React.JSX.Element {
  // cache default class names from DayPicker (typed as a simple rec)
  const defaultClassNames: Record<string, string> = getDefaultClassNames();

  // LOGIC HELPERS
  // 'xs' is the only layout using compact nav buttons
  const isCompact = size === "xs";
  // 'responsive' is the only layout that fills its container
  const isResponsive = size === "responsive";
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      fixedWeeks
      className={cn(
        "group/calendar bg-white p-2 dark:bg-black",

        // CONDITIONAL BASE STYLING
        // set base text size based on the size prop
        (size === "xs" || size === "sm") && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        // responsive adds padding helpers and is full width
        isResponsive && "w-full text-base sm:p-3",

        // RTL STYLING
        String.raw`rtl:**:[.rdp-button_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn(isResponsive ? "w-full" : "w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months,
        ),
        month: cn(
          "flex w-full flex-col gap-4",
          !isCompact && "space-y-4", // 'xs' does not get space-y-4
          defaultClassNames.month,
        ),
        nav: cn(
          "absolute inset-x-0 top-0 z-10 flex w-full items-center justify-between gap-1",
          !isCompact && "space-x-1 py-1", // 'xs' does not get padding
          defaultClassNames.nav,
        ),
        button_previous: cn(
          getNavButtonClassName(buttonVariant),
          "select-none p-0 aria-disabled:opacity-50",
          // 'xs' uses larger buttons, others use smaller text-style buttons
          isCompact
            ? "size-8"
            : "ml-1 size-7 bg-transparent opacity-50 hover:opacity-100",
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          getNavButtonClassName(buttonVariant),
          "select-none p-0 aria-disabled:opacity-50",
          // 'xs' uses larger buttons, others use smaller text-style buttons
          isCompact
            ? "size-8"
            : "mr-1 size-7 bg-transparent opacity-50 hover:opacity-100",
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          "flex w-full items-center justify-center",
          !isCompact && "relative flex justify-center py-1",

          // CONDITIONAL CAPTION SIZING
          (size === "sm" || size === "xs" || isResponsive) && "text-lg",
          size === "md" && "text-xl",
          size === "lg" && "text-2xl",
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          "flex w-full items-center justify-center gap-1.5 font-medium", // inherits font size
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          "has-focus:border-primary-12 has-focus:ring-primary-12/50 has-focus:ring relative rounded-md border border-primary-6 shadow-sm",
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn(
          "absolute inset-0 bg-primary-1 opacity-0",
          defaultClassNames.dropdown,
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "" // inherits font size
            : "flex h-8 items-center gap-1 rounded-md pl-2 pr-1 [&>svg]:size-3.5 [&>svg]:text-primary-11",
          !isCompact && "", // inherits font size
          defaultClassNames.caption_label,
        ),
        table: cn(
          // Use custom table styling only; avoid relying on a `table`
          // key in DayPicker's internal classNames to keep this safe.
          "border-collapse",
          isResponsive && "w-full", // table is only full-width in responsive mode
          !isCompact && "space-y-1",
        ),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 select-none rounded-md font-normal text-primary-11",

          // CONDITIONAL WEEKDAY SIZING
          (size === "xs" || size === "sm" || isResponsive) && "text-[0.8rem]",
          size === "md" && "text-sm",
          size === "lg" && "text-base",
          defaultClassNames.weekday,
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "select-none",
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          "select-none text-primary-11",

          // CONDITIONAL WEEK NUMBER SIZING
          (size === "xs" || size === "sm" || isResponsive) && "text-[0.8rem]",
          size === "md" && "text-sm",
          size === "lg" && "text-base",
          defaultClassNames.week_number,
        ),
        day: cn(
          "group/day relative aspect-square select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",

          // CONDITIONAL CELL SIZING
          size === "xs" && "size-9",
          size === "sm" && "size-10",
          size === "md" && "size-12",
          size === "lg" && "size-14",
          isResponsive && "size-full", // 'responsive' cells fill available space
          !isCompact && "", // inherits font size
          defaultClassNames.day,
        ),

        // STATE STYLES
        range_start: cn(
          "rounded-l-md bg-primary-3",
          defaultClassNames.range_start,
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-primary-3", defaultClassNames.range_end),
        today: cn(
          "rounded-md bg-primary-3 text-primary-12 data-[selected=true]:rounded-none",
          defaultClassNames.today,
        ),
        outside: cn(
          "text-primary-11 aria-selected:text-primary-11",
          !isCompact && "opacity-50",
          defaultClassNames.outside,
        ),
        disabled: cn(
          "text-primary-11 opacity-50",
          !isCompact && "opacity-50",
          defaultClassNames.disabled,
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        /* Wrapper component for the DayPicker. */
        Root: ({ className: rootClassName, rootRef, ...rootProps }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(rootClassName)}
              {...rootProps}
            />
          );
        },
        /* Component for the chevron icons. */
        Chevron: ({
          className: chevronClassName,
          orientation,
          ...chevronProps
        }) => {
          if (orientation === "left")
            return (
              <ChevronLeftIcon
                className={cn("size-4", chevronClassName)}
                aria-hidden="true"
                {...chevronProps}
              />
            );
          if (orientation === "right")
            return (
              <ChevronRightIcon
                className={cn("size-4", chevronClassName)}
                aria-hidden="true"
                {...chevronProps}
              />
            );
          return (
            <ChevronDownIcon
              className={cn("size-4", chevronClassName)}
              aria-hidden="true"
              {...chevronProps}
            />
          );
        },
        // Use the custom styled day button defined below.
        DayButton: CalendarDayButton,
        /* Component for the week number. */
        WeekNumber: ({ children, ...weekNumberProps }) => {
          return (
            <td {...weekNumberProps}>
              <div className="flex size-full items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props}
    />
  );
}

/**
 * Custom day button that preserves DayPicker focus and selection state styling.
 *
 * @param props - Day data, modifiers, and button attributes supplied by DayPicker.
 *
 * @return A day button with DayPicker's keyboard and selection state.
 */
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>): React.JSX.Element {
  // create a ref to manually manage focus
  const ref = React.useRef<HTMLButtonElement>(null);
  // ensures the focused day is programmatically focused
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}

      // DATA ATTRIBUTES FOR STYLING
      // handle a single selected day
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      // handle range selection
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-active={modifiers.active}
      className={cn(
        "flex aspect-square h-auto w-full flex-col gap-1 font-normal leading-none",

        // STYLING BASED ON DATA ATTRIBUTES
        "data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md",
        "data-[range-end=true]:bg-primary-11 data-[range-middle=true]:bg-primary-3 data-[range-start=true]:bg-primary-11",
        "data-[selected-single=true]:bg-primary-11",
        "data-[range-end=true]:text-primary-1 data-[range-middle=true]:text-primary-12 data-[range-start=true]:text-primary-1",
        "data-[selected-single=true]:text-primary-1",
        // active styling (dot underneath)
        "data-[active=true]:relative data-[active=true]:bg-secondary-3 data-[active=true]:font-semibold data-[active=true]:text-secondary-12",
        "data-[active=true]:hover:bg-secondary-4 data-[active=true]:hover:text-secondary-12",
        "data-[active=true]:data-[selected-single=true]:bg-primary-11 data-[active=true]:data-[selected-single=true]:text-primary-1",
        "data-[active=true]:data-[selected-single=true]:hover:bg-primary-12 data-[active=true]:data-[selected-single=true]:hover:text-primary-1",
        "data-[active=true]:after:absolute data-[active=true]:after:bottom-[6px] data-[active=true]:after:left-1/2 data-[active=true]:after:-translate-x-1/2 data-[active=true]:after:text-[1rem] data-[active=true]:after:text-secondary-8 data-[active=true]:after:content-['•']",
        // focus ring
        "group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring",
        // custom styles for day content (e.g., dot indicators)
        "[&>span]:text-xs [&>span]:opacity-70",
        /* a variable for default class names */ getDefaultClassNames().day,
        className,
      )}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";
CalendarDayButton.displayName = "CalendarDayButton";
export { Calendar };
