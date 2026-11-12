/**
 * src/components/forms.tsx
 * Data-driven shared form controls and layouts.
 * https://ui.shadcn.com/docs/components/base/field
 * FormFieldLayout is intentionally distinct from the React Hook Form-bound
 * FormField export in ui/form.tsx. It can render native or controlled fields
 * without requiring an ActionForm or FormProvider.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../lib/cn.js";

// COMPONENTS
import * as React from "react";
import { Button } from "./ui/button.js";
import { Checkbox } from "./ui/checkbox.js";
import { FormSelect } from "./ui/form-select.js";
import { Input } from "./ui/input.js";
import { Label } from "./ui/label.js";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group.js";
import { Textarea } from "./ui/textarea.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip.js";

// DATA
import { TEXT_VARIANTS } from "./ui/variants.js";

// TYPES
import type { ChangeEvent, ComponentProps, ReactNode } from "react";

/*//////////////////////////////////////////////////
TYPES
//////////////////////////////////////////////////*/

// FORM LAYOUT CONTRACT
/** Named layouts available to shared data-driven form fields. */
export type FormLayout =
  | "stacked"
  | "compact"
  | "spacious"
  | "two-column"
  | "two-column-sm"
  | "two-column-compact-sm"
  | "three-column"
  | "four-column"
  | "four-column-sm"
  | "inline"
  | "contents";

/** Per-field control and label placement used by mapped checkbox fields. */
export type MappedFormFieldOrientation = "vertical" | "horizontal";

// MAPPED FIELD CONTRACT
/** Defines a selectable value and its label for mapped select and radio fields. */
export type MappedSelectOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

/** Shared label, validation, and styling properties for mapped field variants. */
type MappedFormFieldBase = {
  key?: string;
  id?: string;
  label: ReactNode;
  ariaLabel?: string;
  className?: string;
  controlClassName?: string;
  labelClassName?: string;
  required?: boolean;
  description?: ReactNode;
  helper?: ReactNode;
  error?: ReactNode;
};

/** Checkbox field whose orientation controls whether its control precedes the label. */
type MappedCheckboxFormField = MappedFormFieldBase & {
  type: "checkbox";
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  orientation?: MappedFormFieldOrientation;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  control?: never;
};

/** Models a supplied control or input, select, textarea, checkbox, radio, or display field. */
export type MappedFormField =
  | (MappedFormFieldBase & {
      control: ReactNode;
      name?: string;
      type?: ComponentProps<"input">["type"];
      placeholder?: string;
      autoComplete?: string;
    })
  | (MappedFormFieldBase & {
      type: "input";
      name?: string;
      inputType?: ComponentProps<"input">["type"];
      placeholder?: string;
      accept?: string;
      autoComplete?: string;
      prefix?: ReactNode;
      onClear?: () => void;
      min?: string;
      max?: string;
      minLength?: number;
      maxLength?: number;
      step?: string;
      suffix?: ReactNode;
      defaultValue?: string;
      value?: string;
      onValueChange?: (value: string) => void;
      onInputChange?: ComponentProps<"input">["onChange"];
      disabled?: boolean;
      control?: never;
    })
  | (MappedFormFieldBase & {
      type: "select";
      name?: string;
      options: readonly MappedSelectOption[];
      defaultValue?: string;
      placeholder?: string;
      disabled?: boolean;
      value?: string;
      onValueChange?: (value: string) => void;
      control?: never;
    })
  | (MappedFormFieldBase & {
      type: "textarea";
      name?: string;
      placeholder?: string;
      rows?: number;
      minLength?: number;
      maxLength?: number;
      defaultValue?: string;
      value?: string;
      onValueChange?: (value: string) => void;
      disabled?: boolean;
      control?: never;
    })
  | MappedCheckboxFormField
  | (MappedFormFieldBase & {
      type: "radio";
      name?: string;
      options: readonly MappedSelectOption[];
      defaultValue?: string;
      value?: string;
      disabled?: boolean;
      onValueChange?: (value: string) => void;
      control?: never;
    })
  | (MappedFormFieldBase & {
      type: "display";
      value: string;
      inputType?: ComponentProps<"input">["type"];
      readOnly?: boolean;
      disabled?: boolean;
      control?: never;
    });

/*//////////////////////////////////////////////////
CONFIG
//////////////////////////////////////////////////*/

