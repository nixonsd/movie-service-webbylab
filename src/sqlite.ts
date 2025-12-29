import fs from 'node:fs';
import path from 'node:path';

import { Sequelize } from 'sequelize';

import { config } from './config';
import { logger } from './shared/logger';
import { initUserModel } from './v1/users/infrastructure/models/user.model';
import { initMovieModel } from './v1/movies/infrastructure/models/movie.model';

export class SqliteDatabase {
  private static _instance: Sequelize | null = null;

  public static get instance(): Sequelize {
    if (!this._instance) {
      throw new Error('SqliteDatabase is not initialized. Call init() first.');
    }
    return this._instance;
  }

  public static async init(): Promise<void> {
    if (this._instance) {
      logger.info('[SqliteDatabase] Already initialized');
      return;
    }

    if (config.db.storage !== ':memory:') {
      const dir = path.dirname(config.db.storage);
      fs.mkdirSync(dir, { recursive: true });
    }

    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: config.db.storage,
      logging: config.db.logging ?? false,
    });

    try {
      initUserModel(sequelize);
      initMovieModel(sequelize);

      await sequelize.authenticate();
      // in a real app, consider using migrations instead of sync({ alter: true })
      await sequelize.sync({ alter: true });

      this._instance = sequelize;
      logger.info('[SqliteDatabase] Connected to SQLite');
    } catch (error) {
      logger.error(`[SqliteDatabase] Failed to connect to SQLite: ${String(error)}`);
      throw error;
    }
  }
}
