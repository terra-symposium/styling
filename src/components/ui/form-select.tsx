/**
 * src/components/ui/form-select.tsx
 * https://ui.shadcn.com/docs/components/select
 * Data-driven form select that integrates with React Hook Form when available.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { useOptionalFormContext } from './form.js';

// COMPONENTS
import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select.js';

// TYPES
import type { FieldValues } from 'react-hook-form';

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

// DATA
const EMPTY_VALUE = '__empty_select_value__';

/*//////////////////////////////////////////////////
TYPES
//////////////////////////////////////////////////*/

/** Option data accepted by `FormSelect` and `FormSelectOpts`. */
export type FormSelectOptionProps = {
	value: string;
	label?: React.ReactNode;
	children?: React.ReactNode;
	disabled?: boolean;
};

/** Short name for the `FormSelectOptionProps` contract. */
export type FormSelectOptProps = FormSelectOptionProps;

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

/**
 * Represents an empty selection as the absence of a value in local state.
 *
 * @param value - Selected value to normalize.
 *
 * @return `undefined` for an empty string; otherwise the original value.
 */
function toPrimitiveValue(value: string | undefined): string | undefined {
	return value === '' ? undefined : value;
}

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

/**
 * Select control with local, controlled, or React Hook Form state.
 * When `name` is paired with a form provider, the field value comes from that
 * form; without a provider, a named control submits through a hidden input.
 * Supply `options` for data-driven options, or `children` for composed items.
 * Empty-string values remain `''` in callbacks and native form submission.
 *
 * @param children Optional composed option items.
 * @param options Optional option definitions used to build select items.
 * @param className Optional classes applied to the trigger.
 * @param ariaLabel Accessible name for the trigger.
 * @param ariaLabelAttribute Native `aria-label` fallback for the trigger.
 * @param ariaInvalid Sets the control's invalid accessibility state.
 * @param defaultValue Initial selection when no controlled or form value exists.
 * @param disabled Disables the select and its native hidden input.
 * @param id Id assigned to the select trigger.
 * @param name Form field name used by a provider or hidden input.
 * @param onValueChange Called with the normalized selection, including an empty string.
 * @param placeholder Text shown when no option is selected.
 * @param renderValue Custom content for the selected value.
 * @param required Marks the selection as required.
 * @param value Controlled selection value.
 * @param size Trigger size variant.
 * @param variant Trigger visual variant.
 * @param width Trigger width preset.
 * @param hideChevron Hides the trigger's dropdown indicator.
 * @param selectProps Remaining properties forwarded to the underlying select.
 *
 * @return A select trigger and option panel, plus a hidden input for a named standalone field.
 */
