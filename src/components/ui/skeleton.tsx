/**
 * astro/src/components/ui/skeleton.tsx
 * https://ui.shadcn.com/docs/components/skeleton
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Pulsing placeholder hidden from assistive technology by default. Set
 * `aria-label` to expose a custom status, or `aria-hidden={false}` to expose `Loading...`.
 *
 * @param props - Div attributes and optional status name or visibility setting.
 * @returns A pulsing status placeholder.
 */
function Skeleton({
  className,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return (
    <div
      role="status"
      aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
      aria-label={ariaLabel ?? "Loading..."}
      className={cn(
        "animate-pulse rounded-md bg-gray-100 dark:bg-gray-800",
        className,
      )}
      {...props}
    />
  );
}
export { Skeleton };
