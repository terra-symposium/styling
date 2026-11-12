/**
 * src/components/ui/resizable.tsx
 * https://ui.shadcn.com/docs/components/resizable
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as React from "react";
import { Draggable as GripVerticalIcon } from "@carbon/icons-react";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Resizable grip.
 *
 * @param withHandle - Whether the resize handle should be visible.
 * @param className - Additional classes applied to the grip.
 * @param attributes - Remaining div attributes forwarded to the grip.
 *
 * @return A vertical separator with an optional visible grip.
 */
function ResizableGrip({
  withHandle,
  className,
  ...attributes
}: React.HTMLAttributes<HTMLDivElement> & {
  withHandle?: boolean;
}): React.JSX.Element {
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      className={cn(
        "relative flex w-px items-center justify-center bg-primary-6 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        className,
      )}
      {...attributes}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-primary-6 bg-primary-2">
          <GripVerticalIcon className="size-2.5" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
export { ResizableGrip };
