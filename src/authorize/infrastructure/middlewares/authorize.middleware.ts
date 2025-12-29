import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../shared/errors/app-error';
import { AuthorizeUseCase } from '../../../authorize/application/use-cases/authorize.use-case';

function extractToken(req: Request): string {
  const header = req.header('Authorization');
  if (!header) throw new UnauthorizedError('Authorization token missing');

  return header.trim();
}

export function authorizeMiddleware(authorizeUseCase: AuthorizeUseCase) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = extractToken(req);
      req.user = await authorizeUseCase.execute(token);
      next();
    } catch (e) {
      next(e);
    }
  };
}
