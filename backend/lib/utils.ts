import z from 'zod';

import type { ValidationReturn } from './types.ts';
import type { Request, Response } from 'express'; 

// Generate a username for a brand new user
export function generateUsername(email: string): string {
  const name = email.split("@")[0]
  const randomNumber = Math.floor(Math.random() * 1000 + 500);
  return name + '_' + randomNumber
}

// Validates forms based on Zod schemas and return parsed data and db
export function formValidation(schema: z.ZodObject, req: Request, res: Response): 
{ email: string, password: string } | Response {
  const validatedFields = schema.safeParse(req.body);

  if (!validatedFields.success) {
    const flattenErrors = Object.values(z.flattenError(validatedFields.error).fieldErrors)
    const evenFlatter = flattenErrors.map(err => err?.[0]);
    return res.status(422).json({ errors: evenFlatter })
  }

  return validatedFields.data as ValidationReturn;
}