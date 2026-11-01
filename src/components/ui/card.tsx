/**
 * astro/src/components/ui/card.tsx
 * https://ui.shadcn.com/docs/components/card
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { cva } from "class-variance-authority";

// COMPONENTS
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronDown } from "@carbon/icons-react";
import { Button } from "./button.js";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible.js";
import { Hint } from "./hint.js";

// DATA
import { SURFACE_VARIANTS } from "./variants.js";

// TYPES
import type { AnchorCardProps, CardProps, CardSummaryProps } from "./types.js";

/*//////////////////////////////////////////////////
VARIANTS
//////////////////////////////////////////////////*/

const CARD_SIZE_CTX = React.createContext<NonNullable<CardProps["size"]>>("md");
CARD_SIZE_CTX.displayName = "CardSizeContext";
const cardPadding = {
  xs: "p-1.5 pt-1",
  sm: "p-3 pt-2",
  md: "p-6 pt-4",
  lg: "p-8 pt-6",
  xl: "p-10 pt-8",
} as const;
const cardBodyText = {
  xs: "text-sm",
  sm: "text-base",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
} as const;
const CARD_SUMMARY_VARIANTS: Record<
  NonNullable<CardSummaryProps["variant"]>,
  {
    buttonVariant: NonNullable<CardSummaryProps["buttonVariant"]>;
    className: string;
  }
> = {
  default: { buttonVariant: "gray-ghost", className: "rounded-none" },
  surface: { buttonVariant: "gray-tonal", className: "rounded-lg" },
  bordered: { buttonVariant: "gray-outline", className: "rounded-lg" },
  section: {
    buttonVariant: "gray-ghost",
    className: "rounded-none border-b border-gray-6 font-bold",
  },
  card: { buttonVariant: "gray-outline", className: "rounded-xl shadow-sm" },
  compact: {
    buttonVariant: "gray-tonal",
    className: "rounded-md px-3 py-2 text-xs font-bold",
  },
  accordion: {
    buttonVariant: "gray-tonal",
    className: "rounded-lg font-semibold",
  },
  accordionMuted: {
    buttonVariant: "gray-ghost",
    className: "rounded-lg bg-gray-2/70",
  },
  pill: { buttonVariant: "gray-tonal", className: "rounded-full" },
  tiny: {
    buttonVariant: "gray-ghost",
    className: "h-auto w-full justify-start rounded-none px-0 py-1 text-xs",
  },
};

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Card container component.
 *
 * Renders a `<div>` by default, and upgrades to an `<a>` element when an
 * `href` is supplied.
 */
