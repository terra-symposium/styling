/**
 * src/components/ui/textarea.tsx
 * https://ui.shadcn.com/docs/components/textarea
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from '../../lib/cn.js';
import { useOptionalFormContext } from './form.js';

// COMPONENTS
import * as React from 'react';

// DATA
import { FORM_CONTROL_VARIANTS } from './variants.js';

// TYPES
import type { FieldValues } from 'react-hook-form';
import type { FormControlVariant, UiSize } from './types.js';

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/** Multiline input attributes with Terra control sizing and optional form conversion. */
type TextareaProps = React.ComponentProps<'textarea'> & {
	variant?: FormControlVariant;
	size?: UiSize;
	setValueAs?: (value: string) => unknown;
};

// terra-quality-ignore single-use -- Keep renderTextarea as a named declaration so its authored TSDoc stays attached. TSDoc: Renders the textarea and adapts its callbacks to react-hook-form when a form is present.
/** Renders the textarea and adapts its callbacks to react-hook-form when a form is present.
 * @param textareaProps - Native textarea props, variants, and optional form conversion.
 * @param ref - External ref combined with react-hook-form's registered ref.
 * @return A styled multiline textarea.
 */
function renderTextarea(textareaProps: TextareaProps, ref: React.ForwardedRef<HTMLTextAreaElement>): React.JSX.Element {
	const { className, variant = 'primary', size = 'md', name, onChange, onBlur, setValueAs, ...props } = textareaProps;
	const form = useOptionalFormContext<FieldValues>();
	const registration = form && name ? form.register(name, { setValueAs }) : null;
	// terra-quality-ignore single-use -- Keep attachTextareaRef as a named declaration so its authored TSDoc stays attached. TSDoc: Combines form registration and caller refs for the rendered textarea.
	/** Combines form registration and caller refs for the rendered textarea.
	 * @param element - Mounted textarea element or null during unmount.
	 * @return Nothing; both refs receive the element value.
	 */
	function attachTextareaRef(element: HTMLTextAreaElement | null): void {
		registration?.ref(element);
		if (typeof ref === 'function') ref(element);
		else if (ref) ref.current = element;
	}
	// terra-quality-ignore single-use -- Keep handleTextareaChange as a named declaration so its authored TSDoc stays attached. TSDoc: Updates form state before notifying the caller's change handler.
	/** Updates form state before notifying the caller's change handler.
	 * @param event - Textarea change event.
	 * @return Nothing; both change handlers are invoked in order.
	 */
	function handleTextareaChange(event: React.ChangeEvent<HTMLTextAreaElement>): void {
		registration?.onChange(event);
		onChange?.(event);
	}
	// terra-quality-ignore single-use -- Keep handleTextareaBlur as a named declaration so its authored TSDoc stays attached. TSDoc: Updates form state before notifying the caller's blur handler.
	/** Updates form state before notifying the caller's blur handler.
	 * @param event - Textarea focus event.
	 * @return Nothing; both blur handlers are invoked in order.
	 */
	function handleTextareaBlur(event: React.FocusEvent<HTMLTextAreaElement>): void {
		registration?.onBlur(event);
		onBlur?.(event);
	}
	return (
		<textarea
			name={name}
			data-slot='textarea'
			className={cn('min-h-[80px]', FORM_CONTROL_VARIANTS({ variant, size }), className)}
			ref={attachTextareaRef}
			onChange={handleTextareaChange}
			onBlur={handleTextareaBlur}
			{...props}
		/>
	);
}

/** Textarea component designed to support multiline text inputs.
 * @param textareaProps - Native textarea attributes and Terra variant options.
 * @param ref - Ref to the rendered textarea element.
 * @return A styled multiline textarea.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(renderTextarea);
Textarea.displayName = 'Textarea';
export { Textarea };
