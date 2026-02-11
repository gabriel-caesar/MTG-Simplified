import z from 'zod';

import type {
  ValidationError,
  ValidationFormData,
  ValidationReturn,
} from './types.ts';

// Generate a username for a brand new user
export function generateUsername(email: string): string {
  const name = email.split('@')[0];
  const randomNumber = Math.floor(Math.random() * 1000 + 500);
  return name + '_' + randomNumber;
}

// Validates forms based on Zod schemas and return parsed data and db
export function formValidation(
  schema: z.ZodObject,
  formData: ValidationFormData,
): ValidationReturn | ValidationError {
  const validatedFields = schema.safeParse(formData);

  if (!validatedFields.success) {
    const flattenErrors = Object.values(
      z.flattenError(validatedFields.error).fieldErrors,
    );
    const evenFlatter = flattenErrors.map((err) => err?.[0]);
    return { errors: evenFlatter as string[] };
  }

  return validatedFields.data as ValidationReturn;
}

// Builds a mock form data object from scratch
export const mockFormData = (e: string, p: string, cp: string) =>
  ({
    email: e,
    password: p,
    confirm_password: cp,
  }) as ValidationFormData;