const Card = React.forwardRef<HTMLDivElement | HTMLAnchorElement, CardProps>(
  (props, ref): React.JSX.Element => {
    const {
      children,
      className,
      variant = "primary-tonal",
      size = "md",
      inverse,
      disabled,
      printed = true,
      interactive: interactiveProp,
      asChild = false,
      collapsible = false,
      disclosureVariant = "card",
      defaultOpen,
      open,
      onOpenChange,
      ...rest
    } = props;
    const cardSize = size ?? "md";
    const isAnchor = "href" in props;
    const content = React.Children.toArray(children);
    const summaryElement = collapsible ? content.shift() : undefined;
    const summary = React.isValidElement<CardSummaryProps>(summaryElement)
      ? summaryElement
      : null;
    if (collapsible && (!summary || summary.type !== CardSummary))
      throw new Error(
        "A collapsible Card requires CardSummary as its first child",
      );
    const childProps = React.isValidElement(content[0])
      ? (content[0].props as {
          href?: string;
          onClick?: unknown;
          role?: string;
          tabIndex?: number;
        })
      : undefined;
    const interactive =
      interactiveProp ??
      (typeof props.onClick === "function" ||
        props.role === "button" ||
        props.role === "link" ||
        props.tabIndex !== undefined ||
        Boolean(
          asChild &&
          childProps &&
          (childProps.href !== undefined ||
            typeof childProps.onClick === "function" ||
            childProps.role === "button" ||
            childProps.role === "link" ||
            childProps.tabIndex !== undefined),
        ));
    const {
      variant: summaryVariant = "default",
      buttonVariant: summaryButtonVariant,
      size: summarySize = "md",
      className: summaryClassName,
      children: summaryChildren,
      ...triggerProps
    } = summary?.props ?? {};
    const summaryIconOnly =
      summarySize.startsWith("icon-") || summarySize === "icon";
    const Comp: React.ElementType = asChild ? Slot : isAnchor ? "a" : "div";
    const classes = cn(
      cva(
        // Base styles for the card container
        "block w-full overflow-auto rounded-lg border shadow-sm transition duration-100",
        {
          variants: {
            // Defines the card scale.
            size: {
              xs: "rounded-md",
              sm: "rounded-lg",
              md: "rounded-xl",
              lg: "rounded-2xl",
              xl: "rounded-3xl",
            },
            // Toggles an inner shadow
            inverse: { true: "shadow-inner" },
            // Adds hover effects when the card is a link
            interactive: {
              true: "duration-75 hover:-translate-y-0.5 hover:shadow-md",
            },
            // Applies the standard document-print treatment.
            printed: {
              true: "print:rounded-xl print:border-2 print:bg-primary-1 print:text-primary-11 print:shadow-none",
            },
            // Applies disabled styles
            disabled: {
              true: "border-gray-6 bg-gray-1 text-gray-12/50 opacity-50",
            },
          },
          defaultVariants: { size: "md", printed: true },
        },
      )({
        size: cardSize,
        inverse,
        disabled,
        interactive: isAnchor ? !disabled : interactive,
        printed,
      }),
      SURFACE_VARIANTS({ variant }),
      className,
    );
    const card = (
      <Comp
        data-slot="card"
        data-variant={variant}
        data-interactive={interactive || undefined}
        data-size={cardSize}
        ref={ref as React.Ref<HTMLDivElement & HTMLAnchorElement>}
        className={classes}
        {...(isAnchor && !asChild
          ? { href: (props as AnchorCardProps).href }
          : {})}
        {...(rest as React.HTMLAttributes<HTMLDivElement>)}
      >
        {collapsible && summary ? (
          <>
            <CollapsibleTrigger asChild>
              <Button
                {...triggerProps}
                type="button"
                variant={
                  summaryButtonVariant ??
                  CARD_SUMMARY_VARIANTS[summaryVariant].buttonVariant
                }
                size={summarySize}
                className={cn(
                  !summaryIconOnly &&
                    "group/collapsible-trigger h-auto w-full justify-between rounded-none border-0 px-(--card-spacing) py-(--card-spacing) text-left whitespace-normal",
                  CARD_SUMMARY_VARIANTS[summaryVariant].className,
                  summaryClassName,
                )}
              >
                <span className="min-w-0 flex-1">{summaryChildren}</span>
                {!summaryIconOnly && (
                  <ChevronDown
                    aria-hidden="true"
                    className="text-primary-10 size-4 shrink-0 transition-transform group-aria-expanded/collapsible-trigger:rotate-180"
                  />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent data-slot="card-content-collapse">
              {content}
            </CollapsibleContent>
          </>
        ) : (
          children
        )}
      </Comp>
    );
    return (
      <CARD_SIZE_CTX.Provider value={cardSize}>
        {collapsible ? (
          <Collapsible
            open={open}
            defaultOpen={defaultOpen}
            onOpenChange={onOpenChange}
            data-slot="card-collapsible"
            data-disclosure-variant={disclosureVariant}
          >
            {card}
          </Collapsible>
        ) : (
          card
        )}
      </CARD_SIZE_CTX.Provider>
    );
  },
);

/**
 * Marker child whose props configure the collapsible summary rendered by `Card`.
 *
 * @param _props - Summary label and presentation options consumed by `Card`.
 * @return `null`; the parent card renders the configured summary.
 */
function CardSummary(_props: CardSummaryProps): null {
  return null;
}

// HEADER
/**
 * Card header section component.
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    topRight?: React.ReactNode;
    variant?: "default" | "section";
  }
>(
  (
    { className, topRight, variant = "default", children, ...props },
    ref,
  ): React.JSX.Element => {
    return (
      <div
        data-slot="card-header"
        ref={ref}
        className={cn(
          "group/card-header @container/card-header grid auto-rows-min grid-cols-1 items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
          "flex flex-col space-y-1.5",
          topRight && "flex-row flex-wrap items-center justify-between gap-2",
          variant === "section" &&
            "border-primary-4 border-b py-(--card-spacing)",
          cardPadding[React.useContext(CARD_SIZE_CTX)],
          className,
        )}
        {...props}
      >
        {topRight ? <div>{children}</div> : children}
        {topRight}
      </div>
    );
  },
);

// TITLE
/**
 * Primary title heading within a card header.
 */
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { tooltip?: React.ReactNode }
>(({ className, tooltip, children, ...props }, ref): React.JSX.Element => {
  const title = (
    <h3
      data-slot="card-title"
      ref={ref}
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        cardBodyText[React.useContext(CARD_SIZE_CTX)],
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
  return tooltip ? (
    <Hint content={tooltip} disabledTrigger>
      {title}
    </Hint>
  ) : (
    title
  );
});

/**
 * Flexible heading element for cards supporting dynamic heading tags (`as` prop).
 */
const CardHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "div";
  }
>(({ as: Comp = "h3", className, ...props }, ref): React.JSX.Element => {
  return (
    <Comp
      ref={ref}
      className={cn(
        "font-semibold leading-tight tracking-tight",
        (
          {
            xs: "text-[11px]",
            sm: "text-base",
            md: "text-lg",
            lg: "text-xl",
            xl: "text-2xl",
          } as const
        )[React.useContext(CARD_SIZE_CTX)],
        className,
      )}
      {...props}
    />
  );
});

// DESCRIPTION
/**
 * Subordinate description text within a card.
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { tooltip?: React.ReactNode }
>(({ className, tooltip, children, ...props }, ref): React.JSX.Element => {
  const description = (
    <p
      data-slot="card-description"
      ref={ref}
      className={cn(
        "opacity-80 group-data-[variant^=glass]/card:text-white/75",
        (
          {
            xs: "text-[9px]",
            sm: "text-sm",
            md: "text-sm",
            lg: "text-base",
            xl: "text-lg",
          } as const
        )[React.useContext(CARD_SIZE_CTX)],
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
  return tooltip ? (
    <Hint content={tooltip} disabledTrigger>
      {description}
    </Hint>
  ) : (
    description
  );
});

const CardAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref): React.JSX.Element => (
  <div
    data-slot="card-action"
    ref={ref}
    className={cn(
      "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
      className,
    )}
    {...props}
  />
));

/**
 * Flexible body text element within a card supporting dynamic tags (`as` prop).
 */
const CardText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { as?: "p" | "div" }
>(({ as: Comp = "p", className, ...props }, ref): React.JSX.Element => {
  return (
    <Comp
      ref={ref}
      className={cn(
        (
          {
            xs: "text-xs leading-snug",
            sm: "text-sm",
            md: "text-base leading-relaxed",
            lg: "text-lg leading-relaxed",
            xl: "text-xl leading-relaxed",
          } as const
        )[React.useContext(CARD_SIZE_CTX)],
        className,
      )}
      {...props}
    />
  );
});

/**
 * Blockquote component formatted for cards.
 */
const CardQuote = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref): React.JSX.Element => {
  return (
    <blockquote
      ref={ref as React.Ref<HTMLQuoteElement>}
      className={cn(
        "text-pretty border-l-2 border-current pl-3 italic",
        (
          {
            xs: "text-[9px]/snug",
            sm: "text-xs/snug",
            md: "text-base/snug",
            lg: "text-lg/snug",
            xl: "text-xl/snug",
          } as const
        )[React.useContext(CARD_SIZE_CTX)],
        className,
      )}
      {...props}
    />
  );
});