// FORM LAYOUTS
const FORM_LAYOUT_CLASSES: Record<FormLayout, string> = {
  stacked: "grid gap-4",
  compact: "grid gap-2",
  spacious: "grid gap-5",
  "two-column": "grid gap-5 md:grid-cols-2",
  "two-column-sm": "grid gap-5 sm:grid-cols-2",
  "two-column-compact-sm": "grid gap-2 sm:grid-cols-2",
  "three-column": "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
  "four-column": "grid gap-5 md:grid-cols-2 xl:grid-cols-4",
  "four-column-sm": "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
  inline: "flex flex-wrap items-end gap-3",
  contents: "contents",
};

/*//////////////////////////////////////////////////
HELPERS
//////////////////////////////////////////////////*/

// LAYOUT CLASS RESOLUTION
/**
 * Resolves a named field-grid layout to its shared classes.
 *
 * @param layout Named layout to resolve.
 *
 * @return CSS classes for the requested layout.
 */
export function formLayoutClassName(layout: FormLayout): string {
  return FORM_LAYOUT_CLASSES[layout];
}

/*//////////////////////////////////////////////////
COMPONENTS
//////////////////////////////////////////////////*/

// FIELD LAYOUT AND FEEDBACK
/**
 * Renders a label, required marker, control, and its supporting feedback.
 * This layout is independent of React Hook Form's FormField controller.
 *
 * @param label Visible text or content associated with the control.
 * @param children The field control rendered beside the label.
 * @param className Optional classes for the field layout container.
 * @param labelClassName Optional classes applied to the label.
 * @param required Shows a required marker and screen-reader announcement.
 * @param htmlFor Control id used by the label and feedback descriptions.
 * @param orientation Places the control beside or beneath its label.
 * @param helper Optional explanatory content shown in a tooltip.
 * @param description Optional explanatory text shown below the control.
 * @param err Optional validation feedback shown below the control.
 *
 * @return A labelled field layout with its description and error feedback.
 */
export function FormFieldLayout({
  label,
  children,
  className,
  labelClassName,
  required = false,
  htmlFor,
  orientation = "vertical",
  helper,
  description,
  error: err,
}: {
  label: ReactNode;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  htmlFor?: string;
  orientation?: MappedFormFieldOrientation;
  helper?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
}): React.JSX.Element {
  const descriptionId = htmlFor ? `${htmlFor}-description` : undefined;
  const errId = htmlFor ? `${htmlFor}-error` : undefined;
  const labelContent = (
    <>
      {label}
      {required && (
        <span
          aria-hidden="true"
          className={cn(
            "ml-1",
            TEXT_VARIANTS({
              tone: "destructive",
              size: "sm",
              weight: "bold",
            }),
          )}
        >
          *
        </span>
      )}
      {required && <span className="sr-only"> (required)</span>}
    </>
  );
  const helperContent = helper && (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "mt-1 block w-fit",
              TEXT_VARIANTS({ tone: "muted", size: "xs" }),
            )}
            tabIndex={0}
          >
            More info
          </span>
        </TooltipTrigger>
        <TooltipContent>{helper}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
  if (orientation === "horizontal") {
    return (
      <div
        className={cn(
          "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-2 gap-y-1",
          className,
        )}
      >
        {children}
        <Label
          htmlFor={htmlFor}
          className={cn("col-start-2 row-start-1", labelClassName)}
        >
          {labelContent}
        </Label>
        {helperContent && <div className="col-start-2">{helperContent}</div>}
        {description && (
          <p
            id={descriptionId}
            className={cn(
              TEXT_VARIANTS({ tone: "muted", size: "sm" }),
              "col-start-2",
            )}
          >
            {description}
          </p>
        )}
        {err && (
          <FormErrText id={errId} className="col-start-2">
            {err}
          </FormErrText>
        )}
      </div>
    );
  }
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={htmlFor} className={labelClassName}>
        {labelContent}
      </Label>
      {children}
      {helperContent}
      {description && (
        <p
          id={descriptionId}
          className={TEXT_VARIANTS({ tone: "muted", size: "sm" })}
        >
          {description}
        </p>
      )}
      {err && <FormErrText id={errId}>{err}</FormErrText>}
    </div>
  );
}

/**
 * Renders error content in the shared accessible alert style.
 *
 * @param id Optional element id used by a linked field.
 * @param className Optional classes applied to the alert paragraph.
 * @param children Error message content.
 *
 * @return An alert paragraph containing the error content.
 */
function FormErrText({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}): React.JSX.Element {
  return (
    <p
      id={id}
      role="alert"
      aria-live="polite"
      className={cn(
        TEXT_VARIANTS({
          tone: "destructive",
          size: "sm",
          weight: "medium",
        }),
        className,
      )}
    >
      {children}
    </p>
  );
}

// MAPPED FIELD CONTROLS
/**
 * Renders shared field error feedback alongside a control outside a form layout.
 *
 * @param field Field definition whose error should be displayed.
 *
 * @return Error feedback, or null when `field.error` is falsy.
 */
