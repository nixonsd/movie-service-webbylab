import { z } from 'zod';

export const CreateMovieSchema = z.object({
  title: z.string().min(1).max(255),
  year: z.number().int().min(1888).max(new Date().getFullYear()),
  format: z.enum(['VHS', 'DVD', 'Blu-Ray']),
  actors: z.array(z.string().min(1).max(100)).min(1),
});
