/**
 * src/components/ui/sidebar.tsx
 * https://ui.shadcn.com/docs/components/sidebar
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { cva } from "class-variance-authority";

// COMPONENTS
import * as React from "react";
import TextTooltip, {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip.js";
import { Button } from "./button.js";
import { Input } from "./input.js";
import { OpenPanelLeft as PanelLeftIcon } from "@carbon/icons-react";
import { Separator } from "./separator.js";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet.js";
import { Skeleton } from "./skeleton.js";
import { Slot } from "@radix-ui/react-slot";

// TYPES
import type { SidebarCtxProps } from "./types.js";
import type { VariantProps } from "class-variance-authority";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const SIDEBAR_WIDTH = "22rem";
const SIDEBAR_PADDING = "p-4";

/*//////////////////////////////////////////////////
CONTEXT
//////////////////////////////////////////////////*/

const SidebarCtx = React.createContext<SidebarCtxProps | null>(null);

/**
 * Shared hook for accessing the current sidebar context.
 *
 * @return Current sidebar context values and helpers.
 *
 * @throws If used outside of a mounted `SidebarProvider`.
 */
function useSidebar(): SidebarCtxProps {
  const ctx = React.useContext(SidebarCtx);
  if (!ctx)
    throw new Error("useSidebar must be used within a SidebarProvider.");
  return ctx;
}

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/** Manages responsive sidebar state, persistence, and child context.
 * @param providerProps - Root attributes and controlled/uncontrolled open props.
 * @param ref - Ref forwarded to the provider's root element.
 * @return A sidebar context provider with responsive state and controls.
 */
function SidebarProviderRender(
  providerProps: React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  },
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const {
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
  } = providerProps;
  // STATE
  // Track the same media query used by the mobile sidebar variant.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );
  /** Registers the mobile breakpoint listener and returns its cleanup.
   * @return A callback that removes the media-query listener.
   */
  function subscribeToMobileBreakpoint(): () => void {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    /** Updates mobile state when the viewport crosses the breakpoint.
     * @return Nothing; the state reflects the current viewport width.
     */
    function updateMobileState(): void {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }
    /** Removes the listener registered on the media query. */
    function removeMobileBreakpointListener(): void {
      mql.removeEventListener("change", updateMobileState);
    }
    mql.addEventListener("change", updateMobileState);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return removeMobileBreakpointListener;
  }
  React.useEffect(subscribeToMobileBreakpoint, []);
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;

  // HANDLERS
  // updates state and persists to cookie
  /** Updates controlled or local sidebar state and persists the choice.
   * @param value - The next open state or an updater based on the current state.
   * @return Nothing; state, callback, and cookie reflect the chosen value.
   */
  function applySidebarOpenState(
    value: boolean | ((value: boolean) => boolean),
  ): void {
    const openState = typeof value === "function" ? value(open) : value;
    if (setOpenProp) setOpenProp(openState);
    else _setOpen(openState);
    document.cookie = `${"sidebar_state"}=${openState}; path=/; max-age=${60 * 60 * 24 * 7}`;
  }
  const setOpen = React.useCallback(applySidebarOpenState, [setOpenProp, open]);

  // handles toggle based on device type
  /** Returns the opposite boolean for the sidebar state updaters. */
  function invertSidebarOpenState(value: boolean): boolean {
    return !value;
  }
  /** Toggles the mobile drawer or desktop sidebar according to the viewport. */
  function toggleSidebarState(): void {
    if (isMobile) setOpenMobile(invertSidebarOpenState);
    else setOpen(invertSidebarOpenState);
  }
  const toggleSidebar = React.useCallback(toggleSidebarState, [
    isMobile,
    setOpen,
    setOpenMobile,
  ]);

  // EFFECTS
  // adds keyboard shortcut
  /** Handles the sidebar keyboard shortcut.
   * @param event - Keyboard event from the window.
   * @return Nothing; the shortcut toggles the sidebar and prevents default.
   */
  function handleSidebarShortcut(event: KeyboardEvent): void {
    if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggleSidebar();
    }
  }
  /** Registers the global shortcut and returns its cleanup callback. */
  function subscribeToSidebarShortcut(): () => void {
    /** Removes the global shortcut listener during cleanup. */
    function removeSidebarShortcut(): void {
      window.removeEventListener("keydown", handleSidebarShortcut);
    }
    window.addEventListener("keydown", handleSidebarShortcut);
    return removeSidebarShortcut;
  }
  React.useEffect(subscribeToSidebarShortcut, [toggleSidebar]);
  const state: SidebarCtxProps["state"] = open ? "expanded" : "collapsed";
  /** Builds the context value consumed by sidebar child controls.
   * @return Current state, mobile status, and control methods.
   */
  function createSidebarContextValue(): SidebarCtxProps {
    return {
      state,
      open,
      setOpen,
      isMobile: !!isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    };
  }
  const contextValue = React.useMemo(createSidebarContextValue, [
    state,
    open,
    setOpen,
    isMobile,
    openMobile,
    setOpenMobile,
    toggleSidebar,
  ]);
  return (
    <SidebarCtx.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": "3rem",
              "--docs-sidebar-offset": open ? SIDEBAR_WIDTH : "0px",
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-primary-2 print:h-auto print:min-h-0",
            className,
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarCtx.Provider>
  );
}

