/**
 * src/components/ui/types.ts
 * Shared component props and style contracts for the UI package.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// TYPES
import type * as CommandPrimitive from "cmdk";
import type * as DialogPrimitive from "@radix-ui/react-dialog";
import type * as EmblaCarouselReact from "embla-carousel-react";
import type * as React from "react";
import type { ACTION_VARIANTS } from "./variants.js";
import type { FieldPath, FieldValues } from "react-hook-form";
import type { VariantProps } from "class-variance-authority";

/*//////////////////////////////////////////////////
COMPONENT CONTRACTS
//////////////////////////////////////////////////*/

// BUTTONS
/** Action styles, including color treatments and named navigation or specialized-control variants. */
export type ButtonVariant =
  | UiColor
  | `${UiColor}-${Exclude<UiType, "saturated">}`
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "tonal"
  | "underline"
  | "ghost-destructive"
  | "dashboard-nav"
  | "plain"
  | "authority"
  | "connection"
  | "drawer";
/** Alias used by component props named `buttonVariant`. */
export type ButtonVariantProps = ButtonVariant;
/** Alias for the shared button contract used by button-adjacent controls. */
export type UiButtonButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    Omit<VariantProps<typeof ACTION_VARIANTS>, "variant"> & {
      variant?: ButtonVariant;
      asChild?: boolean;
      loading?: boolean;
      loadingText?: React.ReactNode;
      menuTrigger?: "active" | "inactive";
    };

// CALENDAR

// CARDS
/** Props for a card rendered as a link; `href` is required. */
export type AnchorCardProps = {
  variant?: CardVariant;
  size?: Size;
  inverse?: boolean;
  interactive?: boolean;
  printed?: boolean;
  disabled?: boolean;
} & CardBehaviorProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type CardBehaviorProps = {
  asChild?: boolean;
  collapsible?: boolean;
  disclosureVariant?: "card" | "section";
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
/** Props for cards that render as a div or, when `href` is present, as an anchor. */
export type CardProps =
  | (({
      variant?: CardVariant;
      size?: Size;
      inverse?: boolean;
      interactive?: boolean;
      printed?: boolean;
      disabled?: boolean;
    } & CardBehaviorProps) &
      React.HTMLAttributes<HTMLDivElement> & { href?: never })
  | AnchorCardProps;
/** Props for the summary disclosure trigger inside a collapsible card. */
export type CardSummaryProps = Omit<React.ComponentProps<"button">, "size"> & {
  variant?:
    | "default"
    | "surface"
    | "bordered"
    | "section"
    | "card"
    | "compact"
    | "accordion"
    | "accordionMuted"
    | "pill"
    | "tiny";
  buttonVariant?: ButtonVariantProps;
  size?: ButtonSize;
};

// CAROUSEL
/** Embla API exposed by the carousel hook. */
export type CarouselApi = EmblaCarouselReact.UseEmblaCarouselType[1];
/** State and navigation helpers shared with carousel descendants. */
export type CarouselCtxProps = {
  carouselRef: ReturnType<typeof EmblaCarouselReact.default>[0];
  api: ReturnType<typeof EmblaCarouselReact.default>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;
/** Embla options, axis choice, plugins, and API callback accepted by the carousel root. */
export type CarouselProps = {
  opts?: UseCarouselParams[0];
  plugins?: UseCarouselParams[1];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};
type UseCarouselParams = Parameters<typeof EmblaCarouselReact.default>;

// COMBOBOX
/** Search option with a string key, displayable label, and optional caller data. */
export type UiComboboxOption = {
  value: string;
  label: React.ReactNode;
  [key: string]: string | number | React.ReactNode;
};

// COMMAND
/** Dialog state and attributes accepted by the command dialog, plus its size and content class. */
export type CommandDialogProps = DialogPrimitive.DialogProps & {
  size?: Size;
  className?: string;
};
/** Command input attributes with controlled value, change, and clear handlers. */
export type CommandInputProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Command.Input
> & {
  value?: string;
  onValueChange?: ((value: string) => void) | undefined;
  onClear?: (() => void) | undefined;
};

// FORMS
/** Field name stored in the React Hook Form context for a rendered control. */
export type FormFieldCtxVal<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName };
/** Generated identifier used to associate a form item with its control and messages. */
export type IdArgs = { id: string };
/** Shared input attributes with optional adornments, clearing, value conversion, and control styling. */
export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "prefix"
> & {
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  onClear?: () => void;
  setValueAs?: (value: string) => unknown;
  variant?: FormControlVariant | "ghost";
  size?: UiSize;
};

// SIDEBAR
/** Desktop sidebar state and controls, including the separate mobile-open state. */
export type SidebarCtxProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

/*//////////////////////////////////////////////////
STYLE CONTRACTS
//////////////////////////////////////////////////*/

// COLOR AND TREATMENT VARIANTS
/** Color/treatment variant alias used by feedback surfaces. */
export type FeedbackTone = SurfaceMatrixVariant;
/** Bare colors and color variants supported by form controls. */
export type FormControlVariant =
  UiColor | `${UiColor}-${Extract<UiType, "outline" | "ghost" | "tonal">}`;
/** Surface color/treatment combinations, excluding underline treatments. */
export type SurfaceMatrixVariant = `${UiColor}-${Exclude<UiType, "underline">}`;
/** Surface choices including matrix variants and named semantic treatments. */
export type SurfaceVariant =
  | UiColor
  | SurfaceMatrixVariant
  | "transparent"
  | "dark"
  | "error"
  | "correct"
  | "info"
  | "success"
  | "warning";
/** Card color/treatment combinations exclude a default treatment; cards default to primary-tonal. */
export type CardVariant =
  | `${UiColor}-${Exclude<UiType, "default" | "underline">}`
  | "transparent"
  | "dark"
  | "error"
  | "correct"
  | "info"
  | "success"
  | "warning";
/** Palette colors available to the shared UI style matrices. */
export type UiColor =
  "primary" | "secondary" | "gray" | "destructive" | "success" | "caution";

/** Visual treatments used to build the shared color variant families. */
export type UiType =
  | "default"
  | "outline"
  | "ghost"
  | "tonal"
  | "saturated"
  | "underline"
  | "glass";

// SIZES
/** Button dimensions, including icon-only sizes beyond the shared scale. */
export type ButtonSize =
  UiSize | "default" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
/** Shared size scale without the extra-large preset. */
export type CompactSize = Exclude<Size, "xl">;
/** Select sizing; `default` inherits the size provided by the root select. */
export type SelectSize = "default" | Size;
/** Alias for the shared UI size scale. */
export type Size = UiSize;
/** Shared size presets for UI components. */
export type UiSize = "xs" | "sm" | "md" | "lg" | "xl";

// VARIANTS
/** Accordion density presets shared by its root, item, trigger, and content. */
export type Variant = "default" | "sm" | "xs";
