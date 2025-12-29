import { z } from 'zod';

export const GetMoviesSchema = z.object({
  title: z.string().trim().min(1).optional(),
  actor: z.string().trim().min(1).optional(),
  search: z.string().trim().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),

  sort: z.enum(['id', 'title', 'year']).default('id'),
  order: z.enum(['ASC', 'DESC']).default('ASC'),
});

export type GetMoviesQuery = z.infer<typeof GetMoviesSchema>;
