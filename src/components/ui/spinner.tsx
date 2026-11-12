/**
 * src/components/ui/spinner.tsx
 * https://ui.shadcn.com/docs/components/spinner
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import { Loader2Icon as LoadIcon } from "lucide-react";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Small SVG loading indicator with status semantics.
 *
 * @param className - Additional classes applied to the loading icon.
 * @param svgAttributes - Remaining SVG attributes forwarded to the icon.
 *
 * @return An SVG status icon labelled `Loading`.
 */
function Spinner({
  className,
  ...svgAttributes
}: React.ComponentProps<"svg">): React.JSX.Element {
  return (
    <LoadIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...svgAttributes}
    />
  );
}
Spinner.displayName = "Spinner";
export { Spinner };
