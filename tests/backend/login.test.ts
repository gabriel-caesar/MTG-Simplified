import { compare } from 'bcryptjs';

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

// Mocks bcryptjs.compare called in the log in controller
vi.mock('bcryptjs', () => ({ compare: vi.fn() }));

import { formValidation, mockFormData } from '../../backend/lib/utils';
import { describe, expect, it, Mock, vi } from 'vitest';
import { LogInSchema } from '../../backend/lib/schemas';
import { logInController } from '../../backend/controllers/multiplayerController';

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

  it('tests the controller sending a successful response', async () => {
    const req: any = { body: validFormData };
    const res: any = {
      status: vi.fn().mockReturnThis(), // Since we expect status() to chain json(), like status().json()
      json: vi.fn(),
    };

    // Mocking bcryptjs hashing comparison to return true (valid auth)
    (compare as Mock).mockResolvedValueOnce(true);
    await logInController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('tests controller sending a 401 response due to failed authentication', async () => {
    const req: any = { body: validFormData };
    const res: any = {
      status: vi.fn().mockReturnThis(), // Since we expect status() to chain json(), like status().json()
      json: vi.fn(),
    };

    // Mocking bcryptjs hashing comparison to return false (failed auth)
    (compare as Mock).mockResolvedValueOnce(false);
    await logInController(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ errors: ['Invalid credentials'] });
  });

  it('tests controller sending a 400 response due to failed validation', async () => {
    const req: any = { body: emptyFormData };
    const res: any = {
      status: vi.fn().mockReturnThis(), // Since we expect status() to chain json(), like status().json()
      json: vi.fn(),
    };

    await logInController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        'Enter a valid email',
        'Password needs to be min. of 12 characters',
      ],
    });
  });
});
