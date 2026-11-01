/**
 * astro/src/components/ui/form.tsx
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
import { Controller, FormProvider, useFormContext } from "react-hook-form";

// COMPONENTS
import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";
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
import type { FormFieldCtxVal } from "./types.js";
import type { IdArgs } from "./types.js";

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
 * @throws Error when called outside a `FormField` context.
 */
const useFormField = () => {
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
};
/**
 * Form field.
 *
 * @param props - Form control props forwarded to the rendered field.
 * @return A controller connected to the current form field context.
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ControllerProps<TFieldValues, TName>,
): React.JSX.Element => (
  <FormFieldCtx.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldCtx.Provider>
);
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref): React.JSX.Element => {
  return (
    <FormItemCtx.Provider value={{ id: React.useId() }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemCtx.Provider>
  );
});
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref): React.JSX.Element => {
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
      {...props}
    />
  );
});
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>((props, ref): React.JSX.Element => {
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
      {...props}
    />
  );
});
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref): React.JSX.Element => {
  const { formDescriptionId } = useFormField();
  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-primary-9", className)}
      {...props}
    />
  );
});
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref): React.JSX.Element | null => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;
  if (!body) return null;
  // prettier-ignore
  return (<p ref={ref} id={formMessageId} role='alert' aria-live='polite' className={cn('text-sm font-medium text-rose-600', className)} {...props}>{body}</p>);
});
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
