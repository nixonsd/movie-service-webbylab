import { Op, Order, UniqueConstraintError, WhereOptions } from 'sequelize';
import { CreateMovieInput } from '../../domain/entities/create-movie.input';
import { FindMoviesFilter } from '../../domain/entities/find-movie.filter';
import { Movie } from '../../domain/entities/movie';
import { AbstractMoviesRepository } from '../../domain/repositories/movies.repository';
import { MovieModel } from '../models/movie.model';
import { FindManyOptions } from '../../domain/entities/find-many.options';
import { ConflictError } from '../../../../shared/errors/app-error';

type MovieRow = {
  id: string;
  title: string;
  year: number;
  format: string;
  actors: string; // stored as JSON string
};

export class MoviesRepository implements AbstractMoviesRepository {
  async create(input: CreateMovieInput): Promise<Movie> {
    try {
      const created = await MovieModel.create({
        title: input.title,
        year: input.year,
        format: input.format,
        actors: JSON.stringify(input.actors),
      });

      return this.toDomain(created.get({ plain: true }) as MovieRow);
    } catch (e) {
      if (e instanceof UniqueConstraintError) {
        throw new ConflictError('Movie already exists', 'MOVIE_ALREADY_EXISTS');
      }
      throw e;
    }
  }

  async findManyByFilter(filter: FindMoviesFilter = {}, options: FindManyOptions = {}): Promise<Movie[]> {
    const and: WhereOptions[] = [];

    if (filter.title?.trim()) {
      const q = filter.title.trim();
      and.push({ title: { [Op.like]: `%${q}%` } });
    }

    if (filter.actor?.trim()) {
      const q = filter.actor.trim();
      and.push({ actors: { [Op.like]: `%${q}%` } });
    }

    // general search: matches title OR actors
    if (filter.search?.trim()) {
      const q = filter.search.trim();
      and.push({
        [Op.or]: [{ title: { [Op.like]: `%${q}%` } }, { actors: { [Op.like]: `%${q}%` } }],
      } as WhereOptions);
    }

    const where: WhereOptions = and.length ? ({ [Op.and]: and } as WhereOptions) : {};

    const sortField = options.sort === 'title' ? 'title' : options.sort === 'year' ? 'year' : 'id';
    const sortDir = (options.order ?? 'ASC') as 'ASC' | 'DESC';

    const order: Order =
      sortField === 'title'
        ? [
            ['titleSort', sortDir],
            ['id', 'ASC'],
          ]
        : [[sortField, sortDir]];

    const rows = await MovieModel.findAll({
      where,
      attributes: ['id', 'title', 'year', 'format', 'actors'],
      raw: true,
      order,
      limit: options.limit ?? 20,
      offset: options.offset ?? 0,
    });

    return (rows as MovieRow[]).map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<Movie | null> {
    const row = await MovieModel.findByPk(id, {
      attributes: ['id', 'title', 'year', 'format', 'actors'],
      raw: true,
    });

    return row ? this.toDomain(row as MovieRow) : null;
  }

  async update(
    id: string,
    input: Partial<{ title: string; year: number; format: string; actors: string[] }>
  ): Promise<Movie> {
    const updateData = {
      title: input.title,
      year: input.year,
      format: input.format,
      actors: input.actors ? JSON.stringify(input.actors) : undefined,
    };

    await MovieModel.update(updateData, { where: { id } });

    const updatedRow = await MovieModel.findByPk(id, {
      attributes: ['id', 'title', 'year', 'format', 'actors'],
      raw: true,
    });

    if (!updatedRow) {
      throw new Error('Failed to retrieve updated movie');
    }

    return this.toDomain(updatedRow as MovieRow);
  }

  async delete(id: string): Promise<void> {
    await MovieModel.destroy({ where: { id } });
  }

  private toDomain(row: MovieRow): Movie {
    return {
      id: row.id,
      title: row.title,
      year: row.year,
      format: row.format,
      actors: JSON.parse(row.actors || '[]') as string[],
    };
  }
}
