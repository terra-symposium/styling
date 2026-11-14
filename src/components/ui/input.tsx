/**
 * src/components/ui/input.tsx
 * https://ui.shadcn.com/docs/components/input
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';
import { useOptionalFormContext } from './form.js';

// COMPONENTS
import * as React from 'react';
import { Button } from './button.js';

// DATA
import { FORM_CONTROL_VARIANTS, TEXT_VARIANTS } from './variants.js';

// TYPES
import type { FieldValues } from 'react-hook-form';
import type { InputProps } from './types.js';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

// terra-quality-ignore single-use -- Keep renderInput as a named declaration so its authored TSDoc stays attached. TSDoc: Renders a text input with adornments and optional react-hook-form registration.
/** Renders a text input with adornments and optional react-hook-form registration.
 * @param inputProps - Native input, variant, adornment, and form conversion options.
 * @param ref - Ref combined with the form registration ref.
 * @return An input control with the requested adornments and handlers.
 */
function renderInput(inputProps: InputProps, ref: React.ForwardedRef<HTMLInputElement>): React.JSX.Element {
	const { icon, prefix, suffix, onClear, setValueAs, className, type = 'text', variant = 'primary', size = 'md', name, value, onChange, onBlur, ...props } = inputProps;
	const form = useOptionalFormContext<FieldValues>();
	// terra-quality-ignore single-use -- Keep normalizeRegisteredValue as a named declaration so its authored TSDoc stays attached. TSDoc: Applies the caller conversion and input-specific value normalization.
	/** Applies the caller conversion and input-specific value normalization.
	 * @param raw - Value received from the registered input.
	 * @return The value stored by the form field.
	 */
	function normalizeRegisteredValue(raw: unknown): unknown {
		const normalized = type === 'hidden' && typeof raw !== 'string' ? (JSON.stringify(raw) ?? '') : String(raw);
		if (setValueAs) return setValueAs(normalized);
		if (type === 'number') return normalized === '' ? null : Number(normalized);
		return raw;
	}
	const registration = form && name && type !== 'file' && !onChange ? form.register(name, { setValueAs: normalizeRegisteredValue }) : null;
	const leading = prefix ?? icon;
	// terra-quality-ignore single-use -- Keep attachInputRef as a named declaration so its authored TSDoc stays attached. TSDoc: Merges the form ref and forwarded component ref.
	/** Merges the form ref and forwarded component ref.
	 * @param element - Mounted input element or null during unmount.
	 * @return Nothing; each registered ref receives the element.
	 */
	function attachInputRef(element: HTMLInputElement | null): void {
		registration?.ref(element);
		if (typeof ref === 'function') ref(element);
		else if (ref) ref.current = element;
	}
	// terra-quality-ignore single-use -- Keep handleInputChange as a named declaration so its authored TSDoc stays attached. TSDoc: Updates form state before invoking the caller's change handler.
	/** Updates form state before invoking the caller's change handler.
	 * @param event - Native input change event.
	 * @return Nothing; the form and caller observe the change in order.
	 */
	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
		registration?.onChange(event);
		onChange?.(event);
	}
	// terra-quality-ignore single-use -- Keep handleInputBlur as a named declaration so its authored TSDoc stays attached. TSDoc: Updates form state before invoking the caller's blur handler.
	/** Updates form state before invoking the caller's blur handler.
	 * @param event - Native input focus event.
	 * @return Nothing; the form and caller observe the blur in order.
	 */
	function handleInputBlur(event: React.FocusEvent<HTMLInputElement>): void {
		registration?.onBlur(event);
		onBlur?.(event);
	}
	// terra-quality-ignore single-use -- Keep clearInput as a named declaration so its authored TSDoc stays attached. TSDoc: Clears the registered value before invoking the supplied clear callback.
	/** Clears the registered value before invoking the supplied clear callback.
	 * @return Nothing; the field value is cleared and marked for validation.
	 */
	function clearInput(): void {
		if (form && name)
			form.setValue(name, '' as never, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
		onClear?.();
	}
	const input = (
		<input
			type={type}
			name={name}
			data-slot='input'
			className={cn(
				FORM_CONTROL_VARIANTS({
					variant: variant === 'ghost' ? 'primary-ghost' : variant,
					size,
				}),
				variant === 'ghost' && 'h-auto border-0 p-0',
				leading && 'pl-10',
				suffix && 'pr-10',
				onClear && 'pr-16',
				(prefix || suffix || onClear) && 'h-full flex-1 rounded-none border-0 bg-transparent shadow-none outline-none focus-visible:border-transparent focus-visible:ring-0',
				// override
				className,
			)}
			ref={attachInputRef}
			value={value}
			onChange={handleInputChange}
			onBlur={handleInputBlur}
			{...props}
		/>
	);
	if (!icon && !prefix && !suffix && !onClear) return input;
	if (icon && !prefix && !suffix && !onClear) {
		return (
			<div className='relative flex items-center'>
				<div className={cn('pointer-events-none absolute left-3 flex items-center justify-center', TEXT_VARIANTS({ tone: 'muted' }))}>{icon}</div>
				{input}
			</div>
		);
	}
	return (
		<div className='focus-within:border-primary-9 focus-within:ring-primary-2 border-primary-6 flex min-h-11 overflow-hidden rounded-lg border bg-white py-0 shadow-sm focus-within:ring-2'>
			<div className='relative flex min-w-0 flex-1 items-center'>
				{leading && <span className={cn('pointer-events-none absolute left-3 z-10 flex items-center justify-center', TEXT_VARIANTS({ tone: 'muted' }))}>{leading}</span>}
				{input}
			</div>
			{suffix && <span className={cn('pointer-events-none flex shrink-0 items-center px-3', TEXT_VARIANTS({ tone: 'muted' }))}>{suffix}</span>}
			{onClear && String(value ?? '').trim() && (
				<Button type='button' variant='gray-ghost' size='sm' onClick={clearInput}>
					Clear
				</Button>
			)}
		</div>
	);
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(renderInput);
Input.displayName = 'Input';
export { Input };
