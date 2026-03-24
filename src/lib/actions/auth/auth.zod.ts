import z from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email({
    error: 'Please enter a valid email',
  }).trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .regex(/[A-Z]/, { error: 'Contain at least one uppercase letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim(),
});
