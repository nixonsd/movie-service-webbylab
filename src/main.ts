import express from 'express';
import { logger } from './shared/logger';
import { errorHandler } from './shared/middlewares/error-handler.middleware';
import { apiV1Controller } from './v1/api.controller';
import { SqliteDatabase } from './sqlite';
import { setGlobalErrorHandler } from 'express-zod-safe';

SqliteDatabase.init();

setGlobalErrorHandler((errors, _req, res) => {
  res.status(400).json({
    status: 0,
    error: {
      code: 'VALIDATION_ERROR',
    },
  });
});

const app = express();

app.use(express.json());

app.use('/api/v1', apiV1Controller);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