function FormSelect({
	children,
	options,
	className,
	ariaLabel,
	'aria-label': ariaLabelAttribute,
	ariaInvalid,
	defaultValue,
	disabled,
	id,
	name,
	onValueChange,
	placeholder = 'Select an option',
	renderValue,
	required,
	value,
	size,
	variant,
	width,
	hideChevron,
	...selectProps
}: Omit<React.ComponentProps<typeof Select>, 'children' | 'defaultValue' | 'disabled' | 'name' | 'onValueChange' | 'required' | 'value'> &
	Pick<React.ComponentProps<typeof SelectTrigger>, 'size' | 'variant' | 'width' | 'hideChevron'> & {
		children?: React.ReactNode;
		options?: readonly FormSelectOptionProps[];
		ariaLabel?: string;
		'aria-label'?: string;
		ariaInvalid?: React.AriaAttributes['aria-invalid'];
		className?: string;
		defaultValue?: string;
		disabled?: boolean;
		id?: string;
		name?: string;
		onValueChange?: (value: string) => void;
		placeholder?: string;
		renderValue?: (value: string) => React.ReactNode;
		required?: boolean;
		value?: string;
	}): React.JSX.Element {
	const form = useOptionalFormContext<FieldValues>();
	const formValue = form && name ? form.watch(name as never) : undefined;
	const hasFormField = Boolean(form && name);
	const isControlled = value !== undefined;
	// terra-quality-ignore single-use -- Keep getInitialValue as a named declaration so its authored TSDoc stays attached. TSDoc: Derives the local state initializer from the uncontrolled default value.
	/**
	 * Derives the local state initializer from the uncontrolled default value.
	 *
	 * @return The primitive string default, or undefined when no default is configured.
	 */
	function getInitialValue(): string | undefined {
		return toPrimitiveValue(defaultValue);
	}
	const [internalValue, setInternalValue] = React.useState<string | undefined>(getInitialValue);
	// terra-quality-ignore single-use -- Keep initializeFormField as a named declaration so its authored TSDoc stays attached. TSDoc: Initializes a named React Hook Form field when it has no current value.
	/** Initializes a named React Hook Form field when it has no current value. */
	function initializeFormField(): void {
		const initialValue = value ?? defaultValue;
		if (!form || !name || initialValue === undefined || form.getValues(name as never) !== undefined) return;
		form.setValue(name as never, initialValue as never);
	}
	React.useEffect(initializeFormField, [form, name, value, defaultValue]);
	const selectedValue = hasFormField ? (typeof formValue === 'string' ? formValue : (value ?? defaultValue ?? '')) : isControlled ? (value ?? '') : (internalValue ?? '');
	// terra-quality-ignore single-use -- Keep handleValueChange as a named declaration so its authored TSDoc stays attached. TSDoc: Converts the select's sentinel value and updates the active value owner.
	/**
	 * Converts the select's sentinel value and updates the active value owner.
	 *
	 * @param nextValue - Value emitted by the select primitive.
	 */
	function handleValueChange(nextValue: string): void {
		const normalizedValue = nextValue === EMPTY_VALUE ? '' : nextValue;
		if (hasFormField && form && name)
			form.setValue(name as never, normalizedValue as never, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
		if (!hasFormField && !isControlled) setInternalValue(toPrimitiveValue(normalizedValue));
		onValueChange?.(normalizedValue);
	}
	/**
	 * Renders one data-driven option as a select item.
	 *
	 * @param option - Option definition to display in the select list.
	 * @return A select item containing the option label or children.
	 */
	function renderOption(option: FormSelectOptionProps): React.JSX.Element {
		return (
			<FormSelectOption key={option.value} value={option.value} disabled={option.disabled}>
				{option.label ?? option.children}
			</FormSelectOption>
		);
	}
	// terra-quality-ignore single-use -- Render options before invoking the selected-value renderer so callback evaluation order stays unchanged.
	const optionItems = options?.map(renderOption);
	return (
		<>
			<Select {...selectProps} required={required} disabled={disabled} value={selectedValue === '' ? EMPTY_VALUE : selectedValue} onValueChange={handleValueChange}>
				<SelectTrigger
					id={id}
					aria-label={ariaLabel ?? ariaLabelAttribute}
					aria-invalid={ariaInvalid}
					aria-required={required || undefined}
					size={size}
					variant={variant}
					width={width}
					hideChevron={hideChevron}
					className={className}
				>
					<SelectValue placeholder={placeholder}>{selectedValue && renderValue ? renderValue(selectedValue) : undefined}</SelectValue>
				</SelectTrigger>
				<SelectContent>{options ? optionItems : children}</SelectContent>
			</Select>
			{name && !hasFormField && <input type='hidden' name={name} value={selectedValue} disabled={disabled} />}
		</>
	);
}

/**
 * Renders one option for `FormSelect`.
 *
 * @param children Option content that takes precedence over `label`.
 * @param disabled Disables selection of the option.
 * @param label Alternate option content when `children` is absent.
 * @param value Value submitted when the option is selected.
 *
 * @return A select item with the supplied content and availability state.
 */
function FormSelectOption({ children, disabled, label, value }: FormSelectOptionProps): React.JSX.Element {
	return (
		<SelectItem value={value === '' ? EMPTY_VALUE : value} disabled={disabled}>
			{children ?? label}
		</SelectItem>
	);
}

/**
 * Renders a list of option data as `FormSelectOption` children.
 *
 * @param options Option definitions to render as select items.
 *
 * @return A fragment containing one select item for each option.
 */
function FormSelectOpts({ options }: { options: readonly FormSelectOptionProps[] }): React.JSX.Element {
	/**
	 * Renders one option definition inside the option-list fragment.
	 *
	 * @param option - Option definition to convert into a select item.
	 * @return A select item displaying the option label or children.
	 */
	function renderOption(option: FormSelectOptionProps): React.JSX.Element {
		return (
			<FormSelectOption key={option.value} value={option.value} disabled={option.disabled}>
				{option.label ?? option.children}
			</FormSelectOption>
		);
	}
	return <>{options.map(renderOption)}</>;
}
export { FormSelect, FormSelectOption, FormSelectOpts };
