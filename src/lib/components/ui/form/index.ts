import * as FormPrimitive from 'formsnap';
import Description from './form-description.svelte';
import Label from './form-label.svelte';
import FieldErrors from './form-field-errors.svelte';
import Field from './form-field.svelte';

const Control = FormPrimitive.Control;

export {
	Field,
	Control,
	Label,
	FieldErrors,
	Description,
	//
	Field as FormField,
	Control as FormControl,
	Label as FormLabel,
	FieldErrors as FormFieldErrors,
	Description as FormDescription
};
