import { promises as fs } from 'node:fs';
import { parseMoviesTxt } from '../../infrastructure/movies.parser';
import { AbstractMoviesRepository } from '../../domain/repositories/movies.repository';
import { Movie } from '../../domain/entities/movie';

export class ImportMoviesUseCase {
  constructor(private readonly moviesRepository: AbstractMoviesRepository) {}

  async execute(filePath: string): Promise<Movie[]> {
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const movies = parseMoviesTxt(fileContent);

    if (movies.length === 0) {
      return [];
    }

    const createdMovies: Movie[] = [];
    for (const movie of movies) {
      const createdMovie = await this.moviesRepository.create(movie);
      createdMovies.push(createdMovie);
    }

    return createdMovies;
  }
}