/** Manages sidebar state and provides context to children. */
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(SidebarProviderRender);
SidebarProvider.displayName = "SidebarProvider";

/** Props that configure sidebar placement, collapse behavior, and DOM attributes. */
type SidebarProps = React.ComponentProps<"div"> & {
  side?: "left" | "right";
  sticky?: boolean;
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
};

/** Renders the responsive sidebar surface for the current viewport.
 * @param sidebarProps - DOM attributes and options controlling sidebar layout.
 * @param ref - Forwarded reference to the sidebar wrapper.
 * @return The mobile sheet or desktop sidebar surface.
 */
function SidebarRender(
  sidebarProps: SidebarProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const {
    side = "left",
    sticky: _sticky = false,
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
  } = sidebarProps;
  // PREP
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  // RENDER
  // collapsed
  if (collapsible === "none") {
    return (
      <div
        className={cn(
          "flex h-full w-[--sidebar-width] flex-col bg-primary-2 text-primary-12 print:hidden",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
  // mobile
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] border-primary-6 bg-primary-2 p-0 text-primary-12 print:hidden [&>button]:hidden"
          style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex size-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }
  // desktop
  return (
    <div
      ref={ref}
      className="group peer hidden text-primary-12 md:block print:hidden"
      data-state={state}
      data-sticky={_sticky ? "true" : "false"}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      <div
        className={cn(
          "relative w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
        )}
      />
      <div
        className={cn(
          // general
          "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
          // side
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // variant
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "border-primary-6 group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          // override
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex size-full flex-col bg-primary-2 group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-primary-6 group-data-[variant=floating]:shadow"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Main visual container for the sidebar.
 *
 * Hidden automatically in print across all variants.
 */
const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(SidebarRender);
Sidebar.displayName = "Sidebar";

/** Calls the consumer click handler before toggling sidebar visibility.
 * @param event - Click event from the trigger button.
 * @param onClick - Optional click handler supplied by the consumer.
 * @param toggleSidebar - Context action that switches the sidebar state.
 * @return Nothing; both actions are performed synchronously.
 */
function SidebarTriggerClick(
  event: React.MouseEvent<HTMLButtonElement>,
  onClick: React.ComponentProps<typeof Button>["onClick"],
  toggleSidebar: () => void,
): void {
  onClick?.(event);
  toggleSidebar();
}

/** Renders the icon trigger with tooltip and sidebar toggle behavior.
 * @param triggerProps - Button attributes and optional consumer click handler.
 * @param ref - Forwarded reference to the underlying button.
 * @return A tooltip-wrapped sidebar trigger.
 */
function SidebarTriggerRender(
  triggerProps: React.ComponentProps<typeof Button>,
  ref: React.ForwardedRef<React.ElementRef<typeof Button>>,
): React.JSX.Element {
  const { className, onClick, ...props } = triggerProps;
  const { toggleSidebar } = useSidebar();
  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    SidebarTriggerClick(event, onClick, toggleSidebar);
  }
  return (
    <TextTooltip content="Toggle Sidebar (⌘B)">
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("size-7 print:hidden", className)}
        onClick={handleClick}
        {...props}
      >
        <PanelLeftIcon aria-hidden="true" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    </TextTooltip>
  );
}

/**
 * Button used to toggle the sidebar open and closed.
 *
 * Hidden when printing.
 */
const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(SidebarTriggerRender);
SidebarTrigger.displayName = "SidebarTrigger";

/** Renders the sidebar's narrow click rail.
 * @param railProps - Button attributes for the rail element.
 * @param ref - Forwarded reference to the rail button.
 * @return The rail button wired to the context toggle.
 */
function SidebarRailRender(
  railProps: React.ComponentProps<"button">,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.JSX.Element {
  const { className, ...props } = railProps;
  const { toggleSidebar } = useSidebar();
  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-primary-6 group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex print:hidden",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-primary-2",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(SidebarRailRender);
SidebarRail.displayName = "SidebarRail";

/** Renders the main content surface alongside the sidebar.
 * @param insetProps - Main element attributes and optional class name.
 * @param ref - Forwarded reference to the main element.
 * @return The styled sidebar inset.
 */
function SidebarInsetRender(
  insetProps: React.ComponentProps<"main">,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, ...props } = insetProps;
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex w-full flex-1 flex-col bg-primary-1 print:bg-transparent",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className,
      )}
      {...props}
    />
  );
}

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(SidebarInsetRender);
SidebarInset.displayName = "SidebarInset";

/** Renders a compact input with sidebar-specific data and sizing.
 * @param inputProps - Input attributes and optional class name.
 * @param ref - Forwarded reference to the input element.
 * @return The sidebar-styled input component.
 */
function SidebarInputRender(
  inputProps: React.ComponentProps<typeof Input>,
  ref: React.ForwardedRef<React.ElementRef<typeof Input>>,
): React.JSX.Element {
  const { className, ...props } = inputProps;
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-primary-1 shadow-none focus-visible:ring-2 focus-visible:ring-primary-8",
        className,
      )}
      {...props}
    />
  );
}

