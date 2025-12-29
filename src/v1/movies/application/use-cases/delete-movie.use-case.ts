import { NotFoundError } from '../../../../shared/errors/app-error';
import { AbstractMoviesRepository } from '../../domain/repositories/movies.repository';
export class DeleteMovieUseCase {
  constructor(private moviesRepository: AbstractMoviesRepository) {}

  async execute(id: string): Promise<void> {
    const movie = await this.moviesRepository.findById(id);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }
    await this.moviesRepository.delete(id);
  }
}
