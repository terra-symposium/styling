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

/**
 * Manages sidebar state and provides context to children.
 */
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref,
  ): React.JSX.Element => {
    // STATE
    // Track the same media query used by the mobile sidebar variant.
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
      undefined,
    );
    React.useEffect(() => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
      /**
       * Updates mobile state when the viewport crosses the breakpoint.
       *
       */
      const onChange = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };
      mql.addEventListener("change", onChange);
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      return () => {
        mql.removeEventListener("change", onChange);
      };
    }, []);
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;

    // HANDLERS
    // updates state and persists to cookie
    const setOpen = React.useCallback(
      (val: boolean | ((val: boolean) => boolean)) => {
        const openState = typeof val === "function" ? val(open) : val;
        if (setOpenProp) setOpenProp(openState);
        else _setOpen(openState);
        document.cookie = `${"sidebar_state"}=${openState}; path=/; max-age=${60 * 60 * 24 * 7}`;
      },
      [setOpenProp, open],
    );

    // handles toggle based on device type
    const toggleSidebar = React.useCallback(() => {
      if (isMobile) setOpenMobile((o) => !o);
      else setOpen((o) => !o);
    }, [isMobile, setOpen, setOpenMobile]);

    // EFFECTS
    // adds keyboard shortcut
    React.useEffect(() => {
      /**
       * Handles key down event.
       *
       * @param e - KeyboardEvent instance.
       */
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [toggleSidebar]);
    const state: SidebarCtxProps["state"] = open ? "expanded" : "collapsed";
    return (
      <SidebarCtx.Provider
        value={React.useMemo(
          () => ({
            state,
            open,
            setOpen: (next: boolean) => setOpen(next),
            isMobile: !!isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
          }),
          [
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
          ],
        )}
      >
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
  },
);
SidebarProvider.displayName = "SidebarProvider";

/**
 * Main visual container for the sidebar.
 *
 * Hidden automatically in print across all variants.
 */
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    sticky?: boolean;
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      sticky: _sticky = false,
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref,
  ): React.JSX.Element => {
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
  },
);
Sidebar.displayName = "Sidebar";

/**
 * Button used to toggle the sidebar open and closed.
 *
 * Hidden when printing.
 *
 * @param onClick - Optional click handler invoked before toggling.
 *
 * @returns A ghost icon button wired to the sidebar context.
 */
const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref): React.JSX.Element => {
  const { toggleSidebar } = useSidebar();
  return (
    <TextTooltip content="Toggle Sidebar (⌘B)">
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("size-7 print:hidden", className)}
        onClick={(e) => {
          onClick?.(e);
          toggleSidebar();
        }}
        {...props}
      >
        <PanelLeftIcon aria-hidden="true" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    </TextTooltip>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

/**
 * Narrow rail hit-area used to toggle the sidebar state.
 *
 * Hidden when printing.
 */
const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref): React.JSX.Element => {
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
});
SidebarRail.displayName = "SidebarRail";

/**
 * Main content area wrapper that sits alongside or inset from the sidebar.
 */
const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref): React.JSX.Element => (
  <main
    ref={ref}
    className={cn(
      "relative flex w-full flex-1 flex-col bg-primary-1 print:bg-transparent",
      "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
      className,
    )}
    {...props}
  />
));
SidebarInset.displayName = "SidebarInset";

/**
 * Input field formatted for use inside sidebar containers.
 */
const SidebarInput = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof Input>,
    React.ComponentProps<typeof Input>
  >(({ className, ...props }, ref): React.JSX.Element => (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-primary-1 shadow-none focus-visible:ring-2 focus-visible:ring-primary-8",
        className,
      )}
      {...props}
    />
  )),
  { displayName: "SidebarInput" },
);