export function MappedFormFieldError({
  field,
}: {
  field: MappedFormField;
}): React.JSX.Element | null {
  if (!field.error) return null;
  const id = field.id ?? ("name" in field ? field.name : undefined);
  return (
    <FormErrText id={id ? `${id}-error` : undefined}>{field.error}</FormErrText>
  );
}

/**
 * Renders a field definition's control without its labelled layout wrapper.
 *
 * @param field Field definition describing the control to render.
 * @param suppliedId Optional caller-provided id, which takes precedence over the field id.
 *
 * @return The mapped control or supplied custom control.
 */
export function MappedFormControl({
  field,
  id: suppliedId,
}: {
  field: MappedFormField;
  id?: string;
}): React.JSX.Element {
  const f = field;
  const id = suppliedId ?? f.id ?? ("name" in f ? f.name : undefined);
  const describedBy =
    [
      f.description && id ? `${id}-description` : undefined,
      f.error && id ? `${id}-error` : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  const shared = {
    id,
    "aria-label": f.ariaLabel,
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(f.error) || undefined,
  };
  if ("control" in f) return <>{f.control}</>;
  if (f.type === "input") {
    const onValueChange = f.onValueChange;
    /** Forwards an input value to the field's value-change handler. */
    function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
      onValueChange?.(event.currentTarget.value);
    }
    const input = (
      <Input
        {...shared}
        name={f.name}
        type={f.inputType ?? "text"}
        placeholder={f.placeholder}
        accept={f.accept}
        autoComplete={f.autoComplete}
        icon={f.prefix}
        min={f.min}
        max={f.max}
        minLength={f.minLength}
        maxLength={f.maxLength}
        step={f.step}
        defaultValue={f.defaultValue}
        value={f.value}
        onChange={
          f.onInputChange ?? (f.onValueChange ? handleInputChange : undefined)
        }
        disabled={f.disabled}
        required={f.required}
        className={cn(
          f.controlClassName,
          f.suffix && (f.onClear ? "pr-20" : "pr-14"),
          f.onClear && !f.suffix && "pr-10",
        )}
      />
    );
    if (!f.suffix && !f.onClear) return input;
    return (
      <span className="relative block">
        {input}
        {f.suffix && (
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 flex items-center text-sm",
              TEXT_VARIANTS({ tone: "muted", size: "sm" }),
              f.onClear ? "right-10" : "right-3",
            )}
          >
            {f.suffix}
          </span>
        )}
        {f.onClear && (
          <Button
            type="button"
            variant="gray-ghost"
            size="icon-sm"
            aria-label="Clear field"
            className="absolute inset-y-0 right-1 my-auto size-7"
            onClick={f.onClear}
          >
            ×
          </Button>
        )}
      </span>
    );
  }
  if (f.type === "select") {
    return (
      <FormSelect
        {...shared}
        name={f.name}
        value={f.value}
        defaultValue={f.defaultValue}
        disabled={f.disabled}
        required={f.required}
        placeholder={f.placeholder ?? "Select an option"}
        options={f.options}
        onValueChange={f.onValueChange}
        className={f.controlClassName}
      />
    );
  }
  if (f.type === "textarea") {
    const onValueChange = f.onValueChange;
    /** Forwards a textarea value to the field's value-change handler. */
    function handleTextareaChange(
      event: ChangeEvent<HTMLTextAreaElement>,
    ): void {
      onValueChange?.(event.currentTarget.value);
    }
    return (
      <Textarea
        {...shared}
        name={f.name}
        placeholder={f.placeholder}
        rows={f.rows}
        minLength={f.minLength}
        maxLength={f.maxLength}
        defaultValue={f.defaultValue}
        value={f.value}
        onChange={f.onValueChange ? handleTextareaChange : undefined}
        disabled={f.disabled}
        required={f.required}
        className={f.controlClassName}
      />
    );
  }
  if (f.type === "checkbox") {
    const onCheckedChange = f.onCheckedChange;
    /** Converts the checkbox primitive's indeterminate state to a boolean field value. */
    function handleCheckedChange(value: boolean | "indeterminate"): void {
      onCheckedChange?.(value === true);
    }
    return (
      <Checkbox
        {...shared}
        name={f.name}
        checked={f.checked}
        defaultChecked={f.defaultChecked}
        disabled={f.disabled}
        required={f.required}
        onCheckedChange={handleCheckedChange}
        className={f.controlClassName}
      />
    );
  }
  if (f.type === "radio") {
    const options = f.options;
    /** Renders one radio option with an id linked to its label. */
    function renderRadioOption(
      option: (typeof options)[number],
    ): React.JSX.Element {
      const optionId = `${id ?? "radio"}-${option.value}`;
      return (
        <Label
          key={option.value}
          htmlFor={optionId}
          className="flex items-center gap-2"
        >
          <RadioGroupItem
            id={optionId}
            value={option.value}
            disabled={option.disabled}
          />
          {option.label}
        </Label>
      );
    }
    return (
      <RadioGroup
        {...shared}
        name={f.name}
        value={f.value}
        defaultValue={f.defaultValue}
        disabled={f.disabled}
        onValueChange={f.onValueChange}
      >
        {options.map(renderRadioOption)}
      </RadioGroup>
    );
  }
  return (
    <Input
      {...shared}
      type={f.inputType ?? "text"}
      value={f.value}
      readOnly={f.readOnly ?? true}
      disabled={f.disabled}
      className={f.controlClassName}
    />
  );
}