/** Input field formatted for use inside sidebar containers. */
const SidebarInput = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof Input>,
    React.ComponentProps<typeof Input>
  >(SidebarInputRender),
  { displayName: "SidebarInput" },
);

/** Renders a padded header section within a sidebar.
 * @param headerProps - Header attributes and optional class name.
 * @param ref - Forwarded reference to the header element.
 * @return The sidebar header container.
 */
function SidebarHeaderRender(
  headerProps: React.ComponentProps<"div">,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, ...props } = headerProps;
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2", SIDEBAR_PADDING, className)}
      {...props}
    />
  );
}

/** Header section container for sidebar layouts. */
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(SidebarHeaderRender);
SidebarHeader.displayName = "SidebarHeader";

/** Renders a padded footer section within a sidebar.
 * @param footerProps - Footer attributes and optional class name.
 * @param ref - Forwarded reference to the footer element.
 * @return The sidebar footer container.
 */
function SidebarFooterRender(
  footerProps: React.ComponentProps<"div">,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, ...props } = footerProps;
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2", SIDEBAR_PADDING, className)}
      {...props}
    />
  );
}

/** Footer section container for sidebar layouts. */
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(SidebarFooterRender);
SidebarFooter.displayName = "SidebarFooter";

/** Renders the divider used between sidebar sections.
 * @param separatorProps - Separator attributes and optional class name.
 * @param ref - Forwarded reference to the separator element.
 * @return The sidebar-styled separator.
 */
