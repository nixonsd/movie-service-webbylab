import z from 'zod';
import { hasMxRecord } from '../../../../shared/helpers/mx-check.helper';

export const CreateUserSchema = z
  .object({
    name: z.string().trim().min(3).max(30),
    email: z.email().refine(async (email) => hasMxRecord(email), {
      message: 'Email domain has no MX records',
    }),
    password: z.string().trim().min(6).max(100),
    confirmPassword: z.string().trim().min(6).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type CreateUserDTO = Omit<z.infer<typeof CreateUserSchema>, 'confirmPassword'>;
