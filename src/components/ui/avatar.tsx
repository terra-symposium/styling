/**
 * src/components/ui/avatar.tsx
 * https://ui.shadcn.com/docs/components/avatar
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';
import { getInitials } from '../../lib/avatar.js';

// COMPONENTS
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

// TYPES
import type { UiSize } from './types.js';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

// terra-quality-ignore single-use -- Keep size classes in one module-level map so avatar renders reuse the same values.
const AVATAR_SIZE_CLASSES: Record<UiSize, string> = {
	xs: 'size-6',
	sm: 'size-8',
	md: 'size-10',
	lg: 'size-12',
	xl: 'size-16',
};

// terra-quality-ignore single-use -- Keep renderAvatarRoot as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the sized avatar root while preserving forwarded HTML attributes.
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
	const { className, size = 'md', ...props } = avatarProps;
	return <AvatarPrimitive.Root ref={ref} data-slot='avatar' className={cn('relative flex shrink-0 overflow-hidden rounded-full', AVATAR_SIZE_CLASSES[size], className)} {...props} />;
}

// terra-quality-ignore single-use -- Keep renderAvatarImage as a named declaration so its authored TSDoc stays attached. TSDoc: Renders an avatar image that preserves its square aspect ratio.
/** Renders an avatar image that preserves its square aspect ratio.
 * @param imageProps - Radix image attributes and optional classes.
 * @param ref - Ref forwarded to the Radix avatar image.
 * @return The full-size avatar image element.
 */
function renderAvatarImage(imageProps: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>, ref: React.ForwardedRef<React.ElementRef<typeof AvatarPrimitive.Image>>): React.JSX.Element {
	const { className, ...props } = imageProps;
	return <AvatarPrimitive.Image ref={ref} data-slot='avatar-image' className={cn('aspect-square size-full border-none', className)} {...props} />;
}

// terra-quality-ignore single-use -- Keep renderAvatarFallback as a named declaration so its authored TSDoc stays attached. TSDoc: Renders centered fallback content for an unavailable avatar image.
/** Renders centered fallback content for an unavailable avatar image.
 * @param fallbackProps - Radix fallback content and optional classes.
 * @param ref - Ref forwarded to the Radix avatar fallback.
 * @return The centered avatar fallback element.
 */
function renderAvatarFallback(
	fallbackProps: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>,
	ref: React.ForwardedRef<React.ElementRef<typeof AvatarPrimitive.Fallback>>,
): React.JSX.Element {
	const { className, ...props } = fallbackProps;
	return <AvatarPrimitive.Fallback ref={ref} data-slot='avatar-fallback' className={cn('flex size-full items-center justify-center rounded-full bg-primary-3', className)} {...props} />;
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
Avatar.displayName = 'Avatar';

/** Image that fills the avatar root while preserving its square aspect ratio. */
const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(renderAvatarImage);
AvatarImage.displayName = 'AvatarImage';

/** Centered content shown when the avatar image is unavailable. */
const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>>(renderAvatarFallback);
AvatarFallback.displayName = 'AvatarFallback';
/** User identity avatar retained from the original Terra component set.
 * @param user - User identity and image metadata.
 * @param className - Optional avatar classes.
 * @param pictureVersion - Optional image cache version.
 * @return User avatar with an image or initials fallback.
 */
export function UserAvatar({
	user,
	className,
	pictureVersion,
}: {
	user:
		| {
				id: string;
				firstName?: string | null;
				lastName?: string | null;
				profilePictureUrl?: string | null;
				image?: string | null;
				profilePictureKey?: string | null;
				email?: string | null;
				name?: string | null;
		  }
		| null
		| undefined;
	className?: string;
	pictureVersion?: string | number;
}): React.JSX.Element {
	const src = user
		? ((user.profilePictureKey ? `/api/auth?action=profile-picture&userId=${encodeURIComponent(user.id)}` : (user.image ?? undefined)) ?? user.profilePictureUrl ?? undefined)
		: undefined;
	return (
		<Avatar className={cn('size-7 rounded-full border border-primary-2', className)}>
			<AvatarImage
				src={src && pictureVersion ? `${src}${src.includes('?') ? '&' : '?'}v=${pictureVersion}` : src}
				alt={(user && [user.firstName, user.lastName].filter(Boolean).join(' ')) || 'User avatar'}
			/>
			<AvatarFallback className='bg-primary-9 pt-px !text-[13px] font-light uppercase text-primary-1 dark:text-primary-12'>
				<span className='inline-block no-underline decoration-transparent'>{getInitials(user ?? {})}</span>
			</AvatarFallback>
		</Avatar>
	);
}

/** Organisation identity avatar retained from the original Terra component set.
 * @param org - Organisation identity and image metadata.
 * @param className - Optional avatar classes.
 * @param pictureVersion - Optional image cache version.
 * @return Organisation avatar with an image or initials fallback.
 */
export function OrganisationAvatar({
	organisation: org,
	className,
	pictureVersion,
}: {
	organisation: { id: string; name?: string | null; profilePictureKey?: string | null } | null | undefined;
	className?: string;
	pictureVersion?: string | number;
}): React.JSX.Element {
	const src = org?.profilePictureKey ? `/api/auth?action=organisation-picture&orgId=${encodeURIComponent(org.id)}` : undefined;
	return (
		<Avatar className={cn('size-9 rounded-full border border-primary-2', className)}>
			<AvatarImage src={src && pictureVersion ? `${src}?v=${pictureVersion}` : src} alt={org?.name ?? 'Organisation avatar'} />
			<AvatarFallback className='bg-primary-9 pt-px !text-[13px] font-light uppercase text-primary-1 dark:text-primary-12'>
				<span className='inline-block no-underline decoration-transparent'>{getInitials({ name: org?.name })}</span>
			</AvatarFallback>
		</Avatar>
	);
}

export { Avatar, AvatarImage, AvatarFallback };
