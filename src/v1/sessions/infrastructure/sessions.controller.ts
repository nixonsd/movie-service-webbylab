import { Router } from 'express';
import validate from 'express-zod-safe';

import { UsersRepository } from '../../users/infrastructure/repositories/users.repository';
import { VerifyUserByEmailUseCases } from '../../users/application/use-cases/verify-user-by-email.use-case';

import { config } from '../../../config';
import { sendApi } from '../../../shared/helpers/send-api.helper';
import { UnauthorizedError } from '../../../shared/errors/app-error';

import { LoginSchema, LoginDTO } from './dtos/login.schema';
import { JwtTokenIssuer } from '../../../authorize/infrastructure/jwt-token-issuer';
import { IssueAccessTokenUseCase } from '../../../authorize/application/use-cases/issue-access-token.use-case';

export function createSessionsController() {
  const router = Router();

  const usersRepository = new UsersRepository();
  const verifyUserByEmail = new VerifyUserByEmailUseCases(usersRepository);

  const tokenIssuer = new JwtTokenIssuer(config.api.accessTokenSecret ?? 'dev-secret', '1h');
  const issueAccessToken = new IssueAccessTokenUseCase(tokenIssuer);

  router.post('/', validate({ body: LoginSchema }), async (req, res) => {
    const { email, password } = req.body as LoginDTO;

    const user = await verifyUserByEmail.execute(email, password);
    if (!user) throw new UnauthorizedError('Invalid email or password');

    const token = await issueAccessToken.execute({ id: user.id, email: user.email });

    sendApi(res, 200, { token });
  });

  return router;
}

export const sessionsController = createSessionsController();
