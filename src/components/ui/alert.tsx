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
type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: VariantProps<typeof SURFACE_VARIANTS>["variant"] | "default";
};

/** Renders the alert surface with a forwarded ref and variant classes.
 *
 * @param alertProps Alert attributes, class name, and optional surface variant.
 * @param ref Ref forwarded to the alert element.
 *
 * @return An alert-role div using the selected surface treatment.
 */
function renderAlert(
  alertProps: AlertProps,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, variant = "default", ...elementProps } = alertProps;
  return (
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
      {...elementProps}
    />
  );
}
const Alert = React.forwardRef(renderAlert);

/**
 * Heading text for an alert, used to summarise the msg content.
 *
 * @returns A styled heading el for the alert.
 */
/** Renders the alert heading with its shared text treatment.
 *
 * @param titleProps Heading attributes and optional class name.
 * @param ref Ref forwarded to the heading element.
 *
 * @return A styled alert heading element.
 */
function renderAlertTitle(
  titleProps: React.HTMLAttributes<HTMLHeadingElement>,
  ref: React.ForwardedRef<HTMLParagraphElement>,
): React.JSX.Element {
  const { className, ...elementProps } = titleProps;
  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...elementProps}
    />
  );
}
const AlertTitle = React.forwardRef(renderAlertTitle);

/**
 * Supporting body content for an alert, providing detailed ctx.
 *
 * @returns A styled container for alert description text.
 */
/** Renders the supporting text beneath an alert title.
 *
 * @param descriptionProps Paragraph attributes and optional class name.
 * @param ref Ref forwarded to the description element.
 *
 * @return A styled alert-description div.
 */
function renderAlertDescription(
  descriptionProps: React.HTMLAttributes<HTMLParagraphElement>,
  ref: React.ForwardedRef<HTMLParagraphElement>,
): React.JSX.Element {
  const { className, ...elementProps } = descriptionProps;
  return (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...elementProps}
    />
  );
}
const AlertDescription = React.forwardRef(renderAlertDescription);

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

// VARIANT
/** Content and accessibility properties accepted by each status alert. */
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
 * @param className Optional classes applied to the alert surface.
 * @param children Fallback body content when no description is supplied.
 * @param description Supporting text shown below the status title.
 * @param id Optional id assigned to the alert.
 * @param title Custom status title, defaulting to the status-specific label.
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
 * @param alertProps Optional title, description, body content, id, and class name.
 *
 * @return A destructive alert titled `Error` unless a custom title is provided.
 */
export function AlertError(alertProps: AlertStatusProps): React.JSX.Element {
  return statusAlert("destructive-tonal", "Error", alertProps);
}

/**
 * Renders an alert for successful completion feedback.
 *
 * @param alertProps Optional title, description, body content, id, and class name.
 *
 * @return A success alert titled `Success` unless a custom title is provided.
 */
export function AlertSuccess(alertProps: AlertStatusProps): React.JSX.Element {
  return statusAlert("success-tonal", "Success", alertProps);
}

/**
 * Renders an alert for warnings that need attention.
 *
 * @param alertProps Optional title, description, body content, id, and class name.
 *
 * @return A caution-toned alert titled `Warning` unless a custom title is provided.
 */
export function AlertWarning(alertProps: AlertStatusProps): React.JSX.Element {
  return statusAlert("caution-tonal", "Warning", alertProps);
}

/**
 * Renders an informational alert.
 *
 * @param alertProps Optional title, description, body content, id, and class name.
 *
 * @return A secondary-toned alert titled `Information` unless a custom title is provided.
 */
export function AlertInfo(alertProps: AlertStatusProps): React.JSX.Element {
  return statusAlert("secondary-tonal", "Information", alertProps);
}
Alert.displayName = "Alert";
AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";
AlertError.displayName = "AlertError";
export { Alert, AlertTitle, AlertDescription };