function SidebarSeparatorRender(
  separatorProps: React.ComponentProps<typeof Separator>,
  ref: React.ForwardedRef<React.ElementRef<typeof Separator>>,
): React.JSX.Element {
  const { className, ...props } = separatorProps;
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-4 w-auto bg-primary-6", className)}
      {...props}
    />
  );
}

/** Visual separator line for dividing sidebar content. */
const SidebarSeparator = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof Separator>,
    React.ComponentProps<typeof Separator>
  >(SidebarSeparatorRender),
  { displayName: "SidebarSeparator" },
);

/** Renders scroll state and ref forwarding for the sidebar content region.
 * @param contentProps - Container attributes, content, and optional class name.
 * @param ref - Forwarded reference to the outer content container.
 * @return The scrollable content region with edge scrims.
 */
function SidebarContentRender(
  contentProps: React.ComponentProps<"div">,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, children, ...props } = contentProps;
  // STATE
  const [scroll, setScroll] = React.useState({ top: false, bottom: true });
  // We use a local ref to track the scrolling element (Inner Container)
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // HANDLERS
  /** Updates the top and bottom scrim state from the scroll position. */
  function updateSidebarScrollState(): void {
    const el = scrollRef.current;
    if (!el) return;
    setScroll({
      top: el.scrollTop > 0,
      // Use Math.ceil to handle fractional pixel rendering on high-DPI screens
      bottom: Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight,
    });
  }
  const onScroll = React.useCallback(updateSidebarScrollState, []);

  // EFFECTS
  // Check initial scroll state on mount
  /** Initializes the scroll scrims after the content element mounts. */
  function initializeSidebarScroll(): void {
    onScroll();
  }
  React.useEffect(initializeSidebarScroll, [onScroll]);

  /** Stores the scrolling element and forwards its ref to the caller. */
  function attachSidebarScrollElement(node: HTMLDivElement | null): void {
    scrollRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }
  return (
    <div
      // OUTER WRAPPER:
      // - Stays fixed (doesn't scroll).
      // - Holds the 'scrim' classes so they overlay correctly.
      // - Receives the `className` to handle flex layout (flex-1) from the parent Sidebar.
      className={cn(
        "relative flex min-h-0 flex-1 flex-col overflow-hidden",
        // Scrim base color
        "scrim-primary-2",
        // Conditional scrims (applied to this non-scrolling wrapper)
        scroll.top && "scrim-t-20",
        scroll.bottom && "scrim-b-20",
        className,
      )}
      {...props}
    >
      <div
        // INNER CONTAINER:
        // - Handles the actual scrolling.
        // - Receives the ref (so you can control scroll position).
        // - Holds the content and padding.
        ref={attachSidebarScrollElement}
        data-sidebar="content"
        onScroll={onScroll}
        className={cn(
          "flex size-full flex-col gap-2 overflow-auto",
          "group-data-[collapsible=icon]:overflow-hidden",
          SIDEBAR_PADDING,
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Scrollable content area within a sidebar. */
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(SidebarContentRender);
SidebarContent.displayName = "SidebarContent";

/** Renders the layout wrapper for a related set of sidebar controls.
 * @param groupProps - Group container attributes and optional class name.
 * @param ref - Forwarded reference to the group element.
 * @return The padded sidebar group container.
 */
function SidebarGroupRender(
  groupProps: React.ComponentProps<"div">,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, ...props } = groupProps;
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn(
        "relative flex w-full min-w-0 flex-col",
        SIDEBAR_PADDING,
        className,
      )}
      {...props}
    />
  );
}

/** Group container for related sidebar menu items. */
const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(SidebarGroupRender);
SidebarGroup.displayName = "SidebarGroup";

/**
 * Text label for a sidebar group.
 */
/** Props for a sidebar group label that can render as a slotted child. */
type SidebarGroupLabelProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
};

/** Renders a visible or slotted heading for a sidebar group.
 * @param labelProps - Heading attributes, slot choice, and optional class name.
 * @param ref - Forwarded reference to the rendered heading element.
 * @return The sidebar group heading or its slotted child.
 */
