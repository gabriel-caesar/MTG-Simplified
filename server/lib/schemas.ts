import z from 'zod';

const PASS_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const SignUpSchema = z.object({
  email: z.email({ message: 'Enter a valid email' }),
  password: z
    .string()
    .min(12, { message: 'Password needs to be min. of 12 characters' })
    .regex(PASS_REGEX, {
      message: 'Min. eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    }),
  confirm_password: z.string()
}).refine(data => data.password === data.confirm_password, {
  message: `Passwords don't match`,
  path: ['confirm_password']
});

// The message is unique to increase security
export const LogInSchema = z.object({
  email: z.email({ message: 'Enter a valid email' }),
  password: z.string().min(12, { message: 'Password needs to be min. of 12 characters' }),
})