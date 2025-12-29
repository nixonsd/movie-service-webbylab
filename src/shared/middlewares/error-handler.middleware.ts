import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { logger } from '../logger';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 0,
      error: {
        code: err.code,
      },
    });
    return;
  }

  if (err instanceof Error) {
    logger.error(err);
  }

  res.status(500).json({
    status: 0,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
}
