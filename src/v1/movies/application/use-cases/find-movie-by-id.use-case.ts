import { AbstractMoviesRepository } from '../../domain/repositories/movies.repository';

export class FindMovieByIdUseCase {
  constructor(private readonly moviesRepository: AbstractMoviesRepository) {}

  async execute(id: string) {
    const movie = await this.moviesRepository.findById(id);
    return movie;
  }
}
