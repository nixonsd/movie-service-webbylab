import { CreateMovieInput } from '../../domain/entities/create-movie.input';
import { Movie } from '../../domain/entities/movie';
import { AbstractMoviesRepository } from '../../domain/repositories/movies.repository';
export class CreateMovieUseCase {
  constructor(private readonly moviesRepository: AbstractMoviesRepository) {}

  async execute(input: CreateMovieInput): Promise<Movie> {
    return this.moviesRepository.create(input);
  }
}