/**
 * Header section container for sidebar layouts.
 */
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref): React.JSX.Element => (
  <div
    ref={ref}
    data-sidebar="header"
    className={cn("flex flex-col gap-2", SIDEBAR_PADDING, className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

/**
 * Footer section container for sidebar layouts.
 */
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref): React.JSX.Element => (
  <div
    ref={ref}
    data-sidebar="footer"
    className={cn("flex flex-col gap-2", SIDEBAR_PADDING, className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

/**
 * Visual separator line for dividing sidebar content.
 */
const SidebarSeparator = Object.assign(
  React.forwardRef<
    React.ElementRef<typeof Separator>,
    React.ComponentProps<typeof Separator>
  >(({ className, ...props }, ref): React.JSX.Element => (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-4 w-auto bg-primary-6", className)}
      {...props}
    />
  )),
  { displayName: "SidebarSeparator" },
);

/**
 * Scrollable content area within a sidebar.
 */
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref): React.JSX.Element => {
  // STATE
  const [scroll, setScroll] = React.useState({ top: false, bottom: true });
  // We use a local ref to track the scrolling element (Inner Container)
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // HANDLERS
  const onScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScroll({
      top: el.scrollTop > 0,
      // Use Math.ceil to handle fractional pixel rendering on high-DPI screens
      bottom: Math.ceil(el.scrollTop + el.clientHeight) < el.scrollHeight,
    });
  }, []);

  // EFFECTS
  // Check initial scroll state on mount
  React.useEffect(() => {
    onScroll();
  }, [onScroll]);
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
        ref={(node) => {
          scrollRef.current = node;
          // Forward the ref to the user
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
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
});
SidebarContent.displayName = "SidebarContent";

/**
 * Group container for related sidebar menu items.
 */
const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref): React.JSX.Element => (
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
));
SidebarGroup.displayName = "SidebarGroup";

/**
 * Text label for a sidebar group.
 */
const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref): React.JSX.Element => {
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
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

/**
 * Secondary action button placed within a sidebar group header.
 */
const SidebarGroupAction = Object.assign(
  React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> & { asChild?: boolean }
  >(({ className, asChild = false, ...props }, ref): React.JSX.Element => {
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
  }),
  { displayName: "SidebarGroupAction" },
);

/**
 * Content container for items inside a sidebar group.
 */
const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref): React.JSX.Element => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

/**
 * Menu list container for sidebar navigation links.
 */
const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref): React.JSX.Element => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-0", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

/**
 * Individual list item wrapper for sidebar menu actions.
 */
const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref): React.JSX.Element => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
));
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

/**
 * Primary navigation button/link item within a sidebar menu.
 */
const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref,
  ): React.JSX.Element => {
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
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

/**
 * Contextual action button for a sidebar menu item (e.g. options menu or delete button).
 */
const SidebarMenuAction = Object.assign(
  React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button"> & {
      asChild?: boolean;
      showOnHover?: boolean;
    }
  >(
    (
      { className, asChild = false, showOnHover = false, ...props },
      ref,
    ): React.JSX.Element => {
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
    },
  ),
  { displayName: "SidebarMenuAction" },
);

/**
 * Numeric or textual badge appended to a sidebar menu item.
 */
const SidebarMenuBadge = Object.assign(
  React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
    ({ className, ...props }, ref): React.JSX.Element => (
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
    ),
  ),
  { displayName: "SidebarMenuBadge" },
);

/**
 * Loading placeholder skeleton for sidebar menu items.
 */
const SidebarMenuSkeleton = Object.assign(
  React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & { showIcon?: boolean }
  >(({ className, showIcon = false, ...props }, ref): React.JSX.Element => {
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
          style={
            {
              "--skeleton-width": React.useMemo(
                () => `${Math.floor(Math.random() * 40) + 50}%`,
                [],
              ),
            } as React.CSSProperties
          }
        />
      </div>
    );
  }),
  { displayName: "SidebarMenuSkeleton" },
);

/**
 * Submenu container nested inside a sidebar menu item.
 */
const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref): React.JSX.Element => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn("group-data-[collapsible=icon]:hidden", className)}
    {...props}
  />
));
SidebarMenuSub.displayName = "SidebarMenuSub";

/**
 * Individual list item wrapper for submenu entries.
 */
const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>((props, ref): React.JSX.Element => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

/**
 * Navigation button/link item for a nested sidebar submenu.
 */
const SidebarMenuSubButton = Object.assign(
  React.forwardRef<
    HTMLAnchorElement,
    React.ComponentProps<"a"> & {
      asChild?: boolean;
      size?: "sm" | "md";
      isActive?: boolean;
    }
  >(
    (
      { asChild = false, size = "md", isActive, className, ...props },
      ref,
    ): React.JSX.Element => {
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
    },
  ),
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