// FIELD GRID
/**
 * Renders field definitions as a consistent grid of labelled controls.
 *
 * @param data Optional field definitions; takes precedence over `fields`.
 * @param fields Alternate field definitions used when `data` is absent.
 * @param fieldClassName Optional classes applied to each field wrapper.
 * @param labelClassName Default label classes used when a field has no override.
 * @param className Optional classes applied to the grid container.
 * @param layout Named layout preset used to arrange the fields.
 *
 * @return A grid containing the labelled field controls.
 */
export function MappedFormFields({
  data,
  fields,
  fieldClassName,
  labelClassName = "",
  className,
  layout = "stacked",
}: {
  data?: readonly MappedFormField[];
  fields?: readonly MappedFormField[];
  fieldClassName?: string;
  labelClassName?: string;
  className?: string;
  layout?: FormLayout;
}): React.JSX.Element {
  const genId = React.useId();
  const fieldData = data ?? fields ?? [];
  /** Renders one field and derives an id when the caller did not supply one. */
  function renderField(f: MappedFormField, i: number): React.JSX.Element {
    const suppliedId = f.id ?? ("name" in f ? f.name : undefined);
    const hasCustomControl = "control" in f && f.control !== undefined;
    const id = suppliedId ?? (hasCustomControl ? undefined : `${genId}-${i}`);
    const orientation =
      f.type === "checkbox"
        ? (f as MappedCheckboxFormField).orientation
        : undefined;
    return (
      <FormFieldLayout
        key={f.key ?? `${String(f.label)}-${i}`}
        label={f.label}
        required={f.required}
        htmlFor={id}
        className={cn(fieldClassName, f.className)}
        labelClassName={f.labelClassName ?? labelClassName}
        orientation={orientation}
        description={f.description}
        helper={f.helper}
        error={f.error}
      >
        <MappedFormControl field={f} id={id} />
      </FormFieldLayout>
    );
  }
  return (
    <div className={cn(formLayoutClassName(layout), className)}>
      {fieldData.map(renderField)}
    </div>
  );
}

// CONFIRMATION ACTIONS
/**
 * Renders the shared inline cancel and confirm buttons.
 *
 * @param onCancel Called when the cancel button is activated.
 * @param onConfirm Called when the confirm button is activated.
 * @param busy Shows the confirm button's busy state and optionally disables cancel.
 * @param cancelDisabled Disables the cancel button regardless of busy state.
 * @param disableCancelWhileBusy Disables cancel while busy when true.
 * @param confirmDisabled Disables the confirm button.
 * @param cancelLabel Text shown on the cancel button.
 * @param confirmLabel Text shown on the confirm button while idle.
 * @param busyLabel Text shown on the confirm button while busy.
 * @param className Optional classes applied to the action group.
 *
 * @return An inline group of cancel and confirm buttons.
 */
export function ConfirmationActions({
  onCancel,
  onConfirm,
  busy = false,
  cancelDisabled = false,
  disableCancelWhileBusy = true,
  confirmDisabled = false,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm change",
  busyLabel = "Saving…",
  className,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
  cancelDisabled?: boolean;
  disableCancelWhileBusy?: boolean;
  confirmDisabled?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  busyLabel?: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={cn("mt-3 flex justify-end gap-2", className)}>
      <Button
        type="button"
        variant="gray-outline"
        onClick={onCancel}
        disabled={cancelDisabled}
        loading={disableCancelWhileBusy && busy}
      >
        {cancelLabel}
      </Button>
      <Button
        type="button"
        onClick={onConfirm}
        loading={busy}
        disabled={confirmDisabled}
      >
        {busy ? busyLabel : confirmLabel}
      </Button>
    </div>
  );
}
