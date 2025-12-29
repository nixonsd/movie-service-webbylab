import z from 'zod';

export const MovieByIdParamsSchema = z.object({
  id: z.coerce.number(),
});

export type MovieByIdParams = z.infer<typeof MovieByIdParamsSchema>;