function SidebarGroupLabelRender(
  labelProps: SidebarGroupLabelProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, asChild = false, ...props } = labelProps;
  const labelClassName = cn(
    "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-primary-11 outline-none ring-primary-8 transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
    "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
    className,
  );
  return asChild ? (
    <Slot
      ref={ref}
      data-sidebar="group-label"
      className={labelClassName}
      {...props}
    />
  ) : (
    <div
      ref={ref}
      data-sidebar="group-label"
      className={labelClassName}
      {...props}
    />
  );
}

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  SidebarGroupLabelProps
>(SidebarGroupLabelRender);
SidebarGroupLabel.displayName = "SidebarGroupLabel";

/**
 * Secondary action button placed within a sidebar group header.
 */
/** Props for a sidebar group action button or slotted action. */
type SidebarGroupActionProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

/** Renders a button or slotted action in a sidebar group header.
 * @param actionProps - Button attributes and optional slot selection.
 * @param ref - Forwarded reference to the rendered action element.
 * @return The sidebar group action button or its slotted child.
 */
function SidebarGroupActionRender(
  actionProps: SidebarGroupActionProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.JSX.Element {
  const { className, asChild = false, ...props } = actionProps;
  const actionClassName = cn(
    "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-primary-11 outline-none ring-primary-8 transition-transform hover:bg-primary-4 hover:text-primary-12 focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
    "after:absolute after:-inset-2 after:md:hidden",
    "group-data-[collapsible=icon]:hidden",
    className,
  );
  return asChild ? (
    <Slot
      ref={ref}
      data-sidebar="group-action"
      className={actionClassName}
      {...props}
    />
  ) : (
    <button
      ref={ref}
      data-sidebar="group-action"
      className={actionClassName}
      {...props}
    />
  );
}

const SidebarGroupAction = Object.assign(
  React.forwardRef<HTMLButtonElement, SidebarGroupActionProps>(
    SidebarGroupActionRender,
  ),
  { displayName: "SidebarGroupAction" },
);

/** Renders the container around a sidebar group's menu items.
 * @param groupContentProps - Container attributes and optional class name.
 * @param ref - Forwarded reference to the group content element.
 * @return The sidebar group content container.
 */
function SidebarGroupContentRender(
  groupContentProps: React.ComponentProps<"div">,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, ...props } = groupContentProps;
  return (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

/** Content container for items inside a sidebar group. */
const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(SidebarGroupContentRender);
SidebarGroupContent.displayName = "SidebarGroupContent";

/** Renders the list that contains sidebar navigation links.
 * @param menuProps - List attributes and optional class name.
 * @param ref - Forwarded reference to the navigation list.
 * @return The sidebar navigation list.
 */
function SidebarMenuRender(
  menuProps: React.ComponentProps<"ul">,
  ref: React.ForwardedRef<HTMLUListElement>,
): React.JSX.Element {
  const { className, ...props } = menuProps;
  return (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-0", className)}
      {...props}
    />
  );
}

/** Menu list container for sidebar navigation links. */
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(SidebarMenuRender);
SidebarMenu.displayName = "SidebarMenu";

/** Renders the list item wrapper for one sidebar menu entry.
 * @param itemProps - List item attributes and optional class name.
 * @param ref - Forwarded reference to the menu item element.
 * @return The sidebar menu item wrapper.
 */
function SidebarMenuItemRender(
  itemProps: React.ComponentProps<"li">,
  ref: React.ForwardedRef<HTMLLIElement>,
): React.JSX.Element {
  const { className, ...props } = itemProps;
  return (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

/** Individual list item wrapper for sidebar menu actions. */
const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(SidebarMenuItemRender);
SidebarMenuItem.displayName = "SidebarMenuItem";

// BUTTON
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded-md p-2 text-left text-sm no-underline outline-none ring-primary-8 transition-[width,height,padding] hover:bg-primary-4 hover:text-primary-12 hover:no-underline focus-visible:ring-2 active:bg-primary-5 active:text-primary-12 disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-primary-5 data-[active=true]:font-medium data-[active=true]:text-primary-12 data-[state=open]:hover:bg-primary-4 data-[state=open]:hover:text-primary-12 group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-primary-4 hover:text-primary-12",
        outline:
          "bg-primary-1 shadow-[0_0_0_1px_theme(colors.primary.6)] hover:bg-primary-4 hover:text-primary-12 hover:shadow-[0_0_0_1px_theme(colors.primary.4)]",
      },
      size: {
        default: "h-9 text-sm",
        sm: "h-8 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/** Props for the primary sidebar link, including its collapsed tooltip. */
type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>;

/** Renders the primary button and optional collapsed-sidebar tooltip.
 * @param buttonProps - Button attributes, active state, variant, and tooltip.
 * @param ref - Forwarded reference to the button or slotted element.
 * @return The sidebar navigation button, optionally wrapped in a tooltip.
 */
function SidebarMenuButtonRender(
  buttonProps: SidebarMenuButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.JSX.Element {
  const {
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
  } = buttonProps;
  const { isMobile, state } = useSidebar();
  const btn = asChild ? (
    <Slot
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  ) : (
    <button
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
  if (!tooltip) return btn;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{btn}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...(typeof tooltip === "string" ? { children: tooltip } : tooltip)}
      />
    </Tooltip>
  );
}

/** Primary navigation button/link item within a sidebar menu. */
const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(SidebarMenuButtonRender);
SidebarMenuButton.displayName = "SidebarMenuButton";

/** Props for an action displayed beside a sidebar menu button. */
type SidebarMenuActionProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
};

/** Renders a contextual action button alongside a sidebar menu item.
 * @param actionProps - Button attributes and action display options.
 * @param ref - Forwarded reference to the action button or slotted child.
 * @return The contextual menu action button.
 */
function SidebarMenuActionRender(
  actionProps: SidebarMenuActionProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
): React.JSX.Element {
  const {
    className,
    asChild = false,
    showOnHover = false,
    ...props
  } = actionProps;
  const actionClassName = cn(
    "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-primary-11 outline-none ring-primary-8 transition-transform hover:bg-primary-4 hover:text-primary-12 focus-visible:ring-2 peer-hover/menu-button:text-primary-12 [&>svg]:size-4 [&>svg]:shrink-0",
    "after:absolute after:-inset-2 after:md:hidden",
    "peer-data-[size=sm]/menu-button:top-1",
    "peer-data-[size=default]/menu-button:top-1.5",
    "peer-data-[size=lg]/menu-button:top-2.5",
    "group-data-[collapsible=icon]:hidden",
    showOnHover &&
      "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-primary-12 md:opacity-0",
    className,
  );
  return asChild ? (
    <Slot
      ref={ref}
      data-sidebar="menu-action"
      className={actionClassName}
      {...props}
    />
  ) : (
    <button
      ref={ref}
      data-sidebar="menu-action"
      className={actionClassName}
      {...props}
    />
  );
}

/** Contextual action button for a sidebar menu item (e.g. options menu or delete button). */
const SidebarMenuAction = Object.assign(
  React.forwardRef<HTMLButtonElement, SidebarMenuActionProps>(
    SidebarMenuActionRender,
  ),
  { displayName: "SidebarMenuAction" },
);

/** Renders a noninteractive badge aligned with a sidebar menu item.
 * @param badgeProps - Badge attributes and optional class name.
 * @param ref - Forwarded reference to the badge element.
 * @return The positioned sidebar menu badge.
 */
function SidebarMenuBadgeRender(
  badgeProps: React.ComponentProps<"div">,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, ...props } = badgeProps;
  return (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-primary-11",
        "peer-hover/menu-button:text-primary-12 peer-data-[active=true]/menu-button:text-primary-12",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

/** Numeric or textual badge appended to a sidebar menu item. */
const SidebarMenuBadge = Object.assign(
  React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    SidebarMenuBadgeRender,
  ),
  { displayName: "SidebarMenuBadge" },
);

/** Renders a menu skeleton and stable text-width placeholder.
 * @param skeletonProps - Skeleton attributes and optional icon visibility.
 * @param ref - Forwarded reference to the skeleton wrapper.
 * @return A menu placeholder with an optional icon and text bar.
 */
function SidebarMenuSkeletonRender(
  skeletonProps: React.ComponentProps<"div"> & { showIcon?: boolean },
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, showIcon = false, ...props } = skeletonProps;
  function createSkeletonWidth(): string {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }
  const skeletonWidth = React.useMemo(createSkeletonWidth, []);
  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={{ "--skeleton-width": skeletonWidth } as React.CSSProperties}
      />
    </div>
  );
}

/** Loading placeholder skeleton for sidebar menu items. */
const SidebarMenuSkeleton = Object.assign(
  React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & { showIcon?: boolean }
  >(SidebarMenuSkeletonRender),
  { displayName: "SidebarMenuSkeleton" },
);

/** Renders the list container for nested sidebar links.
 * @param subProps - List attributes and optional class name.
 * @param ref - Forwarded reference to the submenu list.
 * @return The nested sidebar navigation list.
 */
function SidebarMenuSubRender(
  subProps: React.ComponentProps<"ul">,
  ref: React.ForwardedRef<HTMLUListElement>,
): React.JSX.Element {
  const { className, ...props } = subProps;
  return (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn("group-data-[collapsible=icon]:hidden", className)}
      {...props}
    />
  );
}

