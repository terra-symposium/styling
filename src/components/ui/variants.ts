/**
 * astro/src/components/ui/variants.ts
 * Shared style contracts for Terra's shadcn primitives.
 * Keep color/treatment/size families here when more than one UI component uses
 * the same visual contract. Put one-consumer layout, slot, and behavior styles
 * in the component that owns them.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { cva } from "class-variance-authority";

// TYPES
import type { FormControlVariant, UiColor, UiSize, UiType } from "./types.js";

/*//////////////////////////////////////////////////
MATRIX HELPERS
//////////////////////////////////////////////////*/

/**
 * Flattens a color-by-treatment class grid into the variant keys used by CVA.
 *
 * @param grid - Class names indexed first by color and then by treatment.
 *
 * @return A flat map whose keys match the CVA variant names.
 */
function flattenColorTypeGrid<T extends Record<string, Record<string, string>>>(
  grid: T,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(grid).flatMap(([color, types]) =>
      Object.entries(types).map(([type, className]) => [
        type === "default" ? color : `${color}-${type}`,
        className,
      ]),
    ),
  );
}

/*//////////////////////////////////////////////////
SHARED INTERACTION AND TEXT CONTRACTS
//////////////////////////////////////////////////*/

/** Reusable palette, typography scale, and weight choices for UI text. */
export const TEXT_VARIANTS = cva("", {
  variants: {
    tone: {
      primary: "text-primary-12",
      secondary: "text-secondary-12",
      muted: "text-primary-11",
      current: "text-current",
      destructive: "text-red-700 dark:text-red-300",
      success: "text-emerald-700 dark:text-emerald-300",
      warning: "text-amber-700 dark:text-amber-300",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    } satisfies Record<UiSize, string>,
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
});

/** Shared focus-visible outline and ring behavior; color stays with the control family. */
export const FOCUS_VISIBLE_VARIANTS = cva(
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
);
/** Native, data, and ARIA disabled selectors used by different Radix controls. */
export const DISABLED_STATE_VARIANTS = cva("", {
  variants: {
    target: {
      native:
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      data: "data-disabled:pointer-events-none data-disabled:opacity-50",
      aria: "aria-disabled:pointer-events-none aria-disabled:opacity-50",
      nativeAndAria:
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    },
  },
});

/** Shared label alignment and disabled-state treatment for form labels. */
export const FORM_LABEL_VARIANTS = cva(
  cn(
    TEXT_VARIANTS({ tone: "muted", size: "sm", weight: "medium" }),
    "flex items-center gap-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  ),
);
/** Common focus and disabled behavior for activated controls. */
export const INTERACTIVE_CONTROL_VARIANTS = cva(
  cn(
    FOCUS_VISIBLE_VARIANTS(),
    DISABLED_STATE_VARIANTS({ target: "native" }),
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ),
);

/*//////////////////////////////////////////////////
ACTION CONTRACTS
//////////////////////////////////////////////////*/

const ACTION_MATRIX_VALUES = flattenColorTypeGrid({
  primary: {
    default: "not-disabled:hover:bg-primary-10 bg-primary-9 text-white",
    outline:
      "not-disabled:hover:bg-primary-1 border border-primary-5 text-primary-12",
    ghost: "enabled:hover:bg-primary-3",
    tonal:
      "not-disabled:hover:bg-primary-9/10 border border-primary-9/30 bg-primary-9/5 text-primary-12",
    link: "not-disabled:hover:underline text-primary-12 underline-offset-4",
    underline: "p-0 enabled:hover:underline",
    glass:
      "border border-white/15 bg-primary-9/40 text-white/90 shadow-lg backdrop-blur-xl hover:bg-primary-9/50",
  },
  secondary: {
    default:
      "not-disabled:hover:bg-secondary-4 border border-secondary-6 bg-secondary-3 text-secondary-11",
    outline:
      "not-disabled:hover:bg-secondary-2 border border-secondary-6 text-secondary-12",
    ghost: "enabled:hover:bg-secondary-3 text-secondary-11",
    tonal:
      "not-disabled:hover:bg-secondary-4 border border-secondary-6 bg-secondary-3 text-secondary-11",
    link: "not-disabled:hover:underline text-secondary-11 underline-offset-4",
    underline: "p-0 text-secondary-11 enabled:hover:underline",
    glass:
      "border border-white/15 bg-secondary-9/40 text-white/90 shadow-lg backdrop-blur-xl hover:bg-secondary-9/50",
  },
  gray: {
    default:
      "not-disabled:hover:bg-gray-3 border border-gray-6 bg-gray-2 text-gray-12",
    outline: "not-disabled:hover:bg-gray-2 border border-gray-6 text-gray-12",
    ghost: "enabled:hover:bg-gray-2 text-gray-12",
    tonal:
      "not-disabled:hover:bg-gray-3 border border-gray-6 bg-gray-2 text-gray-12",
    link: "not-disabled:hover:underline text-gray-11 underline-offset-4",
    underline: "p-0 text-gray-11 enabled:hover:underline",
    glass:
      "border border-white/15 bg-gray-9/40 text-white/90 shadow-lg backdrop-blur-xl hover:bg-gray-9/50",
  },
  destructive: {
    default:
      "not-disabled:hover:bg-rose-600/90 border border-rose-700 bg-rose-600 text-white dark:border-rose-800 dark:bg-rose-900 dark:hover:bg-rose-900/90",
    outline:
      "not-disabled:hover:bg-rose-50 border border-rose-700 text-rose-700 dark:hover:bg-rose-950",
    ghost:
      "text-red-600 enabled:hover:bg-red-200 dark:enabled:hover:bg-red-800",
    tonal:
      "not-disabled:hover:bg-rose-100 border border-rose-700/30 bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-100",
    link: "not-disabled:hover:underline text-red-600 underline-offset-4",
    underline: "p-0 text-red-600 enabled:hover:underline",
    glass:
      "border border-white/15 bg-rose-700/40 text-white/90 shadow-lg backdrop-blur-xl hover:bg-rose-700/50",
  },
  success: {
    default:
      "not-disabled:hover:bg-emerald-800 border border-emerald-700 bg-emerald-700 text-white",
    outline:
      "not-disabled:hover:bg-emerald-50 border border-emerald-700 text-emerald-800 dark:border-emerald-500 dark:text-emerald-300 dark:hover:bg-emerald-950",
    ghost:
      "text-emerald-800 enabled:hover:bg-emerald-50 dark:text-emerald-300 dark:enabled:hover:bg-emerald-950",
    tonal:
      "not-disabled:hover:bg-emerald-100 border border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100",
    link: "not-disabled:hover:underline text-emerald-800 underline-offset-4 dark:text-emerald-300",
    underline:
      "p-0 text-emerald-800 enabled:hover:underline dark:text-emerald-300",
    glass:
      "border border-white/15 bg-emerald-700/40 text-white/90 shadow-lg backdrop-blur-xl hover:bg-emerald-700/50",
  },
  caution: {
    default:
      "not-disabled:hover:bg-amber-800 border border-amber-700 bg-amber-700 text-white",
    outline:
      "not-disabled:hover:bg-amber-50 border border-amber-700 text-amber-800 dark:border-amber-500 dark:text-amber-300 dark:hover:bg-amber-950",
    ghost:
      "text-amber-800 enabled:hover:bg-amber-50 dark:text-amber-300 dark:enabled:hover:bg-amber-950",
    tonal:
      "not-disabled:hover:bg-amber-100 border border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100",
    link: "not-disabled:hover:underline text-amber-800 underline-offset-4 dark:text-amber-300",
    underline: "p-0 text-amber-800 enabled:hover:underline dark:text-amber-300",
    glass:
      "border border-white/15 bg-amber-700/40 text-white/90 shadow-lg backdrop-blur-xl hover:bg-amber-700/50",
  },
} satisfies Record<
  UiColor,
  Record<
    // Action treatments supported by the shared action matrix.
    Exclude<UiType, "saturated">,
    string
  >
>) as Record<
  /* Action color/treatment keys; saturated is reserved for surfaces. */
  UiColor | `${UiColor}-${Exclude<UiType, "default" | "saturated">}`,
  string
>;
/** Flattened action matrix retained for consumers that need to inspect variant classes as data. */
export const BUTTON_VARIANT_VALUES = ACTION_MATRIX_VALUES;
const ACTION_BASE = cn(
  "inline-flex items-center justify-center gap-2 rounded-md no-underline ring-offset-primary-1 transition-colors",
  TEXT_VARIANTS({ size: "sm", weight: "semibold" }),
  FOCUS_VISIBLE_VARIANTS(),
  DISABLED_STATE_VARIANTS({ target: "native" }),
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
);
const ACTION_SIZE_VALUES = {
  xs: "h-6 rounded-md p-2 text-xs",
  sm: "h-9 rounded-md px-3",
  md: "h-10 px-4 py-2",
  lg: "h-11 rounded-md px-4",
  xl: "h-14 rounded-md px-9 py-3 text-lg",
  default: "h-10 px-4 py-2",
  icon: "size-10",
  "icon-xs": "size-8",
  "icon-sm": "size-9",
  "icon-lg": "size-11",
} as const satisfies Record<
  UiSize | "default" | "icon" | "icon-xs" | "icon-sm" | "icon-lg",
  string
>;

/** Shared color/treatment/size contract for Button and ButtonLink. */
export const ACTION_VARIANTS = cva(ACTION_BASE, {
  variants: {
    variant: {
      ...ACTION_MATRIX_VALUES,
      ...({
        default: ACTION_MATRIX_VALUES.primary,
        "primary-default": ACTION_MATRIX_VALUES.primary,
        "secondary-default": ACTION_MATRIX_VALUES.secondary,
        "gray-default": ACTION_MATRIX_VALUES.gray,
        "destructive-default": ACTION_MATRIX_VALUES.destructive,
        "success-default": ACTION_MATRIX_VALUES.success,
        "caution-default": ACTION_MATRIX_VALUES.caution,
        secondary: ACTION_MATRIX_VALUES.secondary,
        destructive: ACTION_MATRIX_VALUES.destructive,
        outline: ACTION_MATRIX_VALUES["primary-outline"],
        ghost: ACTION_MATRIX_VALUES["primary-ghost"],
        tonal: ACTION_MATRIX_VALUES["primary-tonal"],
        "ghost-destructive": ACTION_MATRIX_VALUES["destructive-ghost"],
        inline: ACTION_MATRIX_VALUES["primary-link"],
        underline: ACTION_MATRIX_VALUES["primary-underline"],
        "dashboard-nav":
          "data-[state=active]:text-primary-9 min-h-14 rounded-none border-0 bg-transparent text-[0.93rem] font-semibold tracking-[-0.01em] text-white/80 hover:bg-transparent hover:text-white/95",
        plain: "bg-transparent text-primary-12 hover:underline",
        authority: "bg-primary-12 text-primary-1 hover:bg-primary-10",
        connection:
          "rounded-lg border border-primary-12/15 px-4 py-2 text-sm font-semibold text-primary-12 hover:border-primary-5 hover:text-primary-10",
        drawer:
          "group flex min-h-16 w-full items-start justify-start gap-3 rounded-lg px-3 py-3 text-left whitespace-normal hover:bg-primary-3 hover:text-primary-12",
      } as const),
    },
    size: ACTION_SIZE_VALUES,
  },
  compoundVariants: [
    {
      variant: "primary-default",
      size: "md",
      class:
        "border-primary-10 bg-primary-9 shadow-primary-9/15 hover:bg-primary-10 min-h-12 min-w-44 px-5 text-sm font-extrabold text-white shadow-lg hover:-translate-y-px",
    },
  ],
  defaultVariants: { variant: "primary", size: "md" },
});
const TOGGLE_SELECTED_COLORS: Record<UiColor, string> = {
  primary: "data-[state=on]:bg-primary-4 data-[state=on]:text-primary-12",
  secondary: "data-[state=on]:bg-secondary-4 data-[state=on]:text-secondary-12",
  gray: "data-[state=on]:bg-gray-3 data-[state=on]:text-gray-12",
  destructive:
    "data-[state=on]:bg-rose-100 data-[state=on]:text-rose-900 dark:data-[state=on]:bg-rose-950 dark:data-[state=on]:text-rose-100",
  success:
    "data-[state=on]:bg-emerald-100 data-[state=on]:text-emerald-900 dark:data-[state=on]:bg-emerald-950 dark:data-[state=on]:text-emerald-100",
  caution:
    "data-[state=on]:bg-amber-100 data-[state=on]:text-amber-900 dark:data-[state=on]:bg-amber-950 dark:data-[state=on]:text-amber-100",
};
const TOGGLE_MATRIX_VALUES = Object.fromEntries(
  Object.entries(ACTION_MATRIX_VALUES)
    .filter(
      ([variant]) =>
        !variant.endsWith("-link") && !variant.endsWith("-underline"),
    )
    .map(([variant, className]) => [
      variant,
      cn(
        className,
        TOGGLE_SELECTED_COLORS[
          variant === "ghost-destructive" || variant.startsWith("destructive")
            ? "destructive"
            : variant === "secondary" || variant.startsWith("secondary")
              ? "secondary"
              : variant === "gray" || variant.startsWith("gray")
                ? "gray"
                : variant === "success" || variant.startsWith("success")
                  ? "success"
                  : variant === "caution" || variant.startsWith("caution")
                    ? "caution"
                    : "primary"
        ],
      ),
    ]),
) as Record<
  | /* Toggle color/treatment keys, excluding link treatments. */ UiColor
  | `${UiColor}-${Extract<UiType, "outline" | "ghost" | "tonal">}`,
  string
>;

/** Toggle and toggle-group controls reuse the action matrix and add pressed colors. */
export const TOGGLE_VARIANTS = cva(cn(ACTION_BASE, "border border-primary-6"), {
  variants: {
    variant: {
      ...TOGGLE_MATRIX_VALUES,
      default: TOGGLE_MATRIX_VALUES.primary,
      outline: TOGGLE_MATRIX_VALUES["primary-outline"],
      ghost: TOGGLE_MATRIX_VALUES["primary-ghost"],
      tonal: TOGGLE_MATRIX_VALUES["primary-tonal"],
      "ghost-destructive": cn(
        ACTION_MATRIX_VALUES["destructive-ghost"],
        TOGGLE_SELECTED_COLORS.destructive,
      ),
    },
    size: {
      xs: ACTION_SIZE_VALUES.xs,
      sm: ACTION_SIZE_VALUES.sm,
      md: ACTION_SIZE_VALUES.md,
      lg: ACTION_SIZE_VALUES.lg,
      xl: ACTION_SIZE_VALUES.xl,
    } as const satisfies Record<UiSize, string>,
  },
  defaultVariants: { variant: "primary", size: "md" },
});

/*//////////////////////////////////////////////////
SURFACE CONTRACTS
//////////////////////////////////////////////////*/

const SURFACE_MATRIX_VALUES = flattenColorTypeGrid({
  primary: {
    default: "border-primary-6 bg-primary-9 text-primary-1",
    outline: "border-primary-6 bg-primary-1 text-primary-12",
    ghost: "border-transparent bg-transparent text-primary-12",
    tonal: "border-primary-9/30 bg-primary-9/5 text-primary-12",
    saturated: "border-primary-11 bg-primary-10 text-primary-1",
    glass:
      "border border-white/15 bg-primary-9/35 text-white shadow-lg backdrop-blur-xl",
  },
  secondary: {
    default: "border-secondary-6 bg-secondary-7 text-secondary-1",
    outline: "border-secondary-6 bg-secondary-1 text-secondary-12",
    ghost: "border-transparent bg-transparent text-secondary-12",
    tonal: "border-secondary-6 bg-secondary-2 text-secondary-11",
    saturated: "border-secondary-11 bg-secondary-7 text-secondary-1",
    glass:
      "border border-white/15 bg-secondary-9/35 text-white shadow-lg backdrop-blur-xl",
  },
  gray: {
    default: "border-gray-7 bg-gray-9 text-white",
    outline: "border-gray-6 bg-white text-gray-12 dark:bg-black",
    ghost: "border-transparent bg-transparent text-gray-12",
    tonal: "border-gray-6 bg-gray-2 text-gray-11",
    saturated: "border-gray-11 bg-gray-9 text-white",
    glass:
      "border border-white/15 bg-gray-9/30 text-white shadow-lg backdrop-blur-xl",
  },
  destructive: {
    default:
      "border-red-500 bg-red-50 text-red-950 dark:border-red-800 dark:bg-red-950 dark:text-red-50",
    outline:
      "border-red-500 bg-transparent text-red-900 dark:border-red-800 dark:text-red-100",
    ghost: "border-transparent bg-transparent text-red-900 dark:text-red-100",
    tonal:
      "border-red-300 bg-red-50/70 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100",
    saturated:
      "border-rose-700 bg-rose-600 text-white dark:border-rose-800 dark:bg-rose-900",
    glass:
      "border border-white/15 bg-red-700/30 text-white shadow-lg backdrop-blur-xl",
  },
  success: {
    default:
      "border border-emerald-300 bg-white text-emerald-900 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100",
    outline:
      "border-2 border-emerald-400 bg-transparent text-emerald-900 dark:border-emerald-700 dark:text-emerald-100",
    ghost: "border-0 bg-transparent text-emerald-900 dark:text-emerald-100",
    tonal:
      "border border-emerald-300 bg-emerald-50/60 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100",
    saturated: "border-emerald-800 bg-emerald-700 text-white",
    glass:
      "border border-white/15 bg-emerald-700/30 text-white shadow-lg backdrop-blur-xl",
  },
  caution: {
    default:
      "border border-amber-300 bg-white text-amber-950 shadow-sm dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100",
    outline:
      "border-2 border-amber-400 bg-transparent text-amber-950 dark:border-amber-700 dark:text-amber-100",
    ghost: "border-0 bg-transparent text-amber-950 dark:text-amber-100",
    tonal:
      "border border-amber-300 bg-amber-50/60 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100",
    saturated: "border-amber-800 bg-amber-700 text-white",
    glass:
      "border border-white/15 bg-amber-700/30 text-white shadow-lg backdrop-blur-xl",
  },
} satisfies Record<
  UiColor,
  Record<
    // Treatments that can be applied to surfaces.
    Exclude<UiType, "link" | "underline">,
    string
  >
>) as Record<
  UiColor | `${UiColor}-${Exclude<UiType, "default" | "link" | "underline">}`,
  string
>;

/** Shared surface palette used by cards, alerts, and floating panels. */
export const SURFACE_VARIANTS = cva("", {
  variants: {
    variant: {
      ...SURFACE_MATRIX_VALUES,
      ...({
        "primary-default": SURFACE_MATRIX_VALUES.primary,
        "secondary-default": SURFACE_MATRIX_VALUES.secondary,
        "gray-default": SURFACE_MATRIX_VALUES.gray,
        "destructive-default": SURFACE_MATRIX_VALUES.destructive,
        "success-default": SURFACE_MATRIX_VALUES.success,
        "caution-default": SURFACE_MATRIX_VALUES.caution,
        correct:
          "border-emerald-700 bg-emerald-50 text-emerald-950 dark:border-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-50",
        error: SURFACE_MATRIX_VALUES.destructive,
        info: "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-100",
        success:
          "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100",
        warning:
          "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100",
        transparent: "",
        dark: "border border-white/10 bg-white/5 text-white",
      } as const),
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    } satisfies Record<UiSize, string>,
  },
  defaultVariants: { variant: "primary-tonal", size: "md" },
});

/*//////////////////////////////////////////////////
FORM CONTROL CONTRACTS
//////////////////////////////////////////////////*/

const FORM_CONTROL_MATRIX_VALUES = flattenColorTypeGrid({
  primary: {
    default:
      "border-primary-6 bg-white text-primary-12 placeholder:text-primary-11 dark:bg-black",
    outline:
      "border-primary-6 bg-transparent text-primary-12 placeholder:text-primary-11",
    ghost:
      "border-transparent bg-transparent text-primary-12 placeholder:text-primary-11",
    tonal:
      "border-primary-6 bg-primary-2 text-primary-12 placeholder:text-primary-11",
  },
  secondary: {
    default:
      "border-secondary-6 bg-white text-secondary-12 placeholder:text-secondary-11 dark:bg-black",
    outline:
      "border-secondary-6 bg-transparent text-secondary-12 placeholder:text-secondary-11",
    ghost:
      "border-transparent bg-transparent text-secondary-12 placeholder:text-secondary-11",
    tonal:
      "border-secondary-6 bg-secondary-2 text-secondary-12 placeholder:text-secondary-11",
  },
  gray: {
    default:
      "border-gray-6 bg-white text-gray-12 placeholder:text-gray-10 dark:bg-black",
    outline:
      "border-gray-6 bg-transparent text-gray-12 placeholder:text-gray-10",
    ghost:
      "border-transparent bg-transparent text-gray-12 placeholder:text-gray-10",
    tonal: "border-gray-6 bg-gray-2 text-gray-12 placeholder:text-gray-10",
  },
  destructive: {
    default:
      "border-red-600 bg-white text-red-950 placeholder:text-red-600 dark:bg-black dark:text-red-50",
    outline:
      "border-red-600 bg-transparent text-red-950 placeholder:text-red-600 dark:text-red-50",
    ghost:
      "border-transparent bg-transparent text-red-950 placeholder:text-red-600 dark:text-red-50",
    tonal:
      "border-red-600/50 bg-red-50 text-red-950 placeholder:text-red-600 dark:bg-red-950/50 dark:text-red-50",
  },
  success: {
    default:
      "border-emerald-600 bg-white text-emerald-950 placeholder:text-emerald-700 dark:bg-black dark:text-emerald-50",
    outline:
      "border-emerald-600 bg-transparent text-emerald-950 placeholder:text-emerald-700 dark:text-emerald-50",
    ghost:
      "border-transparent bg-transparent text-emerald-950 placeholder:text-emerald-700 dark:text-emerald-50",
    tonal:
      "border-emerald-600/50 bg-emerald-50 text-emerald-950 placeholder:text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-50",
  },
  caution: {
    default:
      "border-amber-600 bg-white text-amber-950 placeholder:text-amber-700 dark:bg-black dark:text-amber-50",
    outline:
      "border-amber-600 bg-transparent text-amber-950 placeholder:text-amber-700 dark:text-amber-50",
    ghost:
      "border-transparent bg-transparent text-amber-950 placeholder:text-amber-700 dark:text-amber-50",
    tonal:
      "border-amber-600/50 bg-amber-50 text-amber-950 placeholder:text-amber-700 dark:bg-amber-950/50 dark:text-amber-50",
  },
} satisfies Record<
  UiColor,
  Record<
    // Treatments supported by form controls.
    Extract<UiType, "default" | "outline" | "ghost" | "tonal">,
    string
  >
>) as Record<FormControlVariant, string>;

/** Shared color/treatment/size contract for inputs, selects, and textareas. */
export const FORM_CONTROL_VARIANTS = cva(
  cn(
    "aria-invalid:border-red-600 aria-invalid:ring-red-600 flex w-full min-w-0 rounded-md border transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-primary-11",
    FOCUS_VISIBLE_VARIANTS(),
    DISABLED_STATE_VARIANTS({ target: "native" }),
  ),
  {
    variants: {
      variant: {
        ...FORM_CONTROL_MATRIX_VALUES,
        ghost: FORM_CONTROL_MATRIX_VALUES["primary-ghost"],
      },
      size: {
        xs: "h-6 px-2 py-1 text-xs",
        sm: "h-9 px-3 py-1.5 text-sm",
        md: "h-10 px-3 py-2 text-base",
        lg: "h-11 px-4 py-3 text-lg",
        xl: "h-14 px-4 py-3 text-lg",
      } as const satisfies Record<UiSize, string>,
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

/*//////////////////////////////////////////////////
OVERLAYS AND MENUS
//////////////////////////////////////////////////*/

/** Shared neutral surface for positioned overlay content. */
export const OVERLAY_SURFACE_VARIANTS = cva(
  cn(SURFACE_VARIANTS({ variant: "gray-outline" }), "text-gray-12 shadow-lg"),
);
/** Shared entry/exit motion for Radix overlay content. */
export const OVERLAY_MOTION_VARIANTS = cva(
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
);
/** Shared slide direction for content positioned around a Radix trigger. */
export const RADIX_SIDE_POSITION_VARIANTS = cva(
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
);

/** Shared destructive tone for dropdown and context-menu items. */
export const menuItemVariants = cva("", {
  variants: {
    intent: {
      default: "",
      destructive:
        "text-red-600 data-[highlighted]:bg-red-100/80 dark:text-red-400 dark:data-[highlighted]:bg-red-950 dark:data-[highlighted]:text-red-100",
    },
  },
  defaultVariants: { intent: "default" },
});
/** Shared highlighted state for menu items. */
export const MENU_ITEM =
  "data-[highlighted]:bg-primary-3 dark:data-[highlighted]:text-primary-12";
/** Shared positioning and alignment for check and radio indicators in menu items. */
export const MENU_ITEM_INDICATOR =
  "absolute left-2 flex size-3.5 items-center justify-center";
