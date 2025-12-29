import { Router } from 'express';
import { config } from '../config';
import { usersController } from './users/infrastructure/users.controller';
import { sessionsController } from './sessions/infrastructure/sessions.controller';
import { moviesController } from './movies/infrastructure/movies.controller';
import { JwtTokenVerifier } from '../authorize/infrastructure/jwt-token-verifier';
import { AuthorizeUseCase } from '../authorize/application/use-cases/authorize.use-case';
import { authorizeMiddleware } from '../authorize/infrastructure/middlewares/authorize.middleware';

const router = Router();

const secret = config.api.accessTokenSecret ?? 'default_secret';
const verifier = new JwtTokenVerifier(secret);
const authorize = new AuthorizeUseCase(verifier);

router.use('/users', usersController);
router.use('/sessions', sessionsController);
router.use('/movies', authorizeMiddleware(authorize), moviesController);

export const apiV1Controller = router;
