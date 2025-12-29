import { NotFoundError } from '../../../../shared/errors/app-error';
import { AbstractMoviesRepository } from '../../domain/repositories/movies.repository';

export class UpdateMovieUseCase {
  constructor(private readonly moviesRepository: AbstractMoviesRepository) {}

  async execute(
    id: string,
    updateData: Partial<{ title: string; year: number; format: string; actors: string[] }>
  ): Promise<void> {
    const movie = await this.moviesRepository.findById(id);
    if (!movie) {
      throw new NotFoundError('Movie not found');
    }

    const updatedMovie = { ...movie, ...updateData };
    await this.moviesRepository.update(id, updatedMovie);
  }
}
