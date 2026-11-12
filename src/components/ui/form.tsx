/**
 * src/components/ui/form.tsx
 * https://ui.shadcn.com/docs/components/form
 * Prefer this component with react-hook-form and a Zod schema for every
 * user-facing form that contains a visible input.
 * Benefits over direct native-form handling:
 * - Zod keeps validation rules explicit, typed, reusable, and consistent with server actions.
 * - react-hook-form avoids unnecessary input re-renders and centralises submission, reset, and pending state.
 * - FormField, FormControl, FormMessage, and related primitives connect labels, errors, and accessibility attributes consistently.
 * - Shared schemas prevent client and server validation from silently diverging.
 * Use `<Form {...form}>` as the provider around one native `<form>` when using
 * FormField or FormMessage. Form is FormProvider and does not render an HTML
 * element; the nested `<form>` remains the only actual form. Direct native
 * forms should be reserved for hidden-only, file-only, or non-interactive
 * browser protocol controls.
 */

/*//////////////////////////////////////////////////
IMPORTS
//////////////////////////////////////////////////*/

// API
import { cn } from "../../lib/cn.js";
import { useFormContext } from "react-hook-form";

// COMPONENTS
import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";
import { Controller, FormProvider } from "react-hook-form";
import { Slot } from "@radix-ui/react-slot";

// DATA
import { FORM_LABEL_VARIANTS } from "./variants.js";

// TYPES
import type {
  ControllerProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import type { FormFieldCtxVal, IdArgs } from "./types.js";

/*//////////////////////////////////////////////////
INTERNAL CONTEXT
//////////////////////////////////////////////////*/

const FormFieldCtx = React.createContext<FormFieldCtxVal>(
  {} as FormFieldCtxVal,
);
FormFieldCtx.displayName = "FormFieldCtx";
const FormItemCtx = React.createContext<IdArgs>({} as IdArgs);
FormItemCtx.displayName = "FormItemCtx";
const Form = FormProvider;

/**
 * Reads React Hook Form state when a control is nested in a form provider.
 *
 * @return The active form context, or `null` when the control is used standalone.
 */
function useOptionalFormContext<
  TFieldValues extends FieldValues = FieldValues,
>(): UseFormReturn<TFieldValues> | null {
  return useFormContext<TFieldValues>() as UseFormReturn<TFieldValues> | null;
}

/*//////////////////////////////////////////////////
HOOKS
//////////////////////////////////////////////////*/

/**
 * Reads the current field name, generated accessibility IDs, and validation state.
 *
 * @return Metadata and validation state for the field rendered by `FormField`.
 *
 * @throws Error when called outside a `FormField` context.
 */
function useFormField() {
  const fieldCtx = React.useContext(FormFieldCtx);
  const { getFieldState, formState } = useFormContext();
  if (!fieldCtx)
    throw new Error("useFormField should be used within <FormField>");
  const { id } = React.useContext(FormItemCtx);
  return {
    id,
    name: fieldCtx.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...getFieldState(fieldCtx.name, formState),
  };
}
/**
 * Form field.
 *
 * @param fieldProps - Form control props forwarded to the rendered field.
 *
 * @return A controller connected to the current form field context.
 */
function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(fieldProps: ControllerProps<TFieldValues, TName>): React.JSX.Element {
  return (
    <FormFieldCtx.Provider value={{ name: fieldProps.name }}>
      <Controller {...fieldProps} />
    </FormFieldCtx.Provider>
  );
}

/** Renders the provider boundary that gives each form item a stable ID.
 * @param attributes - Container attributes and optional class name.
 * @param ref - Forwarded reference to the form item element.
 * @return A provider-wrapped form item container.
 */
function FormItemRender(
  attributes: React.HTMLAttributes<HTMLDivElement>,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const { className, ...otherAttributes } = attributes;
  return (
    <FormItemCtx.Provider value={{ id: React.useId() }}>
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        {...otherAttributes}
      />
    </FormItemCtx.Provider>
  );
}
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(FormItemRender);

/** Renders a form label connected to the current field and its error state.
 * @param attributes - Radix label attributes and optional class name.
 * @param ref - Forwarded reference to the label element.
 * @return The associated, error-aware form label.
 */
function FormLabelRender(
  attributes: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
  ref: React.ForwardedRef<React.ElementRef<typeof LabelPrimitive.Root>>,
): React.JSX.Element {
  const { className, ...otherAttributes } = attributes;
  const { error, formItemId } = useFormField();
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        FORM_LABEL_VARIANTS(),
        error && "text-rose-600",
        "font-semibold",
        className,
      )}
      htmlFor={formItemId}
      {...otherAttributes}
    />
  );
}
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(FormLabelRender);

/** Renders a slotted control with form IDs and validation accessibility state.
 * @param attributes - Control attributes passed to the slotted child.
 * @param ref - Forwarded reference to the control element.
 * @return The slot with associated description and validation attributes.
 */
function FormControlRender(
  attributes: React.ComponentPropsWithoutRef<typeof Slot>,
  ref: React.ForwardedRef<React.ElementRef<typeof Slot>>,
): React.JSX.Element {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();
  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...attributes}
    />
  );
}
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(FormControlRender);

/** Renders explanatory text linked to its current form field.
 * @param attributes - Paragraph attributes and optional class name.
 * @param ref - Forwarded reference to the description paragraph.
 * @return The field's associated description text.
 */
function FormDescriptionRender(
  attributes: React.HTMLAttributes<HTMLParagraphElement>,
  ref: React.ForwardedRef<HTMLParagraphElement>,
): React.JSX.Element {
  const { className, ...otherAttributes } = attributes;
  const { formDescriptionId } = useFormField();
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-primary-9", className)}
      {...otherAttributes}
    />
  );
}
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(FormDescriptionRender);

/** Renders validation feedback, returning nothing when no message exists.
 * @param attributes - Paragraph attributes, fallback children, and class name.
 * @param ref - Forwarded reference to the message paragraph.
 * @return The validation message or `null` when no message is available.
 */
function FormMessageRender(
  attributes: React.HTMLAttributes<HTMLParagraphElement>,
  ref: React.ForwardedRef<HTMLParagraphElement>,
): React.JSX.Element | null {
  const { className, children, ...otherAttributes } = attributes;
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;
  if (!body) return null;
  // prettier-ignore
  return (<p ref={ref} id={formMessageId} role='alert' aria-live='polite' className={cn('text-sm font-medium text-rose-600', className)} {...otherAttributes}>{body}</p>);
}
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(FormMessageRender);
FormItem.displayName = "FormItem";
FormLabel.displayName = "FormLabel";
FormControl.displayName = "FormControl";
FormDescription.displayName = "FormDescription";
FormMessage.displayName = "FormMessage";
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useOptionalFormContext,
};
