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
 * @param props - SVG attributes forwarded to the loading icon.
 *
 * @return An SVG status icon labelled `Loading`.
 */
function Spinner({
  className,
  ...props
}: React.ComponentProps<"svg">): React.JSX.Element {
  return (
    <LoadIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}
Spinner.displayName = "Spinner";
export { Spinner };
