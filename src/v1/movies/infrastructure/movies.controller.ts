import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { Router } from 'express';
import validate from 'express-zod-safe';

import { MoviesRepository } from './repositories/movies.repositories';
import { sendApi } from '../../../shared/helpers/send-api.helper';
import { BadRequestError, NotFoundError } from '../../../shared/errors/app-error';

import { GetMoviesQuery, GetMoviesSchema } from './dtos/get-movies.schema';
import { CreateMovieSchema } from './dtos/create-movies.schema';
import { UpdateMovieSchema } from './dtos/update-movie.schema';
import { MovieByIdParams, MovieByIdParamsSchema } from './dtos/movie-by-id-params.schema';

import { ImportMoviesUseCase } from '../application/use-cases/import-moves.use-case';
import { CreateMovieUseCase } from '../application/use-cases/create-movie.use-case';
import { FindMoviesUseCase } from '../application/use-cases/find-movie.use-case';
import { FindMovieByIdUseCase } from '../application/use-cases/find-movie-by-id.use-case';
import { DeleteMovieUseCase } from '../application/use-cases/delete-movie.use-case';
import { UpdateMovieUseCase } from '../application/use-cases/update-movie.use-case';

const uploadsDir = path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({ dest: uploadsDir });

export function createMoviesController() {
  const router = Router();

  const moviesRepository = new MoviesRepository();
  const findMovieById = new FindMovieByIdUseCase(moviesRepository);
  const findMovies = new FindMoviesUseCase(moviesRepository);
  const createMovie = new CreateMovieUseCase(moviesRepository);
  const updateMovie = new UpdateMovieUseCase(moviesRepository);
  const deleteMovie = new DeleteMovieUseCase(moviesRepository);
  const importMovies = new ImportMoviesUseCase(moviesRepository);

  router.get('/:id', validate({ params: MovieByIdParamsSchema }), async (req, res) => {
    const { id } = req.params as MovieByIdParams;

    const movie = await findMovieById.execute(id.toString());
    if (!movie) throw new NotFoundError('Movie not found');

    sendApi(res, 200, { data: movie });
  });

  router.get('/', validate({ query: GetMoviesSchema }), async (req, res) => {
    const q = req.query as GetMoviesQuery;

    const movies = await findMovies.execute(
      { title: q.title, actor: q.actor, search: q.search },
      { limit: q.limit, offset: q.offset, sort: q.sort, order: q.order }
    );

    sendApi(res, 200, { data: movies });
  });

  router.post('/', validate({ body: CreateMovieSchema }), async (req, res) => {
    const movie = await createMovie.execute(req.body);
    sendApi(res, 201, { data: movie });
  });

  router.post('/import', upload.single('movies'), async (req, res) => {
    if (!req.file) throw new BadRequestError('Movies file is required');

    // basic file type check
    if (!req.file.originalname.toLowerCase().endsWith('.txt')) {
      fs.unlink(req.file.path, () => {});
      throw new BadRequestError('Invalid file type. Only .txt files are allowed');
    }

    try {
      const createdMovies = await importMovies.execute(req.file.path);
      sendApi(res, 200, { data: createdMovies });
    } finally {
      // always cleanup uploaded file
      fs.unlink(req.file.path, () => {});
    }
  });

  router.patch('/:id', validate({ params: MovieByIdParamsSchema, body: UpdateMovieSchema }), async (req, res) => {
    const { id } = req.params as MovieByIdParams;
    await updateMovie.execute(id.toString(), req.body);
    sendApi(res, 200);
  });

  router.delete('/:id', validate({ params: MovieByIdParamsSchema }), async (req, res) => {
    const { id } = req.params as MovieByIdParams;
    await deleteMovie.execute(id.toString());
    sendApi(res, 200);
  });

  return router;
}

export const moviesController = createMoviesController();
