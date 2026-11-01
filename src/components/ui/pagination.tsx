/**
 * astro/src/components/ui/pagination.tsx
 * https://ui.shadcn.com/docs/components/pagination
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from "@carbon/icons-react";
import { Button, ButtonLink } from "./button.js";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Renders the pagination component.
 *
 * @param className - Optional class name applied to the pagination element.
 * @param props - Additional pagination props forwarded to the primitive.
 * @return A labeled navigation container for page controls.
 */
const Pagination = ({
  className,
  ...props
}: React.ComponentProps<"nav">): React.JSX.Element => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

/**
 * Container wrapper for pagination list controls.
 *
 */
const PaginationContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref): React.JSX.Element => (
  <div
    ref={ref}
    className={cn("flex flex-row items-center gap-1 no-underline", className)}
    {...props}
  />
));

/**
 * Individual item button wrapper inside pagination navigation.
 *
 */
const PaginationItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, ...props }, ref): React.JSX.Element => (
  <Button
    variant="ghost"
    ref={ref}
    className={cn(
      "w-fit px-0 no-underline enabled:hover:bg-primary-3",
      className,
    )}
    {...props}
  />
));

/**
 * Renders the pagination link component.
 *
 * @param isActive - Whether the link represents the current page.
 * @param disabled - Whether the link should reject interaction.
 * @param size - Link size variant used by the pagination control.
 * @param onClick - Callback invoked when the link is selected.
 * @param props - Additional link props forwarded to the primitive.
 * @return A link styled and announced according to its page state.
 */
const PaginationLink = ({
  className,
  isActive,
  disabled,
  size = "icon",
  onClick,
  ...props
}: {
  isActive?: boolean;
  disabled?: boolean;
  size?: NonNullable<React.ComponentProps<typeof Button>["size"]>;
} & React.ComponentProps<"a">): React.JSX.Element => (
  <ButtonLink
    aria-current={isActive ? "page" : undefined}
    aria-disabled={disabled ? "true" : undefined}
    tabIndex={disabled ? -1 : undefined}
    variant={isActive ? "outline" : "ghost"}
    size={size}
    className={cn(
      "!no-underline",
      disabled && "pointer-events-none opacity-50",
      className,
    )}
    onClick={
      disabled
        ? (e) => {
            e.preventDefault();
          }
        : onClick
    }
    {...props}
  />
);

/**
 * Pagination previous.
 *
 * @param className - Optional class name applied to the pagination control.
 * @param props - Additional pagination props forwarded to the primitive.
 * @return A control that links to the previous page.
 */
const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>): React.JSX.Element => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5 !no-underline", className)}
    {...props}
  >
    <PrevIcon className="size-4" aria-hidden="true" />
    <span>Previous</span>
  </PaginationLink>
);

/**
 * Pagination next.
 *
 * @param className - Optional class name applied to the pagination control.
 * @param props - Additional pagination props forwarded to the primitive.
 * @return A control that links to the next page.
 */
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>): React.JSX.Element => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5 !no-underline", className)}
    {...props}
  >
    <span>Next</span>
    <NextIcon className="size-4" aria-hidden="true" />
  </PaginationLink>
);

PaginationContent.displayName = "PaginationContent";
PaginationItem.displayName = "PaginationItem";

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
