import { CreateMovieInput } from '../../domain/entities/create-movie.input';
import { MoviesRepository } from '../../infrastructure/repositories/movies.repositories';

export class CreateMovieUseCase {
  constructor(private readonly moviesRepository: MoviesRepository) {}

  async execute(input: CreateMovieInput): Promise<void> {
    await this.moviesRepository.create(input);
  }
}
