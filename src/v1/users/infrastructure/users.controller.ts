import { Router } from 'express';
import validate from 'express-zod-safe';

import { sendApi } from '../../../shared/helpers/send-api.helper';
import { config } from '../../../config';

import { CreateUserSchema, CreateUserDTO } from './dtos/create-user.schema';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';

import { JwtTokenIssuer } from '../../../authorize/infrastructure/jwt-token-issuer';
import { IssueAccessTokenUseCase } from '../../../authorize/application/use-cases/issue-access-token.use-case';

export function createUsersController() {
  const router = Router();

  const usersRepository = new UsersRepository();
  const createUser = new CreateUserUseCase(usersRepository);

  const tokenIssuer = new JwtTokenIssuer(config.api.accessTokenSecret ?? 'dev-secret', '1h');
  const issueAccessToken = new IssueAccessTokenUseCase(tokenIssuer);

  router.post('/', validate({ body: CreateUserSchema }), async (req, res) => {
    const { name, email, password } = req.body as CreateUserDTO;

    const user = await createUser.execute({ name, email, password });

    const token = await issueAccessToken.execute({ id: user.id, email: user.email });

    sendApi(res, 201, { token });
  });

  return router;
}

export const usersController = createUsersController();
