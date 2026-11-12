/**
 * src/components/ui/sonner.tsx
 * https://ui.shadcn.com/docs/components/sonner
 * Toast notification renderer themed with shared Styling tokens and icons.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// COMPONENTS
import {
  CheckmarkFilled,
  ErrorFilled,
  Information,
  Renew,
  WarningAlt,
} from "@carbon/icons-react";
import { Toaster as Sonner } from "sonner";

// TYPES
import type * as React from "react";
import type { ToasterProps } from "sonner";

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Renders Sonner notifications with shared palette defaults and Carbon status icons.
 *
 * @param settings - Sonner settings spread after shared defaults, so supplied values can override them.
 *
 * @return The configured Sonner notification renderer.
 */
function Toaster(settings: ToasterProps): React.JSX.Element {
  return (
    <Sonner
      theme="system"
      richColors
      className="toaster group"
      icons={{
        success: <CheckmarkFilled className="size-4" />,
        info: <Information className="size-4" />,
        warning: <WarningAlt className="size-4" />,
        error: <ErrorFilled className="size-4" />,
        loading: <Renew className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "rgb(var(--primary-1))",
          "--normal-text": "rgb(var(--primary-12))",
          "--normal-border": "rgb(var(--primary-4))",
          "--error-bg": "#dc2626",
          "--error-border": "#b91c1c",
          "--error-text": "#ffffff",
          "--border-radius": "0.7rem",
        } as React.CSSProperties
      }
      toastOptions={{ classNames: { toast: "rounded-lg border shadow-lg" } }}
      {...settings}
    />
  );
}
export { Toaster };
