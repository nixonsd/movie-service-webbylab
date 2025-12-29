import { AbstractMoviesRepository } from '../../domain/repositories/movies.repository';
import { Movie } from '../../domain/entities/movie';
import { FindMoviesFilter } from '../../domain/entities/find-movie.filter';
import { FindManyOptions } from '../../domain/entities/find-many.options';

export class FindMoviesUseCase {
  constructor(private readonly moviesRepository: AbstractMoviesRepository) {}

  async execute(filter: FindMoviesFilter, options?: FindManyOptions): Promise<Movie[]> {
    return this.moviesRepository.findManyByFilter(filter, options);
  }
}
