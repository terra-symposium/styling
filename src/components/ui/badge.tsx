/**
 * src/components/ui/badge.tsx
 * https://ui.shadcn.com/docs/components/badge
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

// DATA
import { FOCUS_VISIBLE_VARIANTS, SURFACE_VARIANTS } from "./variants.js";

// TYPES
import type { SurfaceMatrixVariant, UiColor, UiSize } from "./types.js";
type BadgeVariant = SurfaceMatrixVariant | `${UiColor}-default`;
const BADGE_COLORS: readonly UiColor[] = [
  "primary",
  "secondary",
  "gray",
  "destructive",
  "success",
  "caution",
];
const BADGE_TREATMENTS = [
  "default",
  "outline",
  "ghost",
  "tonal",
  "saturated",
  "glass",
] as const;
export const BADGE_VARIANT_VALUES = Object.fromEntries(
  BADGE_COLORS.flatMap((color) => {
    const matrix = BADGE_TREATMENTS.map((treatment) => {
      const variant = `${color}-${treatment}` as BadgeVariant;
      const surfaceVariant =
        treatment === "default"
          ? (`${color}-default` as BadgeVariant)
          : variant;
      return [
        surfaceVariant,
        SURFACE_VARIANTS({ variant: surfaceVariant }),
      ] as const;
    });
    return [...matrix, [color, SURFACE_VARIANTS({ variant: color })] as const];
  }),
) as Record<BadgeVariant | UiColor, string>;

/*//////////////////////////////////////////////////
COMPONENT
//////////////////////////////////////////////////*/

/**
 * Renders a badge using the selected palette, size, and shape.
 *
 * @param props - Badge styles and element attributes.
 *
 * @return The styled badge element.
 */
function Badge({
  className,
  variant = "primary-default",
  size,
  rounded,
  asChild = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: BadgeVariant;
  asChild?: boolean;
  size?: UiSize;
  rounded?: "full" | "md" | "sm" | "none";
}): React.JSX.Element {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(
        cva(
          "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-red-700 aria-invalid:ring-red-700/20 dark:aria-invalid:ring-red-700/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
          {
            variants: {
              variant: {
                ...BADGE_VARIANT_VALUES,
              },
              size: {
                xs: "px-1.5 py-0.5 text-[0.65rem]",
                sm: "px-2 py-0.5 text-xs",
                md: "px-3 py-1 text-sm",
                lg: "px-3 py-1 text-sm",
                xl: "px-4 py-2 text-sm font-bold",
              },
              rounded: {
                full: "rounded-full",
                md: "rounded-md",
                sm: "rounded-sm",
                none: "rounded-none",
              },
            },
            defaultVariants: {
              variant: "primary",
              size: "md",
              rounded: "full",
            },
          },
        )({ variant, size, rounded, className }),
        FOCUS_VISIBLE_VARIANTS(),
      )}
      {...props}
    />
  );
}
Badge.displayName = "Badge";
export { Badge };
