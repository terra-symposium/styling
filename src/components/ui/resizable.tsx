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
 * @param props
 * @param withHandle - Whether the resize handle should be visible.
 *
 * @return A vertical separator with an optional visible grip.
 */
const ResizableGrip = ({
  withHandle,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  withHandle?: boolean;
}): React.JSX.Element => (
  <div
    role="separator"
    aria-orientation="vertical"
    className={cn(
      "relative flex w-px items-center justify-center bg-primary-6 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border border-primary-6 bg-primary-2">
        <GripVerticalIcon className="size-2.5" aria-hidden="true" />
      </div>
    )}
  </div>
);
export { ResizableGrip };
