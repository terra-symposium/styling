/**
 * src/components/ui/input-otp.tsx
 * https://ui.shadcn.com/docs/components/input-otp
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';

// COMPONENTS
import * as React from 'react';
import { CircleSolid as DotIcon } from '@carbon/icons-react';
import { OTPInput, OTPInputContext } from 'input-otp';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/** OTP input props with an optional class hook for its container. */
type InputOTPProps = React.ComponentPropsWithoutRef<typeof OTPInput> & {
	containerClassName?: string;
};

// terra-quality-ignore single-use -- Keep renderInputOTP as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the one-time-password input with a shared container layout.
/** Renders the one-time-password input with a shared container layout.
 * @param otpProps - OTP input attributes and optional container class.
 * @param ref - Ref forwarded to the underlying OTP input.
 * @return A styled one-time-password input root.
 */
function renderInputOTP(otpProps: InputOTPProps, ref: React.ForwardedRef<React.ElementRef<typeof OTPInput>>): React.JSX.Element {
	const { className, containerClassName, ...props } = otpProps;
	return (
		<OTPInput
			ref={ref}
			containerClassName={cn('flex h-12 items-center gap-4 has-[:disabled]:opacity-50', containerClassName)}
			className={cn('font-bold outline-none disabled:cursor-not-allowed', className)}
			{...props}
		/>
	);
}
/** Root OTP input component for entering one-time passwords. */
const InputOTP = React.forwardRef<React.ElementRef<typeof OTPInput>, InputOTPProps>(renderInputOTP);

/*
 * Container group for OTP input slots.
 */
// terra-quality-ignore single-use -- Keep renderInputOTPGroup as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the container for a related group of OTP character slots.
/** Renders the container for a related group of OTP character slots.
 * @param groupProps - Native div attributes and optional classes.
 * @param ref - Ref forwarded to the slot group element.
 * @return A flex container for OTP slots.
 */
function renderInputOTPGroup(groupProps: React.ComponentPropsWithoutRef<'div'>, ref: React.ForwardedRef<HTMLDivElement>): React.JSX.Element {
	const { className, ...props } = groupProps;
	return <div ref={ref} className={cn('group flex size-full items-center', className)} {...props} />;
}

const InputOTPGroup = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(renderInputOTPGroup);

/*
 * Individual character slot within an OTP input component.
 */
// terra-quality-ignore single-use -- Keep renderInputOTPSlot as a named declaration so its authored TSDoc stays attached. TSDoc: Renders one OTP character and the active fake caret when present.
/** Renders one OTP character and the active fake caret when present.
 * @param slotProps - Native div attributes and the OTP slot index.
 * @param ref - Ref forwarded to the slot element.
 * @return The bordered OTP character slot.
 */
function renderInputOTPSlot(slotProps: React.ComponentPropsWithoutRef<'div'> & { index: number }, ref: React.ForwardedRef<HTMLDivElement>): React.JSX.Element {
	const { index, className, ...props } = slotProps;
	const { char, hasFakeCaret, isActive } = React.useContext(OTPInputContext).slots[index] ?? {};
	return (
		<div
			ref={ref}
			className={cn(
				'relative flex h-full shrink-0 grow basis-0 items-center justify-center transition-all border-y border-r border-primary-6 first:rounded-l-md first:border-l last:rounded-r-md bg-white shadow-sm dark:bg-black group-[[disabled]&]:bg-primary-1 group-[[disabled]&]:opacity-50',
				isActive && 'z-10 ring-2 ring-primary-6',
				className,
			)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
					<div className='h-4 w-px animate-blink bg-primary-12 duration-1000' />
				</div>
			)}
		</div>
	);
}

const InputOTPSlot = React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'> & { index: number }>(renderInputOTPSlot);

/*
 * Decorative separator between OTP slot groups.
 */
// terra-quality-ignore single-use -- Keep renderInputOTPSeparator as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the decorative divider between OTP slot groups.
/** Renders the decorative divider between OTP slot groups.
 * @param separatorProps - Native div attributes forwarded to the separator.
 * @param ref - Ref forwarded to the separator element.
 * @return A separator containing a small decorative dot.
 */
function renderInputOTPSeparator(separatorProps: React.ComponentPropsWithoutRef<'div'>, ref: React.ForwardedRef<HTMLDivElement>): React.JSX.Element {
	return (
		<div ref={ref} role='separator' {...separatorProps}>
			<DotIcon className='size-1' aria-hidden='true' />
		</div>
	);
}

const InputOTPSeparator = Object.assign(React.forwardRef<React.ElementRef<'div'>, React.ComponentPropsWithoutRef<'div'>>(renderInputOTPSeparator), { displayName: 'InputOTPSeparator' });
InputOTP.displayName = 'InputOTP';
InputOTPGroup.displayName = 'InputOTPGroup';
InputOTPSlot.displayName = 'InputOTPSlot';
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
