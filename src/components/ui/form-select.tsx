/**
 * src/components/ui/form-select.tsx
 * https://ui.shadcn.com/docs/components/select
 * Data-driven form select that integrates with React Hook Form when available.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// COMPONENTS
import * as React from 'react';
import { useOptionalFormContext } from './form.js';
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
 * @param props - Option data or child items, form name, controlled or initial value, change callback, custom selected-value renderer, accessibility and disabled state, required state, placeholder, and trigger presentation.
 * @returns A select trigger and option panel, plus a hidden input for a named standalone field.
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
}: (Omit<React.ComponentProps<typeof Select>, 'children' | 'defaultValue' | 'disabled' | 'name' | 'onValueChange' | 'required' | 'value'> & Pick<React.ComponentProps<typeof SelectTrigger>, 'size' | 'variant' | 'width' | 'hideChevron'> & {
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
})): React.JSX.Element {
	const form = useOptionalFormContext<FieldValues>();
	const formValue = form && name ? form.watch(name as never) : undefined;
	const hasFormField = Boolean(form && name);
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = React.useState<string | undefined>(() => toPrimitiveValue(defaultValue));

	React.useEffect(() => {
		const initialValue = value ?? defaultValue;
		if (!form || !name || initialValue === undefined || form.getValues(name as never) !== undefined) return;
		form.setValue(name as never, initialValue as never);
	}, [form, name, value, defaultValue]);

	const selectedValue = hasFormField ? (typeof formValue === 'string' ? formValue : (value ?? defaultValue ?? '')) : isControlled ? (value ?? '') : (internalValue ?? '');
	const optionItems = options?.map((option) => (
		<FormSelectOption key={option.value} value={option.value} disabled={option.disabled}>
			{option.label ?? option.children}
		</FormSelectOption>
	));
	return (
		<>
			<Select
				{...selectProps}
				required={required}
				disabled={disabled}
				value={selectedValue === '' ? EMPTY_VALUE : selectedValue}
				onValueChange={(nextValue) => {
					const normalizedValue = nextValue === EMPTY_VALUE ? '' : nextValue;
					if (hasFormField && form && name) form.setValue(name as never, normalizedValue as never, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
					if (!hasFormField && !isControlled) setInternalValue(toPrimitiveValue(normalizedValue));
					onValueChange?.(normalizedValue);
				}}
			>
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
 * @param props - Submitted value, optional child or label content (`children` takes precedence), and whether the option is disabled.
 * @returns A select item with the supplied content and availability state.
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
 * @param props - Option definitions to render as select items.
 * @returns A fragment containing one select item for each option.
 */
function FormSelectOpts({ options }: { options: readonly FormSelectOptionProps[] }): React.JSX.Element {
	return (
		<>
			{options.map((option) => (
				<FormSelectOption key={option.value} value={option.value} disabled={option.disabled}>
					{option.label ?? option.children}
				</FormSelectOption>
			))}
		</>
	);
}

export { FormSelect, FormSelectOption, FormSelectOpts };
