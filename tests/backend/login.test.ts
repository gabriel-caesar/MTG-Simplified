// Mocking the DB import from signUpMiddleware
vi.mock('../../backend/db.ts', () => ({
  getDb: async () => ({
    collection: (col: string) => ({
      findOne: vi.fn(() => ({ password: 'test12345678#' })),
      insertOne: async (obj: {
        username: string;
        email: string;
        password: string;
      }) => {},
    }),
  }),
}));

import { formValidation, mockFormData } from '../../backend/lib/utils';
import { describe, expect, it, vi } from 'vitest';
import { LogInSchema } from '../../backend/lib/schemas';

describe('Log in logic', () => {
  const validFormData = mockFormData(
    'iamtest@email.com',
    'test12345678#',
    'test12345678#',
  );
  const emptyFormData = mockFormData('', '', '');

  it('tests a successful log in validation', () => {
    const validationResult = formValidation(LogInSchema, validFormData);

    expect(validationResult).toEqual(
      expect.objectContaining({
        email: validFormData.email,
        password: validFormData.password,
      }),
    );
  });

  it('tests a failed log in validation', () => {
    const validationResult = formValidation(LogInSchema, emptyFormData);

    expect(validationResult).toEqual(
      expect.objectContaining({
        errors: [
          'Enter a valid email',
          'Password needs to be min. of 12 characters',
        ],
      }),
    );
  });


});
