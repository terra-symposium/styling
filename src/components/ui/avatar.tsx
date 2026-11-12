/**
 * src/components/ui/avatar.tsx
 * https://ui.shadcn.com/docs/components/avatar
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";

// COMPONENTS
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

// TYPES
import type { UiSize } from "./types.js";

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

const AVATAR_SIZE_CLASSES: Record<UiSize, string> = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-16",
};

/** Renders the sized avatar root while preserving forwarded HTML attributes.
 * @param avatarProps - Radix root attributes and the shared avatar size.
 * @param ref - Ref forwarded to the Radix avatar root.
 * @return The clipped avatar root.
 */
function renderAvatarRoot(
  avatarProps: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: UiSize;
  },
  ref: React.ForwardedRef<React.ElementRef<typeof AvatarPrimitive.Root>>,
): React.JSX.Element {
  const { className, size = "md", ...props } = avatarProps;
  return (
    <AvatarPrimitive.Root
      ref={ref}
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        AVATAR_SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
}

/** Renders an avatar image that preserves its square aspect ratio.
 * @param imageProps - Radix image attributes and optional classes.
 * @param ref - Ref forwarded to the Radix avatar image.
 * @return The full-size avatar image element.
 */
function renderAvatarImage(
  imageProps: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>,
  ref: React.ForwardedRef<React.ElementRef<typeof AvatarPrimitive.Image>>,
): React.JSX.Element {
  const { className, ...props } = imageProps;
  return (
    <AvatarPrimitive.Image
      ref={ref}
      data-slot="avatar-image"
      className={cn("aspect-square size-full border-none", className)}
      {...props}
    />
  );
}

/** Renders centered fallback content for an unavailable avatar image.
 * @param fallbackProps - Radix fallback content and optional classes.
 * @param ref - Ref forwarded to the Radix avatar fallback.
 * @return The centered avatar fallback element.
 */
function renderAvatarFallback(
  fallbackProps: React.ComponentPropsWithoutRef<
    typeof AvatarPrimitive.Fallback
  >,
  ref: React.ForwardedRef<React.ElementRef<typeof AvatarPrimitive.Fallback>>,
): React.JSX.Element {
  const { className, ...props } = fallbackProps;
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-primary-3",
        className,
      )}
      {...props}
    />
  );
}

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Avatar root that sizes and clips its image or fallback.
 *
 * @param size - Shared dimension preset applied to the root; defaults to `md`.
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: UiSize;
  }
>(renderAvatarRoot);
Avatar.displayName = AvatarPrimitive.Root.displayName;

/** Image that fills the avatar root while preserving its square aspect ratio. */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(renderAvatarImage);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/** Centered content shown when the avatar image is unavailable. */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(renderAvatarFallback);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
export { Avatar, AvatarImage, AvatarFallback };
