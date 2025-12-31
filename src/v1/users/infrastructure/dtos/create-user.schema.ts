import z from 'zod';

export const CreateUserSchema = z
  .object({
    name: z.string().trim().min(3).max(30),
    email: z.email(),
    password: z.string().trim().min(6).max(100),
    confirmPassword: z.string().trim().min(6).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type CreateUserDTO = Omit<z.infer<typeof CreateUserSchema>, 'confirmPassword'>;
