import { CreateMovieInput } from '../domain/entities/create-movie.input';

export function parseMoviesTxt(text: string): CreateMovieInput[] {
  const blocks = text
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const movies: CreateMovieInput[] = [];

  for (const block of blocks) {
    const lines = block
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const getValue = (key: string) => {
      const line = lines.find((l) => l.toLowerCase().startsWith(key.toLowerCase() + ':'));
      return line ? line.slice(line.indexOf(':') + 1).trim() : '';
    };

    const title = getValue('Title');
    const yearRaw = getValue('Release Year');
    const format = getValue('Format');
    const actorsRaw = getValue('Stars');

    const year = Number(yearRaw.replace(/[^\d]/g, '')); // handles trailing spaces
    const actors = actorsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (!title || !Number.isFinite(year) || !format) continue;

    movies.push({ title, year, format, actors });
  }

  return movies;
}
