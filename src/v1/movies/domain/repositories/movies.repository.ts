import { CreateMovieInput } from '../entities/create-movie.input';
import { FindManyOptions } from '../entities/find-many.options';
import { FindMoviesFilter } from '../entities/find-movie.filter';
import { Movie } from '../entities/movie';

export interface AbstractMoviesRepository {
  create(input: CreateMovieInput): Promise<Movie>;
  findManyByFilter(filter: FindMoviesFilter, options?: FindManyOptions): Promise<Movie[]>;
  findById(id: string): Promise<Movie | null>;
  update(id: string, input: Partial<{ title: string; year: number; format: string; actors: string[] }>): Promise<Movie>;
  delete(id: string): Promise<void>;
}