/**
 * Meta text component for card attributions and timestamps.
 */
const CardMeta = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { as?: "span" | "cite" | "p" | "div" }
>(({ as: Comp = "span", className, ...props }, ref): React.JSX.Element => {
  return (
    <Comp
      ref={ref as React.Ref<HTMLSpanElement> & React.Ref<HTMLParagraphElement>}
      className={cn(
        "whitespace-nowrap",
        (
          {
            xs: "text-[7px]",
            sm: "text-[10px]",
            md: "text-xs",
            lg: "text-sm",
            xl: "text-base",
          } as const
        )[React.useContext(CARD_SIZE_CTX)],
        className,
      )}
      {...props}
    />
  );
});

// CONTENT
/**
 * Main content body container for cards.
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref): React.JSX.Element => {
  const size = React.useContext(CARD_SIZE_CTX);
  return (
    <div
      data-slot="card-content"
      ref={ref}
      className={cn(
        "space-y-4 px-(--card-spacing)",
        cardPadding[size],
        cardBodyText[size],
        className,
      )}
      {...props}
    />
  );
});

// FOOTER
/**
 * Footer container for action buttons or supplementary information.
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref): React.JSX.Element => {
  return (
    <div
      data-slot="card-footer"
      ref={ref}
      className={cn(
        "bg-primary-3/50 flex items-center rounded-b-xl border-t p-(--card-spacing)",
        cardPadding[React.useContext(CARD_SIZE_CTX)],
        className,
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardHeading.displayName = "CardHeading";
CardDescription.displayName = "CardDescription";
CardText.displayName = "CardText";
CardQuote.displayName = "CardQuote";
CardMeta.displayName = "CardMeta";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";
CardSummary.displayName = "CardSummary";
CardAction.displayName = "CardAction";
export {
  Card,
  CardSummary,
  CardHeader,
  CardFooter,
  CardTitle,
  CardHeading,
  CardDescription,
  CardAction,
  CardText,
  CardQuote,
  CardMeta,
  CardContent,
};