/** Submenu container nested inside a sidebar menu item. */
const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(SidebarMenuSubRender);
SidebarMenuSub.displayName = "SidebarMenuSub";

/** Renders one list item within a sidebar submenu.
 * @param itemProps - List item attributes and children.
 * @param ref - Forwarded reference to the submenu item.
 * @return The submenu list item.
 */
function SidebarMenuSubItemRender(
  itemProps: React.ComponentProps<"li">,
  ref: React.ForwardedRef<HTMLLIElement>,
): React.JSX.Element {
  return <li ref={ref} {...itemProps} />;
}

/** Individual list item wrapper for submenu entries. */
const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(SidebarMenuSubItemRender);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

/** Renders the link or slotted button used for a nested sidebar item.
 * @param buttonProps - Link attributes and submenu button display options.
 * @param ref - Forwarded reference to the link or slotted element.
 * @return The nested navigation button or its slotted child.
 */
function SidebarMenuSubButtonRender(
  buttonProps: React.ComponentProps<"a"> & {
    asChild?: boolean;
    size?: "sm" | "md";
    isActive?: boolean;
  },
  ref: React.ForwardedRef<HTMLAnchorElement>,
): React.JSX.Element {
  const {
    asChild = false,
    size = "md",
    isActive,
    className,
    ...props
  } = buttonProps;
  const buttonClassName = cn(
    // general
    "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-primary-11 outline-none ring-primary-8 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-primary-12",
    // indent
    "ml-2 data-[active=true]:ml-4",
    "group-data-[collapsible=icon]:hidden",
    // size
    size === "sm" && "text-xs",
    size === "md" && "text-sm",
    // override
    className,
  );
  return asChild ? (
    <Slot
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={buttonClassName}
      {...props}
    />
  ) : (
    <a
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={buttonClassName}
      {...props}
    />
  );
}

/** Navigation button/link item for a nested sidebar submenu. */
const SidebarMenuSubButton = Object.assign(
  React.forwardRef<
    HTMLAnchorElement,
    React.ComponentProps<"a"> & {
      asChild?: boolean;
      size?: "sm" | "md";
      isActive?: boolean;
    }
  >(SidebarMenuSubButtonRender),
  { displayName: "SidebarMenuSubButton" },
);
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
const MOBILE_BREAKPOINT = 768;
