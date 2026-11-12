/**
 * src/components/ui/pagination.tsx
 * https://ui.shadcn.com/docs/components/pagination
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import { Button, ButtonLink } from "./button.js";
import {
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from "@carbon/icons-react";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Renders the pagination component.
 *
 * @param attributes - Remaining navigation attributes forwarded to the element.
 * @param className - Optional class name applied to the pagination element.
 *
 * @return A labeled navigation container for page controls.
 */
function Pagination({
  className,
  ...attributes
}: React.ComponentProps<"nav">): React.JSX.Element {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...attributes}
    />
  );
}

/** Renders a horizontally arranged list of pagination controls.
 * @param attributes - Div attributes and optional class name.
 * @param ref - Forwarded reference to the list container.
 * @return The pagination control list container.
 */
function PaginationContentRender(
  attributes: React.ComponentProps<"div">,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, ...otherAttributes } = attributes;
  return (
    <div
      ref={ref}
      className={cn("flex flex-row items-center gap-1 no-underline", className)}
      {...otherAttributes}
    />
  );
}

const PaginationContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(PaginationContentRender);

/** Renders one pagination action using the shared ghost button styles.
 * @param attributes - Button props and optional class name.
 * @param ref - Forwarded reference to the action button.
 * @return The styled pagination action button.
 */
function PaginationItemRender(
  attributes: React.ComponentProps<typeof Button>,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.JSX.Element {
  const { className, ...otherAttributes } = attributes;
  return (
    <Button
      variant="ghost"
      ref={ref}
      className={cn(
        "w-fit px-0 no-underline enabled:hover:bg-primary-3",
        className,
      )}
      {...otherAttributes}
    />
  );
}

const PaginationItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(PaginationItemRender);

/**
 * Renders the pagination link component.
 *
 * @param attributes - Remaining anchor attributes forwarded to the primitive.
 * @param className - Additional classes for the pagination link.
 * @param isActive - Whether the link represents the current page.
 * @param disabled - Whether the link should reject interaction.
 * @param size - Link size variant used by the pagination control.
 * @param onClick - Callback invoked when the link is selected.
 *
 * @return A link styled and announced according to its page state.
 */
function PaginationLink({
  className,
  isActive,
  disabled,
  size = "icon",
  onClick,
  ...attributes
}: {
  isActive?: boolean;
  disabled?: boolean;
  size?: NonNullable<React.ComponentProps<typeof Button>["size"]>;
} & React.ComponentProps<"a">): React.JSX.Element {
  /** Prevents navigation when a page link is disabled. */
  function preventDisabledPaginationNavigation(
    event: React.MouseEvent<HTMLAnchorElement>,
  ): void {
    event.preventDefault();
  }
  return (
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
      onClick={disabled ? preventDisabledPaginationNavigation : onClick}
      {...attributes}
    />
  );
}

/**
 * Pagination previous.
 *
 * @param attributes - Remaining link props forwarded to the pagination link.
 * @param className - Optional class name applied to the pagination control.
 *
 * @return A control that links to the previous page.
 */
function PaginationPrevious({
  className,
  ...attributes
}: React.ComponentProps<typeof PaginationLink>): React.JSX.Element {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5 !no-underline", className)}
      {...attributes}
    >
      <PrevIcon className="size-4" aria-hidden="true" />
      <span>Previous</span>
    </PaginationLink>
  );
}

/**
 * Pagination next.
 *
 * @param attributes - Remaining link props forwarded to the pagination link.
 * @param className - Optional class name applied to the pagination control.
 *
 * @return A control that links to the next page.
 */
function PaginationNext({
  className,
  ...attributes
}: React.ComponentProps<typeof PaginationLink>): React.JSX.Element {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5 !no-underline", className)}
      {...attributes}
    >
      <span>Next</span>
      <NextIcon className="size-4" aria-hidden="true" />
    </PaginationLink>
  );
}
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
