import { NotFoundError } from '../../../../shared/errors/app-error';
import { MoviesRepository } from '../../infrastructure/repositories/movies.repositories';

export class DeleteMovieUseCase {
  constructor(private moviesRepository: MoviesRepository) {}

  async execute(id: string): Promise<void> {
    const movie = await this.moviesRepository.findById(id);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }
    await this.moviesRepository.delete(id);
  }
}
