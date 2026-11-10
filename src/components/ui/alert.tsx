/**
 * src/components/ui/alert.tsx
 * https://ui.shadcn.com/docs/components/alert
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { cva } from "class-variance-authority";

// COMPONENTS
import * as React from "react";

// DATA
import { SURFACE_VARIANTS } from "./variants.js";

// TYPES
import type { VariantProps } from "class-variance-authority";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Visual container for contextual feedback msgs.
 *
 * @param variant - Visual variant for the alert.
 *
 * @returns A styled alert wrapper el.
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: VariantProps<typeof SURFACE_VARIANTS>["variant"] | "default";
  }
>(({ className, variant = "default", ...props }, ref): React.JSX.Element => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      cva(
        "relative mb-6 w-full rounded-lg border p-4 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
      )(),
      SURFACE_VARIANTS({
        variant: variant === "default" ? "gray-outline" : variant,
      }),
      className,
    )}
    {...props}
  />
));

/**
 * Heading text for an alert, used to summarise the msg content.
 *
 * @returns A styled heading el for the alert.
 */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref): React.JSX.Element => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));

/**
 * Supporting body content for an alert, providing detailed ctx.
 *
 * @returns A styled container for alert description text.
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref): React.JSX.Element => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

// VARIANT
type AlertStatusProps = {
  children?: React.ReactNode;
  className?: string;
  description?: React.ReactNode;
  id?: string;
  title?: React.ReactNode;
};

/**
 * Builds a status-specific alert from the shared alert primitives.
 *
 * @param variant - Surface variant applied to the alert.
 * @param defaultTitle - Status title used when no custom title is supplied.
 * @param props - Optional alert title, description, content, ID, and class name.
 *
 * @return An alert with a heading and supporting description.
 */
function statusAlert(
  variant: NonNullable<VariantProps<typeof SURFACE_VARIANTS>["variant"]>,
  defaultTitle: string,
  {
    className,
    children,
    description,
    id,
    title = defaultTitle,
  }: AlertStatusProps,
): React.JSX.Element {
  return (
    <Alert
      id={id}
      variant={variant}
      className={cn("docs-block my-0 mb-2 flow-root", className)}
    >
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description ?? children}</AlertDescription>
    </Alert>
  );
}

/**
 * Renders an alert for destructive error feedback.
 *
 * @param props - Optional title, description, body content, ID, and class name.
 *
 * @return A destructive alert titled `Error` unless a custom title is provided.
 */
export function AlertError(props: AlertStatusProps): React.JSX.Element {
  return statusAlert("destructive-tonal", "Error", props);
}

/**
 * Renders an alert for successful completion feedback.
 *
 * @param props - Optional title, description, body content, ID, and class name.
 *
 * @return A success alert titled `Success` unless a custom title is provided.
 */
export function AlertSuccess(props: AlertStatusProps): React.JSX.Element {
  return statusAlert("success-tonal", "Success", props);
}

/**
 * Renders an alert for warnings that need attention.
 *
 * @param props - Optional title, description, body content, ID, and class name.
 *
 * @return A caution-toned alert titled `Warning` unless a custom title is provided.
 */
export function AlertWarning(props: AlertStatusProps): React.JSX.Element {
  return statusAlert("caution-tonal", "Warning", props);
}

/**
 * Renders an informational alert.
 *
 * @param props - Optional title, description, body content, ID, and class name.
 *
 * @return A secondary-toned alert titled `Information` unless a custom title is provided.
 */
export function AlertInfo(props: AlertStatusProps): React.JSX.Element {
  return statusAlert("secondary-tonal", "Information", props);
}
Alert.displayName = "Alert";
AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";
AlertError.displayName = "AlertError";
export { Alert, AlertTitle, AlertDescription };
