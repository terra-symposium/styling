/**
 * src/components/ui/tabs.tsx
 * https://ui.shadcn.com/docs/components/tabs
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

// DATA
import { ACTION_VARIANTS, FOCUS_VISIBLE_VARIANTS } from "./variants.js";

// TYPES
import type { ButtonVariant } from "./types.js";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const Tabs = TabsPrimitive.Root;
/**
 * Tabs list container primitive.
 *
 */
/** Radix tab-list attributes plus the supported layout variants. */
type TabsListProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
> & {
  variant?: "default" | "line" | "dashboard-nav";
};

/** Renders the shared tab list and its selected navigation layout.
 * @param listProps - Radix list attributes and Styling layout variant.
 * @param ref - Ref forwarded to the Radix list element.
 * @return A tab list with the requested layout variant.
 */
function renderTabsList(
  listProps: TabsListProps,
  ref: React.ForwardedRef<React.ElementRef<typeof TabsPrimitive.List>>,
): React.JSX.Element {
  const { className, variant = "default", ...props } = listProps;
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      ref={ref}
      aria-label={props["aria-label"] ?? "Tab options"}
      className={cn(
        "mb-2 inline-flex items-center justify-center gap-2",
        variant === "line" && "gap-1 rounded-none bg-transparent",
        variant === "dashboard-nav" &&
          "h-auto w-max min-w-max justify-start gap-[2.35rem] rounded-none bg-transparent p-0 max-[1440px]:gap-2 max-[1180px]:gap-1 max-[640px]:gap-3",
        className,
      )}
      {...props}
    />
  );
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(renderTabsList);
/**
 * Tabs trigger button primitive.
 *
 */
type TabActionVariant = ButtonVariant;
/** Radix tab-trigger attributes plus action and selection variants. */
type TabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> & {
  variant?: TabActionVariant | "dashboard-nav";
  selection?: "none" | "surface" | "line";
};

/** Renders a tab button with action and selection treatments.
 * @param triggerProps - Radix trigger attributes and Styling variants.
 * @param ref - Ref forwarded to the Radix trigger element.
 * @return A styled tab trigger button.
 */
function renderTabsTrigger(
  triggerProps: TabsTriggerProps,
  ref: React.ForwardedRef<React.ElementRef<typeof TabsPrimitive.Trigger>>,
): React.JSX.Element {
  const {
    className,
    variant = "gray-tonal",
    selection = "surface",
    ...props
  } = triggerProps;
  const dashboardNav = variant === "dashboard-nav";
  const actionVariant: TabActionVariant = dashboardNav
    ? "primary-default"
    : variant;
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      ref={ref}
      className={cn(
        ACTION_VARIANTS({ variant: actionVariant, size: "sm" }),
        dashboardNav &&
          "min-h-14 rounded-none border-0 bg-transparent text-[0.93rem] font-semibold tracking-[-0.01em] text-white/80 hover:bg-transparent hover:text-white/95",
        selection === "surface" &&
          "data-[state=active]:border-primary-4 data-[state=active]:bg-primary-3 data-[state=active]:text-primary-12 data-[state=active]:hover:bg-primary-4 data-[state=active]:shadow-sm",
        selection === "line" &&
          'relative rounded-none after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-current after:opacity-0 after:content-[""] data-[state=active]:after:opacity-100',
        !dashboardNav &&
          "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
        className,
      )}
      {...props}
    />
  );
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(renderTabsTrigger);
/**
 * Tabs content panel primitive.
 *
 */
/** Radix tab-panel attributes forwarded by the shared panel wrapper. */
type TabsContentProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
>;

/** Renders a tab panel with visible focus treatment and print visibility.
 * @param contentProps - Radix panel attributes and child content.
 * @param ref - Ref forwarded to the Radix panel element.
 * @return A styled tab panel.
 */
function renderTabsContent(
  contentProps: TabsContentProps,
  ref: React.ForwardedRef<React.ElementRef<typeof TabsPrimitive.Content>>,
): React.JSX.Element {
  const { className, ...props } = contentProps;
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      ref={ref}
      className={cn(
        "mt-2 ring-offset-white focus-visible:ring-primary-9 print:!block [&>:first-child]:!mt-0 [&>:last-child]:!mb-0 print:[&[hidden]]:!block",
        FOCUS_VISIBLE_VARIANTS(),
        className,
      )}
      {...props}
    />
  );
}

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(renderTabsContent);
TabsList.displayName = TabsPrimitive.List.displayName;
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
TabsContent.displayName = TabsPrimitive.Content.displayName;
export { Tabs, TabsList, TabsTrigger, TabsContent };
