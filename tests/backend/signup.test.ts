// Initialize the findOne() db function first so tests
// can manipulate its return value later on
const mockedFindOne = vi.fn();

// Mocking the DB import from signUpMiddleware
vi.mock('../../backend/db.ts', () => ({
  getDb: async () => ({
    collection: (col: string) => ({
      findOne: mockedFindOne,
      insertOne: async (obj: {
        username: string;
        email: string;
        password: string;
      }) => {},
    }),
  }),
}));

import { formValidation, mockFormData } from '../../backend/lib/utils.ts';
import { describe, expect, it, Mock, vi } from 'vitest';
import { signUpController } from '../../backend/controllers/multiplayerController.ts';
import { SignUpSchema } from '../../backend/lib/schemas.ts';
import { ObjectId } from 'mongodb';

describe('Sign up logic', async () => {
  // Mocking different form data
  const validFormData = mockFormData(
    'iamtest@email.com',
    'test12345678#',
    'test12345678#',
  );
  const invalidEmail = mockFormData(
    'iamtest',
    'test12345678#',
    'test12345678#',
  );
  const shortPassword = mockFormData(
    'iamtest@email.com',
    'test1234',
    'test1234',
  );
  const passwordMismatch = mockFormData(
    'iamtest@email.com',
    'test12345678#',
    'test12345678',
  );
  const passwordWeak = mockFormData(
    'iamtest@email.com',
    'iamaweakpass',
    'iamaweakpass',
  );

  // • If SignUpSchema gets changed/updated later on, this test will fail
  // • Prevents invalid input slipping through to the database
  // • Essentially, this test builds up trust that this function always returns the correct structure
  it('validates sign up entries successfuly', () => {
    const validationResult = formValidation(SignUpSchema, validFormData);

    // Expects valid data from the the validation result
    expect(validationResult).toEqual(
      expect.objectContaining({
        email: expect.any(String),
        password: expect.any(String),
      }),
    );
  });

  // • Confirms if the controller sends a 200 status code and a correct JSON response
  // • If the middleware flow gets updated later on, this test will catch it
  // • Ensures json() is being chained correctly with status()
  it('tests the controller sending a successful response', async () => {
    const req: any = { body: validFormData };
    const res: any = {
      status: vi.fn().mockReturnThis(), // Since we expect status() to chain json(), like status().json()
      json: vi.fn(),
    };

    mockedFindOne.mockResolvedValueOnce(null);
    await signUpController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('tests controller sending a 400 response due to failed validation', async () => {
    const req: any = { body: invalidEmail };
    const res: any = {
      status: vi.fn().mockReturnThis(), // Since we expect status() to chain json(), like status().json()
      json: vi.fn(),
    };

    await signUpController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: ['Enter a valid email'] });
  });

  it('tests controller sending a 400 response due to duplicate email', async () => {
    const req: any = { body: validFormData };
    const res: any = {
      status: vi.fn().mockReturnThis(), // Since we expect status() to chain json(), like status().json()
      json: vi.fn(),
    };

    // Finding an existing document for the current email (duplicate email)
    mockedFindOne.mockResolvedValueOnce({
      email: 'existing@email.com',
      username: 'existing_999',
      password: 'akhb712yy12i491',
      _uid: new ObjectId('6978f912de1813b37408622c'),
    });
    await signUpController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['This email is already being used'],
    });
  });

  // • If the email validation config gets changed, this test will catch it
  it('tests a failed email validation', () => {
    const validationResult = formValidation(SignUpSchema, invalidEmail);

    expect(validationResult).toEqual(
      expect.objectContaining({ errors: ['Enter a valid email'] }),
    );
  });

  // • Tests if the password maintains the current short constraint
  // • If this validation gets updated in the future, this test will catch it
  it('tests a short password validation', () => {
    const validationResult = formValidation(SignUpSchema, shortPassword);

    expect(validationResult).toEqual(
      expect.objectContaining({
        errors: ['Password needs to be min. of 12 characters'],
      }),
    );
  });

  // • Will catch if the mismatch validation corresponds with the standards
  // • If this validation gets updated in the future, this test will catch it
  it('tests password mismatch validation', () => {
    const validationResult = formValidation(SignUpSchema, passwordMismatch);

    expect(validationResult).toEqual(
      expect.objectContaining({ errors: ["Passwords don't match"] }),
    );
  });

  // • Checks if the password strength requirement asks for one uppercase letter, one lowercase
  //   letter, one number and one special char.
  // • If this validation gets updated in the future, this test will catch it
  it('tests the password strength', () => {
    const validationResult = formValidation(SignUpSchema, passwordWeak);

    expect(validationResult).toEqual(
      expect.objectContaining({
        errors: [
          'Min. eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
        ],
      }),
    );
  });
});
