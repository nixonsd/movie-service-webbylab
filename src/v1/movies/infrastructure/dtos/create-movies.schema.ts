import { z } from 'zod';

const actorNameRegex = /^[A-Za-z.,\- ]+$/;

export const CreateMovieSchema = z.object({
  title: z.string().trim().min(1).max(255),
  year: z.number().int().min(1888).max(new Date().getFullYear()),
  format: z.enum(['VHS', 'DVD', 'Blu-Ray']),
  actors: z
    .array(
      z
        .string()
        .trim()
        .min(3)
        .max(100)
        .regex(actorNameRegex, 'Actor name may contain only letters, spaces, and characters: - , .')
    )
    .min(1),
});
