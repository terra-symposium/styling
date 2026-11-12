/**
 * src/components/ui/accordion.tsx
 * https://ui.shadcn.com/docs/components/accordion
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as React from "react";
import { ChevronDown as ChevronDownIcon } from "@carbon/icons-react";

// TYPES
import type { Variant } from "./types.js";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const ACCORDION_VARIANT_CLASSES: Record<
  Variant,
  { content: string; item: string; trigger: string }
> = {
  default: {
    item: "[&>*]:my-2",
    trigger: "py-2 text-lg font-bold",
    content: "pb-4",
  },
  sm: {
    item: "[&>*]:my-1.5",
    trigger: "py-1.5 text-base font-semibold",
    content: "w-full min-w-0 pb-2 pt-0",
  },
  xs: {
    item: "[&>*]:my-1",
    trigger: "py-1 text-sm font-semibold",
    content: "pb-1",
  },
};

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

const VariantCtx = React.createContext<Variant>("default");
VariantCtx.displayName = "AccordionVariantContext";
/** Resolves an item's explicit size variant or the nearest accordion default.
 * @param variant - Optional component-level size variant.
 * @return Accordion class variants for item, trigger, and content.
 */
function useAccordionVariant(
  variant?: Variant,
): (typeof ACCORDION_VARIANT_CLASSES)[Variant] {
  const contextVariant = React.useContext(VariantCtx);
  return ACCORDION_VARIANT_CLASSES[variant ?? contextVariant];
}

/** Renders an accordion item with the active variant's item spacing.
 * @param itemProps - Radix item attributes and optional size variant.
 * @param ref - Ref forwarded to the Radix item element.
 * @return A bordered accordion item container.
 */
function AccordionItemRender(
  itemProps: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    variant?: Variant;
  },
  ref: React.ForwardedRef<React.ElementRef<typeof AccordionPrimitive.Item>>,
): React.JSX.Element {
  const { className, variant: variantOverride, ...props } = itemProps;
  const variant = useAccordionVariant(variantOverride);
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        "relative w-full min-w-0 overflow-hidden border-t border-primary-6",
        variant.item,
        className,
      )}
      {...props}
    />
  );
}

/**
 * Accordion item container primitive with size variant context support.
 *
 * @param variant - Optional size variant override ('default', 'sm', or 'xs').
 */
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
    variant?: Variant;
  }
>(AccordionItemRender);

/** Renders a trigger and its disclosure icon using the active variant.
 * @param triggerProps - Radix trigger attributes, content, and optional size variant.
 * @param ref - Ref forwarded to the Radix trigger element.
 * @return An accordion header containing the trigger and disclosure icon.
 */
function AccordionTriggerRender(
  triggerProps: React.ComponentPropsWithoutRef<
    typeof AccordionPrimitive.Trigger
  > & {
    variant?: Variant;
  },
  ref: React.ForwardedRef<React.ElementRef<typeof AccordionPrimitive.Trigger>>,
): React.JSX.Element {
  const {
    className,
    children,
    variant: variantOverride,
    ...props
  } = triggerProps;
  const variant = useAccordionVariant(variantOverride);
  return (
    <AccordionPrimitive.Header className={cn("flex w-full min-w-0", className)}>
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex w-full min-w-0 flex-1 items-center justify-between gap-2 rounded-sm text-primary-12 transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-9 focus-visible:ring-offset-2 [&[data-state=open]>svg]:rotate-180",
          variant.trigger,
        )}
        {...props}
      >
        <span className="min-w-0 truncate">{children}</span>
        <ChevronDownIcon
          className="size-4 shrink-0 transition-transform duration-200"
          aria-hidden="true"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/**
 * Accordion trigger header primitive with size variant context support.
 *
 * @param children - Trigger label and interactive content.
 * @param variant - Optional size variant override ('default', 'sm', or 'xs').
 */
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    variant?: Variant;
  }
>(AccordionTriggerRender);

/** Renders the expandable content region using the active variant's spacing.
 * @param contentProps - Radix content attributes, children, and optional variant.
 * @param ref - Ref forwarded to the Radix content element.
 * @return An animated accordion content region.
 */
function AccordionContentRender(
  contentProps: React.ComponentPropsWithoutRef<
    typeof AccordionPrimitive.Content
  > & {
    variant?: Variant;
  },
  ref: React.ForwardedRef<React.ElementRef<typeof AccordionPrimitive.Content>>,
): React.JSX.Element {
  const {
    className,
    children,
    variant: variantOverride,
    ...props
  } = contentProps;
  const variant = useAccordionVariant(variantOverride);
  return (
    <AccordionPrimitive.Content
      ref={ref}
      forceMount
      className="w-full min-w-0 max-w-full overflow-hidden text-sm data-[state=closed]:pointer-events-none data-[state=closed]:absolute data-[state=closed]:left-0 data-[state=closed]:top-full data-[state=closed]:m-0 data-[state=closed]:h-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down print:!static print:!h-auto print:!animate-none print:!overflow-visible print:data-[state=closed]:!h-auto print:data-[state=closed]:!animate-none"
      {...props}
    >
      <div className={cn("w-full min-w-0 pt-0", variant.content, className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

/**
 * Accordion content container primitive with size variant context support.
 *
 * @param children - Collapsible accordion content elements.
 * @param variant - Optional size variant override ('default', 'sm', or 'xs').
 */
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
    variant?: Variant;
  }
>(AccordionContentRender);

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Renders an accordion root with optional size variant ctx.
 *
 * @param variant - Size variant applied to child items ('default', 'sm', or 'xs').
 * @param className - Additional classes applied to the root.
 * @param attributes - Remaining root attributes forwarded to Radix.
 *
 * @return Accordion root element.
 */
function Accordion({
  variant = "default",
  className,
  ...attributes
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & {
  variant?: Variant;
}): React.JSX.Element {
  return (
    <VariantCtx.Provider value={variant}>
      <AccordionPrimitive.Root
        className={cn("w-full min-w-0", className)}
        {...attributes}
      />
    </VariantCtx.Provider>
  );
}
const AccordionHeader = AccordionPrimitive.Header;
AccordionItem.displayName = "AccordionItem";
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
export {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
};
